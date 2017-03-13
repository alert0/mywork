package com.api.workflow.web;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.alibaba.fastjson.JSONObject;

import com.api.workflow.bean.RequestListParam;
import com.api.workflow.service.RequestDoingService;
import com.api.workflow.service.RequestDoneService;
import com.api.workflow.service.RequestListParamService;
import com.api.workflow.service.RequestListService;
import com.api.workflow.service.RequestMineService;

/**
 * 流程列表分页数据action
 * @author liuzy 2016/12/06
 */
@Path("/workflow/reqlist")
public class RequestListAction {

	@GET
	@Path("/list")
	@Produces(MediaType.TEXT_PLAIN)
	public String execute(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try{
			String actiontype = request.getParameter("actiontype");
			String viewScope = request.getParameter("viewScope");
			//基础信息，包括树信息及分组信息
			if("baseinfo".equals(actiontype) && "doing".equals(viewScope))	
				apidatas = new RequestDoingService().getBaseInfo(request, response);
			else if("baseinfo".equals(actiontype) && "done".equals(viewScope))
				apidatas = new RequestDoneService().getBaseInfo(request, response);
			else if("baseinfo".equals(actiontype) && "mine".equals(viewScope))
				apidatas = new RequestMineService().getBaseInfo(request, response);
			//计数信息，包括树计算和全部流程计数
			else if("countinfo".equals(actiontype) && "doing".equals(viewScope))
				apidatas = new RequestDoingService().getCountInfo(request, response);
			else if("countinfo".equals(actiontype) && "done".equals(viewScope))
				apidatas = new RequestDoneService().getCountInfo(request, response);
			else if("countinfo".equals(actiontype) && "mine".equals(viewScope))
				apidatas = new RequestMineService().getCountInfo(request, response);
			//分页列表信息
			else if("splitpage".equals(actiontype)){
				RequestListParamService paramservice = new RequestListParamService();
				RequestListParam parambean = paramservice.generateParams(request, response);
				
				RequestListService listservice = new RequestListService();
				apidatas = listservice.searchResult(parambean, request);
			}else
				throw new Exception("actiontype unexist");
		}catch(Exception e){
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSONObject.toJSONString(apidatas);
	}
}
