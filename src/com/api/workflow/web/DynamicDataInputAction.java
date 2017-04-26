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
import com.api.workflow.service.DynamicDataInputService;

/**
 * 
 * @author sunf
 * 
 */
@Path("/workflow/datainput")
public class DynamicDataInputAction{

	/**
	 * 流程字段联动接口新
	 */
	@GET
	@Path("/dydinputfrom")
	@Produces(MediaType.TEXT_PLAIN)
	public String getWfStatusNew(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try{
			DynamicDataInputService dydinput = new DynamicDataInputService();
			apidatas = dydinput.getDataInput(request, response);
			return JSONObject.toJSONString(apidatas);
		}catch(Exception e){
			e.printStackTrace();
			apidatas.put("api_dydinputfrom", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSONObject.toJSONString(apidatas);
	}

}
