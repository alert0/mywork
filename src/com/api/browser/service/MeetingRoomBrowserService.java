package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.hrm.moduledetach.ManageDetachComInfo;
import weaver.meeting.MeetingShareUtil;
import weaver.systeminfo.SystemEnv;

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
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		//得到pageNum 与 perpage
		int perpage=9;
		//设置好搜索条件
		String backFields =" a.id,a.name,a.subcompanyid,a.roomdesc ";
		String fromSql = " MeetingRoom a ";
		String orderBy = "a.dsporder,a.name";
		String tableString=""+
					"<table pagesize=\""+perpage+"\" tabletype=\"none\">"+
					"<sql backfields=\""+backFields+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" sqlorderby=\""+orderBy+"\"  sqlprimarykey=\"a.id\" sqlsortway=\"Asc\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere)+"\" />"+
					"<head>"+
						"<col width=\"10%\"  text=\""+SystemEnv.getHtmlLabelName(84,user.getLanguage())+"\" column=\"id\" orderkey=\"a.id\"  />"+
						"<col width=\"30%\"  text=\""+SystemEnv.getHtmlLabelName(399,user.getLanguage())+"\" column=\"name\" orderkey=\"name\" />";
						if(detachable==1){tableString +="<col width=\"30%\"  text=\""+SystemEnv.getHtmlLabelName(17868,user.getLanguage())+"\" column=\"subcompanyid\" orderkey=\"subcompanyid\" transmethod=\"weaver.meeting.Maint.MeetingTransMethod.getMeetingSubCompany\"/>";}
		  tableString +="<col width=\"30%\"  text=\""+SystemEnv.getHtmlLabelName(433,user.getLanguage())+"\" column=\"roomdesc\"  orderkey=\"roomdesc \" />"+
					"</head>"+
					"</table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
