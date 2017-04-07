package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.crm.CrmShareBase;
import weaver.general.PageIdConst;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 业务合同
 * @author jhy Mar 27, 2017
 * 
 */
public class ContractBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String name = Util.null2String(params.get("name"));
		String typeId = Util.null2String(params.get("typeId"));
		String status = Util.null2String(params.get("status"));
		String sqlwhere = " where t1.id != 0 ";
		String userid = "" + user.getUID();
		String logintype = "" + user.getLogintype();

		if (!name.equals("")) {
			sqlwhere += " and t1.name like '%";
			sqlwhere += Util.fromScreen2(name, user.getLanguage());
			sqlwhere += "%'";
		}
		if (!typeId.equals("")) {
			sqlwhere += " and t1.typeId = " + typeId;
		}
		if (!status.equals("")) {
			sqlwhere += " and t1.status = " + status;
		}
		
		String fromSql = "";
		if(logintype.equals("1")){
			CrmShareBase csb = new CrmShareBase();
			String leftjointable = csb.getTempTable(""+user.getUID());
			fromSql = " CRM_Contract t1 , "+leftjointable+" t2 ";
			sqlwhere += " and t1.crmId = t2.relateditemid ";
		}else{
			fromSql = " CRM_Contract t1 ,CRM_CustomerInfo t2 ";
			sqlwhere += " and t1.crmId = t2.id and t2.agent=" + userid;
		}
		
		String backfields = " t1.* ";
		String orderby = "t1.id";
		String tableString =" <table id='BrowseTable' instanceid='BrowseTable' tabletype='none' pagesize=\""+PageIdConst.getPageSize(PageIdConst.CRM_Contract,user.getUID(),PageIdConst.CRM)+"\">"+ 
							"<sql backfields=\""+backfields+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" sqlwhere=\""+sqlwhere+"\"  sqlorderby=\""+orderby+"\"  sqlprimarykey=\"t1.id\" sqlsortway=\"Desc\"/>"+
							"<head>"+
							"<col width=\"15%\" text=\""+SystemEnv.getHtmlLabelName(84,user.getLanguage())+"\" orderkey=\"id\" column=\"id\"/>"+ 
							"<col width=\"45%\"  text=\""+ SystemEnv.getHtmlLabelName(195,user.getLanguage()) +"\" orderkey=\"name\" column=\"name\"/>"+ 
							"<col width=\"20%\"  text=\""+ SystemEnv.getHtmlLabelName(6083,user.getLanguage()) +"\" orderkey=\"typeid\" column=\"typeid\""+ " transmethod=\"weaver.crm.Maint.ContractTypeComInfo.getContractTypename\"/>"+ 
							"<col width=\"20%\"  text=\""+SystemEnv.getHtmlLabelName(602,user.getLanguage())+"\" column=\"status\" orderkey=\"status\" otherpara='"+user.getLanguage()+ "' transmethod=\"weaver.crm.Maint.CRMTransMethod.getContractStatus\"/>"+
							"</head>"+   			
							"</table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
