package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import weaver.general.BaseBean;
import weaver.hrm.User;

public abstract class BrowserService extends BaseBean implements Browser {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		return apidatas;
	}

	@Override
	public Map<String, Object> getTreeNodeData(Map<String, Object> params) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> getBrowserConditionDatas(Map<String, Object> params) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> getBrowserData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return null;
	}
}
