package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 职称
 * @author jhy Mar 28, 2017
 *
 */
public class JobCallBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		
		String name = Util.null2String(params.get("name"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " ";
		if(!name.equals("")){
				sqlwhere += " and name like '%";
				sqlwhere += Util.fromScreen2(name,user.getLanguage());
				sqlwhere += "%'";
		}
		if(!description.equals("")){
				sqlwhere += " and description like '%";
				sqlwhere += Util.fromScreen2(description,user.getLanguage());
				sqlwhere += "%'";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		int perpage = 9;
		// 设置好搜索条件
		String backFields = " id ,name,description ";
		String fromSql = " HrmJobCall ";
		
		String tableString="<table pagesize=\""+perpage+"\" tabletype=\"none\">"+
							"<sql backfields=\""+backFields+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" sqlorderby=\"\"  sqlprimarykey=\"id\" sqlsortway=\"desc\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere)+"\" />"+
							"<head>"+
								"<col hide=\"true\"  column=\"id\" />"+
								"<col width=\"100%\"  text=\""+SystemEnv.getHtmlLabelName(95,user.getLanguage())+"\" column=\"name\" orderkey=\"name\" />"+
								"<col width=\"100%\"  text=\""+SystemEnv.getHtmlLabelName(433,user.getLanguage())+"\" column=\"description\" orderkey=\"description\" />"+
							"</head>"+
							"</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

	
}
