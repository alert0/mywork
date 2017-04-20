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
 * 加班类型
 * 
 * @author jhy Mar 27, 2017
 * 
 */
public class HrmScheduleDiffBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String diffname = Util.null2String(params.get("diffname"));
		String diffdesc = Util.null2String(params.get("diffdesc"));
		String workflowid = Util.null2String(params.get("workflowid"));
		String salaryitem = Util.null2String(params.get("salaryitem"));
		String difftype = Util.null2String(params.get("difftype"));
		String difftime = Util.null2String(params.get("difftime"));
		String salaryable = Util.null2String(params.get("salaryable"));
		String counttype = Util.null2String(params.get("counttype"));

		String sqlwhere = " ";
		if (!diffname.equals("")) {
			sqlwhere += " and diffname like '%";
			sqlwhere += Util.fromScreen2(diffname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!diffdesc.equals("")) {
			sqlwhere += " and diffdesc like '%";
			sqlwhere += Util.fromScreen2(diffdesc, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!workflowid.equals("") && !workflowid.equals("0")) {
			sqlwhere += " and workflowid =";
			sqlwhere += Util.fromScreen2(workflowid, user.getLanguage());
			sqlwhere += " ";
		}
		if (!salaryitem.equals("")) {
			sqlwhere += " and salaryitem =";
			sqlwhere += Util.fromScreen2(salaryitem, user.getLanguage());
			sqlwhere += " ";
		}
		if (!difftype.equals("")) {
			sqlwhere += " and difftype =" + Util.fromScreen2(difftype, user.getLanguage());
		}
		if (!difftime.equals("")) {
			sqlwhere += " and difftime =" + Util.fromScreen2(difftime, user.getLanguage());
		}
		if (!salaryable.equals("")) {
			sqlwhere += " and salaryable =" + Util.fromScreen2(salaryable, user.getLanguage());
		}

		if (!counttype.equals("")) {
			sqlwhere += " and counttype =" + Util.fromScreen2(counttype, user.getLanguage());
		}

		// 设置好搜索条件
		String backFields = " id ,diffname ";
		String fromSql = " HrmScheduleDiff ";

		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("100%",SystemEnv.getHtmlLabelName(399, user.getLanguage()),"diffname","diffname"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backFields,fromSql,sqlwhere,"","id",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
