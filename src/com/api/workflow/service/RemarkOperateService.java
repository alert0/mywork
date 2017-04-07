package com.api.workflow.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import weaver.conn.RecordSet;
import weaver.file.FileUpload;
import weaver.general.BaseBean;
import weaver.general.GCONST;
import weaver.general.StaticObj;
import weaver.general.TimeUtil;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.resource.ResourceComInfo;
import weaver.interfaces.workflow.action.Action;
import weaver.mobile.webservices.workflow.soa.RequestPreProcessing;
import weaver.share.ShareinnerInfo;
import weaver.soa.workflow.request.RequestService;
import weaver.workflow.msg.PoppupRemindInfoUtil;
import weaver.workflow.request.MailAndMessage;
import weaver.workflow.request.RemarkOperaterManager;
import weaver.workflow.request.RequestAddOpinionShareInfo;
import weaver.workflow.request.RequestAddShareInfo;
import weaver.workflow.request.RequestAnnexUpload;
import weaver.workflow.request.RequestManager;
import weaver.workflow.request.RequestOperationLogManager;
import weaver.workflow.request.RequestRemarkRight;
import weaver.workflow.request.RequestSignRelevanceWithMe;
import weaver.workflow.request.WFForwardManager;
import weaver.workflow.request.WFLinkInfo;
import weaver.workflow.request.WFPathUtil;
import weaver.workflow.request.wfAgentCondition;
import weaver.workflow.workflow.WorkflowComInfo;

/**
 * 转发提交
 * @author jhy Mar 30, 2017
 *
 */
public class RemarkOperateService {

	public Map<String, Object> execute(HttpServletRequest request, HttpServletResponse response) throws Exception {
		long start  = System.currentTimeMillis();
		RecordSet recordSet = new RecordSet();
		RecordSet rs = new RecordSet();
		FileUpload fu = new FileUpload(request);
		String operate = Util.null2String(fu.getParameter("operate"));
		String needwfback = Util.null2String(fu.getParameter("needwfback"));
		String requestid = Util.null2String(fu.getParameter("requestid"));
		recordSet.executeSql("select * from workflow_requestbase where requestid =" + requestid);
		int workflowid = -1;
		String currnodetype0 = "";
		int currnodeid0 = 0;
		if (recordSet.next()) {
			workflowid = Util.getIntValue(recordSet.getString("workflowid"));
			currnodetype0 = recordSet.getString("currentnodetype");
			currnodeid0 = recordSet.getInt("currentnodeid");
		}
		System.out.println("-------------70-------time:" + (System.currentTimeMillis() - start));
		start  = System.currentTimeMillis();
		String f_weaver_belongto_userid = fu.getParameter("f_weaver_belongto_userid");// 需要增加的代码
		String f_weaver_belongto_usertype = fu.getParameter("f_weaver_belongto_usertype");// 需要增加的代码
		User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);// 需要增加的代码
		String userid = user.getUID() + "";
		// int workflowid=Util.getIntValue(fu.getParameter("workflowid"));
		// int
		// workflowid=Util.getIntValue((String)session.getAttribute(userid+"_"+requestid+"workflowid"),0);

		String ifchangstatus = Util.null2String(new BaseBean().getPropValue(GCONST.getConfigFile(), "ecology.changestatus"));
		String forwardrightsql = "select * from workflow_base where id = " + workflowid;
		String isforwardrights = "";
		recordSet.executeSql(forwardrightsql);
		if (recordSet.next()) {
			isforwardrights = Util.null2String(recordSet.getString("isforwardrights"));
		}
		System.out.println("-------------87-------time:" + (System.currentTimeMillis() - start));
		start  = System.currentTimeMillis();
		char flag = Util.getSeparator();
		String para = "";
		String usertype = "0";// 被转发人肯定为人力资源，因此类型默认为“0”TD9836
		String remark = Util.null2String(fu.getParameter("remark"));
		int forwardflag = Util.getIntValue(fu.getParameter("forwardflag"));
		if (forwardflag != 2 && forwardflag != 3) {
			forwardflag = 1; // 2 征求意见；3 转办 ；1 转发
		}
		String signdocids = Util.null2String(fu.getParameter("signdocids"));
		String signworkflowids = Util.null2String(fu.getParameter("signworkflowids"));
		String clientip = fu.getRemoteAddr();
		int requestLogId = Util.getIntValue(fu.getParameter("workflowRequestLogId"), 0);
		String remarkLocation = Util.null2String(fu.getParameter("remarkLocation"));
		String logintype = user.getLogintype();
		// if(logintype.equals("2")){
		// usertype="1";
		// }
		String operatortype = "";

		if (logintype.equals("1"))
			operatortype = "0";
		if (logintype.equals("2"))
			operatortype = "1";

		Calendar today = Calendar.getInstance();
		String CurrentDate = "";
		String CurrentTime = "";
		try {
			rs.executeProc("GetDBDateAndTime", "");
			if (rs.next()) {
				CurrentDate = rs.getString("dbdate");
				CurrentTime = rs.getString("dbtime");
			}
		} catch (Exception e) {
			CurrentDate = Util.add0(today.get(Calendar.YEAR), 4) + "-" + Util.add0(today.get(Calendar.MONTH) + 1, 2) + "-" + Util.add0(today.get(Calendar.DAY_OF_MONTH), 2);

			CurrentTime = Util.add0(today.get(Calendar.HOUR_OF_DAY), 2) + ":" + Util.add0(today.get(Calendar.MINUTE), 2) + ":" + Util.add0(today.get(Calendar.SECOND), 2);
		}
		HttpSession session = request.getSession();
		int currentnodeid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "nodeid"), 0);
		// 加强性修改转发。

		if (currentnodeid < 1) {
			rs.execute("select nodeid from workflow_currentoperator where usertype=0 and requestid=" + requestid + " and userid = " + userid + "order by id desc");
			if (rs.next()) {
				currentnodeid = Util.getIntValue(rs.getString("nodeid"), 0);
			}
		}
		System.out.println("-------------137-------time:" + (System.currentTimeMillis() - start));
		start  = System.currentTimeMillis();
		// int
		// workflowid=Util.getIntValue((String)session.getAttribute(userid+"_"+requestid+"workflowid"),0);
		String requestname = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "requestname"));
		String currentnodetype_temp = "";
		WFLinkInfo wfLinkInfo = new WFLinkInfo();
		if (workflowid == 0) {
			int nodeid = wfLinkInfo.getCurrentNodeid(Util.getIntValue(requestid), Util.getIntValue(userid), Util.getIntValue(logintype, 1)); // 节点id
			String nodetype = wfLinkInfo.getNodeType(nodeid);

			recordSet.executeProc("workflow_Requestbase_SByID", requestid + "");
			if (recordSet.next()) {
				requestname = Util.null2String(recordSet.getString("requestname"));
				workflowid = Util.getIntValue(recordSet.getString("workflowid"), 0);
				int currentnodeid_temp = Util.getIntValue(recordSet.getString("currentnodeid"), 0);
				if (currentnodeid < 1)
					currentnodeid = currentnodeid_temp;
				String nodetype_1 = Util.null2String(recordSet.getString("currentnodetype"));
				if (nodetype.equals(""))
					currentnodetype_temp = nodetype_1;
			}
		}
		System.out.println("-------------160-------time:" + (System.currentTimeMillis() - start));
		start  = System.currentTimeMillis();
		WorkflowComInfo workflowComInfo = new WorkflowComInfo();
		String workflowtype = workflowComInfo.getWorkflowtype(workflowid + "");
		// all remark resource
		int detailnum = Util.getIntValue(fu.getParameter("totaldetail"), 0);
		Set resourceids = new LinkedHashSet();
		ArrayList agenterids = new ArrayList();
		String resourceid = "";
		int i = 0;

		String tmpid = Util.fromScreen(fu.getParameter("field5"), user.getLanguage());
		if (!tmpid.equals("")) {
			String[] tmpids = Util.TokenizerString2(tmpid, ",");
			for (int m = 0; m < tmpids.length; m++) {
				resourceids.add(tmpids[m]);
			}
		}
		Set rightResourceidList = new HashSet();
		rs.execute("select distinct userid from workflow_currentoperator where usertype=0 and requestid=" + requestid);
		while (rs.next()) {
			int userid_tmp = Util.getIntValue(rs.getString("userid"), 0);
			if (resourceids.contains("" + userid_tmp) == false) {
				rightResourceidList.add("" + userid_tmp);
			}
		}
		System.out.println("-------------186-------time:" + (System.currentTimeMillis() - start));
		start  = System.currentTimeMillis();
		int wfcurrrid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "wfcurrrid"), 0);

		if (wfcurrrid == 0) {
			recordSet.executeSql("select isremark,isreminded,preisremark,id,groupdetailid,nodeid from workflow_currentoperator where requestid=" + requestid + " and userid=" + userid
					+ " and usertype=" + usertype + " order by isremark,id");
			boolean istoManagePage = false; // add by xhheng @20041217 for TD
											// 1438
			while (recordSet.next()) {
				String isremark = Util.null2String(recordSet.getString("isremark"));
				wfcurrrid = Util.getIntValue(recordSet.getString("id"));
				int tmpnodeid = Util.getIntValue(recordSet.getString("nodeid"));
				// modify by mackjoe at 2005-09-29 td1772
				// 转发特殊处理，转发信息本人未处理一直需要处理即使流程已归档
				if (isremark.equals("1") || isremark.equals("5") || isremark.equals("7") || isremark.equals("9") || (isremark.equals("0") && !currentnodetype_temp.equals("3"))) {
					// modify by xhheng @20041217 for TD 1438
					break;
				}
				if (isremark.equals("8")) {
					break;
				}
			}
		}
		System.out.println("-------------210-------time:" + (System.currentTimeMillis() - start));
		start  = System.currentTimeMillis();
		String messageid = "";
		/* ---- xwj for td2104 on 20050802 begin----- */

		// forwardflag : 2 征求意见；3 转办 ；1 转发
		int rolmIsRemark = 2;
		String src = "forward";
		if (forwardflag == 2 || forwardflag == 3) {
			rolmIsRemark = 0;
			if (forwardflag == 2) {
				src = "take";
			} else {
				src = "trans";
			}
		}
		RequestOperationLogManager rolm = new RequestOperationLogManager(Util.getIntValue(requestid), currentnodeid, rolmIsRemark, user.getUID(), user.getType(), CurrentDate, CurrentTime, src);
		// 开始记录日志
		rolm.flowTransStartBefore();
		System.out.println("-------------229-------time:" + (System.currentTimeMillis() - start));
		start  = System.currentTimeMillis();
		if (operate.equals("save") && wfcurrrid > 0) {
			List poppuplist = new ArrayList();

			/* --------------add by xwj for td3641 begin ----- */
			String tempHrmIds = "";// xwj td2302
			String receivedPersonids = "";
			String agentSQL = "";// xwj td2302
			boolean isbeAgent = false;
			String agenterId = "";
			String beginDate = "";
			String beginTime = "";
			String endDate = "";
			String endTime = "";
			String currentDate = "";
			String currentTime = "";
			String agenttype = "";
			/* --------------add by xwj for td3641 end ----- */
			WFForwardManager wffmanager = new WFForwardManager();
			wffmanager.setForwardRight(fu, Util.getIntValue(requestid), workflowid, currentnodeid, Util.getIntValue(userid));
			int showorder = 1;
			String forwardresourceids = "";
			System.out.println("-------------252-------time:" + (System.currentTimeMillis() - start));
			start  = System.currentTimeMillis();
			for (Object resourceidObj : resourceids) {
				int BeForwardid = 0;
				isbeAgent = false;
				// modify by mackjoe at 2005-09-28 td2865
				resourceid = (String) resourceidObj;
				boolean isexist = false;
				if (forwardflag == 1) {
					String selectsql = "select isremark,id from workflow_currentoperator where requestid=" + requestid + " and isremark in('0','1','5','7') and userid=" + resourceid
							+ " and usertype=0 order by isremark";
					recordSet.executeSql(selectsql);

					if (recordSet.next()) {
						isexist = true;
					}
				}
				// end by mackjoe
				recordSet.executeSql("select max(showorder) as maxshow from workflow_currentoperator where nodeid = " + currentnodeid + " and isremark in ('0','1','4') and requestid = " + requestid);
				if (recordSet.next()) {
					showorder = recordSet.getInt("maxshow") + 1;
				}
				/* ----------- xwj for td3641 begin ----------- */
				agentSQL = " select * from workflow_agentConditionSet where workflowId=" + workflowid + " and bagentuid=" + resourceid + " and agenttype = '1' and isproxydeal='1' "
						+ " and ( ( (endDate = '" + CurrentDate + "' and (endTime='' or endTime is null))" + " or (endDate = '" + CurrentDate + "' and endTime > '" + CurrentTime + "' ) ) "
						+ " or endDate > '" + CurrentDate + "' or endDate = '' or endDate is null)" + " and ( ( (beginDate = '" + CurrentDate + "' and (beginTime='' or beginTime is null))"
						+ " or (beginDate = '" + CurrentDate + "' and beginTime < '" + CurrentTime + "' ) ) " + " or beginDate < '" + CurrentDate
						+ "' or beginDate = '' or beginDate is null) order by agentbatch asc  ,id asc "; // agentSQL
																											// is
																											// added
																											// by
																											// xwj
																											// for
																											// td2302

				rs.execute(agentSQL);

				while (rs.next()) {
					String agentid = rs.getString("agentid");
					String conditionkeyid = rs.getString("conditionkeyid");
					boolean isagentcond = new wfAgentCondition().isagentcondite("" + requestid, "" + workflowid, "" + resourceid, "" + agentid, "" + conditionkeyid);
					if (isagentcond) {
						isbeAgent = true;
						agenterId = rs.getString("agentuid");
						beginDate = rs.getString("beginDate");
						beginTime = rs.getString("beginTime");
						endDate = rs.getString("endDate");
						endTime = rs.getString("endTime");
						currentDate = TimeUtil.getCurrentDateString();
						currentTime = (TimeUtil.getCurrentTimeString()).substring(11, 19);
						agenttype = rs.getString("agenttype");
						agenterids.add(agenterId);
						break;
					}
				}

				if (!isexist) {
					if (isbeAgent) {
						// 代理人

						para = requestid + flag + resourceid + flag + "0" + flag + workflowid + "" + flag + workflowtype + flag + usertype + flag + "2" + flag + currentnodeid + flag + agenterId
								+ flag + "1" + flag + showorder + flag + "-1";
						recordSet.executeProc("workflow_CurrentOperator_I", para);
						if (forwardflag == 3) {
							// 被代理人
							/*
							 * para=requestid+ flag +agenterId+ flag +"0"+ flag
							 * +workflowid+""+ flag +workflowtype+
							 * flag+usertype+flag + "1" + flag + currentnodeid +
							 * flag + resourceid + flag + "2" + flag +
							 * showorder+flag+"-1";
							 * recordSet.executeProc("workflow_CurrentOperator_I",para);
							 */
							// para=requestid+ flag +agenterId+ flag +"0"+ flag
							// +workflowid+""+ flag +workflowtype+
							// flag+usertype+flag + "0" +
							// flag + currentnodeid + flag + "-1" + flag + "2" +
							// flag + showorder+flag+"-1";
							para = requestid + flag + agenterId + flag + "0" + flag + workflowid + "" + flag + workflowtype + flag + usertype + flag + "0" + flag + currentnodeid + flag + resourceid
									+ flag + "2" + flag + showorder + flag + "-1";
							recordSet.executeProc("workflow_CurrentOperator_I", para);
							// agentSQL="select id from workflow_CurrentOperator
							// where requestid="+requestid+" and
							// userid="+agenterId+" and usertype="+usertype+"
							// and isremark='1' and nodeid="+currentnodeid+" and
							// showorder="+showorder+" order by id desc";
							if (needwfback.equals("0")) {
								String needsql = "update workflow_currentoperator set needwfback = '0' where requestid=" + requestid + " and userid=" + agenterId + " and usertype=" + usertype
										+ " and isremark='0' and nodeid=" + currentnodeid;
								recordSet.execute(needsql);
							}
							String ForwardHsql = "";
							if (agenterId.equals(userid)) { // 转办给自己时特殊处理
								ForwardHsql = "update workflow_currentoperator set isremark = 2 where requestid=" + requestid + " and userid=" + userid + "and showorder<>" + showorder
										+ " and usertype=" + usertype + " and isremark='0' and nodeid=" + currentnodeid;
							} else {
								ForwardHsql = "update workflow_currentoperator set isremark = 2 where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype
										+ " and isremark='0' and agentorbyagentid = '-1' and nodeid=" + currentnodeid;
							}
							recordSet.execute(ForwardHsql);
							String IDsql = "select * from workflow_currentoperator where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype
									+ " and isremark='2' and nodeid=" + currentnodeid + " order by id";
							recordSet.execute(IDsql);
							if (recordSet.next()) {
								int id = recordSet.getInt("id");
								// recordSet.execute("update
								// workflow_currentoperator set handleforwardid
								// = "+ id +" where requestid="+requestid+" and
								// userid="+resourceid+" and
								// usertype="+usertype+" and isremark='0' and
								// nodeid="+currentnodeid);
								int groupdetailid = recordSet.getInt("groupdetailid");
								int groupid = recordSet.getInt("groupid");
								recordSet.execute("update workflow_currentoperator set handleforwardid = " + id + " ,groupdetailid = " + groupdetailid + " ,groupid = " + groupid + " where requestid="
										+ requestid + " and userid=" + resourceid + " and usertype=" + usertype + " and isremark='0' and nodeid=" + currentnodeid);
							}
						} else if (forwardflag == 2) { // 意见征询，设置标识位takisremark的值为
														// "2"
							String checkoperatorsql = "select 1 from workflow_currentoperator where requestid=" + requestid + " and userid=" + agenterId + " and usertype=" + usertype
									+ " and isremark='0' and nodeid=" + currentnodeid;
							recordSet.execute(checkoperatorsql);
							if (!recordSet.next()) {
								para = requestid + flag + agenterId + flag + "0" + flag + workflowid + "" + flag + workflowtype + flag + usertype + flag + "1" + flag + currentnodeid + flag
										+ resourceid + flag + "2" + flag + showorder + flag + "-1";
								recordSet.executeProc("workflow_CurrentOperator_I", para);
								String IDsql = "select * from workflow_currentoperator where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype
										+ " and isremark='0' and nodeid=" + currentnodeid;
								recordSet.execute(IDsql);
								if (recordSet.next()) {
									// int id = recordSet.getInt("id");
									// recordSet.execute("update
									// workflow_currentoperator set
									// handleforwardid = "+ id +" where
									// requestid="+requestid+" and
									// userid="+resourceid+" and
									// usertype="+usertype+" and isremark='0'
									// and nodeid="+currentnodeid);
									int groupdetailid = recordSet.getInt("groupdetailid");
									int groupid = recordSet.getInt("groupid");
									String Taksql = "update workflow_CurrentOperator set takisremark = 2 ,groupdetailid = " + groupdetailid + " ,groupid = " + groupid + " where requestid="
											+ requestid + " and userid=" + agenterId + " and  usertype=" + usertype + " and showorder=" + showorder + " and isremark='1' and nodeid=" + currentnodeid;
									recordSet.execute(Taksql);
								}
								String Taksql2 = "update workflow_CurrentOperator set takisremark = -2 where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype
										+ " and isremark='0' and nodeid=" + currentnodeid;
								recordSet.execute(Taksql2);
							}
							agentSQL = "select id from workflow_CurrentOperator where requestid=" + requestid + " and userid=" + agenterId + " and usertype=" + usertype
									+ " and isremark='1' and nodeid=" + currentnodeid + " and showorder=" + showorder + " order by id desc";
						} else {
							// 被代理人 agenttype 的问题？
							para = requestid + flag + agenterId + flag + "0" + flag + workflowid + "" + flag + workflowtype + flag + usertype + flag + "1" + flag + currentnodeid + flag + resourceid
									+ flag + "2" + flag + showorder + flag + "-1";
							recordSet.executeProc("workflow_CurrentOperator_I", para);
							agentSQL = "select id from workflow_CurrentOperator where requestid=" + requestid + " and userid=" + agenterId + " and usertype=" + usertype
									+ " and isremark='1' and nodeid=" + currentnodeid + " and showorder=" + showorder + " order by id desc";
						}
					} else {
						if (forwardflag == 3) { // handleforwardid
							para = requestid + flag + resourceid + flag + "0" + flag + workflowid + "" + flag + workflowtype + flag + usertype + flag + "0" + flag + currentnodeid + flag + -1 + flag
									+ "0" + flag + showorder + flag + "-1";
							recordSet.executeProc("workflow_CurrentOperator_I", para);
							if (needwfback.equals("0")) {
								String needsql = "update workflow_currentoperator set needwfback = '0' where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype
										+ " and isremark='0' and nodeid=" + currentnodeid;
								recordSet.execute(needsql);
							}
							String ForwardHsql = "";
							if (resourceid.equals(userid)) { // 转办给自己时特殊处理
								ForwardHsql = "update workflow_currentoperator set isremark = 2 where requestid=" + requestid + " and userid=" + userid + "and showorder<>" + showorder
										+ " and usertype=" + usertype + " and isremark='0' and nodeid=" + currentnodeid;
							} else {
								ForwardHsql = "update workflow_currentoperator set isremark = 2 where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype
										+ " and isremark='0' and nodeid=" + currentnodeid;
							}
							recordSet.execute(ForwardHsql);
							String IDsql = "select * from workflow_currentoperator where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype
									+ " and isremark='2' and nodeid=" + currentnodeid;
							recordSet.execute(IDsql);
							if (recordSet.next()) {
								int id = recordSet.getInt("id");
								int groupdetailid = recordSet.getInt("groupdetailid");
								int groupid = recordSet.getInt("groupid");
								recordSet.execute("update workflow_currentoperator set handleforwardid = " + id + " ,groupdetailid = " + groupdetailid + " ,groupid = " + groupid + " where requestid="
										+ requestid + " and userid=" + resourceid + " and usertype=" + usertype + " and isremark='0' and nodeid=" + currentnodeid);
							}
						} else if (forwardflag == 2) { // 意见征询，设置标识位takisremark的值为
														// "2"
							String checkoperatorsql = "select 1 from workflow_currentoperator where requestid=" + requestid + " and userid=" + resourceid + " and usertype=" + usertype
									+ " and isremark='0' and nodeid=" + currentnodeid;
							recordSet.execute(checkoperatorsql);
							if (!recordSet.next()) {
								para = requestid + flag + resourceid + flag + "0" + flag + workflowid + "" + flag + workflowtype + flag + usertype + flag + "1" + flag + currentnodeid + flag + -1
										+ flag + "0" + flag + showorder + flag + "-1";
								recordSet.executeProc("workflow_CurrentOperator_I", para);
								String IDsql = "select * from workflow_currentoperator where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype
										+ " and isremark='0' and nodeid=" + currentnodeid;
								recordSet.execute(IDsql);
								if (recordSet.next()) {
									// int id = recordSet.getInt("id");
									int groupdetailid = recordSet.getInt("groupdetailid");
									int groupid = recordSet.getInt("groupid");
									String Taksql = "update workflow_CurrentOperator set takisremark = 2, groupdetailid = " + groupdetailid + " ,groupid = " + groupid + " where requestid="
											+ requestid + " and userid=" + resourceid + " and usertype=" + usertype + " and showorder=" + showorder + " and isremark='1' and nodeid=" + currentnodeid;
									recordSet.execute(Taksql);
								}
								String Taksql2 = "update workflow_CurrentOperator set takisremark = -2 where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype
										+ " and isremark='0' and nodeid=" + currentnodeid;
								recordSet.execute(Taksql2);
							}
							agentSQL = "select id from workflow_CurrentOperator where requestid=" + requestid + " and userid=" + resourceid + " and usertype=" + usertype
									+ " and isremark='1' and nodeid=" + currentnodeid + " and showorder=" + showorder + " order by id desc";
						} else {
							para = requestid + flag + resourceid + flag + "0" + flag + workflowid + "" + flag + workflowtype + flag + usertype + flag + "1" + flag + currentnodeid + flag + -1 + flag
									+ "0" + flag + showorder + flag + "-1";
							recordSet.executeProc("workflow_CurrentOperator_I", para);
							agentSQL = "select id from workflow_CurrentOperator where requestid=" + requestid + " and userid=" + resourceid + " and usertype=" + usertype
									+ " and isremark='1' and nodeid=" + currentnodeid + " and showorder=" + showorder + " order by id desc";
						}
					}
					recordSet.execute(agentSQL);
					if (recordSet.next()) {
						BeForwardid = recordSet.getInt("id");
					}
				}

				ResourceComInfo rcomInfo = new ResourceComInfo();
				if (!isbeAgent) {
					tempHrmIds += Util.toScreen(rcomInfo.getResourcename(resourceid), user.getLanguage()) + ",";
					receivedPersonids += Util.null2String(resourceid) + ",";
				} else {
					tempHrmIds += Util.toScreen(rcomInfo.getResourcename(resourceid), user.getLanguage()) + "->" + Util.toScreen(rcomInfo.getResourcename(agenterId), user.getLanguage()) + ",";
					receivedPersonids += Util.null2String(resourceid) + ",";
				}

				/* ----------- xwj for td3641 end ----------- */

				// 流程测试状态下转发，不提醒被转发人 START
				int istest = 0;
				try {
					rs.execute("select isvalid from workflow_base where id=" + workflowid);
					if (rs.next()) {
						int isvalid_t = Util.getIntValue(rs.getString("isvalid"), 0);
						if (isvalid_t == 2) {
							istest = 1;
						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}

				if (istest != 1) {
					// 2004-05-19 刘煜修改， 在转发的时候加入对被转发人的工作流提醒（有新的工作流）,
					// 被转发人肯定为人力资源，因此类型默认为“0”

					if (isbeAgent) {
						forwardresourceids += "," + agenterId;
						// PoppupRemindInfoUtil.insertPoppupRemindInfo(Integer.parseInt(agenterId),0,"0",Integer.parseInt(requestid),requestname);//xwj
						// for td3450 20060111
						Map map = new HashMap();
						map.put("userid", "" + Integer.parseInt(agenterId));
						map.put("type", "0");
						map.put("logintype", "0");
						map.put("requestid", "" + Integer.parseInt(requestid));
						map.put("requestname", "" + requestname);
						map.put("workflowid", "-1");
						map.put("creater", "");
						poppuplist.add(map);
					} else {
						forwardresourceids += "," + resourceid;

						Map map = new HashMap();
						map.put("userid", "" + Integer.parseInt(resourceid));
						map.put("type", "0");
						map.put("logintype", "0");
						map.put("requestid", "" + Integer.parseInt(requestid));
						map.put("requestname", "" + requestname);
						map.put("workflowid", "-1");
						map.put("creater", "");
						poppuplist.add(map);
						// PoppupRemindInfoUtil.insertPoppupRemindInfo(Integer.parseInt(resourceid),0,"0",Integer.parseInt(requestid),requestname);//xwj
						// for td3450 20060111
					}
				}

				int IsSubmitedOpinion = 0; // 待办提交后被转发人是否可提交意见
				int IsBeForwardTodo = 0; // 待办可转发

				int IsBeForwardSubmitAlready = 0; // 允许已办被转发人可提交意见

				int IsBeForwardAlready = 0; // 已办被转发人可转发

				int IsBeForwardSubmitNotaries = 0; // 允许办结被转发人可提交意见

				int IsBeForward = 0; // 办结被转发人是否可转发

				int IsFromWFRemark = -1; // 被转发状态

				// 流程测试状态下转发，不提醒被转发人 END
				// wffmanager.SaveForward(Util.getIntValue(requestid),wfcurrrid,BeForwardid);
				if (isforwardrights.equals("1")) {
					IsSubmitedOpinion = Util.getIntValue(fu.getParameter("IsSubmitedOpinion"), 0); // 待办提交后被转发人是否可提交意见
					IsBeForwardTodo = Util.getIntValue(fu.getParameter("IsBeForwardTodo"), 0); // 待办可转发

					IsBeForwardSubmitAlready = Util.getIntValue(fu.getParameter("IsBeForwardSubmitAlready"), 0); // 允许已办被转发人可提交意见

					IsBeForwardAlready = Util.getIntValue(fu.getParameter("IsBeForwardAlready"), 0); // 已办被转发人可转发

					IsBeForwardSubmitNotaries = Util.getIntValue(fu.getParameter("IsBeForwardSubmitNotaries"), 0); // 允许办结被转发人可提交意见

					IsBeForward = Util.getIntValue(fu.getParameter("IsBeForward"), 0); // 办结被转发人是否可转发

					IsFromWFRemark = Util.getIntValue(fu.getParameter("IsFromWFRemark"), -1);
				}
				if (IsFromWFRemark == -1) {
					rs.executeSql("select isremark,isreminded,preisremark,id,groupdetailid,nodeid,takisremark,(CASE WHEN isremark=9 THEN '7.5' "
							+ "WHEN (isremark=1 and takisremark=2) THEN '0.9' WHEN (preisremark=1 and takisremark=2) "
							+ "THEN '0.9' ELSE isremark END) orderisremark from workflow_currentoperator where requestid=" + requestid + " and userid=" + user.getUID() + " and usertype=" + usertype
							+ " order by orderisremark,islasttimes desc ");
					String isremarkForRM = "";
					if (rs.next()) {
						isremarkForRM = Util.null2String(rs.getString("isremark"));
					}

					rs.execute("select currentnodetype from workflow_requestbase where requestid  =  " + requestid);
					String currentnodetype = "";
					if (rs.next()) {
						currentnodetype = Util.null2String(rs.getString("currentnodetype"));
					}
					if (currentnodetype.equals("3")) {
						IsFromWFRemark = 2;
					} else {
						if ("1".equals(isremarkForRM) || "0".equals(isremarkForRM) || "7".equals(isremarkForRM) || "8".equals(isremarkForRM) || "9".equals(isremarkForRM)) {
							IsFromWFRemark = 0;
						} else if ("2".equals(isremarkForRM)) {
							IsFromWFRemark = 1;
						}
					}
				}
				//rs.writeLog("---------------requestid:" + requestid + ",--------------IsFromWFRemark:" + IsFromWFRemark);
				wffmanager.SaveForward(Util.getIntValue(requestid), wfcurrrid, BeForwardid, forwardflag);
				if (isforwardrights.equals("1")) {
					// int
					// IsSubmitedOpinion=Util.getIntValue(fu.getParameter("IsSubmitedOpinion"),0);
					// //待办提交后被转发人是否可提交意见
					// int
					// IsBeForwardTodo=Util.getIntValue(fu.getParameter("IsBeForwardTodo"),0);
					// //待办可转发

					// int IsBeForwardSubmitAlready
					// =Util.getIntValue(fu.getParameter("IsBeForwardSubmitAlready"),0);
					// //允许已办被转发人可提交意见

					// int IsBeForwardAlready
					// =Util.getIntValue(fu.getParameter("IsBeForwardAlready"),0);
					// //已办被转发人可转发

					// int IsBeForwardSubmitNotaries
					// =Util.getIntValue(fu.getParameter("IsBeForwardSubmitNotaries"),0);
					// //允许办结被转发人可提交意见

					// int
					// IsBeForward=Util.getIntValue(fu.getParameter("IsBeForward"),0);
					// //办结被转发人是否可转发

					/*
					 * WFForwardManager.setIsSubmitedOpinion(IsSubmitedOpinion);
					 * WFForwardManager.setIsBeForwardTodo(IsBeForwardTodo);
					 * WFForwardManager.setIsBeForwardSubmitAlready(IsBeForwardSubmitAlready);
					 * WFForwardManager.setIsBeForwardAlready(IsBeForwardAlready);
					 * WFForwardManager.setIsBeForwardSubmitNotaries(IsBeForwardSubmitNotaries);
					 * WFForwardManager.setIsBeForward(IsBeForward);
					 */
					String wfSQL = "select requestid from workflow_Forward where requestid=" + requestid + " and Forwardid=" + wfcurrrid + " and BeForwardid=" + BeForwardid;
					recordSet.execute(wfSQL);
					if (recordSet.next()) {
						recordSet.execute("update workflow_Forward set IsSubmitedOpinion=" + IsSubmitedOpinion + ",IsBeForwardTodo=" + IsBeForwardTodo + ",IsBeForwardSubmitAlready="
								+ IsBeForwardSubmitAlready + ",IsBeForward=" + IsBeForward + ",IsBeForwardAlready=" + IsBeForwardAlready + ",IsBeForwardSubmitNotaries=" + IsBeForwardSubmitNotaries
								+ ",IsFromWFRemark=" + IsFromWFRemark + " where requestid=" + requestid + " and Forwardid=" + wfcurrrid + " and BeForwardid=" + BeForwardid);
					}
				}

			}
			System.out.println("-------------635-------time:" + (System.currentTimeMillis() - start));
			start  = System.currentTimeMillis();
			new PoppupRemindInfoUtil().insertPoppupRemindInfo(poppuplist);

			// 将代理人加入人员列表，用于发送邮件通知和设置共享

			for (i = 0; i < agenterids.size(); i++) {
				resourceids.add(agenterids.get(i));
			}

			String isfeedback = "";
			String isnullnotfeedback = "";
			recordSet.executeSql("select isfeedback,isnullnotfeedback from workflow_flownode where workflowid=" + workflowid + " and nodeid=" + currentnodeid);
			if (recordSet.next()) {
				isfeedback = Util.null2String(recordSet.getString("isfeedback"));
				isnullnotfeedback = Util.null2String(recordSet.getString("isnullnotfeedback"));
			}
			/*
			 * if
			 * (!ifchangstatus.equals("")&&isfeedback.equals("1")&&((isnullnotfeedback.equals("1")&&!Util.replace(remark,
			 * "\\<script\\>initFlashVideo\\(\\)\\;\\<\\/script\\>", "", 0,
			 * false).equals(""))||!isnullnotfeedback.equals("1"))) {
			 * recordSet.executeSql("update workflow_currentoperator set
			 * viewtype =-1 where needwfback='1' and requestid=" + requestid + "
			 * and userid<>" + userid + " and viewtype=-2"); }
			 */

			// 发送邮件

			MailAndMessage sendMail = new MailAndMessage();
			sendMail.setRequest(fu);
			sendMail.sendMailAndMessage(Integer.parseInt(requestid), new ArrayList(resourceids), user);
			// 加入LOG表信息
			System.out.println("-------------668-------time:" + (System.currentTimeMillis() - start));
			start  = System.currentTimeMillis();

			recordSet.executeSql("select * from workflow_currentoperator where userid = " + userid + " and nodeid = " + currentnodeid + " and isremark in ('0','1','4') and requestid = " + requestid
					+ " order by showorder,receivedate,receivetime");
			int tempagentorbyagentid = -1;
			int tempagenttype = 0;
			if (recordSet.next()) {
				showorder = recordSet.getInt("showorder");
				tempagentorbyagentid = recordSet.getInt("agentorbyagentid");
				tempagenttype = recordSet.getInt("agenttype");
				if (tempagenttype < 0)
					tempagenttype = 0;
			}
			String currentnodetype = "";
			recordSet.executeSql("select currentnodetype from workflow_requestbase where requestid= " + requestid);
			if (recordSet.next()) {
				currentnodetype = recordSet.getString("currentnodetype");
				if (currentnodetype.equals("3")) {
					tempagentorbyagentid = -1;
					tempagenttype = 0;
				}
			}
			System.out.println("-------------690-------time:" + (System.currentTimeMillis() - start));
			start  = System.currentTimeMillis();
			RequestAnnexUpload rau = new RequestAnnexUpload();
			rau.setRequest(fu);
			rau.setUser(user);
			String annexdocids = rau.AnnexUpload();
			String Procpara = "";
			if (forwardflag == 2) {
				Procpara = requestid + "" + flag + workflowid + "" + flag + currentnodeid + "" + flag + "a" + flag + CurrentDate + flag + CurrentTime + flag + userid + "" + flag
						// + CurrentDate + flag + CurrentTime + flag + userid+""
						// + flag + remark + flag
						+ clientip + flag + operatortype + flag + "0" + flag + tempHrmIds.trim() + flag + tempagentorbyagentid + flag + tempagenttype + flag + showorder + flag + annexdocids + flag
						+ requestLogId + flag + signdocids + flag + signworkflowids + flag + "0" + flag + "0" + flag + "0" + flag + receivedPersonids.trim() + flag + remarkLocation; // xwj
																																														// for
																																														// td1837
																																														// on
																																														// 2005-05-12
			}
			if (forwardflag == 3) {
				Procpara = requestid + "" + flag + workflowid + "" + flag + currentnodeid + "" + flag + "h" + flag + CurrentDate + flag + CurrentTime + flag + userid + "" + flag
						// + CurrentDate + flag + CurrentTime + flag + userid+""
						// + flag + remark + flag
						+ clientip + flag + operatortype + flag + "0" + flag + tempHrmIds.trim() + flag + tempagentorbyagentid + flag + tempagenttype + flag + showorder + flag + annexdocids + flag
						+ requestLogId + flag + signdocids + flag + signworkflowids + flag + "0" + flag + "0" + flag + "0" + flag + receivedPersonids.trim() + flag + remarkLocation; // xwj
																																														// for
																																														// td1837
																																														// on
																																														// 2005-05-12
			}
			System.out.println("-------------716-------time:" + (System.currentTimeMillis() - start));
			start  = System.currentTimeMillis();
			if (forwardflag == 1) {
				Procpara = requestid + "" + flag + workflowid + "" + flag + currentnodeid + "" + flag + "7" + flag + CurrentDate + flag + CurrentTime + flag + userid + "" + flag
						// + CurrentDate + flag + CurrentTime + flag + userid+""
						// + flag + remark + flag
						+ clientip + flag + operatortype + flag + "0" + flag + tempHrmIds.trim() + flag + tempagentorbyagentid + flag + tempagenttype + flag + showorder + flag + annexdocids + flag
						+ requestLogId + flag + signdocids + flag + signworkflowids + flag + "0" + flag + "0" + flag + "0" + flag + receivedPersonids.trim() + flag + remarkLocation; // xwj
																																														// for
																																														// td1837
																																														// on
																																														// 2005-05-12
			}
			System.out.println("-------------727-------time:" + (System.currentTimeMillis() - start));
			start  = System.currentTimeMillis();
			String currentString = new RequestManager().execRequestlog(Procpara, rs, flag, remark);
			System.out.println("-------------736-------time:" + (System.currentTimeMillis() - start));
			start  = System.currentTimeMillis();
			if (!"".equals(currentString) && currentString.indexOf("~~current~~") > -1) {
				String[] arraycurrent = Util.TokenizerString2(currentString, "~~current~~");
				String currentdate = arraycurrent[0];
				String currenttime = arraycurrent[1];
				RequestSignRelevanceWithMe reqsignwm = new RequestSignRelevanceWithMe();
				reqsignwm.inertRelevanceInfo(workflowid + "", requestid, currentnodeid + "", "7", currentdate, currenttime, userid, remark, (("" != forwardresourceids) ? forwardresourceids
						.substring(1) : forwardresourceids));

				int nodeattr = wfLinkInfo.getNodeAttribute(currentnodeid);
				Set<String> branchNodeSet = new HashSet<String>();
				if (nodeattr == 2) { // 分支中间节点
					String branchnodes = "";
					branchnodes = wfLinkInfo.getNowNodeids(Util.getIntValue(requestid, -1));
					if (!"".equals(branchnodes)) {
						String[] strs = branchnodes.split(",");
						for (int k = 0; k < strs.length; k++) {
							String nodestr = strs[k];
							if (!"-1".equals(nodestr)) {
								branchNodeSet.add(nodestr);
							}
						}
					}
				}
				/** 日志的权限处理,start */
				if (!"3".equals(currnodetype0) && (currentnodeid == currnodeid0 || branchNodeSet.contains(currentnodeid + ""))) { // 非归档节点，且是在当前节点上的转发操作

					RequestRemarkRight remarkRight = new RequestRemarkRight();
					remarkRight.setRequestid(Util.getIntValue(requestid, -1));
					remarkRight.setNodeid(currentnodeid);
					remarkRight.setWorkflow_currentid(wfcurrrid);
					String logtype = "7";
					if (forwardflag == 2) { // 征询
						logtype = "a";
					} else if (forwardflag == 3) { // 转办
						logtype = "h";
					} else { // 转发
						logtype = "7";
					}
					String rightSql = " select logid from workflow_requestlog where workflowid = " + workflowid + " and nodeid = " + currentnodeid + " and logtype = '" + logtype
							+ "' and requestid = " + requestid + " and operatedate = '" + currentdate + "' and operatetime = '" + currenttime + "' and operator = " + userid;
					recordSet.executeSql(rightSql);
					int logid = -1;
					if (recordSet.next()) {
						logid = recordSet.getInt("logid");
					}
					String receiversids = ""; // 授予权限的人员

					// 这里将转发的接收人，以及接收人的代理人都授权，避免代理人收回代理权限时，还需要处理签字意见的权限问题
					for (Object myuserid : resourceids) {
						receiversids += "," + myuserid;
					}
					if (receiversids.length() > 0) {
						receiversids = receiversids.substring(1);
					}
					remarkRight.saveRemarkRight(logid, receiversids);
				}
				/** 日志的权限处理,end */
			}
			System.out.println("-------------788-------time:" + (System.currentTimeMillis() - start));
			start  = System.currentTimeMillis();
			int nodeattr = wfLinkInfo.getNodeAttribute(currentnodeid);
			if (forwardflag == 3 && nodeattr == 2) {
				new RequestManager().CheckUserIsLasttimes(Util.getIntValue(requestid), currentnodeid, user);
			}

			/*
			 * recordSet.executeProc("workflow_RequestLog_Insert",Procpara); if
			 * (recordSet.next()) { String currentdate = recordSet.getString(1);
			 * String currenttime = recordSet.getString(2);
			 * 
			 * RequestSignRelevanceWithMe reqsignwm = new
			 * RequestSignRelevanceWithMe();
			 * reqsignwm.inertRelevanceInfo(workflowid+"", requestid,
			 * currentnodeid+"", "7", currentdate, currenttime, userid, remark,
			 * forwardresourceids.substring(1)); }
			 */

			if (requestLogId > 0) {// 表单签章
				recordSet.executeSql("select imagefileid from workflow_formsignremark where requestlogid=" + requestLogId);
				recordSet.next();
				int imagefileid = Util.getIntValue(recordSet.getString("imagefileid"), 0);
				if (imagefileid > 0)
					remark = "" + requestLogId;
			}
			if (!ifchangstatus.equals("") && isfeedback.equals("1")
					&& ((isnullnotfeedback.equals("1") && !Util.replace(remark, "\\<script\\>initFlashVideo\\(\\)\\;\\<\\/script\\>", "", 0, false).equals("")) || !isnullnotfeedback.equals("1"))) {
				recordSet.executeSql("update workflow_currentoperator set viewtype =-1  where needwfback='1' and requestid=" + requestid + " and userid<>" + userid + " and viewtype=-2");
			}

			// 处理之前节点操作人对附件的权限 TD10577 Start
			String[] docids = Util.TokenizerString2(annexdocids, ",");
			System.out.println("-------------821-------time:" + (System.currentTimeMillis() - start));
			start  = System.currentTimeMillis();
			for (int cx = 0; i < docids.length; i++) {
				int docid_tmp = Util.getIntValue(docids[cx]);
				for (Object rightResourceid_tmpObj : rightResourceidList) {
					int rightResourceid_tmp = Util.getIntValue((String) rightResourceid_tmpObj, 0);
					try {
						ShareinnerInfo shareInfo = new ShareinnerInfo();
						shareInfo.AddShare(docid_tmp, 1, rightResourceid_tmp, 10, 1, 1, rightResourceid_tmp, "ShareinnerDoc", 1);
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
			System.out.println("-------------835-------time:" + (System.currentTimeMillis() - start));
			start  = System.currentTimeMillis();
			// 处理之前节点操作人对附件的权限 TD10577 End

			// 保存签字意见提交人当前部门

			// String departmentid =
			// Util.null2String(ResourceComInfo.getDepartmentID(""+userid));
			// if(!departmentid.equals("")) rs.executeSql("update
			// workflow_requestlog set operatorDept="+departmentid+" where
			// requestid="+requestid+" and nodeid="+currentnodeid+" and
			// logtype='7' and operator="+userid+" and
			// operatortype="+operatortype);

			if (!signdocids.equals("")) {
				recordSet.executeSql("select docids from workflow_requestbase where requestid=" + requestid);
				recordSet.next();
				String newdocids = Util.null2String(recordSet.getString("docids"));
				if (!newdocids.equals(""))
					newdocids = newdocids + "," + signdocids;
				else
					newdocids = signdocids;
				recordSet.executeSql("update workflow_requestbase set docids='" + newdocids + "' where requestid=" + requestid);
			}
			RequestAddShareInfo rasi = new RequestAddShareInfo();
			rasi.SetNextNodeID(currentnodeid);
			if (forwardflag == 1) {
				rasi.addShareInfo(requestid, new ArrayList(resourceids), "false", forwardflag == 2, "1".equals(wffmanager.getIsBeForwardModify()));
			} else {
				rasi.addShareInfo(requestid, new ArrayList(resourceids), wffmanager.getIsHandleForward().equals("1") ? "true" : "false", forwardflag == 2, "1"
						.equals(wffmanager.getIsBeForwardModify()));
			}

			// added by pony on 2006-05-31 for Td4442
			new RemarkOperaterManager().processRemark(workflowid, requestid, currentnodeid, user, fu);
			new RequestAddOpinionShareInfo().processOpinionRemarkResourcesShare(workflowid, requestid, new ArrayList(resourceids), user, currentnodeid);
			// added end.
			// recordSet.executeSql("update workflow_requestbase set
			// lastoperator="+userid+",lastoperatortype="+usertype+",lastoperatedate='"+CurrentDate+"',lastoperatetime='"+CurrentTime+"'
			// where requestid="+requestid);
			if (currentnodetype.equals("3"))// 如果流程已归档，不修改lastoperatedate和lastoperatetime的值

				recordSet.executeSql("update workflow_requestbase set lastoperator=" + userid + ",lastoperatortype=" + usertype + " where requestid=" + requestid);
			else
				recordSet.executeSql("update workflow_requestbase set lastoperator=" + userid + ",lastoperatortype=" + usertype + ",lastoperatedate='" + CurrentDate + "',lastoperatetime='"
						+ CurrentTime + "' where requestid=" + requestid);

			// TD9144 弹出转发窗口，提交转发请求后，关闭该窗口，并刷新原页面

			// 查询当前请求的一些基本信息
			// 转发，转办，意见征询都要生成缓存文件
			// if(forwardflag == 1){

//			try {
//				recordSet.executeQuery("select isbill,formid from workflow_base where id = ? ", workflowid);
//				if (recordSet.next()) {
//					int isbill = recordSet.getInt("isbill");
//					int formid = recordSet.getInt("formid");
//					recordSet.executeProc("workflow_Requestbase_SByID", requestid + "");
//					if (recordSet.next()) {
//						String oldformsignaturemd5 = Util.null2String(recordSet.getString("formsignaturemd5"));
//
//						// 推送处理start
//						WFPathUtil wfutil = new WFPathUtil();
//
//						if (tmpid.length() > 0) {
//							String[] tmpids = Util.TokenizerString2(tmpid, ",");
//							for (Object tmpidObj : tmpids) {
//								int tmpuserid = Util.getIntValue((String) tmpidObj, 0);
//								if (tmpuserid > 0) {
//									User userTemp = User.getUser(tmpuserid, Integer.valueOf(usertype));
//									wfutil.getFixedThreadPool().execute(
//											new RequestPreProcessing("0", workflowid, isbill, formid, Integer.valueOf(requestid), requestname, oldformsignaturemd5, currentnodeid, currentnodeid,
//													false, "0", userTemp, true));
//								}
//							}
//						}
//						// 推送处理end
//					}
//				}
//			} catch (Exception e) {
//			}
			// }

			// response.sendRedirect("/workflow/request/ViewRequest.jsp?requestid="+requestid);

		} else {
			messageid = "6";
		}
		System.out.println("-------------924-------time:" + (System.currentTimeMillis() - start));
		start  = System.currentTimeMillis();
		// 记录日志
		rolm.flowTransSubmitAfter();
		Map<String, Object> apidatas = new HashMap<String, Object>();
		apidatas.put("forwardflag", forwardflag);
		return apidatas;
	}
}
