package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.hrm.moduledetach.ManageDetachComInfo;
import weaver.meeting.MeetingShareUtil;
import weaver.systeminfo.SystemEnv;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

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
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		// 得到pageNum 与 perpage
		int perpage = 10;
		// 设置好搜索条件
		String backFields = " a.id,a.name,a.subcompanyid,a.desc_n,a.approver,a.approver1 ";
		String fromSql = " Meeting_Type a ";
		String orderBy = " a.dsporder,a.name ";
		String tableString = "" + "<table pagesize=\"" + perpage + "\" tabletype=\"none\">" + "<sql backfields=\"" + backFields + "\" sqlform=\"" + Util.toHtmlForSplitPage(fromSql)
				+ "\" sqlorderby=\"" + orderBy + "\"  sqlprimarykey=\"a.id\" sqlsortway=\"Asc\" sqlwhere=\"" + Util.toHtmlForSplitPage(sqlwhere) + "\" />" + "<head>" + "<col width=\"10%\"  text=\""
				+ SystemEnv.getHtmlLabelName(84, user.getLanguage()) + "\" column=\"id\" orderkey=\"a.id\"  hide=\"true\"/>" + "<col width=\"30%\"  text=\""
				+ SystemEnv.getHtmlLabelName(2104, user.getLanguage()) + "\" column=\"name\" orderkey=\"name\" />";
		if (detachable == 1) {
			tableString += "<col width=\"30%\"  text=\"" + SystemEnv.getHtmlLabelName(17868, user.getLanguage())
					+ "\" column=\"subcompanyid\" orderkey=\"subcompanyid\" transmethod=\"weaver.meeting.Maint.MeetingTransMethod.getMeetingSubCompany\"/>";
		}
		if ("0".equals(isInterval)) { // 普通会议流程
			tableString += "<col width=\"30%\"  text=\"" + SystemEnv.getHtmlLabelName(15057, user.getLanguage())
					+ "\" column=\"approver\"  orderkey=\"approver \" transmethod=\"weaver.workflow.workflow.WorkflowComInfo.getWorkflowname\" />";
		} else if ("1".equals(isInterval)) {// 周期会议流程
			tableString += "<col width=\"30%\"  text=\"" + SystemEnv.getHtmlLabelName(82441, user.getLanguage())
					+ "\" column=\"approver1\"  orderkey=\"approver1 \" transmethod=\"weaver.workflow.workflow.WorkflowComInfo.getWorkflowname\" />";
		}
		tableString += "</head>" + "</table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
