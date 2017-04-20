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
 * 会议室
 * 
 * @author jhy Mar 28, 2017
 * 
 */
public class MeetingRoomBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		int forall = Util.getIntValue(Util.null2String(params.get("forall")), 0);
		String fullname = Util.null2String(params.get("fullname"));
		String description = Util.null2String(params.get("description"));
		int SelectSubCompany = Util.getIntValue(Util.null2String(params.get("SelectSubCompany")), -1);
		String sqlwhere = " ";
		ManageDetachComInfo mdci = new ManageDetachComInfo();
		boolean isUseMtiManageDetach = mdci.isUseMtiManageDetach();
		int detachable = 0;
		if (isUseMtiManageDetach) {
			detachable = 1;
		} else {
			detachable = 0;
		}

		if (detachable == 1 && SelectSubCompany > 0) {
			sqlwhere += " and a.subcompanyid = " + SelectSubCompany;
		}

		if (!fullname.equals("")) {
			sqlwhere += " and a.name like '%";
			sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!description.equals("")) {
			sqlwhere += " and a.roomdesc like '%";
			sqlwhere += Util.fromScreen2(description, user.getLanguage());
			sqlwhere += "%'";
		}

		if (forall != 1) {
			sqlwhere += MeetingShareUtil.getRoomShareSql(user);
			sqlwhere += " and (a.status=1 or a.status is null )";
		}
		//设置好搜索条件
		String backFields =" a.id,a.name,a.subcompanyid,a.roomdesc ";
		String fromSql = " MeetingRoom a ";
		String orderBy = "a.dsporder,a.name";

		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("10%", SystemEnv.getHtmlLabelName(84, user.getLanguage()), "id", "id"));
		cols.add(new SplitTableColBean("30%", SystemEnv.getHtmlLabelName(399, user.getLanguage()), "name", "name"));
		if (detachable == 1)
			cols.add(new SplitTableColBean("30%", SystemEnv.getHtmlLabelName(399, user.getLanguage()), "subcompanyid", "subcompanyid", "weaver.meeting.Maint.MeetingTransMethod.getMeetingSubCompany"));
		cols.add(new SplitTableColBean("30%", SystemEnv.getHtmlLabelName(433, user.getLanguage()), "roomdesc", "roomdesc"));

		SplitTableBean tableBean = new SplitTableBean(backFields, fromSql, sqlwhere, orderBy, "a.id", cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas, tableBean);
		return apidatas;
	}

}
