package com.api.workflow.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import weaver.common.util.xtree.TreeNode;
import weaver.conn.RecordSet;
import weaver.docs.category.MultiCategoryTree;
import weaver.docs.category.security.MultiAclManager;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.city.CityComInfo;
import weaver.systeminfo.SystemEnv;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.api.workflow.util.PageUidFactory;
import com.cloudstore.api.util.Util_Log;
import com.cloudstore.dev.api.util.Util_TableMap;

public class RoleService {

	/**
	 * 获取角色列表
	 * 
	 * **/
	public Map<String, Object> getRoleBean(HttpServletRequest request,
			HttpServletResponse response) {
		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = HrmUserVarify.getUser(request, response);
		int ishead = 0;
		String rolesname = Util.null2String(request.getParameter("name"));
		String rolesmark = Util
				.null2String(request.getParameter("description"));
		String sqlwhere = Util.null2String(request.getParameter("sqlwhere"));
		if (!sqlwhere.equals(""))
			ishead = 1;
		if (!rolesname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where rolesname like '%"
						+ Util.fromScreen2(rolesname, user.getLanguage())
						+ "%' ";
			} else
				sqlwhere += " and rolesname like '%"
						+ Util.fromScreen2(rolesname, user.getLanguage())
						+ "%' ";
		}
		if (!rolesmark.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where rolesmark like '%"
						+ Util.fromScreen2(rolesmark, user.getLanguage())
						+ "%' ";
			} else
				sqlwhere += " and rolesmark like '%"
						+ Util.fromScreen2(rolesmark, user.getLanguage())
						+ "%' ";
		}

		if (!rolesmark.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where rolesmark like '%"
						+ Util.fromScreen2(rolesmark, user.getLanguage())
						+ "%' ";
			} else
				sqlwhere += " and rolesmark like '%"
						+ Util.fromScreen2(rolesmark, user.getLanguage())
						+ "%' ";
		}
		// String sqlstr = "select  from HrmRoles "
		// + sqlwhere
		// + " order by rolesmark";

		// 暂时先写死sql语句，后期拓展
		String pageUid =PageUidFactory.getBrowserUID("rolelist"); 

		String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\""
				+ pageUid
				+ "\">"
				+ "<sql backfields=\""
				+ "id,rolesname,rolesmark"// backfields
				+ "\" sqlform=\""
				+ Util.toHtmlForSplitPage("HrmRoles")
				+ "\" sqlwhere=\""
				+ sqlwhere
				+ "\"  sqlorderby=\""
				+ "rolesmark"
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"asc\"/>"
				+ "<head>"
				+ "   <col width=\"0%\"  text=\""
				+ "id"
				+ "\" display=\"false\" orderkey=\"id\" column=\"id\"/>"
				+ "   <col width=\"40%\"  text=\""
				+ "角色名称"
				+ "\" display=\"true\" orderkey=\"rolesmark\" column=\"rolesmark\"/>"
				+ "   <col width=\"60%\"  text=\""
				+ "说明"
				+ "\" display=\"true\" orderkey=\"rolesname\" column=\"rolesname\"/>"
				+ "</head>" + "</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

	/**
	 * 获取国家列表
	 * 
	 * **/
	public Map<String, Object> getCountryList(HttpServletRequest request,
			HttpServletResponse response) {
		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = HrmUserVarify.getUser(request, response);
		// String imagefilename = "/images/hdSystem_wev8.gif";
		// String titlename = SystemEnv.getHtmlLabelName(377,
		// user.getLanguage());
		// String needfav = "1";
		// String needhelp = "";

		String sqlwhere1 = Util.null2String(request.getParameter("sqlwhere"));
		String countryname = Util.null2String(request.getParameter("name"));
		String countrydesc = Util.null2String(request
				.getParameter("countrydesc"));
		String sqlwhere = " ";
		int ishead = 0;
		if (!sqlwhere1.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += sqlwhere1;
			}
		}
		if (ishead == 1) {
			sqlwhere += " and (canceled is null or canceled = 0) ";
		} else {
			ishead = 1;
			sqlwhere += " where (canceled is null or canceled = 0) ";
		}
		if (!countryname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where countryname like '%";
				sqlwhere += Util.fromScreen2(countryname, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and countryname like '%";
				sqlwhere += Util.fromScreen2(countryname, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		if (!countrydesc.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where countrydesc like '%";
				sqlwhere += Util.fromScreen2(countrydesc, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and countrydesc like '%";
				sqlwhere += Util.fromScreen2(countrydesc, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		String pageUid = PageUidFactory.getBrowserUID("hrmcountrylist");

		String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\""
				+ pageUid
				+ "\">"
				+ "<sql backfields=\""
				+ "id,countryname,countrydesc"// backfields
				+ "\" sqlform=\""
				+ Util.toHtmlForSplitPage("HrmCountry")
				+ "\" sqlwhere=\""
				+ sqlwhere
				+ "\"  sqlorderby=\""
				+ "id"
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>"
				+ "<head>"
				+ "   <col width=\"0%\"  text=\""
				+ "id"
				+ "\" display=\"false\" orderkey=\"id\" column=\"id\"/>"
				+ "   <col width=\"40%\"  text=\""
				+ "简称"
				+ "\" display=\"true\" orderkey=\"countryname\" column=\"countryname\"/>"
				+ "   <col width=\"60%\"  text=\""
				+ "国家"
				+ "\" display=\"true\" orderkey=\"countrydesc\" column=\"countrydesc\"/>"
				+ "</head>" + "</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

	/**
	 * 获取状态列表
	 * 
	 * **/
	public Map<String, Object> getCustomerStatusList(
			HttpServletRequest request, HttpServletResponse response) {
		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = HrmUserVarify.getUser(request, response);
		// String imagefilename = "/images/hdSystem_wev8.gif";
		// String titlename = SystemEnv.getHtmlLabelName(377,
		// user.getLanguage());
		// String needfav = "1";
		// String needhelp = "";

		String sqlwhere1 = Util.null2String(request.getParameter("sqlwhere"));
		String fullname = Util.null2String(request.getParameter("name"));
		String description = Util.null2String(request
				.getParameter("description"));
		String sqlwhere = " ";
		int ishead = 0;
		if (!sqlwhere1.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += sqlwhere1;
			}
		}
		if (!fullname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		if (!description.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		String pageUid = PageUidFactory.getBrowserUID("customerstatuslist");

		String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\""
				+ pageUid
				+ "\">"
				+ "<sql backfields=\""
				+ "id,fullname,description"// backfields
				+ "\" sqlform=\""
				+ Util.toHtmlForSplitPage("CRM_CustomerStatus")
				+ "\" sqlwhere=\""
				+ sqlwhere
				+ "\"  sqlorderby=\""
				+ "id"
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>"
				+ "<head>"
				+ "   <col width=\"10%\"  text=\""
				+ "id"
				+ "\" orderkey=\"id\" column=\"id\"/>"
				+ "   <col width=\"35%\"  text=\""
				+ "简称"
				+ "\" display=\"true\" orderkey=\"fullname\" column=\"fullname\"/>"
				+ "   <col width=\"55%\"  text=\""
				+ "描述"
				+ "\" display=\"true\" orderkey=\"description\" column=\"description\"/>"
				+ "</head>" + "</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

	/**
	 * 获取客户类型
	 * 
	 * **/
	public Map<String, Object> getCustomerTypeList(HttpServletRequest request,
			HttpServletResponse response) {
		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = HrmUserVarify.getUser(request, response);
		// String imagefilename = "/images/hdSystem_wev8.gif";
		// String titlename = SystemEnv.getHtmlLabelName(377,
		// user.getLanguage());
		// String needfav = "1";
		// String needhelp = "";

		String sqlwhere1 = Util.null2String(request.getParameter("sqlwhere"));
		String fullname = Util.null2String(request.getParameter("name"));
		String description = Util.null2String(request
				.getParameter("description"));
		String sqlwhere = " ";
		int ishead = 0;
		if (!sqlwhere1.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += sqlwhere1;
			}
		}
		if (!fullname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		if (!description.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		String pageUid = PageUidFactory.getBrowserUID("customertypelist");

		String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\""
				+ pageUid
				+ "\">"
				+ "<sql backfields=\""
				+ "id,fullname,description"// backfields
				+ "\" sqlform=\""
				+ Util.toHtmlForSplitPage("CRM_CustomerType")
				+ "\" sqlwhere=\""
				+ sqlwhere
				+ "\"  sqlorderby=\""
				+ "id"
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>"
				+ "<head>"
				+ "   <col width=\"10%\"  text=\""
				+ "id"
				+ "\" orderkey=\"id\" column=\"id\"/>"
				+ "   <col width=\"35%\"  text=\""
				+ "简称"
				+ "\" display=\"true\" orderkey=\"fullname\" column=\"fullname\"/>"
				+ "   <col width=\"55%\"  text=\""
				+ "描述"
				+ "\" display=\"true\" orderkey=\"description\" column=\"description\"/>"
				+ "</head>" + "</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

	/**
	 * 获取描述列表
	 * 
	 * **/
	public Map<String, Object> getCustomerDescList(HttpServletRequest request,
			HttpServletResponse response) {
		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = HrmUserVarify.getUser(request, response);
		// String imagefilename = "/images/hdSystem_wev8.gif";
		// String titlename = SystemEnv.getHtmlLabelName(377,
		// user.getLanguage());
		// String needfav = "1";
		// String needhelp = "";

		String sqlwhere1 = Util.null2String(request.getParameter("sqlwhere"));
		String fullname = Util.null2String(request.getParameter("name"));
		String description = Util.null2String(request
				.getParameter("description"));
		String sqlwhere = " ";
		int ishead = 0;
		if (!sqlwhere1.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += sqlwhere1;
			}
		}
		if (!fullname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		if (!description.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		String pageUid = PageUidFactory.getBrowserUID("customerdesclist");

		String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\""
				+ pageUid
				+ "\">"
				+ "<sql backfields=\""
				+ "id,fullname,description"// backfields
				+ "\" sqlform=\""
				+ Util.toHtmlForSplitPage("CRM_CustomerDesc")
				+ "\" sqlwhere=\""
				+ sqlwhere
				+ "\"  sqlorderby=\""
				+ "id"
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>"
				+ "<head>"
				+ "   <col width=\"0%\"  text=\""
				+ "id"
				+ "\" orderkey=\"id\" column=\"id\"/>"
				+ "   <col width=\"35%\"  text=\""
				+ "简称"
				+ "\" display=\"true\" orderkey=\"fullname\" column=\"fullname\"/>"
				+ "   <col width=\"55%\"  text=\""
				+ "描述"
				+ "\" display=\"true\" orderkey=\"description\" column=\"description\"/>"
				+ "</head>" + "</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

	// /**
	// * 获取客户规模列表
	// *
	// * **/
	// public Map<String, Object> getCustomerSizeList(HttpServletRequest
	// request,
	// HttpServletResponse response) {
	// // TODO Auto-generated method stub
	// Map<String, Object> apidatas = new HashMap<String, Object>();
	// User user = HrmUserVarify.getUser(request, response);
	// // String imagefilename = "/images/hdSystem_wev8.gif";
	// // String titlename = SystemEnv.getHtmlLabelName(377,
	// // user.getLanguage());
	// // String needfav = "1";
	// // String needhelp = "";
	//
	// String sqlwhere1 = Util.null2String(request.getParameter("sqlwhere"));
	// String fullname = Util.null2String(request.getParameter("name"));
	// String description = Util.null2String(request
	// .getParameter("description"));
	// String sqlwhere = " ";
	// int ishead = 0;
	// if (!sqlwhere1.equals("")) {
	// if (ishead == 0) {
	// ishead = 1;
	// sqlwhere += sqlwhere1;
	// }
	// }
	// if (!fullname.equals("")) {
	// if (ishead == 0) {
	// ishead = 1;
	// sqlwhere += " where fullname like '%";
	// sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
	// sqlwhere += "%'";
	// } else {
	// sqlwhere += " and fullname like '%";
	// sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
	// sqlwhere += "%'";
	// }
	// }
	// if (!description.equals("")) {
	// if (ishead == 0) {
	// ishead = 1;
	// sqlwhere += " where description like '%";
	// sqlwhere += Util.fromScreen2(description, user.getLanguage());
	// sqlwhere += "%'";
	// } else {
	// sqlwhere += " and description like '%";
	// sqlwhere += Util.fromScreen2(description, user.getLanguage());
	// sqlwhere += "%'";
	// }
	// }
	// String pageUid = PageUidFactory.getBrowserUID("customersizelist");
	//
	// String tableString =
	// "<table instanceid='BrowseTable' tabletype='none' pageUid =\""
	// + pageUid
	// + "\">"
	// + "<sql backfields=\""
	// + "id,fullname,description"// backfields
	// + "\" sqlform=\""
	// + Util.toHtmlForSplitPage("CRM_CustomerSize")
	// + "\" sqlwhere=\""
	// + sqlwhere
	// + "\"  sqlorderby=\""
	// + "id"
	// + "\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>"
	// + "<head>"
	// + "   <col width=\"0%\"  text=\""
	// + "id"
	// + "\" orderkey=\"id\" column=\"id\"/>"
	// + "   <col width=\"35%\"  text=\""
	// + "简称"
	// + "\" display=\"true\" orderkey=\"fullname\" column=\"fullname\"/>"
	// + "   <col width=\"55%\"  text=\""
	// + "描述"
	// + "\" display=\"true\" orderkey=\"description\" column=\"description\"/>"
	// + "</head>" + "</table>";
	// String sessionkey = Util.getEncrypt(Util.getRandom());
	// Util_TableMap.setVal(sessionkey, tableString);
	// apidatas.put("result", sessionkey);
	// return apidatas;
	// }

	/*
	 * 通过type 获得对应sql
	 */
	public Map<String, Object> getCustomerObjList(HttpServletRequest request,
			HttpServletResponse response, String type) {
		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = HrmUserVarify.getUser(request, response);
		// String imagefilename = "/images/hdSystem_wev8.gif";
		// String titlename = SystemEnv.getHtmlLabelName(377,
		// user.getLanguage());
		// String needfav = "1";
		// String needhelp = "";

		String sqlwhere1 = Util.null2String(request.getParameter("sqlwhere"));
		String fullname = Util.null2String(request.getParameter("name"));
		String description = Util.null2String(request
				.getParameter("description"));
		String sqlwhere = " ";
		int ishead = 0;
		if (!sqlwhere1.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += sqlwhere1;
			}
		}
		if (!fullname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		if (!description.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		String pageUid = PageUidFactory.getBrowserUID(type);
		String sqlfrom = getSqlFrom(type);
		String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\""
				+ pageUid
				+ "\">"
				+ "<sql backfields=\""
				+ "id,fullname,description"// backfields
				+ "\" sqlform=\""
				+ Util.toHtmlForSplitPage(sqlfrom)
				+ "\" sqlwhere=\""
				+ sqlwhere
				+ "\"  sqlorderby=\""
				+ "id"
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>"
				+ "<head>"
				+ "   <col width=\"0%\"  text=\""
				+ "id"
				+ "\" orderkey=\"id\" column=\"id\"/>"
				+ "   <col width=\"35%\"  text=\""
				+ "简称"
				+ "\" display=\"true\" orderkey=\"fullname\" column=\"fullname\"/>"
				+ "   <col width=\"55%\"  text=\""
				+ "描述"
				+ "\" display=\"true\" orderkey=\"description\" column=\"description\"/>"
				+ "</head>" + "</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

	private static String getSqlFrom(String type) {
		// TODO Auto-generated method stub
		if ("customerstatuslist".equals(type)) {
			return "CRM_CustomerStatus";
		} else if ("customertypelist".equals(type)) {
			return "CRM_CustomerType";
		} else if ("customerdesclist".equals(type)) {
			return "CRM_CustomerDesc";
		} else if ("customersizelist".equals(type)) {
			return "CRM_CustomerSize";
		}
		return "";
	}

	public Map<String, Object> getProjectTypeList(HttpServletRequest request,
			HttpServletResponse response) {
		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = HrmUserVarify.getUser(request, response);
		String sqlwhere1 = Util.null2String(request.getParameter("sqlwhere"));
		String fullname = Util.null2String(request.getParameter("name"));
		String description = Util.null2String(request
				.getParameter("description"));
		String sqlwhere = " ";
		int ishead = 0;
		if (!sqlwhere1.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += sqlwhere1;
			}
		}
		if (!fullname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		if (!description.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		String orderby = " dsporder ";
		String tableString = "";
		int perpage = 10;
		String backfields = " id,fullname,description,wfid,dsporder";
		String fromSql = " Prj_ProjectType ";
		String pageUid = PageUidFactory.getBrowserUID("projecttypeList");
		tableString = " <table instanceid=\"BrowseTable\" pageUid =\""
				+ pageUid
				+ "\" id=\"BrowseTable\" tabletype=\"none\" pagesize=\""
				+ perpage
				+ "\" >"
				+ "       <sql backfields=\""
				+ backfields
				+ "\" sqlform=\""
				+ fromSql
				+ "\" sqlwhere=\""
				+ Util.toHtmlForSplitPage(sqlwhere)
				+ "\"  sqlorderby=\""
				+ orderby
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"asc\" sqlisdistinct=\"true\" />"
				+ "       <head>"
				+ "           <col width=\"0%\" hide='true'  text=\""
				+ "ID"
				+ "\" column=\"id\"    />"
				+ "           <col width=\"25%\"  text=\""
				+ SystemEnv.getHtmlLabelNames("399", user.getLanguage())
				+ "\" column=\"fullname\" orderkey=\"fullname\"   />"
				+ "           <col width=\"30%\"  text=\""
				+ SystemEnv.getHtmlLabelNames("433", user.getLanguage())
				+ "\" column=\"description\" orderkey=\"description\"  />"
				+ "           <col width=\"30%\"  text=\""
				+ SystemEnv.getHtmlLabelNames("15057", user.getLanguage())
				+ "\" column=\"wfid\" orderkey=\"wfid\" transmethod='weaver.workflow.workflow.WorkflowComInfo.getWorkflowname'  />"
				+ "       </head>" + " </table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

	public Map<String, Object> getWorkTypeList(HttpServletRequest request,
			HttpServletResponse response) {
		// TODO Auto-generated method stub
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = HrmUserVarify.getUser(request, response);
		String sqlwhere1 = Util.null2String(request.getParameter("sqlwhere"));
		String fullname = Util.null2String(request.getParameter("name"));
		String description = Util.null2String(request
				.getParameter("description"));
		String sqlwhere = " ";

		int ishead = 0;
		if (!sqlwhere1.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += sqlwhere1;
			}
		}
		if (!fullname.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and fullname like '%";
				sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		if (!description.equals("")) {
			if (ishead == 0) {
				ishead = 1;
				sqlwhere += " where description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			} else {
				sqlwhere += " and description like '%";
				sqlwhere += Util.fromScreen2(description, user.getLanguage());
				sqlwhere += "%'";
			}
		}
		String pageUid = PageUidFactory.getBrowserUID("worktypeList");
		String orderby = " id ";
		String tableString = "";
		int perpage = 10;
		String backfields = " id,fullname,description";
		String fromSql = " Prj_WorkType ";

		tableString = " <table instanceid=\"BrowseTable\" pageUid=\""
				+ pageUid
				+ "\""
				+ " id=\"BrowseTable\" tabletype=\"none\" pagesize=\""
				+ perpage
				+ "\" >"
				+ "       <sql backfields=\""
				+ backfields
				+ "\" sqlform=\""
				+ fromSql
				+ "\" sqlwhere=\""
				+ Util.toHtmlForSplitPage(sqlwhere)
				+ "\"  sqlorderby=\""
				+ orderby
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"asc\" sqlisdistinct=\"true\" />"
				+ "       <head>"
				+ "           <col width=\"0%\" hide='true'  text=\""
				+ "ID"
				+ "\" column=\"id\"    />"
				+ "           <col width=\"25%\"  text=\""
				+ SystemEnv.getHtmlLabelNames("399", user.getLanguage())
				+ "\" column=\"fullname\" orderkey=\"fullname\"   />"
				+ "           <col width=\"50%\"  text=\""
				+ SystemEnv.getHtmlLabelNames("433", user.getLanguage())
				+ "\" column=\"description\" orderkey=\"description\"  />"
				+ "       </head>" + " </table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

	public Map<String, Object> sectorInfolist(HttpServletRequest request,
			HttpServletResponse response) {
		Map apidatas = new HashMap();
		User user = HrmUserVarify.getUser(request, response);
		String method = Util.null2String(request.getParameter("method"));
		String id = Util.null2String(request.getParameter("id"));
		String name = Util.fromScreen(request.getParameter("name"),
				user.getLanguage());
		String desc = Util.fromScreen(request.getParameter("desc"),
				user.getLanguage());
		String parentid = Util.null2String(request.getParameter("parentid"));
		parentid = parentid.equals("") ? "0" : parentid;

		String sectors = "";
		try {
			JSONArray jaresultList = new JSONArray();
			RecordSet rs = new RecordSet();
			RecordSet rs1 = new RecordSet();

			if (id.equals("")) {
				id = "0";
			}
			rs.executeProc("CRM_SectorInfo_SelectAll", id);

			if (rs.getFlag() != 1) {
				response.sendRedirect("/CRM/DBError.jsp?type=FindData");
			} else {
				while (rs.next()) {
					JSONObject json = new JSONObject();
					int _id = rs.getInt("id");
					String _fullname = rs.getString("fullname");
					String _description = rs.getString("description");
					int _parentid = rs.getInt("parentid");
					int _seclevel = rs.getInt("seclevel");
					String _sectors = rs.getString("sectors");
					json.put("id", Integer.valueOf(_id));
					json.put("name", _fullname);
					json.put("parentId", Integer.valueOf(_parentid));
					json.put("isParent", Boolean.valueOf(true));
					json.put("type", "sector");
					json.put("description", _description);
					json.put("seclevel", Integer.valueOf(_seclevel));
					json.put("sectors", _sectors);
					rs1.executeSql(" select count(0) c from CRM_SectorInfo where parentid="
							+ _id);
					if ((!rs1.next()) || (rs1.getInt("c") <= 0)) {
						json.put("isParent", Boolean.valueOf(false));
					}
					jaresultList.add(json);
				}

				apidatas.put("result", jaresultList);
				return apidatas;
			}
		} catch (IOException e) {
			e.printStackTrace();

			apidatas.put("result", Boolean.valueOf(false));
		}
		return apidatas;
	}

	public Map<String, Object> countryXmllist(HttpServletRequest request,
			HttpServletResponse response) {
		Map apidatas = new HashMap();
		apidatas.put("result", false);
		User user = HrmUserVarify.getUser(request, response);
		if (user == null)
			return apidatas;
		String type = Util.null2String(request.getParameter("type"));
		String id = Util.null2String(request.getParameter("id"));
		String nodeid = Util.null2String(request.getParameter("nodeid"));
		String init = Util.null2String(request.getParameter("init"));
		try {
			CityComInfo cci = new CityComInfo();
			if ("".equals(type))
				type = "glob";
			TreeNode envelope = new TreeNode();
			envelope.setTitle("envelope");

			if ((!init.equals("")) && (id.equals(""))) {
				envelope = cci.getCityTreeList(envelope, "glob", "0", 3);
			} else {
				envelope = cci.getCityTreeList(envelope, type, id, 1);
			}

			JSONArray TreeNodeArray = JSONArray.parseArray(JSON
					.toJSONString(envelope.getTreeNode()));
			for (int i = 0; i < TreeNodeArray.size(); i++) {
				JSONObject jo = TreeNodeArray.getJSONObject(i);
				boolean needgetId = false;
				if (jo.containsKey("nodeXmlSrc")) {
					jo.put("isParent", true);
					String xmlString = jo.getString("nodeXmlSrc");
					if (-1 < xmlString.indexOf(".jsp?")) {
						String[] list = xmlString.substring(
								xmlString.indexOf(".jsp?") + 5).split("&");
						for (int j = 0; j < list.length; j++) {
							String[] typelist = list[j].split("=");
							if ("type".equals(typelist[0])) {
								jo.put("type", typelist[1]);
							}

							if ("id".equals(typelist[0])) {
								jo.put("id", typelist[1]);
							}

						}
						needgetId = true;
					}
				}
				if (!needgetId) {
					jo.put("isParent", false);
					String nodeId = jo.getString("nodeId");
					String[] nodeidlist = nodeId.split("_");
					jo.put("id", nodeidlist[1]);
					jo.put("type", nodeidlist[0]);
				}
				jo.put("name", jo.getString("title"));
				TreeNodeArray.set(i, jo);
			}
			apidatas.put("result", TreeNodeArray);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return apidatas;
	}

	public Map<String, Object> categoryBrowserlist(HttpServletRequest request,
			HttpServletResponse response) {
		Util_Log l = new Util_Log();
		Map apidatas = new HashMap();
		apidatas.put("result", Boolean.valueOf(false));
		User user = HrmUserVarify.getUser(request, response);
		if (user == null)
			return apidatas;
		int categoryid = Util.getIntValue(request.getParameter("categoryid"),
				-1);
		int categorytype = Util.getIntValue(
				request.getParameter("categorytype"), -1);
		int operationcode = Util.getIntValue(
				request.getParameter("operationcode"), -1);
		String categoryname = Util.null2String(request
				.getParameter("categoryname"));
		String currentSecId = Util.null2String(request
				.getParameter("currentSecId"));
		String id = Util.null2String(request.getParameter("id"));
		if ("".equals(id))
			id = "0";
		Map params = new HashMap();
		params.put("currentSecId", currentSecId);
		MultiAclManager am = new MultiAclManager();
		if ((categoryid != -1) && (categorytype != -1)) {
			if (!am.hasPermission(categoryid, categorytype, user.getUID(),
					user.getType(), Util.getIntValue(user.getSeclevel(), 0),
					operationcode)) {
				return apidatas;
			}
		}
		MultiCategoryTree tree = am.getPermittedTree(user.getUID(),
				user.getType(), Util.getIntValue(user.getSeclevel(), 0),
				operationcode, categoryname, -1, params);
		JSONObject McgTree = JSONObject.parseObject(JSON.toJSONString(tree));
		JSONArray McgTreeList = McgTree.getJSONArray("allCategories");
		JSONArray McgNewTreeList = new JSONArray();
		for (int i = 0; i < McgTreeList.size(); i++) {

			if ("0".equals(id) || "-1".equals(id)) {
				if ("-1".equals(McgTreeList.getJSONObject(i).getString(
						"parentid"))
						|| "0".equals(McgTreeList.getJSONObject(i).getString(
								"parentid"))) {
					McgNewTreeList.add(McgTreeList.getJSONObject(i));
				}
			} else {
				if (id.equals(McgTreeList.getJSONObject(i)
						.getString("parentid"))) {
					McgNewTreeList.add(McgTreeList.getJSONObject(i));
				}

			}

		}

		if (McgNewTreeList.size() != 0) {
			for (int i = 0; i < McgNewTreeList.size(); i++) {
				McgNewTreeList.set(
						i,
						getAllTreeList(McgTreeList,
								McgNewTreeList.getJSONObject(i)));
			}
			apidatas.put("result", McgNewTreeList);
		} else {
			apidatas.put("result", McgTreeList);
		}

		return apidatas;
	}

	private JSONObject getAllTreeList(JSONArray mcgTreeList,
			JSONObject parentObject) {
		parentObject.put("isParent", Boolean.valueOf(false));
		String id = parentObject.getString("id");
		for (int i = 0; i < mcgTreeList.size(); i++) {
			if (id.equals(mcgTreeList.getJSONObject(i).getString("parentid"))) {
				parentObject.put("isParent", Boolean.valueOf(true));
			}

		}

		return parentObject;
	}
}
