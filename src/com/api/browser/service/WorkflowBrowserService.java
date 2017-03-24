package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import weaver.conn.RecordSet;
import weaver.general.BaseBean;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.workflow.util.PageUidFactory;
import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 浏览框流程列表接口
 * @author jhy Mar 24, 2017
 *
 */
public class WorkflowBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception{
		User user = (User) params.get("user");
		String propertyOfApproveWorkFlow = Util.null2String(params.get("propertyOfApproveWorkFlow"));
		String sqlwhere1 = Util.null2String(params.get("sqlwhere"));
		String fullname = Util.null2String(params.get("name"));
		String description = Util.null2String(params.get("description"));
		int typeid = Util.getIntValue(Util.null2String(params.get("typeid")), 0);

		String sqlwhere = " where (istemplate<>'1' or istemplate is null) and isvalid = '1' ";
		if ("htmllayoutchoose".equals(Util.null2String(params.get("from")))) {
			sqlwhere = " where 1=1 ";
		}
		if (!sqlwhere1.equals("")) {
			sqlwhere += sqlwhere1;
		}
		if (typeid != 0) {
			sqlwhere += " and workflowtype='" + typeid + "' ";
		}
		if (!fullname.equals("")) {
			sqlwhere += " and workflowname like '%" + Util.fromScreen2(fullname, user.getLanguage()) + "%' ";
		}
		if (!description.equals("")) {
			sqlwhere += " and workflowdesc like '%" + Util.fromScreen2(description, user.getLanguage()) + "%' ";
		}
		if ("contract".equals(propertyOfApproveWorkFlow)) {
			sqlwhere += " and formid = 49 and isbill = 1";
		}

		String backfields = "id,workflowname,workflowdesc,workflowtype";
		String sqlfrom = "(select id,workflowname,workflowdesc,workflowtype from workflow_base " + sqlwhere;
		sqlfrom += " ) t";
		String orderby = "id";

		String pageUid = PageUidFactory.getBrowserUID("wflist");
		String tableString = "<table instanceid=\"workflowbrowserlist\" tabletype=\"none\" pageUid =\"" + pageUid + "\" pagesize=\"10\">";
		tableString += " <sql backfields=\"" + backfields + "\" sqlform=\"" + Util.toHtmlForSplitPage(sqlfrom) + "\" sqlwhere=\"\"  sqlorderby=\"" + orderby
				+ "\"  sqlprimarykey=\"id\" sqlsortway=\"asc\" sqlisdistinct=\"false\" />";
		tableString += "<head>";
		tableString += "<col width=\"20%\" text=\"" + SystemEnv.getHtmlLabelName(84, user.getLanguage()) + "\" column=\"id\" />";
		tableString += "<col width=\"40%\" text=\"" + SystemEnv.getHtmlLabelName(399, user.getLanguage()) + "\" column=\"workflowname\" />";
		tableString += "<col width=\"40%\" text=\"" + SystemEnv.getHtmlLabelName(433, user.getLanguage()) + "\" column=\"workflowdesc\" />";
		tableString += "</head>";
		tableString += "</table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		Map<String, Object> apidatas = new HashMap<String, Object>();
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
	public Map<String, Object> getWorkflowTree(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		return apidatas;
	}
}
