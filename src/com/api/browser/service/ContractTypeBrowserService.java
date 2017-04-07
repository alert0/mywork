package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.PageIdConst;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 合同性质
 * @author jhy Mar 27, 2017
 *
 */
public class ContractTypeBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String fullname = Util.null2String(params.get("fullname"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " ";
		if (!fullname.equals("")) {
			sqlwhere += " and name like '%";
			sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!description.equals("")) {
			sqlwhere += " and contractdesc like '%";
			sqlwhere += Util.fromScreen2(description, user.getLanguage());
			sqlwhere += "%'";
		}
		
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);		
		
		String backfields = " id , name ,contractdesc ";
		String orderby = "id";
		String tableString =" <table id='BrowseTable' instanceid='BrowseTable' tabletype='none' pagesize=\""+PageIdConst.getPageSize(PageIdConst.CRM_Contract,user.getUID(),PageIdConst.CRM)+"\">"+ 
							"<sql backfields=\""+backfields+"\" sqlform=\"CRM_ContractType\" sqlwhere=\""+sqlwhere+"\"  sqlorderby=\""+orderby+"\"  sqlprimarykey=\"t1.id\" sqlsortway=\"asc\"/>"+
							"<head>"+
							"<col width=\"20%\" text=\""+SystemEnv.getHtmlLabelName(84,user.getLanguage())+"\" orderkey=\"id\" column=\"id\"/>"+ 
							"<col width=\"40%\"  text=\""+ SystemEnv.getHtmlLabelName(399,user.getLanguage()) +"\" orderkey=\"name\" column=\"name\"/>"+ 
							"<col width=\"40%\"  text=\""+ SystemEnv.getHtmlLabelName(433,user.getLanguage()) +"\" orderkey=\"contractdesc\" column=\"contractdesc\" />"+ 
							"</head>"+   			
							"</table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
