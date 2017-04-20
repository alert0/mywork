package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;

/**
 * 产品类别
 * @author jhy Mar 29, 2017
 *
 */
public class LgcAssortmentBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String sqlwhere = " where subassortmentcount = 0 ";
		
		String backfields = " id,assortmentmark,assortmentname ";
		String fromSql = " LgcAssetAssortment  ";

		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("50%",SystemEnv.getHtmlLabelName(84, user.getLanguage()),"assortmentmark","assortmentmark"));
		cols.add(new SplitTableColBean("50%",SystemEnv.getHtmlLabelName(195, user.getLanguage()),"assortmentname","assortmentname"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,"","id",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}

}
