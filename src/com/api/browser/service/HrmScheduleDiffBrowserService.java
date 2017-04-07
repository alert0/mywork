package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 加班类型
 * 
 * @author jhy Mar 27, 2017
 * 
 */
public class HrmScheduleDiffBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String diffname = Util.null2String(params.get("diffname"));
		String diffdesc = Util.null2String(params.get("diffdesc"));
		String workflowid = Util.null2String(params.get("workflowid"));
		String salaryitem = Util.null2String(params.get("salaryitem"));
		String difftype = Util.null2String(params.get("difftype"));
		String difftime = Util.null2String(params.get("difftime"));
		String salaryable = Util.null2String(params.get("salaryable"));
		String counttype = Util.null2String(params.get("counttype"));

		String sqlwhere = " ";
		if (!diffname.equals("")) {
			sqlwhere += " and diffname like '%";
			sqlwhere += Util.fromScreen2(diffname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!diffdesc.equals("")) {
			sqlwhere += " and diffdesc like '%";
			sqlwhere += Util.fromScreen2(diffdesc, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!workflowid.equals("") && !workflowid.equals("0")) {
			sqlwhere += " and workflowid =";
			sqlwhere += Util.fromScreen2(workflowid, user.getLanguage());
			sqlwhere += " ";
		}
		if (!salaryitem.equals("")) {
			sqlwhere += " and salaryitem =";
			sqlwhere += Util.fromScreen2(salaryitem, user.getLanguage());
			sqlwhere += " ";
		}
		if (!difftype.equals("")) {
			sqlwhere += " and difftype =" + Util.fromScreen2(difftype, user.getLanguage());
		}
		if (!difftime.equals("")) {
			sqlwhere += " and difftime =" + Util.fromScreen2(difftime, user.getLanguage());
		}
		if (!salaryable.equals("")) {
			sqlwhere += " and salaryable =" + Util.fromScreen2(salaryable, user.getLanguage());
		}

		if (!counttype.equals("")) {
			sqlwhere += " and counttype =" + Util.fromScreen2(counttype, user.getLanguage());
		}

		int perpage = 9;
		// 设置好搜索条件
		String backFields = " id ,diffname ";
		String fromSql = " HrmScheduleDiff ";

		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		String tableString=""+
						"<table pagesize=\""+perpage+"\" tabletype=\"none\">"+
						"<sql backfields=\""+backFields+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" sqlorderby=\"\"  sqlprimarykey=\"id\" sqlsortway=\"desc\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere)+"\" />"+
						"<head>"+
							"<col hide=\"true\"  column=\"id\" />"+
							"<col width=\"100%\"  text=\""+SystemEnv.getHtmlLabelName(399,user.getLanguage())+"\" column=\"diffname\" orderkey=\"diffname\" />"+
						"</head>"+
						"</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
