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
 * 计量单位
 * @author jhy Mar 28, 2017
 *
 */
public class LgcAssetUnitBrowserService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String unitname = Util.null2String(params.get("unitname"));
		String unitdesc = Util.null2String(params.get("unitdesc"));
		String sqlwhere = " ";
		if(!unitname.equals("")){
				sqlwhere += " and unitname like '%";
				sqlwhere += Util.fromScreen2(unitname,user.getLanguage());
				sqlwhere += "%'";
		}
		if(!unitdesc.equals("")){
				sqlwhere += " and unitdesc like '%";
				sqlwhere += Util.fromScreen2(unitdesc,user.getLanguage());
				sqlwhere += "%'";
		}
		String backfields = " id,unitname,unitdesc ";
		String fromSql= "LgcAssetUnit";
		String orderby = " id ";

		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("50%",SystemEnv.getHtmlLabelName(195, user.getLanguage()),"unitname","unitname"));
		cols.add(new SplitTableColBean("50%",SystemEnv.getHtmlLabelName(85, user.getLanguage()),"unitdesc","unitdesc"));
		
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,orderby,"id",cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}

}
