package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

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
		String tableString = "";
		int perpage=10;                                 
		String backfields = " id,templetName,updatedate,status,( case status when 1 then 225 when 2 then 2242 else 220 end) statuslabel ";
		String fromSql  = " Prj_Template ";

		tableString =   " <table instanceid=\"BrowseTable\" id=\"BrowseTable\" tabletype=\"none\" pagesize=\""+perpage+"\" >"+
		                "       <sql backfields=\""+backfields+"\" sqlform=\""+fromSql+"\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere)+"\"  sqlorderby=\""+orderby+"\"  sqlprimarykey=\"id\" sqlsortway=\"desc\" sqlisdistinct=\"true\" />"+
		                "       <head>"+
		                "           <col width=\"0%\" hide='true'  text=\""+"ID"+"\" column=\"id\"    />"+
		                "           <col width=\"50%\"  text=\""+SystemEnv.getHtmlLabelName(18151,user.getLanguage())+"\" column=\"templetName\" orderkey=\"templetName\"   />"+
		                "           <col width=\"30%\"  text=\""+SystemEnv.getHtmlLabelName(602,user.getLanguage())+"\" column=\"statuslabel\" orderkey=\"statuslabel\" transmethod='weaver.systeminfo.SystemEnv.getHtmlLabelNames' otherpara='"+""+user.getLanguage()+"'   />"+
		                "           <col width=\"20%\"  text=\""+SystemEnv.getHtmlLabelName(19521,user.getLanguage())+"\" column=\"updatedate\" orderkey=\"updatedate\"  />"+
		                "       </head>"+
		                " </table>";
		
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
