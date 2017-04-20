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
 * 称呼
 * 
 * @author jhy Apr 5, 2017
 * 
 */
public class ContacterTitleBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String fullname = Util.null2String(params.get("fullname"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " ";
		if (!fullname.equals("")) {
			sqlwhere += " and fullname like '%";
			sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!description.equals("")) {
			sqlwhere += " and description like '%";
			sqlwhere += Util.fromScreen2(description, user.getLanguage());
			sqlwhere += "%'";
		}
		sqlwhere = SqlUtils.replaceFirstAnd(sqlwhere);
			
		String backfields = " id,fullname,description ";
		String fromSql  = "CRM_ContacterTitle";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(84, user.getLanguage()),"id","id"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(399, user.getLanguage()),"fullname","fullname"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(433, user.getLanguage()),"description","description"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,"","id",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
