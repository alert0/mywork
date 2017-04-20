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
 * 项目模板
 * @author jhy Mar 28, 2017
 *
 */
public class ProjectTempletBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		
		String fullname = Util.null2String(params.get("fullname"));
		String status = Util.null2String(params.get("status"));
		String updatedate = Util.null2String(params.get("updatedate"));
		String updatedate1 = Util.null2String(params.get("updatedate1"));
		String sqlwhere = " ";
		if(!"".equals(status)){
			sqlwhere+=" and status='"+status+"' ";
		}
		if(!"".equals(fullname)){
			sqlwhere+=" and templetName like '%"+fullname+"%' ";
		}
		if(!"".equals(updatedate)){
			sqlwhere+=" and updatedate >='"+updatedate+"' ";
		}
		if(!"".equals(updatedate1)){
			sqlwhere+=" and updatedate <='"+updatedate1+"' ";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		String orderby =" updatedate ";
		String backfields = " id,templetName,updatedate,status,( case status when 1 then 225 when 2 then 2242 else 220 end) statuslabel ";
		String fromSql  = " Prj_Template ";

		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("50%",SystemEnv.getHtmlLabelName(18151, user.getLanguage()),"templetName","templetName"));
		cols.add(new SplitTableColBean("30%",SystemEnv.getHtmlLabelName(602, user.getLanguage()),"statuslabel","statuslabel","weaver.systeminfo.SystemEnv.getHtmlLabelNames",String.valueOf(user.getLanguage())));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(19521, user.getLanguage()),"updatedate","updatedate"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,orderby,"id",cols);
		tableBean.setSqlisdistinct("true");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
