package com.api.browser.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import weaver.common.StringUtil;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.hrm.company.SubCompanyComInfo;
import weaver.hrm.moduledetach.ManageDetachComInfo;
import weaver.systeminfo.SystemEnv;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 班次
 * @author jhy Mar 29, 2017
 *
 */
public class ScheduleShiftsBrowserService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		// TODO Auto-generated method stub
		Map<String,Object> apidatas = new HashMap<String,Object>();
		User user = (User) params.get("user");
		
		String field001 = StringUtil.vString(params.get("field001"));
		String field003 = StringUtil.vString(params.get("field003"));
		String field006 = StringUtil.vString(params.get("field006"));
		String field002 = StringUtil.vString(params.get("field002"));
		
		String sqlField = "id, tId, field001, field003, field004, field005, field006, field002, field007, last_modification_time";
		String sqlFrom = "from (select t2.id, t.id as tId, t.field001, t.field003, t.field004, t.field005, t.field006, t.field002, t.field007, t.last_modification_time from hrm_schedule_shifts_set t left join hrm_schedule_shifts_set_id t2 on t.id = t2.field001 where t.delflag = 0) t";
		String sqlWhere = " ";
		if(field001.length() > 0) {
			sqlWhere += " and field001 like '%"+field001+"%'";
		}
		if(field003.length() > 0) {
			sqlWhere += " and field003 = "+field003;
		}
		ManageDetachComInfo detachCommonInfo = new ManageDetachComInfo();
		if(StringUtil.vString(detachCommonInfo.getDetachable()).equals("1")) {
			String allIds = "";
			SubCompanyComInfo scci = new SubCompanyComInfo();
			ArrayList sList = scci.getRightSubCompany(user.getUID(), "HrmScheduling:set");
			for(int i=0;i<sList.size();i++) allIds += (allIds.length() == 0 ? "" : ",") + StringUtil.vString(sList.get(i));
			sqlWhere += " and field002 in ("+(StringUtil.isNull(allIds) ? "-99999" : allIds)+")";
		}
		sqlWhere  = SqlUtils.replaceFirstAnd(sqlWhere);
//		SplitPageTagTable table = new SplitPageTagTable(out, user);
//		table.addAttribute("tabletype", "none");
//		table.setSql(sqlField, sqlFrom, sqlWhere, "last_modification_time", "desc");
//		table.addCol("15%", SystemEnv.getHtmlLabelName(125818,user.getLanguage()), "field001");
//		table.addFormatCol("17%", SystemEnv.getHtmlLabelName(125819,user.getLanguage()), "field003", "{cmd:class[weaver.hrm.schedule.manager.HrmScheduleShiftsSetManager.getField003Name("+user.getLanguage()+",+column:field003+,+column:field004+,+column:field005+)]}");
//		table.addFormatCol("20%", SystemEnv.getHtmlLabelName(125820,user.getLanguage()), "field006", "{cmd:array["+user.getLanguage()+";default=125837,1=125899]}");
//		table.addFormatCol("43%", SystemEnv.getHtmlLabelName(125799,user.getLanguage()), "id", "{cmd:class[weaver.hrm.schedule.manager.HrmScheduleShiftsDetailManager.getWorkTime(+column:tId+, "+user.getLanguage()+")]}");

		String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\"\">" + 
									"<sql backfields=\"" + sqlField + "\" sqlform=\"" + Util.toHtmlForSplitPage(sqlFrom) + "\" sqlwhere=\"" + sqlWhere + "\"  sqlorderby=\" last_modification_time \"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>" + 
									"<head>"+ 
									"	<col width=\"15%\"  text=\"" + SystemEnv.getHtmlLabelName(125818, user.getLanguage()) + "\" column=\"field001\"/>" + 
									"	<col width=\"17%\"  text=\"" + SystemEnv.getHtmlLabelName(125819, user.getLanguage()) + "\" display=\"true\" orderkey=\"field003\" column=\"field003\" transmethod=\"weaver.hrm.common.SplitPageTagFormat.colFormat\" otherpara=\"{cmd:class[weaver.hrm.schedule.manager.HrmScheduleShiftsSetManager.getField003Name(7,+column:field003+,+column:field004+,+column:field005+)]}\"/>" + 
									"	<col width=\"20%\"  text=\"" + SystemEnv.getHtmlLabelName(125820, user.getLanguage()) + "\" display=\"true\" orderkey=\"field006\" column=\"field006\" transmethod=\"weaver.hrm.common.SplitPageTagFormat.colFormat\" otherpara=\"{cmd:array[7;default=125837,1=125899]}\"/>" + 
									"	<col width=\"43%\"  text=\"" + SystemEnv.getHtmlLabelName(125799, user.getLanguage()) + "\" display=\"true\" orderkey=\"id\" column=\"id\" transmethod=\"weaver.hrm.common.SplitPageTagFormat.colFormat\" otherpara=\"{cmd:class[weaver.hrm.schedule.manager.HrmScheduleShiftsDetailManager.getWorkTime(+column:tId+, 7)]}\" />" + 
									"</head>" + 
							  "</table>";
		
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
