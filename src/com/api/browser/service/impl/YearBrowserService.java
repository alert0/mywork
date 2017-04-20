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
 * 年份
 * @author jhy Mar 29, 2017
 *
 */
public class YearBrowserService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		// TODO Auto-generated method stub
		Map<String,Object> apidatas = new HashMap<String,Object>();
		User user = (User) params.get("user");

		String backfields = " yearId,yearName ";
		String fromSQL = " from Workflow_FieldYear a";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("100%",SystemEnv.getHtmlLabelName(15933, user.getLanguage()),"yearName","yearName"));
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSQL,"","","yearId",cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
