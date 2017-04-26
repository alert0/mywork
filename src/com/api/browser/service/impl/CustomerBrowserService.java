package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import weaver.crm.CrmShareBase;
import weaver.general.Util;
import weaver.general.browserData.BrowserManager;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import weaver.workflow.browserdatadefinition.ConditionField;

import com.api.browser.bean.BrowserBean;
import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;
import com.api.browser.util.SqlUtils;
import com.api.workflow.bean.SearchConditionItem;
import com.api.workflow.util.ConditionKeyFactory;
import com.api.workflow.util.ConditionType;

/**
 * 客户浏览框
 * 
 * @author jhy Mar 24, 2017
 * 
 */
public class CustomerBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) {

		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");

		String name = Util.null2String(params.get("name"));
		String crmcode = Util.null2String(params.get("crmcode"));

		String type = Util.null2String(params.get("type"));

		String city = Util.null2String(params.get("City"));
		String country1 = Util.null2String(params.get("country1"));
		String departmentid = Util.null2String(params.get("departmentid"));
		String sqlwhere = Util.null2String(params.get("sqlwhere"));
		String crmManager = Util.null2String(params.get("crmManager"));

		String sectorInfo = Util.null2String(params.get("sectorInfo"));
		String customerStatus = Util.null2String(params.get("customerStatus"));
		String customerDesc = Util.null2String(params.get("customerDesc"));
		String customerSize = Util.null2String(params.get("customerSize"));

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
			sqlwhere = " where t1.deleted<>1 and t1.id = t2.relateditemid " + sqlwhere;
		} else {
			sqlwhere = " where t1.deleted<>1 and t1.agent=" + user.getUID() + sqlwhere;
		}
		sqlwhere = Util.toHtmlForSplitPage(sqlwhere);
		sqlwhere = SqlUtils.replaceFirstAnd(sqlwhere);
		String orderby = "t1.id";

		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true", "id"));
		cols.add(new SplitTableColBean("50%", SystemEnv.getHtmlLabelName(1268, user.getLanguage()), "name", "name"));
		cols.add(new SplitTableColBean("20%", SystemEnv.getHtmlLabelName(63, user.getLanguage()), "type", "type", "weaver.crm.Maint.CustomerTypeComInfo.getCustomerTypename", ""));
		cols.add(new SplitTableColBean("30%", SystemEnv.getHtmlLabelName(1278, user.getLanguage()), "manager", "manager", "weaver.hrm.resource.ResourceComInfo.getResourcename", ""));

		SplitTableUtil.getTableString(apidatas, new SplitTableBean(backfields, fromSql, sqlwhere, orderby, "t1.id", cols));
		return apidatas;
	}

	@Override
	public Map<String, Object> browserAutoComplete(String type,HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = HrmUserVarify.getUser(request,response);
		BrowserManager browserManager = new BrowserManager();
		browserManager.setType(type);
		CrmShareBase crmShareBase=new CrmShareBase();
		String leftjointable = crmShareBase.getTempTable(""+user.getUID());
		String sqlFrom=" CRM_CustomerInfo t1 left join "+leftjointable+" t2 on t1.id = t2.relateditemid ";
		String sqlWhere=" t1.deleted = 0  and t1.id = t2.relateditemid ";
		String whereClause = "";
		if(!"".equals(whereClause)){
			sqlWhere +=" and "+whereClause;
		}
		int bdf_wfid = Util.getIntValue(request.getParameter("bdf_wfid"));
		int bdf_fieldid = Util.getIntValue(request.getParameter("bdf_fieldid"));
		int bdf_viewtype = Util.getIntValue(request.getParameter("bdf_viewtype"));
		List<ConditionField> list = null;
		if(-1 != bdf_wfid){
			list = ConditionField.readAll(bdf_wfid,bdf_fieldid,bdf_viewtype);
		}
		if(null != list && 0 != list.size()){ 
			for(ConditionField conditionField : list){
				
				if(!conditionField.isReadonly() && !conditionField.isHide())continue;
				
				String fieldName = conditionField.getFieldName();
				String fieldValue = conditionField.getValue();
				if(conditionField.getValueType().equals("3") && conditionField.isGetValueFromFormField()){ 
					fieldValue = Util.null2String(request.getParameter("bdf_"+fieldName));
					fieldValue = fieldValue.split(",")[0];
				}
				if(conditionField.getValueType().equals("1") && fieldName.equals("crmManager")){
					fieldValue = user.getUID()+"";
				}
				if(conditionField.getValueType().equals("1") && fieldName.equals("departmentid")){
					fieldValue = user.getUserDepartment()+"";
				}
				if(conditionField.getValueType().equals("3") && fieldName.equals("departmentid")){//部门选择表单字段为但
					fieldValue = Util.null2String(request.getParameter("bdf_"+fieldName));
					fieldValue = conditionField.getDepartmentIds(fieldValue).split(",")[0];
				}
				if(fieldValue == null || fieldValue.equals("")){
					continue;
				}
				if(fieldName.equals("name")){
					sqlWhere += " and t1.name like '%" + fieldValue +"%' ";
				}
				if(fieldName.equals("engname")){
					sqlWhere += " and t1.engname like '%" + fieldValue +"%' ";
				}
				if(fieldName.equals("type")){
					sqlWhere += " and t1.type = "+ fieldValue;
				}
				if(fieldName.equals("customerStatus")){
					sqlWhere += " and t1.status = "+ fieldValue;
				}
				if(fieldName.equals("country1")){
					sqlWhere += " and t1.country = "+ fieldValue;
				}
				if(fieldName.equals("City")){
					sqlWhere += " and t1.city = " + fieldValue ;
				}
				if(fieldName.equals("crmManager")){
					sqlWhere += " and t1.manager =" + fieldValue  ;
				}
				if(fieldName.equals("departmentid")){
					sqlWhere += " and t1.department =" + fieldValue +" " ;
				}
				if(fieldName.equals("customerDesc")){
					sqlWhere += " and t1.description = "+ fieldValue;
				}
				if(fieldName.equals("customerSize")){
					sqlWhere += " and t1.size_n = "+ fieldValue;
				}
				if(fieldName.equals("sectorInfo")){
					sqlWhere += " and t1.sector = "+ fieldValue;
				}
			}
		}
		browserManager.setOrderKey("createdate");
		apidatas.put("datas", browserManager.getResult(request,"id,name",sqlFrom,sqlWhere,PAGENUM));
		return apidatas;
	}

	@Override
	public Map<String, Object> getBrowserConditionInfo(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		List<SearchConditionItem> conditions = new ArrayList<SearchConditionItem>();
		User user = (User) params.get("user");
		
		conditions.add(new SearchConditionItem(ConditionType.INPUT, SystemEnv.getHtmlLabelName(1268, user.getLanguage()), "", new String[] { "name" }, null, 6, 18,null));
		conditions.add(new SearchConditionItem(ConditionType.INPUT, SystemEnv.getHtmlLabelName(17080, user.getLanguage()), "", new String[] { "crmcode" }, null, 6, 18,null));
		conditions.add(new SearchConditionItem(ConditionType.BROWSER, SystemEnv.getHtmlLabelName(63, user.getLanguage()), "", new String[] { "type" }, null, 6, 18,new BrowserBean("60","type","客户类型")));

		/*
		conditions.add(new SearchConditionItem(ConditionKeyFactory.KEY_CUSTOMER_STATUS, SystemEnv.getHtmlLabelName(602, user.getLanguage()), "", new String[] { "customerStatus" }, null, 6, 18));
		conditions.add(new SearchConditionItem(ConditionKeyFactory.KEY_COUNTRY, SystemEnv.getHtmlLabelName(377, user.getLanguage()), "", new String[] { "country1" }, null, 6, 18));
		conditions.add(new SearchConditionItem(ConditionKeyFactory.KEY_3_58, SystemEnv.getHtmlLabelName(493, user.getLanguage()), "", new String[] { "City" }, null, 6, 18));
		conditions.add(new SearchConditionItem(ConditionKeyFactory.KEY1, SystemEnv.getHtmlLabelName(1278, user.getLanguage()), "", new String[] { "crmManager" }, null, 6, 18));
		conditions.add(new SearchConditionItem(ConditionKeyFactory.KEY1, SystemEnv.getHtmlLabelNames("1278,124", user.getLanguage()), "", new String[] { "departmentid" }, null, 6, 18));
		conditions.add(new SearchConditionItem(ConditionKeyFactory.KEY_3_61, SystemEnv.getHtmlLabelName(433, user.getLanguage()), "", new String[] { "customerDesc" }, null, 6, 18));
		conditions.add(new SearchConditionItem(ConditionKeyFactory.KEY_3_62, SystemEnv.getHtmlLabelName(576, user.getLanguage()), "", new String[] { "customerSize" }, null, 6, 18));
		conditions.add(new SearchConditionItem(ConditionKeyFactory.KEY_3_63, SystemEnv.getHtmlLabelName(575, user.getLanguage()), "", new String[] { "sectorInfo" }, null, 6, 18));
		*/
		apidatas.put("conditions",conditions);
		return apidatas;
	}
}
