package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.bean.ListHeadBean;
import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;
import com.api.browser.util.SqlUtils;

/**
 * 学历
 * @author jhy Mar 29, 2017
 * 
 */
public class EduLevelBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String name = Util.null2String(params.get("name"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " ";
		if (!name.equals("")) {
			sqlwhere += " and name like '%";
			sqlwhere += Util.fromScreen2(name, 7);
			sqlwhere += "%'";
		}
		if (!description.equals("")) {
			sqlwhere += " and description like '%";
			sqlwhere += Util.fromScreen2(description, 7);
			sqlwhere += "%'";
		}
		
		String backfields = "id,name,description";
		String fromSql = "HrmEducationLevel";
		String orderby = "";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(195, user.getLanguage()),"name","name"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(433, user.getLanguage()),"description","description"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,orderby,"id",cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
