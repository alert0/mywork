package com.api.workflow.service;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import weaver.conn.RecordSet;
import weaver.general.BaseBean;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import com.api.workflow.util.PageUidFactory;

import com.cloudstore.dev.api.util.Util_TableMap;

public class WorkflowBrowserService extends BaseBean {

	/**
	 * 流程Browser-列表
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public Map<String,Object> getWorkflowList(HttpServletRequest request, HttpServletResponse response) {
		User user = HrmUserVarify.getUser(request, response);

//		boolean isopenos = RequestUtil.isOpenOtherSystemToDo();
//		String showos = Util.null2String(request.getParameter("showos"));

		String propertyOfApproveWorkFlow = Util.null2String(request.getParameter("propertyOfApproveWorkFlow"));
		String sqlwhere1 = Util.null2String(request.getParameter("sqlwhere"));
		String fullname = Util.null2String(request.getParameter("name"));
		String description = Util.null2String(request.getParameter("description"));
		int typeid = Util.getIntValue(request.getParameter("typeid"), 0);

		String sqlwhere = " where (istemplate<>'1' or istemplate is null) and isvalid = '1' ";
		//String sqlwhereos = " where cancel=0 ";
		if ("htmllayoutchoose".equals(Util.null2String(request.getParameter("from")))) {
			sqlwhere = " where 1=1 ";
			//sqlwhereos = " where 1=2 ";
		}
		if (!sqlwhere1.equals("")) {
			sqlwhere += sqlwhere1;
		}
		if (typeid != 0) {
			sqlwhere += " and workflowtype='" + typeid + "' ";
			//sqlwhereos += " and sysid=" + typeid;
		}
		if (!fullname.equals("")) {
			sqlwhere += " and workflowname like '%" + Util.fromScreen2(fullname, user.getLanguage()) + "%' ";
			//sqlwhereos += " and workflowname like '%" + Util.fromScreen2(fullname, user.getLanguage()) + "%' ";
		}
		if (!description.equals("")) {
			sqlwhere += " and workflowdesc like '%" + Util.fromScreen2(description, user.getLanguage()) + "%' ";
			//sqlwhereos += " and 1=2 ";
		}
		if ("contract".equals(propertyOfApproveWorkFlow)) {
			sqlwhere += " and formid = 49 and isbill = 1";
			//sqlwhereos += " and 1=2 ";
		}

		String backfields = "id,workflowname,workflowdesc,workflowtype";
		String sqlfrom = "(select id,workflowname,workflowdesc,workflowtype from workflow_base " + sqlwhere;
//		if (isopenos && showos.equals("1")) {
//			sqlfrom += " union select workflowid as id ,workflowname, '' as workflowdesc,sysid as workflowtype from ofs_workflow " + sqlwhereos;
//		}
		sqlfrom += " ) t";
		String orderby = "id";

// oa名称判断
//		RequestUtil rutil = new RequestUtil();
//		OfsSettingObject oso = rutil.getOfsSetting();
//		String showtype = Util.null2String(oso.getShowsysname(), "0");
//		String systemname = "";
//		if (showtype.equals("1")) {
//			systemname = oso.getOashortname();
//		} else if (showtype.equals("2")) {
//			systemname = oso.getOafullname();
//		}

		String pageUid = PageUidFactory.getBrowserUID("wflist");
		String tableString = "<table instanceid=\"workflowbrowserlist\" tabletype=\"none\" pageUid =\"" + pageUid + "\" pagesize=\"10\">";
		tableString += " <sql backfields=\"" + backfields + "\" sqlform=\"" + Util.toHtmlForSplitPage(sqlfrom) + "\" sqlwhere=\"\"  sqlorderby=\"" + orderby
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"asc\" sqlisdistinct=\"false\" />";
		tableString += "<head>";
		tableString += "<col width=\"20%\" text=\"" + SystemEnv.getHtmlLabelName(84, user.getLanguage()) + "\" column=\"id\" />";
		tableString += "<col width=\"40%\" text=\"" + SystemEnv.getHtmlLabelName(399, user.getLanguage()) + "\" column=\"workflowname\" />";
		tableString += "<col width=\"40%\" text=\"" + SystemEnv.getHtmlLabelName(433, user.getLanguage()) + "\" column=\"workflowdesc\" />";
//		if (!showtype.equals("0") && showos.equals("1")) {
//			tableString += "<col width=\"20%\" text=\"" + SystemEnv.getHtmlLabelName(84, user.getLanguage()) + "\" column=\"workflowtype\" orderkey=\"\" otherpara=\"" + showtype + "+" + systemname
//					+ "\" transmethod=\"com.api.workflow.service.WorkflowBrowserService.getSystemname\"/>";
//		}
		tableString += "</head>";
		tableString += "</table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		Map<String,Object> apidatas = new HashMap<String,Object>();
		apidatas.put("result", sessionkey);
		return apidatas;
	}

	/**
	 * 获取系统名称
	 * 
	 * @param sysidstr
	 * @param param
	 * @return
	 */
	public String getSystemname(String sysidstr, String param) {
		String[] tempStr = Util.splitString(param, "+");
		String type = tempStr[0];
		String oasystemname = tempStr[1];
		int sysid = Util.getIntValue(sysidstr, 0);
		String systemname = "";
		if (sysid < 0) {
			RecordSet rs = new RecordSet();
			rs.executeSql("select sysshortname,sysfullname from ofs_sysinfo where sysid=" + sysid);
			if (rs.next()) {
				if (type.equals("1")) {
					systemname = rs.getString(1);
				} else if (type.equals("2")) {
					systemname = rs.getString(2);
				} else {
					systemname = "";
				}
			}
		} else {
			systemname = oasystemname;
		}
		return systemname;
	}

	/**
	 * 流程Browser-树形
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public Map<String,Object> getWorkflowTree(HttpServletRequest request, HttpServletResponse response) {
		Map<String,Object> apidatas = new HashMap<String,Object>();
		return apidatas;
	}

	public Map<String,Object> getWorkflowTypeList(HttpServletRequest request, HttpServletResponse response) {
		Map<String,Object> apidatas = new HashMap<String,Object>();
		User user = HrmUserVarify.getUser(request, response);

		String fullname = Util.null2String(request.getParameter("name"));
		String description = Util.null2String(request.getParameter("description"));
//		boolean isopenos = RequestUtil.isOpenOtherSystemToDo();
//		String showos = Util.null2String(request.getParameter("showos"));
		String sqlwhere = " where 1 = 1 ";
		if (!fullname.equals("")) {
			sqlwhere += " and typename like '%";
			sqlwhere += Util.fromScreen2(fullname, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!description.equals("")) {
			sqlwhere += " where typedesc like '%";
			sqlwhere += Util.fromScreen2(description, user.getLanguage());
			sqlwhere += "%'";
		}

		// oa名称判断
/*		RequestUtil rutil = new RequestUtil();
		OfsSettingObject oso = rutil.getOfsSetting();
		String showtype = Util.null2String(oso.getShowsysname(), "0");
		String systemname = "";
		if (showtype.equals("1")) {
			systemname = oso.getOashortname();
		} else if (showtype.equals("2")) {
			systemname = oso.getOafullname();
		}
*/
		//拼装查询SQL
		String backfields = "id,typename,typedesc,dsporder";
		String sqlfrom = " workflow_type " + sqlwhere;
//		if (isopenos && showos.equals("1")) {
//			sqlfrom = " (select id,typename,typedesc,dsporder from workflow_type " + sqlwhere
//					+ "  union (select * from (select sysid as id ,sysshortname as typename,sysfullname as typdesc, 9999 as dsporder from ofs_sysinfo where cancel=0 ) a " + sqlwhere + ")) t";
//		}
		String orderby = "dsporder";

		String pageUid = PageUidFactory.getBrowserUID("wftypelist");
		String tableString = "<table pageUid =\"" + pageUid + "\">";
		tableString += " <sql backfields=\"" + backfields + "\" sqlform=\"" + Util.toHtmlForSplitPage(sqlfrom) + "\" sqlwhere=\"\"  sqlorderby=\"" + orderby
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"asc\" sqlisdistinct=\"false\" />";
		tableString += "<head>";
		tableString += "<col width=\"20%\" text=\"" + SystemEnv.getHtmlLabelName(84, user.getLanguage()) + "\" column=\"id\" orderkey=\"\" />";
		tableString += "<col width=\"40%\" text=\"" + SystemEnv.getHtmlLabelName(399, user.getLanguage()) + "\" column=\"typename\" />";
		tableString += "<col width=\"40%\" text=\"" + SystemEnv.getHtmlLabelName(433, user.getLanguage()) + "\" column=\"typedesc\" />";
//		if (!showtype.equals("0") && showos.equals("1")) {
//			tableString += "<col width=\"20%\" text=\"" + SystemEnv.getHtmlLabelName(22677, user.getLanguage()) + "\" column=\"id\" orderkey=\"\" otherpara=\"" + showtype + "+" + systemname
//					+ "\" transmethod=\"com.api.workflow.service.WorkflowBrowserService.getSystemname\"/>";
//		}
		tableString += "</head>";
		tableString += "</table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
