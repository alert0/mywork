package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;
/**
 * 计量单位
 * @author jhy Mar 28, 2017
 *
 */
public class LgcAssetUnitBrowserService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String unitname = Util.null2String(params.get("unitname"));
		String unitdesc = Util.null2String(params.get("unitdesc"));
		String sqlwhere = " ";
		if(!unitname.equals("")){
				sqlwhere += " and unitname like '%";
				sqlwhere += Util.fromScreen2(unitname,user.getLanguage());
				sqlwhere += "%'";
		}
		if(!unitdesc.equals("")){
				sqlwhere += " and unitdesc like '%";
				sqlwhere += Util.fromScreen2(unitdesc,user.getLanguage());
				sqlwhere += "%'";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		String backfields = " id,unitname,unitdesc ";
		String orderby = " id ";
		String tableString =" <table id='DocInstancyLevelTable' instanceid='DocInstancyLevelTable' tabletype='none' pagesize=\"10\">"+ 
							"<sql backfields=\""+backfields+"\" sqlform=\" LgcAssetUnit \" sqlwhere=\""+sqlwhere+"\"  sqlorderby=\""+orderby+"\"  sqlprimarykey=\"id\" sqlsortway=\"asc\"/>"+
							"<head>"+
							"<col width=\"20%\"  text=\"\"  hide=\"true\" orderkey=\"id\" column=\"id\"/>"+ 
							"<col width=\"40%\"  text=\""+ SystemEnv.getHtmlLabelName(195,user.getLanguage()) +"\" orderkey=\"unitname\" column=\"unitname\"/>"+ 
							"<col width=\"40%\"  text=\""+ SystemEnv.getHtmlLabelName(85,user.getLanguage()) +"\" orderkey=\"unitdesc\" column=\"unitdesc\" />"+ 
							"</head>"+   			
							"</table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
