package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 秘密等级
 * @author jhy Mar 28, 2017
 *
 */
public class DocSecretLevelBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String name = Util.null2String(params.get("name"));
		String desc = Util.null2String(params.get("desc"));
		String sqlwhere = " ";
		if(!name.equals("")){
			sqlwhere += " and name like '%";
			sqlwhere += Util.fromScreen2(name,user.getLanguage());
			sqlwhere += "%'";
		}
		if(!desc.equals("")){
			sqlwhere += " and desc_n like '%";
			sqlwhere += Util.fromScreen2(desc,user.getLanguage());
			sqlwhere += "%'";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		String backfields = " id,name,desc_n ";
		String orderby = " showOrder ";
		String tableString =" <table id='DocInstancyLevelTable' instanceid='DocInstancyLevelTable' tabletype='none' pagesize=\"10\">"+ 
							"<sql backfields=\""+backfields+"\" sqlform=\" DocSecretLevel \" sqlwhere=\""+sqlwhere+"\"  sqlorderby=\""+orderby+"\"  sqlprimarykey=\"id\" sqlsortway=\"asc\"/>"+
							"<head>"+
							"<col width=\"20%\" text=\""+SystemEnv.getHtmlLabelName(84,user.getLanguage())+"\" orderkey=\"id\" column=\"id\"/>"+ 
							"<col width=\"40%\"  text=\""+ SystemEnv.getHtmlLabelName(399,user.getLanguage()) +"\" orderkey=\"name\" column=\"name\"/>"+ 
							"<col width=\"40%\"  text=\""+ SystemEnv.getHtmlLabelName(433,user.getLanguage()) +"\" orderkey=\"desc_n\" column=\"desc_n\" />"+ 
							"</head>"+   			
							"</table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
