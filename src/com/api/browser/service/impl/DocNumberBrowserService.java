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
import com.api.browser.util.SqlUtils;

/**
 * 发文字号
 * @author jhy Mar 28, 2017
 *
 */
public class DocNumberBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String name = Util.null2String(params.get("name"));
		String desc = Util.null2String(params.get("desc"));
		String sqlwhere = " ";
		if(!name.equals("")){
			sqlwhere += " and name like '%";
			sqlwhere += Util.fromScreen2(name,user.getLanguage());
			sqlwhere += "%'";
		}
		if(!desc.equals("")){
			sqlwhere += " and desc_n like '%";
			sqlwhere += Util.fromScreen2(desc,user.getLanguage());
			sqlwhere += "%'";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		String backfields = " id,name,desc_n ";
		String fromSql = "DocSendDocNumber";
		String orderby = " showOrder ";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(84, user.getLanguage()),"id","id"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(399, user.getLanguage()),"name","name"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(433, user.getLanguage()),"desc_n","desc_n"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,orderby,"t1.id",cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}

}
