package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.conn.RecordSet;
import weaver.general.Util;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class SectorInfoService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {

		Map<String,Object> apidatas = new HashMap<String,Object>();
//		User user = (User) params.get("user");
//		String method = Util.null2String(params.get("method"));
		String id = Util.null2String(params.get("id"));
//		String name = Util.fromScreen(Util.null2String(params.get("name")),
//				user.getLanguage());
//		String desc = Util.fromScreen(Util.null2String(params.get("desc")),
//				user.getLanguage());
		String parentid = Util.null2String(params.get("parentid"));
		parentid = parentid.equals("") ? "0" : parentid;

		try {
			JSONArray jaresultList = new JSONArray();
			RecordSet rs = new RecordSet();
			RecordSet rs1 = new RecordSet();

			if (id.equals("")) {
				id = "0";
			}
			rs.executeProc("CRM_SectorInfo_SelectAll", id);

			while (rs.next()) {
				JSONObject json = new JSONObject();
				int _id = rs.getInt("id");
				String _fullname = rs.getString("fullname");
				String _description = rs.getString("description");
				int _parentid = rs.getInt("parentid");
				int _seclevel = rs.getInt("seclevel");
				String _sectors = rs.getString("sectors");
				json.put("id", Integer.valueOf(_id));
				json.put("name", _fullname);
				json.put("parentId", Integer.valueOf(_parentid));
				json.put("isParent", Boolean.valueOf(true));
				json.put("type", "sector");
				json.put("description", _description);
				json.put("seclevel", Integer.valueOf(_seclevel));
				json.put("sectors", _sectors);
				rs1.executeSql(" select count(0) c from CRM_SectorInfo where parentid="
						+ _id);
				if ((!rs1.next()) || (rs1.getInt("c") <= 0)) {
					json.put("isParent", Boolean.valueOf(false));
				}
				jaresultList.add(json);
			}
			apidatas.put("result", jaresultList);
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("result", Boolean.valueOf(false));
		}
		return apidatas;
	}
}
