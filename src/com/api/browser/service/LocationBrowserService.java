package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 办公地点
 * 
 * @author jhy Mar 28, 2017
 * 
 */
public class LocationBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String locationname = Util.null2String(params.get("locationname"));
		String locationdesc = Util.null2String(params.get("locationdesc"));
		String address = Util.null2String(params.get("address"));
		String sqlwhere = " ";
		if (!locationname.equals("")) {
			sqlwhere += " and locationname like '%";
			sqlwhere += Util.fromScreen2(locationname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!locationdesc.equals("")) {
			sqlwhere += " and locationdesc like '%";
			sqlwhere += Util.fromScreen2(locationdesc, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!address.equals("")) {
			sqlwhere += " and (address1 like '%";
			sqlwhere += Util.fromScreen2(address, user.getLanguage());
			sqlwhere += "%')";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		int perpage = 10;
		// 设置好搜索条件
		String backFields = " id ,locationname,locationdesc,address1 ";
		String fromSql = " HrmLocations ";
		String orderBy = " showOrder ";
		
		String tableString="<table pagesize=\""+perpage+"\" tabletype=\"none\">"+
							"<sql backfields=\""+backFields+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" sqlorderby=\""+orderBy+"\"  sqlprimarykey=\"id\" sqlsortway=\"asc\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere)+"\" />"+
							"<head>"+
								"<col width=\"10%\"  text=\""+SystemEnv.getHtmlLabelName(84,user.getLanguage())+"\"  column=\"id\" />"+
								"<col width=\"25%\"  text=\""+SystemEnv.getHtmlLabelName(399,user.getLanguage())+"\" column=\"locationname\" orderkey=\"locationname\" />"+
								"<col width=\"25%\"  text=\""+SystemEnv.getHtmlLabelName(15767,user.getLanguage())+"\" column=\"locationdesc\" orderkey=\"locationdesc\" />"+
								"<col width=\"40%\"  text=\""+SystemEnv.getHtmlLabelName(110,user.getLanguage())+"\" column=\"address1\" orderkey=\"address1\" />"+
							"</head>"+
							"</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
