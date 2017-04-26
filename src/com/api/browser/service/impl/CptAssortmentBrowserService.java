package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.cpt.maintenance.CapitalAssortmentComInfo;
import weaver.general.Util;

import com.api.browser.bean.BrowserTreeNode;
import com.api.browser.service.BrowserService;
import com.api.browser.util.BrowserConstant;
import com.api.browser.util.BrowserDataType;

/**
 * 资产组
 * @author jhy Mar 27, 2017
 *
 */
public class CptAssortmentBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		String parentId = Util.null2s(Util.null2String(params.get("id")),"0");
		String checkType = Util.null2String(params.get("checktype"));
		String onlyEndNode = Util.null2String(params.get("onlyendnode")); // 如果需要check是否仅仅只是没有孩子的节点
		String showCptCount = Util.null2String(params.get("showcptcount")); // 是否显示资产资料数量

		CapitalAssortmentComInfo rs = new CapitalAssortmentComInfo();
		rs.setTofirstRow();
		List<BrowserTreeNode> nodes = new ArrayList<BrowserTreeNode>();
		while (rs.next()) {
			String supCptAssortmentId = Util.null2String(rs.getSupAssortmentId(),"0");
			if (!supCptAssortmentId.equals(parentId))
				continue;

			String id = rs.getAssortmentId();
			String name = rs.getAssortmentName();
			String cptcount = rs.getCapitalCount();
			boolean flag = "y".equals(showCptCount.toLowerCase()) && Integer.parseInt(cptcount) > 0;
			String _name  = flag ? name + " (" + cptcount + ")" : name;
			boolean isParent  = hasChild(id);
			nodes.add(new BrowserTreeNode(id,_name,parentId,isParent));
		}
		apidatas.put(BrowserConstant.BROWSER_RESULT_TYPE, BrowserDataType.TREE_DATA.getTypeid());
		apidatas.put(BrowserConstant.BROWSER_RESULT_DATA, nodes);
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
