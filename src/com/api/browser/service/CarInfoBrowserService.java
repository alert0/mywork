package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

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
		int perpage=6;
		String backfields = " id,factoryno,carno,cartype,driver,buydate";
		String fromSql  = " CarInfo ";

		String tableString =" <table instanceid=\"BrowseTable\" id=\"BrowseTable\" tabletype=\"none\" pagesize=\""+perpage+"\" >"+
			                "       <sql backfields=\""+backfields+"\" sqlform=\""+fromSql+"\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere)+"\"  sqlorderby=\""+orderby+"\"  sqlprimarykey=\"id\" sqlsortway=\"desc\" sqlisdistinct=\"true\" />"+
			                "       <head>"+
			                "           <col hide=\"true\"  text=\""+"ID"+"\" column=\"id\"    />"+
			                "           <col width=\"15%\"  text=\""+SystemEnv.getHtmlLabelName(20319,user.getLanguage())+"\" column=\"carno\" orderkey=\"carno\" />"+ //车牌号
			                "           <col width=\"20%\"  text=\""+SystemEnv.getHtmlLabelName(20318,user.getLanguage())+"\" column=\"factoryno\" orderkey=\"factoryno\"   />"+ //厂牌型号
			                "           <col width=\"10%\"  text=\""+SystemEnv.getHtmlLabelName(22256,user.getLanguage())+"\" column=\"cartype\" orderkey=\"cartype\" transmethod='weaver.car.CarTypeComInfo.getCarTypename'  />"+ //类型
			                "           <col width=\"10%\"  text=\""+SystemEnv.getHtmlLabelName(17649,user.getLanguage())+"\" column=\"driver\" orderkey=\"driver\" transmethod='weaver.hrm.resource.ResourceComInfo.getResourcename'  />"+ //司机
			                "           <col width=\"10%\"  text=\""+SystemEnv.getHtmlLabelName(16914,user.getLanguage())+"\" column=\"buydate\" orderkey=\"buydate\" />"+ //购置日期
			                "       </head>"+
			                " </table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
