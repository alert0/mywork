package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;

/**
 * 单网上调查
 * @author jhy Mar 28, 2017
 *
 */
public class VotingInfoBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		
		String fullname = Util.null2String(params.get("fullname"));
		String sqlwhere = " where (status=1 or status=2) ";

		if(!fullname.equals("")){
			sqlwhere += " and subject like '%";
			sqlwhere += Util.fromScreen2(fullname,user.getLanguage());
			sqlwhere += "%'";
		}
		
		String backfields = " id,subject ";
		String fromSql = "voting"; 
		String orderby  = " createdate , createtime ";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("30%",SystemEnv.getHtmlLabelName(84, user.getLanguage()),"id",""));
		cols.add(new SplitTableColBean("70%",SystemEnv.getHtmlLabelName(24096, user.getLanguage()),"subject","subject"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,orderby,"id",cols);
		tableBean.setSqlisdistinct("true");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
