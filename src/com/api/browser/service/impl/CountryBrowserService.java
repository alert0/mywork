package com.api.browser.service.impl;

import java.util.HashMap;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;

import com.api.browser.service.BrowserService;
import com.api.workflow.util.PageUidFactory;
import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 国家
 * @author jhy Mar 24, 2017
 * 
 */
public class CountryBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {

		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		// String imagefilename = "/images/hdSystem_wev8.gif";
		// String titlename = SystemEnv.getHtmlLabelName(377,
		// user.getLanguage());
		// String needfav = "1";
		// String needhelp = "";

		String sqlwhere1 = Util.null2String(params.get("sqlwhere"));
		String countryname = Util.null2String(params.get("name"));
		String countrydesc = Util.null2String(params.get("countrydesc"));
		String sqlwhere = " ";
		int ishead = 0;
		if (!sqlwhere1.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += sqlwhere1;
			}
		}
		if (ishead == 1) {
			sqlwhere += " and (canceled is null or canceled = 0) ";
		} else {
			ishead = 1;
			sqlwhere += " where (canceled is null or canceled = 0) ";
		}
		if (!countryname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where countryname like '%";
				sqlwhere += Util.fromScreen2(countryname, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and countryname like '%";
				sqlwhere += Util.fromScreen2(countryname, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		if (!countrydesc.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where countrydesc like '%";
				sqlwhere += Util.fromScreen2(countrydesc, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and countrydesc like '%";
				sqlwhere += Util.fromScreen2(countrydesc, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		String pageUid = PageUidFactory.getBrowserUID("hrmcountrylist");

		String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\"" + pageUid
				+ "\">"
				+ "<sql backfields=\""
				+ "id,countryname,countrydesc"// backfields
				+ "\" sqlform=\"" + Util.toHtmlForSplitPage("HrmCountry") + "\" sqlwhere=\"" + sqlwhere + "\"  sqlorderby=\"" + "id" + "\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>" + "<head>"
				+ "   <col width=\"0%\"  text=\"" + "id" + "\" display=\"false\" orderkey=\"id\" column=\"id\"/>" + "   <col width=\"40%\"  text=\"" + "简称"
				+ "\" display=\"true\" orderkey=\"countryname\" column=\"countryname\"/>" + "   <col width=\"60%\"  text=\"" + "国家"
				+ "\" display=\"true\" orderkey=\"countrydesc\" column=\"countrydesc\"/>" + "</head>" + "</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
