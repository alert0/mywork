package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.api.browser.service.BrowserService;

import weaver.conn.RecordSet;
import weaver.crm.Maint.CustomerInfoComInfo;
import weaver.fna.general.FnaCommon;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.hrm.resource.ResourceComInfo;
import weaver.workflow.request.MailAndMessage;
import weaver.workflow.workflow.WorkflowComInfo;
import weaver.workflow.workflow.WorkflowVersion;

/**
 * 归档流程  -- status == 2
 * 多流程  
 * @author jhy Mar 29, 2017
 *
 */
public class MultiRequestBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		String f_weaver_belongto_userid = Util.null2String(params.get("f_weaver_belongto_userid"));
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");

		String userID = String.valueOf(user.getUID());
		if (f_weaver_belongto_userid != null && !f_weaver_belongto_userid.equals(userID) && !"".equals(f_weaver_belongto_userid)) {
			userID = f_weaver_belongto_userid;
		}
		RecordSet rs = new RecordSet();
		RecordSet rs1 = new RecordSet();
		if (user == null) {
			return apidatas;
		}
		String resourceids = Util.null2String(params.get("systemIds"));
		if (resourceids.startsWith(",")) {
			resourceids = resourceids.substring(1);
		}
		String src = Util.null2String(params.get("src"));

		/* begin：处理费用流程请求浏览按钮过滤逻辑代码 */
		String _fnaSqlwhere = "";
		int __requestid = Util.getIntValue(Util.null2String(params.get("__requestid")));
		int _fna_wfid = Util.getIntValue(Util.null2String(params.get("fna_wfid")));
		int _fna_fieldid = Util.getIntValue(Util.null2String(params.get("fna_fieldid")));
		boolean _isEnableFnaWf = false;// 是否是启用的Ecology8费控流程
		HashMap<String, String> _isEnableFnaWfHm = FnaCommon.getIsEnableFnaWfHm(_fna_wfid);
		_isEnableFnaWf = "true".equals(_isEnableFnaWfHm.get("isEnableFnaWfE8"));
		if (!_isEnableFnaWf) {
			HashMap<String, String> _isEnableFnaRepaymentWfHm = FnaCommon.getIsEnableFnaRepaymentWfHm(_fna_wfid);
			_isEnableFnaWf = "true".equals(_isEnableFnaRepaymentWfHm.get("isEnableFnaRepaymentWf"));
		}
		boolean isFnaWfFysqlcReq = false;// 是否是报销流程的费用申请流程

		if (_isEnableFnaWf) {
			isFnaWfFysqlcReq = FnaCommon.checkFnaWfFieldFnaType(_fna_wfid, _fna_fieldid, 2, 0, "fnaFeeWf");
		}
		if (isFnaWfFysqlcReq) {
			String sqlIsNull = "ISNULL";
			if ("oracle".equals(rs.getDBType())) {
				sqlIsNull = "NVL";
			}
			_fnaSqlwhere += " and exists ( " + " select 1 " + " from FnaExpenseInfo fei " + " where fei.budgetperiodslist is not null " + " and fei.sourceRequestid <> " + __requestid + " "
					+ " and fei.status = 0 " + " and fei.requestid = a.requestid " + " GROUP BY fei.organizationid, fei.organizationtype, fei.subject, fei.budgetperiods, fei.budgetperiodslist  "
					+ " HAVING SUM(" + sqlIsNull + "(fei.amount, 0.00)) > 0.00 " + " ) and a.currentnodetype = 3 ";
		}
		/* end：处理费用流程请求浏览按钮过滤逻辑代码 */

		List<Map<String, Object>> datas = new ArrayList<Map<String, Object>>();
		Map<String, Object> reqInfo = null;
		int formid = -1;
		int isbill = -1;
		if (resourceids.trim().startsWith(",")) {
			resourceids = resourceids.substring(1);
		}
		String excludeId = Util.null2String(params.get("excludeId"));
		if (excludeId.startsWith(",")) {
			excludeId = excludeId.substring(1);
		}
		CustomerInfoComInfo crmComInfo = new CustomerInfoComInfo();
		ResourceComInfo rcomInfo = new ResourceComInfo();
		if ("dest".equalsIgnoreCase(src)) {
			if (!"".equals(resourceids)) {
				String sql = "select requestid,creatertype,requestname, requestnamenew,creater,createdate,createtime from workflow_requestbase where requestid in (" + resourceids + ")";
				rs.executeSql(sql);
				while (rs.next()) {
					String request_id = Util.null2String(rs.getString("requestid"));
					String creater_name = Util.null2String(rs.getString("creater"));
					String create_date = Util.null2String(rs.getString("createdate"));
					String create_time = Util.null2String(rs.getString("createtime"));
					String request_name = Util.null2String(rs.getString("requestname"));
					String request_name_new = Util.null2String(rs.getString("requestnamenew"));

					String workflowid = "";
					rs1.execute("select workflowid from workflow_requestbase where requestid = " + request_id);
					if (rs1.next()) {
						workflowid = Util.null2String(rs1.getString("workflowid"));
					}
					// //根据后台设置在MAIL标题后加上流程中重要的字段

					rs1.execute("select formid,isbill from workflow_base where id=" + workflowid);
					if (rs1.next()) {
						formid = rs1.getInt(1);
						isbill = rs1.getInt(2);

					}

					String titles = "";
					if (!"".equals(request_name_new) && !request_name.equals(request_name_new)) {
						if (request_name_new.indexOf(request_name_new) != -1) {
							titles = request_name_new.substring(request_name.length() - 1, request_name_new.length());
						}
					}

					// String
					// titles=MailAndMessage.getTitle(Util.getIntValue(request_id,-1),Util.getIntValue(workflowid,-1),formid,user.getLanguage(),isbill);
					if (!titles.equals(""))
						request_name = request_name + "<B>(" + titles + ")</B>";
					String createtype = Util.null2String(rs.getString("createtype"));
					if ("1".equals(createtype)) {
						creater_name = crmComInfo.getCustomerInfoname(creater_name);
					} else {
						creater_name = rcomInfo.getResourcename(creater_name);
					}
					reqInfo = new HashMap<String, Object>();
					reqInfo.put("requestid", request_id);
					reqInfo.put("requestname", request_name);
					reqInfo.put("creater", creater_name);
					reqInfo.put("createtime", create_date + " " + create_time);
					datas.add(reqInfo);
				}
			}
			apidatas.put("currentPage", 1);
			apidatas.put("totalPage", 1);
			apidatas.put("mapList", datas);
			return apidatas;
		}
		String createdatestart = Util.null2String(params.get("createdatestart"));
		String createdateend = Util.null2String(params.get("createdateend"));
		String requestmark = Util.null2String(params.get("requestmark"));
		String prjids = Util.null2String(params.get("prjids"));
		String crmids = Util.null2String(params.get("crmids"));
		String isfrom = Util.null2String(params.get("isfrom"));
		String workflowid = Util.null2String(params.get("workflowid"));
		if (workflowid.equals("") || workflowid.equals("0")) {
			workflowid = Util.null2String(params.get("flowReport_flowId"));
		}

		String currworkflowid = Util.null2String(params.get("currworkflowid"));

		String department = Util.null2String(params.get("department"));
		String subid = Util.null2String(params.get("subid"));
		if (department.startsWith(",")) {
			department = department.substring(1);
		}
		String fieldid = Util.null2String(params.get("fieldid"));
		String gdtype = "";
		int date2during = 0;
		date2during = Util.getIntValue(Util.null2String(params.get("date2during")), 0);
		String sqlgdtype = "select gdtype,jsqjtype from workflow_rquestBrowseFunction WHERE workflowid=" + currworkflowid + " AND fieldid=" + fieldid;
		rs.executeSql(sqlgdtype);
		if (rs.next()) {
			gdtype = rs.getString(1);
			if (date2during == 0)
				date2during = rs.getInt(2);
		}
		String status = Util.null2String(params.get("status"));
		if ("".equals(status)) {
			status = gdtype;
		}
		String requestname = Util.null2String(params.get("requestname"));
		String creater = Util.null2String(params.get("creater"));
		if (creater.startsWith(",")) {
			creater = creater.substring(1);
		}

		String usertype = "0";

		if (user.getLogintype().equals("2"))
			usertype = "1";

		if (creater.trim().startsWith(",")) {
			creater = creater.substring(1);
		}
		StringBuffer sqlwhere = new StringBuffer();
		if (!requestname.equals("")) {
			sqlwhere.append(" and a.requestnamenew like '%" + Util.fromScreen2(requestname, user.getLanguage()) + "%' ");
		}
		if (!creater.equals("")) {
			sqlwhere.append(" and a.creater in (" + creater + ") and a.creatertype=0 ");
		}

		if (!createdatestart.equals("")) {
			sqlwhere.append(" and a.createdate >='" + createdatestart + "' ");
		}

		if (!createdateend.equals("")) {
			sqlwhere.append(" and a.createdate <='" + createdateend + "' ");
		}

		if (status.equals("1")) {
			sqlwhere.append(" and a.currentnodetype < 3 ");
		}

		if (status.equals("2")) {
			sqlwhere.append(" and a.currentnodetype = 3 ");
		}

		if (!workflowid.equals("") && !workflowid.equals("0")) {
			if (!workflowid.equals("-999")) {
				sqlwhere.append(" and a.workflowid in ( " + WorkflowVersion.getAllVersionStringByWFIDs(workflowid) + ")");
			} else {
				sqlwhere.append(" and a.workflowid in (" + workflowid + ")");
			}
		}

		if (!department.equals("") && !department.equals("0")) {
			sqlwhere.append(" and a.creater in (select id from hrmresource where departmentid in (" + department + "))");
		}

		if (!"".equals(subid) && !"0".equals(subid) && !"flowrpt".equals(isfrom)) {
			sqlwhere.append(" and a.creater in (select id from hrmresource where subcompanyid1 in (" + subid + "))");
		}

		if (!"".equals(prjids) && !"0".equals(prjids)) {
			String[] prjidAry = prjids.split(",");
			if (prjidAry.length > 0) {
				sqlwhere.append(" AND (");
				if ("oracle".equals(rs.getDBType())) {
					for (int i = 0; i < prjidAry.length; i++) {
						if (i > 0) {
							sqlwhere.append(" OR ");
						}
						sqlwhere.append("(concat(concat(',' , To_char(a.prjids)) , ',') LIKE '%," + prjidAry[i] + ",%')");
					}
				} else {
					for (int i = 0; i < prjidAry.length; i++) {
						if (i > 0) {
							sqlwhere.append(" OR ");
						}
						sqlwhere.append("(',' + CONVERT(varchar,a.prjids) + ',' LIKE '%," + prjidAry[i] + ",%')");
					}
				}
				sqlwhere.append(") ");
			}
		}

		if (!"".equals(crmids) && !"0".equals(crmids)) {
			String[] crmidAry = crmids.split(",");
			if (crmidAry.length > 0) {
				sqlwhere.append(" AND (");
				if ("oracle".equals(rs.getDBType())) {
					for (int i = 0; i < crmidAry.length; i++) {
						if (i > 0) {
							sqlwhere.append(" OR ");
						}
						sqlwhere.append("(concat(concat(',' , To_char(a.crmids)) , ',') LIKE '%," + crmidAry[i] + ",%')");
					}
				} else {
					for (int i = 0; i < crmidAry.length; i++) {
						if (i > 0) {
							sqlwhere.append(" OR ");
						}
						sqlwhere.append("(',' + CONVERT(varchar,a.crmids) + ',' LIKE '%," + crmidAry[i] + ",%')");
					}
				}
				sqlwhere.append(") ");
			}
		}

		if (!requestmark.equals("")) {
			sqlwhere.append(" and a.requestmark like '%" + requestmark + "%' ");
		}

		if (sqlwhere.equals(""))
			sqlwhere.append(" and a.requestid <> 0 ");

		if (rs.getDBType().equals("oracle")) {
			if (!"flowrpt".equals(isfrom)) {
				sqlwhere.append(" and (nvl(a.currentstatus,-1) = -1 or (nvl(a.currentstatus,-1)=0 and a.creater=" + user.getUID() + ")) ");
			}
		} else {
			if (!"flowrpt".equals(isfrom)) {
				sqlwhere.append(" and (isnull(a.currentstatus,-1) = -1 or (isnull(a.currentstatus,-1)=0 and a.creater=" + user.getUID() + ")) ");
			}
		}
		WorkflowComInfo wci = new WorkflowComInfo();
		sqlwhere.append(wci.getDateDuringSql(date2during));

		sqlwhere.append(" and b.requestid = a.requestid ");
		if (!"flowrpt".equals(isfrom)) {
			sqlwhere.append(" and b.userid in (" + userID + ")");
		}
		sqlwhere.append(" and b.usertype=" + usertype + " and a.workflowid = c.id" + " and c.isvalid in (1,3) and (c.istemplate is null or c.istemplate<>'1')");

		sqlwhere.append(" and islasttimes=1 ");

		sqlwhere.append(_fnaSqlwhere);

		String sqlend = " order by createdate desc, createtime desc";
		String sqlstr = "";
		int perpage = Util.getIntValue(Util.null2String(params.get("pageSize")), 10);
		int pagenum = Util.getIntValue(Util.null2String(params.get("currentPage")), 1);

		if (rs.getDBType().equals("oracle")) {
			sqlstr = "select * from (select row_number() over(order by createdate desc, createtime desc) rn,a.requestid,a.requestname,a.creater,a.createdate,a.createtime,a.creatertype from workflow_requestbase a, workflow_currentoperator b, workflow_base c "
					+ " where 1=1 " + sqlwhere.toString().replaceAll("receivedate", "createdate") + " ) where rn > " + (pagenum - 1) * perpage + " and rn <=" + pagenum * perpage + sqlend;
		} else {
			sqlstr = "select top " + perpage + " a.requestid,a.requestname,a.creater,a.createdate,a.createtime,a.creatertype from workflow_requestbase a, workflow_currentoperator b, workflow_base c "
					+ " where a.requestid not in (select top " + (pagenum - 1) * perpage + " a.requestid from workflow_requestbase a where 1=1 "
					+ sqlwhere.toString().replaceAll("receivedate", "createdate") + sqlend + ")" + sqlwhere.toString().replaceAll("receivedate", "createdate") + sqlend;
		}

		rs.executeSql(sqlstr);
		MailAndMessage mam = new MailAndMessage();
		while (rs.next()) {
			String request_id = Util.null2String(rs.getString("requestid"));
			String creater_name = Util.null2String(rs.getString("creater"));
			String create_date = Util.null2String(rs.getString("createdate"));
			String create_time = Util.null2String(rs.getString("createtime"));
			String request_name = Util.null2String(rs.getString("requestname"));
			String createtype = Util.null2String(rs.getString("creatertype"));
			rs1.execute("select workflowid from workflow_requestbase where requestid = " + request_id);
			if (rs1.next()) {
				workflowid = Util.null2String(rs.getString("workflowid"));
			}
			// //根据后台设置在MAIL标题后加上流程中重要的字段

			rs1.execute("select formid,isbill from workflow_base where id=" + workflowid);
			if (rs1.next()) {
				formid = rs1.getInt(1);
				isbill = rs1.getInt(2);

			}
			String titles = mam.getTitle(Util.getIntValue(request_id, -1), Util.getIntValue(workflowid, -1), formid, user.getLanguage(), isbill);
			if (!titles.equals(""))
				request_name = request_name + "<B>(" + titles + ")</B>";
			if ("1".equals(createtype)) {
				creater_name = crmComInfo.getCustomerInfoname(creater_name);
			} else {
				creater_name = rcomInfo.getResourcename(creater_name);
			}
			reqInfo = new HashMap<String, Object>();
			reqInfo.put("requestid", request_id);
			reqInfo.put("requestname", request_name);
			reqInfo.put("creater", creater_name);
			reqInfo.put("createtime", create_date + " " + create_time);
			datas.add(reqInfo);
		}
		apidatas.put("currentPage", pagenum);
		apidatas.put("datas", datas);
		return apidatas;
	}
}
