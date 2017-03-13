package com.api.workflow.service;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.crm.CrmShareBase;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import com.api.workflow.util.PageUidFactory;

/**
 * 客户浏览框
 * @author wuser0326
 *
 */
public class CustomerBrowserService {

	/**
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public Map<String,Object> getCustomerList(HttpServletRequest request, HttpServletResponse response) {
		Map<String,Object> apidatas = new HashMap<String,Object>();
		User user = HrmUserVarify.getUser(request, response);

		String name = Util.null2String(request.getParameter("name"));
		String crmcode = Util.null2String(request.getParameter("crmcode"));

		String type = Util.null2String(request.getParameter("type"));

		String city = Util.null2String(request.getParameter("City"));
		String country1 = Util.null2String(request.getParameter("country1"));
		String departmentid = Util.null2String(request.getParameter("departmentid"));
		String sqlwhere = Util.null2String(request.getParameter("sqlwhere"));
		String crmManager = Util.null2String(request.getParameter("crmManager"));

		String sectorInfo = Util.null2String(request.getParameter("sectorInfo"));
		String customerStatus = Util.null2String(request.getParameter("customerStatus"));
		String customerDesc = Util.null2String(request.getParameter("customerDesc"));
		String customerSize = Util.null2String(request.getParameter("customerSize"));

		if (!"".equals(sqlwhere)) {
			sqlwhere = sqlwhere.replace("where", " and");
		}

		if (!name.equals("")) {
			sqlwhere += " and t1.name like '%" + Util.fromScreen2(name, user.getLanguage()) + "%' ";
		}
		if (!crmcode.equals("")) {
			sqlwhere += " and t1.crmcode like '%" + Util.fromScreen2(crmcode, user.getLanguage()) + "%' ";
		}
		if (!type.equals("")) {
			sqlwhere += " and t1.type = " + type;
		}
		if (!city.equals("")) {
			sqlwhere += " and t1.city = " + city;
		}
		if (!country1.equals("")) {
			sqlwhere += " and t1.country = " + country1;
		}
		if (!departmentid.equals("")) {
			sqlwhere += " and t1.department =" + departmentid + " ";
		}
		if (!crmManager.equals("")) {
			sqlwhere += " and t1.manager =" + crmManager + " ";
		}

		if (!sectorInfo.equals("")) {
			sqlwhere += " and t1.sector = " + sectorInfo;
		}
		if (!customerStatus.equals("")) {
			sqlwhere += " and t1.status = " + customerStatus;
		}
		if (!customerDesc.equals("")) {
			sqlwhere += " and t1.description = " + customerDesc;
		}
		if (!customerSize.equals("")) {
			sqlwhere += " and t1.size_n = " + customerSize;
		}

		sqlwhere += " and t1.id != 0 ";
		CrmShareBase csbase = new CrmShareBase();
		String leftjointable = csbase.getTempTable("" + user.getUID());

		String backfields = "t1.id , t1.name , t1.manager , t1.status ,t1.type";

		String fromSql = " CRM_CustomerInfo t1";
		if (user.getLogintype().equals("1")) {
			fromSql += " left join " + leftjointable + " t2 on t1.id = t2.relateditemid ";
			sqlwhere = " t1.deleted<>1 and t1.id = t2.relateditemid " + sqlwhere;
		} else {
			sqlwhere = "  t1.deleted<>1 and t1.agent=" + user.getUID() + sqlwhere;
		}
		sqlwhere = Util.toHtmlForSplitPage(sqlwhere);
		String orderby = "t1.id";
		String pageUid = PageUidFactory.getBrowserUID("cuslist");
		String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\"" + pageUid + "\">" + 
									"<sql backfields=\"" + backfields + "\" sqlform=\"" + Util.toHtmlForSplitPage(fromSql) + "\" sqlwhere=\"" + sqlwhere + "\"  sqlorderby=\"" + orderby + "\"  sqlprimarykey=\"t1.id\" sqlsortway=\"Desc\"/>" + 
									"<head>"+ 
									"	<col hide=\"true\" width=\"5%\" text=\"\" column=\"id\"/>" + 
									"	<col width=\"45%\"  text=\"" + SystemEnv.getHtmlLabelName(1268, user.getLanguage())+ "\"  orderkey=\"name\" column=\"name\"/>" + 
									"	<col width=\"20%\"  text=\"" + SystemEnv.getHtmlLabelName(63, user.getLanguage()) + "\" display=\"true\" orderkey=\"type\" column=\"type\" transmethod=\"weaver.crm.Maint.CustomerTypeComInfo.getCustomerTypename\"/>" + 
									"	<col width=\"30%\"  text=\"" + SystemEnv.getHtmlLabelName(1278, user.getLanguage())+ "\" display=\"true\" orderkey=\"manager\" column=\"manager\" transmethod=\"weaver.hrm.resource.ResourceComInfo.getResourcename\"/>" + 
									"</head>" + 
							  "</table>";
		
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
