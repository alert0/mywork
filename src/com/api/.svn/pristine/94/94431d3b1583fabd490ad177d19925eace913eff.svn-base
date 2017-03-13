package com.api.workflow.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import weaver.conn.RecordSet;
import weaver.file.FileUpload;
import weaver.general.BaseBean;
import weaver.general.GCONST;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.mobile.webservices.workflow.soa.RequestPreProcessing;
import weaver.workflow.request.RequestAddShareInfo;
import weaver.workflow.request.RequestLog;
import weaver.workflow.request.RequestManager;
import weaver.workflow.request.RequestOperationLogManager;
import weaver.workflow.request.RequestRemarkRight;
import weaver.workflow.request.RequestSignRelevanceWithMe;
import weaver.workflow.request.WFLinkInfo;
import weaver.workflow.request.RequestOperationLogManager.RequestOperateEntityTableNameEnum;

public class RequestRemarkOperation {
	
	enum ExecuteType {
		NORIGHT, // 无权限
		FAILD, // 处理失败，显示精确提示信息
		SUCCESS; // 成功
	}

	public Map<String,Object> execute(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String, Object> resultInfo = new HashMap<String, Object>();
		
		RecordSet rs = new RecordSet();
		HttpSession session = request.getSession();
		FileUpload fu = new FileUpload(request);
		String f_weaver_belongto_userid = fu.getParameter("f_weaver_belongto_userid");// 需要增加的代码
		String f_weaver_belongto_usertype = fu.getParameter("f_weaver_belongto_usertype");// 需要增加的代码
		User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);// 需要增加的代码
		String userid = "" + user.getUID();
		int usertype = (user.getLogintype()).equals("1") ? 0 : 1;
		String src = Util.null2String(fu.getParameter("src"));
		String iscreate = Util.null2String(fu.getParameter("iscreate"));
		int requestid = Util.getIntValue(fu.getParameter("requestid"), -1);
		int workflowid = Util.getIntValue(fu.getParameter("workflowid"), -1);
		String workflowtype = Util.null2String(fu.getParameter("workflowtype"));
		int nodeid = Util.getIntValue(fu.getParameter("nodeid"), -1);
		String nodetype = Util.null2String(fu.getParameter("nodetype"));
		String needwfback = Util.null2String(fu.getParameter("needwfback"));
		String remark = Util.null2String(fu.getParameter("remark"));
		int formid = Util.getIntValue(fu.getParameter("formid"), -1);
		int isbill = Util.getIntValue(fu.getParameter("isbill"), -1);
		int billid = Util.getIntValue(fu.getParameter("billid"), -1);
		String requestname = Util.fromScreen3(fu.getParameter("requestname"), user.getLanguage());
		String requestlevel = Util.fromScreen(fu.getParameter("requestlevel"), user.getLanguage());
		String messageType = Util.fromScreen(fu.getParameter("messageType"), user.getLanguage());
		String isFromEditDocument = Util.null2String(fu.getParameter("isFromEditDocument"));
		String submitNodeId = Util.null2String(fu.getParameter("submitNodeId"));
		String Intervenorid = Util.null2String(fu.getParameter("Intervenorid"));
		int isremark = Util.getIntValue(fu.getParameter("isremark"), -1);
		String remarkLocation = Util.null2String(fu.getParameter("remarkLocation"));
		boolean IsCanModify = "true".equals(session.getAttribute(user.getUID() + "_" + requestid + "IsCanModify")) ? true : false;
		BaseBean basebean = new BaseBean();
		String ifchangstatus = Util.null2String(basebean.getPropValue(GCONST.getConfigFile(), "ecology.changestatus"));
		if (src.equals("") || workflowid == -1 || nodeid == -1 || nodetype.equals("")) {
			resultInfo.put("type", ExecuteType.NORIGHT);
			resultInfo.put("sendPage", "/notice/RequestError.jsp");
			return resultInfo;
		}
		RequestManager requestManager = new RequestManager();
		requestManager.setSrc(src);
		requestManager.setIscreate(iscreate);
		requestManager.setRequestid(requestid);
		requestManager.setWorkflowid(workflowid);
		requestManager.setWorkflowtype(workflowtype);
		requestManager.setIsremark(isremark);
		requestManager.setFormid(formid);
		requestManager.setIsbill(isbill);
		requestManager.setBillid(billid);
		requestManager.setNodeid(nodeid);
		requestManager.setNodetype(nodetype);
		requestManager.setRequestname(requestname);
		requestManager.setRequestlevel(requestlevel);
		requestManager.setRemark(remark);
		requestManager.setRequest(fu);
		requestManager.setSubmitNodeId(submitNodeId);
		requestManager.setIntervenorid(Intervenorid);
		requestManager.setRemarkLocation(remarkLocation);
		requestManager.setMessageType(messageType);
		requestManager.setIsFromEditDocument(isFromEditDocument);
		requestManager.setUser(user);
		requestManager.setCanModify(IsCanModify);
		boolean savestatus = requestManager.saveRequestInfo();
		requestid = requestManager.getRequestid();
		if (!savestatus) {
			if (requestid != 0) {
				String message = requestManager.getMessage();
				message = "".equals(message) ? "1" : message;
				resultInfo.put("messagecontent", requestManager.getMessagecontent());
				resultInfo.put("message", message);
				resultInfo.put("type", ExecuteType.FAILD);
			} else {
				// out.print("<script>wfforward('/workflow/request/RequestView.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+usertype+"&message=1');</script>");
				// return ;
			}
		}

		RequestOperationLogManager rolm = new RequestOperationLogManager(requestid);
		int optLogid = -1;
		// 强制收回
		int wfcuroptid = -1;
		if (isremark == 9) {
			rs.executeSql("select id from workflow_currentoperator where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype + " and isremark=9");
			if (rs.next()) {
				wfcuroptid = Util.getIntValue(rs.getString(1));
				optLogid = rolm.getOptLogID(RequestOperationLogManager.RequestOperateEntityTableNameEnum.CURRENTOPERATOR.getId(), wfcuroptid, 0);
			}
		}

		char flag = Util.getSeparator();
		// 提交
		if (isremark == 1) {
			if (!"0".equals(needwfback)) {
				rs.executeProc("workflow_CurOpe_UbyForward", "" + requestid + flag + userid + flag + usertype);
			} else {
				rs.executeProc("workflow_CurOpe_UbyForwardNB", "" + requestid + flag + userid + flag + usertype);
			}
		} else {
			if (!"0".equals(needwfback)) {
				rs.executeProc("workflow_CurOpe_UbySend", "" + requestid + flag + userid + flag + usertype + flag + isremark);
			} else {
				rs.executeProc("workflow_CurOpe_UbySendNB", "" + requestid + flag + userid + flag + usertype + flag + isremark);
			}
		}

		// 推送处理start
		new Thread(new RequestPreProcessing(workflowid, isbill, formid, requestid, requestname, "", nodeid, 0, false, "", user, true)).start();

		String isfeedback = "";
		String isnullnotfeedback = "";
		rs.executeSql("select isfeedback,isnullnotfeedback from workflow_flownode where workflowid=" + workflowid + " and nodeid=" + nodeid);
		if (rs.next()) {
			isfeedback = Util.null2String(rs.getString("isfeedback"));
			isnullnotfeedback = Util.null2String(rs.getString("isnullnotfeedback"));
		}
		if (!ifchangstatus.equals("") && isfeedback.equals("1")
				&& ((isnullnotfeedback.equals("1") && !Util.replace(remark, "\\<script\\>initFlashVideo\\(\\)\\;\\<\\/script\\>", "", 0, false).equals("")) || !isnullnotfeedback.equals("1"))) {
			rs.executeSql("update workflow_currentoperator set viewtype =-1  where needwfback='1' and requestid=" + requestid + " and userid<>" + userid + " and viewtype=-2");

		}
		String curnodetype = "";
		int currentnodeid = 0;
		rs.executeSql("select currentnodetype,currentnodeid from workflow_Requestbase where requestid=" + requestid);
		if (rs.next()) {
			curnodetype = Util.null2String(rs.getString(1));
			currentnodeid = rs.getInt(2);
		}
		if (curnodetype.equals("3"))// 归档流程转发后，转发人或抄送人提交后到办结事宜。

			rs.executeSql("update workflow_currentoperator set iscomplete=1 where userid=" + userid + " and usertype=" + usertype + " and requestid=" + requestid);
		RequestLog requestlog = new RequestLog();
		requestlog.setRequest(fu);
		int takisremark = -1;
		int handleforwardid = -1;
		String zsql = "select * from workflow_currentoperator where requestid= " + requestid + "and nodeid = " + nodeid + " and userid = " + userid;
		rs.executeSql(zsql);
		if (rs.next()) {
			takisremark = Util.getIntValue(rs.getString("takisremark"));
			handleforwardid = Util.getIntValue(rs.getString("handleforwardid"));
		}

		String currentString = "";
		if (takisremark == 2) {
			currentString = requestlog.saveLog2(workflowid, requestid, nodeid, "b", remark, user, "0", 0, 0, "", remarkLocation); // 意见征询
		} else if (handleforwardid > 0) {
			currentString = requestlog.saveLog2(workflowid, requestid, nodeid, "j", remark, user, "0", 0, 0, "", remarkLocation); // 转办
		} else {
			currentString = requestlog.saveLog2(workflowid, requestid, nodeid, "9", remark, user, "0", 0, 0, "", remarkLocation);
			// 抄送需要提交 时， 添加 强制收回支持
			if (isremark == 9) {
				rs.executeSql("select logid from workflow_requestlog where requestid = " + requestid + " and nodeid = " + nodeid + " and operator=" + user.getUID() + " and operatortype=" + usertype
						+ " and logtype = '9' order by operatedate, operatetime");
				if (rs.next()) {
					int newlogid = rs.getInt(1);
					if (newlogid > 0) {
						// 向之前的日志中添加本条提交的记录， 方便在强制收回的时候能够收回
						rolm.addDetailLog(optLogid, RequestOperateEntityTableNameEnum.REQUESTLOG.getId(), newlogid, 0, "", "", "");
					}
				}
			}
		}
		WFLinkInfo wflinkinfo = new WFLinkInfo();
		int nodeattr = wflinkinfo.getNodeAttribute(nodeid);
		Set<String> branchNodeSet = new HashSet<String>();
		if (nodeattr == 2) { // 分支中间节点
			String branchnodes = "";
			branchnodes = wflinkinfo.getNowNodeids(requestid);
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

		/** 日志权限的处理，非归档节点，且提交时的节点，跟流程当前节点相同才需要权限控制 */
		if (!"".equals(currentString) && currentString.indexOf("~~current~~") > -1 && !"3".equals(curnodetype) && (nodeid == currentnodeid || branchNodeSet.contains(nodeid + ""))) {
			int wfcurrrid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "wfcurrrid"), 0);
			if (wfcurrrid == 0) {
				rs.executeSql("select isremark,isreminded,preisremark,id,groupdetailid,nodeid from workflow_currentoperator where requestid=" + requestid + " and userid=" + userid + " and usertype="
						+ usertype + " order by isremark,id");
				while (rs.next()) {
					String isremark_tmp = Util.null2String(rs.getString("isremark"));
					wfcurrrid = Util.getIntValue(rs.getString("id"));
					// 转发特殊处理，转发信息本人未处理一直需要处理即使流程已归档
					if (isremark_tmp.equals("1") || isremark_tmp.equals("5") || isremark_tmp.equals("7") || isremark_tmp.equals("9") || (isremark_tmp.equals("0") && !nodetype.equals("3"))) {
						break;
					}
					if (isremark_tmp.equals("8")) {
						break;
					}
				}
			}

			String[] arraycurrent = Util.TokenizerString2(currentString, "~~current~~");
			String currentdate = arraycurrent[0];
			String currenttime = arraycurrent[1];
			RequestRemarkRight remarkRight = new RequestRemarkRight();
			remarkRight.setRequestid(requestid);
			remarkRight.setNodeid(nodeid);
			remarkRight.setWorkflow_currentid(wfcurrrid);
			String logtype = "7";
			if (takisremark == 2) { // 征询
				logtype = "b";
			} else if (handleforwardid > 0) { // 转办
				logtype = "j";
			} else { // 转发
				logtype = "9";
			}
			String rightSql = " select logid from workflow_requestlog where workflowid = " + workflowid + " and nodeid = " + nodeid + " and logtype = '" + logtype + "' and requestid = " + requestid
					+ " and operatedate = '" + currentdate + "' and operatetime = '" + currenttime + "' and operator = " + userid;
			rs.executeSql(rightSql);
			int logid = -1;
			if (rs.next()) {
				logid = rs.getInt("logid");
			}
			String userids = "";
			remarkRight.saveRemarkRight(logid, userids);
		}

		if (!"".equals(currentString) && currentString.indexOf("~~current~~") > -1) {
			String[] arraycurrent = Util.TokenizerString2(currentString, "~~current~~");
			String currentdate = arraycurrent[0];
			String currenttime = arraycurrent[1];
			String logtype = "7";
			if (takisremark == 2) { // 征询
				logtype = "b";
			} else if (handleforwardid > 0) { // 转办
				logtype = "j";
			} else { // 转发
				logtype = "9";
			}
			RequestSignRelevanceWithMe reqsignwm = new RequestSignRelevanceWithMe();
			reqsignwm.inertRelevanceInfo(workflowid + "", requestid + "", currentnodeid + "", logtype, currentdate, currenttime, userid, remark);
		}

		if (takisremark == 2) {
			ArrayList resourceids = new ArrayList();
//			resourceids.add(userid);
//			RequestAddShareInfo requestAddShareInfo = new RequestAddShareInfo();
//			requestAddShareInfo.addShareInfo("" + requestid, resourceids, "false", true, false, true); // 收回被征询人的文档编辑权限
		}

		if (takisremark == 2) {
			// 多个分叉中间点意见征询给同一人时， 需要找到当前所有的节点，判断是否存在意见征询动作
			WFLinkInfo wfLinkinfo = new WFLinkInfo();
			String takNodeIds = wfLinkinfo.getNowNodeids(requestid);
			String taksql = "select id, nodeid from workflow_currentoperator where requestid= " + requestid + " and nodeid in ( " + takNodeIds + ") and userid = " + userid
					+ " and preisremark='1' and takisremark = 2";
			rs.executeSql(taksql);
			RecordSet rs1 = new RecordSet();
			while (rs.next()) {
				int beforwardid = Util.getIntValue(rs.getString("id"));
				int beforwardNodeId = Util.getIntValue(rs.getString("nodeid"));
				rs1.executeSql("select forwardid from workflow_forward where requestid = " + requestid + " and beforwardid = " + beforwardid);
				if (rs1.next()) { // 找到征询人
					int forwardid = Util.getIntValue(rs1.getString("forwardid"));
					String sumBeforWardSql = "select * from workflow_currentoperator where requestid= " + requestid + " and nodeid = " + beforwardNodeId
							+ " and isremark=1 and preisremark='1' and takisremark = 2 and id in (select beforwardid from workflow_forward where requestid=" + requestid + " and forwardid="
							+ forwardid + " and beforwardid<>" + beforwardid + ")";
					rs1.executeSql(sumBeforWardSql);
					if (!rs1.next()) { // 判断是否所有被征询人都已回复
						String uptaksql2 = "update workflow_currentoperator set takisremark=0 where requestid= " + requestid + " and nodeid = " + beforwardNodeId
								+ " and isremark = 0 and takisremark = -2 and id=" + forwardid;
						rs1.executeSql(uptaksql2); // 更改征询人状态从-2改为0
					}
				}
			}
		}

		String isShowPrompt = "true";
		String docFlags = (String) session.getAttribute("requestAdd" + requestid);
		if (docFlags == null || docFlags.equals(""))
			docFlags = "-1";
		if (docFlags.equals("1")) {
			// %>
			// <SCRIPT LANGUAGE="JavaScript">
			// parent.document.location.href="/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid=<%=userid%>&f_weaver_belongto_usertype=<%=usertype%>&nodetypedoc=<%=nodetype%>&requestid=<%=requestid%>&fromoperation=1&updatePoppupFlag=1&isShowPrompt=<%=isShowPrompt%>&src=<%=src%>";
			// </SCRIPT>
		} else {
			// response.sendRedirect("/workflow/request/ViewRequest.jsp?requestid="+requestid+"&fromoperation=1&updatePoppupFlag=1&isShowPrompt="+isShowPrompt+"&src="+src);
			// out.print("<script>wfforward('/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+usertype+"&requestid="+requestid+"&fromoperation=1&updatePoppupFlag=1&isShowPrompt="+isShowPrompt+"&src="+src+"');</script>");
		}
		resultInfo.put("type", ExecuteType.SUCCESS);
		return resultInfo;
	}
}
