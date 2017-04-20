package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;

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

		String userId = String.valueOf(user.getUID());
		String userType = user.getLogintype();
		String crmId = CustomerID;
		
		if (recordSet.getDBType().equals("oracle")){
			sqlwhere = "id IN (SELECT DISTINCT a.id FROM WorkPlan a, WorkPlanShareDetail b WHERE a.id = b.workid AND (CONCAT(CONCAT(',',a.crmid),',')) LIKE '%," + crmId + ",%' AND b.usertype = " + userType + " AND b.userid = " + userId + " AND a.type_n = '3')";
		}else if (recordSet.getDBType().equals("db2")){
			sqlwhere = "id IN (SELECT DISTINCT a.id FROM WorkPlan a, WorkPlanShareDetail b WHERE a.id = b.workid AND (CONCAT(CONCAT(',',a.crmid),',')) LIKE '%," + crmId + ",%' AND b.usertype = " + userType + " AND b.userid = " + userId + " AND a.type_n = '3')";
		}else{
			sqlwhere = "id IN (SELECT DISTINCT a.id FROM WorkPlan a, WorkPlanShareDetail b WHERE a.id = b.workid AND (',' + a.crmid + ',') LIKE '%," + crmId + ",%' AND b.usertype = " + userType + " AND b.userid = " + userId + " AND a.type_n = '3')";
		}
		//sql += " ORDER BY begindate DESC, begintime DESC";
		
		String backfields = "id, begindate, begintime, description, name";
		String fromSql = "WorkPlan";
		String sqlorderby = "begindate,begintime";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true", "id"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(229, user.getLanguage()),"name","name"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(345, user.getLanguage()),"description","description"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(621, user.getLanguage()),"begindate","begindate","com.api.browser.service.impl.ContactLogBrowserService.getBeginDateInfo","column:begintime"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,sqlorderby,"id",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
	
	public String getBeginDateInfo(String begindate,String para){
		return Util.null2String(begindate) + " " + Util.null2String(para);
	}
	
	

}
