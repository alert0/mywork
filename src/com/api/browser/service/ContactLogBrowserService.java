package com.api.browser.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 商机来源
 * 
 * @author jhy Mar 28, 2017
 * 
 */
public class ContactLogBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");

		RecordSet recordSet = new RecordSet();
		String sqlwhere = Util.null2String(params.get("sqlwhere"));
		String CustomerID = Util.null2String(params.get("CustomerID"));
		if (!"".equals(sqlwhere)) {
			CustomerID = sqlwhere.substring(sqlwhere.indexOf("CustomerID") + "CustomerID".length() + 1);
		}
		if (CustomerID.equals("")) {
			CustomerID = "0";
		}

		if (!"".equals(sqlwhere)) {
			sqlwhere = sqlwhere.replace("where", " and");
		}

		String userId = String.valueOf(user.getUID());
		String userType = user.getLogintype();

		String crmId = CustomerID;

		String sql = "";

		if (recordSet.getDBType().equals("oracle"))
			sql = " SELECT id, begindate, begintime, description, name " + " FROM WorkPlan WHERE id IN ( " + " SELECT DISTINCT a.id FROM WorkPlan a, WorkPlanShareDetail b " + " WHERE a.id = b.workid"
					+ " AND (CONCAT(CONCAT(',',a.crmid),',')) LIKE '%," + crmId + ",%'" + " AND b.usertype = " + userType + " AND b.userid = " + userId + " AND a.type_n = '3')";
		else if (recordSet.getDBType().equals("db2"))
			sql = " SELECT id, begindate, begintime, description, name " + " FROM WorkPlan WHERE id IN ( " + " SELECT DISTINCT a.id FROM WorkPlan a, WorkPlanShareDetail b " + " WHERE a.id = b.workid"
					+ " AND (CONCAT(CONCAT(',',a.crmid),',')) LIKE '%," + crmId + ",%'" + " AND b.usertype = " + userType + " AND b.userid = " + userId + " AND a.type_n = '3')";
		else
			sql = "SELECT id, begindate , begintime, description, name " + " FROM WorkPlan WHERE id IN ( " + " SELECT DISTINCT a.id FROM WorkPlan a,  WorkPlanShareDetail b WHERE a.id = b.workid"
					+ " AND (',' + a.crmid + ',') LIKE '%," + crmId + ",%'" + " AND b.usertype = " + userType + " AND b.userid = " + userId + " AND a.type_n = '3')";
		sql += " ORDER BY begindate DESC, begintime DESC";
		recordSet.executeSql(sql);

		// 设置table表头
		List<Map<String, Object>> columns = new ArrayList<Map<String, Object>>();
		Map<String, Object> column = new HashMap<String, Object>();
		column.put("dataIndex", "name");
		column.put("title", SystemEnv.getHtmlLabelName(229, user.getLanguage()));
		columns.add(column);

		column = new HashMap<String, Object>();
		column.put("dataIndex", "description");
		column.put("title", SystemEnv.getHtmlLabelName(345, user.getLanguage()));
		columns.add(column);

		column = new HashMap<String, Object>();
		column.put("dataIndex", "begindate");
		column.put("title", SystemEnv.getHtmlLabelName(621, user.getLanguage()));
		columns.add(column);
		apidatas.put("columns", columns);

		List<Map<String, Object>> datas = new ArrayList<Map<String, Object>>();
		Map<String, Object> contactLogInfo = null;
		while (recordSet.next()) {
			contactLogInfo = new HashMap<String, Object>();
			contactLogInfo.put("name", Util.toScreen(recordSet.getString("name"), user.getLanguage()));
			contactLogInfo.put("description", Util.toScreen(recordSet.getString("description"), user.getLanguage()));
			contactLogInfo.put("begindate", recordSet.getString("begindate") + " " + recordSet.getString("begintime"));
			datas.add(contactLogInfo);
		}
		apidatas.put("datas", datas);
		return apidatas;
	}

}
