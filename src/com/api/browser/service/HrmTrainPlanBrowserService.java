package com.api.browser.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.api.browser.util.SqlUtils;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.train.TrainLayoutComInfo;
import weaver.hrm.train.TrainPlanComInfo;
import weaver.systeminfo.SystemEnv;

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
		
		//设置table表头
		List<Map<String, Object>> columns = new ArrayList<Map<String, Object>>();
		Map<String,Object> column = new HashMap<String,Object>();
		column.put("dataIndex", "id");
		column.put("display", true);
		column.put("title", "");
		columns.add(column);
		
		column = new HashMap<String,Object>();
		column.put("dataIndex", "planname");
		column.put("title", SystemEnv.getHtmlLabelName(195,user.getLanguage()));
		columns.add(column);
		
		column = new HashMap<String,Object>();
		column.put("dataIndex", "layoutname");
		column.put("title", SystemEnv.getHtmlLabelName(6101,user.getLanguage()));
		columns.add(column);
		
		column = new HashMap<String,Object>();
		column.put("dataIndex", "plancontent");
		column.put("title", SystemEnv.getHtmlLabelName(345,user.getLanguage()));
		columns.add(column);
		
		column = new HashMap<String,Object>();
		column.put("dataIndex", "planaim");
		column.put("title", SystemEnv.getHtmlLabelName(16142,user.getLanguage()));
		columns.add(column);
		
		apidatas.put("columns", columns);
		apidatas.put("datas", datas);
		return apidatas;
	}
}
