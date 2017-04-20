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
 * 浏览框流程类型接口
 * @author jhy Mar 24, 2017
 *
 */
public class WorkflowTypeBrowserService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception{

		Map<String,Object> apidatas = new HashMap<String,Object>();
		User user = (User) params.get("user");

		String fullname = Util.null2String(params.get("name"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " ";
		if (!fullname.equals("")) {
			sqlwhere += " and typename like '%";
			sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!description.equals("")) {
			sqlwhere += " where typedesc like '%";
			sqlwhere += Util.fromScreen2(description, user.getLanguage());
			sqlwhere += "%'";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		//拼装查询SQL
		String backfields = "id,typename,typedesc,dsporder";
		String sqlfrom = " workflow_type " + sqlwhere;
		String orderby = "dsporder";

		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(84, user.getLanguage()),"id",null));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(399, user.getLanguage()),"typename",null));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(433, user.getLanguage()),"typedesc",null));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,sqlfrom,"",orderby,"id",cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}

}
