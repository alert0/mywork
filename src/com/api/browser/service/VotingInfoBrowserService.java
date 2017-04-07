package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 单网上调查
 * @author jhy Mar 28, 2017
 *
 */
public class VotingInfoBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		
		String fullname = Util.null2String(params.get("fullname"));
		String sqlwhere = " where (status=1 or status=2) ";

		if(!fullname.equals("")){
			sqlwhere += " and subject like '%";
			sqlwhere += Util.fromScreen2(fullname,user.getLanguage());
			sqlwhere += "%'";
		}
		
		String backfields = " id,subject ";
		String orderby  = " createdate , createtime ";
		
		String tableString="<table  pagesize=\"10\" tabletype=\"none\" valign=\"top\" >"+
							"<sql backfields=\""+backfields+"\" sqlform=\" voting \"  sqlorderby=\""+orderby+"\"  sqlprimarykey=\"id\" sqlsortway=\"desc\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere)+"\" sqldistinct=\"true\" />"+
							"<head >"+
							 "<col width=\"30%\"  text=\""+SystemEnv.getHtmlLabelName(84,user.getLanguage())+"\"   column=\"id\" />"+
							 "<col width=\"70%\"  text=\""+SystemEnv.getHtmlLabelName(24096,user.getLanguage())+"\"  column=\"subject\" orderkey=\"subject\" />"+
							"</head>"+ 
							"</table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
