package com.api.browser.web;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;

import weaver.conn.RecordSet;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;

import com.alibaba.fastjson.JSONObject;
import com.api.browser.service.Browser;
/**
 * 浏览框接口
 * @author jhy Mar 29, 2017
 *
 */
@Path("/workflow/browser01")
public class BrowserAction {

	public static final Map<String, String> BROWSER_CONFIG = new HashMap<String, String>();
	
	private static Object lock=new Object();
	
	//初始化配置
	static {
		synchronized(lock){
			RecordSet rs=new RecordSet();
			rs.executeSql("select type,clazz from wf_browser_config");
			while(rs.next()){
				BROWSER_CONFIG.put(rs.getString(1), rs.getString(2));
			}
		}
	}

	@GET
	@Path("/{type}")
	public String getBrowserData(@PathParam("type") String type, @Context HttpServletRequest request, @Context HttpServletResponse response) {
		Map<String, Object> params = new HashMap<String, Object>();
		Enumeration<String> em = request.getParameterNames();
		while(em.hasMoreElements()){
			String paramname = em.nextElement();
			params.put(paramname, request.getParameter(paramname));
		}
		String f_weaver_belongto_userid = request.getParameter("f_weaver_belongto_userid");
		String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");// 需要增加的代码
		User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);// 需要增加的代码
		params.put("user", user);
		String browserClassName = BROWSER_CONFIG.get(type);
		Map<String, Object> apidatas = new HashMap<String, Object>();

		try {
			Browser browser = (Browser) Class.forName(browserClassName).newInstance();
			apidatas = browser.getBrowserData(params);
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}

		return JSONObject.toJSONString(apidatas);
	}
	
	@GET
	@Path("/node/{type}")
	public String getTreeNodeData(@PathParam("type") String type, @Context HttpServletRequest request, @Context HttpServletResponse response) {
		Map<String, Object> params = new HashMap<String, Object>();
		Enumeration<String> em = request.getParameterNames();
		while(em.hasMoreElements()){
			String paramname = em.nextElement();
			params.put(paramname, request.getParameter(paramname));
		}		
		User user = HrmUserVarify.getUser(request, response);
		params.put("user", user);
		String browserClassName = BROWSER_CONFIG.get(type);
		Map<String, Object> apidatas = new HashMap<String, Object>();

		try {
			Browser browser = (Browser) Class.forName(browserClassName).newInstance();
			apidatas = browser.getTreeNodeData(params);
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}

		return JSONObject.toJSONString(apidatas);
	}
	
}
