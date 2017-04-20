package com.api.browser.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 浏览框数据接口
 * @author jhy Mar 24, 2017
 *
 */
public interface Browser {
	
	/**
	 * 自动提示查询的数据总数
	 */
	public static final int PAGENUM = 30;
	
	/**
	 * 获取浏览框数据
	 * @param params 参数集合
	 * @return
	 */
	public Map<String,Object> getBrowserData(Map<String,Object> params) throws Exception;
	
	/**
	 * 获取浏览框查询条件
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Map<String,Object> getBrowserConditionInfo(Map<String,Object> params) throws Exception;
	
	/**
	 * 浏览框自动提示
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Map<String, Object> browserAutoComplete(String type,HttpServletRequest request,HttpServletResponse response) throws Exception;
	
	/**
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public Map<String,Object> getBrowserData(HttpServletRequest request,HttpServletResponse response) throws Exception;
	
	/**
	 * 获取树子节点数据
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Map<String,Object> getTreeNodeData(Map<String,Object> params) throws Exception;
	
	

}
