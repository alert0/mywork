package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.docs.category.CommonCategory;
import weaver.docs.category.MultiCategoryTree;
import weaver.docs.category.security.MultiAclManager;
import weaver.general.Util;
import weaver.hrm.User;

import com.api.browser.service.BrowserService;
import com.api.browser.util.BrowserConstant;
import com.api.browser.util.BrowserDataType;

/**
 * 获取文档目录数据
 * 
 * @author jhy Mar 27, 2017
 * 
 */
public class DocCategoryService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		int categoryid = Util.getIntValue(Util.null2String(params.get("categoryid")), -1);
		int categorytype = Util.getIntValue(Util.null2String(params.get("categorytype")), -1);
		int operationcode = Util.getIntValue(Util.null2String(params.get("operationcode")), -1);
		String categoryname = Util.null2String(params.get("categoryname"));
		String currentSecId = Util.null2String(params.get("currentSecId"));
		String id = Util.null2String(params.get("id"));
		int _pid = Util.getIntValue(Util.null2String(id),-1);
		
		apidatas.put(BrowserConstant.BROWSER_RESULT_TYPE, BrowserDataType.TREE_DATA.getTypeid());
		Map<String, Object> queryParams = new HashMap<String, Object>();
		queryParams.put("currentSecId", currentSecId);
		MultiAclManager am = new MultiAclManager();
		if ((categoryid != -1) && (categorytype != -1)) {
			if (!am.hasPermission(categoryid, categorytype, user.getUID(), user.getType(), Util.getIntValue(user.getSeclevel(), 0), operationcode)) {
				apidatas.put(BrowserConstant.BROWSER_RESULT_DATA, null);
				return apidatas;
			}
		}
		
		boolean isLoadAll = "1".equals(Util.null2String(params.get("isLoadAll")));
		MultiCategoryTree tree = am.getPermittedTree(user.getUID(), user.getType(), Util.getIntValue(user.getSeclevel(), 0), operationcode, categoryname, -1, queryParams);
		apidatas.put(BrowserConstant.BROWSER_RESULT_DATA, getDocDirList(tree.allCategories,_pid,isLoadAll));
		return apidatas;
	}


	
	
	public List<CategoryTreeNode> getDocDirList(List<CommonCategory> docDirList,int pid,boolean isLoadAll){
		List<CategoryTreeNode> nodes  =  new ArrayList<CategoryTreeNode>();
		for(CommonCategory category:docDirList){
			if(pid == -1 && (category.parentid == 0 || category.parentid == -1)){
				CategoryTreeNode node  =  new CategoryTreeNode(category);
				if(isLoadAll){
					node.setSubs(getDocDirList(docDirList,category.id,isLoadAll));
				}else{
					node.setIsParent(hasChild(docDirList,category.id));
				}
				nodes.add(node);
			}else if(pid == category.parentid){
				CategoryTreeNode node  =  new CategoryTreeNode(category);
				if(isLoadAll){
					node.setSubs(getDocDirList(docDirList,category.id,isLoadAll));
				}else{
					node.setIsParent(hasChild(docDirList,category.id));
				}
				nodes.add(node);
			}
		}
		return nodes;
	}
	
	private boolean hasChild(List<CommonCategory> docDirList,int pid){
		for(CommonCategory category:docDirList){
			if(category.parentid == pid){
				return true;
			}
		}
		return false;
	}
	
	class CategoryTreeNode extends CommonCategory{
		private List<CategoryTreeNode> subs;
		private boolean isParent;
		
		public CategoryTreeNode(CommonCategory category){
			this.id = category.id;
			this.name = category.name;
			this.type = category.type;
			this.superiorid = category.superiorid;
			this.superiortype = category.superiortype;
			this.orderid = category.orderid;
		}

		public List<CategoryTreeNode> getSubs() {
			return subs;
		}

		public void setSubs(List<CategoryTreeNode> subs) {
			this.subs = subs;
			this.isParent = (subs != null && subs.size() > 0);
		}

		public boolean getIsParent() {
			return isParent;
		}
		public void setIsParent(boolean isParent) {
			this.isParent = isParent;
		}
	}
}
