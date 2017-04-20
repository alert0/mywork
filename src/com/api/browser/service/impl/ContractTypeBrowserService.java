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
import com.api.browser.util.SqlUtils;

/**
 * 合同性质
 * @author jhy Mar 27, 2017
 *
 */
public class ContractTypeBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String fullname = Util.null2String(params.get("fullname"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " ";
		if (!fullname.equals("")) {
			sqlwhere += " and name like '%";
			sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!description.equals("")) {
			sqlwhere += " and contractdesc like '%";
			sqlwhere += Util.fromScreen2(description, user.getLanguage());
			sqlwhere += "%'";
		}
		
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);		
		
		String backfields = " id , name ,contractdesc ";
		String orderby = "id";
		String fromSql = "CRM_ContractType";

		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(84, user.getLanguage()),"id","id"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(399, user.getLanguage()),"name","name"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(433, user.getLanguage()),"contractdesc","contractdesc"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,orderby,"t1.id",cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
