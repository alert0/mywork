package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.hrm.moduledetach.ManageDetachComInfo;
import weaver.meeting.MeetingShareUtil;
import weaver.systeminfo.SystemEnv;

import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;

/**
 * 会议类型
 * 
 * @author jhy Mar 28, 2017
 * 
 */
public class MeetingTypeBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		int forall = Util.getIntValue(Util.null2String(params.get("forall")), 0);
		String isInterval = Util.null2String(params.get("isInterval"));
		String fullname = Util.null2String(params.get("fullname"));
		String sqlwhere = "  ";
		// 是否分权系统，如不是，则不显示框架，直接转向到列表页面
		ManageDetachComInfo mdci = new ManageDetachComInfo();
		boolean isUseMtiManageDetach = mdci.isUseMtiManageDetach();
		int detachable = 0;
		if (isUseMtiManageDetach) {
			detachable = 1;
		} else {
			detachable = 0;
		}

		String subcompanyid = Util.null2String(Util.null2String(params.get("subcompanyid")));
		if (detachable == 1 && !"".equals(subcompanyid)) {
			sqlwhere += " and a.subcompanyid in(" + subcompanyid + ",0) ";
		}
		if (!fullname.equals("")) {
			sqlwhere += " and a.name like '%";
			sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
			sqlwhere += "%'";
		}

		if (forall != 1) {
			sqlwhere += MeetingShareUtil.getTypeShareSql(user);
		}
		// 设置好搜索条件
		String backFields = " a.id,a.name,a.subcompanyid,a.desc_n,a.approver,a.approver1 ";
		String fromSql = " Meeting_Type a ";
		String orderBy = " a.dsporder,a.name ";

		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("30%",SystemEnv.getHtmlLabelName(2104, user.getLanguage()),"name","name"));
		if (detachable == 1) 
			cols.add(new SplitTableColBean("30%",SystemEnv.getHtmlLabelName(17868, user.getLanguage()),"subcompanyid","subcompanyid","weaver.meeting.Maint.MeetingTransMethod.getMeetingSubCompany"));	
		if ("0".equals(isInterval)) 
			cols.add(new SplitTableColBean("30%",SystemEnv.getHtmlLabelName(15057, user.getLanguage()),"approver","approver","weaver.workflow.workflow.WorkflowComInfo.getWorkflowname"));
		if("1".equals(isInterval))
			cols.add(new SplitTableColBean("30%",SystemEnv.getHtmlLabelName(82441, user.getLanguage()),"approver1","approver1","weaver.workflow.workflow.WorkflowComInfo.getWorkflowname"));
			
		SplitTableBean tableBean  =  new SplitTableBean(backFields,fromSql,sqlwhere,orderBy,"a.id",cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}

}
