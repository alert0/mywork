package com.api.workflow.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.group.HrmGroupTreeComInfo;

import com.alibaba.fastjson.JSON;

/**
 * 人员常用组相关接口
 * @author jhy Mar 20, 2017
 *
 */
@Path("/workflow/hrmgroup")
public class HrmGroupService {
	
	@GET
	@Path("/datas")
	@Produces(MediaType.TEXT_PLAIN)
	public String getHrmGroups(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		Map<String,Object> apidatas = new HashMap<String,Object>();
		User user = HrmUserVarify.getUser (request , response) ;
		if(user==null) {
		    response.sendRedirect("/login/Login.jsp");
		    return "";
		}
		int isgetallres = Util.getIntValue(Util.null2String(request.getParameter("isgetallres")), 0);
		HrmGroupTreeComInfo hrmgrpcominfo = new HrmGroupTreeComInfo();
		if (isgetallres == 1) {
		    String[] allresourceArray = hrmgrpcominfo.getResourceAll(user);
		    if (allresourceArray != null && allresourceArray.length > 0) {
		    	apidatas.put("ids", allresourceArray[0]);
		        if (allresourceArray[0] != null) {
		        	apidatas.put("count", allresourceArray[0].split(",").length + "");
		        }
		    }
		} else {
			List<Map<String, String>> grouplist = hrmgrpcominfo.getHrmGroup(user);
			if (grouplist != null && grouplist.size() > 0) {
				apidatas.put("datas", grouplist);
			}else{
				apidatas.put("count","1");
			}
		}
		return JSON.toJSONString(apidatas);
	}
}
