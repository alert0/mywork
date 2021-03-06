package com.api.workflow.service;

import java.util.*;
import java.util.Hashtable;
import java.util.StringTokenizer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.conn.RecordSet;
import weaver.cpt.util.CommonShareManager;
import weaver.general.BaseBean;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import com.api.workflow.util.PageUidFactory;

/**
 * 项目浏览框接口
 * @author wuser0326
 *
 */
public class ProjectBrowserService extends BaseBean {

	/**
	 * 项目浏览框列表
	 * @param request
	 * @param response
	 * @return
	 */
	public Map<String,Object> getProjectList(HttpServletRequest request, HttpServletResponse response) {
		Map<String,Object> apidatas = new HashMap<String,Object>();
		User user = HrmUserVarify.getUser(request, response);

		String check_per = Util.null2String(request.getParameter("systemIds"));
		String resourceids = Util.null2String(request.getParameter("resourceids"));

		if (check_per.trim().startsWith(",")) {
			check_per = check_per.substring(1);
		}

		String name = Util.null2String(request.getParameter("name"));
		String from = Util.null2String(request.getParameter("from"));
		String description = Util.null2String(request.getParameter("description"));
		String prjtype = Util.null2String(request.getParameter("prjtype"));
		String worktype = Util.null2String(request.getParameter("worktype"));
		String manager = Util.null2String(request.getParameter("manager"));
		String status = Util.null2String(request.getParameter("status"));
		String statusAll = Util.null2String(request.getParameter("statusAll"));
		String sqlwhere = Util.null2String(request.getParameter("sqlwhere"));

		RecordSet recordSet = new RecordSet();

		String resourcenames = "";
		if (!check_per.equals("")) {
			String strtmp = "select id,name from Prj_ProjectInfo  where id in (" + check_per + ")";
			recordSet.executeSql(strtmp);
			Hashtable<String, String> ht = new Hashtable<String, String>();
			while (recordSet.next()) {
				ht.put(Util.null2String(recordSet.getString("id")), Util.null2String(recordSet.getString("name")));
			}
			try {
				StringTokenizer st = new StringTokenizer(check_per, ",");
				while (st.hasMoreTokens()) {
					String s = st.nextToken();
					resourceids += "," + s;
					resourcenames += "," + ht.get(s).toString();
				}
			} catch (Exception e) {
				resourceids = "";
				resourcenames = "";
			}
		}

		if (sqlwhere.equals("")) {
			sqlwhere += " where 1 = 1";
		}
		if (!name.equals("")) {
			sqlwhere += " and t1.name like '%" + Util.fromScreen2(name, user.getLanguage()) + "%' ";
		}
		if (!description.equals("")) {
			sqlwhere += " and t1.description like '%" + Util.fromScreen2(description, user.getLanguage()) + "%' ";
		}
		if (!prjtype.equals("")) {
			sqlwhere += " and t1.prjtype = " + prjtype;
		}
		if (!worktype.equals("")) {
			sqlwhere += " and t1.worktype = " + worktype;
		}
		if (!manager.equals("")) {
			sqlwhere += " and t1.manager = " + manager;
		}
		if (!status.equals("")) {
			sqlwhere += " and t1.status =" + status + " ";
		}
		if (!statusAll.equals("")) {
			sqlwhere += " and t1.status in (" + statusAll + ") ";
		}

		String permissionSql = "";
		CommonShareManager csm = new CommonShareManager();
		if ("prjtskimp".equalsIgnoreCase(from)) {
			permissionSql = " (" + csm.getPrjShareWhereByUserCanEdit(user) + ") ";
		} else {
			permissionSql = " (" + csm.getPrjShareWhereByUser(user) + ") ";
		}

		if (!sqlwhere.equals("")) {
			sqlwhere += " and " + permissionSql;
		}
		
		String backfields  = "t1.id, t1.name, t1.status,t1.prjtype,t1.worktype,t1.manager";
		String sqlfrom = "Prj_ProjectInfo t1 " + sqlwhere;
		
		String pageUid = PageUidFactory.getBrowserUID("prolist");
		
		String tableString = "<table instanceid='ProjectBrowserList' tabletype='none' pageUid =\"" + pageUid + "\">";
			   tableString += "	<sql backfields=\"" + backfields + "\" sqlform=\"" + Util.toHtmlForSplitPage(sqlfrom) + "\" sqlwhere=\"\"  sqlorderby=\"t1.id\"  sqlprimarykey=\"t1.id\" sqlsortway=\"desc\" sqlisdistinct=\"false\" />";
			   tableString += " <head>"+
			   				  "		<col hide=\"true\" width=\"5%\" text=\"\" column=\"id\"/>" +
			   				  "		<col width=\"20%\" text=\""+SystemEnv.getHtmlLabelNames("195",user.getLanguage())+"\" column=\"name\" orderkey=\"name\" />"+ 
			   				  "		<col width=\"20%\" text=\""+SystemEnv.getHtmlLabelNames("586",user.getLanguage())+"\" column=\"prjtype\"  display=\"true\"  transmethod=\"weaver.proj.Maint.ProjectTypeComInfo.getProjectTypename\"/>"+ 
			   				  " 	<col width=\"20%\" text=\""+SystemEnv.getHtmlLabelNames("432",user.getLanguage())+"\" column=\"worktype\"  display=\"true\"  transmethod=\"weaver.proj.Maint.ProjectTypeComInfo.getProjectTypename\" />"+ 
			   				  " 	<col width=\"20%\" text=\""+SystemEnv.getHtmlLabelNames("144",user.getLanguage())+"\" column=\"manager\"  display=\"true\"  transmethod=\"weaver.hrm.resource.ResourceComInfo.getResourcename\" />"+
			   				  " 	<col width=\"20%\" text=\""+SystemEnv.getHtmlLabelNames("587",user.getLanguage())+"\" column=\"status\"  display=\"true\"  transmethod=\"weaver.proj.Maint.ProjectStatusComInfo.getProjectStatusdesc\"/>"+
			   				  " </head>"+
			   				  "</table>";
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
