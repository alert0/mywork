package com.api.browser.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.util.SqlUtils;

/**
 * 学历
 * @author jhy Mar 29, 2017
 * 
 */
public class EduLevelBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String name = Util.null2String(params.get("name"));
		String description = Util.null2String(params.get("description"));
		String sqlwhere = " ";
		if (!name.equals("")) {
			sqlwhere += " and name like '%";
			sqlwhere += Util.fromScreen2(name, 7);
			sqlwhere += "%'";
		}
		if (!description.equals("")) {
			sqlwhere += " and description like '%";
			sqlwhere += Util.fromScreen2(description, 7);
			sqlwhere += "%'";
		}
		sqlwhere = SqlUtils.replaceFirstAnd(sqlwhere);
		
		
		//设置表头
		List<Map<String,Object>> columns = new ArrayList<Map<String,Object>>();
		Map<String,Object> column = new HashMap<String,Object>();
		column.put("dataIndex", "name");
		column.put("title", SystemEnv.getHtmlLabelName(195,user.getLanguage()));
		columns.add(column);
		
		column = new HashMap<String,Object>();
		column.put("dataIndex", "description");
		column.put("title", SystemEnv.getHtmlLabelName(433,user.getLanguage()));
		columns.add(column);
		
		column = new HashMap<String,Object>();
		column.put("dataIndex", "id");
		column.put("hide", true);
		columns.add(column);
		
		apidatas.put("columns", columns);
		//加载数据
		RecordSet rs  = new RecordSet();
		rs.executeSql("select id,name,description from HrmEducationLevel " + sqlwhere);
		List<Map<String,Object>> datas = new ArrayList<Map<String,Object>>();
		Map<String,Object> eduInfo = null;
		while(rs.next()){
			eduInfo = new HashMap<String,Object>();
			eduInfo.put("id", rs.getString("id"));
			eduInfo.put("name", rs.getString("name"));
			eduInfo.put("description", rs.getString("description"));
			datas.add(eduInfo);
		}
		
		apidatas.put("datas", datas);
		return apidatas;
	}
}
