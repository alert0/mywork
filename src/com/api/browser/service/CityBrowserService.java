package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.common.util.xtree.TreeNode;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.hrm.city.CityComInfo;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * 获取城市信息
 * @author jhy Mar 27, 2017
 *
 */
public class CityBrowserService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserConditionDatas(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		apidatas.put("result", false);
		if (user == null)
			return apidatas;
		String type = Util.null2String(params.get("type"));
		String id = Util.null2String(params.get("id"));
		String nodeid = Util.null2String(params.get("nodeid"));
		String init = Util.null2String(params.get("init"));
		try {
			CityComInfo cci = new CityComInfo();
			if ("".equals(type))
				type = "glob";
			TreeNode envelope = new TreeNode();
			envelope.setTitle("envelope");

			if ((!init.equals("")) && (id.equals(""))) {
				envelope = cci.getCityTreeList(envelope, "glob", "0", 3);
			} else {
				envelope = cci.getCityTreeList(envelope, type, id, 1);
			}

			JSONArray TreeNodeArray = JSONArray.parseArray(JSON
					.toJSONString(envelope.getTreeNode()));
			for (int i = 0; i < TreeNodeArray.size(); i++) {
				JSONObject jo = TreeNodeArray.getJSONObject(i);
				boolean needgetId = false;
				if (jo.containsKey("nodeXmlSrc")) {
					jo.put("isParent", true);
					String xmlString = jo.getString("nodeXmlSrc");
					if (-1 < xmlString.indexOf(".jsp?")) {
						String[] list = xmlString.substring(
								xmlString.indexOf(".jsp?") + 5).split("&");
						for (int j = 0; j < list.length; j++) {
							String[] typelist = list[j].split("=");
							if ("type".equals(typelist[0])) {
								jo.put("type", typelist[1]);
							}

							if ("id".equals(typelist[0])) {
								jo.put("id", typelist[1]);
							}

						}
						needgetId = true;
					}
				}
				if (!needgetId) {
					jo.put("isParent", false);
					String nodeId = jo.getString("nodeId");
					String[] nodeidlist = nodeId.split("_");
					jo.put("id", nodeidlist[1]);
					jo.put("type", nodeidlist[0]);
				}
				jo.put("name", jo.getString("title"));
				TreeNodeArray.set(i, jo);
			}
			apidatas.put("result", TreeNodeArray);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return apidatas;
	}

}
