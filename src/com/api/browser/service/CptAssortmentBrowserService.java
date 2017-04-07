package com.api.browser.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.cpt.maintenance.CapitalAssortmentComInfo;
import weaver.general.Util;

/**
 * 资产组
 * @author jhy Mar 27, 2017
 *
 */
public class CptAssortmentBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		String subId = Util.null2String(params.get("id"));
		String checkType = Util.null2String(params.get("checktype"));
		String onlyEndNode = Util.null2String(params.get("onlyendnode")); // 如果需要check是否仅仅只是没有孩子的节点
		String showCptCount = Util.null2String(params.get("showcptcount")); // 是否显示资产资料数量

		CapitalAssortmentComInfo rs = new CapitalAssortmentComInfo();
		rs.setTofirstRow();
		List<Map<String, Object>> nodes = new ArrayList<Map<String, Object>>();
		while (rs.next()) {
			String supCptAssortmentId = rs.getSupAssortmentId();
			if (supCptAssortmentId.equals(""))
				supCptAssortmentId = "0";
			if (!supCptAssortmentId.equals(subId))
				continue;

			String id = rs.getAssortmentId();
			String name = rs.getAssortmentName();
			String cptcount = rs.getCapitalCount();
			Map<String, Object> node = new HashMap<String, Object>();
			boolean flag = "y".equals(showCptCount.toLowerCase()) && Integer.parseInt(cptcount) > 0;
			node.put("title", flag ? name + " (" + cptcount + ")" : name);
			node.put("id", id);
			node.put("isParent", hasChild(id));
			nodes.add(node);
		}
		apidatas.put("data", nodes);
		return apidatas;
	}

	/**
	 * Description: 判断是否有子节点
	 * 
	 * @param id
	 *            需要验证的节点id
	 */
	private boolean hasChild(String id) throws Exception {
		CapitalAssortmentComInfo rs = new CapitalAssortmentComInfo();
		rs.setTofirstRow();
		while (rs.next()) {
			if (rs.getSupAssortmentId().equals(id))
				return true;
		}
		return false;
	}
}
