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
 * @author jhy Mar 24, 2017
 *
 */
public class RoleBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {

		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		int ishead = 0;
		String rolesname = Util.null2String(params.get("name"));
		String rolesmark = Util
				.null2String(params.get("description"));
		String sqlwhere = Util.null2String(params.get("sqlwhere"));
		if (!sqlwhere.equals(""))
			ishead = 1;
		if (!rolesname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where rolesname like '%"
						+ Util.fromScreen2(rolesname, user.getLanguage())
						+ "%' ";
			} else
				sqlwhere += " and rolesname like '%"
						+ Util.fromScreen2(rolesname, user.getLanguage())
						+ "%' ";
		}
		if (!rolesmark.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where rolesmark like '%"
						+ Util.fromScreen2(rolesmark, user.getLanguage())
						+ "%' ";
			} else
				sqlwhere += " and rolesmark like '%"
						+ Util.fromScreen2(rolesmark, user.getLanguage())
						+ "%' ";
		}

		if (!rolesmark.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where rolesmark like '%"
						+ Util.fromScreen2(rolesmark, user.getLanguage())
						+ "%' ";
			} else
				sqlwhere += " and rolesmark like '%"
						+ Util.fromScreen2(rolesmark, user.getLanguage())
						+ "%' ";
		}
		
		String backfields = "id,rolesname,rolesmark";
		String fromSql = "HrmRoles";
		String orderby = "rolesmark";
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(15068, user.getLanguage()),"rolesmark","rolesmark"));
		cols.add(new SplitTableColBean("60%",SystemEnv.getHtmlLabelName(25734, user.getLanguage()),"rolesname","rolesname"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,orderby,"id",cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
