package com.api.browser.service;

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import weaver.conn.RecordSet;
import weaver.cpt.util.CommonShareManager;
import weaver.cpt.util.CptWfUtil;
import weaver.crm.CrmShareBase;
import weaver.fna.general.FnaCommon;
import weaver.fna.maintenance.BudgetfeeTypeComInfo;
import weaver.fna.maintenance.FnaCostCenter;
import weaver.general.BaseBean;
import weaver.general.Util;
import weaver.general.browserData.BrowserManager;
import weaver.general.browserData.CategoryBrowser;
import weaver.general.browserData.FieldBrowser;
import weaver.general.browserData.MdFormBrowser;
import weaver.general.browserData.WfFormBrowser;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.appdetach.AppDetachComInfo;
import weaver.hrm.company.SubCompanyComInfo;
import weaver.hrm.moduledetach.ManageDetachComInfo;
import weaver.hrm.resource.ResourceComInfo;
import weaver.ldap.LdapUtil;
import weaver.meeting.MeetingBrowser;
import weaver.meeting.MeetingShareUtil;
import weaver.share.ShareManager;
import weaver.systeminfo.systemright.CheckSubCompanyRight;
import weaver.workflow.browserdatadefinition.ConditionField;
import weaver.workflow.monitor.Monitor;
import weaver.workflow.request.Browsedatadefinition;
import weaver.workflow.request.todo.RequestUtil;
import weaver.workflow.workflow.WorkflowComInfo;

/**
 * data.jsp 
 * AutoComplete
 * @author jhy Apr 21, 2017
 *
 */
public class BrowserAutoCompleteService {

	public String getCompleteData(String type,HttpServletRequest request, HttpServletResponse response) throws Exception {
		BrowserManager browserManager = new BrowserManager();
		int pagenum = 30;
		RecordSet rs = new RecordSet();
		RecordSet rs2 = new RecordSet();
		ManageDetachComInfo mdc = new ManageDetachComInfo();
		CheckSubCompanyRight cscr = new CheckSubCompanyRight();
		HttpSession session = request.getSession();
		AppDetachComInfo appDetachComInfo = new AppDetachComInfo();
		SubCompanyComInfo scc = new SubCompanyComInfo();
		CommonShareManager csm = new CommonShareManager();
		ResourceComInfo resComInfo = new ResourceComInfo();
		
		User user = HrmUserVarify.getUser(request, response);
		String whereClause = URLDecoder.decode(Util.null2String(request.getParameter("whereClause")), "UTF-8");
		if (whereClause.length() == 0) {
			whereClause = URLDecoder.decode(Util.null2String(request.getParameter("sqlwhere")), "UTF-8");
		}
		String result = "";
		String selectids = Util.null2String(request.getParameter("selectids"));
		browserManager.setType(type);
		if (type.equals("4") || type.equals("57") || type.equals("167") || type.equals("168")) {// 部门
			if (whereClause.length() > 0)
				whereClause += "and";
			whereClause += " hrmdepartment.subcompanyid1=hrmsubcompany.id and (hrmdepartment.canceled = '0' or hrmdepartment.canceled is null) ";
			if (type.equals("167") || type.equals("168")) {
				/*
				 * String rightLevel =
				 * HrmUserVarify.getRightLevel("HrmResourceEdit:Edit",user); int
				 * departmentID = user.getUserDepartment(); int subcompanyID =
				 * user.getUserSubCompany1(); if(rightLevel.equals("2") ){
				 * //总部级别的，什么也不返回 }else if (rightLevel.equals("1")){ //分部级别的
				 * whereClause = " subcompanyid1="+subcompanyID ; }else if
				 * (rightLevel.equals("0")){ //部门级别 whereClause = "
				 * id="+departmentID ; }
				 */

				rs.executeSql("select detachable from SystemSet");
				int detachable = 0;
				if (rs.next()) {
					detachable = rs.getInt("detachable");
				}

				boolean isUseHrmManageDetach = mdc.isUseHrmManageDetach();
				if (isUseHrmManageDetach) {
					detachable = 1;
				} else {
					detachable = 0;
				}
				String rightStr = Util.null2String(request.getParameter("rightStr"));
				if (detachable == 1) {
					String companyid = "";

					int[] companyids = cscr.getSubComByUserRightId(user.getUID(), rightStr, 1);
					for (int i = 0; companyids != null && i < companyids.length; i++) {
						companyid += "," + companyids[i];
					}
					if (companyid.length() > 0) {
						companyid = companyid.substring(1);
						whereClause += " and ( hrmdepartment.subcompanyid1 in(" + companyid + "))";
					} else {
						whereClause += " and ( hrmdepartment.subcompanyid1 in(0)";// 分权而且没有选择机构权限
					}
				} else {
					if (rightStr.length() > 0) {
						String rightLevel = HrmUserVarify.getRightLevel(rightStr, user);
						int departmentID = user.getUserDepartment();
						int subcompanyID = user.getUserSubCompany1();
						if (rightLevel.equals("2")) {
							// 总部级别的，什么也不返回
						} else if (rightLevel.equals("1")) { // 分部级别的
							whereClause += " and hrmdepartment.subcompanyid1=" + subcompanyID;
						} else if (rightLevel.equals("0")) { // 部门级别
							whereClause += " and hrmdepartment.id=" + departmentID;
						}
					}
				}
				int beagenter = Util.getIntValue((String) session.getAttribute("beagenter_" + user.getUID()));
				if (beagenter <= 0) {
					beagenter = user.getUID();
				}
				int fieldid = Util.getIntValue(request.getParameter("fieldid"));
				int isdetail = Util.getIntValue(request.getParameter("isdetail"));
				int isbill = Util.getIntValue(request.getParameter("isbill"), 1);
				if (fieldid != -1) {
					cscr.setDetachable(1);
					cscr.setIsbill(isbill);
					cscr.setFieldid(fieldid);
					cscr.setIsdetail(isdetail);
					boolean onlyselfdept = cscr.getDecentralizationAttr(beagenter, "Departments:decentralization", fieldid, isdetail, isbill);
					boolean isall = cscr.getIsall();
					String departments = Util.null2String(cscr.getDepartmentids());
					String subcompanyids = Util.null2String(cscr.getSubcompanyids());
					if (!isall) {
						if (onlyselfdept) {
							if (departments.length() > 0 && !departments.equals("0")) {
								whereClause += " and hrmdepartment.id in(" + departments + ")";
							}
						} else {
							if (subcompanyids.length() > 0 && !subcompanyids.equals("0")) {
								whereClause += " and subcompanyid1 in(" + subcompanyids + ")";
							}
						}
					}
				}
			}
			// Added by wcd 2014-11-28 增加分权控制 start
			String tempSql = appDetachComInfo.getScopeSqlByHrmResourceSearch(String.valueOf(user.getUID()), true, "department");
			whereClause += (whereClause == null || whereClause.length() == 0) ? tempSql : (tempSql.equals("") ? " " : " and " + tempSql);

			// Added by wcd 2014-11-28 增加分权控制 end
			browserManager.setOrderKey("hrmdepartment.showorder");
			browserManager.setOrderWay("asc");
			if (Util.null2String(request.getParameter("show_virtual_org")).equals("-1")) {
				result = browserManager.getResult(request, "hrmdepartment.id,departmentname,subcompanyname", "hrmdepartment , hrmsubcompany ", whereClause, pagenum, "hrmdepartment");
			} else {
				result = browserManager.getResult(request, "hrmdepartment.id,departmentname,subcompanyname", "hrmdepartmentallView hrmdepartment, hrmsubcompanyallview hrmsubcompany", whereClause,
						pagenum, "hrmdepartment");
			}
		} else if (type.equals("hrmdepartmentvirtual") || type.equals("264")) {// 虚拟部门
			browserManager.setOrderKey("showorder");
			browserManager.setOrderWay("asc");
			String virtualtype = Util.null2String(request.getParameter("virtualtype"));
			if (whereClause.length() > 0)
				whereClause += " and virtualtype=" + virtualtype;
			else
				whereClause += " virtualtype=" + virtualtype;
			result = browserManager.getResult(request, "id,departmentname", "hrmdepartmentvirtual", whereClause, pagenum);
		} else if (type.equals("12")) {// 币种
			result = browserManager.getResult(request, "id,currencyname", "FnaCurrency", " activable=1 ", pagenum);
		} else if (type.equals("137")) {// 车辆
			rs.executeSql("select carsdetachable from SystemSet");
			int detachable = 0;
			if (rs.next()) {
				detachable = rs.getInt(1);
			}
			int subCompanyId = 0;
			String sqlwhere = " 1=1 ";
			if (detachable == 1) {
				if (!"".equals(Util.null2String(request.getParameter("subCompanyId")))) {
					subCompanyId = Util.getIntValue(request.getParameter("subCompanyId"));
				}
				// operatelevel=
				// CheckSubCompanyRight.ChkComRightByUserRightCompanyId(user.getUID(),"Car:Maintenance",subCompanyId);
				if (user.getUID() != 1) {
					String sqltmp = "";
					String blonsubcomid = "";
					char flag = Util.getSeparator();
					rs2.executeProc("HrmRoleSR_SeByURId", "" + user.getUID() + flag + "Car:Maintenance");
					while (rs2.next()) {
						blonsubcomid = rs2.getString("subcompanyid");
						sqltmp += (", " + blonsubcomid);
					}
					if (!"".equals(sqltmp)) {// 角色设置的权限
						sqltmp = sqltmp.substring(1);
						sqlwhere += " and subcompanyid in (" + sqltmp + ") ";
					} else {
						sqlwhere += " and subcompanyid=" + user.getUserSubCompany1();
					}
				}
			} else {
				subCompanyId = -1;
			}
			result = browserManager.getResult(request, "id,carNo", "CarInfo", sqlwhere, pagenum);
		} else if (type.equals("1111")) {// 国家
			result = browserManager.getResult(request, "id,countryname", "HrmCountry", pagenum);
		} else if (type.equals("2222")) {// 省份
			result = browserManager.getResult(request, "id,provincename", "HrmProvince", pagenum);
		} else if (type.equals("142")) {// 收发文单位
			browserManager.setOrderKey("showOrder");
			browserManager.setOrderWay("asc");
			// result =
			// browserManager.getResult(request,"id,receiveUnitName","DocReceiveUnit",pagenum);
			result = browserManager.getResult(request, "id,receiveUnitName", "DocReceiveUnit", "( canceled = '0' or canceled is null) ", pagenum);
		} else if (type.equals("58")) {// 城市
			result = browserManager.getResult(request, "id,cityname", "HrmCity", "( canceled = '0' or canceled is null) ", pagenum);
		} else if (type.equals("hrmcitytwo") || type.equals("263")) {// 二级城市
			result = browserManager.getResult(request, "id,cityname", "HrmCityTwo", pagenum);
		} else if (type.equals("55")) {// 发文字号
			result = browserManager.getResult(request, "id,name", "DocSendDocNumber", pagenum);
		} else if (type.equals("52")) {// 公文种类
			result = browserManager.getResult(request, "id,name", "DocSendDocKind", pagenum);
		} else if (type.equals("53")) {// 紧急程度
			result = browserManager.getResult(request, "id,name", "DocInstancyLevel", pagenum);
		} else if (type.equals("54")) {// 秘密等级
			result = browserManager.getResult(request, "id,name", "DocSecretLevel", pagenum);
		} else if (type.equals("182")) {// 网上调查
			result = browserManager.getResult(request, "id,subject", "voting", "(status=1 or status=2)", pagenum);
		} else if (type.equals("59")) {// 称呼
			result = browserManager.getResult(request, "id,fullname", "CRM_ContacterTitle", pagenum);
		} else if (type.equals("7") || type.equals("18")) {// 客户
			CrmShareBase crmShareBase = new CrmShareBase();
			String leftjointable = crmShareBase.getTempTable("" + user.getUID());
			String sqlFrom = " CRM_CustomerInfo t1 left join " + leftjointable + " t2 on t1.id = t2.relateditemid ";
			String sqlWhere = " t1.deleted = 0  and t1.id = t2.relateditemid ";
			if (!"".equals(whereClause)) {
				sqlWhere += " and " + whereClause;
			}
			int bdf_wfid = Util.getIntValue(request.getParameter("bdf_wfid"));
			int bdf_fieldid = Util.getIntValue(request.getParameter("bdf_fieldid"));
			int bdf_viewtype = Util.getIntValue(request.getParameter("bdf_viewtype"));
			List<ConditionField> list = null;
			if (-1 != bdf_wfid) {
				list = ConditionField.readAll(bdf_wfid, bdf_fieldid, bdf_viewtype);
			}
			if (null != list && 0 != list.size()) {
				for (ConditionField conditionField : list) {

					if (!conditionField.isReadonly() && !conditionField.isHide())
						continue;

					String fieldName = conditionField.getFieldName();
					String fieldValue = conditionField.getValue();
					if (conditionField.getValueType().equals("3") && conditionField.isGetValueFromFormField()) {
						fieldValue = Util.null2String(request.getParameter("bdf_" + fieldName));
						fieldValue = fieldValue.split(",")[0];
					}
					if (conditionField.getValueType().equals("1") && fieldName.equals("crmManager")) {
						fieldValue = user.getUID() + "";
					}
					if (conditionField.getValueType().equals("1") && fieldName.equals("departmentid")) {
						fieldValue = user.getUserDepartment() + "";
					}
					if (conditionField.getValueType().equals("3") && fieldName.equals("departmentid")) {// 部门选择表单字段为但
						fieldValue = Util.null2String(request.getParameter("bdf_" + fieldName));
						fieldValue = conditionField.getDepartmentIds(fieldValue).split(",")[0];
					}
					if (fieldValue == null || fieldValue.equals("")) {
						continue;
					}
					if (fieldName.equals("name")) {
						sqlWhere += " and t1.name like '%" + fieldValue + "%' ";
					}
					if (fieldName.equals("engname")) {
						sqlWhere += " and t1.engname like '%" + fieldValue + "%' ";
					}
					if (fieldName.equals("type")) {
						sqlWhere += " and t1.type = " + fieldValue;
					}
					if (fieldName.equals("customerStatus")) {
						sqlWhere += " and t1.status = " + fieldValue;
					}
					if (fieldName.equals("country1")) {
						sqlWhere += " and t1.country = " + fieldValue;
					}
					if (fieldName.equals("City")) {
						sqlWhere += " and t1.city = " + fieldValue;
					}
					if (fieldName.equals("crmManager")) {
						sqlWhere += " and t1.manager =" + fieldValue;
					}
					if (fieldName.equals("departmentid")) {
						sqlWhere += " and t1.department =" + fieldValue + " ";
					}
					if (fieldName.equals("customerDesc")) {
						sqlWhere += " and t1.description = " + fieldValue;
					}
					if (fieldName.equals("customerSize")) {
						sqlWhere += " and t1.size_n = " + fieldValue;
					}
					if (fieldName.equals("sectorInfo")) {
						sqlWhere += " and t1.sector = " + fieldValue;
					}
				}
			}
			browserManager.setOrderKey("createdate");
			result = browserManager.getResult(request, "id,name", sqlFrom, sqlWhere, pagenum);
		} else if (type.equals("164_1")) {// 表单建模分权
			String rightStr = request.getParameter("rightStr");
			whereClause = appDetachComInfo.getCompanySqlByFromMode(user.getUID(), rightStr);
			browserManager.setOrderKey("showorder");
			browserManager.setOrderWay("asc");
			result = browserManager.getResult(request, "id,subcompanyname", "hrmsubcompany", whereClause, pagenum);
		} else if (type.equals("164") || type.equals("194") || type.equals("169") || type.equals("170")) {// 分部
			// Added by wcd 2014-11-28 增加分权控制
			whereClause = appDetachComInfo.getScopeSqlByHrmResourceSearch(String.valueOf(user.getUID()), true, "subcompany");
			if (type.equals("169") || type.equals("170")) {
				String rightLevel = HrmUserVarify.getRightLevel("HrmResourceEdit:Edit", user);
				int subcompanyID = user.getUserSubCompany1();
				if (rightLevel.equals("2")) {
					// 总部级别的，什么也不返回
				} else if (rightLevel.equals("1")) { // 分部级别的
					if (whereClause.length() > 0)
						whereClause += " and id=" + subcompanyID;
					else
						whereClause += " id=" + subcompanyID;
				}
			}
			if (whereClause.length() > 0)
				whereClause += " and (canceled = '0' or canceled is null)  ";
			else
				whereClause += " (canceled = '0' or canceled is null)  ";

			// 如果开启分权
			if (type.equals("164") && !"sysadmin".equalsIgnoreCase(user.getLoginid()) && "1".equals(session.getAttribute("detachable"))) {
				whereClause += " and id in (" + scc.getRightSubCompany(user.getUID(), "WorkflowManage:All", 0) + ")";
			}

			browserManager.setOrderKey("showorder");
			browserManager.setOrderWay("asc");
			if (type.equals("169") || type.equals("170") || Util.null2String(request.getParameter("show_virtual_org")).equals("-1")) {
				// 分权不考虑 多维
				result = browserManager.getResult(request, "id,subcompanyname", "hrmsubcompany", whereClause, pagenum);
			} else {
				result = browserManager.getResult(request, "id,subcompanyname", "hrmsubcompanyAllview hrmsubcompany", whereClause, pagenum);
			}
		} else if (type.equals("hrmsubcompanyvirtual")) {// 虚拟分部
			browserManager.setOrderKey("showorder");
			browserManager.setOrderWay("asc");
			String virtualtype = Util.null2String(request.getParameter("virtualtype"));
			if (whereClause.length() > 0)
				whereClause += " and virtualtype=" + virtualtype;
			else
				whereClause += " virtualtype=" + virtualtype;
			result = browserManager.getResult(request, "id,subcompanyname", "hrmsubcompanyvirtual", pagenum);
		} else if (type.equals("-99999")) {// 虚拟目录
			browserManager.setOrderKey("showOrder");
			browserManager.setOrderWay("asc");
			result = browserManager.getResult(request, "id,treeDocFieldName", "DocTreeDocField", pagenum);
		} else if (type.equals("-99998")) {// 语言
			result = browserManager.getResult(request, "id,language", "syslanguage", "activable='1'", pagenum);
		} else if (type.equals("-99997")) {// 物品类别
			result = browserManager.getResult(request, "id,assortmentname", "LgcAssetAssortment", pagenum);
		} else if (type.equals("-99996")) {// 文档显示模板
			String doctype = Util.null2String(request.getParameter("docType"));
			String mouldType = Util.null2String(request.getParameter("mouldType"));
			if (doctype.equals("") || doctype.equals(".htm"))
				doctype = "0";
			else if (doctype.equals(".doc"))
				doctype = "2";
			else if (doctype.equals(".xls"))
				doctype = "3";
			else if (doctype.equals(".wps"))
				doctype = "4";
			String isWorkflowDoc = Util.null2String(request.getParameter("isWorkflowDoc"));
			if (isWorkflowDoc.equals("1")) {
				doctype = "2,4";
			}
			String where = "mouldType in (" + doctype + ")";
			if (!"".equals(selectids)) {
				where += " and id not in (" + selectids + ")";
			}
			String tablename = "DocMould";
			if (mouldType.equals("3")) {
				tablename = "DocMouldFile";
			}
			browserManager.setOrderKey("lastModTime");
			result = browserManager.getResult(request, "id,mouldname", tablename, where, pagenum);
		} else if (type.equals("-99990")) {// 主目录
			result = browserManager.getResult(request, "id,categoryname", "docmaincategory", pagenum);

		} else if ("179".equals(type)) {// 资产资料
			String sqlwhere = " isdata='1' ";
			result = browserManager.getResult(request, "id,name", "CptCapital", sqlwhere, pagenum);
		} else if (type.equals("23") || type.equals("26") || type.equals("3")) {// 资产
			int billid = Util.getIntValue(request.getParameter("billid"), -1);
			int isdata = Util.getIntValue(request.getParameter("isdata"), 2);
			String cptstateid = Util.null2String(request.getParameter("cptstateid"));
			String cptuse = Util.null2String(request.getParameter("cptuse"));
			String cptsptcount = Util.null2String(request.getParameter("cptsptcount"));
			String wfid = Util.null2String(request.getParameter("wfid"));
			String inculdeNumZero = Util.null2s(request.getParameter("inculdeNumZero"), "1");
			if (billid > 0) {
				switch (billid) {
				case 220: // 资产借用
					cptsptcount = "1";
					cptstateid = "1";
					inculdeNumZero = "0";
					break;
				case 222: // 资产送修
					cptsptcount = "1";
					cptstateid = "1,2,3";
					inculdeNumZero = "0";
					break;
				case 224: // 资产归还
					// sptcount="1";
					cptstateid = "4,2,3";
					inculdeNumZero = "0";
					break;
				case 221: // 资产减损
					cptstateid = "1,2,3,4";
					inculdeNumZero = "0";
					break;
				case 201: // 资产报废
					cptstateid = "1,2,3,4";
					inculdeNumZero = "0";
					break;
				}
			}
			if (!"".equals(wfid)) {
				CptWfUtil cptWfUtil = new CptWfUtil();
				String wftype = cptWfUtil.getWftype(wfid);
				if (!"".equals(wftype)) {
					if ("fetch".equalsIgnoreCase(wftype) || billid == 19) {
						cptuse = "1";
						cptstateid = "1";
					} else if ("lend".equalsIgnoreCase(wftype) || billid == 220) {
						cptstateid = "1";
						cptsptcount = "1";
					} else if ("move".equalsIgnoreCase(wftype) || billid == 18) {
						cptstateid = "2";
					} else if ("back".equalsIgnoreCase(wftype) || billid == 224) {
						cptstateid = "2,3,4";
					} else if ("discard".equalsIgnoreCase(wftype) || billid == 201) {
						cptstateid = "1,2,3,4";
					} else if ("mend".equalsIgnoreCase(wftype) || billid == 222) {
						cptstateid = "1,2,3";
						cptsptcount = "1";
					} else if ("loss".equalsIgnoreCase(wftype) || billid == 221) {
						cptstateid = "1,2,3,4";
					}
					inculdeNumZero = "0";
				}
			}
			String fromSql = " CptCapital t1 ";
			String backfields = " t1.id,t1.name ";

			// 剔除掉在途的请求自身的数量===below================
			int reqid = Util.getIntValue(request.getParameter("reqid"), 0);
			String includeNumZeroSqlwhere = "";
			if (!"1".equals(inculdeNumZero) && (2 == isdata)) {
				if ("oracle".equalsIgnoreCase(rs.getDBType())) {
					includeNumZeroSqlwhere = " and (nvl(capitalnum,0)-nvl(frozennum,0))>0 ";
				} else {
					includeNumZeroSqlwhere = " and (isnull(capitalnum,0)-isnull(frozennum,0))>0 ";
				}
			}
			if (reqid > 0 && isdata == 2) {
				String sql2 = "select t1.currentnodetype,t1.workflowid,t2.formid from workflow_requestbase t1,workflow_base t2 where t1.workflowid=t2.id and t1.requestid=" + reqid;
				int formid = 0;
				int mywfid = 0;
				int currentnodetype = 0;

				rs.executeSql(sql2);
				while (rs.next()) {
					formid = rs.getInt("formid");
					mywfid = rs.getInt("workflowid");
					currentnodetype = rs.getInt("currentnodetype");
				}
				if (currentnodetype > 0 && currentnodetype < 3) {
					String cptsearchsql = "";
					if (formid == 18 || formid == 19 || formid == 201 || formid == 221) {// 系统表单资产流程
						if (formid == 221) {// 减损
							cptsearchsql = "select d.lossCpt as as currentzcid,sum(d.losscount) as currentreqnum from bill_cptloss d where d.requestid=" + reqid + " group by d.lossCpt ";
						} else if (formid == 18) {// 调拨
							cptsearchsql = "select d.capitalid as as currentzcid,sum(d.number_n) as currentreqnum from bill_CptAdjustMain m,bill_CptAdjustDetail d where d.cptadjustid=m.id and m.requestid="
									+ reqid + " group by d.capitalid ";
						} else if (formid == 201) {// 报废
							cptsearchsql = "select d.capitalid as as currentzcid,sum(d.numbers) as currentreqnum from bill_Discard_Detail d where d.detailrequestid=" + reqid
									+ " group by d.capitalid ";
						} else if (formid == 19) {// 领用
							cptsearchsql = "SELECT d.capitalid as as currentzcid,sum(d.number_n) as currentreqnum FROM bill_CptFetchDetail d ,bill_CptFetchMain m WHERE d.cptfetchid =m.id AND m.requestid = "
									+ reqid + " group by d.capitalid ";
						}

					} else {
						CptWfUtil cptWfUtil = new CptWfUtil();
						org.json.JSONObject jsonObject = cptWfUtil.getCptwfInfo("" + wfid);
						if (jsonObject.length() > 0) {// 自定义资产流程
							String cptmaintablename = "formtable_main_" + (-formid);
							rs.execute("select tablename from workflow_bill where id=" + formid);
							while (rs.next()) {
								cptmaintablename = rs.getString("tablename");
							}
							String cptdetailtablename = cptmaintablename;
							String zcname = jsonObject.getString("zcname");
							String zcsl = jsonObject.getString("slname");
							int zcViewtype = Util.getIntValue("" + jsonObject.getInt("zctype"), 0);
							if (zcViewtype == 1) {
								cptdetailtablename += "_dt1";
							} else if (zcViewtype == 2) {
								cptdetailtablename += "_dt2";
							} else if (zcViewtype == 3) {
								cptdetailtablename += "_dt3";
							} else if (zcViewtype == 4) {
								cptdetailtablename += "_dt4";
							}

							if (!cptdetailtablename.equals(cptmaintablename)) {
								cptsearchsql = " select d." + zcname + " as currentzcid,sum(d." + zcsl + ") as currentreqnum from " + cptmaintablename + " m ," + cptdetailtablename
										+ " d where d.mainid=m.id and m.requestid=" + reqid + " group by d." + zcname + " ";
							} else {
								cptsearchsql = "select m." + zcname + " as currentzcid,sum(m." + zcsl + ") as currentreqnum from " + cptmaintablename + " m  where  m.requestid=" + reqid
										+ " group by m." + zcname + " ";
							}
						}
					}

					if (!"".equals(cptsearchsql)) {
						fromSql = " CptCapital t1 left outer join (" + cptsearchsql + ") tt2 on tt2.currentzcid=t1.id ";
					}

					if ("oracle".equalsIgnoreCase(rs.getDBType())) {
						includeNumZeroSqlwhere = " and  (nvl(capitalnum,0)-nvl(frozennum,0)+nvl(currentreqnum,0))>0 ";
					} else {
						includeNumZeroSqlwhere = " and  (isnull(capitalnum,0)-isnull(frozennum,0)+isnull(currentreqnum,0))>0 ";
					}

				}

			}
			// 剔除掉在途的请求自身的数量===up================

			String sqlwhere = "";
			sqlwhere = " isdata='" + isdata + "' ";
			if (type.equals("26"))
				sqlwhere = " isdata=2 and capitalgroupid=16 ";
			if (type.equals("3"))
				sqlwhere = " isdata=2 and capitalgroupid=9 ";
			if (isdata == 2) {
				sqlwhere += " and exists(select 1 from CptCapitalShareInfo t2 where t2.relateditemid=t1.id and ( " + csm.getShareWhereByUser("cpt", user) + " )  ) ";
				if ("1".equals(cptuse)) {
					sqlwhere += " and stateid=1 ";
				} else if (!"".equals(cptstateid)) {
					sqlwhere += " and stateid in(" + cptstateid + ") ";
				}
				if ("1".equals(cptsptcount)) {
					sqlwhere += " and sptcount='1' ";
				}
			}

			sqlwhere += includeNumZeroSqlwhere;

			// 权限条件 modify by ds Td:9699
			rs.executeSql("select cptdetachable from SystemSet");
			int detachable = 0;
			if (rs.next()) {
				detachable = rs.getInt("cptdetachable");
			}
			int belid = user.getUserSubCompany1();
			int userId = user.getUID();
			char flag = Util.getSeparator();
			String rightStr = "";
			if (HrmUserVarify.checkUserRight("Capital:Maintenance", user)) {
				rightStr = "Capital:Maintenance";
			}
			String blonsubcomid = "";

			if (detachable == 1 && userId != 1) {
				if (isdata == 2) {
					String sqltmp = "";
					rs2.executeProc("HrmRoleSR_SeByURId", "" + userId + flag + rightStr);
					while (rs2.next()) {
						blonsubcomid = rs2.getString("subcompanyid");
						sqltmp += (", " + blonsubcomid);
					}
					if (!"".equals(sqltmp)) {// 角色设置的权限
						sqltmp = sqltmp.substring(1);
						sqlwhere += " and blongsubcompany in (" + sqltmp + ") ";
					} else {
						sqlwhere += " and blongsubcompany in (" + belid + ") ";
					}
				} else if (isdata == 1) {
					int allsubids[] = cscr.getSubComByUserRightId(user.getUID(), rightStr);
					String allsubid = "";
					for (int i = 0; i < allsubids.length; i++) {
						if (allsubids[i] > 0) {
							allsubid += (allsubid.equals("") ? "" : ",") + allsubids[i];
						}
					}
					if (allsubid.equals(""))
						allsubid = user.getUserSubCompany1() + "";
					if (!"".equals(allsubid)) {// 角色设置的权限
						sqlwhere += " and blongsubcompany in (" + allsubid + ") ";
					} else {
						sqlwhere += " and blongsubcompany in (" + allsubid + ") ";
					}
				}
			}

			// 流程浏览定义条件
			int bdf_wfid = Util.getIntValue(request.getParameter("bdf_wfid"), -1);
			int bdf_fieldid = Util.getIntValue(request.getParameter("bdf_fieldid"), -1);
			int bdf_viewtype = Util.getIntValue(request.getParameter("bdf_viewtype"), -1);
			List<ConditionField> lst = null;
			if (request.getParameter("bdf_wfid") != null && (lst = ConditionField.readAll(bdf_wfid, bdf_fieldid, bdf_viewtype)).size() > 0) {
				for (int i = 0; i < lst.size(); i++) {
					ConditionField f = lst.get(i);
					String fname = f.getFieldName();
					String fvalue = f.getValue();
					boolean isHide = f.isHide();
					boolean isReadOnly = f.isReadonly();
					if (isHide || isReadOnly) {
						if (!"".equals(fvalue) && "mark".equalsIgnoreCase(fname)) {
							sqlwhere += " and t1.mark like '%" + fvalue + "%' ";
						} else if (!"".equals(fvalue) && "fnamark".equalsIgnoreCase(fname)) {
							sqlwhere += " and t1.fnamark like '%" + fvalue + "%' ";
						} else if (!"".equals(fvalue) && "name".equalsIgnoreCase(fname)) {
							sqlwhere += " and t1.name like '%" + fvalue + "%' ";
						} else if (!"".equals(fvalue) && "capitalSpec".equalsIgnoreCase(fname)) {
							sqlwhere += " and t1.capitalSpec like '%" + fvalue + "%' ";
						} else if ("departmentid".equalsIgnoreCase(fname)) {
							String vtype = f.getValueType();
							if ("1".equals(vtype)) {// 当前操作者的值
								fvalue = resComInfo.getDepartmentID("" + user.getUID());
							} else if ("3".equals(vtype)) {// 取表单字段值
								fvalue = "";
								if (f.isGetValueFromFormField()) {
									fvalue = Util.null2String(f.getDepartmentIds(Util.null2String(request.getParameter("bdf_" + fname)).split(",")[0]));
								}
							}
							if (!"".equals(fvalue)) {
								sqlwhere += " and t1.departmentid='" + fvalue + "' ";
							}
						}
					}

				}
			}

			result = browserManager.getResult(request, backfields, fromSql, sqlwhere, pagenum);
		} else if (type.equals("25")) {// 资产组
			result = browserManager.getResult(request, "id,assortmentname", "CptCapitalAssortment", " subassortmentcount=0 ", pagenum);
		} else if (type.equals("242")) {// 资产类型
			result = browserManager.getResult(request, "id,name", "CptCapitalType", pagenum);
		} else if (type.equals("243")) {// 资产状态
			result = browserManager.getResult(request, "id,name", "CptCapitalState", pagenum);
		} else if (type.equals("161") || type.equals("162")) {// 自定义单选
			result = browserManager.getResultCustom(request, pagenum, user);
		} else if (type.equals("129")) {// 项目模板
			result = browserManager.getResult(request, "id,templetName", "Prj_Template", pagenum);
		} else if (type.equals("8") || type.equals("135")) {// 项目
			String sqlwhere = " (" + csm.getPrjShareWhereByUser(user) + ")  ";
			if ("prjtskimp".equals(request.getParameter("from"))) {
				sqlwhere = " (" + csm.getPrjShareWhereByUserCanEdit(user) + ")  ";
			}
			// 流程浏览定义条件
			int bdf_wfid = Util.getIntValue(request.getParameter("bdf_wfid"), -1);
			int bdf_fieldid = Util.getIntValue(request.getParameter("bdf_fieldid"), -1);
			int bdf_viewtype = Util.getIntValue(request.getParameter("bdf_viewtype"), -1);
			List<ConditionField> lst = null;
			if (request.getParameter("bdf_wfid") != null && (lst = ConditionField.readAll(bdf_wfid, bdf_fieldid, bdf_viewtype)).size() > 0) {
				for (int i = 0; i < lst.size(); i++) {
					ConditionField f = lst.get(i);
					String fname = f.getFieldName();
					String fvalue = f.getValue();
					if ("status".equalsIgnoreCase(fname)) {
						List<String> selLst = f.getCanSelectValueList();
						if (selLst != null && selLst.size() > 0) {
							StringBuffer sb = new StringBuffer(" and status in(");
							for (String s : selLst) {
								sb.append(s + ",");
							}
							sb.deleteCharAt(sb.length() - 1).append(")");
							sqlwhere += sb.toString();
						}
					}
					boolean isHide = f.isHide();
					boolean isReadOnly = f.isReadonly();
					if ((isHide || isReadOnly)) {
						if (!"".equals(fvalue) && "name".equalsIgnoreCase(fname)) {
							sqlwhere += " and name like '%" + fvalue + "%' ";
						} else if (!"".equals(fvalue) && "prjtype".equalsIgnoreCase(fname)) {
							sqlwhere += " and prjtype='" + fvalue + "' ";
						} else if (!"".equals(fvalue) && "worktype".equalsIgnoreCase(fname)) {
							sqlwhere += " and worktype='" + fvalue + "' ";
						} else if (!"".equals(fvalue) && "status".equalsIgnoreCase(fname)) {
							sqlwhere += " and status='" + fvalue + "' ";
						} else if ("manager".equalsIgnoreCase(fname)) {
							String vtype = f.getValueType();
							if ("1".equals(vtype)) {// 当前操作者的值
								fvalue = "" + user.getUID();
							} else if ("3".equals(vtype)) {// 取表单字段值
								fvalue = "";
								if (f.isGetValueFromFormField()) {
									fvalue = Util.null2String(request.getParameter("bdf_" + fname)).split(",")[0];
								}
							}
							if (!"".equals(fvalue)) {
								sqlwhere += " and manager='" + fvalue + "' ";
							}
						}
					}

				}
			}

			browserManager.setOrderKey("createdate");
			result = browserManager.getResult(request, "t1.id,t1.name", "Prj_ProjectInfo t1 ", sqlwhere, pagenum);
		} else if (type.equals("prjtsk")) {// 项目任务
			String sqlwhere = (whereClause.length() > 0 ? whereClause + " and " : "") + " tt1.prjid=t1.id and tt1.isdelete =0 and (" + csm.getPrjTskShareWhereByUser(user, "tt1") + ")  ";
			result = browserManager.getResult(request, "tt1.id,tt1.subject", "Prj_TaskProcess tt1,Prj_ProjectInfo t1 ", sqlwhere, pagenum);
		}

		else if (type.equals("244")) {// 项目类型
			result = browserManager.getResult(request, "id,fullname", "Prj_ProjectType", pagenum);
		} else if (type.equals("245")) {// 项目工作类型
			result = browserManager.getResult(request, "id,fullname", "Prj_WorkType", pagenum);
		} else if (type.equals("246")) {// 项目状态
			result = browserManager.getResult(request, "id,description", "Prj_ProjectStatus", pagenum);
		} else if (type.equals("65")) {// 角色
			result = browserManager.getResult(request, "id,rolesmark", "HrmRoles", pagenum);
		} else if (type.equals("9") || type.equals("37")) {// 文档
			ShareManager sm = new ShareManager();
			String sqlwhere = "  docstatus in (1,2,5) and exists(select 1 from (" + sm.getShareDetailTableByUserNew("doc", user) + " )t2 where t2.sourceid=docdetail.id)  ";
			browserManager.setOrderKey("doclastmoddate");
			result = browserManager.getResult(request, "id,docsubject", "docdetail", sqlwhere, pagenum);
		} else if (type.equals("product")) {// 客户-产品
			result = browserManager.getResult(request, "id,assetname", "LgcAssetCountry", pagenum);
		} else if (type.equals("-99995")) {// 客户-行业
			result = browserManager.getResult(request, "id,fullname", "CRM_SectorInfo", pagenum);
		} else if (type.equals("-99994")) {// 客户-产品-类别
			result = browserManager.getResult(request, "id,assortmentname", "LgcAssetAssortment", pagenum);
		} else if (type.equals("69") || type.equals("-99993")) {// 客户-产品-计量单位
			result = browserManager.getResult(request, "id,unitname", "LgcAssetUnit", pagenum);
		} else if (type.equals("89")) {// 会议类型
			String approverSql = "";
			if (!"".equals(whereClause)) {// whereClause 只能传 流程workID
				approverSql = " (approver=" + whereClause + " or approver1=" + whereClause + ")";
			}

			if (!"1".equals(Util.null2String(request.getParameter("forall")))) {// 查询所有,没有权限控制
				whereClause = " 1=1 " + MeetingShareUtil.getTypeShareSql(user);
				;
			}
			if (!"".equals(approverSql)) {
				if ("".equals(whereClause)) {
					whereClause += approverSql;
				} else {
					whereClause += " and " + approverSql;
				}
			}
			result = browserManager.getResult(request, "a.id,a.name", "Meeting_Type a", whereClause, pagenum);
		} else if (type.equals("-99991")) {// 简单流程
			result = browserManager.getResult(request, "id,workflowname", "workflow_base", whereClause, pagenum);
		} else if (type.equals("87") || type.equals("184")) {// 会议室
			if (!"1".equals(Util.null2String(request.getParameter("forall")))) {// 查询所有,没有权限控制
				whereClause = "1=1 and (status=1 or status is null) " + MeetingShareUtil.getRoomShareSql(user);
			}
			result = browserManager.getResult(request, "a.id,a.name", "MeetingRoom a", whereClause, pagenum);
		} else if (type.equals("meetingService")) {// 会议服务
			result = browserManager.getResult(request, "a.id,a.name", "Meeting_Service_Type a", whereClause, pagenum);
		} else if (type.equals("meetingCaller")) {// 预设了会议召集人
			String meetingtype = Util.null2String(request.getParameter("meetingtype"));
			if (!meetingtype.equals("")) {
				// 召集人
				rs2.executeProc("MeetingCaller_SByMeeting", meetingtype);
				String whereclause = "(";
				int ishead = 0;
				while (rs2.next()) {
					String callertype = rs2.getString("callertype");
					int seclevel = Util.getIntValue(rs2.getString("seclevel"), 0);
					String rolelevel = rs2.getString("rolelevel");
					String thisuserid = rs2.getString("userid");
					String departmentid = rs2.getString("departmentid");
					String roleid = rs2.getString("roleid");
					String subcompanyid = rs2.getString("subcompanyid");
					int seclevelMax = Util.getIntValue(rs2.getString("seclevelMax"), 0);

					if (callertype.equals("1")) {
						if (ishead == 0) {
							whereclause += " t1.id=" + thisuserid;
						}
						if (ishead == 1) {
							whereclause += " or t1.id=" + thisuserid;
						}
					}
					if (callertype.equals("2")) {
						if (ishead == 0) {
							whereclause += " t1.id in (select id from hrmresource where departmentid=" + departmentid + " and seclevel >=" + seclevel + " and seclevel <= " + seclevelMax + " )";
						}
						if (ishead == 1) {
							whereclause += " or t1.id in (select id from hrmresource where departmentid=" + departmentid + " and seclevel >=" + seclevel + " and seclevel <= " + seclevelMax + " )";
						}
					}
					if (callertype.equals("3")) {
						if (ishead == 0) {
							whereclause += " t1.id in (select resourceid from hrmrolemembers join hrmresource on  hrmrolemembers.resourceid=hrmresource.id where roleid=" + roleid
									+ " and rolelevel >=" + rolelevel + " and seclevel >=" + seclevel + " and seclevel <= " + seclevelMax + ")";
						}
						if (ishead == 1) {
							whereclause += " or t1.id in (select resourceid from hrmrolemembers join hrmresource on  hrmrolemembers.resourceid=hrmresource.id where roleid=" + roleid
									+ " and rolelevel >=" + rolelevel + " and seclevel >=" + seclevel + " and seclevel <= " + seclevelMax + ")";
						}
					}
					if (callertype.equals("4")) {
						if (ishead == 0) {
							whereclause += " t1.id in (select id from hrmresource where seclevel >=" + seclevel + " and seclevel <= " + seclevelMax + " )";
						}
						if (ishead == 1) {
							whereclause += " or t1.id in (select id from hrmresource where seclevel >=" + seclevel + " and seclevel <= " + seclevelMax + " )";
						}
					}
					if (callertype.equals("5")) {
						if (ishead == 0) {
							whereclause += " t1.id in (select id from hrmresource where subcompanyid1=" + subcompanyid + " and seclevel >=" + seclevel + " and seclevel <= " + seclevelMax + " )";
						}
						if (ishead == 1) {
							whereclause += " or t1.id in (select id from hrmresource where subcompanyid1=" + subcompanyid + " and seclevel >=" + seclevel + " and seclevel <= " + seclevelMax + " )";
						}
					}
					if (ishead == 0)
						ishead = 1;
				}
				// 召集人查询条件
				if (!whereclause.equals("( ") && whereclause.length() > 1) {
					whereclause += " )";
				}

				whereClause = whereclause + " and t1.departmentid = t2.id and (t1.status = 0 or t1.status = 1 or t1.status = 2 or t1.status = 3) ";
				browserManager.setOrderKey("t1.dsporder");
				browserManager.setOrderWay("asc");
				result = browserManager.getResult(request, "t1.id,lastname,departmentname", "hrmresource t1,hrmdepartment t2", whereClause, pagenum, "t1");
			}

		} else if (type.equals("28")) {// 相关会议
			whereClause += " meetingstatus=2 ";
			/** 会议自定义浏览款 * */
			String bdf_wfid = Util.null2String(request.getParameter("bdf_wfid"));
			String bdf_fieldid = Util.null2String(request.getParameter("bdf_fieldid"));
			String bdf_viewtype = Util.null2String(request.getParameter("bdf_viewtype"));
			if (!"".equals(bdf_wfid) && !"".equals(bdf_fieldid) && !"".equals(bdf_viewtype)) {
				List<ConditionField> list = ConditionField.readAll(Util.getIntValue(bdf_wfid), Util.getIntValue(bdf_fieldid), Util.getIntValue(bdf_viewtype));
				if (list != null && list.size() > 0) {
					String conditionFieldName = "";
					String conditionFieldValue = "";
					for (ConditionField conditionField : list) {
						conditionFieldName = conditionField.getFieldName();
						conditionFieldValue = "";
						// 处理后台设置默认值
						if ("name".equalsIgnoreCase(conditionFieldName)) {
							conditionFieldValue = conditionField.getValue();
							if (!"".equals(conditionFieldValue))
								whereClause += " and name like '%" + conditionFieldValue + "%' ";
						} else if ("address".equalsIgnoreCase(conditionFieldName)) {
							if ("2".equals(conditionField.getValueType())) {
								conditionFieldValue = conditionField.getValue();
							} else if ("3".equals(conditionField.getValueType())) {
								if (conditionField.isGetValueFromFormField()) {
									conditionFieldValue = Util.null2String(request.getParameter("bdf_address"));
								}
							}
							if (!"".equals(conditionFieldValue))
								whereClause += " and  address =" + conditionFieldValue;
						} else if ("begindateselect".equalsIgnoreCase(conditionFieldName)) {
							String begindatefrom = "";
							String begindateto = "";
							if (conditionField.isGetValueFromFormField()) {
								String formDate = Util.null2String(request.getParameter("bdf_begindateselect"));
								begindatefrom = "".equals(begindatefrom) ? formDate : begindatefrom;
								begindateto = "".equals(begindateto) ? formDate : begindateto;
							} else {
								begindatefrom = conditionField.getStartDate();
								begindateto = conditionField.getEndDate();
							}
							if (!"".equals(begindatefrom))
								whereClause += " and begindate>='" + begindatefrom + "'";
							if (!"".equals(begindateto))
								whereClause += " and begindate<='" + begindateto + "'";
						}
					}
				}
			}
			/** 会议自定义浏览款 * */
			result = browserManager.getResult(request, "id,name", "meeting", whereClause, pagenum);
		} else if ("wfFormBrowser".equals(type)) {// 流程表单
			String isbill = Util.null2String(request.getParameter("isbill"));// 0 表单
																				// 1 单据
																				// 空值表示所有表单单据
			WfFormBrowser browserData = new WfFormBrowser();
			result = browserData.getResult(isbill, request, user, pagenum);
		} else if ("mdFormBrowser".equals(type)) {// 表单建模表单
			String rightStr = request.getParameter("rightStr");
			String isvirtualform = request.getParameter("isvirtualform");
			whereClause = appDetachComInfo.getCompanyIdByFromMode(user.getUID(), rightStr);
			MdFormBrowser browserData = new MdFormBrowser();
			if (isvirtualform != null && isvirtualform.equals("1")) {
				result = browserData.getResult(request, user, pagenum, whereClause, isvirtualform);
			} else {
				result = browserData.getResult(request, user, pagenum, whereClause, null);
			}
		} else if ("worktypeBrowser".equals(type)) {
			boolean isopenos = RequestUtil.isOpenOtherSystemToDo();
			String showos = Util.null2String(request.getParameter("showos"));
			if (isopenos) {
				String tablename = "";
				if (showos.equals("1")) {
					tablename = "(select id, typename from workflow_type" + " union" + " select sysid as id, sysshortname as typename from ofs_sysinfo ) a ";
				} else {
					tablename = "workflow_type";
				}
				result = browserManager.getResult(request, "id,typename", tablename, whereClause, pagenum);
			} else {
				result = browserManager.getResult(request, "id,typename", "workflow_type", whereClause, pagenum);
			}
		} else if ("workflowBrowser".equals(type)) {// 流程
			String istemplate = Util.null2String(request.getParameter("isTemplate"));
			String reportwfid = Util.null2String(request.getParameter("reportwfid"));
			String showos = Util.null2String(request.getParameter("showos"));
			if ("1".equals(istemplate)) {
				whereClause = "isTemplate ='1'";
			} else {
				whereClause = "isvalid='1'";
			}
			if (!"".equals(reportwfid)) {
				whereClause = " id in (" + reportwfid + ")";
			}

			String isWorkflowDoc = Util.null2String(request.getParameter("isWorkflowDoc"));
			String onlyWfDoc = Util.null2String(request.getParameter("onlyWfDoc"));
			if (isWorkflowDoc.equals("1")) {
				String sql = "select distinct billid from workflow_billfield where type = 9";
				String formids = "";
				rs.execute(sql);
				while (rs.next()) {
					if (formids.equals("")) {
						formids = rs.getString("billid");
					} else {
						formids = formids + "," + rs.getString("billid");
					}
				}
				sql = "select distinct formid from workflow_formfield where fieldid in (select id from workflow_formdict where type=9)";
				rs.execute(sql);
				while (rs.next()) {
					if (formids.equals("")) {
						formids = rs.getString("formid");
					} else {
						formids = formids + "," + rs.getString("formid");
					}
				}
				if (whereClause.equals("")) {
					whereClause = "where formid in (" + formids + ")";
				} else {
					whereClause += " and formid in (" + formids + ")";
				}
				if (!onlyWfDoc.equals("1")) {
					whereClause += " and (isWorkflowDoc!=1 or isWorkflowDoc is null) and (formid<0 or isbill=0)";
				}
			}
			if ("prjwf".equalsIgnoreCase(request.getParameter("from")) && request.getParameter("sqlwhere") != null) {
				whereClause = request.getParameter("sqlwhere");
			}
			if ("htmllayoutchoose".equals(Util.null2String(request.getParameter("from")))) {
				whereClause = Util.null2String(request.getParameter("sqlwhere"));
			}
			if ("1".equals(Util.null2String(request.getParameter("wfRightAdd")))) {
				boolean isUseWfManageDetach = mdc.isUseWfManageDetach();
				// 如果开启分权，且不是管理员
				if (isUseWfManageDetach && !user.getLoginid().equalsIgnoreCase("sysadmin")) {
					String hasRightSub = scc.getRightSubCompany(user.getUID(), "WorkflowManage:All", 0);
					if (!"".equals(hasRightSub)) {
						whereClause += " AND subcompanyid in (" + hasRightSub + ")";
					}
				}
				whereClause += " and (istemplate is null or istemplate<>'1')";
			}

			String subcompanyids = "";
			int detachable = Util.getIntValue(String.valueOf(session.getAttribute("detachable")), 0);
			int[] subCompanyId = null;

			if (detachable == 1 && "1".equals(istemplate)) {
				subCompanyId = cscr.getSubComByUserRightId(user.getUID(), "WorkflowManage:All");
				for (int i = 0; i < subCompanyId.length; i++) {
					subcompanyids += subCompanyId[i] + ",";
				}
				if (subcompanyids.length() > 1) {
					subcompanyids = subcompanyids.substring(0, subcompanyids.length() - 1);
				}
			}
			if (!subcompanyids.equals("")) {
				whereClause += " and subCompanyId in(" + subcompanyids + ")";
			}

			// System.out.println(whereClause);
			// result = browserManager.getResult(request, "id,workflowname",
			// "workflow_base",whereClause,pagenum);
			boolean isopenos = RequestUtil.isOpenOtherSystemToDo();
			if (isopenos && showos.equals("1")) {// 开启异构系统
				String tablename = "(select id,workflowname from workflow_base where 1=1 and " + whereClause + " union select workflowid as id ,workflowname from ofs_workflow where cancel=0) as t";
				result = browserManager.getResult(request, "id,workflowname", tablename, "", pagenum);
			} else {
				result = browserManager.getResult(request, "id,workflowname", "workflow_base", whereClause, pagenum);
			}

		} else if ("worktypeBrowser2".equals(type)) {
			Monitor monitor = new Monitor();
			String sql = monitor.getwftypeRightSql(user.getUID() + "", rs.getDBType());
			whereClause = " id in (" + sql + ")";
			result = browserManager.getResult(request, "id,typename", "workflow_type", whereClause, pagenum);
		} else if ("workflowBrowser2".equals(type)) {// 流程
			Monitor monitor = new Monitor();
			String sql = monitor.getwfidRightSql(user.getUID() + "", rs.getDBType());
			whereClause = " id in (" + sql + ")";
			result = browserManager.getResult(request, "id,workflowname", "workflow_base", whereClause, pagenum);
		} else if ("178".equals(type)) {
			result = browserManager.getResult(request, "yearId,yearName", "Workflow_FieldYear", pagenum);
		} else if ("16".equals(type) || "152".equals(type) || "171".equals(type)) {// 请求、多请求
			String userid = "" + user.getUID();
			String usertype = "0";

			if (user.getLogintype().equals("2"))
				usertype = "1";
			if (rs.getDBType().equals("oracle"))
				whereClause = " (nvl(a.currentstatus,-1) = -1 or (nvl(a.currentstatus,-1)=0 and a.creater=" + user.getUID() + ")) ";
			else
				whereClause = " (isnull(a.currentstatus,-1) = -1 or (isnull(a.currentstatus,-1)=0 and a.creater=" + user.getUID() + ")) ";
			whereClause += " and b.requestid = a.requestid and b.userid=" + userid + " and b.usertype=" + usertype + " and a.workflowid = c.id" + " and c.isvalid in (1,3)";

			// 归档流程
			if ("171".equals(type)) {
				whereClause += " AND currentnodetype=3";
			}

			/* begin：处理费用流程请求浏览按钮过滤逻辑代码 */
			if ("152".equals(type)) {
				String fieldid = Util.null2String(request.getParameter("fieldid"));
				String currworkflowid = Util.null2String(request.getParameter("currworkflowid"));
				if ("".equals(currworkflowid)) {
					currworkflowid = Util.null2String(request.getParameter("workflowid"));
				}
				if (!"".equals(fieldid)) {
					String newwfs[] = fieldid.split("_");
					fieldid = newwfs[0];
				}
				int _bdf_wfid = Util.getIntValue(request.getParameter("bdf_wfid"));
				int _bdf_fieldid = Util.getIntValue(request.getParameter("bdf_fieldid"));
				int __requestid = Util.getIntValue(request.getParameter("__requestid"));
				int _fna_wfid = Util.getIntValue(request.getParameter("fna_wfid"));
				int _fna_fieldid = Util.getIntValue(request.getParameter("fna_fieldid"));
				if (_bdf_wfid > 0 && _fna_wfid <= 0) {
					_fna_wfid = _bdf_wfid;
				}
				if (Util.getIntValue(currworkflowid) > 0 && _fna_wfid <= 0) {
					_fna_wfid = Util.getIntValue(currworkflowid);
				}
				if (_bdf_fieldid > 0 && _fna_fieldid <= 0) {
					_fna_fieldid = _bdf_fieldid;
				}
				if (Util.getIntValue(fieldid) > 0 && _fna_fieldid <= 0) {
					_fna_fieldid = Util.getIntValue(fieldid);
				}
				boolean _isEnableFnaWf = false;
				HashMap<String, String> _isEnableFnaWfHm = FnaCommon.getIsEnableFnaWfHm(_fna_wfid);
				_isEnableFnaWf = "true".equals(_isEnableFnaWfHm.get("isEnableFnaWfE8"));
				int _formId = Util.getIntValue(_isEnableFnaWfHm.get("formId"), 0);
				int _isbill = Util.getIntValue(_isEnableFnaWfHm.get("isbill"), -1);
				if (!_isEnableFnaWf) {
					HashMap<String, String> _isEnableFnaRepaymentWfHm = FnaCommon.getIsEnableFnaRepaymentWfHm(_fna_wfid);
					_isEnableFnaWf = "true".equals(_isEnableFnaRepaymentWfHm.get("isEnableFnaRepaymentWf"));
					_formId = Util.getIntValue(_isEnableFnaRepaymentWfHm.get("formId"), 0);
					_isbill = Util.getIntValue(_isEnableFnaRepaymentWfHm.get("isbill"), -1);
				}
				boolean isFnaWfFysqlcReq = false;
				if (_isEnableFnaWf) {
					isFnaWfFysqlcReq = FnaCommon.checkFnaWfFieldFnaType(_fna_wfid, _fna_fieldid, 2, 0, "fnaFeeWf");
				}
				if (isFnaWfFysqlcReq) {
					String sqlIsNull = "ISNULL";
					String sqlSubString = "SUBSTRING";
					if ("oracle".equals(rs.getDBType())) {
						sqlIsNull = "NVL";
						sqlSubString = "SUBSTR";
					}
					whereClause += " and exists ( " + " select 1 " + " from FnaExpenseInfo fei " + " where fei.budgetperiodslist is not null " + " and fei.sourceRequestid <> " + __requestid + " "
							+ " and fei.status = 0 " + " and fei.requestid = a.requestid "
							+ " GROUP BY fei.organizationid, fei.organizationtype, fei.subject, fei.budgetperiods, fei.budgetperiodslist  " + " HAVING SUM(" + sqlIsNull
							+ "(fei.amount, 0.00)) > 0.00 " + " ) and a.currentnodetype = 3 ";
				}

			} else if ("16".equals(type)) {
				String fieldid = Util.null2String(request.getParameter("fieldid"));
				String currworkflowid = Util.null2String(request.getParameter("currworkflowid"));
				if ("".equals(currworkflowid)) {
					currworkflowid = Util.null2String(request.getParameter("workflowid"));
				}
				if (!"".equals(fieldid)) {
					String newwfs[] = fieldid.split("_");
					fieldid = newwfs[0];
				}
				int _bdf_wfid = Util.getIntValue(request.getParameter("bdf_wfid"));
				int _bdf_fieldid = Util.getIntValue(request.getParameter("bdf_fieldid"));
				int __requestid = Util.getIntValue(request.getParameter("__requestid"));
				int _fna_wfid = Util.getIntValue(request.getParameter("fna_wfid"));
				int _fna_fieldid = Util.getIntValue(request.getParameter("fna_fieldid"));
				if (_bdf_wfid > 0 && _fna_wfid <= 0) {
					_fna_wfid = _bdf_wfid;
				}
				if (Util.getIntValue(currworkflowid) > 0 && _fna_wfid <= 0) {
					_fna_wfid = Util.getIntValue(currworkflowid);
				}
				if (_bdf_fieldid > 0 && _fna_fieldid <= 0) {
					_fna_fieldid = _bdf_fieldid;
				}
				if (Util.getIntValue(fieldid) > 0 && _fna_fieldid <= 0) {
					_fna_fieldid = Util.getIntValue(fieldid);
				}
				boolean _isEnableFnaWf = false;
				HashMap<String, String> _isEnableFnaWfHm = FnaCommon.getIsEnableFnaWfHm(_fna_wfid);
				_isEnableFnaWf = "true".equals(_isEnableFnaWfHm.get("isEnableFnaWfE8"));
				int _formId = Util.getIntValue(_isEnableFnaWfHm.get("formId"), 0);
				int _isbill = Util.getIntValue(_isEnableFnaWfHm.get("isbill"), -1);
				if (!_isEnableFnaWf) {
					HashMap<String, String> _isEnableFnaRepaymentWfHm = FnaCommon.getIsEnableFnaRepaymentWfHm(_fna_wfid);
					_isEnableFnaWf = "true".equals(_isEnableFnaRepaymentWfHm.get("isEnableFnaRepaymentWf"));
					_formId = Util.getIntValue(_isEnableFnaRepaymentWfHm.get("formId"), 0);
					_isbill = Util.getIntValue(_isEnableFnaRepaymentWfHm.get("isbill"), -1);
				}
				boolean isFnaWfFysqlcReq = false;
				boolean isFnaWfRepaymentBorrowReq = false;
				boolean isFnaWfAdvanceRepaymentAdvanceReq = false;// 是否是还款流程的冲销预付款明细的预付款流程浏览按钮
				if (_isEnableFnaWf) {
					isFnaWfFysqlcReq = FnaCommon.checkFnaWfFieldFnaType(_fna_wfid, _fna_fieldid, 2, 0, "fnaFeeWf");
					isFnaWfRepaymentBorrowReq = (FnaCommon.checkFnaWfFieldFnaType(_fna_wfid, _fna_fieldid, 1, 2, "repayment") || FnaCommon.checkFnaWfFieldFnaType(_fna_wfid, _fna_fieldid, 1, 2,
							"fnaFeeWf"));
					isFnaWfAdvanceRepaymentAdvanceReq = FnaCommon.checkFnaWfFieldFnaType(_fna_wfid, _fna_fieldid, 1, 4, "fnaFeeWf");
				}
				int borrowType = Util.getIntValue(request.getParameter("borrowType"), -1);
				if (isFnaWfFysqlcReq) {
					String sqlIsNull = "ISNULL";
					String sqlSubString = "SUBSTRING";
					if ("oracle".equals(rs.getDBType())) {
						sqlIsNull = "NVL";
						sqlSubString = "SUBSTR";
					}
					whereClause += " and exists ( " + " select 1 " + " from FnaExpenseInfo fei " + " where fei.budgetperiodslist is not null " + " and fei.sourceRequestid <> " + __requestid + " "
							+ " and fei.status = 0 " + " and fei.requestid = a.requestid "
							+ " GROUP BY fei.organizationid, fei.organizationtype, fei.subject, fei.budgetperiods, fei.budgetperiodslist  " + " HAVING SUM(" + sqlIsNull
							+ "(fei.amount, 0.00)) > 0.00 " + " ) and a.currentnodetype = 3 ";
				} else if (isFnaWfRepaymentBorrowReq) {
					String _condBorrowType = "";
					if (borrowType == -1 || borrowType == 0) {
						_condBorrowType += " (fbi1.borrowType0 = 0 and fbi1.applicantid = " + user.getUID() + ") \n";
					}
					if (borrowType == -1) {
						_condBorrowType += " or \n";
					}
					if (borrowType == -1 || borrowType == 1) {
						_condBorrowType += " (fbi1.borrowType1 = 1) \n";
					}
					if ("".equals(whereClause)) {
						whereClause += " where 1=1 ";
					}
					whereClause += " and exists ( \n" + " select 1 from ( \n" + "	select fbi.borrowRequestId, fbi.borrowRequestIdDtlId, \n"
							+ "		SUM(fbi.amountBorrow * fbi.borrowDirection) sum_amountBorrow, \n" + "		MAX(CASE WHEN fbi.recordType = 'borrow' THEN fbi.applicantid ELSE 0 END) applicantid, \n"
							+ "		MAX(CASE WHEN fbi.recordType = 'borrow' THEN fbi.departmentid ELSE 0 END) departmentid, \n"
							+ "		MAX(CASE WHEN fbi.recordType = 'borrow' THEN fbi.subcompanyid1 ELSE 0 END) subcompanyid1, \n"
							+ "		MAX(CASE WHEN fbi.borrowType = 0 THEN fbi.borrowType ELSE -99999 END) borrowType0, \n"
							+ "		MAX(CASE WHEN fbi.borrowType = 1 THEN fbi.borrowType ELSE -99999 END) borrowType1 \n" + "	from FnaBorrowInfo fbi \n" + "	where fbi.requestid <> " + __requestid
							+ " \n" + "	GROUP BY fbi.borrowRequestId, fbi.borrowRequestIdDtlId \n" + " ) fbi1 \n" + " where fbi1.sum_amountBorrow > 0 \n"
							+ " and fbi1.borrowRequestId = a.requestId \n" + " and (" + _condBorrowType + ") \n" + " ) \n";
				} else if (isFnaWfAdvanceRepaymentAdvanceReq) {
					if ("".equals(whereClause)) {
						whereClause += " where 1=1 ";
					}
					whereClause += " and exists ( \n" + " select 1 from ( \n" + "	select fbi.advanceRequestId, fbi.advanceRequestIdDtlId, \n"
							+ "		SUM(fbi.amountAdvance * fbi.advanceDirection) sum_amountAdvance \n" + "	from FnaAdvanceInfo fbi \n" + "	where fbi.requestid <> " + __requestid + " \n"
							+ "	GROUP BY fbi.advanceRequestId, fbi.advanceRequestIdDtlId \n" + " ) fbi1 \n" + " where fbi1.sum_amountAdvance > 0 \n" + " and fbi1.advanceRequestId = a.requestId \n"
							+ " ) \n";
				}

			}
			/* end：处理费用流程请求浏览按钮过滤逻辑代码 */

			String workflowId = Util.null2String(request.getParameter("currworkflowid"));
			String fieldId = Util.null2String(request.getParameter("fieldid"));
			Browsedatadefinition bdf = new Browsedatadefinition();
			if (bdf.read(workflowId, fieldId)) {
				// 拼接浏览数据自定义的条件
				if (!"".equals(bdf.getRequestname()) && (bdf.isHide(bdf.getRequestnameopen()) || bdf.isReadonly(bdf.getRequestnamereadonly()))) {
					whereClause += " AND requestname LIKE '%" + Util.fromScreen2(bdf.getRequestname(), user.getLanguage()) + "%'";
				}
				if (!"".equals(bdf.getWorkflowtype()) && (bdf.isHide(bdf.getWorkflowtypeopen()) || bdf.isReadonly(bdf.getWorkflowtypereadonly()))) {
					whereClause += " AND a.workflowid IN (" + bdf.getAllVersionStringByWFIDs() + ")";
				}
				if (!"".equals(bdf.getProcessnumber()) && (bdf.isHide(bdf.getProcessnumberopen()) || bdf.isReadonly(bdf.getProcessnumberreadonly()))) {
					whereClause += " AND requestmark LIKE '%" + bdf.getProcessnumber() + "%'";
				}
				if (bdf.isHide(bdf.getCreatetypeidopen()) || bdf.isReadonly(bdf.getCreatetypeidreadonly())) {
					if ("1".equals(bdf.getCreatetype())) {
						// 当前操作者
						whereClause += " AND creater=" + user.getUID() + " AND creatertype=0";
					} else if ("2".equals(bdf.getCreatetype())) {
						// 指定人员
						if (!"".equals(bdf.getCreatetypeid())) {
							whereClause += " AND creater IN (" + bdf.getCreatetypeid() + ") AND creatertype=0";
						}
					} else if ("3".equals(bdf.getCreatetype())) {
						// 表单字段
						String cre = Util.null2String(request.getParameter("cre"));
						if (!"".equals(cre)) {
							whereClause += " AND creater IN (" + cre + ") AND creatertype=0";
						}
					}
				}
				if (bdf.isHide(bdf.getCreatedeptidopen()) || bdf.isReadonly(bdf.getCreatedeptidreadonly())) {
					if ("1".equals(bdf.getCreatedepttype())) {
						// 当前操作者部门
						if (user.getUserDepartment() != 0) {
							whereClause += " AND a.creater IN (SELECT DISTINCT id FROM hrmresource WHERE departmentid=" + user.getUserDepartment() + ")";
						}
					} else if ("2".equals(bdf.getCreatedepttype())) {
						// 指定部门
						if (!"".equals(bdf.getDepartment()) && !"0".equals(bdf.getDepartment())) {
							whereClause += " AND a.creater IN (SELECT DISTINCT id FROM hrmresource WHERE departmentid IN (" + bdf.getDepartment() + "))";
						}
					} else if ("3".equals(bdf.getCreatedepttype())) {
						// 表单字段
						String dep = Util.null2String(request.getParameter("dep"));
						if (!"".equals(dep)) {
							whereClause += " AND a.creater IN (SELECT DISTINCT id FROM hrmresource WHERE departmentid IN (" + bdf.getDepartmentSQL(dep) + "))";
						}
					}
				}
				if (bdf.isHide(bdf.getCreatesubidopen()) || bdf.isReadonly(bdf.getCreatesubidreadonly())) {
					if ("1".equals(bdf.getCreatesubtype())) {
						// 当前操作者分部
						if (user.getUserSubCompany1() != 0) {
							whereClause += " AND a.creater IN (SELECT DISTINCT id FROM hrmresource WHERE subcompanyid1=" + user.getUserSubCompany1() + ")";
						}
					} else if ("2".equals(bdf.getCreatesubtype())) {
						// 指定分部
						if (!"".equals(bdf.getCreatesubid())) {
							whereClause += " AND a.creater IN (SELECT DISTINCT id FROM hrmresource WHERE subcompanyid1 IN (" + bdf.getCreatesubid() + "))";
						}
					} else if ("3".equals(bdf.getCreatesubtype())) {
						// 表单字段
						String sub = Util.null2String(request.getParameter("sub"));
						if (!"".equals(sub)) {
							whereClause += " AND a.creater IN (SELECT DISTINCT id FROM hrmresource WHERE subcompanyid1 IN (" + bdf.getSubcompanySQL(sub) + "))";
						}
					}
				}
				if (bdf.isHide(bdf.getCreatedateopen()) || bdf.isReadonly(bdf.getCreatedatereadonly())) {
					if ("2".equals(bdf.getCreatedatetype())) {// 今天
						SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");// 设置日期格式
						String currentdate = sdf.format(new Date());
						whereClause += " AND createdate>='" + currentdate + "'";
					} else if ("3".equals(bdf.getCreatedatetype())) {// 本周
						SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");// 设置日期格式
						whereClause += " AND createdate>='" + sdf.format(bdf.getMonday()) + "' AND createdate<='" + sdf.format(bdf.getSunday()) + "'";
					} else if ("4".equals(bdf.getCreatedatetype())) {// 本月
						SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");// 设置日期格式
						whereClause += " AND createdate>='" + sdf.format(bdf.getFirstDayOfMonth()) + "' AND createdate<='" + sdf.format(bdf.getLastDayOfMonth()) + "'";
					} else if ("5".equals(bdf.getCreatedatetype())) {// 本季
						SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");// 设置日期格式
						whereClause += " AND createdate>='" + sdf.format(bdf.getFirstDayOfQuarter()) + "' AND createdate<='" + sdf.format(bdf.getLastDayOfQuarter()) + "'";
					} else if ("6".equals(bdf.getCreatedatetype())) {// 本年
						SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");// 设置日期格式
						whereClause += " AND createdate>='" + bdf.getYearDateStart() + "' AND createdate<='" + bdf.getYearDateEnd() + "'";
					} else if ("7".equals(bdf.getCreatedatetype())) {// 指定日期
						if (!"".equals(bdf.getCreatedatestart())) {
							whereClause += " AND createdate>='" + bdf.getCreatedatestart() + "'";
						}
						if (!"".equals(bdf.getCreatedateend())) {
							whereClause += " AND createdate<='" + bdf.getCreatedateend() + "'";
						}
					} else if ("8".equals(bdf.getCreatedatetype())) {
						// 表单字段
						String date = Util.null2String(request.getParameter("date"));
						if (!"".equals(date)) {
							whereClause += " AND createdate>='" + date + "'";
						}
					}
				}
				if ((bdf.isHide(bdf.getXgxmidopen()) || bdf.isReadonly(bdf.getXgxmidreadonly()))) {
					String xgxmids = "";
					if ("2".equals(bdf.getXgxmtype())) {
						// 指定项目
						xgxmids = bdf.getXgxmid();
					} else if ("3".equals(bdf.getXgxmtype())) {
						// 表单字段
						xgxmids = Util.null2String(request.getParameter("xgxm"));
					}
					if (!"".equals(xgxmids)) {
						String[] xgxmidAry = xgxmids.split(",");
						if (xgxmidAry.length > 0) {
							whereClause += " AND (";
							if ("oracle".equals(rs.getDBType())) {
								for (int i = 0; i < xgxmidAry.length; i++) {
									if (i > 0) {
										whereClause += " OR ";
									}
									whereClause += "(CONCAT(CONCAT(',' , TO_CHAR(a.prjids)) , ',') LIKE '%," + xgxmidAry[i] + ",%')";
								}
							} else {
								for (int i = 0; i < xgxmidAry.length; i++) {
									if (i > 0) {
										whereClause += " OR ";
									}
									whereClause += "(',' + CONVERT(VARCHAR,a.prjids) + ',' LIKE '%," + xgxmidAry[i] + ",%')";
								}
							}
							whereClause += ") ";
						}
					}
				}
				if ((bdf.isHide(bdf.getXgkhidopen()) || bdf.isReadonly(bdf.getXgkhidreadonly()))) {
					String xgkhids = "";
					if ("2".equals(bdf.getXgkhtype())) {
						// 指定客户
						xgkhids = bdf.getXgkhid();
					} else if ("3".equals(bdf.getXgkhtype())) {
						// 表单字段
						xgkhids = Util.null2String(request.getParameter("xgkh"));
					}
					if (!"".equals(xgkhids)) {
						String[] xgkhidAry = xgkhids.split(",");
						if (xgkhidAry.length > 0) {
							whereClause += " AND (";
							if ("oracle".equals(rs.getDBType())) {
								for (int i = 0; i < xgkhidAry.length; i++) {
									if (i > 0) {
										whereClause += " OR ";
									}
									whereClause += "(CONCAT(CONCAT(',' , TO_CHAR(a.crmids)) , ',') LIKE '%," + xgkhidAry[i] + ",%')";
								}
							} else {
								for (int i = 0; i < xgkhidAry.length; i++) {
									if (i > 0) {
										whereClause += " OR ";
									}
									whereClause += "(',' + CONVERT(VARCHAR,a.crmids) + ',' LIKE '%," + xgkhidAry[i] + ",%')";
								}
							}
							whereClause += ") ";
						}
					}
				}
				if ("1".equals(bdf.getGdtype()) && (bdf.isHide(bdf.getGdtypeopen()) || bdf.isReadonly(bdf.getGdtypereadonly()))) {
					whereClause += " AND currentnodetype<3";
				} else if ("2".equals(bdf.getGdtype())) {
					whereClause += " AND currentnodetype=3";
				}
				if (!"".equals(bdf.getJsqjtype()) && !"38".equals(bdf.getJsqjtype()) && (bdf.isHide(bdf.getJsqjtypeopen()) || bdf.isReadonly(bdf.getJsqjtypereadonly()))) {// 38为全部
					int date2during = Util.getIntValue(bdf.getJsqjtype(), 0);
					if (date2during > 0) {
						WorkflowComInfo wfci = new WorkflowComInfo();
						whereClause += wfci.getDateDuringSql(date2during);
					}
				}
			}
			browserManager.setOrderKey("a.createdate");
			result = browserManager.getResult(request, "a.requestid,a.requestname", "workflow_requestbase a,workflow_currentoperator b,workflow_base c", whereClause, pagenum, "a");
		} else if ("workflowChangeBrowser".equals(type)) {
			whereClause = " t2.status='1' AND t2.flowDocField>0 AND t1.id=t2.workflowid  and t1.isvalid=1 ";
			/*
			 * whereClause += " and t1.id in(select t1.id from workflow_base
			 * t1,workflow_fieldLable fieldLable,workflow_formField formField,
			 * workflow_formdict formDict"; whereClause += " where
			 * fieldLable.formid = formField.formid "; whereClause += " and
			 * fieldLable.fieldid = formField.fieldid "; whereClause += " and
			 * formField.fieldid = formDict.ID and (formField.isdetail<>'1' or
			 * formField.isdetail is null) "; whereClause += " and
			 * formField.formid = t1.formid and fieldLable.langurageid =
			 * "+user.getLanguage(); whereClause += " and formDict.fieldHtmlType =
			 * '3' and formDict.type = 9 "; whereClause += " group by t1.id) ";
			 */
			whereClause += " and t1.id not in(select workflowid from DocChangeWorkflow)";
			result = browserManager.getResult(request, "t1.id,t1.workflowname", "workflow_base t1,workflow_createdoc t2", whereClause, pagenum, "t1");
		} else if ("monitortypeBrowser".equals(type)) {// 流程监控类型
			result = browserManager.getResult(request, "id,typename", "Workflow_MonitorType", pagenum);
		} else if ("queryTypeBrowser".equals(type)) {// 流程自定义查询种类
			result = browserManager.getResult(request, "id,typename", "workflow_customQuerytype", pagenum);
		} else if ("reportTypeBrowser".equals(type)) {// 流程报表类型
			result = browserManager.getResult(request, "id,typename", "Workflow_ReportType", pagenum);
		} else if ("ruleBrowser".equals(type)) {// 流程规则
			whereClause = " rulesrc=3 ";
			result = browserManager.getResult(request, "id,rulename,condit", "rule_base", whereClause, pagenum);
		} else if ("workflowNodeBrowser".equals(type)) {// 流程节点
			String wfid = Util.null2String(request.getParameter("wfid"));
			String whereparas = " (b.IsFreeNode is null or b.IsFreeNode!='1') and a.nodeId=b.id  and a.workflowId='" + wfid + "'";
			result = browserManager.getResult(request, "nodeId,nodeName", "workflow_flownode a,workflow_nodebase b", whereparas, pagenum);
		} else if ("WorkflowNodePortalBrowserMulti".equals(type)) {// 多流程出口
			String wfid = Util.null2String(request.getParameter("wfid"));
			String whereparas = " wfrequestid is null \n" + " and not EXISTS(select 1 from workflow_nodebase b where workflow_nodelink.nodeid=b.id and b.IsFreeNode='1') \n"
					+ " and not EXISTS(select 1 from workflow_nodebase b where workflow_nodelink.destnodeid=b.id and b.IsFreeNode='1') \n" + " and workflowid=" + wfid + " ";
			result = browserManager.getResult(request, "id, linkname", "workflow_nodelink", whereparas, pagenum);
		} else if ("fieldBrowser".equals(type)) {// 流程字段
			FieldBrowser fieldBrowser = new FieldBrowser();
			String wfid = Util.null2String(request.getParameter("wfid"));
			result = fieldBrowser.getResult(request, wfid, user, pagenum);
		} else if ("categoryBrowser".equals(type)) {// 文档子目录
			CategoryBrowser categoryBrowser = new CategoryBrowser();
			result = categoryBrowser.getResult(request, user, pagenum);
		} else if (type.equals("hrmjobtitles") || type.equals("24") || type.equals("278")) {// 岗位
			result = browserManager.getResult(request, "t1.id,jobtitlename", " hrmjobtitles t1 ", whereClause, pagenum);
		} else if (type.equals("jobactivity")) {// 岗位类别
			result = browserManager.getResult(request, "id,jobactivityname", "HrmJobActivities", pagenum);
		} else if (type.equals("jobcall") || type.equals("260")) {// 职务
			result = browserManager.getResult(request, "id,name", "hrmjobcall", pagenum);
		} else if (type.equals("jobgroup")) {// 职务类型
			result = browserManager.getResult(request, "id,jobgroupname", "hrmjobgroups", pagenum);
		} else if (type.equals("location") || type.equals("262")) {// 办公地点
			result = browserManager.getResult(request, "id,locationname", "hrmlocations", pagenum);
		} else if (type.equals("usekind") || type.equals("31")) {// 用功性质
			result = browserManager.getResult(request, "id,name", "HrmUseKind", pagenum);
		} else if (type.equals("usedemand")) {// 用工需求
			result = browserManager.getResult(request, "a.id,b.jobtitlename", "HrmUseDemand a left join HrmJobTitles b on a.demandjobtitle = b.id", pagenum);
		} else if (type.equals("careerplan")) {// 招聘计划
			result = browserManager.getResult(request, "id,topic", "HrmCareerPlan", pagenum);
		} else if (type.equals("inviteinfo")) {// 招聘信息
			result = browserManager.getResult(request, "a.id,b.jobtitlename", "HrmCareerInvite a left join HrmJobTitles b on a.careername = b.id", pagenum);
		} else if (type.equals("city") || type.equals("58")) {// 城市
			result = browserManager.getResult(request, "id,cityname", "HrmCity", "( canceled = '0' or canceled is null) ", pagenum);
		} else if (type.equals("educationlevel") || type.equals("30")) {// 学历
			result = browserManager.getResult(request, "id,name", "HrmEducationLevel", pagenum);
		} else if (type.equals("speciality") || type.equals("119")) {// 专业
			result = browserManager.getResult(request, "id,name", "Hrmspeciality", pagenum);
		} else if (type.equals("country") || type.equals("258")) {// 国家
			result = browserManager.getResult(request, "id,countrydesc", "HrmCountry", pagenum);
		} else if (type.equals("hrmbank")) {// 工资银行
			result = browserManager.getResult(request, "id,bankname", "HrmBank", pagenum);
		} else if (type.equals("systemlanguage") || type.equals("261")) {// 系统语言
			result = browserManager.getResult(request, "id,language", "syslanguage", pagenum);
		} else if (type.equals("customerStatus") || type.equals("264")) {// 客户状态
			result = browserManager.getResult(request, "id,fullname", "CRM_CustomerStatus", pagenum);
		} else if (type.equals("customerType") || type.equals("60")) {// 客户类型
			result = browserManager.getResult(request, "id,fullname", "CRM_CustomerType", pagenum);
		} else if (type.equals("customerDesc") || type.equals("61")) {// 客户描述
			result = browserManager.getResult(request, "id,fullname", "CRM_CustomerDesc", pagenum);
		} else if (type.equals("customerSize") || type.equals("62")) {// 客户规模
			result = browserManager.getResult(request, "id,fullname", "CRM_CustomerSize", pagenum);
		} else if (type.equals("debtorNumber")) {// 客户 累积合同金额
			result = browserManager.getResult(request, "id,fullname", "CRM_TradeInfo", pagenum);
		} else if (type.equals("creditorNumber")) {// 客户 信用等级
			result = browserManager.getResult(request, "id,fullname", "CRM_CreditInfo", pagenum);
		} else if (type.equals("contactWay") || type.equals("265")) {// 客户获得途径
			result = browserManager.getResult(request, "id,fullname", "CRM_ContactWay", pagenum);
		} else if (type.equals("sector") || type.equals("63")) {// 客户行业
			result = browserManager.getResult(request, "id,fullname", "CRM_SectorInfo", pagenum);
		} else if (type.equals("agent")) {// 中介结构
			result = browserManager.getResult(request, "id,name", "CRM_CustomerInfo", "( type in (3,4) )", pagenum);
		} else if (type.equals("customerContacter") || type.equals("67")) {// 客户联系人
			result = browserManager.getResult(request, "id,fullname", "CRM_CustomerContacter", whereClause, pagenum);
		} else if (type.equals("sellchance")) {// 客户商机
			result = browserManager.getResult(request, "id,subject", "crm_sellchance", pagenum);
		} else if (type.equals("wechatPlatform")) {// 微信平台选择
			result = browserManager.getResult(request, "id,name", "wechat_platform", " isdelete=0 and state=0 ", pagenum);
		} else if (type.equals("reminderMode")) {// 提醒模式
			result = browserManager.getResult(request, "t2.type,t2.typename",
					"wechat_reminder_type t2 join wechat_reminder_mode t3 on t2.modekey=t3.modekey left JOIN wechat_reminder_set t1 on t2.type=t1.type", " id is null ", pagenum);
		} else if (type.equals("wechatHrm")) {// 微信绑定人员
			String publicid = Util.null2String(request.getParameter("publicid"));
			if (!"".equals(publicid)) {
				whereClause = " exists (select 1 from wechat_band where publicid='" + publicid + "' and openid is not null and usertype=1 and userid=t1.id ) ";
				result = browserManager.getResult(request, "t1.id,lastname,departmentname", "hrmresource t1 join hrmdepartment t2 on t1.departmentid = t2.id", whereClause, pagenum);
			}
		} else if (type.equals("smsHrm")) {// 有手机号码的人员
			// 只显示有手机号码的在职人员
			if (rs.getDBType().equals("oracle")) {
				whereClause = " mobile||'1'<>'1' and mobile is not null and (t1.status = 0 or t1.status = 1 or t1.status = 2 or t1.status = 3) ";
			} else {
				whereClause = " mobile<>'' and mobile is not null and (t1.status = 0 or t1.status = 1 or t1.status = 2 or t1.status = 3) ";
			}
			result = browserManager.getResult(request, "t1.id,lastname", "hrmresource t1", whereClause, pagenum, "t1");
		} else if (type.equals("smsReminderMode")) {// 短信提醒模式
			result = browserManager.getResult(request, "t2.type,t2.typename",
					"sms_reminder_type t2 join sms_reminder_mode t3 on t2.modekey=t3.modekey left JOIN sms_reminder_set t1 on t2.type=t1.type", " id is null ", pagenum);
		} else if (type.equals("dataSetBrowser")) {// 数据集
			result = browserManager.getResult(request, "a.id,a.dSetName", "fnaDataSet a", "", pagenum);
		} else if (type.equals("fnaVoucherBrowser")) {// XML模板
			result = browserManager.getResult(request, "a.id,a.xmlName", "fnaVoucherXml a", "", pagenum);
		} else if (type.equals("22") || type.equals("FnaBudgetfeeType")) {// 报销费用类型(科目)
			String bdf_wfid = Util.null2String(request.getParameter("bdf_wfid"));
			String bdf_fieldid = Util.null2String(request.getParameter("bdf_fieldid"));
			boolean isFnaFeeWfInfo = false;
			if (Util.getIntValue(bdf_wfid) > 0) {
				String sql = "select count(*) cnt from fnaFeeWfInfo where workflowid = " + Util.getIntValue(bdf_wfid);
				rs2.executeSql(sql);
				isFnaFeeWfInfo = (rs2.next() && rs2.getInt("cnt") > 0);
			}
			int fromFnaRequest = Util.getIntValue(request.getParameter("fromFnaRequest"), 0);
			if (fromFnaRequest == 1 && isFnaFeeWfInfo) {
				boolean subjectFilter = false;
				String sql = "select * from FnaSystemSet";
				rs2.executeSql(sql);
				while (rs2.next()) {
					subjectFilter = 1 == Util.getIntValue(rs2.getString("subjectFilter"), 0);
				}

				if (subjectFilter) {
					int orgType = Util.getIntValue(request.getParameter("orgType"), -1);
					int orgId = Util.getIntValue(request.getParameter("orgId"), -1);
					String orgClause = " ";

					if (orgType > 0 && orgId > 0) {
						int sqlCondOrgType4ftRul = orgType;
						int sqlCondOrgId4ftRul = orgId;
						if (orgType == 3) {
							sqlCondOrgType4ftRul = 2;
							sqlCondOrgId4ftRul = Util.getIntValue(resComInfo.getDepartmentID(orgId + ""));
						}

						orgClause = " ( \n" + " not exists (select 1 from FnabudgetfeetypeRuleSet ftRul \n" + " 		where ftRul.type = " + sqlCondOrgType4ftRul + " and ftRul.mainid = a.id ) \n"
								+ " or \n" + " exists (select 1 from FnabudgetfeetypeRuleSet ftRul \n" + " 		where ftRul.type = " + sqlCondOrgType4ftRul + " and ftRul.orgid = " + sqlCondOrgId4ftRul
								+ " and ftRul.mainid = a.id ) \n" + " ) \n";

					} else {
						orgClause = " 1=1 ";
					}
					if (!"".equals(whereClause)) {
						whereClause += " and ";
					}
					whereClause += orgClause;
				}
			}

			// 路径设置浏览按钮数据
			// 科目过滤
			if (Util.getIntValue(bdf_wfid) > 0 && Util.getIntValue(bdf_fieldid) > 0) {
				String sql = " SELECT count(*) cnt \n" + " from FnaFeetypeWfbrowdef_dt1 t1 \n" + " join FnaFeetypeWfbrowdef t2 on t1.mainid = t2.id \n" + " where t2.fieldType = "
						+ BudgetfeeTypeComInfo.FNAFEETYPE_FIELDTYPE + "\n" + " and t2.fieldId = " + Util.getIntValue(bdf_fieldid) + "\n" + " and t2.workflowid = " + Util.getIntValue(bdf_wfid) + " ";
				rs.executeSql(sql);
				if (rs.next() && rs.getInt("cnt") > 0) {
					String wfFeetypeClause = " ( exists ( " + " SELECT 1 \n" + " from FnaFeetypeWfbrowdef_dt1 t1 \n" + " join FnaFeetypeWfbrowdef t2 on t1.mainid = t2.id \n"
							+ " join FnaBudgetfeeType t3 on t1.refid = t3.id \n" + " where a.allSupSubjectIds like (t3.allSupSubjectIds+'%') \n" + " and t2.fieldType = "
							+ BudgetfeeTypeComInfo.FNAFEETYPE_FIELDTYPE + "\n" + " and t2.fieldId = " + Util.getIntValue(bdf_fieldid) + "\n" + " and t2.workflowid = " + Util.getIntValue(bdf_wfid)
							+ "\n" + " ) ) ";
					if (!"".equals(whereClause)) {
						whereClause += " and ";
					}
					whereClause += wfFeetypeClause;
				}
			}

			if (!"".equals(whereClause)) {
				whereClause += " and ";
			}

			whereClause += " (a.Archive is null or a.Archive = 0) and a.isEditFeeTypeId > 0 ";

			result = browserManager.getResult(request, "a.id, a.name, ' ' name1 ", "FnaBudgetfeeType a", whereClause, pagenum);
			// 判断是否显示科目全路径
			String sqlSet = "select enableDispalyAll,separator from FnaSystemSet";
			rs.executeSql(sqlSet);
			int enableDispalyAll = 0;
			String separator = "";
			while (rs.next()) {
				enableDispalyAll = rs.getInt("enableDispalyAll");
				separator = Util.null2String(rs.getString("separator"));
			}
			if (enableDispalyAll == 1) {// 需显示三级科目
				JSONArray json = new JSONArray().fromObject(result);
				BudgetfeeTypeComInfo bftci = new BudgetfeeTypeComInfo();
				for (int i = 0; i < json.size(); i++) {
					String id = json.getJSONObject(i).getString("id");
					String name = json.getJSONObject(i).getString("name");
					String fullName = bftci.getSubjectFullName(id, separator);
					;
					json.getJSONObject(i).put("name", fullName);
				}
				result = json.toString();
			}
		} else if (type.equals("FnaBudgetfeeTypeMulti")) {// 多报销费用类型(多科目)
															// url:/fna/browser/FnaBudgetfeeTypeBrowserMulti.jsp
			if (!"".equals(whereClause)) {
				whereClause += " and ";
			}
			whereClause += " and (a.Archive is null or a.Archive = 0) and a.isEditFeeTypeId > 0 ";
			result = browserManager.getResult(request, "id, name", "FnaBudgetfeeType a", whereClause, pagenum);
		} else if (type.equals("FnaBudgetfeeTypeMultiByGroupCtrl")) {// 多报销费用类型(多科目)
																		// 只查询进行费控的科目
																		// url:/fna/browser/feeTypeByGroupCtrl/FnaBudgetfeeTypeByGroupCtrlBrowserMulti.jsp
			if (!"".equals(whereClause)) {
				whereClause += " and ";
			}
			whereClause += " (a.Archive is null or a.Archive = 0) and a.id = a.groupCtrlId ";

			int feeperiod = Util.getIntValue(request.getParameter("feeperiod"), 0);
			if (feeperiod > 0) {
				whereClause += " and a.feeperiod = " + feeperiod + " ";
			}

			result = browserManager.getResult(request, "id, name", "FnaBudgetfeeType a", whereClause, pagenum);
		} else if (type.equals("FnaFeetypeWfBtnSetting")) {// 路径设置-高级设置-浏览数据定义-科目
			// 在后台路径设置的地方可以选择一级、二级科目、三级科目

			result = browserManager.getResult(request, "id, name", "FnaBudgetfeeType a", whereClause, pagenum);
		} else if (type.equals("FnaWfSetMulti")) {// 多费控流程选择
													// url:/fna/browser/fnaWfSet/FnaWfSetBrowserMulti.jsp
			result = browserManager.getResult(request, "a.id, b.workflowname", "fnaFeeWfInfo a join workflow_base b on a.workflowid = b.id", "", pagenum);
		} else if (type.equals("FnaControlSchemeSetMulti")) {// 多费控方案选择
																// url:/fna/browser/fnaControlSchemeSet/FnaControlSchemeSetMulti.jsp
			result = browserManager.getResult(request, "id, name", "fnaControlScheme", "", pagenum);
		} else if ("FnaCostCenter".equals(type) || type.equals("251")) {// 预算成本中心
			if (!"".equals(whereClause)) {
				whereClause += " and ";
			}
			whereClause += " " + FnaCostCenter.getDbUserName() + "getFccArchive1(id) = 0 and type = 1 ";

			String bdf_wfid = Util.null2String(request.getParameter("bdf_wfid"));
			String bdf_fieldid = Util.null2String(request.getParameter("bdf_fieldid"));

			FnaCommon fcommon = new FnaCommon();
			List fccArray = fcommon.getWfBrowdefList(bdf_wfid, bdf_fieldid, "251");
			Set fccArray0 = new HashSet();
			Set fccArray1 = new HashSet();
			try {
				if (fccArray != null && fccArray.size() > 0) {
					FnaCostCenter fcc = new FnaCostCenter();
					fcc.getAllSubCostcenterType(fccArray, fccArray0, fccArray1);
				}
			} catch (Exception e) {
				new BaseBean().writeLog(e);
			}
			String supClause = "";
			if (fccArray0 != null && fccArray0.size() > 0) {
				String ids = "";
				for (Object obj : fccArray0) {
					ids += "," + (String) obj;
				}
				if (!ids.equals("")) {
					ids = ids.substring(1);
				}
				supClause = " a.supFccId in (" + ids + ") ";

			}
			String subClause = "";
			if (fccArray1 != null && fccArray1.size() > 0) {
				String ids = "";
				for (Object obj : fccArray1) {
					ids += "," + (String) obj;
				}
				if (!ids.equals("")) {
					ids = ids.substring(1);
				}
				subClause = " a.id in (" + ids + ") ";

			}
			String clause = "";
			if (!supClause.equals("") || !subClause.equals("")) {
				if (!"".equals(whereClause)) {
					whereClause += " and ";
				}
				whereClause += " ( " + supClause + " or " + subClause + " ) ";
			}

			result = browserManager.getResult(request, "id, name", "FnaCostCenter a", whereClause, pagenum);
		} else if (type.equals("FnaFccWfBtnSetting")) {// 路径设置-高级设置-浏览数据定义-成本中心

			result = browserManager.getResult(request, "id, name", "FnaCostCenter a", whereClause, pagenum);
		} else if (type.equals("HpinfoMutiBrowser")) {// 多门户
														// url:/portal/HpinfoMutiBrowser.jsp
			result = browserManager.getResult(request, "id, infoname", "hpinfo", "", pagenum);
		} else if (type.equals("CoworkTypesMutiBrowser")) {// 多协作区
															// url:/cowork/type/CoworkTypesMutiBrowser.jsp
			result = browserManager.getResult(request, "id, typename", "cowork_types", "", pagenum);
		} else if (type.equals("currentnodeBrowser")) {
			result = browserManager.getResult(request, "id, nodename", "workflow_nodebase", whereClause, pagenum);
		} else if ("".equals(type) || (!"".equals(type) && (type.equals("1") || type.equals("17"))) || "165".equals(type) || "166".equals(type) || "160".equals(type)) {
			// 已在ResourceBrowserService中重写
		} else if (type.equals("MutiJobTitlesTemplet")) {
			result = browserManager.getResult(request, "c.id,c.jobtitlename, b.jobactivityname ", " HrmJobGroups a, HrmJobActivities b, HrmJobTitlesTemplet c ", pagenum);
		} else if (type.equals("sysadmin")) {
			result = browserManager.getResult(request, "id,lastname", "hrmresourcemanager", pagenum);
		} else if (type.equals("multisysadmin")) {
			String sqlwhere = "";
			if (!mdc.isUseWfManageDetach()) // 如果系统未启用管理分权，则管理员浏览框中不出现分权管理员，只有系统管理员
				sqlwhere = " id = 1";
			result = browserManager.getResult(request, "id,lastname", "hrmresourcemanager", sqlwhere, pagenum, "");
		} else if ("matrix".equals(type)) {
			result = browserManager.getResult(request, "id,name", "MatrixInfo", pagenum);
		} else if ("matrixfield".equals(type)) {
			String matrixid = Util.null2String(request.getParameter("matrixid"));
			String fieldtype = Util.null2String(request.getParameter("fieldtype"));
			if ("".equals(whereClause)) {
				whereClause = "m.matrixid='" + matrixid + "'";
			} else {
				whereClause += " AND m.matrixid='" + matrixid + "'";
			}
			whereClause += " AND m.fieldtype='" + fieldtype + "'";
			result = browserManager.getResult(request, "m.id,m.displayname", "MatrixFieldInfo m", whereClause, pagenum);
		} else if ("requestbrowserright".equals(type)) {// 通过流程id得到所有请求
			String wfid = Util.null2String(request.getParameter("wfid"));
			whereClause += " wr.workflowid = '" + wfid + "'";
			result = browserManager.getResult(request, "wr.requestid,wr.requestname", "workflow_requestbase wr", whereClause, pagenum);
		} else if ("reportform".equals(type)) {// 通过表单formid得到所有流程
			String formid = Util.null2String(request.getParameter("formid"));
			String isbill = Util.null2String(request.getParameter("isbill"));
			whereClause += " wb.formid = '" + formid + "'";
			whereClause += " and wb.isvalid = '1' ";
			whereClause += " and wb.isbill = '" + isbill + "'";
			int detachable = Util.getIntValue(String.valueOf(session.getAttribute("detachable")), 0);
			if (detachable == 1) {
				String hasRightSubcompanyids = scc.getRightSubCompany(user.getUID(), "WorkflowManage:All", -1);
				if (!"".equals(hasRightSubcompanyids)) {
					whereClause += " and wb.subcompanyid in (" + hasRightSubcompanyids + ") ";
				}
			}
			result = browserManager.getResult(request, " wb.id,wb.workflowname ", " workflow_base wb ", whereClause, pagenum);
		} else if ("hrmOrgGroup".equals(type)) {// 群组
			whereClause += " (isDelete is null or isDelete='0')";
			result = browserManager.getResult(request, "id,orgGroupName", "HrmOrgGroup", whereClause, pagenum);
		} else if ("adaccount".equals(type)) {
			String nameKey = Util.null2String(request.getParameter("q"));
			LdapUtil ldap = LdapUtil.getInstance();
			result = ldap.getAccoutsJson(nameKey);
		} else if ("HrmRoleRight".equals(type)) {// 权限名称
			whereClause += " a.id = b.id AND languageid = " + user.getLanguage();
			browserManager.setOrderKey("b.rightdesc");
			result = browserManager.getResult(request, "a.id,b.rightname", "SystemRights a, SystemRightsLanguage b", whereClause, pagenum);
		} else if ("268".equals(type)) {// 星期多选
			result = new MeetingBrowser().getResultWeek(request, user);
		} else if ("269".equals(type)) {// 提醒多选
			result = new MeetingBrowser().getResultRemind(request, user);
		} else if ("270".equals(type)) {// 服务项目多选
			result = browserManager.getResult(request, "id,itemname", "meeting_service_item", whereClause, pagenum);
		} else if (type.equals("Hrm_WorkflowBill")) {// 流程表单
			String wfid = Util.null2String(request.getParameter("wfid"));
			String onlystateform = Util.null2String(request.getParameter("onlystateform"), "false");
			String fWhere = "";
			if (onlystateform.equals("true")) {
				fWhere = " t.id in (select field002 from hrm_state_proc_set group by field002)";
			}
			if (wfid.length() != 0) {
				fWhere += (fWhere.length() > 0 ? " and " : "") + " exists (select 1 from workflow_base t3 where t3.formid = t.id and t3.id = " + wfid + ")";
			}
			result = browserManager.getResult(request, "t.id, t2.labelname", "workflow_bill t left join HtmlLabelInfo t2 on t.namelabel = t2.indexid and languageid = " + user.getLanguage(), fWhere,
					pagenum);
		} else if (type.equals("Hrm_HrmLeaveTypeColor")) {
			String fields = "field00" + (user.getLanguage() <= 9 && user.getLanguage() >= 7 ? user.getLanguage() : 1);
			String conSql = rs.getDBType().equals("oracle") ? ("t." + fields + " is null") : ("t." + fields + " is null or t." + fields + " = ''");
			result = browserManager.getResult(request, "t.id, t.field001", "(select t.field004 as id, (case when (" + conSql + ") then t.field001 else t." + fields
					+ " end) field001 from hrmLeaveTypeColor t where t.field002 = 1) t", pagenum);
		} else if (type.equals("Hrm_HrmContract") || type.equals("279")) {
			result = browserManager.getResult(request, "t.id, t.contractname", "HrmContract t", pagenum);
		} else if ("pubChoice".equals(type)) {// 公共选择框
			result = new weaver.workflow.selectItem.SelectItemPubBrowser().getResult(request, user);
		} else if (type.equals("Hrm_HrmScheduleShiftsSet")) {
			result = browserManager.getResult(request, "t2.id, t.field001", "hrm_schedule_shifts_set t left join hrm_schedule_shifts_set_id t2 on t.id = t2.field001", "t.delflag = 0", pagenum);
		} else if (type.equals("HrmAwardType")) {// 奖惩种类
			result = browserManager.getResult(request, "id,name", "HrmAwardType", pagenum);
		}
		return result;
	}

}
