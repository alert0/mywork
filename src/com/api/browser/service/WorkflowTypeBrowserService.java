package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.workflow.util.PageUidFactory;
import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 浏览框流程类型接口
 * @author jhy Mar 24, 2017
 *
 */
public class WorkflowTypeBrowserService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception{

		Map<String,Object> apidatas = new HashMap<String,Object>();
		User user = (User) params.get("user");

		String fullname = Util.null2String(params.get("name"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " where 1 = 1 ";
		if (!fullname.equals("")) {
			sqlwhere += " and typename like '%";
			sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!description.equals("")) {
			sqlwhere += " where typedesc like '%";
			sqlwhere += Util.fromScreen2(description, user.getLanguage());
			sqlwhere += "%'";
		}

		//拼装查询SQL
		String backfields = "id,typename,typedesc,dsporder";
		String sqlfrom = " workflow_type " + sqlwhere;
		String orderby = "dsporder";

		String pageUid = PageUidFactory.getBrowserUID("wftypelist");
		String tableString = "<table pageUid =\"" + pageUid + "\">";
		tableString += " <sql backfields=\"" + backfields + "\" sqlform=\"" + Util.toHtmlForSplitPage(sqlfrom) + "\" sqlwhere=\"\"  sqlorderby=\"" + orderby
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"asc\" sqlisdistinct=\"false\" />";
		tableString += "<head>";
		tableString += "<col width=\"20%\" text=\"" + SystemEnv.getHtmlLabelName(84, user.getLanguage()) + "\" column=\"id\" orderkey=\"\" />";
		tableString += "<col width=\"40%\" text=\"" + SystemEnv.getHtmlLabelName(399, user.getLanguage()) + "\" column=\"typename\" />";
		tableString += "<col width=\"40%\" text=\"" + SystemEnv.getHtmlLabelName(433, user.getLanguage()) + "\" column=\"typedesc\" />";
		tableString += "</head>";
		tableString += "</table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
