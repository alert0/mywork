package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.train.TrainLayoutComInfo;
import weaver.hrm.train.TrainPlanComInfo;
import weaver.systeminfo.SystemEnv;

import com.api.browser.bean.ListHeadBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.BrowseDataType;
import com.api.browser.util.BrowserConstant;
import com.api.browser.util.SqlUtils;

/**
 * 培训安排
 * 
 * @author jhy Mar 28, 2017
 * 
 */
public class HrmTrainPlanBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String planname = Util.null2String(params.get("planname"));
		String layoutid = Util.null2String(params.get("layoutid"));
		String planaim = Util.null2String(params.get("planaim"));
		String plancontent = Util.null2String(params.get("plancontent"));
		String sqlwhere = "  ";
		if (!planname.equals("")) {
			sqlwhere += " and planname like '%";
			sqlwhere += Util.fromScreen2(planname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!layoutid.equals("")) {
			sqlwhere += " and layoutid =";
			sqlwhere += Util.fromScreen2(layoutid, user.getLanguage());
			sqlwhere += " ";
		}
		if (!planaim.equals("")) {
			sqlwhere += " and planaim like '%";
			sqlwhere += Util.fromScreen2(planaim, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!plancontent.equals("")) {
			sqlwhere += " and plancontent like '%";
			sqlwhere += Util.fromScreen2(plancontent, user.getLanguage());
			sqlwhere += "%'";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		RecordSet rs = new RecordSet();
		rs.execute("select id,planname,layoutid,plancontent,planaim from HrmTrainPlan " + sqlwhere);
		List<Map<String, Object>> datas = new ArrayList<Map<String, Object>>();
		TrainPlanComInfo tpci = new TrainPlanComInfo();
		TrainLayoutComInfo tlci = new TrainLayoutComInfo();
		while (rs.next()) {
			String id = rs.getString("id");
			boolean canView = tpci.isViewer(id, "" + user.getUID());
			if (HrmUserVarify.checkUserRight("HrmTrainLayoutEdit:Edit", user)) {
				canView = true;
			}
			if (!canView) {
				continue;
			}
			
			Map<String, Object> planInfo  = new HashMap<String,Object>();
			planInfo.put("id", id);
			planInfo.put("planname", Util.null2String(rs.getString("planname")));
			planInfo.put("layoutname", tlci.getLayoutname(rs.getString("layoutid")));
			planInfo.put("plancontent", Util.null2String(rs.getString("plancontent")));
			planInfo.put("planaim", Util.null2String(rs.getString("planaim")));
			datas.add(planInfo);
		}
		
		List<ListHeadBean> tableHeadColumns =  new ArrayList<ListHeadBean>();
		tableHeadColumns.add(new ListHeadBean("id",true));
		tableHeadColumns.add(new ListHeadBean("planname",SystemEnv.getHtmlLabelName(195,user.getLanguage())));
		tableHeadColumns.add(new ListHeadBean("layoutname",SystemEnv.getHtmlLabelName(6101,user.getLanguage())));
		tableHeadColumns.add(new ListHeadBean("plancontent",SystemEnv.getHtmlLabelName(345,user.getLanguage())));
		tableHeadColumns.add(new ListHeadBean("planaim",SystemEnv.getHtmlLabelName(16142,user.getLanguage())));
		
		apidatas.put(BrowserConstant.BROWSER_RESULT_COLUMN, tableHeadColumns);
		apidatas.put(BrowserConstant.BROWSER_RESULT_DATA, datas);
		apidatas.put(BrowserConstant.BROWSER_RESULT_TYPE, BrowseDataType.LIST_ALL_DATA.getTypeid());
		return apidatas;
	}
}
