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
 * 
 * @author jhy Apr 5, 2017
 * 
 */
public class UseKindBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String name = Util.null2String(params.get("name"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " ";
		if (!name.equals("")) {
			sqlwhere += " and name like '%";
			sqlwhere += Util.fromScreen2(name, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!description.equals("")) {
			sqlwhere += " and description like '%";
			sqlwhere += Util.fromScreen2(description, user.getLanguage());
			sqlwhere += "%'";
		}
		String backFields =" id ,name,description ";
		String fromSql = " HrmUseKind ";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("50%",SystemEnv.getHtmlLabelName(195, user.getLanguage()),"unitname","unitname"));
		cols.add(new SplitTableColBean("50%",SystemEnv.getHtmlLabelName(85, user.getLanguage()),"unitdesc","unitdesc"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backFields,fromSql,sqlwhere,"","id",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}

}
