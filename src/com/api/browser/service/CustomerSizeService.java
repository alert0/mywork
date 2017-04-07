package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;

import com.api.workflow.util.PageUidFactory;
import com.cloudstore.dev.api.util.Util_TableMap;
/**
 *  获取客户规模列表
 * @author jhy Mar 27, 2017
 *
 */
public class CustomerSizeService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {

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
		String pageUid = PageUidFactory.getBrowserUID("customersizelist");
		String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\""
				+ pageUid
				+ "\">"
				+ "<sql backfields=\""
				+ "id,fullname,description"// backfields
				+ "\" sqlform=\""
				+ Util.toHtmlForSplitPage("CRM_CustomerSize")
				+ "\" sqlwhere=\""
				+ sqlwhere
				+ "\"  sqlorderby=\""
				+ "id"
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>"
				+ "<head>"
				+ "   <col width=\"0%\"  text=\""
				+ "id"
				+ "\" orderkey=\"id\" column=\"id\"/>"
				+ "   <col width=\"35%\"  text=\""
				+ "简称"
				+ "\" display=\"true\" orderkey=\"fullname\" column=\"fullname\"/>"
				+ "   <col width=\"55%\"  text=\""
				+ "描述"
				+ "\" display=\"true\" orderkey=\"description\" column=\"description\"/>"
				+ "</head>" + "</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
