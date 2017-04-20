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

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.company.DepartmentComInfo;
import weaver.hrm.company.SubCompanyComInfo;
import weaver.hrm.resource.MutilResourceBrowser;
import weaver.hrm.resource.ResourceComInfo;

import com.alibaba.fastjson.JSONObject;

/**
 * 
 * @author jhy Mar 30, 2017
 * 
 */
@Path("/workflow/org")
public class LoadOrgResourceService {

	@GET
	@Path("/resource")
	@Produces(MediaType.TEXT_PLAIN)
	public String getOrgResource(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		String types = Util.null2String(request.getParameter("types"));
		User user = HrmUserVarify.getUser(request, response);
		if ("".equals(types))
			return "";
		String[] typeArr = types.split(",");
		List<Map<String, Object>> apidatas = new ArrayList<Map<String, Object>>();
		try {
			MutilResourceBrowser mrb = new MutilResourceBrowser();
			ResourceComInfo rcomInfo = new ResourceComInfo();
			DepartmentComInfo deptComInfo = new DepartmentComInfo();
			SubCompanyComInfo subCompanyComInfo = new SubCompanyComInfo();
			String alllevel = "1";
			String isNoAccount = "1";
			String sqlwhere = "";
			String resourceids = "";

			for (String typeInfo : typeArr) {
				String[] typeInfoArr = typeInfo.split("\\|");
				if (typeInfoArr.length > 1) {
					String type = typeInfoArr[0];
					String id = typeInfoArr[1];
					if (type.equals("subcom") || type.equals("dept") || type.equals("com")) {
						// 部门
						String nodeid = type + "_" + id;
						if (Integer.parseInt(id) < 0) {
							// 虚拟
							resourceids = mrb.getComDeptResourceVirtualIds(nodeid, alllevel, isNoAccount, user, sqlwhere);
						} else {
							resourceids = mrb.getComDeptResourceIds(nodeid, alllevel, isNoAccount, user, sqlwhere);
						}
					} else if (type.equals("group")) {// 自定义组
						resourceids = mrb.getGroupResourceIds(id, isNoAccount, user, sqlwhere);
					}

					String[] resourceidArr = Util.TokenizerString2(resourceids, ",");
					List<Map<String, Object>> users = new ArrayList<Map<String, Object>>();
					for (String resourceid : resourceidArr) {
						if ("".equals(Util.null2String(resourceid)))
							continue;
						users.add(getUserInfo(resourceid,rcomInfo,deptComInfo,subCompanyComInfo));
					}

					Map<String, Object> typeresult = new HashMap<String, Object>();
					typeresult.put("id", id);
					typeresult.put("type", type);
					typeresult.put("users", users);
					typeresult.put("nodeid", type + "_" + id + "x");
					apidatas.add(typeresult);
				} else {
					if ("".equals(Util.null2String(typeInfo)))
						continue;
					apidatas.add(getUserInfo(typeInfo,rcomInfo,deptComInfo,subCompanyComInfo));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return JSONObject.toJSONString(apidatas);
	}
	
	private Map<String, Object> getUserInfo(String userid,ResourceComInfo rcomInfo,DepartmentComInfo deptComInfo,SubCompanyComInfo subCompanyComInfo) throws Exception{
		Map<String, Object> userInfo = new HashMap<String, Object>();
		userInfo.put("id", userid);
		userInfo.put("lastname", rcomInfo.getLastname(userid));
		userInfo.put("jobtitlename", MutilResourceBrowser.getJobTitlesname(userid));
		userInfo.put("icon", rcomInfo.getMessagerUrls(userid));
		userInfo.put("type", "resource");
		userInfo.put("nodeid", "resource_" + userid + "x");
		userInfo.put("departmentname", deptComInfo.getDepartmentname(rcomInfo.getDepartmentID(userid)));
		String subcompanyid  = deptComInfo.getSubcompanyid1(rcomInfo.getDepartmentID(userid));
		String parentsubcompanyid  = subCompanyComInfo.getSupsubcomid(subcompanyid);
		userInfo.put("subcompanyname", subCompanyComInfo.getSubcompanyname(subcompanyid));
		userInfo.put("supsubcompanyname", subCompanyComInfo.getSubcompanyname(parentsubcompanyid));
		return userInfo;
	}
	
	@GET
	@Path("/selectMaxRight")
	@Produces(MediaType.TEXT_PLAIN)
	public String getSelectOperatorsMax(@Context HttpServletRequest request, @Context HttpServletResponse response){
		User user = HrmUserVarify.getUser (request , response) ;
		RecordSet rs = new RecordSet();
		rs.execute("select * from hrmrolemembers where roleid=126 and resourceid=" + user.getUID());
		Map<String, Object> apidatas = new HashMap<String,Object>();
		apidatas.put("right", rs.next());
		return JSONObject.toJSONString(apidatas);
	}
}
