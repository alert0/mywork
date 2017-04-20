package com.api.browser.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import weaver.general.BaseBean;

public abstract class BrowserService extends BaseBean implements Browser {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		return null;
	}

	@Override
	public Map<String, Object> getTreeNodeData(Map<String, Object> params) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> getBrowserConditionInfo(Map<String, Object> params) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> getBrowserData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return null;
	}

	@Override
	public Map<String, Object> browserAutoComplete(String type,HttpServletRequest request, HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
	
	
}
