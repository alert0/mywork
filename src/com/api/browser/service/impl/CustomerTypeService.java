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
import com.api.workflow.util.PageUidFactory;
import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 获取客户类型
 * @author jhy Mar 27, 2017
 *
 */
public class CustomerTypeService extends BrowserService{

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
		String fullname = Util.null2String(params.get("name"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " ";
		int ishead = 0;
		if (!sqlwhere1.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += sqlwhere1;
			}
		}
		if (!fullname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		if (!description.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		
		String backfields = "id,fullname,description";
		String fromSql = "CRM_CustomerType";
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("hide","id"));
		cols.add(new SplitTableColBean("40%",SystemEnv.getHtmlLabelName(399, user.getLanguage()),"fullname","fullname"));
		cols.add(new SplitTableColBean("60%",SystemEnv.getHtmlLabelName(433, user.getLanguage()),"description","description"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,"","id",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}

}
