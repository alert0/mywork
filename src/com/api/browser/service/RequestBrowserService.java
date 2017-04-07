package com.api.browser.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.conn.RecordSet;
import weaver.fna.general.FnaCommon;
import weaver.general.BaseBean;
import weaver.general.PageIdConst;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import weaver.workflow.request.Browsedatadefinition;
import weaver.workflow.workflow.WorkflowComInfo;
import weaver.workflow.workflow.WorkflowVersion;

/**
 * 流程
 * 
 * @author jhy Mar 29, 2017
 * 
 */
public class RequestBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");// 设置日期格式
		String currentdate = df.format(new Date());

		String sqlwhere = " where 1=1 ";

		int _bdf_wfid = Util.getIntValue(Util.null2String(params.get("bdf_wfid")));
		int _bdf_fieldid = Util.getIntValue(Util.null2String(params.get("bdf_fieldid")));
		String f_weaver_belongto_userid = Util.fromScreen(Util.null2String(params.get("f_weaver_belongto_userid")), user.getLanguage());
		String f_weaver_belongto_usertype = Util.null2String(params.get("f_weaver_belongto_usertype"));// 需要增加的代码
		String userID = String.valueOf(user.getUID());
		int userid = user.getUID();
		if (!f_weaver_belongto_userid.equals(userID) && !"".equals(f_weaver_belongto_userid)) {
			userID = f_weaver_belongto_userid;
			userid = Util.getIntValue(f_weaver_belongto_userid, 0);
		}
		RecordSet rs = new RecordSet();
		String belongtoshow = "";
		rs.executeSql("select * from HrmUserSetting where resourceId = " + userID);
		if (rs.next()) {
			belongtoshow = rs.getString("belongtoshow");
		}
		String userIDAll = String.valueOf(user.getUID());
		String Belongtoids = user.getBelongtoids();
		int Belongtoid = 0;
		String[] arr2 = null;
		ArrayList<String> userlist = new ArrayList<String>();
		userlist.add(userid + "");
		if (!"".equals(Belongtoids)) {
			userIDAll = userID + "," + Belongtoids;
			arr2 = Belongtoids.split(",");
			for (int i = 0; i < arr2.length; i++) {
				Belongtoid = Util.getIntValue(arr2[i]);
				userlist.add(Belongtoid + "");
			}
		}
		String usertype = "0";
		if ("2".equals(user.getLogintype()))
			usertype = "1";
		String fieldid = Util.null2String(params.get("fieldid"));
		String currworkflowid = Util.null2String(params.get("currworkflowid"));
		if ("".equals(currworkflowid)) {
			currworkflowid = Util.null2String(params.get("workflowid"));
		}
		if (!"".equals(fieldid)) {
			String newwfs[] = fieldid.split("_");
			fieldid = newwfs[0];
		}

		String issearch = Util.null2String(params.get("issearch"));
		String requestname = Util.null2String(params.get("requestname"));
		String creater = Util.null2String(params.get("creater"));
		String createdatestart = Util.null2String(params.get("createdatestart"));
		String createdateend = Util.null2String(params.get("createdateend"));
		String isrequest = Util.null2String(params.get("isrequest"));
		String requestmark = Util.null2String(params.get("requestmark"));
		String prjids = Util.null2String(params.get("prjids"));
		String crmids = Util.null2String(params.get("crmids"));
		String workflowid = Util.null2String(params.get("workflowid"));
		String department = Util.null2String(params.get("department"));
		String status = Util.null2String(params.get("status"));
		String subid = Util.null2String(params.get("subid"));
		/* begin：处理还款流程请求浏览按钮过滤逻辑代码 */
		int __requestid = Util.getIntValue(Util.null2String(params.get("__requestid")));
		int _fna_wfid = Util.getIntValue(Util.null2String(params.get("fna_wfid")));
		int _fna_fieldid = Util.getIntValue(Util.null2String(params.get("fna_fieldid")));
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
		boolean _isEnableFnaWf = false;// 是否是启用的Ecology8费控流程
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
		boolean isFnaWfFysqlcReq = false;// 是否是报销流程的费用申请流程
		boolean isFnaWfRepaymentBorrowReq = false;// 是否是还款流程的冲销明细的借款流程浏览按钮
		boolean isFnaWfAdvanceRepaymentAdvanceReq = false;// 是否是还款流程的冲销预付款明细的预付款流程浏览按钮
		if (_isEnableFnaWf) {
			isFnaWfFysqlcReq = FnaCommon.checkFnaWfFieldFnaType(_fna_wfid, _fna_fieldid, 2, 0, "fnaFeeWf");
			isFnaWfRepaymentBorrowReq = (FnaCommon.checkFnaWfFieldFnaType(_fna_wfid, _fna_fieldid, 1, 2, "repayment") || FnaCommon.checkFnaWfFieldFnaType(_fna_wfid, _fna_fieldid, 1, 2, "fnaFeeWf"));
			isFnaWfAdvanceRepaymentAdvanceReq = FnaCommon.checkFnaWfFieldFnaType(_fna_wfid, _fna_fieldid, 1, 4, "fnaFeeWf");
		}
		int borrowType = Util.getIntValue(Util.null2String(params.get("borrowType")), -1);
		if (isFnaWfFysqlcReq) {
			String sqlIsNull = "ISNULL";
			String sqlSubString = "SUBSTRING";
			if ("oracle".equals(rs.getDBType())) {
				sqlIsNull = "NVL";
				sqlSubString = "SUBSTR";
			}
			sqlwhere += " and exists ( " + " select 1 " + " from FnaExpenseInfo fei " + " where fei.budgetperiodslist is not null " + " and fei.sourceRequestid <> " + __requestid + " "
					+ " and fei.status = 0 " + " and fei.requestid = workflow_requestbase.requestid "
					+ " GROUP BY fei.organizationid, fei.organizationtype, fei.subject, fei.budgetperiods, fei.budgetperiodslist  " + " HAVING SUM(" + sqlIsNull + "(fei.amount, 0.00)) > 0.00 "
					+ " ) and workflow_requestbase.currentnodetype = 3 ";
		} else if (isFnaWfRepaymentBorrowReq) {
			// 需要控制只能选择自己的个人借款流程和自己发起的公务借款流程进行冲账，不能冲销其他个人借款的流程，公务借款流程可以给有权限的人员、或者自己提交的公务借款进行选择冲销。
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
			sqlwhere += " and exists ( \n" + " select 1 from ( \n" + "	select fbi.borrowRequestId, fbi.borrowRequestIdDtlId, \n" + "		SUM(fbi.amountBorrow * fbi.borrowDirection) sum_amountBorrow, \n"
					+ "		MAX(CASE WHEN fbi.recordType = 'borrow' THEN fbi.applicantid ELSE 0 END) applicantid, \n"
					+ "		MAX(CASE WHEN fbi.recordType = 'borrow' THEN fbi.departmentid ELSE 0 END) departmentid, \n"
					+ "		MAX(CASE WHEN fbi.recordType = 'borrow' THEN fbi.subcompanyid1 ELSE 0 END) subcompanyid1, \n"
					+ "		MAX(CASE WHEN fbi.borrowType = 0 THEN fbi.borrowType ELSE -99999 END) borrowType0, \n"
					+ "		MAX(CASE WHEN fbi.borrowType = 1 THEN fbi.borrowType ELSE -99999 END) borrowType1 \n" + "	from FnaBorrowInfo fbi \n" + "	where fbi.requestid <> " + __requestid + " \n"
					+ "	GROUP BY fbi.borrowRequestId, fbi.borrowRequestIdDtlId \n" + " ) fbi1 \n" + " where fbi1.sum_amountBorrow > 0 \n"
					+ " and fbi1.borrowRequestId = workflow_requestbase.requestId \n" + " and (" + _condBorrowType + ") \n" + " ) \n";
		} else if (isFnaWfAdvanceRepaymentAdvanceReq) {
			// 需要控制只能选择自己的个人借款流程和自己发起的公务借款流程进行冲账，不能冲销其他个人借款的流程，公务借款流程可以给有权限的人员、或者自己提交的公务借款进行选择冲销。
			sqlwhere += " and exists ( \n" + " select 1 from ( \n" + "	select fbi.advanceRequestId, fbi.advanceRequestIdDtlId, \n"
					+ "		SUM(fbi.amountAdvance * fbi.advanceDirection) sum_amountAdvance \n" + "	from FnaAdvanceInfo fbi \n" + "	where fbi.requestid <> " + __requestid + " \n"
					+ "	GROUP BY fbi.advanceRequestId, fbi.advanceRequestIdDtlId \n" + " ) fbi1 \n" + " where fbi1.sum_amountAdvance > 0 \n"
					+ " and fbi1.advanceRequestId = workflow_requestbase.requestId \n" + " ) \n";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		/* end：处理还款流程请求浏览按钮过滤逻辑代码 */
		int olddate2during = 0;
		BaseBean baseBean = new BaseBean();
		String date2durings = "";
		try {
			date2durings = Util.null2String(baseBean.getPropValue("wfdateduring", "wfdateduring"));
		} catch (Exception e) {
		}
		String[] date2duringTokens = Util.TokenizerString2(date2durings, ",");
		if (date2duringTokens.length > 0) {
			olddate2during = Util.getIntValue(date2duringTokens[0], 0);
		}
		if (olddate2during < 0 || olddate2during > 36) {
			olddate2during = 0;
		}
		int date2during = Util.getIntValue(Util.null2String(params.get("date2during")), olddate2during);

		List<Map<String, String>> list = null;
		Browsedatadefinition bdd = new Browsedatadefinition();
		if (!"".equals(fieldid) && !"".equals(currworkflowid)) {
			if (bdd.read(currworkflowid, fieldid)) {
				list = bdd.getList();
			} else {
				list = new ArrayList<Map<String, String>>();
			}
		} else {
			list = new ArrayList<Map<String, String>>();
		}

		if ("".equals(isrequest)) {
			isrequest = "1";
		}

		if (list.size() > 0) {
			if ("".equals(issearch)) {
				String requestname01 = bdd.getRequestname();
				String workflowtype = bdd.getWorkflowtype();
				String Processnumber = bdd.getProcessnumber();
				String createtype = bdd.getCreatetype();
				String createtypeid = bdd.getCreatetypeid();
				String createdepttype = bdd.getCreatedepttype();
				String department01 = bdd.getDepartment();
				String createsubtype = bdd.getCreatesubtype();
				String createsubid = bdd.getCreatesubid();
				String createdatetype = bdd.getCreatedatetype();
				String createdatestart01 = bdd.getCreatedatestart();
				String createdateend01 = bdd.getCreatedateend();
				String xgxmtype = bdd.getXgxmtype();
				String xgxmid = bdd.getXgxmid();
				String xgkhtype = bdd.getXgkhtype();
				String xgkhid = bdd.getXgkhid();
				String gdtype = bdd.getGdtype();
				String jsqjtype = bdd.getJsqjtype();

				if ("".equals(requestname)) {
					requestname = requestname01;
				}

				if ("".equals(workflowid)) {
					workflowid = workflowtype;
				}

				if ("".equals(requestmark)) {
					requestmark = Processnumber;
				}

				if ("".equals(creater)) {
					if ("1".equals(createtype)) {
						creater = "" + user.getUID();
					} else if ("2".equals(createtype)) {
						creater = createtypeid;
					} else if ("3".equals(createtype)) {
						creater = Util.null2String(params.get("cre"));
					}
				}

				if ("".equals(department)) {
					if ("1".equals(createdepttype)) {
						department = "" + user.getUserDepartment();
					} else if ("2".equals(createdepttype)) {
						department = department01;
					} else if ("3".equals(createdepttype)) {
						department = bdd.getDepartment(Util.null2String(params.get("dep")));
					}
				}

				if ("".equals(subid)) {
					if ("1".equals(createsubtype)) {
						subid = "" + user.getUserSubCompany1();
					} else if ("2".equals(createsubtype)) {
						subid = "" + createsubid;
					} else if ("3".equals(createsubtype)) {
						subid = bdd.getSubcompany(Util.null2String(params.get("sub")));
					}
				}

				if ("".equals(createdatestart) && "".equals(createdateend)) {
					if ("2".equals(createdatetype)) {// 今天
						createdatestart = "" + currentdate;
						createdateend = "" + currentdate;
					} else if ("3".equals(createdatetype)) {// 本周
						createdatestart = df.format(bdd.getMonday());
						createdateend = df.format(bdd.getSunday());
					} else if ("4".equals(createdatetype)) {// 本月
						createdatestart = df.format(bdd.getFirstDayOfMonth());
						createdateend = df.format(bdd.getLastDayOfMonth());
					} else if ("5".equals(createdatetype)) {// 本季
						createdatestart = df.format(bdd.getFirstDayOfQuarter());
						createdateend = df.format(bdd.getLastDayOfQuarter());
					} else if ("6".equals(createdatetype)) {// 本年
						createdatestart = bdd.getYearDateStart();
						createdateend = bdd.getYearDateEnd();
					} else if ("7".equals(createdatetype)) {// 指定日期
						createdatestart = createdatestart01;
						createdateend = createdateend01;
					} else if ("8".equals(createdatetype)) {
						createdatestart = Util.null2String(params.get("date"));
						createdateend = Util.null2String(params.get("date"));
					}
				} else {
					if ("".equals(createdatestart)) {
						createdatestart = createdatestart01;
					}
					if ("".equals(createdateend)) {
						createdateend = createdateend01;
					}
				}

				if ("".equals(prjids)) {
					if ("2".equals(xgxmtype)) {
						prjids = xgxmid;
					} else if ("3".equals(xgxmtype)) {
						prjids = Util.null2String(params.get("xgxm"));
					}
				}

				if ("".equals(crmids)) {
					if ("2".equals(xgkhtype)) {
						crmids = xgkhid;
					} else if ("3".equals(xgkhtype)) {
						crmids = Util.null2String(params.get("xgkh"));
					}
				}

				if ("".equals(status)) {
					status = gdtype;
				}

				date2during = Util.getIntValue(jsqjtype, 0);
			}
		}

		if (!"".equals(requestname)) {
			sqlwhere += " and requestnamenew like '%" + Util.fromScreen2(requestname, user.getLanguage()) + "%'";
		}
		if (!"".equals(workflowid) && !"0".equals(workflowid)) {
			sqlwhere += " and workflow_requestbase.workflowid in (" + WorkflowVersion.getAllVersionStringByWFIDs(workflowid) + ")";
		}
		if (!"".equals(requestmark)) {
			sqlwhere += " and requestmark like '%" + requestmark + "%'";
		}
		if (!"".equals(creater)) {
			sqlwhere += " and creater in(" + creater + ") and creatertype=0 ";
		}
		if (!"".equals(department) && !"0".equals(department)) {
			sqlwhere += " and workflow_requestbase.creater in (select id from hrmresource where departmentid in (" + department + "))";
		}
		if (!"".equals(subid) && !"0".equals(subid)) {
			sqlwhere += " and workflow_requestbase.creater in (select id from hrmresource where subcompanyid1 in (" + subid + "))";
		}
		if (!"".equals(createdatestart)) {
			sqlwhere += " and createdate >='" + createdatestart + "'";
		}
		if (!"".equals(createdateend)) {
			sqlwhere += " and createdate <='" + createdateend + "'";
		}
		if (!"".equals(prjids) && !"0".equals(prjids)) {
			String[] prjidAry = prjids.split(",");
			if (prjidAry.length > 0) {
				sqlwhere += " AND (";
				if ("oracle".equals(rs.getDBType())) {
					for (int i = 0; i < prjidAry.length; i++) {
						if (i > 0) {
							sqlwhere += " OR ";
						}
						sqlwhere += "(concat(concat(',' , To_char(workflow_requestbase.prjids)) , ',') LIKE '%," + prjidAry[i] + ",%')";
					}
				} else {
					for (int i = 0; i < prjidAry.length; i++) {
						if (i > 0) {
							sqlwhere += " OR ";
						}
						sqlwhere += "(',' + CONVERT(varchar,workflow_requestbase.prjids) + ',' LIKE '%," + prjidAry[i] + ",%')";
					}
				}
				sqlwhere += ") ";
			}
		}
		if (!"".equals(crmids) && !"0".equals(crmids)) {
			String[] crmidAry = crmids.split(",");
			if (crmidAry.length > 0) {
				sqlwhere += " AND (";
				if ("oracle".equals(rs.getDBType())) {
					for (int i = 0; i < crmidAry.length; i++) {
						if (i > 0) {
							sqlwhere += " OR ";
						}
						sqlwhere += "(concat(concat(',' , To_char(workflow_requestbase.crmids)) , ',') LIKE '%," + crmidAry[i] + ",%')";
					}
				} else {
					for (int i = 0; i < crmidAry.length; i++) {
						if (i > 0) {
							sqlwhere += " OR ";
						}
						sqlwhere += "(',' + CONVERT(varchar,workflow_requestbase.crmids) + ',' LIKE '%," + crmidAry[i] + ",%')";
					}
				}
				sqlwhere += ") ";
			}
		}
		if ("1".equals(status)) {
			sqlwhere += " and currentnodetype < 3 ";
		} else if ("2".equals(status)) {
			sqlwhere += " and currentnodetype = 3 ";
		}
		WorkflowComInfo wci = new WorkflowComInfo();
		sqlwhere += wci.getDateDuringSql(date2during);

		if (" where 1=1 ".equals(sqlwhere)) {
			sqlwhere += " and workflow_requestbase.requestid <> 0";
		}
		if ("oracle".equals(rs.getDBType())) {
			sqlwhere += " and (nvl(workflow_requestbase.currentstatus,-1) = -1 or (nvl(workflow_requestbase.currentstatus,-1)=0 and workflow_requestbase.creater=" + user.getUID() + "))";
		} else {
			sqlwhere += " and (isnull(workflow_requestbase.currentstatus,-1) = -1 or (isnull(workflow_requestbase.currentstatus,-1)=0 and workflow_requestbase.creater=" + user.getUID() + "))";
		}

		String backfields = " * ";
		String formsql = "";
		if ("1".equals(belongtoshow)) {
			if (rs.getDBType().equals("oracle") || rs.getDBType().equals("db2")) {
				formsql = " from ("
						+ " select distinct workflow_requestbase.requestid ,requestname,creater,creatertype,createdate,createtime,createdate||' '||createtime as createtimes from workflow_requestbase , workflow_currentoperator , workflow_base"
						+ sqlwhere + " and workflow_currentoperator.requestid = workflow_requestbase.requestid and workflow_currentoperator.userid in (" + userid
						+ ") and workflow_currentoperator.usertype=" + usertype
						+ " and workflow_requestbase.workflowid = workflow_base.id and (workflow_base.isvalid='1' or workflow_base.isvalid='3') " + " ) t ";
			} else {
				formsql = " from ("
						+ " select distinct workflow_requestbase.requestid ,requestname,creater,creatertype,createdate,createtime,createdate+' '+createtime as createtimes from workflow_requestbase , workflow_currentoperator , workflow_base"
						+ sqlwhere + " and workflow_currentoperator.requestid = workflow_requestbase.requestid and workflow_currentoperator.userid in (" + userid
						+ ") and workflow_currentoperator.usertype=" + usertype
						+ " and workflow_requestbase.workflowid = workflow_base.id and (workflow_base.isvalid='1' or workflow_base.isvalid='3') " + " ) t ";
			}
		} else {
			if (rs.getDBType().equals("oracle") || rs.getDBType().equals("db2")) {
				formsql = " from ("
						+ " select distinct workflow_requestbase.requestid ,requestname,creater,creatertype,createdate,createtime,createdate||' '||createtime as createtimes from workflow_requestbase , workflow_currentoperator , workflow_base"
						+ sqlwhere + " and workflow_currentoperator.requestid = workflow_requestbase.requestid and workflow_currentoperator.userid=" + userid
						+ " and workflow_currentoperator.usertype=" + usertype
						+ " and workflow_requestbase.workflowid = workflow_base.id and (workflow_base.isvalid='1' or workflow_base.isvalid='3') " + " ) t ";
			} else {
				formsql = " from ("
						+ " select distinct workflow_requestbase.requestid ,requestname,creater,creatertype,createdate,createtime,createdate+' '+createtime as createtimes from workflow_requestbase , workflow_currentoperator , workflow_base"
						+ sqlwhere + " and workflow_currentoperator.requestid = workflow_requestbase.requestid and workflow_currentoperator.userid=" + userid
						+ " and workflow_currentoperator.usertype=" + usertype
						+ " and workflow_requestbase.workflowid = workflow_base.id and (workflow_base.isvalid='1' or workflow_base.isvalid='3') " + " ) t ";
			}
		}
		String orderby = "createdate desc , createtime desc";
		String colString = "<col width=\"0%\" hide=\"true\" transmethod=\"weaver.general.KnowledgeTransMethod.forHtml\" text=\"\" column=\"requestid\" />"
						+ "<col width=\"60%\" transmethod=\"weaver.workflow.request.RequestBrowser.getWfNewLink\" otherpara=\"column:requestid+" + user.getLanguage() + "\" text=\""+ SystemEnv.getHtmlLabelName(648, user.getLanguage()) + "\" column=\"requestname\"   />"
						+ "<col width=\"15%\" transmethod=\"weaver.workflow.request.RequestBrowser.getWfCreaterName\" otherpara=\"column:creatertype+" + user.getLanguage() + "\" text=\""+ SystemEnv.getHtmlLabelName(882, user.getLanguage()) + "\" column=\"creater\" />" 
						+ "<col width=\"25%\" transmethod=\"weaver.general.KnowledgeTransMethod.forHtml\" text=\""+ SystemEnv.getHtmlLabelName(1339, user.getLanguage()) + "\" column=\"createtimes\" />";

		String tableString = " <table pageId=\"" + PageIdConst.WF_WORKFLOW_REQUESTBROWSER + "\" instanceid=\"workflowbaseTable\" tabletype=\"none\" pagesize=\"" + PageIdConst.getPageSize(PageIdConst.WF_WORKFLOW_REQUESTBROWSER, user.getUID()) + "\" >" + " <checkboxpopedom  id=\"checkbox\" />" + " <sql backfields=\"" + backfields
				+ "\" sqlform=\"" + Util.toHtmlForSplitPage(formsql) + "\" sqlwhere=\"\" sqlorderby=\"" + orderby + "\"  sqlprimarykey=\"requestid\" sqlsortway=\"ASC\" sqlisdistinct=\"true\" />"
				+ " <head>" 
				+ 	colString 
				+ "	</head>" 
				+ " </table>";
		
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
