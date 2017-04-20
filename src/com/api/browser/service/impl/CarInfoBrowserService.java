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
import com.api.browser.util.SqlUtils;

/**
 * 车辆
 * 
 * @author jhy Mar 28, 2017
 * 
 */
public class CarInfoBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");

		RecordSet rs = new RecordSet();
		rs.executeSql("select carsdetachable from SystemSet");
		int detachable = 0;
		if (rs.next()) {
			detachable = rs.getInt(1);
		}
		String sqlwhere = " ";
		if (detachable == 1) {
			if (user.getUID() != 1) {
				String sqltmp = "";
				String blonsubcomid = "";
				char flag = Util.getSeparator();
				rs.executeProc("HrmRoleSR_SeByURId", "" + user.getUID() + flag + "Car:Maintenance");
				while (rs.next()) {
					blonsubcomid = rs.getString("subcompanyid");
					sqltmp += (", " + blonsubcomid);
				}
				if (!"".equals(sqltmp)) {// 角色设置的权限
					sqltmp = sqltmp.substring(1);
					sqlwhere += " and subcompanyid in (" + sqltmp + ") ";
				} else {
					sqlwhere += " and subcompanyid=" + user.getUserSubCompany1();
				}
			}
		}

		String carNo = Util.null2String(params.get("carNo"));
		String carType = Util.null2String(params.get("carType"));
		String factoryNo = Util.null2String(params.get("factoryNo"));
		String startdate = Util.null2String(params.get("startdate"));
		String enddate = Util.null2String(params.get("enddate"));

		if (!carNo.equals("")) {
			sqlwhere += " and carNo like '%" + carNo + "%'";
		}
		if (!carType.equals("")) {
			sqlwhere += " and carType=" + carType + "";
		}
		if (!factoryNo.equals("")) {
			sqlwhere += " and factoryNo like '%" + factoryNo + "%'";
		}
		if (!startdate.equals("")) {
			sqlwhere += " and buyDate >= '" + startdate + "'";
		}
		if (!enddate.equals("")) {
			sqlwhere += " and buyDate <= '" + enddate + "'";
		}
		
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);

		String orderby =" id ";
		String backfields = " id,factoryno,carno,cartype,driver,buydate";
		String fromSql  = " CarInfo ";

		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(20319, user.getLanguage()),"carno","carno"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(20318, user.getLanguage()),"factoryno","factoryno","weaver.car.CarTypeComInfo.getCarTypename"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(22256, user.getLanguage()),"cartype","cartype","weaver.hrm.resource.ResourceComInfo.getResourcename"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(17649, user.getLanguage()),"driver","driver"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(16914, user.getLanguage()),"buydate","buydate"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,orderby,"id",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}

}
