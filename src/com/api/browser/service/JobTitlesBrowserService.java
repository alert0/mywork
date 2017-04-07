package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.general.PageIdConst;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 岗位
 * @author jhy Mar 27, 2017
 *
 */
public class JobTitlesBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String jobtitlemark = Util.null2String(params.get("jobtitlemark"));
		String jobtitlename = Util.null2String(params.get("jobtitlename"));
		String sqlwhere = Util.null2String(params.get("sqlwhere"));
		
		
		String backfields = " id,jobtitlemark,jobtitlename,jobactivityid "; 
		String fromSql  = " from HrmJobTitles ";
		String orderby = " id " ;
		String tableString = "";

		if (!"".equals(jobtitlemark)) {
			sqlwhere += " and jobtitlemark like '%"+jobtitlemark+"%'";
		}  	  	

		if (!"".equals(jobtitlename)) {  
			sqlwhere += " and jobtitlename like '%"+jobtitlename+"%'"; 	  	
		}
		sqlwhere = SqlUtils.replaceFirstAnd(sqlwhere);
		tableString =" <table pageId=\""+PageIdConst.HRM_JobTitlesBrowser+"\" tabletype=\"none\" pagesize=\""+PageIdConst.getPageSize(PageIdConst.HRM_JobTitlesBrowser,user.getUID(),PageIdConst.HRM)+"\" >"+
				"	   <sql backfields=\""+backfields+"\" sqlform=\""+fromSql+"\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere)+"\"  sqlorderby=\""+orderby+"\"  sqlprimarykey=\"id\" sqlsortway=\"Asc\" sqlisdistinct=\"true\"/>"+
		    "			<head>"+
		    "				<col width=\"35%\" text=\""+SystemEnv.getHtmlLabelName(15767,user.getLanguage())+"\" column=\"jobtitlename\" orderkey=\"jobtitlename\" />"+
		    "				<col width=\"35%\" text=\""+SystemEnv.getHtmlLabelName(399,user.getLanguage())+"\" column=\"jobtitlemark\" orderkey=\"jobtitlemark\"/>"+
		    "				<col width=\"30%\" text=\""+SystemEnv.getHtmlLabelName(1915,user.getLanguage())+"\" column=\"jobactivityid\" orderkey=\"jobactivityid\" transmethod=\"weaver.hrm.job.JobActivitiesComInfo.getJobActivitiesname\"/>"+
		    "			</head>"+
		    " </table>";
		
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
