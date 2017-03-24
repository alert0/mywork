package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;

import com.api.workflow.util.PageUidFactory;
import com.cloudstore.dev.api.util.Util_TableMap;

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
		// String sqlstr = "select  from HrmRoles "
		// + sqlwhere
		// + " order by rolesmark";

		// 暂时先写死sql语句，后期拓展
		String pageUid =PageUidFactory.getBrowserUID("rolelist"); 

		String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\""
				+ pageUid
				+ "\">"
				+ "<sql backfields=\""
				+ "id,rolesname,rolesmark"// backfields
				+ "\" sqlform=\""
				+ Util.toHtmlForSplitPage("HrmRoles")
				+ "\" sqlwhere=\""
				+ sqlwhere
				+ "\"  sqlorderby=\""
				+ "rolesmark"
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"asc\"/>"
				+ "<head>"
				+ "   <col width=\"0%\"  text=\""
				+ "id"
				+ "\" display=\"false\" orderkey=\"id\" column=\"id\"/>"
				+ "   <col width=\"40%\"  text=\""
				+ "角色名称"
				+ "\" display=\"true\" orderkey=\"rolesmark\" column=\"rolesmark\"/>"
				+ "   <col width=\"60%\"  text=\""
				+ "说明"
				+ "\" display=\"true\" orderkey=\"rolesname\" column=\"rolesname\"/>"
				+ "</head>" + "</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
