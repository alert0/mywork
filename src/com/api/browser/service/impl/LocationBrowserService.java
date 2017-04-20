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
 * 办公地点
 * 
 * @author jhy Mar 28, 2017
 * 
 */
public class LocationBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String locationname = Util.null2String(params.get("locationname"));
		String locationdesc = Util.null2String(params.get("locationdesc"));
		String address = Util.null2String(params.get("address"));
		String sqlwhere = " ";
		if (!locationname.equals("")) {
			sqlwhere += " and locationname like '%";
			sqlwhere += Util.fromScreen2(locationname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!locationdesc.equals("")) {
			sqlwhere += " and locationdesc like '%";
			sqlwhere += Util.fromScreen2(locationdesc, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!address.equals("")) {
			sqlwhere += " and (address1 like '%";
			sqlwhere += Util.fromScreen2(address, user.getLanguage());
			sqlwhere += "%')";
		}
		// 设置好搜索条件
		String backFields = " id ,locationname,locationdesc,address1 ";
		String fromSql = " HrmLocations ";
		String orderBy = " showOrder ";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("10%",SystemEnv.getHtmlLabelName(84, user.getLanguage()),"id","id"));
		cols.add(new SplitTableColBean("25%",SystemEnv.getHtmlLabelName(399, user.getLanguage()),"locationname","locationname"));
		cols.add(new SplitTableColBean("25%",SystemEnv.getHtmlLabelName(15767, user.getLanguage()),"locationdesc","locationdesc"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(110, user.getLanguage()),"address1","address1"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backFields,fromSql,sqlwhere,orderBy,"id",cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}

}
