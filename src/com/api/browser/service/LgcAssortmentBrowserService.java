package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 产品类别
 * @author jhy Mar 29, 2017
 *
 */
public class LgcAssortmentBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String sqlwhere = " where subassortmentcount = 0 ";
		
		String backfields = " id,assortmentmark,assortmentname ";
		String fromSql = " LgcAssetAssortment  ";
		String tableString =" <table id='BrowseTable' instanceid='BrowseTable' tabletype='none' pagesize=\"10\">"+ 
							" <sql backfields=\""+backfields+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" sqlwhere=\""+sqlwhere+"\"  sqlorderby=\"\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>"+
							"	<head>"+
							"		<col hide=\"true\" orderkey=\"id\" column=\"id\"/>"+ 
							"		<col width=\"50%\"  text=\""+ SystemEnv.getHtmlLabelName(84,user.getLanguage()) +"\" orderkey=\"assortmentmark\" column=\"assortmentmark\"/>"+ 
							"		<col width=\"50%\"  text=\""+ SystemEnv.getHtmlLabelName(195,user.getLanguage()) +"\" orderkey=\"assortmentname\" column=\"assortmentname\"/>"+ 
							"	</head>"+   			
							" </table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
