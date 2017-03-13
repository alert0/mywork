package com.api.workflow.web;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.alibaba.fastjson.JSONObject;
import com.api.workflow.service.CustomerBrowserService;
import com.api.workflow.service.DocBrowserService;
import com.api.workflow.service.OrganizationBrowserService;
import com.api.workflow.service.ProjectBrowserService;
import com.api.workflow.service.RoleService;
import com.api.workflow.service.WorkflowBrowserService;

/**
 * 浏览框组件
 * 
 * @author wuser0326
 * 
 */
@Path("/workflow/browser")
public class BrowserAction{

	@GET
	@Path("/browserdata")
	@Produces(MediaType.TEXT_PLAIN)
	public String execute(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try {
			String actiontype = request.getParameter("actiontype");
			if ("wflist".equals(actiontype)) { // 路径
				apidatas = new WorkflowBrowserService().getWorkflowList(request, response);
			} else if ("wftypelist".equals(actiontype)) { // 路径类型
				apidatas = new WorkflowBrowserService().getWorkflowTypeList(request, response);
			} else if ("orgtree".equals(actiontype)) { // 组织机构
				apidatas = new OrganizationBrowserService().getCompanyTree(request, response);
			} else if ("suborglist".equals(actiontype)) { // 获取下级机构
				apidatas = new OrganizationBrowserService().getSubOrgList(request, response);
			} else if ("cuslist".equals(actiontype)) { // 相关客户
				apidatas = new CustomerBrowserService().getCustomerList(request, response);
			} else if ("prolist".equals(actiontype)) { // 相关项目
				apidatas = new ProjectBrowserService().getProjectList(request, response);
			} else if("doclist".equals(actiontype)){
				apidatas = new DocBrowserService().getDocList(request, response);
			} else if ("rolelist".equals(actiontype)) { // 角色
				apidatas = new RoleService().getRoleBean(request, response);
			} else if ("hrmCounList".equals(actiontype)) { // 国家
				apidatas = new RoleService().getCountryList(request, response);
			} else if ("customerstatuslist".equals(actiontype)) { // 客户状态
				apidatas = new RoleService().getCustomerObjList(request,
						response, actiontype);
			} else if ("customertypelist".equals(actiontype)) { // 客户类型
				apidatas = new RoleService().getCustomerObjList(request,
						response, actiontype);
			} else if ("customerdesclist".equals(actiontype)) { // 客户描述
				apidatas = new RoleService().getCustomerObjList(request,
						response, actiontype);
			} else if ("customersizelist".equals(actiontype)) { // 客户规模
				apidatas = new RoleService().getCustomerObjList(request,
						response, actiontype);
			} else if ("projecttypelist".equals(actiontype)) { // 项目类型
				apidatas = new RoleService().getProjectTypeList(request,
						response);
			} else if ("worktypelist".equals(actiontype)) { // 工作类型
				apidatas = new RoleService().getWorkTypeList(request,
						response);
			} else if ("sectorInfolist".equals(actiontype)) { // 行业
				apidatas = new RoleService().sectorInfolist(request, response);
			} else if ("countryXmllist".equals(actiontype)) {
				apidatas = new RoleService().countryXmllist(request, response);
			} else if ("categoryBrowserlist".equals(actiontype)) {
				apidatas = new RoleService().categoryBrowserlist(request,
						response);
			}
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSONObject.toJSONString(apidatas);
	}

}
