package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.crm.CrmShareBase;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;

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
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("15%",SystemEnv.getHtmlLabelName(84, user.getLanguage()),"id","id"));
		cols.add(new SplitTableColBean("45%",SystemEnv.getHtmlLabelName(195, user.getLanguage()),"name","name"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(6083, user.getLanguage()),"typeid","typeid","weaver.crm.Maint.ContractTypeComInfo.getContractTypename"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(602, user.getLanguage()),"status","status","weaver.crm.Maint.CRMTransMethod.getContractStatus",String.valueOf(user.getLanguage())));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,orderby,"t1.id",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}

}
