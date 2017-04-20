package com.api.browser.service.impl;

import java.util.HashMap;
import java.util.Map;

import weaver.docs.category.MultiCategoryTree;
import weaver.docs.category.security.MultiAclManager;
import weaver.general.Util;
import weaver.hrm.User;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.api.browser.service.BrowserService;

/**
 * 获取文档目录数据
 * @author jhy Mar 27, 2017
 *
 */
public class DocCategoryService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {

		Map<String, Object> apidatas = new HashMap<String, Object>();
		apidatas.put("result", Boolean.valueOf(false));
		User user = (User) params.get("user");
		if (user == null)
			return apidatas;
		int categoryid = Util.getIntValue(Util.null2String(params.get("categoryid")),
				-1);
		int categorytype = Util.getIntValue(
				Util.null2String(params.get("categorytype")), -1);
		int operationcode = Util.getIntValue(
				Util.null2String(params.get("operationcode")), -1);
		String categoryname = Util.null2String(params.get("categoryname"));
		String currentSecId = Util.null2String(params.get("currentSecId"));
		String id = Util.null2String(params.get("id"));
		if ("".equals(id))
			id = "0";
		Map<String,Object> queryParams = new HashMap<String,Object>();
		queryParams.put("currentSecId", currentSecId);
		MultiAclManager am = new MultiAclManager();
		if ((categoryid != -1) && (categorytype != -1)) {
			if (!am.hasPermission(categoryid, categorytype, user.getUID(),
					user.getType(), Util.getIntValue(user.getSeclevel(), 0),
					operationcode)) {
				return apidatas;
			}
		}
		MultiCategoryTree tree = am.getPermittedTree(user.getUID(),
				user.getType(), Util.getIntValue(user.getSeclevel(), 0),
				operationcode, categoryname, -1, queryParams);
		JSONObject McgTree = JSONObject.parseObject(JSON.toJSONString(tree));
		JSONArray McgTreeList = McgTree.getJSONArray("allCategories");
		JSONArray McgNewTreeList = new JSONArray();
		for (int i = 0; i < McgTreeList.size(); i++) {

			if ("0".equals(id) || "-1".equals(id)) {
				if ("-1".equals(McgTreeList.getJSONObject(i).getString(
						"parentid"))
						|| "0".equals(McgTreeList.getJSONObject(i).getString(
								"parentid"))) {
					McgNewTreeList.add(McgTreeList.getJSONObject(i));
				}
			} else {
				if (id.equals(McgTreeList.getJSONObject(i)
						.getString("parentid"))) {
					McgNewTreeList.add(McgTreeList.getJSONObject(i));
				}

			}

		}

		if (McgNewTreeList.size() != 0) {
			for (int i = 0; i < McgNewTreeList.size(); i++) {
				McgNewTreeList.set(
						i,
						getAllTreeList(McgTreeList,
								McgNewTreeList.getJSONObject(i)));
			}
			apidatas.put("result", McgNewTreeList);
		} else {
			apidatas.put("result", McgTreeList);
		}

		return apidatas;
	}
	
	private JSONObject getAllTreeList(JSONArray mcgTreeList,
			JSONObject parentObject) {
		parentObject.put("isParent", Boolean.valueOf(false));
		String id = parentObject.getString("id");
		for (int i = 0; i < mcgTreeList.size(); i++) {
			if (id.equals(mcgTreeList.getJSONObject(i).getString("parentid"))) {
				parentObject.put("isParent", Boolean.valueOf(true));
			}

		}

		return parentObject;
	}

}
