package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.workflow.util.PageUidFactory;
import com.cloudstore.dev.api.util.Util_TableMap;

public class WorkTypeService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {

		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String sqlwhere1 = Util.null2String(params.get("sqlwhere"));
		String fullname = Util.null2String(params.get("name"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " ";

		int ishead = 0;
		if (!sqlwhere1.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += sqlwhere1;
			}
		}
		if (!fullname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		if (!description.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		String pageUid = PageUidFactory.getBrowserUID("worktypeList");
		String orderby = " id ";
		String tableString = "";
		int perpage = 10;
		String backfields = " id,fullname,description";
		String fromSql = " Prj_WorkType ";

		tableString = " <table instanceid=\"BrowseTable\" pageUid=\""
				+ pageUid
				+ "\""
				+ " id=\"BrowseTable\" tabletype=\"none\" pagesize=\""
				+ perpage
				+ "\" >"
				+ "       <sql backfields=\""
				+ backfields
				+ "\" sqlform=\""
				+ fromSql
				+ "\" sqlwhere=\""
				+ Util.toHtmlForSplitPage(sqlwhere)
				+ "\"  sqlorderby=\""
				+ orderby
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"asc\" sqlisdistinct=\"true\" />"
				+ "       <head>"
				+ "           <col width=\"0%\" hide='true'  text=\""
				+ "ID"
				+ "\" column=\"id\"    />"
				+ "           <col width=\"25%\"  text=\""
				+ SystemEnv.getHtmlLabelNames("399", user.getLanguage())
				+ "\" column=\"fullname\" orderkey=\"fullname\"   />"
				+ "           <col width=\"50%\"  text=\""
				+ SystemEnv.getHtmlLabelNames("433", user.getLanguage())
				+ "\" column=\"description\" orderkey=\"description\"  />"
				+ "       </head>" + " </table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
