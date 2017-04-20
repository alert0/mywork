package com.api.workflow.service;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;

import weaver.common.StringUtil;
import weaver.conn.RecordSet;
import weaver.cpt.util.CptWfUtil;
import weaver.docs.docs.DocCheckInOutUtil;
import weaver.file.FileUpload;
import weaver.general.GCONST;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import weaver.workflow.request.RequestAnnexUpload;
import weaver.workflow.request.RequestDoc;
import weaver.workflow.request.RequestLog;
import weaver.workflow.request.RequestManager;
import weaver.workflow.request.WFUrgerManager;
import weaver.workflow.request.WorkflowIsFreeStartNode;
import weaver.workflow.request.WorkflowRequestMessage;
import weaver.workflow.workflow.RequestForceDrawBack;
import weaver.workflow.workflow.WFManager;
import weaver.workflow.workflow.WfForceDrawBack;
import weaver.workflow.workflow.WfForceOver;
import weaver.workflow.workflow.WfFunctionManageUtil;

import com.api.workflow.util.RequestExecuteType;
import com.api.workflow.util.ServiceUtil;

/**
 * 流程提交接口
 * 
 * @author wuser0326
 * 
 */
public class RequestOperation {

	public Map<String, Object> execute(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		FileUpload fu = new FileUpload(request);
		RequestManager requestManager = new RequestManager();
		Map<String, Object> resultInfo = new HashMap<String, Object>();

		String comemessage  = Util.null2String(request.getParameter("comemessage"));
		String f_weaver_belongto_userid = fu.getParameter("f_weaver_belongto_userid");// 需要增加的代码
		String f_weaver_belongto_usertype = fu.getParameter("f_weaver_belongto_usertype");// 需要增加的代码
		User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);// 需要增加的代码
		String userid = "" + user.getUID();
		String rands[] = Util.TokenizerString2(Util.null2String(fu.getParameter("rand")), "+");
		String rand = "";
		boolean needout = false;
		if (rands.length > 0)
			rand = rands[0];
		if (rands.length > 1)
			needout = true;
		String needoutprint = Util.null2String(fu.getParameter("needoutprint"));// 等于1，代表点的正文

		String src = Util.null2String(fu.getParameter("src"));
		String iscreate = Util.null2String(fu.getParameter("iscreate"));
		int requestid = Util.getIntValue(fu.getParameter("requestid"), -1);
		int workflowid = Util.getIntValue(fu.getParameter("workflowid"), -1);
		String workflowtype = Util.null2String(fu.getParameter("workflowtype"));
		int isremark = Util.getIntValue(fu.getParameter("isremark"), -1);
		int formid = Util.getIntValue(fu.getParameter("formid"), -1);
		int isbill = Util.getIntValue(fu.getParameter("isbill"), -1);
		int billid = Util.getIntValue(fu.getParameter("billid"), -1);
		int nodeid = Util.getIntValue(fu.getParameter("nodeid"), -1);
		String nodetype = Util.null2String(fu.getParameter("nodetype"));
		String requestname = Util.fromScreen3(fu.getParameter("requestname"), user.getLanguage());
		String requestlevel = Util.fromScreen(fu.getParameter("requestlevel"), user.getLanguage());
		String messageType = Util.fromScreen(fu.getParameter("messageType"), user.getLanguage());
		String chatsType = Util.fromScreen(fu.getParameter("chatsType"), user.getLanguage());// 微信提醒(QC:98106)
		String isFromEditDocument = Util.null2String(fu.getParameter("isFromEditDocument"));
		String remark = Util.null2String(fu.getParameter("remark"));

		System.out.println("-------555-----remark:" + remark);

		String method = Util.fromScreen(fu.getParameter("method"), user.getLanguage()); // 作为新建文档时候的参数传递
		String remarkLocation = Util.null2String(fu.getParameter("remarkLocation")); // 签字意见添加位置
		String topage = URLDecoder.decode(Util.null2String(fu.getParameter("topage"))); // 返回的页面

		String submitNodeId = Util.null2String(fu.getParameter("submitNodeId"));

		//
		String isFirstSubmit = Util.null2String(fu.getParameter("isFirstSubmit"));

		String Intervenorid = Util.null2String(fu.getParameter("Intervenorid"));
		int SignType = Util.getIntValue(fu.getParameter("SignType"), 0);
		int enableIntervenor = Util.getIntValue(fu.getParameter("enableIntervenor"), 1);// 是否启用节点及出口附加操作

		int isovertime = Util.getIntValue(fu.getParameter("isovertime"), 0);
		int isagentCreater = Util.getIntValue((String) session.getAttribute(workflowid + "isagent" + user.getUID()));
		int beagenter = Util.getIntValue((String) session.getAttribute(workflowid + "beagenter" + user.getUID()), 0);
		RequestDoc requestDoc = new RequestDoc();
		boolean docFlag = requestDoc.haveDocFiled("" + workflowid, "" + nodeid);
		int urger = Util.getIntValue((String) session.getAttribute(user.getUID() + "_" + requestid + "urger"), 0);
		String isintervenor = Util.null2String((String) session.getAttribute(user.getUID() + "_" + requestid + "isintervenor"));
		if (src.equals("") || workflowid == -1 || formid == -1 || isbill == -1 || nodeid == -1 || nodetype.equals("")) {
			resultInfo.put("type", RequestExecuteType.SEND_PAGE);
			resultInfo.put("sendPage", "/notice/RequestError.jsp");
			return resultInfo;
		}
		boolean IsCanSubmit = "true".equals(session.getAttribute(user.getUID() + "_" + requestid + "IsCanSubmit")) ? true : false;
		boolean coadCanSubmit = "true".equals(session.getAttribute(user.getUID() + "_" + requestid + "coadCanSubmit")) ? true : false;
		boolean IsCanModify = "true".equals(session.getAttribute(user.getUID() + "_" + requestid + "IsCanModify")) ? true : false;
		String IsBeForwardPending = Util.null2String((String) session.getAttribute(user.getUID() + "_" + requestid + "IsBeForwardPending"));
		String coadispending = Util.null2String((String) session.getAttribute(user.getUID() + "_" + requestid + "coadispending"));
		String coadsigntype = Util.null2String((String) session.getAttribute(user.getUID() + "_" + requestid + "coadsigntype"));
		int ispending = -1;
		if (isremark == 7 && coadispending.equals("1")) {
			if (IsBeForwardPending.equals("1")) {
				ispending = 2;
			} else {
				ispending = 1;
			}
		} else if (IsBeForwardPending.equals("1")) {
			ispending = 0;
		}
		int wfcurrrid = Util.getIntValue((String) session.getAttribute(user.getUID() + "_" + requestid + "wfcurrrid"), 0);
		int intervenorright = Util.getIntValue((String) session.getAttribute(user.getUID() + "_" + requestid + "intervenorright"), 0);
		if (src.equals("supervise") || (src.equals("submit") && isremark == 5) || (src.equals("intervenor") && intervenorright > 0)) {
			IsCanSubmit = true;
		}
		session.removeAttribute("errormsgid_" + user.getUID() + "_" + requestid);
		session.removeAttribute("errormsg_" + user.getUID() + "_" + requestid);
		// session 中IsCanSubmit coadCanSubmit 丢失 不能判断是否可以提交，提示流程提交超时，请重新提交
		if (requestid > 0
				&& (StringUtil.isNull(Util.null2String(session.getAttribute(user.getUID() + "_" + requestid + "IsCanSubmit"))) || StringUtil.isNull(Util.null2String(session.getAttribute(user.getUID()
						+ "_" + requestid + "coadCanSubmit"))))) {
			// out.print("<script>"+prefix+"wfforward('/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+f_weaver_belongto_usertype+"&requestid="+requestid+"&message="+WorkflowRequestMessage.WF_REQUEST_ERROR_CODE_03+"');</script>");
			resultInfo.put("messagehtml", getWfSubmitErrorMsgHtml(session,user,WorkflowRequestMessage.WF_REQUEST_ERROR_CODE_03,requestid));
			resultInfo.put("type", RequestExecuteType.FAILD);
			return resultInfo;
		}

		if ((requestid > 0 && (!IsCanSubmit && !coadCanSubmit)) || requestManager.checkNodeOperatorComment(requestid, user.getUID(), nodeid)) {
			if (needoutprint.equals("")) {
				// out.print("<script>"+prefix+"wfforward('/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+f_weaver_belongto_usertype+"&requestid="+requestid+"&message="+WorkflowRequestMessage.WF_REQUEST_ERROR_CODE_02+"');</script>");
				resultInfo.put("messagehtml", getWfSubmitErrorMsgHtml(session,user,WorkflowRequestMessage.WF_REQUEST_ERROR_CODE_02,requestid));
				resultInfo.put("type", RequestExecuteType.FAILD);
			}
			if (method.indexOf("crenew_") > -1) {
				String docId = Util.null2String(fu.getParameter("docValue"));
				session.setAttribute(requestid + "_wfdoc", "/docs/docs/DocEditExt.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype
						+ "&fromFlowDoc=1&topage=" + topage + "&id=" + docId + "&requestid=" + requestid + "&isintervenor=" + isintervenor);
				session.setAttribute(rand + "_wfdoc", "/docs/docs/DocEditExt.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype
						+ "&fromFlowDoc=1&topage=" + topage + "&id=" + docId + "&requestid=" + requestid + "&isintervenor=" + isintervenor);
			}
			return resultInfo;
		}
		String isMultiDoc = Util.null2String(fu.getParameter("isMultiDoc")); // 多文档新建

		requestManager.setIsMultiDoc(isMultiDoc);
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
		requestManager.setSignType(SignType);
		requestManager.setIsFromEditDocument(isFromEditDocument);
		requestManager.setUser(user);
		requestManager.setIsagentCreater(isagentCreater);
		requestManager.setBeAgenter(beagenter);
		requestManager.setIsPending(ispending);
		requestManager.setRequestKey(wfcurrrid);
		requestManager.setCanModify(IsCanModify);
		requestManager.setCoadsigntype(coadsigntype);
		requestManager.setEnableIntervenor(enableIntervenor);// 是否启用节点及出口附加操作
		requestManager.setRemarkLocation(remarkLocation);
		requestManager.setIsFirstSubmit(isFirstSubmit);

		boolean havaChage = false;
		if (docFlag) {
			requestDoc.setUser(user);
			havaChage = requestDoc.haveChage("" + workflowid, "" + requestid, fu); // 如果改变了发文目录
		}
		WFManager wfManager = new WFManager();
		wfManager.setWfid(workflowid);
		wfManager.getWfInfo();
		String isShowChart = Util.null2String(wfManager.getIsShowChart());
		if ("".equals(Util.null2String(messageType))) {
			if ("1".equals(wfManager.getMessageType())) {
				messageType = wfManager.getSmsAlertsType();
			} else {
				messageType = "0";
			}
		}
		// 微信提醒(QC:98106)
		if ("".equals(Util.null2String(chatsType))) {
			if ("1".equals(wfManager.getChatsType())) {
				chatsType = wfManager.getChatsAlertType();
			} else {
				chatsType = "0";
			}
		}
		// add by xhheng @ 2005/01/24 for 消息提醒 Request06
		requestManager.setMessageType(messageType);
		requestManager.setChatsType(chatsType); // 微信提醒(QC:98106)
		boolean savestatus = true;
		if (!"1".equals(isFirstSubmit)) {
			if(isbill == 1 && formid > 0){
				try {
					boolean isTrack = false;
					boolean isStart = false;
					RecordSet recordSet = new RecordSet();
					recordSet.executeSql("select t1.ismodifylog, t2.status from workflow_base t1, workflow_requestbase t2 where t1.id=t2.workflowid and t2.requestid="+requestid);
		            if(recordSet.next()) {
		                isTrack = (recordSet.getString("ismodifylog")!=null && "1".equals(recordSet.getString("ismodifylog")));
		                isStart = (recordSet.getString("status")!=null && !"".equals(recordSet.getString("status")));
		                //System.out.println("isStart="+isStart);
		            }
					 //由于objtype为"1: 节点自动赋值",不为"0 :出口自动赋值"，不用改变除状态外的文档相关信息，故可不用给user、clienIp、src赋值  fanggsh TD5121			
					weaver.workflow.request.RequestCheckAddinRules requestCheckAddinRules = new weaver.workflow.request.RequestCheckAddinRules();
					requestCheckAddinRules.resetParameter();
					//add by cyril on 2008-07-28 for td:8835 事务无法开启查询,只能传入
		            requestCheckAddinRules.setTrack(isTrack);
		            requestCheckAddinRules.setStart(isStart);
		            requestCheckAddinRules.setNodeid(nodeid);
				            //end by cyril on 2008-07-28 for td:8835
					requestCheckAddinRules.setRequestid(requestid);
					requestCheckAddinRules.setWorkflowid(workflowid);
					requestCheckAddinRules.setObjid(nodeid);
					requestCheckAddinRules.setObjtype(1);               // 1: 节点自动赋值 0 :出口自动赋值

					requestCheckAddinRules.setIsbill(isbill);
					requestCheckAddinRules.setFormid(formid);
					requestCheckAddinRules.setIspreadd("0");//xwj for td3130 20051123
					requestCheckAddinRules.setRequestManager(requestManager);
					requestCheckAddinRules.setUser(user);
					requestCheckAddinRules.checkAddinRules();
				} catch (Exception e) {
					response.sendRedirect("/notice/RequestError.jsp");
				}
			}else{
				savestatus = requestManager.saveRequestInfo();
			}
		}
		
		RecordSet rs = new RecordSet();
		rs.execute("select lastOperator,lastOperateDate,lastOperateTime from workflow_Requestbase where requestid = " + requestid);
		if(rs.next()){
			resultInfo.put("lastOperator", Util.null2String(rs.getString("lastOperator")));
			resultInfo.put("lastOperateDate", Util.null2String(rs.getString("lastOperateDate")));
			resultInfo.put("lastOperateTime", Util.null2String(rs.getString("lastOperateTime")));
		}
		
		requestid = requestManager.getRequestid();

		if ("save".equals(src)) {
			session.setAttribute("needwfback_" + user.getUID() + "_" + requestid, (String) fu.getParameter("needwfback"));
		} else if ("submit".equals(src)) {
			String needwfback = Util.null2String((String) fu.getParameter("needwfback"));
			String needwfback_s = Util.null2String((String) session.getAttribute("needwfback_" + user.getUID() + "_" + requestid));
			if ("1".equals(needwfback) && "0".equals(needwfback_s)) {
				requestManager.setNeedwfback("0");
			}
			session.removeAttribute("needwfback_" + user.getUID() + "_" + requestid);
		}
		// 保存失败
		if (!savestatus) {
			if (requestid != 0) {
				String message = requestManager.getMessage();
				if (!"".equals(message)) {

					// if
					// (StringUtil.isNotNull(requestManager.getMessagecontent()))
					// {
					// session.setAttribute("errormsg_" + user.getUID() +
					// "_" + requestid, requestManager.getMessagecontent());
					// }

					// response.sendRedirect("/workflow/request/ViewRequest.jsp?requestid="+requestid+"&message="+message+"&isintervenor="+isintervenor);
					if (needoutprint.equals("")) {
						// out.print("<script>" + prefix +
						// "wfforward('/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid="
						// + userid + "&f_weaver_belongto_usertype=" +
						// f_weaver_belongto_usertype
						// + "&requestid=" + requestid + "&message=" + message +
						// "&isintervenor=" + isintervenor + "');</script>");
					}
					resultInfo.put("messagehtml", getWfSubmitErrorMsgHtml(session,user,message,requestid));
					resultInfo.put("type", RequestExecuteType.FAILD);

					session.setAttribute(requestid + "_wfdoc", "error/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype="
							+ f_weaver_belongto_usertype + "&requestid=" + requestid + "&message=" + message + "&isintervenor=" + isintervenor);
					session.setAttribute(rand + "_wfdoc", "error/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype
							+ "&requestid=" + requestid + "&message=" + message + "&isintervenor=" + isintervenor);
					return resultInfo;
				}

				// System.out.println("&&&&&&&&&209&&&&&&&&&&&&&&&&&&&&user="+user.getUID());
				// response.sendRedirect("/workflow/request/ManageRequest.jsp?requestid="+requestid+"&message=1");
				if (needoutprint.equals("")) {
					// out.print("<script>" + prefix +
					// "wfforward('/workflow/request/ManageRequest.jsp?f_weaver_belongto_userid="
					// + userid + "&f_weaver_belongto_usertype=" +
					// f_weaver_belongto_usertype
					// + "&requestid=" + requestid + "&message=1');</script>");
				}
				resultInfo.put("messagehtml", getWfSubmitErrorMsgHtml(session,user,"1",requestid));
				resultInfo.put("type", RequestExecuteType.FAILD);
				
				session.setAttribute(requestid + "_wfdoc", "error/workflow/request/ManageRequest.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype
						+ "&requestid=" + requestid + "&message=1");
				session.setAttribute(rand + "_wfdoc", "error/workflow/request/ManageRequest.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype
						+ "&requestid=" + requestid + "&message=1");
				return resultInfo;
			} else {
				// System.out.println("&&&&&&&&&&218&&&&&&&&&&&&&&&&&&&user="+user.getUID());
				if (needoutprint.equals("")) {
					// out.print("<script>" + prefix +
					// "wfforward('/workflow/request/RequestView.jsp?f_weaver_belongto_userid="
					// + userid + "&f_weaver_belongto_usertype=" +
					// f_weaver_belongto_usertype
					// + "&message=1');</script>");
					resultInfo.put("messagehtml", getWfSubmitErrorMsgHtml(session,user,"1",requestid));
					resultInfo.put("type", RequestExecuteType.FAILD);

				}
				resultInfo.put("type", RequestExecuteType.SEND_PAGE);
				resultInfo.put("sendPage", "/spa/workflow/index.jsp#/main/workflow/listDoing");
				// response.sendRedirect("/workflow/request/RequestView.jsp?message=1");
				session.setAttribute(requestid + "_wfdoc", "error/workflow/request/ManageRequest.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype
						+ "&requestid=" + requestid + "&message=1");
				session.setAttribute(rand + "_wfdoc", "error/workflow/request/ManageRequest.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype
						+ "&requestid=" + requestid + "&message=1");
				return resultInfo;
			}
		}

		String messageid = requestManager.getMessageid();
		String messagecontent = requestManager.getMessagecontent();
		if (!messageid.equals("") && !messagecontent.equals("")) {
			session.setAttribute(requestid + "_" + messageid, messagecontent);
			// if (needoutprint.equals(""))
			// out.print("<script>"+prefix+"wfforward('/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+f_weaver_belongto_usertype+"&requestid="+requestid+"&message="+messageid+"');</script>");
			resultInfo.put("messagehtml", getWfSubmitErrorMsgHtml(session,user,messageid,requestid));
			resultInfo.put("type", RequestExecuteType.FAILD);
			return resultInfo;
		}

		/** Save Detail end* */
		boolean flowstatus = true;
		if (!"save".equals(src) || isremark != 1) {
			String eh_setoperator = Util.null2String(fu.getParameter("eh_setoperator"));
			if ("n".equals(eh_setoperator)) { // 异常处理窗口未选择操作者，以提交失败处理
				flowstatus = false;
				JSONObject msgjson = new JSONObject();
				String bottom = "<span>" + SystemEnv.getHtmlLabelName(126560, user.getLanguage()) + "，" + SystemEnv.getHtmlLabelName(126554, user.getLanguage())
						+ "<a href=\"javascript:rechoseoperator()\"> " + SystemEnv.getHtmlLabelName(126555, user.getLanguage()) + " </a>" + SystemEnv.getHtmlLabelName(126561, user.getLanguage())
						+ "</span>";
				msgjson.put("details", bottom);
				// requestManager.setMessage(WorkflowRequestMessage.WF_REQUEST_ERROR_CODE_07);
				 requestManager.setMessagecontent(msgjson.toString());
				// resultInfo.put("type", "eh_setoperator_n"); // 重现选择操作者
				resultInfo.put("messagehtml", getWfSubmitErrorMsgHtml(session,user,WorkflowRequestMessage.WF_REQUEST_ERROR_CODE_07,requestid));
				resultInfo.put("type", RequestExecuteType.FAILD);
				return resultInfo;
			} else {
				if ("y".equals(eh_setoperator)) {
					// 异常处理选择了操作者，拼装操作者信息
					requestManager.createEh_operatorMap_pc();
				}
				flowstatus = requestManager.flowNextNode();

				// 出口提示
				if (!flowstatus && (WorkflowRequestMessage.WF_CUSTOM_LINK_TIP).equals(requestManager.getMessage())) {
					String ismode = Util.null2String(fu.getParameter("ismode"));
					String divcontent = Util.null2String(fu.getParameter("divcontent"));
					String content = Util.null2String(fu.getParameter("content"));
					resultInfo.put("divcontent", divcontent);
					resultInfo.put("content", content);

					Map<String, Integer> detailRowPerInfo = new HashMap<String, Integer>();
					Set<String> keyset = requestManager.getNewAddDetailRowPerInfo().keySet();
					Iterator<String> it1 = keyset.iterator();
					while (it1.hasNext()) {
						String rowid = it1.next();
						int rowno = requestManager.getNewAddDetailRowPerInfo().get(rowid);
						detailRowPerInfo.put(rowid, rowno);
						it1.remove();
					}
					resultInfo.put("detailRowPerInfo", detailRowPerInfo);
					resultInfo.put("msgcontent", requestManager.getMessagecontent());
					resultInfo.put("type", RequestExecuteType.WF_LINK_TIP);
					return resultInfo;
				}

				if (!flowstatus && requestManager.isNeedChooseOperator()) { // 流转异常处理，找不到操作者且后台设置了提交至指定人员
					// out.println("<script>");
					// out.println(prefix +
					// "wfforward('/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid="
					// + userid + "&f_weaver_belongto_usertype=" +
					// f_weaver_belongto_usertype
					// + "&requestid=" + requestid +
					// "&needChooseOperator=y');");
					// out.println("</script>");

					resultInfo.put("needChooseOperator", "y");
					resultInfo.put("type", RequestExecuteType.R_CHROSE_OPERATOR);
					return resultInfo;
				}
			}
		} else {
			// 被转发人保存
			RequestLog requestLog = new RequestLog();
			requestLog.setRequest(fu);
			requestLog.saveLog(workflowid, requestid, nodeid, "1", remark, user);
		}

		// add by fanggsh 20060718 for TD4531 begin
		String triggerStatus = (String) session.getAttribute("triggerStatus");
		session.removeAttribute("triggerStatus");

		// 下一节点操作者找不到时， 不能跳转到登陆页面

		// if (!flowstatus && "1".equals(session.getAttribute("istest"))) {
		// session.setAttribute("currequestid", ""+requestid);
		// if (!src.equals("delete")) {
		// 将流程的状态更改为可变出状态， 以便在流程测试删除中找到它
		// TestWorkflowCheck.updateTestWFDeletedStatus(session, iscreate,
		// workflowid, requestid);
		// }
		// }

		if (!flowstatus && triggerStatus != null && triggerStatus.equals("1")) {
			// System.out.println("&&&&&&&&&&261&&&&&&&&&&&&&&&&&&&user="+user.getUID());
			// response.sendRedirect("/workflow/request/ManageRequest.jsp?requestid="+requestid+"&message=3");
			// if(needoutprint.equals(""))
			// out.print("<script>"+prefix+"wfforward('/workflow/request/ManageRequest.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+f_weaver_belongto_usertype+"&requestid="+requestid+"&message=3');</script>");
			// return ;
		}
		// add by fanggsh 20060718 for TD4531 end
		if (!flowstatus) {
			String message = requestManager.getMessage();
			if (!message.equals("")) {
				resultInfo.put("isintervenor", isintervenor);
				resultInfo.put("messagehtml", getWfSubmitErrorMsgHtml(session,user,message,requestid));
				// System.out.println("-vf--269-2222222-f_weaver_belongto_userid------"+f_weaver_belongto_userid);
				// response.sendRedirect("/workflow/request/ViewRequest.jsp?requestid="+requestid+"&message="+message+"&isintervenor="+isintervenor);
				// if(needoutprint.equals(""))
				// out.print("<script>"+prefix+"wfforward('/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+f_weaver_belongto_usertype+"&requestid="+requestid+"&message="+message+"&isintervenor="+isintervenor+"');</script>");
			} else {
				// System.out.println("-vf--269-2222222-f_weaver_belongto_userid------"+f_weaver_belongto_userid);
				// response.sendRedirect("/workflow/request/ManageRequest.jsp?requestid="+requestid+"&message=2");
				// if(needoutprint.equals(""))
				// out.print("<script>"+prefix+"wfforward('/workflow/request/ManageRequest.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+f_weaver_belongto_usertype+"&requestid="+requestid+"&message=2');</script>");
				resultInfo.put("messagehtml", getWfSubmitErrorMsgHtml(session,user,"2",requestid));
			}
			resultInfo.put("type", RequestExecuteType.FAILD);
			return resultInfo;
		}
		
		if("1".equals(comemessage)){
			resultInfo.put("type", RequestExecuteType.SEND_PAGE);
			resultInfo.put("sendPage", "/spa/workflow/index.jsp#/main/workflow/listDoing");
			return resultInfo;
		}

		new Thread(new CptWfUtil(requestManager, "freezeCptnum")).start();
		String fromPDA = Util.null2String((String) session.getAttribute("loginPAD"));
		if (method.equals("")) {
			if (docFlag) {
				DocCheckInOutUtil dcou = new DocCheckInOutUtil();
				dcou.docCheckInWhenRequestOperation(user, requestid, request);
				new RequestDoc().changeDocFiled("" + workflowid, "" + requestid, fu, user.getLanguage(), havaChage); // 如果改变了发文目录
			}
			if (!topage.equals("")) {
				/*
				 * if(topage.indexOf("?")!=-1){
				 * //System.out.println("-vf--335-2222222-f_weaver_belongto_userid------"+f_weaver_belongto_userid);
				 * //response.sendRedirect(topage+"&requestid="+requestid);
				 * if(needoutprint.equals("")) out.print("<script>"+prefix+"wfforward('"+topage+"&f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+f_weaver_belongto_usertype+"&requestid="+requestid+"');</script>");
				 * }else{
				 * //System.out.println("-vf--339-2222222-f_weaver_belongto_userid------"+f_weaver_belongto_userid);
				 * //response.sendRedirect(topage+"?requestid="+requestid);
				 * if(needoutprint.equals("")) out.print("<script>"+prefix+"wfforward('"+topage+"?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+f_weaver_belongto_usertype+"&requestid="+requestid+"');</script>"); }
				 */
			} else {
				if (iscreate.equals("1")) {
				} else {
					if ("delete".equals(src) && savestatus && flowstatus) {
						resultInfo.put("type", RequestExecuteType.DELETE);
						resultInfo.put("label", "20461");
					} else {
						// TD4262 增加提示信息 开始
						// response.sendRedirect("/workflow/request/ViewRequest.jsp?requestid="+requestid+"&fromoperation=1&updatePoppupFlag=1");//td3450
						// xwj 20060207
						String docFlags = Util.null2String((String) session.getAttribute("requestAdd" + requestid)); // 流程建文档相关

						// String isShowPrompt = "true";
						if (docFlags.equals("1")) {
							resultInfo.put("type", RequestExecuteType.SUCCESS);
						} else {
							if (fromPDA.equals("1")) {
								resultInfo.put("type", RequestExecuteType.SUCCESS);
								// response.sendRedirect("/workflow/search/WFSearchResultPDA.jsp?workflowid="+workflowid);
								// if(needoutprint.equals(""))
								// out.print("<script>"+prefix+"wfforward('/workflow/search/WFSearchResultPDA.jsp?workflowid="+workflowid+"');</script>");
							} else {
								// System.out.println("&&&&&&&&&&&&463&&&&&&&&&&&&&&&&&user="+user.getUID());
								// response.sendRedirect("/workflow/request/ViewRequest.jsp?requestid="+requestid+"&fromoperation=1&updatePoppupFlag=1&isShowPrompt="+isShowPrompt+"&src="+src+"&isovertime="+isovertime+"&urger="+urger+"&isintervenor="+isintervenor);//td3450
								// xwj 20060207
								// if(needoutprint.equals(""))
								// out.print("<script>"+prefix+"wfforward('/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+f_weaver_belongto_usertype+"&requestid="+requestid+"&fromoperation=1&updatePoppupFlag=1&isShowPrompt="+isShowPrompt+"&src="+src+"&isovertime="+isovertime+"&urger="+urger+"&isintervenor="+isintervenor+"');</script>");
								resultInfo.put("isShowChart", isShowChart);
								resultInfo.put("type", RequestExecuteType.SUCCESS);
							}
						}
					}
				}
			}
		}
		System.out.println("----------------resultInfo : " + resultInfo.get("type"));

		return resultInfo;
	}
	
	private String getWfSubmitErrorMsgHtml(HttpSession session,User user,String message,int requestid){
		if(user == null) return "";
		String messagecontent = Util.null2String(session.getAttribute("errormsg_"+user.getUID()+"_"+requestid));
		String bottom = "";
		String details = "";
		if(StringUtil.isNotNull(messagecontent)){
			try{
			    JSONObject jo = new JSONObject(messagecontent);
				if(jo.has("details")){
		 			details = Util.null2String(jo.getString("details"));
				}
				
				if(jo.has("bottomprefix")){
				    String bottomprefix =  Util.null2String(jo.getString("bottomprefix"));
					int msgurlparm = jo.getInt("msgurlparm");
					int msgtype = jo.getInt("msgtype");
					bottom = WorkflowRequestMessage.getBottomWorkflowInfo(bottomprefix,msgtype,user,msgurlparm);
				}
			}catch(JSONException e){
			    details = messagecontent;
			}
		}
		StringBuffer resulthtml = new StringBuffer();
		if(StringUtil.isNotNull(message)){
			resulthtml.append("<div class=\"message-box\">");
			resulthtml.append("<table><tr><td valign=\"top\"><div class=\"message-title-icon\"></div></td><td>");
			resulthtml.append("<div class=\"message-content\"><span class=\"message-title\">");
			resulthtml.append(WorkflowRequestMessage.getNewMessageId(message,user.getLanguage()));
			resulthtml.append("</span>");
			
			if(StringUtil.isNotNull(details)){
				resulthtml.append("<div class=\"message-detail\">").append(details).append("</div>");
			}
			
			if(StringUtil.isNotNull(bottom)){
				resulthtml.append("<div class=\"message-bottom\"><span>").append(bottom).append("</span></div>");
			}
			resulthtml.append("</div></td></tr></table></div>");
		}
		
		return resulthtml.toString();
	}

	/**
	 * 查看或管理页面各项功能管理
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public Map<String, Object> wfFunctionManageLink(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> apidatas = new HashMap<String, Object>();

		Map<String, String> resultmap = new HashMap<String, String>();
		String f_weaver_belongto_userid = request.getParameter("f_weaver_belongto_userid");// 需要增加的代码
		String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");// 需要增加的代码
		User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);// 需要增加的代码
		int logintype = Util.getIntValue(user.getLogintype());

		int requestid = Util.getIntValue(request.getParameter("requestid"), 0);
		String flag = Util.null2String(request.getParameter("flag"));
		WfFunctionManageUtil wffmu = new WfFunctionManageUtil();
		ArrayList<String> requestidlist = new ArrayList<String>();

		int formid = Util.getIntValue(request.getParameter("formid"), 0);
		int requestLogId = Util.getIntValue(request.getParameter("workflowRequestLogId"), 0);
		String signdocids = Util.null2String(request.getParameter("signdocids"));
		String signworkflowids = Util.null2String(request.getParameter("signworkflowids"));
		String remark = Util.null2String(request.getParameter("remark"));
		int workflowid = Util.getIntValue(request.getParameter("workflowid"), 0);

		// 流程暂停
		if ("stop".equals(flag)) {
			wffmu.setStopOperation(requestid, user);
		}

		// 流程撤销
		if ("cancel".equals(flag)) {
			wffmu.setCancelOperation(requestid, user);
		}

		// 流程启用
		if ("restart".equals(flag)) {
			wffmu.setRestartOperation(requestid, user);
		}

		// 强制归档
		if ("ov".equals(flag)) {
			WfForceOver wfo = new WfForceOver();
			String annexdocids = "";
			String fromflow = Util.null2String(request.getParameter("fromflow"));
			String remarkLocation = Util.null2String(request.getParameter("remarkLocation"));

			if (fromflow.equals("1")) {
				FileUpload fu = new FileUpload(request);
				f_weaver_belongto_userid = fu.getParameter("f_weaver_belongto_userid");// 需要增加的代码
				f_weaver_belongto_usertype = fu.getParameter("f_weaver_belongto_usertype");// 需要增加的代码
				user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);// 需要增加的代码
				remark = Util.null2String(fu.getParameter("remark"));
				workflowid = Util.getIntValue(fu.getParameter("workflowid"), -1);
				int nodeid = Util.getIntValue(fu.getParameter("nodeid"), -1);

				// 获取签字意见相关文档，相关流程

				signdocids = Util.null2String(fu.getParameter("signdocids"));
				signworkflowids = Util.null2String(fu.getParameter("signworkflowids"));
				String ismode = Util.null2String(request.getParameter("ismode"));
				if (!ismode.equals("1")) {
					RequestAnnexUpload rau = new RequestAnnexUpload();
					rau.setRequest(fu);
					rau.setUser(user);
					annexdocids = rau.AnnexUpload();
				} else {
					String hasSign = "0";// 模板中是否设置了签字
					RecordSet rs = new RecordSet();
					rs.executeSql("select * from workflow_modeview where formid=" + formid + " and nodeid=" + nodeid + " and fieldid=-4");
					if (rs.next())
						hasSign = "1";
					if ("1".equals(hasSign)) {// 模板中设置了签字
						annexdocids = Util.null2String(fu.getParameter("qianzi"));
					} else {// 模板中没有设置签字，按普通方式上传签字意见的附件
						RequestAnnexUpload rau = new RequestAnnexUpload();
						rau.setRequest(fu);
						rau.setUser(user);
						annexdocids = rau.AnnexUpload();
					}
				}
			}

			wfo.setRemark(remark);
			wfo.setAnnexdocids(annexdocids);
			wfo.setSigndocids(signdocids);
			wfo.setSignworkflowids(signworkflowids);
			wfo.setRequestLogId(requestLogId);
			wfo.setRemarkLocation(remarkLocation);

			WFUrgerManager wfum = new WFUrgerManager();
			if (wffmu.haveOtherOperationRight(requestid) && !wfo.isOver(requestid) && (wfo.isNodeOperator(requestid, user.getUID()) || wfum.getMonitorViewRight(requestid, user.getUID()))) {
				requestidlist.add("" + requestid);
				wfo.doForceOver(requestidlist, request, response);
			}
		}

		// 强制收回
		if ("rb".equals(flag)) {
			WfForceDrawBack wfdb = new WfForceDrawBack();
			RequestForceDrawBack requestForceDrawBack = new RequestForceDrawBack();
			if (wffmu.haveOtherOperationRight(requestid) && wfdb.isHavePurview(requestid, user.getUID(), logintype, -1, -1)) {
				requestidlist.add("" + requestid);
				// WfForceDrawBack.doForceDrawBack(requestidsArr, request,
				// response, -1, -1);
				// 使用新的收回方式
				int result = requestForceDrawBack.foreceDrawBack(user, requestid, false, -1, -1);
				if (result == RequestForceDrawBack.OLDDATA) {
					wfdb.doForceDrawBack(requestidlist, request, response, -1, -1);
				}
				releaseNumber(formid, workflowid);
				
				//判断是否可以跳转到新的页面
				
				boolean reqRoute = ServiceUtil.isReqRoute(String.valueOf(requestid),user);
				apidatas.put("reqRoute", reqRoute);
			}
		}
		return apidatas;
	}

	public void releaseNumber(int formid, int workflowid) {
		RecordSet rs = new RecordSet();
		// 这里判断是否是自定义资产的流程，如果是，就撤回
		CptWfUtil cptWfUtil = new CptWfUtil();
		String cptwftype = cptWfUtil.getWftype("" + workflowid);
		if (!"".equals(cptwftype) && !"apply".equalsIgnoreCase(cptwftype)) {
			rs.executeSql("update CptCapital set frozennum = 0 where isdata='2' ");
		} else if (formid == 19 || formid == 201 || formid == 220 || formid == 220) {
			rs.executeSql("update CptCapital set frozennum = 0 where isdata='2' ");
		}

	}

	public Map<String, Object> getRejectInfo(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		// type 0 直接提交 1：设置退回节点 2：自由退回
		if (!"1".equals(GCONST.getWorkflowReturnNode())) {
			apidatas.put("type", "0");
			return apidatas;
		}

		String nodeid = request.getParameter("nodeid");
		String workflowid = request.getParameter("workflowid");
		int requestid = Util.getIntValue(request.getParameter("requestid"), 0);
		String currentnodeid = request.getParameter("currentnodeid");

		String f_weaver_belongto_userid = request.getParameter("f_weaver_belongto_userid");// 需要增加的代码
		String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");// 需要增加的代码
//		User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);// 需要增加的代码

		WorkflowIsFreeStartNode stnode = new WorkflowIsFreeStartNode();
		String nodeidss = stnode.getIsFreeStartNode(nodeid);
		String freedis = stnode.getNodeid(nodeidss);
		String isornotFree = stnode.isornotFree(nodeid);
		RecordSet rs = new RecordSet();

		String isrejectremind = "";
		String ischangrejectnode = "";
		String isselectrejectnode = "";

		rs.executeSql("select a.isTriDiffWorkflow, b.* from workflow_base a, workflow_flownode b where a.id = b.workflowid and a.id=" + workflowid + " and b.nodeid=" + nodeid);
		if (rs.next()) {
			isrejectremind = Util.null2String(rs.getString("isrejectremind"));
			ischangrejectnode = Util.null2String(rs.getString("ischangrejectnode"));
			isselectrejectnode = Util.null2String(rs.getString("isselectrejectnode"));
		}
		String paramurl = "";
		String dialogurl = "";
		if (!freedis.equals("") && !isornotFree.equals("")) {
			String zjclNodeid = stnode.getIsFreeStart01Node("" + nodeid);
//			WFManager wfManager = new WFManager();
//			wfManager.setWfid(Util.getIntValue("" + workflowid));
//			wfManager.getWfInfo();
//			String isFree = wfManager.getIsFree();
//			String freewftype = wfManager.getFreewftype();

//			if ("1".equals(isFree) && "1".equals(freewftype)) {
//				FreeWorkflowSimple freeWorkflowSimple = new FreeWorkflowSimple();
//				zjclNodeid = freeWorkflowSimple.getRejectToNodeId(requestid, Util.getIntValue(nodeid, 0), user);
//			}

			if (freedis.equals("1")) {
				if (isrejectremind.equals("1") && ischangrejectnode.equals("1")) {
					paramurl = "/workflow/request/RejectNodeSetFree.jsp?f_weaver_belongto_userid=" + f_weaver_belongto_userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype
							+ "&isrejecttype=1&requestid=" + requestid + "&workflowid=" + workflowid + "&nodeid=" + currentnodeid + "&isrejectremind=" + isrejectremind + "&ischangrejectnode="
							+ ischangrejectnode + "&isselectrejectnode=" + isselectrejectnode + "&isFreeNode=" + nodeidss;
					dialogurl = "/systeminfo/BrowserMain.jsp?f_weaver_belongto_userid=" + f_weaver_belongto_userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype+"&url=";
				} else {
					apidatas.put("RejectNodes", zjclNodeid);
					apidatas.put("RejectToNodeid", zjclNodeid);
					apidatas.put("type", "1");
					return apidatas;
				}
			} else {// 自由退回
				paramurl = "/workflow/request/RejectNodeSetFree.jsp?f_weaver_belongto_userid=" + f_weaver_belongto_userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype + "&requestid="
						+ requestid + "&workflowid=" + workflowid + "&nodeid=" + currentnodeid + "&isrejectremind=" + isrejectremind + "&ischangrejectnode=" + ischangrejectnode
						+ "&isselectrejectnode=" + isselectrejectnode + "&isFreeNode=" + nodeidss;
				dialogurl = "/systeminfo/BrowserMain.jsp?f_weaver_belongto_userid=" + f_weaver_belongto_userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype+"&url=";
			}
		} else {
			if ((isrejectremind.equals("1") && ischangrejectnode.equals("1")) || isselectrejectnode.equals("1") || "2".equals(isselectrejectnode)) {
				paramurl = "/workflow/request/RejectNodeSet.jsp?f_weaver_belongto_userid=" + f_weaver_belongto_userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype + "&requestid="
						+ requestid + "&workflowid=" + workflowid + "&nodeid=" + currentnodeid + "&isrejectremind=" + isrejectremind + "&ischangrejectnode=" + ischangrejectnode
						+ "&isselectrejectnode=" + isselectrejectnode;
				dialogurl = "/systeminfo/BrowserMain.jsp?f_weaver_belongto_userid="+f_weaver_belongto_userid+"&f_weaver_belongto_usertype="+f_weaver_belongto_usertype+"&url=";
			} else {
				apidatas.put("type", "0");
				return apidatas;
			}
		}
		apidatas.put("paramurl", paramurl);
		apidatas.put("dialogurl", dialogurl);
		apidatas.put("type", "2");
		return apidatas;
	}
}
