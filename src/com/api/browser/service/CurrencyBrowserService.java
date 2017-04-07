package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 币种
 * 
 * @author jhy Mar 29, 2017
 * 
 */
public class CurrencyBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String currencyname = Util.null2String(params.get("currencyname"));
		String currencydesc = Util.null2String(params.get("currencydesc"));
		String sqlwhere = " where activable = '1' ";
		if (!currencyname.equals("")) {
			sqlwhere += " and currencyname like '%" + Util.fromScreen2(currencyname, 7) + "%' ";
		}
		if (!currencydesc.equals("")) {
			sqlwhere += " and currencydesc like '%" + Util.fromScreen2(currencydesc, 7) + "%' ";
		}
		
		String backfields = " id,currencyname,currencydesc ";
		String fromSql = " FnaCurrency  ";
		String tableString =" <table id='BrowseTable' instanceid='BrowseTable' tabletype='none' pagesize=\"10\">"+ 
							" <sql backfields=\""+backfields+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" sqlwhere=\""+sqlwhere+"\"  sqlorderby=\"\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>"+
							"	<head>"+
							"		<col hide=\"true\" orderkey=\"id\" column=\"id\"/>"+ 
							"		<col width=\"50%\"  text=\""+ SystemEnv.getHtmlLabelName(195,user.getLanguage()) +"\" orderkey=\"currencyname\" column=\"currencyname\"/>"+ 
							"		<col width=\"50%\"  text=\""+ SystemEnv.getHtmlLabelName(433,user.getLanguage()) +"\" orderkey=\"currencydesc\" column=\"currencydesc\"/>"+ 
							"	</head>"+   			
							" </table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
