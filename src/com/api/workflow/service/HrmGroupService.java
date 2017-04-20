package com.api.workflow.service;

import java.util.ArrayList;
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
import weaver.hrm.company.DepartmentComInfo;
import weaver.hrm.company.SubCompanyComInfo;
import weaver.hrm.group.HrmGroupTreeComInfo;
import weaver.hrm.resource.MutilResourceBrowser;
import weaver.hrm.resource.ResourceComInfo;

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
		        	apidatas.put("count", allresourceArray[0].split(",").length);
		        }
		    }
		} else {
			ResourceComInfo rcomInfo = new ResourceComInfo();
			DepartmentComInfo deptComInfo = new DepartmentComInfo();
			SubCompanyComInfo subCompanyComInfo = new SubCompanyComInfo();
			List<Map<String, String>> grouplist = hrmgrpcominfo.getHrmGroup(user);
			List<Map<String,Object>> newgrouplist =  new ArrayList<Map<String,Object>>();
			if (grouplist != null && grouplist.size() > 0) {
				for(Map<String, String> group:grouplist){
					Map<String,Object> newgroup = new HashMap<String,Object>();
					String[] idArr  = Util.null2String(group.get("ids")).split(",");
					if(idArr.length > 0){
						List<Map<String,String>> users = new ArrayList<Map<String,String>>();
						Map<String,String> userInfo = null;
						for(String resourceid:idArr){
							userInfo = new HashMap<String,String>();
							userInfo.put("id", resourceid);
							userInfo.put("lastname", rcomInfo.getLastname(resourceid));
							userInfo.put("jobtitlename", MutilResourceBrowser.getJobTitlesname(resourceid));
							userInfo.put("icon", rcomInfo.getMessagerUrls(resourceid));
							userInfo.put("type", "resource");
							userInfo.put("departmentname", deptComInfo.getDepartmentname(rcomInfo.getDepartmentID(resourceid)));
							String subcompanyid  = deptComInfo.getSubcompanyid1(rcomInfo.getDepartmentID(resourceid));
							String parentsubcompanyid  = subCompanyComInfo.getSupsubcomid(subcompanyid);
							userInfo.put("subcompanyname", subCompanyComInfo.getSubcompanyname(subcompanyid));
							userInfo.put("supsubcompanyname", subCompanyComInfo.getSubcompanyname(parentsubcompanyid));
							users.add(userInfo);
						}
						newgroup.put("users", users);
					}
					newgroup.put("id", group.get("typeid"));
					newgroup.put("type", "group");
					newgroup.put("nodeid", "group_" + group.get("typeid") + "x");
					newgroup.put("lastname", group.get("typename"));
					newgroup.put("grouptype", group.get("type"));
					newgroup.put("names", group.get("names"));
					newgrouplist.add(newgroup);
				}
				apidatas.put("datas", newgrouplist);
			}else{
				apidatas.put("count","1");
			}
		}
		return JSON.toJSONString(apidatas);
	}
}
