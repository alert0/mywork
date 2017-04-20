package com.api.workflow.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import weaver.conn.RecordSet;
import weaver.file.Prop;
import weaver.general.GCONST;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.rdeploy.portal.PortalUtil;
import weaver.rtx.RTXConfig;
import weaver.systeminfo.SystemEnv;
import weaver.wechat.util.WechatPropConfig;
import weaver.workflow.request.RequestCheckUser;
import weaver.workflow.request.RequestDetailImport;
import weaver.workflow.request.SubWorkflowTriggerService;
import weaver.workflow.request.WFForwardManager;
import weaver.workflow.request.WFLinkInfo;
import weaver.workflow.request.WorkflowIsFreeStartNode;
import weaver.workflow.workflow.WFManager;
import weaver.workflow.workflow.WfForceDrawBack;
import weaver.workflow.workflow.WfForceOver;
import weaver.workflow.workflow.WfFunctionManageUtil;
import weaver.workflow.workflow.WorkflowComInfo;
import weaver.workflow.workflow.WorkflowVersion;

import com.api.workflow.bean.RightMenu;
import com.api.workflow.util.RequestMenuType;
import com.api.workflow.util.RequestType;

/**
 * 右键菜单
 * @author jhy Apr 18, 2017
 *
 */
public class RequestRightMenuService {
	
	private HttpServletRequest request;
	private HttpServletResponse response;
	private HttpSession session;
	private List<RightMenu> rightMenus;
	private User user;
	private int userid;
	private int usertype = 0;
	private String logintype;
	private int requestid;
	private int workflowid = 0; // 工作流id
	
	public RequestRightMenuService(HttpServletRequest request,HttpServletResponse response){
		this.request = request;
		this.response = response;
		String f_weaver_belongto_userid = request.getParameter("f_weaver_belongto_userid");
		String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");
		user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
		userid = user.getUID();
		usertype = "2".equals(user.getLogintype()) ? 1 : 0;
		logintype = user.getLogintype();
		session = request.getSession();
		requestid = Util.getIntValue(request.getParameter("requestid"), -1);
		workflowid = Util.getIntValue(request.getParameter("workflowid"),0);
	}

	public Map<String, Object> getRightMenu() throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		rightMenus = new ArrayList<RightMenu>();
		int requestType = Util.getIntValue(request.getParameter("requestType"));
		if(requestType == RequestType.CREATE_REQ.getId()){
			loadCreateFormRightMenu(apidatas);
		}else if(requestType == RequestType.MANAGE_REQ.getId()){
			loadManageRightMenu(apidatas);
		}else if(requestType == RequestType.VIEW_REQ.getId()){
			loadViewRightMenu(apidatas);
		}
		return apidatas;
	}
	
	/**
	 * 加载已办页面右键菜单
	 * 
	 * @throws Exception
	 */
	private void loadViewRightMenu(Map<String, Object> resultDatas) throws Exception {
		RecordSet recordSet = new RecordSet();
		String isrequest = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "isrequest"));
		int intervenorright = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "intervenorright"), 0);

		int preisremark = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "preisremark"), -1);
		String coadsigntype = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "coadsigntype"));
		int wfcurrrid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "wfcurrrid"), 0);
		boolean canForwd = "true".equals(Util.null2String((String) session.getAttribute(userid + "_" + requestid + "canForwd")));
		String IsSubmitForward = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsSubmitForward"));
		String IsAlreadyForward = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsAlreadyForward"));
		String IsBeForward = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsBeForward"));

		WfFunctionManageUtil wfFunctionManageUtil = new WfFunctionManageUtil();
		String isremarkForRM = Util.null2String(session.getAttribute(userid + "_" + requestid + "isremarkForRM"));

		int workflowid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "workflowid"), 0);
		int nodeid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "nodeid"), 0);
		String nodetype = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "nodetype"));
		int currentnodeid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "currentnodeid"), 0);
		String currentnodetype = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "currentnodetype"));
		int creater = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "creater"), 0);
		String isModifyLog = Util.null2String(session.getAttribute(userid + "_" + requestid + "isModifyLog"));
		int currentstatus = Util.getIntValue(Util.null2String(session.getAttribute(userid + "_" + requestid + "currentstatus")));

		boolean canview = "true".equals(session.getAttribute(userid + "_" + requestid + "canview"));
		boolean isurger = "true".equals(session.getAttribute(userid + "_" + requestid + "isurger"));
		boolean wfmonitor = "true".equals(session.getAttribute(userid + "_" + requestid + "wfmonitor"));
		boolean haveBackright = "true".equals(session.getAttribute(userid + "_" + requestid + "haveBackright")); // 强制收回权限

		String sqlselectName = "select * from workflow_nodecustomrcmenu where wfid=" + workflowid + " and nodeid=" + nodeid;
		String sqlselectNewName = "select * from workflow_nodeCustomNewMenu where enable = 1 and wfid=" + workflowid + " and nodeid=" + nodeid + " order by menuType, id";
		if (!"0".equals(isremarkForRM)) {
			recordSet.executeSql("select nodeid from workflow_currentoperator c where c.requestid=" + requestid + " and c.userid=" + userid + " and c.usertype=" + usertype + " and c.isremark='"
					+ isremarkForRM + "' ");
			int tmpnodeid = 0;
			if (recordSet.next()) {
				tmpnodeid = Util.getIntValue(recordSet.getString("nodeid"), 0);
			}
			sqlselectName = "select * from workflow_nodecustomrcmenu where wfid=" + workflowid + " and nodeid=" + tmpnodeid;
			sqlselectNewName = "select * from workflow_nodeCustomNewMenu where enable = 1 and wfid=" + workflowid + " and nodeid=" + tmpnodeid + " order by menuType, id";
		}

		recordSet.executeSql(sqlselectName);
		String forwardName = "";
		String takingopinionsName = ""; // 征求意见
		String HandleForwardName = ""; // 转办
		String newWFName = "";// 新建流程按钮
		String newSMSName = "";// 新建短信按钮
		String ccsubnobackName = "";// 抄送批注不需反馈
		String haswfrm = "";// 是否使用新建流程按钮
		String hassmsrm = "";// 是否使用新建短信按钮
		// 微信提醒(QC:98106)
		String newCHATSName = "";// 新建微信按钮
		String haschats = "";// 是否使用新建微信按钮
		// 微信提醒(QC:98106)
		String hasccnoback = "";// 使用抄送批注不需反馈按钮
		int t_workflowid = 0;// 新建流程的ID
		if (recordSet.next()) {
			if (user.getLanguage() == 7) {
				forwardName = Util.null2String(recordSet.getString("forwardName7"));
				newWFName = Util.null2String(recordSet.getString("newWFName7"));
				newSMSName = Util.null2String(recordSet.getString("newSMSName7"));
				newCHATSName = Util.null2String(recordSet.getString("newCHATSName7")); // 微信提醒(QC:98106)
				ccsubnobackName = Util.null2String(recordSet.getString("ccsubnobackName7"));
			} else if (user.getLanguage() == 9) {
				forwardName = Util.null2String(recordSet.getString("forwardName9"));
				newWFName = Util.null2String(recordSet.getString("newWFName9"));
				newSMSName = Util.null2String(recordSet.getString("newSMSName9"));
				newCHATSName = Util.null2String(recordSet.getString("newCHATSName9")); // 微信提醒(QC:98106)
				ccsubnobackName = Util.null2String(recordSet.getString("ccsubnobackName9"));
			} else {
				forwardName = Util.null2String(recordSet.getString("forwardName8"));
				newWFName = Util.null2String(recordSet.getString("newWFName8"));
				newSMSName = Util.null2String(recordSet.getString("newSMSName8"));
				newCHATSName = Util.null2String(recordSet.getString("newCHATSName8")); // 微信提醒(QC:98106)
				ccsubnobackName = Util.null2String(recordSet.getString("ccsubnobackName8"));
			}
			haschats = Util.null2String(recordSet.getString("haschats"));// 微信提醒(QC:98106)
			haswfrm = Util.null2String(recordSet.getString("haswfrm"));
			hassmsrm = Util.null2String(recordSet.getString("hassmsrm"));
			hasccnoback = Util.null2String(recordSet.getString("hasccnoback"));
			t_workflowid = Util.getIntValue(recordSet.getString("workflowid"), 0);
		}
		// TODO E9新功能
		// try {
		// recordSet.executeSql("select * from SystemCustomMenuSet");
		// if (recordSet.next()) {
		// if ("".equals(forwardName)) {
		// forwardName =
		// Util.processBody(Util.null2String(recordSet.getString("forwardName")).trim(),
		// "" + user.getLanguage());
		// }
		// }
		// } catch (Exception e) {
		// e.printStackTrace();
		// }

		if ("".equals(forwardName))
			forwardName = SystemEnv.getHtmlLabelName(6011, user.getLanguage());

		if ("".equals(takingopinionsName))
			takingopinionsName = SystemEnv.getHtmlLabelName(82578, user.getLanguage());

		if ("".equals(HandleForwardName))
			HandleForwardName = SystemEnv.getHtmlLabelName(23745, user.getLanguage());

		if ("".equals(ccsubnobackName))
			ccsubnobackName = SystemEnv.getHtmlLabelName(615, user.getLanguage()) + "（" + SystemEnv.getHtmlLabelName(21762, user.getLanguage()) + "）";

		boolean _iscanforward = false;
		HashMap map = wfFunctionManageUtil.wfFunctionManageByNodeid(workflowid, currentnodeid);
		String rb = (String) map.get("rb");

		boolean haveStopright = wfFunctionManageUtil.haveStopright(currentstatus, creater, user, currentnodetype, requestid, false);// 流程不为暂停或者撤销状态，当前用户为流程发起人或者系统管理员，并且流程状态不为创建和归档
		boolean haveCancelright = wfFunctionManageUtil.haveCancelright(currentstatus, creater, user, currentnodetype, requestid, false);// 流程不为撤销状态，当前用户为流程发起人，并且流程状态不为创建和归档
		boolean haveRestartright = wfFunctionManageUtil.haveRestartright(currentstatus, creater, user, currentnodetype, requestid, false);// 流程为暂停或者撤销状态，当前用户为系统管理员，并且流程状态不为创建和归档

		WfForceDrawBack wfForceDrawBack = new WfForceDrawBack();
		haveBackright = wfForceDrawBack.checkOperatorIsremark(requestid, userid, usertype, preisremark, coadsigntype) && !"0".equals(rb)
				&& wfForceDrawBack.isHavePurview(requestid, userid, Integer.parseInt(logintype), -1, -1);
		if (intervenorright > 0) {
			rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(615, user.getLanguage()),RequestMenuType.BTN_DOINTERVENOR,"doIntervenor()","icon-Right-menu-Trigger-process"));
		} else {
			if ((preisremark != 8 || (preisremark == 8 && isremarkForRM.equals("2"))) && !wfmonitor) {
				if (isurger) {
					rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(21223, user.getLanguage()),RequestMenuType.BTN_SUPERVISE,"doSupervise()", "icon-Right-menu-Supervise"));
				} else {
					// 代理人的preisremark=2的情况
					String agenttypetmp = "0";
					recordSet.executeSql("SELECT * FROM workflow_currentoperator where id=" + wfcurrrid);
					if (recordSet.next())
						agenttypetmp = recordSet.getString("AGENTTYPE");
					if (((preisremark == 1 && canForwd)
							|| (currentnodetype.equals("3") && !haveRestartright && IsSubmitForward.equals("1") && (preisremark == 0 || preisremark == 8 || preisremark == 9 || preisremark == 4))
							|| (currentnodetype.equals("3") && !haveRestartright && IsSubmitForward.equals("1") && preisremark == 2 && agenttypetmp.equals("1")) || (!currentnodetype.equals("3")
							&& IsAlreadyForward.equals("1") && (preisremark == 0 || preisremark == 8 || preisremark == 9)))
							&& !"1".equals(session.getAttribute("istest"))) {
						rightMenus.add(new RightMenu(forwardName,RequestMenuType.BTN_FORWARD,"doReviewE9()", "icon-Right-menu-Turn-to-do"));
						_iscanforward = true;
					}

					if (haveBackright) {
						rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(18359, user.getLanguage()),RequestMenuType.BTN_DORETRACT,"doRetract()", "icon-Right-menu-Forcible"));
					}
				}
			} else if (preisremark == 8 && !wfmonitor) {// 抄送不需要提交也有转发按钮TD9144
				if (!haveRestartright && ((IsSubmitForward.equals("1") && (preisremark == 0 || preisremark == 8 || preisremark == 9)) || (IsBeForward.equals("1") && preisremark == 1)) && canview
						&& !isrequest.equals("1") && isurger == false && !"1".equals(session.getAttribute("istest"))) {
					rightMenus.add(new RightMenu(forwardName,RequestMenuType.BTN_FORWARD,"doReviewE9()", "icon-Right-menu-Turn-to-do"));
					_iscanforward = true;
				}
			}
			if (haveStopright)
				rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(20387, user.getLanguage()),RequestMenuType.BTN_END,"doStop()", "icon-Right-menu-suspend"));

			if (haveCancelright)
				rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(16210, user.getLanguage()),RequestMenuType.BTN_BACKSUBSCRIBLE,"doCancel()", "icon-Right-menu-Revoke"));
			if (isModifyLog.equals("1") && preisremark > -1 && !isurger) // TD10126
				rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(21625, user.getLanguage()),RequestMenuType.BTN_DOVIEWMODIFYLOG,"doViewModifyLog()", "icon-Right-menu-Journal"));
			if (!isurger && !wfmonitor)
				this.loadWXRemindMenu(recordSet, sqlselectNewName, newWFName, newSMSName, newCHATSName, t_workflowid,nodeid);
		}
		if (haveRestartright)
			rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(18095, user.getLanguage()),RequestMenuType.BTN_NEXT,"doRestart()", "icon-Right-menu-Enable"));
		String ismode = Util.null2String(request.getParameter("ismode"));
		int toexcel = Util.getIntValue(Util.null2String(request.getParameter("toexcel")), 0);
		int modeid = Util.getIntValue(Util.null2String(request.getParameter("modeid")), 0);

		if (modeid > 0 && "1".equals(ismode) && toexcel == 1) {
			rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(17416, user.getLanguage()),RequestMenuType.BTN_EXCEL,"ToExcel()", "icon-Right-menu-export"));
		}

		// 不是转发/抄送并且是归档节点
		if (!"1".equals(isremarkForRM) && !"8".equals(isremarkForRM) && !"9".equals(isremarkForRM) && preisremark != 1 && preisremark != 8 && preisremark != 9 && "3".equals(nodetype)) {
			List<Map<String, String>> buttons = SubWorkflowTriggerService.getManualTriggerButtons(workflowid, nodeid);
			for (int indexId = 0; indexId < buttons.size(); indexId++) {
				Map<String, String> button = buttons.get(indexId);
				int subwfSetId = Util.getIntValue(button.get("subwfSetId"), 0);
				String triSubwfName7 = Util.null2String(button.get("triSubwfName7"));
				String triSubwfName8 = Util.null2String(button.get("triSubwfName8"));
				String workflowNames = Util.null2String(button.get("workflowNames"));
				String triSubwfName = "";
				if (user.getLanguage() == 8) {
					triSubwfName = triSubwfName8;
				} else {
					triSubwfName = triSubwfName7;
				}
				if (triSubwfName.equals("")) {
					triSubwfName = SystemEnv.getHtmlLabelName(22064, user.getLanguage()) + (indexId + 1);
				}
				rightMenus.add(new RightMenu(triSubwfName,RequestMenuType.BTN_RELATECWORK,"triSubwf2(" + subwfSetId + ",'" + workflowNames + "')", "icon-Right-menu-Trigger-process"));
			}
		}
		rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(257, user.getLanguage()),RequestMenuType.BTN_PRINT,"openSignPrint()", "icon-Right-menu-Print-log"));
		String iswfshare = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "iswfshare"));
		if (!"1".equals(iswfshare))
			rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(21533, user.getLanguage()),RequestMenuType.BTN_COLLECT,"doPrintViewLog()", "icon-Right-menu-Print-log2"));

		if (WorkflowVersion.hasVersion(workflowid + ""))
			rightMenus.add(new RightMenu(WorkflowVersion.getAboutButtonName(user),RequestMenuType.BTN_VERSION,"aboutVersion(" + WorkflowVersion.getVersionID(workflowid + "") + ")", "icon-form-Not-submitted"));

		if (weaver.workrelate.util.TransUtil.istask()) {
			rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(15266, user.getLanguage()),RequestMenuType.BTN_DEFAULT,"doCreateTask()", "icon-Right-menu-New-Flow"));
			rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(124912, user.getLanguage()),RequestMenuType.BTN_DEFAULT,"openTaskList()", "icon-Right-menu-task-list"));
		}

		resultDatas.put("forward", _iscanforward ? "1" : "0");
		resultDatas.put("rightMenus", rightMenus);
	}


	/**
	 * 加载待办页面右键菜单
	 * 
	 * @throws Exception
	 */
	private void loadManageRightMenu(Map<String, Object> resultDatas) throws Exception {
		RecordSet recordSet = new RecordSet();
		int isremark = -1;

		WfFunctionManageUtil wfFunctionManageUtil = new WfFunctionManageUtil();
		WFLinkInfo wfLinkInfo = new WFLinkInfo();

		int userid = user.getUID();
		Prop prop = Prop.getInstance();
		String ifchangstatus = Util.null2String(prop.getPropValue(GCONST.getConfigFile(), "ecology.changestatus"));
		String submitname = ""; // 提交按钮的名称 : 创建, 审批, 实现
		String forwardName = "";// 转发
		String takingopinionsName = ""; // 征求意见
		String HandleForwardName = ""; // 转办
		String forhandName = ""; // 转办提交
		String forhandbackName = ""; // 转办需反馈
		String forhandnobackName = ""; // 转办不需反馈
		String givingopinionsName = ""; // 回复
		String givingOpinionsnobackName = ""; // 回复不反馈
		String givingOpinionsbackName = ""; // 回复需反馈

		String saveName = "";// 保存
		String rejectName = "";// 退回
		String forsubName = "";// 转发提交
		String ccsubName = "";// 抄送提交
		String newWFName = "";// 新建流程按钮
		String newSMSName = "";// 新建短信按钮
		int t_workflowid = 0;// 新建流程的ID
		String subnobackName = "";// 提交不需反馈
		String subbackName = "";// 提交需反馈
		String hasnoback = "";// 使用提交不需反馈按钮
		String hasback = "";// 使用提交需反馈按钮
		String forsubnobackName = "";// 转发批注不需反馈
		String forsubbackName = "";// 转发批注需反馈
		String hasfornoback = "";// 使用转发批注不需反馈按钮
		String hasforback = "";// 使用转发批注需反馈按钮
		String ccsubnobackName = "";// 抄送批注不需反馈
		String ccsubbackName = "";// 抄送批注需反馈
		String hasccnoback = "";// 使用抄送批注不需反馈按钮
		String hasccback = "";// 使用抄送批注需反馈按钮
		String newOverTimeName = ""; // 超时设置按钮
		String hasovertime = ""; // 是否使用超时设置按钮
		String newCHATSName = "";// 新建微信按钮 (QC:98106)

		String hasforhandback = ""; // 是否转办反馈
		String hasforhandnoback = ""; // 是否转办不需反馈
		String hastakingOpinionsback = ""; // 是否回复反馈
		String hastakingOpinionsnoback = "";// 是否回复不需反馈
		String isSubmitDirect = ""; // 是否启用提交至退回节点
		String submitDirectName = ""; // 提交至退回节点按钮名称
		int subbackCtrl = 0;
		int forhandbackCtrl = 0;
		int forsubbackCtrl = 0;
		int ccsubbackCtrl = 0;
		int takingOpinionsbackCtrl = 0;

		boolean haveBackright = false; // 强制收回权限
		boolean haveOverright = false; // 强制归档权限

		int creater = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "creater"), 0);
		String currentnodetype = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "currentnodetype"));
		int currentstatus = Util.getIntValue(Util.null2String(session.getAttribute(userid + "_" + requestid + "currentstatus")));

		boolean haveStopright = wfFunctionManageUtil.haveStopright(currentstatus, creater, user, currentnodetype, requestid, false);// 流程不为暂停或者撤销状态，当前用户为流程发起人或者系统管理员，并且流程状态不为创建和归档
		boolean haveCancelright = wfFunctionManageUtil.haveCancelright(currentstatus, creater, user, currentnodetype, requestid, false);// 流程不为撤销状态，当前用户为流程发起人，并且流程状态不为创建和归档
		boolean haveRestartright = wfFunctionManageUtil.haveRestartright(currentstatus, creater, user, currentnodetype, requestid, false);// 流程为暂停或者撤销状态，当前用户为系统管理员，并且流程状态不为创建和归档

		boolean isfromtab = Util.null2String(request.getParameter("isfromtab")).equals("true");

		boolean IsCanSubmit = "true".equals(session.getAttribute(userid + "_" + requestid + "IsCanSubmit"));
		boolean IsFreeWorkflow = "true".equals(session.getAttribute(userid + "_" + requestid + "IsFreeWorkflow"));
		boolean isImportDetail = "true".equals(session.getAttribute(userid + "_" + requestid + "isImportDetail"));
		boolean IsCanModify = "true".equals(session.getAttribute(userid + "_" + requestid + "IsCanModify"));
		boolean coadCanSubmit = "true".equals(session.getAttribute(userid + "_" + requestid + "coadCanSubmit"));
		boolean isMainSubmitted = "true".equals(session.getAttribute(userid + "_" + requestid + "isMainSubmitted"));

		String IsPendingForward = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsPendingForward"));
		String IsTakingOpinions = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsTakingOpinions"));
		String IsHandleForward = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsHandleForward"));
		String IsBeForward = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsBeForward"));
		String IsBeForwardTodo = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsBeForwardTodo"));
		String IsBeForwardAlready = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsBeForwardAlready")); // 已办转发
		String IsBeForwardSubmitAlready = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsBeForwardSubmitAlready"));
		String IsBeForwardSubmitNotaries = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsBeForwardSubmitNotaries"));
		String IsFromWFRemark_T = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "IsFromWFRemark_T"));

		workflowid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "workflowid"), 0);
		int nodeid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "nodeid"), 0);
		String nodetype = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "nodetype"));
		int currentnodeid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "currentnodeid"), 0);
		String coadsigntype = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "coadsigntype"));

		String isaffirmance = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "isaffirmance"));
		String reEdit = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "reEdit"));
		String isModifyLog = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "isModifyLog"));

		String isreject = "";
		String isreopen = "";
		recordSet.executeProc("workflow_Nodebase_SelectByID", nodeid + "");
		if (recordSet.next()) {
			isreject = Util.null2String(recordSet.getString("isreject"));
			isreopen = Util.null2String(recordSet.getString("isreopen"));
		}

		// 判断是不是创建保存

		// 记录查看日志
		WorkflowIsFreeStartNode stnode = new WorkflowIsFreeStartNode();
		String isornotFree = stnode.isornotFree("" + nodeid);
		boolean iscreate = stnode.IScreateNode("" + requestid);
		String nodeidss = stnode.getIsFreeStartNode("" + nodeid);
		String freedis = stnode.getNodeid(nodeidss);

		WFManager wfManager = new WFManager();
		wfManager.setWfid(Util.getIntValue("" + workflowid));
		wfManager.getWfInfo();
		String isFree = wfManager.getIsFree();
		// String freewftype = wfManager.getFreewftype(); //自由流程的模式，1：简易模式，2：高级模
		if (!isornotFree.equals("") && !freedis.equals("") && !iscreate && (!"1".equals(isFree) || !"2".equals(nodetype))) {
			isreject = "1";
		}

		String FreeWorkflowname = "";
		recordSet.executeSql("select IsPendingForward,IsTakingOpinions,IsHandleForward,freewfsetcurnameen,freewfsetcurnametw,freewfsetcurnamecn from workflow_flownode where workflowid=" + workflowid
				+ " and nodeid=" + nodeid);
		if (recordSet.next()) {
			IsPendingForward = Util.null2String(recordSet.getString("IsPendingForward"));
			IsTakingOpinions = Util.null2String(recordSet.getString("IsTakingOpinions"));
			IsHandleForward = Util.null2String(recordSet.getString("IsHandleForward"));

			if (user.getLanguage() == 8) {
				FreeWorkflowname = Util.null2String(recordSet.getString("freewfsetcurnameen"));
			} else if (user.getLanguage() == 9) {
				FreeWorkflowname = Util.null2String(recordSet.getString("freewfsetcurnametw"));
			} else {
				FreeWorkflowname = Util.null2String(recordSet.getString("freewfsetcurnamecn"));
			}
		}
		if ("".equals(FreeWorkflowname.trim())) {
			FreeWorkflowname = SystemEnv.getHtmlLabelName(21781, user.getLanguage());
		}
		int takisremark = 0;
		recordSet.executeSql("select * from workflow_currentoperator where (isremark<8 or isremark>8) and requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype
				+ " order by isremark,islasttimes desc");
		while (recordSet.next()) {
			int tempisremark = Util.getIntValue(recordSet.getString("isremark"), 0);
			takisremark = Util.getIntValue(recordSet.getString("takisremark"), 0);
			int tmpnodeid = Util.getIntValue(recordSet.getString("nodeid"));
			if (tempisremark == 0 || tempisremark == 1 || tempisremark == 5 || tempisremark == 9 || tempisremark == 7) { // 当前操作者或被转发者
				isremark = tempisremark;
				nodeid = tmpnodeid;
				nodetype = wfLinkInfo.getNodeType(nodeid);
				break;
			}
		}

		String sqlselectName = "select * from workflow_nodecustomrcmenu where wfid=" + workflowid + " and nodeid=" + nodeid;
		String sqlselectNewName = "select * from workflow_nodeCustomNewMenu where enable = 1 and wfid=" + workflowid + " and nodeid=" + nodeid + " order by menuType, id";
		if (isremark != 0) {
			recordSet.executeSql("select nodeid from workflow_currentoperator c where c.requestid=" + requestid + " and c.userid=" + user.getUID() + " and c.usertype=" + usertype
					+ " and c.isremark='" + isremark + "' ");
			String tmpnodeid = "";
			if (recordSet.next()) {
				tmpnodeid = Util.null2String(recordSet.getString("nodeid"));
			}
			sqlselectName = "select * from workflow_nodecustomrcmenu where wfid=" + workflowid + " and nodeid=" + tmpnodeid;
			sqlselectNewName = "select * from workflow_nodeCustomNewMenu where enable = 1 and wfid=" + workflowid + " and nodeid=" + tmpnodeid + " order by menuType, id";
		}

		recordSet.executeSql(sqlselectName);

		if (recordSet.next()) {
			if (user.getLanguage() == 7) {
				submitname = Util.null2String(recordSet.getString("submitname7"));
				forwardName = Util.null2String(recordSet.getString("forwardName7"));

				takingopinionsName = Util.null2String(recordSet.getString("takingOpName7"));
				HandleForwardName = Util.null2String(recordSet.getString("forhandName7"));
				forhandnobackName = Util.null2String(recordSet.getString("forhandnobackName7"));
				forhandbackName = Util.null2String(recordSet.getString("forhandbackName7"));
				givingopinionsName = Util.null2String(recordSet.getString("takingOpinionsName7"));
				givingOpinionsnobackName = Util.null2String(recordSet.getString("takingOpinionsnobackName7"));
				givingOpinionsbackName = Util.null2String(recordSet.getString("takingOpinionsbackName7"));

				saveName = Util.null2String(recordSet.getString("saveName7"));
				rejectName = Util.null2String(recordSet.getString("rejectName7"));
				forsubName = Util.null2String(recordSet.getString("forsubName7"));
				ccsubName = Util.null2String(recordSet.getString("ccsubName7"));
				newWFName = Util.null2String(recordSet.getString("newWFName7"));
				newSMSName = Util.null2String(recordSet.getString("newSMSName7"));
				newCHATSName = Util.null2String(recordSet.getString("newCHATSName7")); // 微信提醒(QC:98106)
				subnobackName = Util.null2String(recordSet.getString("subnobackName7"));
				subbackName = Util.null2String(recordSet.getString("subbackName7"));
				forsubnobackName = Util.null2String(recordSet.getString("forsubnobackName7"));
				forsubbackName = Util.null2String(recordSet.getString("forsubbackName7"));
				ccsubnobackName = Util.null2String(recordSet.getString("ccsubnobackName7"));
				ccsubbackName = Util.null2String(recordSet.getString("ccsubbackName7"));
				newOverTimeName = Util.null2String(recordSet.getString("newOverTimeName7"));
				submitDirectName = Util.null2String(recordSet.getString("submitDirectName7"));
			} else if (user.getLanguage() == 9) {
				submitname = Util.null2String(recordSet.getString("submitname9"));
				forwardName = Util.null2String(recordSet.getString("forwardName9"));

				takingopinionsName = Util.null2String(recordSet.getString("takingOpName9"));
				HandleForwardName = Util.null2String(recordSet.getString("forhandName9"));
				forhandnobackName = Util.null2String(recordSet.getString("forhandnobackName9"));
				forhandbackName = Util.null2String(recordSet.getString("forhandbackName9"));
				givingopinionsName = Util.null2String(recordSet.getString("takingOpinionsName9"));
				givingOpinionsnobackName = Util.null2String(recordSet.getString("takingOpinionsnobackName9"));
				givingOpinionsbackName = Util.null2String(recordSet.getString("takingOpinionsbackName9"));

				saveName = Util.null2String(recordSet.getString("saveName9"));
				rejectName = Util.null2String(recordSet.getString("rejectName9"));
				forsubName = Util.null2String(recordSet.getString("forsubName9"));
				ccsubName = Util.null2String(recordSet.getString("ccsubName9"));
				newWFName = Util.null2String(recordSet.getString("newWFName9"));
				newSMSName = Util.null2String(recordSet.getString("newSMSName9"));
				newCHATSName = Util.null2String(recordSet.getString("newCHATSName9")); // 微信提醒(QC:98106)
				subnobackName = Util.null2String(recordSet.getString("subnobackName9"));
				subbackName = Util.null2String(recordSet.getString("subbackName9"));
				forsubnobackName = Util.null2String(recordSet.getString("forsubnobackName9"));
				forsubbackName = Util.null2String(recordSet.getString("forsubbackName9"));
				ccsubnobackName = Util.null2String(recordSet.getString("ccsubnobackName9"));
				ccsubbackName = Util.null2String(recordSet.getString("ccsubbackName9"));
				newOverTimeName = Util.null2String(recordSet.getString("newOverTimeName9"));
				submitDirectName = Util.null2String(recordSet.getString("submitDirectName9"));
			} else {
				submitname = Util.null2String(recordSet.getString("submitname8"));
				forwardName = Util.null2String(recordSet.getString("forwardName8"));

				takingopinionsName = Util.null2String(recordSet.getString("takingOpName8"));
				HandleForwardName = Util.null2String(recordSet.getString("forhandName8"));
				forhandnobackName = Util.null2String(recordSet.getString("forhandnobackName8"));
				forhandbackName = Util.null2String(recordSet.getString("forhandbackName8"));
				givingopinionsName = Util.null2String(recordSet.getString("takingOpinionsName8"));
				givingOpinionsnobackName = Util.null2String(recordSet.getString("takingOpinionsnobackName8"));
				givingOpinionsbackName = Util.null2String(recordSet.getString("takingOpinionsbackName8"));

				saveName = Util.null2String(recordSet.getString("saveName8"));
				rejectName = Util.null2String(recordSet.getString("rejectName8"));
				forsubName = Util.null2String(recordSet.getString("forsubName8"));
				ccsubName = Util.null2String(recordSet.getString("ccsubName8"));
				newWFName = Util.null2String(recordSet.getString("newWFName8"));
				newSMSName = Util.null2String(recordSet.getString("newSMSName8"));
				newCHATSName = Util.null2String(recordSet.getString("newCHATSName8")); // 微信提醒(QC:98106)
				subnobackName = Util.null2String(recordSet.getString("subnobackName8"));
				subbackName = Util.null2String(recordSet.getString("subbackName8"));
				forsubnobackName = Util.null2String(recordSet.getString("forsubnobackName8"));
				forsubbackName = Util.null2String(recordSet.getString("forsubbackName8"));
				ccsubnobackName = Util.null2String(recordSet.getString("ccsubnobackName8"));
				ccsubbackName = Util.null2String(recordSet.getString("ccsubbackName8"));
				newOverTimeName = Util.null2String(recordSet.getString("newOverTimeName8"));
				submitDirectName = Util.null2String(recordSet.getString("submitDirectName8"));
			}
			hasnoback = Util.null2String(recordSet.getString("hasnoback"));
			hasback = Util.null2String(recordSet.getString("hasback"));
			hasfornoback = Util.null2String(recordSet.getString("hasfornoback"));
			hasforback = Util.null2String(recordSet.getString("hasforback"));
			hasccnoback = Util.null2String(recordSet.getString("hasccnoback"));
			hasccback = Util.null2String(recordSet.getString("hasccback"));
			t_workflowid = Util.getIntValue(recordSet.getString("workflowid"), 0);
			hasovertime = Util.null2String(recordSet.getString("hasovertime"));
			hasforhandback = Util.null2String(recordSet.getString("hasforhandback"));
			hasforhandnoback = Util.null2String(recordSet.getString("hasforhandnoback"));
			hastakingOpinionsback = Util.null2String(recordSet.getString("hastakingOpinionsback"));
			hastakingOpinionsnoback = Util.null2String(recordSet.getString("hastakingOpinionsnoback"));
			isSubmitDirect = Util.null2String(recordSet.getString("isSubmitDirect"));
			subbackCtrl = Util.getIntValue(Util.null2String(recordSet.getString("subbackCtrl")), 0);
			forhandbackCtrl = Util.getIntValue(Util.null2String(recordSet.getString("forhandbackCtrl")), 0);
			forsubbackCtrl = Util.getIntValue(Util.null2String(recordSet.getString("forsubbackCtrl")), 0);
			ccsubbackCtrl = Util.getIntValue(Util.null2String(recordSet.getString("ccsubbackCtrl")), 0);
			takingOpinionsbackCtrl = Util.getIntValue(Util.null2String(recordSet.getString("takingOpinionsbackCtrl")), 0);
		}

		String default_submitName_0 = ""; // 提交
		String default_submitName_1 = ""; // 批准
		String default_forhandName = ""; // 转办
		String default_subName = ""; // 批注
		String default_takingOpinionsName = ""; // 回复
		// TODO E9新功能
		// try {
		// recordSet.executeSql("select * from SystemCustomMenuSet");
		// if (recordSet.next()) {
		// default_submitName_0 =
		// Util.processBody(Util.null2String(recordSet.getString("submitName_0")).trim(),
		// "" + user.getLanguage());
		// default_submitName_1 =
		// Util.processBody(Util.null2String(recordSet.getString("submitName_1")).trim(),
		// "" + user.getLanguage());
		// default_forhandName =
		// Util.processBody(Util.null2String(recordSet.getString("forhandName")).trim(),
		// "" + user.getLanguage());
		// default_subName =
		// Util.processBody(Util.null2String(recordSet.getString("subName")).trim(),
		// "" + user.getLanguage());
		// default_takingOpinionsName =
		// Util.processBody(Util.null2String(recordSet.getString("takingOpinionsName")).trim(),
		// "" + user.getLanguage());
		// if ("".equals(HandleForwardName)) {
		// HandleForwardName = default_forhandName;
		// }
		// if ("".equals(forsubName)) {
		// forsubName = default_subName;
		// }
		// if ("".equals(ccsubName)) {
		// ccsubName = default_subName;
		// }
		// if ("".equals(givingopinionsName)) {
		// givingopinionsName = default_takingOpinionsName;
		// }
		// if ("".equals(submitDirectName)) {
		// submitDirectName =
		// Util.processBody(Util.null2String(recordSet.getString("submitDirectName")).trim(),
		// "" + user.getLanguage());
		// }
		// if ("".equals(forwardName)) {
		// forwardName =
		// Util.processBody(Util.null2String(recordSet.getString("forwardName")).trim(),
		// "" + user.getLanguage());
		// }
		// if ("".equals(saveName)) {
		// saveName =
		// Util.processBody(Util.null2String(recordSet.getString("saveName")).trim(),
		// "" + user.getLanguage());
		// }
		// if ("".equals(rejectName)) {
		// rejectName =
		// Util.processBody(Util.null2String(recordSet.getString("rejectName")).trim(),
		// "" + user.getLanguage());
		// }
		// if ("".equals(takingopinionsName)) {
		// takingopinionsName =
		// Util.processBody(Util.null2String(recordSet.getString("takingOpName")).trim(),
		// "" + user.getLanguage());
		// }
		// }
		// } catch (Exception e) {
		// //e.printStackTrace();
		// writeLog("SystemCustomMenuSet存储过程不存在!");
		// }

		// 上一次退回操作的节点id
		String lastnodeid = ""; // 上一次退回操作的节点id
		String isSubmitDirectNode = ""; // 上一次退回操作的节点是否启用退回后再提交直达本节点
		String sql_isreject = " select a.nodeid lastnodeid, a.logtype from workflow_requestlog a, workflow_nownode b where a.requestid = b.requestid and a.destnodeid = b.nownodeid "
				+ " and b.requestid=" + requestid + " and a.destnodeid=" + nodeid + " and a.nodeid != " + nodeid + " order by a.logid desc";
		recordSet.executeSql(sql_isreject);
		while (recordSet.next()) {
			String logtype = Util.null2String(recordSet.getString("logtype"));
			if ("3".equals(logtype)) {
				lastnodeid = Util.null2String(recordSet.getString("lastnodeid"));
				break;
			}
			if ("0".equals(logtype) || "2".equals(logtype) || "e".equals(logtype) || "i".equals(logtype) || "j".equals(logtype)) {
				break;
			}
		}
		if (!"".equals(lastnodeid) && !wfLinkInfo.isCanSubmitToRejectNode(requestid, currentnodeid, Util.getIntValue(lastnodeid, 0))) {
			lastnodeid = "";
		}
		if (!"".equals(lastnodeid)) {
			recordSet.executeSql("select * from workflow_flownode where workflowid=" + workflowid + " and nodeid=" + lastnodeid);
			if (recordSet.next()) {
				isSubmitDirectNode = Util.null2String(recordSet.getString("isSubmitDirectNode"));
			}
			if ("1".equals(isSubmitDirectNode)) { // 如果启用，退回到的节点点击【提交/批准】直接到达执行退回的这个节点。此时不再显示【提交至退回节点】操作按钮
				isSubmitDirect = "";
			}
		} else {
			isSubmitDirect = "";
		}
		if ("".equals(submitDirectName)) {
			submitDirectName = SystemEnv.getHtmlLabelName(126507, user.getLanguage());
		}
		// forhandName = HandleForwardName;
		if ("".equals(HandleForwardName)) {
			HandleForwardName = SystemEnv.getHtmlLabelName(23745, user.getLanguage());
			// forhandName = SystemEnv.getHtmlLabelName(615,user.getLanguage());

		}

		if ("".equals(forhandbackName)) {
			forhandbackName = "".equals(default_forhandName) ? SystemEnv.getHtmlLabelName(23745, user.getLanguage()) : default_forhandName;
			if (forhandbackCtrl == 2) {
				forhandbackName += "(" + SystemEnv.getHtmlLabelName(21761, user.getLanguage()) + ")";
			}
		}

		if ("".equals(forhandnobackName)) {
			forhandnobackName = "".equals(default_forhandName) ? SystemEnv.getHtmlLabelName(23745, user.getLanguage()) : default_forhandName;
			if (forhandbackCtrl == 2) {
				forhandnobackName += "(" + SystemEnv.getHtmlLabelName(21762, user.getLanguage()) + ")";
			}
		}

		if ("".equals(givingopinionsName)) {
			givingopinionsName = SystemEnv.getHtmlLabelName(18540, user.getLanguage());
		}

		if ("".equals(givingOpinionsnobackName)) {
			givingOpinionsnobackName = "".equals(default_takingOpinionsName) ? SystemEnv.getHtmlLabelName(18540, user.getLanguage()) : default_takingOpinionsName;
			if (takingOpinionsbackCtrl == 2) {
				givingOpinionsnobackName += "(" + SystemEnv.getHtmlLabelName(21762, user.getLanguage()) + ")";
			}
		}

		if ("".equals(givingOpinionsbackName)) {
			givingOpinionsbackName = "".equals(default_takingOpinionsName) ? SystemEnv.getHtmlLabelName(18540, user.getLanguage()) : default_takingOpinionsName;
			if (takingOpinionsbackCtrl == 2) {
				givingOpinionsbackName += "(" + SystemEnv.getHtmlLabelName(21761, user.getLanguage()) + ")";
			}
		}

		if (isremark == 1 && takisremark == 2) { // 征询意见回复
			submitname = givingopinionsName;
			subnobackName = givingOpinionsnobackName;
			subbackName = givingOpinionsbackName;
		}

		if (isremark == 1 && takisremark != 2) {
			submitname = forsubName;
			subnobackName = forsubnobackName;
			subbackName = forsubbackName;
		}
		if (isremark == 9 || isremark == 7) {
			submitname = ccsubName;
			subnobackName = ccsubnobackName;
			subbackName = ccsubbackName;
		}
		if ("".equals(submitname)) {
			if (isremark == 1 || isremark == 9 || isremark == 7) {
				submitname = SystemEnv.getHtmlLabelName(1006, user.getLanguage());
			} else if (nodetype.equals("0")) {
				submitname = !"".equals(default_submitName_0) ? default_submitName_0 : SystemEnv.getHtmlLabelName(615, user.getLanguage()); // 创建节点或者转发,
				// 为批注
			} else if (nodetype.equals("1")) {
				submitname = !"".equals(default_submitName_1) ? default_submitName_1 : SystemEnv.getHtmlLabelName(142, user.getLanguage()); // 审批
			} else if (nodetype.equals("2")) {
				submitname = !"".equals(default_submitName_0) ? default_submitName_0 : SystemEnv.getHtmlLabelName(725, user.getLanguage()); // 实现
			}
		}
		if ("".equals(subbackName)) {
			if (isremark == 1 || isremark == 9 || isremark == 7) {
				subbackName = "".equals(default_subName) ? SystemEnv.getHtmlLabelName(1006, user.getLanguage()) : default_subName;
				if ((isremark == 1 && ("1".equals(hasforback) && forsubbackCtrl == 2)) || (isremark == 9 && ("1".equals(hasccback) && ccsubbackCtrl == 2))) {
					subbackName += "（" + SystemEnv.getHtmlLabelName(21761, user.getLanguage()) + "）"; // 创建节点或者转发,
					// 为提交
				}
			} else if (nodetype.equals("0")) {
				subbackName = "".equals(default_submitName_0) ? SystemEnv.getHtmlLabelName(615, user.getLanguage()) : default_submitName_0;
				if ((nodetype.equals("0") && ("1".equals(hasback) && subbackCtrl == 2))) {
					subbackName += "（" + SystemEnv.getHtmlLabelName(21761, user.getLanguage()) + "）"; // 创建节点或者转发,
					// 为提交
				}
			} else if (nodetype.equals("1")) {
				subbackName = "".equals(default_submitName_1) ? SystemEnv.getHtmlLabelName(142, user.getLanguage()) : default_submitName_1;
				if ("1".equals(hasback) && subbackCtrl == 2) {
					subbackName += "（" + SystemEnv.getHtmlLabelName(21761, user.getLanguage()) + "）"; // 审批
				}
			} else if (nodetype.equals("2")) {
				subbackName = "".equals(default_submitName_0) ? SystemEnv.getHtmlLabelName(725, user.getLanguage()) : default_submitName_0;
				if ("1".equals(hasback) && subbackCtrl == 2) {
					subbackName += "（" + SystemEnv.getHtmlLabelName(21761, user.getLanguage()) + "）"; // 实现
				}
			}
		}
		// System.out.println("******isremark="+isremark+"
		// ***********nodetype="+nodetype +" "+username+" *****");
		if ("".equals(subnobackName)) {
			if (isremark == 1 || isremark == 9 || isremark == 7) {
				subnobackName = "".equals(default_subName) ? SystemEnv.getHtmlLabelName(1006, user.getLanguage()) : default_subName;
				if ((isremark == 1 && forsubbackCtrl == 2) || (isremark == 9 && ccsubbackCtrl == 2)) {
					subnobackName += "（" + SystemEnv.getHtmlLabelName(21762, user.getLanguage()) + "）"; // 批注
				}
			} else if (nodetype.equals("0")) {
				subnobackName = "".equals(default_submitName_0) ? SystemEnv.getHtmlLabelName(615, user.getLanguage()) : default_submitName_0;
				if (subbackCtrl == 2) {
					subnobackName += "（" + SystemEnv.getHtmlLabelName(21762, user.getLanguage()) + "）"; // 创建节点或者转发,
					// 为提交
				}
			} else if (nodetype.equals("1")) {
				subnobackName = "".equals(default_submitName_1) ? SystemEnv.getHtmlLabelName(142, user.getLanguage()) : default_submitName_1;
				if (subbackCtrl == 2) {
					subnobackName += "（" + SystemEnv.getHtmlLabelName(21762, user.getLanguage()) + "）"; // 审批
				}
			} else if (nodetype.equals("2")) {
				subnobackName = "".equals(default_submitName_0) ? SystemEnv.getHtmlLabelName(725, user.getLanguage()) : default_submitName_0;
				if (subbackCtrl == 2) {
					subnobackName += "（" + SystemEnv.getHtmlLabelName(21762, user.getLanguage()) + "）"; // 实现
				}
			}
		}
		if ("".equals(forwardName)) {
			forwardName = SystemEnv.getHtmlLabelName(6011, user.getLanguage());
		}
		if ("".equals(takingopinionsName)) {
			takingopinionsName = SystemEnv.getHtmlLabelName(82578, user.getLanguage());
		}

		if ("".equals(HandleForwardName)) {
			HandleForwardName = SystemEnv.getHtmlLabelName(23745, user.getLanguage());
		}
		if ("".equals(saveName)) {
			saveName = SystemEnv.getHtmlLabelName(86, user.getLanguage());
		}
		if ("".equals(rejectName)) {
			rejectName = SystemEnv.getHtmlLabelName(236, user.getLanguage());
		}

		// 开启云部署后，自由节点流程是否已在高级设置中修改过
		String iscnodefree = iscnodefree(recordSet);

		boolean wfmonitor = "true".equals(session.getAttribute(userid + "_" + requestid + "wfmonitor"));// 流程监控人

		boolean canForwd = false;
		if (isremark == 1 && takisremark == 2 && "1".equals(IsPendingForward)) { // 征询意见回复\
			canForwd = true;
		}
		if (takisremark != 2) {
			if (("0".equals(IsFromWFRemark_T) && "1".equals(IsBeForwardTodo)) || ("1".equals(IsFromWFRemark_T) && "1".equals(IsBeForwardAlready))
					|| ("2".equals(IsFromWFRemark_T) && "1".equals(IsBeForward))) {
				canForwd = true;
			}
		}

		boolean _iscanforward = false;
		String fromPDA = Util.null2String((String) session.getAttribute("loginPAD"));
		if (!fromPDA.equals("1") && !wfmonitor) {
			if (isaffirmance.equals("1") && nodetype.equals("0") && !reEdit.equals("1")) {// 提交确认菜单
				if (IsCanSubmit || coadCanSubmit) {
					rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(16634, user.getLanguage()),RequestMenuType.BTN_DRAFT,"doSubmit_Pre()", "icon-Right-menu-Need-feedback"));
					if (!"1".equals(isSubmitDirectNode)) {
						isSubmitDirect = Util.null2String(request.getParameter("isSubmitDirect"));
					}
				}
				rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(93, user.getLanguage()),RequestMenuType.BTN_DRAFT,"doEdit()", "icon-Right-menu-edit"));
			} else {
				if (isremark == 1 || isremark == 9) {
					if ("".equals(ifchangstatus)) {
						rightMenus.add(new RightMenu(submitname,RequestMenuType.BTN_SUBMIT,"doRemark_nNoBack()", "icon-Right-menu-batch"));
					} else {
						if (takisremark == 2) {
							if (!"1".equals(hastakingOpinionsback) && !"1".equals(hastakingOpinionsnoback) && isremark == 1 && takisremark == 2) {
								rightMenus.add(new RightMenu(submitname,RequestMenuType.BTN_SUBBACKNAME,"doRemark_nBack()", "icon-Right-menu-batch"));
							}
						} else if ((!"1".equals(hasforback) && !"1".equals(hasfornoback) && isremark == 1) || (!"1".equals(hasccback) && !"1".equals(hasccnoback) && isremark == 9)) {
							rightMenus.add(new RightMenu(submitname,RequestMenuType.BTN_SUBBACKNAME,"doRemark_nBack()", "icon-Right-menu-batch"));
						}
						if (takisremark == 2) {
							if (("1".equals(hastakingOpinionsback) && isremark == 1 && takisremark == 2)) {
								rightMenus.add(new RightMenu(subbackName,RequestMenuType.BTN_SUBBACKNAME,"doRemark_nBack()", "icon-Right-menu-batch"));
							}
							if (("1".equals(hastakingOpinionsnoback) && isremark == 1 && takisremark == 2)) {
								rightMenus.add(new RightMenu(subnobackName,RequestMenuType.BTN_SUBNOBACKNAME,"doRemark_nNoBack()", "icon-Right-menu-batch"));
							}
						} else {
							if (("1".equals(hasforback) && isremark == 1) || ("1".equals(hasccback) && isremark == 9)) {
								rightMenus.add(new RightMenu(subbackName,RequestMenuType.BTN_SUBBACKNAME,"doRemark_nBack()", "icon-Right-menu-batch"));
							}
							if (("1".equals(hasfornoback) && isremark == 1) || ("1".equals(hasccnoback) && isremark == 9)) {
								rightMenus.add(new RightMenu(subnobackName,RequestMenuType.BTN_SUBNOBACKNAME,"doRemark_nNoBack()", "icon-Right-menu-batch"));
							}
						}
					}

					if (isremark == 1 && IsCanModify) {
						rightMenus.add(new RightMenu(saveName,RequestMenuType.BTN_WFSAVE,"doSave_nNew()", "icon-Right-menu-Preservation"));
					}
					if (((isremark == 1 && canForwd) || (isremark == 9 && IsPendingForward.equals("1"))) && !"1".equals(session.getAttribute("istest"))) {
						rightMenus.add(new RightMenu(forwardName,RequestMenuType.BTN_FORWARD,"doReviewE9()", "icon-Right-menu-Turn-to-do"));
						_iscanforward = true;
					}
				} else if (isremark == 5) {
					if ("".equals(ifchangstatus)) {
						rightMenus.add(new RightMenu(submitname,RequestMenuType.BTN_SUBMIT,"doSubmitNoBack()", "icon-Right-menu-batch"));
					} else {
						if (!"1".equals(hasnoback)) {
							rightMenus.add(new RightMenu(subbackName,RequestMenuType.BTN_SUBBACKNAME,"doSubmitBack()", "icon-Right-menu-batch"));
						} else {
							if ("1".equals(hasback)) {
								rightMenus.add(new RightMenu(subbackName,RequestMenuType.BTN_SUBBACKNAME,"doSubmitBack()", "icon-Right-menu-batch"));
							}
							rightMenus.add(new RightMenu(subnobackName,RequestMenuType.BTN_SUBNOBACKNAME,"doSubmitNoBack()", "icon-Right-menu-batch"));
						}
					}
					if ("1".equals(isSubmitDirect)) {
						rightMenus.add(new RightMenu(submitDirectName,RequestMenuType.BTN_SUBMIT,"doSubmitDirect('Submit')", "icon-Right-menu-Need-feedback"));
					}
				} else {
					String subfun = "Submit";
					if (IsCanSubmit || coadCanSubmit) {
						if (isaffirmance.equals("1") && nodetype.equals("0") && reEdit.equals("1")) {
							subfun = "Affirmance";
						}
						if ("".equals(ifchangstatus)) {
							rightMenus.add(new RightMenu(submitname,RequestMenuType.BTN_SUBMIT,"do" + subfun + "NoBack()", "icon-Right-menu-Approval"));
						} else {
							if ((!"1".equals(hasnoback) && !"1".equals(hasback))) {
								rightMenus.add(new RightMenu(submitname,RequestMenuType.BTN_SUBBACKNAME,"do" + subfun + "Back()", "icon-Right-menu-Need-feedback"));
							} else {
								if ("1".equals(hasback)) {
									rightMenus.add(new RightMenu(subbackName,RequestMenuType.BTN_SUBBACKNAME,"do" + subfun + "Back()", "icon-Right-menu-Need-feedback"));
								}
								if ("1".equals(hasnoback)) {
									rightMenus.add(new RightMenu(subnobackName,RequestMenuType.BTN_SUBNOBACKNAME,"do" + subfun + "NoBack()", "icon-Right-menu-Approval"));
								}
							}
						}
						if ("1".equals(isSubmitDirect)) {
							rightMenus.add(new RightMenu(submitDirectName,RequestMenuType.BTN_SUBMIT,"doSubmitDirect('" + subfun + "')", "icon-Right-menu-Approval"));
						}
						if (IsFreeWorkflow) {
							if (iscnodefree.equals("0")) {
								// TODO
								rightMenus.add(new RightMenu(FreeWorkflowname,RequestMenuType.BTN_DEFAULT,"doFreeWorkflow()", "icon-Right-menu-Flow-setting"));
							}
						}
						if (isImportDetail) {
							rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(26255, user.getLanguage()),RequestMenuType.BTN_DEFAULT,"doImportDetail()", "icon-Right-menu-Detailed"));
						}
						rightMenus.add(new RightMenu(saveName,RequestMenuType.BTN_WFSAVE,"doSave_nNew()", "icon-Right-menu-Preservation"));
						if (isreject.equals("1")) {
							if (isremark == 7 && coadsigntype.equals("2")) {
							} else {
								rightMenus.add(new RightMenu(rejectName,RequestMenuType.BTN_REJECTNAME,"doReject_New()", "icon-Right-menu--go-back"));
							}
						}
					}
					if (IsPendingForward.equals("1") && !"1".equals(session.getAttribute("istest"))) { // 转发
						rightMenus.add(new RightMenu(forwardName,RequestMenuType.BTN_FORWARD,"doReviewE9()", "icon-Right-menu-Turn-to-do"));
						_iscanforward = true;
					}
					// System.out.println("-I-1188----IsTakingOpinions-----"+IsTakingOpinions);
					if (IsTakingOpinions.equals("1") && !"1".equals(session.getAttribute("istest"))) { // 征求意见
						rightMenus.add(new RightMenu(takingopinionsName,RequestMenuType.BTN_FORWARD,"doReview2()", "icon-Right-menu-Advice"));
					}
					// System.out.println("-I-1194----IsHandleForward-----"+IsHandleForward);
					if (IsHandleForward.equals("1")) { // 转办
						if ("".equals(ifchangstatus) && !"1".equals(session.getAttribute("istest"))) {
							rightMenus.add(new RightMenu(HandleForwardName,RequestMenuType.BTN_FORWARD,"doReview3()", "icon-Right-menu-Turn-to-do"));
						} else {
							if ((!"1".equals(hasforhandnoback) && !"1".equals(hasforhandback) && !"1".equals(session.getAttribute("istest")))) {
								rightMenus.add(new RightMenu(HandleForwardName,RequestMenuType.BTN_FORWARD,"doReview3()", "icon-Right-menu-Turn-to-do"));
							} else {
								if ("1".equals(hasforhandback) && !"1".equals(session.getAttribute("istest"))) {
									rightMenus.add(new RightMenu(forhandbackName,RequestMenuType.BTN_FORWARDBACK3,"doReviewback3()", "icon-Right-menu-Turn-to-do-need-feedback"));
								}
								if ("1".equals(hasforhandnoback)) {
									rightMenus.add(new RightMenu(forhandnobackName,RequestMenuType.BTN_FORWARDNOBACKE3,"doReviewnoback3()", "icon-Right-menu-Turn-to-do"));
								}
							}
						}
					}
					if (isreopen.equals("1") && false) {
						rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(244, user.getLanguage()),RequestMenuType.BTN_DOREOPEN,"doReopen()", "icon-Right-menu-Reopen"));
					}
				}
				/* added by cyril on 2008-07-09 for TD:8835 */
				if (isModifyLog.equals("1")) {
					rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(21625, user.getLanguage()),RequestMenuType.BTN_DOVIEWMODIFYLOG,"doViewModifyLog()", "icon-Right-menu-Journal"));
				}

				//
				this.loadWXRemindMenu(recordSet, sqlselectNewName, newWFName, newSMSName, newCHATSName, t_workflowid,nodeid);
				/* TD9145 END */
				if ("1".equals(hasovertime) && isremark == 0) {
					if ("".equals(newOverTimeName)) {
						newOverTimeName = SystemEnv.getHtmlLabelName(18818, user.getLanguage());
					}
					rightMenus.add(new RightMenu(newOverTimeName,RequestMenuType.BTN_NEWSMSNAME,"onNewOverTime()", "icon-Right-menu-overtime"));
				}

				if (isremark != 1 && isremark != 8 && isremark != 9) {
					List<Map<String, String>> buttons = SubWorkflowTriggerService.getManualTriggerButtons(workflowid, nodeid);
					for (int indexId = 0; indexId < buttons.size(); indexId++) {
						Map<String, String> button = buttons.get(indexId);
						int subwfSetId = Util.getIntValue(button.get("subwfSetId"), 0);
						int buttonNameId = Util.getIntValue(button.get("buttonNameId"), 0);
						String triSubwfName7 = Util.null2String(button.get("triSubwfName7"));
						String triSubwfName8 = Util.null2String(button.get("triSubwfName8"));
						String workflowNames = Util.null2String(button.get("workflowNames"));
						String triSubwfName = "";
						if (user.getLanguage() == 8) {
							triSubwfName = triSubwfName8;
						} else {
							triSubwfName = triSubwfName7;
						}
						if (triSubwfName.equals("")) {
							triSubwfName = SystemEnv.getHtmlLabelName(22064, user.getLanguage()) + (indexId + 1);
						}
						rightMenus.add(new RightMenu(triSubwfName,RequestMenuType.BTN_RELATECWORK,"triSubwf2(" + subwfSetId + ",'" + workflowNames + "')", "icon-Right-menu-Trigger-process"));
					}
				}

				if (!isfromtab && !"1".equals(session.getAttribute("istest"))) {
					// addRightMenu(SystemEnv.getHtmlLabelName(1290,
					// user.getLanguage()), "btn_back", "_self",
					// "doBack()","icon-Right-menu-Return");
				}

				HashMap map = wfFunctionManageUtil.wfFunctionManageByNodeid(workflowid, nodeid);
				WfForceDrawBack wfForceDrawBack = new WfForceDrawBack();
				WfForceOver wfForceOver = new WfForceOver();
				String ov = (String) map.get("ov");
				String rb = (String) map.get("rb");
				haveOverright = ((isremark != 1 && isremark != 9 && isremark != 5) || (isremark == 7 && !"2".equals(coadsigntype))) && "1".equals(ov) && wfForceOver.isNodeOperator(requestid, userid)
						&& !currentnodetype.equals("3");
				haveBackright = wfForceDrawBack.checkOperatorIsremark(requestid, userid, usertype, isremark) && !"0".equals(rb)
						&& wfForceDrawBack.isHavePurview(requestid, userid, Integer.parseInt(user.getLogintype()), -1, -1) && !currentnodetype.equals("0");
				if (haveOverright) {
					rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(18360, user.getLanguage()),RequestMenuType.BTN_DODRAWBACK,"doDrawBack()", "icon-Right-menu-File"));
				}
				if (haveBackright) {
					rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(18359, user.getLanguage()),RequestMenuType.BTN_DORETRACT,"doRetract()", "icon-Right-menu-Forcible"));
				}
				if (haveStopright) {
					rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(20387, user.getLanguage()),RequestMenuType.BTN_END,"doStop()", "icon-Right-menu-suspend"));
				}
				if (haveCancelright) {
					rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(16210, user.getLanguage()),RequestMenuType.BTN_BACKSUBSCRIBLE,"doCancel()", "icon-Right-menu-Revoke"));
				}
				if (haveRestartright) {
					rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(18095, user.getLanguage()),RequestMenuType.BTN_NEXT,"doRestart()", "icon-Right-menu-Enable"));
				}
				if (nodetype.equals("0") && isremark != 1 && isremark != 9 && isremark != 7 && isremark != 5 && wfFunctionManageUtil.IsShowDelButtonByReject(requestid, workflowid)) { // 创建节点(退回创建节点也是)
					rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(91, user.getLanguage()),RequestMenuType.BTN_DODELETE,"doDelete()", "icon-Right-menu-delete"));
				}
			}
			rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(257, user.getLanguage()),RequestMenuType.BTN_PRINT,"openSignPrint()", "icon-Right-menu-Print-log"));
		}
		rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(21533, user.getLanguage()),RequestMenuType.BTN_COLLECT,"doPrintViewLog()", "icon-Right-menu-Print-log2"));

		/** 任务相关菜单 QC129917 * */
		if (weaver.workrelate.util.TransUtil.istask()) {
			rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(15266, user.getLanguage()),RequestMenuType.BTN_DEFAULT,"doCreateTask()", "icon-Right-menu-New-Flow"));
			rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(124912, user.getLanguage()),RequestMenuType.BTN_DEFAULT,"openTaskList()", "icon-Right-menu-task-list"));
		}

		if (!"".equals(submitname)) {

		}

		resultDatas.put("submit", !"".equals(submitname) ? "1" : "0");
		resultDatas.put("forward", _iscanforward ? "1" : "0");
		resultDatas.put("hasback", hasback);
		resultDatas.put("hasnoback", hasnoback);
		resultDatas.put("iscnodefree", iscnodefree);
		resultDatas.put("rightMenus", rightMenus);
	}

	private void loadWXRemindMenu(RecordSet recordSet, String sqlselectNewName, String newWFName, String newSMSName, String newCHATSName, int t_workflowid,int nodeid) throws Exception {
		ArrayList newMenuList0 = new ArrayList(); // 新建流程菜单列表
		ArrayList newMenuList1 = new ArrayList(); // 新建短信菜单列表
		ArrayList newMenuList2 = new ArrayList(); // 新建微信菜单列表
		recordSet.executeSql(sqlselectNewName);

		while (recordSet.next()) {
			int menuType = Util.getIntValue(recordSet.getString("menuType"), -1);
			if (menuType < 0) {
				continue;
			}
			HashMap newMenuMap = new HashMap();
			newMenuMap.put("id", Util.getIntValue(recordSet.getString("id"), 0));
			newMenuMap.put("newName", Util.null2String(recordSet.getString("newName" + user.getLanguage())));
			if (0 == menuType) {
				newMenuMap.put("workflowid", Util.getIntValue(recordSet.getString("workflowid"), 0));
				newMenuList0.add(newMenuMap);
			} else if (1 == menuType) {
				newMenuList1.add(newMenuMap);
			} else if (2 == menuType) {
				newMenuList2.add(newMenuMap);
			}
		}

		for (int i = 0; i < newMenuList0.size(); i++) {
			HashMap newMenuMap = (HashMap) newMenuList0.get(i);
			int menuid = (Integer) newMenuMap.get("id");
			if (menuid > 0) {
				newWFName = (String) newMenuMap.get("newName");
				t_workflowid = (Integer) newMenuMap.get("workflowid");
				if ("".equals(newWFName)) {
					newWFName = SystemEnv.getHtmlLabelName(1239, user.getLanguage()) + (i + 1);
				}

				RequestCheckUser rcu = new RequestCheckUser();
				rcu.resetParameter();
				rcu.setUserid(user.getUID());
				rcu.setWorkflowid(t_workflowid);
				rcu.setLogintype(user.getLogintype());
				rcu.checkUser();
				int t_hasright = rcu.getHasright();
				if (t_hasright == 1) {
					rightMenus.add(new RightMenu(newWFName,RequestMenuType.BTN_NEWWFNAME,"onNewRequest(" + t_workflowid + ", " + requestid + ",0)", "icon-Right-menu-New-Flow"));
				}
			}
		}
		RTXConfig rtxconfig = new RTXConfig();
		String temV = rtxconfig.getPorp(rtxconfig.CUR_SMS_SERVER_IS_VALID);
		boolean valid = false;
		if (temV != null && temV.equalsIgnoreCase("true")) {
			valid = true;
		} else {
			valid = false;
		}
		if (valid == true && HrmUserVarify.checkUserRight("CreateSMS:View", user)) {
			for (int i = 0; i < newMenuList1.size(); i++) {
				HashMap newMenuMap = (HashMap) newMenuList1.get(i);
				int menuid = (Integer) newMenuMap.get("id");
				if (menuid > 0) {
					newSMSName = (String) newMenuMap.get("newName");
					if ("".equals(newSMSName)) {
						newSMSName = SystemEnv.getHtmlLabelName(16444, user.getLanguage()) + (i + 1);
					}
					rightMenus.add(new RightMenu(newSMSName,RequestMenuType.BTN_NEWSMSNAME,"onNewSms(" + workflowid + ", " + nodeid + ", " + requestid + ", " + menuid + ")", "icon-Right-menu-New-SMS"));
				}
			}
		}
		// 微信提醒(QC:98106)
		if (WechatPropConfig.isUseWechat()) {
			for (int i = 0; i < newMenuList2.size(); i++) {
				HashMap newMenuMap = (HashMap) newMenuList2.get(i);
				int menuid = (Integer) newMenuMap.get("id");
				if (menuid > 0) {
					newCHATSName = (String) newMenuMap.get("newName");
					if ("".equals(newCHATSName)) {
						newCHATSName = SystemEnv.getHtmlLabelName(32818, user.getLanguage()) + (i + 1);
					}
					rightMenus.add(new RightMenu(newCHATSName,RequestMenuType.BTN_NEWCHATSNAME,"onNewChats(" + workflowid + ", " + nodeid + ", " + requestid + ", " + menuid + ")", "icon-Right-menu-WeChat"));
				}
			}
		}
	}

	public void loadCreateFormRightMenu(Map<String, Object> resultDatas) throws Exception {
		int nodeid = Util.getIntValue(request.getParameter("nodeid"),0);
		RecordSet recordSet = new RecordSet();
		Prop prop = Prop.getInstance();
		String ifchangstatus = Util.null2String(prop.getPropValue(GCONST.getConfigFile(), "ecology.changestatus"));
		String sqlselectName = "select * from workflow_nodecustomrcmenu where wfid=" + workflowid + " and nodeid=" + nodeid;
		recordSet.executeSql(sqlselectName);
		String submitName = "";
		String subnobackName = "";// 提交不需反馈
		String subbackName = "";// 提交需反馈
		String hasnoback = "";// 使用提交不需反馈按钮
		String hasback = "";// 使用提交需反馈按钮
		String saveName = "";
		String newWFName = "";// 新建流程按钮
		String newSMSName = "";// 新建短信按钮
		String newCHATSName = "";// 新建微信按钮 微信提醒(QC:98106)
		String haswfrm = "";// 是否使用新建流程按钮
		String hassmsrm = "";// 是否使用新建短信按钮
		String haschats = "";// 是否使用新建微信按钮 微信提醒(QC:98106)
		int t_workflowid = 0;// 新建流程的ID
		int subbackCtrl = 0;
		if (recordSet.next()) {
			if (user.getLanguage() == 7) {
				submitName = Util.null2String(recordSet.getString("submitName7"));
				saveName = Util.null2String(recordSet.getString("saveName7"));
				newWFName = Util.null2String(recordSet.getString("newWFName7"));
				newSMSName = Util.null2String(recordSet.getString("newSMSName7"));
				newCHATSName = Util.null2String(recordSet.getString("newCHATSName7")); // 微信提醒(QC:98106)
				subnobackName = Util.null2String(recordSet.getString("subnobackName7"));
				subbackName = Util.null2String(recordSet.getString("subbackName7"));
			} else if (user.getLanguage() == 9) {
				submitName = Util.null2String(recordSet.getString("submitName9"));
				saveName = Util.null2String(recordSet.getString("saveName9"));
				newWFName = Util.null2String(recordSet.getString("newWFName9"));
				newSMSName = Util.null2String(recordSet.getString("newSMSName9"));
				newCHATSName = Util.null2String(recordSet.getString("newCHATSName9")); // 微信提醒(QC:98106)
				subnobackName = Util.null2String(recordSet.getString("subnobackName9"));
				subbackName = Util.null2String(recordSet.getString("subbackName9"));
			} else {
				submitName = Util.null2String(recordSet.getString("submitName8"));
				saveName = Util.null2String(recordSet.getString("saveName8"));
				newWFName = Util.null2String(recordSet.getString("newWFName8"));
				newSMSName = Util.null2String(recordSet.getString("newSMSName8"));
				newCHATSName = Util.null2String(recordSet.getString("newCHATSName8")); // 微信提醒(QC:98106)
				subnobackName = Util.null2String(recordSet.getString("subnobackName8"));
				subbackName = Util.null2String(recordSet.getString("subbackName8"));
			}
			haswfrm = "0"; // Util.null2String(recordSet.getString("haswfrm"));
			hassmsrm = Util.null2String(recordSet.getString("hassmsrm"));
			haschats = Util.null2String(recordSet.getString("haschats")); // 微信提醒(QC:98106)
			hasnoback = Util.null2String(recordSet.getString("hasnoback"));
			hasback = Util.null2String(recordSet.getString("hasback"));
			t_workflowid = Util.getIntValue(recordSet.getString("workflowid"), 0);
			subbackCtrl = Util.getIntValue(Util.null2String(recordSet.getString("subbackCtrl")), 0);
		}
		String default_submitName_0 = ""; // 提交
		recordSet.executeSql("select * from SystemCustomMenuSet");
		if (recordSet.next()) {
			default_submitName_0 = Util.processBody(Util.null2String(recordSet.getString("submitName_0")).trim(), "" + user.getLanguage());
			if ("".equals(submitName)) {
				submitName = default_submitName_0;
			}
			if ("".equals(saveName)) {
				saveName = Util.processBody(Util.null2String(recordSet.getString("saveName")).trim(), "" + user.getLanguage());
			}
		}
		

		String FreeWorkflowname = "";
		recordSet.executeSql("select freewfsetcurnameen,freewfsetcurnametw,freewfsetcurnamecn from workflow_flownode where workflowid=" + workflowid + " and nodeid=" + nodeid);
		if (recordSet.next()) {
			if (user.getLanguage() == 8) {
				FreeWorkflowname = Util.null2String(recordSet.getString("freewfsetcurnameen"));
			} else if (user.getLanguage() == 9) {
				FreeWorkflowname = Util.null2String(recordSet.getString("freewfsetcurnametw"));
			} else {
				FreeWorkflowname = Util.null2String(recordSet.getString("freewfsetcurnamecn"));
			}
		}
		
		boolean IsFreeWorkflow=new WFForwardManager().getIsFreeWorkflow(requestid,nodeid,0);
		boolean isImportDetail=new RequestDetailImport().getAllowesImport(requestid,workflowid,nodeid,0,user);
		
		WFManager wfManager  =  new WFManager();
		wfManager.setWfid(workflowid);
		wfManager.getWfInfo();
		String isFree = wfManager.getIsFree();
		String freewftype = wfManager.getFreewftype();   //自由流程的模式，1：简易模式，2：高级模式
		String iscnodefree = Util.null2String(request.getParameter("iscnodefree"));

		if ("".equals(submitName)) {
			submitName = SystemEnv.getHtmlLabelName(615, user.getLanguage());
		}
		if ("".equals(saveName)) {
			saveName = SystemEnv.getHtmlLabelName(86, user.getLanguage());
		}
		if ("".equals(FreeWorkflowname.trim())) {
			FreeWorkflowname = SystemEnv.getHtmlLabelName(21781, user.getLanguage());
		}
		if ("".equals(subbackName)) {
			subbackName = "".equals(default_submitName_0) ? SystemEnv.getHtmlLabelName(615, user.getLanguage()) : default_submitName_0;
			if (("1".equals(hasnoback) || "1".equals(hasback)) && subbackCtrl == 2) {
				subbackName += "（" + SystemEnv.getHtmlLabelName(21761, user.getLanguage()) + "）";
			}
		}
		if ("".equals(subnobackName)) {
			subnobackName = "".equals(default_submitName_0) ? SystemEnv.getHtmlLabelName(615, user.getLanguage()) : default_submitName_0;
			if (subbackCtrl == 2) {
				subnobackName += "（" + SystemEnv.getHtmlLabelName(21762, user.getLanguage()) + "）";
			}
		}
		String needAffirmance = Util.null2String(request.getParameter("needAffirmance"));
		if ("".equals(ifchangstatus)) {
			if (!needAffirmance.equals("1")) {
				rightMenus.add(new RightMenu(submitName,RequestMenuType.BTN_SUBBACKNAME,"doSubmitBack()", "icon-Right-menu-batch"));
			} else {
				rightMenus.add(new RightMenu(submitName,RequestMenuType.BTN_SUBBACKNAME,"doAffirmanceBack()", "icon-Right-menu-batch"));
			}
		} else {// 必须至少有一个按钮

			if (!needAffirmance.equals("1")) {
				if (!"1".equals(hasnoback)) {
					rightMenus.add(new RightMenu(subbackName,RequestMenuType.BTN_SUBBACKNAME,"doSubmitBack()", "icon-Right-menu-batch"));
				} else {
					if ("1".equals(hasback)) {
						rightMenus.add(new RightMenu(subbackName,RequestMenuType.BTN_SUBBACKNAME,"doSubmitBack()", "icon-Right-menu-batch"));
					}
					rightMenus.add(new RightMenu(subnobackName,RequestMenuType.BTN_SUBNOBACKNAME,"doSubmitNoBack()", "icon-Right-menu-batch"));
				}
			} else {
				if (!"1".equals(hasnoback)) {
					rightMenus.add(new RightMenu(subbackName,RequestMenuType.BTN_SUBBACKNAME,"doAffirmanceBack()", "icon-Right-menu-batch"));
				} else {
					if ("1".equals(hasback)) {
						rightMenus.add(new RightMenu(submitName,RequestMenuType.BTN_SUBBACKNAME,"doAffirmanceBack()", "icon-Right-menu-batch"));
					}
					rightMenus.add(new RightMenu(subnobackName,RequestMenuType.BTN_SUBBACKNAME,"doAffirmanceNoBack()", "icon-Right-menu-batch"));
				}
			}
		}
		if ((IsFreeWorkflow && !"1".equals(isFree)) || ("1".equals(isFree) && "2".equals(freewftype) && IsFreeWorkflow)) {
			if (iscnodefree.equals("0")) {
				rightMenus.add(new RightMenu(FreeWorkflowname,RequestMenuType.BTN_DEFAULT,"doFreeWorkflow()", "icon-Right-menu-Flow-setting"));
			}
		}
		if (isImportDetail) {
			rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(26255, user.getLanguage()),RequestMenuType.BTN_DEFAULT,"doImportDetail()", "icon-Right-menu-Detailed"));
		}
		String importwf= new WorkflowComInfo().getIsImportwf(String.valueOf(workflowid));//可导入流程
		if ("1".equals(importwf)) {
			rightMenus.add(new RightMenu(SystemEnv.getHtmlLabelName(24270, user.getLanguage()),RequestMenuType.BTN_DEFAULT,"doImportWorkflow()", "icon-Right-menu-Flow-setting"));
		}
		rightMenus.add(new RightMenu(saveName,RequestMenuType.BTN_WFSAVE,"doSave_nNew()", "icon-Right-menu-Preservation"));
		
		if ("1".equals(haswfrm)) {
			if ("".equals(newWFName)) {
				newWFName = SystemEnv.getHtmlLabelName(1239, user.getLanguage());
			}
			
			int t_hasright  = Util.getIntValue(request.getParameter("hasright"), 0);
			if (t_hasright == 1) {
				rightMenus.add(new RightMenu(newWFName,RequestMenuType.BTN_NEWWFNAME,"onNewRequest(" + t_workflowid + ", " + requestid + ",0)", "icon-Right-menu-New-Flow"));
			}
		}
		
		ArrayList newMenuList1 = new ArrayList(); // 新建短信菜单列表
		ArrayList newMenuList2 = new ArrayList(); // 新建微信菜单列表
		recordSet.executeSql("select * from workflow_nodeCustomNewMenu where enable = 1 and wfid=" + workflowid + " and nodeid=" + nodeid + " order by menuType, id");
		while (recordSet.next()) {
			int menuType = Util.getIntValue(recordSet.getString("menuType"), -1);
			if (menuType <= 0) {
				continue;
			}
			HashMap newMenuMap = new HashMap();
			newMenuMap.put("id", Util.getIntValue(recordSet.getString("id"), 0));
			newMenuMap.put("newName", Util.null2String(recordSet.getString("newName" + user.getLanguage())));
			if (1 == menuType) {
				newMenuList1.add(newMenuMap);
			} else if (2 == menuType) {
				newMenuList2.add(newMenuMap);
			}
		}
		
		RTXConfig rtxconfig = new RTXConfig();
		String temV = rtxconfig.getPorp(rtxconfig.CUR_SMS_SERVER_IS_VALID);
		boolean valid = false;
		if (temV != null && temV.equalsIgnoreCase("true")) {
			valid = true;
		} else {
			valid = false;
		}
		if (valid == true && HrmUserVarify.checkUserRight("CreateSMS:View", user)) {
			for (int i = 0; i < newMenuList1.size(); i++) {
				HashMap newMenuMap = (HashMap) newMenuList1.get(i);
				int menuid = (Integer) newMenuMap.get("id");
				if (menuid > 0) {
					newSMSName = (String) newMenuMap.get("newName");
					if ("".equals(newSMSName)) {
						newSMSName = SystemEnv.getHtmlLabelName(16444, user.getLanguage()) + (i + 1);
					}
					rightMenus.add(new RightMenu(newSMSName,RequestMenuType.BTN_NEWSMSNAME,"onNewSms(" + workflowid + ", " + nodeid + ", " + requestid + ", " + menuid + ")", "icon-Right-menu-New-SMS"));
					
				}
			}
		}
		// 微信提醒START(QC:98106)
		if (WechatPropConfig.isUseWechat()) {
			for (int i = 0; i < newMenuList2.size(); i++) {
				HashMap newMenuMap = (HashMap) newMenuList2.get(i);
				int menuid = (Integer) newMenuMap.get("id");
				if (menuid > 0) {
					newCHATSName = (String) newMenuMap.get("newName");
					if ("".equals(newCHATSName)) {
						newCHATSName = SystemEnv.getHtmlLabelName(32818, user.getLanguage()) + (i + 1);
					}
					rightMenus.add(new RightMenu(newCHATSName,RequestMenuType.BTN_NEWCHATSNAME,"onNewChats(" + workflowid + ", " + nodeid + ", " + requestid + ", " + menuid + ")", "icon-Right-menu-WeChat"));
				}
			}
		}
		resultDatas.put("rightMenus", rightMenus);
	}

	private String iscnodefree(RecordSet recordSet) {
		boolean cloudstatus = PortalUtil.isuserdeploy();
		boolean cloudchange = false;
		String iscnodefree = "0";
		recordSet.execute("select 1 from Workflow_Initialization where wfid = 35");
		if (recordSet.next()) {
			cloudchange = true;
		}
		if (cloudstatus && cloudchange && workflowid == 35) {
			iscnodefree = "1";
		}
		return iscnodefree;
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	public HttpServletResponse getResponse() {
		return response;
	}

	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}
}
