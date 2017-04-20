package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;

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

		if (!"".equals(jobtitlemark)) {
			sqlwhere += " and jobtitlemark like '%"+jobtitlemark+"%'";
		}  	  	

		if (!"".equals(jobtitlename)) {  
			sqlwhere += " and jobtitlename like '%"+jobtitlename+"%'"; 	  	
		}
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("35%",SystemEnv.getHtmlLabelName(15767, user.getLanguage()),"jobtitlename","jobtitlename"));
		cols.add(new SplitTableColBean("35%",SystemEnv.getHtmlLabelName(399, user.getLanguage()),"jobtitlemark","jobtitlemark"));
		cols.add(new SplitTableColBean("30%",SystemEnv.getHtmlLabelName(1915, user.getLanguage()),"jobactivityid","jobactivityid","weaver.hrm.job.JobActivitiesComInfo.getJobActivitiesname"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,orderby,"id",cols);
		tableBean.setSqlsortway("ASC");
		tableBean.setSqlisdistinct("true");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
