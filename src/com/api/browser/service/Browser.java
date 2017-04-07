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
	 * 查询浏览框需要加载的数据
	 * @param params 参数集合
	 * @return
	 */
	public Map<String,Object> getBrowserData(Map<String,Object> params) throws Exception;
	
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
	
	
	/**
	 * 获取browser查询条件条件数据
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Map<String,Object> getBrowserConditionDatas(Map<String,Object> params) throws Exception;

}
