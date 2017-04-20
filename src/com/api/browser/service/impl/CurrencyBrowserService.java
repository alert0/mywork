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
 * 币种
 * 
 * @author jhy Mar 29, 2017
 * 
 */
public class CurrencyBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String currencyname = Util.null2String(params.get("currencyname"));
		String currencydesc = Util.null2String(params.get("currencydesc"));
		String sqlwhere = " where activable = '1' ";
		if (!currencyname.equals("")) {
			sqlwhere += " and currencyname like '%" + Util.fromScreen2(currencyname, 7) + "%' ";
		}
		if (!currencydesc.equals("")) {
			sqlwhere += " and currencydesc like '%" + Util.fromScreen2(currencydesc, 7) + "%' ";
		}
		
		String backfields = " id,currencyname,currencydesc ";
		String fromSql = " FnaCurrency  ";
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("hide","id"));
		cols.add(new SplitTableColBean("50%",SystemEnv.getHtmlLabelName(195, user.getLanguage()),"currencyname","currencyname"));
		cols.add(new SplitTableColBean("50%",SystemEnv.getHtmlLabelName(433, user.getLanguage()),"currencydesc","currencydesc"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,"","id",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
