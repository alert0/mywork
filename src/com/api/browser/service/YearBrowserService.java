package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 年份
 * @author jhy Mar 29, 2017
 *
 */
public class YearBrowserService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		// TODO Auto-generated method stub
		Map<String,Object> apidatas = new HashMap<String,Object>();
		User user = (User) params.get("user");

		String backfields = " yearId,yearName ";
		String fromSQL = " from Workflow_FieldYear a";
		String tableString = "<table pageId=\"pageId\" pagesize=\"10\" tabletype=\"none\">"+
								"<sql backfields=\""+backfields+"\" showCountColumn=\"false\" sqlform=\""+Util.toHtmlForSplitPage(fromSQL)+"\" sqlwhere=\"\" sqlprimarykey=\"yearId\" sqlsortway=\"asc\" />"+
								"<head>"+
									 "<col width=\"100%\" text=\""+SystemEnv.getHtmlLabelName(15933,user.getLanguage())+"\" column=\"yearName\"  orderkey=\"yearName\" />"+
								"</head>"+
							"</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
