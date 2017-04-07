package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 专业
 * 
 * @author jhy Mar 28, 2017
 * 
 */
public class SpecialityBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String name = Util.null2String(params.get("name"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " ";
		if (!name.equals("")) {
			sqlwhere += " and name like '%";
			sqlwhere += Util.fromScreen2(name, 7);
			sqlwhere += "%'";
		}
		if (!description.equals("")) {
			sqlwhere += " and description like '%";
			sqlwhere += Util.fromScreen2(description, 7);
			sqlwhere += "%'";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		//设置好搜索条件
		String backFields =" id ,name,description ";
		String fromSql = " HrmSpeciality ";
		String tableString=""+
					"<table pagesize=\"10\" tabletype=\"none\">"+
					"<sql backfields=\""+backFields+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" sqlorderby=\"\"  sqlprimarykey=\"id\" sqlsortway=\"desc\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere)+"\" />"+
					"<head>"+
						"<col hide=\"true\" width=\"\"  text=\"\" column=\"id\" orderkey=\"id\"  />"+
						"<col width=\"30%\"  text=\""+SystemEnv.getHtmlLabelName(195,user.getLanguage())+"\" column=\"name\" orderkey=\"name\" />"+
						"<col width=\"70%\"  text=\""+SystemEnv.getHtmlLabelName(433,user.getLanguage())+"\" column=\"description\" orderkey=\"description\" />"+
					"</head>"+
					"</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
