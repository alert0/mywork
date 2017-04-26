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
 * 国家
 * @author jhy Mar 24, 2017
 * 
 */
public class CountryBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {

		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		// String imagefilename = "/images/hdSystem_wev8.gif";
		// String titlename = SystemEnv.getHtmlLabelName(377,
		// user.getLanguage());
		// String needfav = "1";
		// String needhelp = "";

		String sqlwhere1 = Util.null2String(params.get("sqlwhere"));
		String countryname = Util.null2String(params.get("name"));
		String countrydesc = Util.null2String(params.get("countrydesc"));
		String sqlwhere = " ";
		int ishead = 0;
		if (!sqlwhere1.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += sqlwhere1;
			}
		}
		if (ishead == 1) {
			sqlwhere += " and (canceled is null or canceled = 0) ";
		} else {
			ishead = 1;
			sqlwhere += " where (canceled is null or canceled = 0) ";
		}
		if (!countryname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where countryname like '%";
				sqlwhere += Util.fromScreen2(countryname, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and countryname like '%";
				sqlwhere += Util.fromScreen2(countryname, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		if (!countrydesc.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where countrydesc like '%";
				sqlwhere += Util.fromScreen2(countrydesc, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and countrydesc like '%";
				sqlwhere += Util.fromScreen2(countrydesc, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		String backfields = "id,countryname,countrydesc";
		String fromSql = "HrmCountry";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("hide","id"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(399, user.getLanguage()),"countryname","countryname"));
		cols.add(new SplitTableColBean("60%",SystemEnv.getHtmlLabelName(377, user.getLanguage()),"countrydesc","countrydesc"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,"id","id",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
