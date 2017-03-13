package com.api.workflow.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import weaver.WorkPlan.WorkPlanShareUtil;
import weaver.conn.RecordSet;
import weaver.cowork.CoworkDAO;
import weaver.file.Prop;
import weaver.formmode.setup.ModeRightInfo;
import weaver.general.BaseBean;
import weaver.general.GCONST;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.meeting.MeetingShareUtil;
import weaver.mobile.webservices.common.ChatResourceShareManager;
import weaver.mobile.webservices.workflow.soa.RequestPreProcessing;
import weaver.rdeploy.portal.PortalUtil;
import weaver.rtx.RTXConfig;
import weaver.system.SysWFLMonitor;
import weaver.systeminfo.SystemEnv;
import weaver.wechat.util.WechatPropConfig;
import weaver.workflow.msg.PoppupRemindInfoUtil;
import weaver.workflow.report.ReportAuthorization;
import weaver.workflow.request.RequestAddShareMode;
import weaver.workflow.request.RequestCheckUser;
import weaver.workflow.request.RequestDoc;
import weaver.workflow.request.RequestShare;
import weaver.workflow.request.SubWorkflowManager;
import weaver.workflow.request.SubWorkflowTriggerService;
import weaver.workflow.request.WFCoadjutantManager;
import weaver.workflow.request.WFForwardManager;
import weaver.workflow.request.WFLinkInfo;
import weaver.workflow.request.WFShareAuthorization;
import weaver.workflow.request.WFUrgerManager;
import weaver.workflow.request.WorkflowIsFreeStartNode;
import weaver.workflow.workflow.WFManager;
import weaver.workflow.workflow.WfForceDrawBack;
import weaver.workflow.workflow.WfForceOver;
import weaver.workflow.workflow.WfFunctionManageUtil;
import weaver.workflow.workflow.WorkflowComInfo;
import weaver.workflow.workflow.WorkflowVersion;
import weaver.worktask.worktask.WTRequestManager;

import com.api.workflow.bean.RightMenu;

/**
 * 功能 1：加载流程表单权限信息 2：加载右键菜单 3：加载签字意见相关基础数据
 * 
 * @author wuser0326
 * 
 */
public class RequestFormService extends BaseBean {
	private List<RightMenu> rightMenus;
	private HttpServletRequest request;
	private HttpServletResponse response;
	private HttpSession session;
	private User user;
	private int userid;
	private int usertype = 0;
	private String logintype;
	// private int isremark = -1;
	private int takisremark = -1;
	private int requestid;

	private int workflowid = 0; // 工作流id
	private int nodeid = 0; // 节点id
	private int formid = 0; // 表单或者单据的id
	private String isbill = "0"; // 是否单据 0:否 1:是
	private int lastOperator = 0; // 最后操作者id
	private String lastOperateDate = ""; // 最后操作日期
	private String lastOperateTime = ""; // 最后操作时间

	private String currentdate;
	private String currenttime;
	private RecordSet recordSet = new RecordSet();
	private char flag = Util.getSeparator();
	private String fromPDA; // 从PDA登录
	private boolean isprint;
	private List<String> topmenus;
	private Map<String,Object> hiddenarea = new HashMap<String,Object>();

	private void init() {
		session = request.getSession();

		String f_weaver_belongto_userid = request.getParameter("f_weaver_belongto_userid");
		String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");
		user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
		userid = user.getUID();
		usertype = "2".equals(user.getLogintype()) ? 1 : 0;
		logintype = user.getLogintype();

		requestid = Util.getIntValue(request.getParameter("requestid"), 0);
		Calendar today = Calendar.getInstance();
		currentdate = Util.add0(today.get(Calendar.YEAR), 4) + "-" + Util.add0(today.get(Calendar.MONTH) + 1, 2) + "-" + Util.add0(today.get(Calendar.DAY_OF_MONTH), 2);
		currenttime = Util.add0(today.get(Calendar.HOUR_OF_DAY), 2) + ":" + Util.add0(today.get(Calendar.MINUTE), 2) + ":" + Util.add0(today.get(Calendar.SECOND), 2);

		fromPDA = Util.null2String((String) session.getAttribute("loginPAD"));
		isprint = Util.null2String(request.getParameter("isprint")).equals("1");
		
		hiddenarea.put("requestid", requestid);
		hiddenarea.put("f_weaver_belongto_userid", userid);
		hiddenarea.put("f_weaver_belongto_usertype", usertype);
		hiddenarea.put("comemessage", Util.null2String(request.getParameter("comemessage")));
	}

	public RequestFormService(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.request = request;
		this.response = response;
		init();
	}

	public RequestFormService() {
	}

	/**
	 * 加载权限
	 * 
	 * @throws Exception
	 */
	public Map<String,Object> loadCompetence() throws Exception {
		long start = System.currentTimeMillis();
		Map<String, Object> resultDatas = new HashMap<String, Object>();
		WFLinkInfo wfLinkInfo = new WFLinkInfo();
		RecordSet rs = new RecordSet();
		SysWFLMonitor sysWFLMonitor = new SysWFLMonitor();
		WorkflowComInfo workflowComInfo = new WorkflowComInfo();
		WFUrgerManager wfUrgerManager = new WFUrgerManager();
		PoppupRemindInfoUtil poppupRemindInfoUtil = new PoppupRemindInfoUtil();
		WFShareAuthorization wfShareAuthorization = new WFShareAuthorization();
		ReportAuthorization reportAuthorization = new ReportAuthorization();
		CoworkDAO coworkDAO = new CoworkDAO();
		WFManager wfManager = new WFManager();
		RequestDoc flowDoc = new RequestDoc();
		WFForwardManager wfForwardManager = new WFForwardManager();
		WFCoadjutantManager wfCoadjutantManager = new WFCoadjutantManager();
		// 设置跳转
		resultDatas.put("sendPage", "");

		boolean isfromtab = Util.null2String(request.getParameter("isfromtab")).equals("true");
		String isworkflowhtmldoc = Util.null2String(request.getParameter("isworkflowhtmldoc"));
		String fromFlowDoc = Util.null2String(request.getParameter("fromFlowDoc")); // 是否从流程创建文档而来

		// info: ovfail 您对该流程已经失去强制归档权限!
		// info: rbfail 您对该流程已经失去强制收回权限!
		String info = Util.null2String(request.getParameter("infoKey"));
		int seeflowdoc = Util.getIntValue(request.getParameter("seeflowdoc"), 0);
		String isSubmitDirect = Util.null2String(request.getParameter("isSubmitDirect"));
		String wfdoc = Util.null2String((String) session.getAttribute(requestid + "_wfdoc"));
		// 是否显示提示 取值"true"或者"false"
		String isShowPrompt = Util.null2String(request.getParameter("isShowPrompt"));
		String viewdoc = Util.null2String(request.getParameter("viewdoc"));

		int isovertime = Util.getIntValue(request.getParameter("isovertime"), 0);
		int isonlyview = Util.getIntValue(request.getParameter("isonlyview"), 0);

		int reEdit = Util.getIntValue(request.getParameter("reEdit"), 1);// 是否为编辑
		int forwardflag = Util.getIntValue(request.getParameter("forwardflag"), 0);

		// 是否为公文
		String isworkflowdoc = "0";
		if (forwardflag != 2 && forwardflag != 3) {
			forwardflag = 1; // 2 征求意见；3 转办 ；1 转发
		}

		String isrequest = Util.null2String(request.getParameter("isrequest"));
		String nodetypedoc = Util.null2String(request.getParameter("nodetypedoc"));
		int desrequestid = 0;
		int wflinkno = Util.getIntValue(request.getParameter("wflinkno"));
		String fromoperation = Util.null2String(request.getParameter("fromoperation"));

		String src = Util.null2String(request.getParameter("src"));// 进入该界面前的操作，"submit"：提交，"reject"：退回。
		// TD4262 增加提示信息 开始
		if (requestid < 0) {// 异构系统跳转
			int _workflowid = Util.getIntValue(request.getParameter("_workflowid"), 0);
			int _workflowtype = Util.getIntValue(request.getParameter("_workflowtype"), 0);
			String sendPageUrl = "/workflow/request/ViewRequestOS.jsp?requestid=" + requestid + "&workflowid=" + _workflowid + "&sysid=" + _workflowtype;
			resultDatas.put("sendPage", sendPageUrl);
			return resultDatas;
		}

		// 签字意见传入流程存为文档参数
		session.setAttribute("isworkflowhtmldoc" + requestid, isworkflowhtmldoc);

		int wfcurrrid = 0;
		boolean canview = false; // 是否可以查看
		boolean isurger = false; // 督办人可查看
		boolean wfmonitor = false; // 流程监控人

		// nodeid = wfLinkInfo.getCurrentNodeid(requestid, userid,
		// Util.getIntValue(logintype, 1)); // 节点id
		/*
		String sql = "select t.nodeid from workflow_currentoperator t left join workflow_nodebase t1 on t.nodeid  = t1.id  where t.requestid=? and t.userid=? and t.usertype=? order by t.id desc";
		rs.executeQuery(sql, requestid, userid, usertype);
		if (rs.next()) {
			nodeid = Util.getIntValue(rs.getString(1), 0);
			canview = true;
			isrequest = "0";
		}
		if (nodeid < 1) {
			sql = "select t.currentnodeid from workflow_requestbase t left join workflow_nodebase t1 on t.currentnodeid = t1.id  where t.requestid= ?";
			rs.executeQuery(sql, requestid);
			if (rs.next()) {
				nodeid = Util.getIntValue(rs.getString(1), 0);
			}
		}
		String nodetype = wfLinkInfo.getNodeType(nodeid); // 节点类型 0:创建 1:审批
		*/
		String nodetype = "";
		// 检查用户查看权限
		// 检查用户是否可以查看和激活该工作流 (激活即是对删除的工作流,将删除状态改为删除前的状态)
		// canview = HrmUserVarify.checkUserRight("ViewRequest:View", user);
		// //有ViewRequest:View权限的人可以查看全部工作流
		// canactive = HrmUserVarify.checkUserRight("ViewRequest:Active", user);
		// //有ViewRequest:Active权限的人可以查看全部工作流
		// 当前用户表中该请求对应的信息 isremark为0为当前操作者,
		// isremark为1为当前被转发者,isremark为2为可跟踪查看者,isremark=5为干预人
		// RecordSet.executeProc("workflow_currentoperator_SByUs",userid+""+flag+usertype+flag+requestid+"");
		int preisremark = -1;// 如果是流程参与人，该值会被赋予正确的值，在初始化时先设为错误值，以解决主流程参与人查看子流程时权限判断问题。TD10126
		String isremarkForRM = "";
		int groupdetailid = 0;
		int takisremark = -1;

		recordSet.executeSql("select isremark,isreminded,preisremark,id,groupdetailid,nodeid,takisremark,(CASE WHEN isremark=9 THEN '7.5' "
				+ "WHEN (isremark=1 and takisremark=2) THEN '0.9' WHEN (preisremark=1 and takisremark=2) "
				+ "THEN '0.9' ELSE isremark END) orderisremark from workflow_currentoperator where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype
				+ " order by orderisremark,islasttimes desc ");
		boolean istoManagePage = false; // add by xhheng @20041217 for TD 1438
		while (recordSet.next()) {
			takisremark = Util.getIntValue(recordSet.getString("takisremark"), 0);
			String isremark = Util.null2String(recordSet.getString("isremark"));
			isremarkForRM = isremark;
			preisremark = Util.getIntValue(recordSet.getString("preisremark"), 0);
			wfcurrrid = Util.getIntValue(recordSet.getString("id"));
			groupdetailid = Util.getIntValue(recordSet.getString("groupdetailid"), 0);
			int tmpnodeid = Util.getIntValue(recordSet.getString("nodeid"));
			// modify by mackjoe at 2005-09-29 td1772
			// 转发特殊处理，转发信息本人未处理一直需要处理即使流程已归档
			if (isremark.equals("1") || isremark.equals("5") || isremark.equals("7") || isremark.equals("9") || (isremark.equals("0") && !nodetype.equals("3"))) {
				// modify by xhheng @20041217 for TD 1438
				istoManagePage = true;
				canview = true;
				nodeid = tmpnodeid;
				nodetype = wfLinkInfo.getNodeType(nodeid);
				break;
			}
			if (isremark.equals("8")) {
				canview = true;
				break;
			}
			canview = true;
			//计算nodeid， 不再重复计算
			isrequest = "0";
			if (nodeid <= 0) {
				nodeid = tmpnodeid;
				nodetype = wfLinkInfo.getNodeType(nodeid);
			}
		}


		//writeLog("---------216-----time:" + (System.currentTimeMillis() - start));
		//start = System.currentTimeMillis();

		if (isrequest.equals("1")) { // 从相关工作流过来,有查看权限
			RequestShare.addRequestViewRightInfo(request);
			requestid = RequestShare.parserRequestidinfo(request);
			if (requestid == 0)
				requestid = Util.getIntValue(request.getParameter("requestid"), 0);
			int tempnum_ = Util.getIntValue(String.valueOf(session.getAttribute("slinkwfnum")));
			for (int cx_ = 0; cx_ <= tempnum_; cx_++) {
				String requestidinfo_ = Util.null2String(session.getAttribute("resrequestid" + cx_));
				int resrequestid_ = RequestShare.parserRequestidinfo(requestidinfo_);
				int preqid = RequestShare.parserParentRequestidinfo(requestidinfo_);
				if (resrequestid_ == requestid) {
					desrequestid = Util.getIntValue(String.valueOf(session.getAttribute("desrequestid")), 0);// 父级流程ID
					rs.executeSql("select count(*) from workflow_currentoperator where userid=" + userid + " and usertype=" + usertype + " and requestid=" + desrequestid);
					if (rs.next()) {
						int counts = rs.getInt(1);
						if (counts > 0) {
							// 获取父流程ID
							boolean hasviewright = RequestShare.requestRightCheck(userid, usertype, String.valueOf(requestid), 1, String.valueOf(preqid), null);
							if (hasviewright) {
								canview = true;
								break;
							}
						} else {
							rs.executeSql("select count(*) from workflow_currentoperator where userid=" + userid + " and usertype=" + usertype + " and requestid=" + preqid);
							if (rs.next()) {
								counts = rs.getInt(1);
								if (counts > 0) {
									// 获取父流程ID
									boolean hasviewright = RequestShare.requestRightCheck(userid, usertype, String.valueOf(requestid), 1, String.valueOf(preqid), null);
									if (hasviewright) {
										canview = true;
										break;
									}
								}
							}
						}
					}
					if (!canview && desrequestid != 0) {
						canview = wfShareAuthorization.getWorkflowShareJurisdiction(String.valueOf(desrequestid), user);
					}
				}
			}
			session.setAttribute(requestid + "wflinkno", wflinkno + "");// 解决相关流程，不是流程操作人无权限打印的问题
		}

		// 只有是主子流程查看时，才去验证权限
		if (isrequest.equals("2") || isrequest.equals("3") || isrequest.equals("4")) {
			canview = SubWorkflowManager.hasRelation(request);
		}
		String isfromreport = Util.null2String(request.getParameter("isfromreport"));
		String isfromflowreport = Util.null2String(request.getParameter("isfromflowreport"));
		String reportid = Util.null2String(request.getParameter("reportid"));
		if (isfromreport.equals("1") && requestid != 0) {
			if (!canview) {
				canview = reportAuthorization.checkReportPrivilegesByRequest(request, user);
				session.setAttribute(userid + "_" + requestid + "reportid", "" + reportid);
				session.setAttribute(userid + "_" + requestid + "isfromreport", "" + isfromreport);
			}
		}
		if (isfromflowreport.equals("1") && requestid != 0) {
			if (!canview) {
				canview = reportAuthorization.checkFlowReportByRequest(request, user);
				session.setAttribute(userid + "_" + requestid + "reportid", "" + reportid);
				session.setAttribute(userid + "_" + requestid + "isfromflowreport", "" + isfromflowreport);
			}
		}
		//writeLog("---------285-----time:" + (System.currentTimeMillis() - start));
		//start = System.currentTimeMillis();
		String isSignInput = "0"; // 是否显示签字意见输入框
		String currentnodetype = "";
		int currentnodeid = 0;
		int creater = 0; // 请求的创建人
		int creatertype = 0; // 创建人类型 0: 内部用户 1: 外部用户
		int deleted = 0; // 请求是否删除 1:是 0或者其它 否
		int billid = 0; // 如果是单据,对应的单据表的id
		// TD:8835
		String workflowtype = ""; // 工作流种类
		int helpdocid = 0; // 帮助文档 id
		String workflowname = ""; // 工作流名称
		String status = ""; // 当前的操作类型
		String requestname = ""; // 请求名称
		String requestlevel = ""; // 请求重要级别 0:正常 1:重要 2:紧急
		String requestmark = ""; // 请求编号
		int currentstatus = -1;

		// 查询请求的相关工作流基本信息
		recordSet.executeProc("workflow_Requestbase_SByID", requestid + "");
		if (recordSet.next()) {
			status = Util.null2String(recordSet.getString("status"));
			requestname = Util.null2String(recordSet.getString("requestname"));
			requestlevel = Util.null2String(recordSet.getString("requestlevel"));
			requestmark = Util.null2String(recordSet.getString("requestmark"));
			creater = Util.getIntValue(recordSet.getString("creater"), 0);
			creatertype = Util.getIntValue(recordSet.getString("creatertype"), 0);
			deleted = Util.getIntValue(recordSet.getString("deleted"), 0);
			workflowid = Util.getIntValue(recordSet.getString("workflowid"), 0);
			currentnodeid = Util.getIntValue(recordSet.getString("currentnodeid"), 0);
			if (nodeid < 1)
				nodeid = currentnodeid;
			currentnodetype = Util.null2String(recordSet.getString("currentnodetype"));
			if (nodetype.equals(""))
				nodetype = currentnodetype;
			workflowname = workflowComInfo.getWorkflowname(workflowid + "");
			workflowtype = workflowComInfo.getWorkflowtype(workflowid + "");

			lastOperator = Util.getIntValue(recordSet.getString("lastOperator"), 0);
			lastOperateDate = Util.null2String(recordSet.getString("lastOperateDate"));
			lastOperateTime = Util.null2String(recordSet.getString("lastOperateTime"));
			currentstatus = Util.getIntValue(recordSet.getString("currentstatus"), -1);
		} else {
			resultDatas.put("sendPage", "/notice/Deleted.jsp?showtype=wf");
			return resultDatas;
		}

		// 判断当前工作流的当前节点，是否需要默认打开正文tab页
		//boolean isOpenTextTab = new WFDocumentManager().isOpenTextTab(workflowid + "", nodeid + "");
		//resultDatas.put("isOpenTextTab", isOpenTextTab);
		resultDatas.put("isOpenTextTab", false);
		// 从计划任务页面过来，有查看权限 Start
		int isworktask = Util.getIntValue(request.getParameter("isworktask"), 0);
		if (isworktask == 1) {
			int haslinkworktask = Util.getIntValue((String) session.getAttribute("haslinkworktask"), 0);
			if (haslinkworktask == 1) {
				int tlinkwfnum = Util.getIntValue((String) session.getAttribute("tlinkwfnum"), 0);
				int i_tmp = 0;
				for (i_tmp = 0; i_tmp < tlinkwfnum; i_tmp++) {
					int retrequestid = Util.getIntValue((String) session.getAttribute("retrequestid" + i_tmp), 0);
					if (retrequestid != requestid) {
						session.removeAttribute("retrequestid" + i_tmp);
						session.removeAttribute("deswtrequestid" + i_tmp);
						continue;
					}
					int deswtrequestid = Util.getIntValue((String) session.getAttribute("deswtrequestid" + i_tmp), 0);
					rs.execute("select * from worktask_requestbase where requestid=" + deswtrequestid);
					if (rs.next()) {
						int wt_id = Util.getIntValue(rs.getString("taskid"), 0);
						int wt_status = Util.getIntValue(rs.getString("status"), 1);
						int wt_creater = Util.getIntValue(rs.getString("creater"), 0);
						int wt_needcheck = Util.getIntValue(rs.getString("needcheck"), 0);
						int wt_checkor = Util.getIntValue(rs.getString("checkor"), 0);
						int wt_approverequest = Util.getIntValue(rs.getString("approverequest"), 0);
						if (wt_needcheck == 0) {
							wt_checkor = 0;
						}
						WTRequestManager wtRequestManager = new WTRequestManager(wt_id);
						wtRequestManager.setLanguageID(user.getLanguage());
						wtRequestManager.setUserID(user.getUID());
						Hashtable checkRight_hs = wtRequestManager.checkRight(deswtrequestid, wt_status, 0, wt_creater, wt_checkor, wt_approverequest);
						boolean canView_tmp = false;
						canView_tmp = (Util.null2String((String) checkRight_hs.get("canView"))).equalsIgnoreCase("true") ? true : false;
						if (canView_tmp == false) {
							checkRight_hs = wtRequestManager.checkTemplateRight(deswtrequestid, wt_status, 0, wt_creater, wt_checkor, wt_approverequest);
							canView_tmp = (Util.null2String((String) checkRight_hs.get("canView"))).equalsIgnoreCase("true") ? true : false;
						}
						if (canView_tmp == true) {
							canview = canView_tmp;
						}
					}
					session.removeAttribute("retrequestid" + i_tmp);
					session.removeAttribute("deswtrequestid" + i_tmp);
					session.setAttribute("haslinkworktask", "0");
					session.setAttribute("tlinkwfnum", "0");
					continue;
				}
			}

		}
		// 从计划任务页面过来，有查看权限 End
		session.removeAttribute(userid + "_" + requestid + "isremark");
		ArrayList canviewwff = (ArrayList) session.getAttribute("canviewwf");
		if (canviewwff != null)
			if (canviewwff.indexOf(requestid + "") > -1)
				canview = true;

		if (creater == userid && creatertype == usertype) { // 创建者本人有查看权限
			canview = true;
		}

		//writeLog("---------396-----time:" + (System.currentTimeMillis() - start));
		//start = System.currentTimeMillis();

		String IsFromWFRemark = "";
		if (currentnodetype.equals("3")) {
			IsFromWFRemark = "2";
		} else {
			if ("1".equals(isremarkForRM) || "0".equals(isremarkForRM) || "7".equals(isremarkForRM) || "8".equals(isremarkForRM) || "9".equals(isremarkForRM)) {
				IsFromWFRemark = "0";
			} else if ("2".equals(isremarkForRM)) {
				IsFromWFRemark = "1";
			}
		}
		session.setAttribute(userid + "_" + requestid + "IsFromWFRemark", "" + IsFromWFRemark);

		//writeLog("---------455-----time:" + (System.currentTimeMillis() - start));
		//start = System.currentTimeMillis();

		// add by mackjoe at 2008-10-15 td9423
		String isintervenor = Util.null2String(request.getParameter("isintervenor"));
		int intervenorright = 0;
		if (isintervenor.equals("1")) {
			intervenorright = sysWFLMonitor.getWFInterventorRightBymonitor(userid, requestid);
		}
		if (intervenorright > 0) {
			istoManagePage = false;
			canview = true;
			nodeid = currentnodeid;
			nodetype = currentnodetype;
			isSignInput = "1";
		}
		// add by mackjoe at 2006-04-24 td3994
		int urger = Util.getIntValue(request.getParameter("urger"), 0);
		session.setAttribute(userid + "_" + requestid + "urger", "" + urger);
		if (urger == 1) {
			canview = false;
			intervenorright = 0;
		}
		if (!canview) {
			isurger = wfUrgerManager.UrgerHaveWorkflowViewRight(requestid, userid, Util.getIntValue(logintype, 1));
		}
		int ismonitor = Util.getIntValue(request.getParameter("ismonitor"), 0);
		session.setAttribute(userid + "_" + requestid + "ismonitor", "" + ismonitor);
		if (ismonitor == 1) {
			canview = false;
			intervenorright = 0;
			isurger = false;
		}
		if (!canview && !isurger) {
			wfmonitor = wfUrgerManager.getMonitorViewRight(requestid, userid);
		}

		//writeLog("---------492-----time:" + (System.currentTimeMillis() - start));
		//start = System.currentTimeMillis();
		session.setAttribute(userid + "_" + requestid + "isintervenor", "" + isintervenor);
		session.setAttribute(userid + "_" + requestid + "intervenorright", "" + intervenorright);
		poppupRemindInfoUtil.updatePoppupRemindInfo(userid, 10, (logintype).equals("1") ? "0" : "1", requestid);
		poppupRemindInfoUtil.updatePoppupRemindInfo(userid, 14, (logintype).equals("1") ? "0" : "1", requestid);
		session.removeAttribute(userid + "_" + requestid + "currentusercanview");
		String iswfshare = "0";

		if (!canview && !isurger && !wfmonitor && !coworkDAO.haveRightToViewWorkflow(Integer.toString(userid), Integer.toString(requestid))) {
			//writeLog("---------503-----time:" + (System.currentTimeMillis() - start));
			//start = System.currentTimeMillis();
			if (!wfUrgerManager.UrgerHaveWorkflowViewRight(desrequestid, userid, Util.getIntValue(logintype, 1)) && !wfUrgerManager.getMonitorViewRight(desrequestid, userid)) {// 督办流程和监控流程的相关流程有查看权限
				// 判断流程共享权限
				if (urger != 1 && isurger != true) {
					canview = wfShareAuthorization.getWorkflowShareJurisdiction(String.valueOf(requestid), user);
					if (canview) {
						iswfshare = "1";
					}
				}
				if (!canview) {
					// boolean canShareView = false;
					// 获取通过群组分享相关的信息

					int isfromchatshare = Util.getIntValue(Util.null2String(request.getParameter("isfromchatshare")));
					int sharer = Util.getIntValue(Util.null2String(request.getParameter("sharer")));
					int sharegroupid = Util.getIntValue(Util.null2String(request.getParameter("sharegroupid")));

					// 验证是否具备分享的权限
					if (isfromchatshare == 1) {
						canview = ChatResourceShareManager.authority(user, ChatResourceShareManager.RESOURCETYPE_WORKLFOW, requestid, sharer, sharegroupid);
						if (canview) {
							nodeid = wfLinkInfo.getCurrentNodeid(requestid, sharer, 1); // 节点id
							nodetype = wfLinkInfo.getNodeType(nodeid);
						}
					}
				}

				if (!canview) {
					String fromModul = Util.null2String(request.getParameter("fromModul"));
					int modulResourceId = Util.getIntValue(Util.null2String(request.getParameter("modulResourceId")));

					if ("workplan".equals(fromModul) && modulResourceId > 0) {
						if (WorkPlanShareUtil.chkWFInWP(modulResourceId, requestid)) {
							int shareLevel = WorkPlanShareUtil.getShareLevel(modulResourceId + "", user);
							if (shareLevel > -1) {
								canview = true;
							}
						}
					} else if ("meeting".equals(fromModul) && modulResourceId > 0) {
						if (MeetingShareUtil.chkWFInMT(modulResourceId, requestid)) {
							int shareLevel = MeetingShareUtil.getShareLevel(modulResourceId + "", user);
							if (shareLevel > -1) {
								canview = true;
							}
						}
					}
					if (!canview) {
						// 检查建模关联授权
						String formmodeflag = Util.null2String(request.getParameter("formmode_authorize"));
						Map<String, String> formmodeAuthorizeInfo = new HashMap<String, String>();
						if (formmodeflag.equals("formmode_authorize")) {
							int modeId = 0;
							int formmodebillId = 0;
							int fieldid = 0;
							int formModeReplyid = 0;
							modeId = Util.getIntValue(request.getParameter("authorizemodeId"), 0);
							formmodebillId = Util.getIntValue(request.getParameter("authorizeformmodebillId"), 0);
							fieldid = Util.getIntValue(request.getParameter("authorizefieldid"), 0);
							formModeReplyid = Util.getIntValue(request.getParameter("authorizeformModeReplyid"), 0);
							String fMReplyFName = Util.null2String(request.getParameter("authorizefMReplyFName"));

							ModeRightInfo modeRightInfo = new ModeRightInfo();
							modeRightInfo.setUser(user);
							if (formModeReplyid != 0) {
								formmodeAuthorizeInfo = modeRightInfo.isFormModeAuthorize(formmodeflag, modeId, formmodebillId, fieldid, requestid, formModeReplyid, fMReplyFName);
							} else {
								formmodeAuthorizeInfo = modeRightInfo.isFormModeAuthorize(formmodeflag, modeId, formmodebillId, fieldid, requestid);
							}
						}
						if ("1".equals(formmodeAuthorizeInfo.get("AuthorizeFlag"))) {// 如果是表单建模的关联授权，那么直接有查看权限
							canview = true;
						}
					}
				}
				if ("0".equals(iswfshare) && !canview) {
					session.setAttribute(userid + "_" + requestid + "currentusercanview", "true");
					resultDatas.put("sendPage", "/notice/noright.jsp?isovertime=" + isovertime);
					return resultDatas;
				}
			}
		}
		resultDatas.put("iswfshare", iswfshare);

		//writeLog("---------582-----time:" + (System.currentTimeMillis() - start));
		//start = System.currentTimeMillis();

		session.setAttribute(userid + "_" + requestid + "iswfshare", "" + iswfshare);
		if (urger == 1 && isurger == true) {// 流程督办的入口，并且具有督办查看流程表单的权限
			nodeid = currentnodeid;
			nodetype = currentnodetype;
		}
		String isaffirmance = workflowComInfo.getNeedaffirmance("" + workflowid);// 是否需要提交确认
		// TD8715 获取工作流信息，是否显示流程图
		wfManager.setWfid(workflowid);
		wfManager.getWfInfo();
		String isShowChart = Util.null2String(wfManager.getIsShowChart());
		String needconfirm = Util.null2String(wfManager.getIsaffirmance());
		String isModifyLog = Util.null2String(wfManager.getIsModifyLog()); // 是否记录表单日志 by cyril on 2008-07-09 for
		
		recordSet.executeProc("workflow_Workflowbase_SByID", workflowid + "");
		// 把session存储在SESSION中，供浏览框调用，达到不同的流程可以使用同一浏览框，不同的条件
		session.setAttribute("workflowidbybrowser", workflowid + "");

		String isshared = Util.null2String(wfManager.getIsshared());// 是否允许共享
		String custompage = Util.null2String(wfManager.getCustompage());
		String isFree = Util.null2String(wfManager.getIsFree());
		if (recordSet.next()) {
			formid = Util.getIntValue(recordSet.getString("formid"), 0);
			isbill = "" + Util.getIntValue(recordSet.getString("isbill"), 0);
			helpdocid = Util.getIntValue(recordSet.getString("helpdocid"), 0);
			isshared = recordSet.getString("isshared");
			isFree = Util.null2String(recordSet.getString("isFree"));
		}
		resultDatas.put("isshared", isshared);
		resultDatas.put("custompage", custompage);
		resultDatas.put("isFree", isFree);
		
		session.setAttribute("__isbill", isbill);
		session.setAttribute("__formid", formid);

		recordSet.executeSql("select issignmustinput,ismode,showdes,printdes,toexcel from workflow_flownode where workflowid=" + workflowid + " and nodeid=" + nodeid);
		// 0：普通模式 1：模板模式 2：html模式
		String ismode = "";
		int showdes = 0;
		int printdes = 0;
		int toexcel = 0;
		if (recordSet.next()) {
			// 签字意见必填
			resultDatas.put("issignmustinput", Util.getIntValue(recordSet.getString("issignmustinput"), 0));
			ismode = Util.null2String(recordSet.getString("ismode"));
			showdes = Util.getIntValue(Util.null2String(recordSet.getString("showdes")), 0);
			printdes = Util.getIntValue(Util.null2String(recordSet.getString("printdes")), 0);
			toexcel = Util.getIntValue(Util.null2String(recordSet.getString("toexcel")), 0);
			resultDatas.put("ismode", ismode);
			resultDatas.put("toexcel", toexcel);
		}

		boolean isOrgBeforeCoadSubmit = false;
		if (isremarkForRM.equals("0")) {// 协办人已经提交后，由于勾选"未查看一直停留在待办"，所以主办人打开代办流程，直接就变成已办
			recordSet.execute("select c1.id from workflow_currentoperator c1 where c1.requestid=" + requestid
							+ " and c1.isremark='2' and c1.preisremark='7' "
							+ " and exists(select 1 from workflow_currentoperator c2 where c2.id="
							+ wfcurrrid
							+ " and c1.receivedate=c2.receivedate and c1.receivetime=c2.receivetime and c1.nodeid=c2.nodeid and c1.groupdetailid=c2.groupdetailid ) and exists(select id from workflow_groupdetail g where g.id=c1.groupdetailid and g.signtype='0')");
			if (recordSet.next()) {
				int c1id_t = Util.getIntValue(recordSet.getString("id"));
				if (c1id_t > 0) {
					isOrgBeforeCoadSubmit = true;
					isremarkForRM = "2";
					istoManagePage = false;
				}
			}
		}

		//writeLog("---------643-----time:" + (System.currentTimeMillis() - start));
		//start = System.currentTimeMillis();

		// 有查看流程权限时，加入主子流程相关的查看权限
		// if(canview){
		SubWorkflowManager.loadRelatedRequest(request);
		// }

		resultDatas.put("isurger", isurger);
		resultDatas.put("desrequestid", desrequestid);
		resultDatas.put("wfmonitor", wfmonitor);

		session.setAttribute(userid + "_" + requestid + "canview", canview + "");
		session.setAttribute(userid + "_" + requestid + "isurger", isurger + "");
		session.setAttribute(userid + "_" + requestid + "wfmonitor", wfmonitor + "");
		session.setAttribute(userid + "_" + requestid + "isrequest", isrequest);
		session.setAttribute(userid + "_" + requestid + "f_weaver_belongto_userid", userid);
		session.setAttribute(userid + "_" + requestid + "f_weaver_belongto_usertype", usertype);
		session.setAttribute(userid + "_" + requestid + "preisremark", preisremark + "");
		session.setAttribute(userid + "_" + requestid + "wfcurrrid", wfcurrrid + "");
		session.setAttribute(userid + "_" + requestid + "groupdetailid", groupdetailid + "");
		session.setAttribute(userid + "_" + requestid + "helpdocid", "" + helpdocid);
		session.setAttribute(userid + "_" + requestid + "isModifyLog", "" + isModifyLog);
		session.setAttribute(userid + "_" + requestid + "currentnodeid", "" + currentnodeid);
		session.setAttribute(userid + "_" + requestid + "currentnodetype", currentnodetype);
		session.setAttribute(userid + "_" + requestid + "isaffirmance", isaffirmance);
		session.setAttribute(userid + "_" + requestid + "reEdit", reEdit+"");
		session.setAttribute(userid + "_" + requestid + "workflowname", workflowname);
		request.setAttribute(userid + "_" + workflowid + "workflowname", workflowname);
		session.setAttribute(userid + "_" + requestid + "currentstatus", "" + currentstatus);
		
		resultDatas.put("currentnodeid", currentnodeid);
		resultDatas.put("currentnodetype", currentnodetype);
		
		// 判断是否有流程创建文档，并且在该节点是有正文字段
		boolean docFlag = flowDoc.haveDocFiled("" + workflowid, "" + nodeid);
		String docFlagss = docFlag ? "1" : "0";
		// 如果是流程存文档过来，则没有TAB页

		if (wfmonitor || isurger || !reportid.equals("") || !isrequest.equals("0")) {
			new RequestAddShareMode().addShareInof(requestid, userid);
		}

		if ("1".equals(isworkflowhtmldoc))
			docFlagss = "0";
		session.setAttribute("requestAdd" + requestid, docFlagss);

		if (!fromFlowDoc.equals("1")) {
			if (docFlag) {
				if (fromoperation.equals("1")) {
					if (!nodetypedoc.equals("0")) {
					} else {
						if ("1".equals(isShowChart)) {
							if (!docFlag) {
								resultDatas.put("sendPage", "/workflow/request/WorkflowDirection.jsp?requestid=" + requestid + "&workflowid=" + workflowid + "&isbill=" + isbill + "&formid=" + formid
										+ "&isfromtab=" + isfromtab + "&f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + usertype);
								return resultDatas;
							}
						} else {
						}
					}
				}
				session.setAttribute(userid + "_" + requestid + "requestname", requestname);
				session.setAttribute(userid + "_" + requestid + "requestmark", requestmark);
				session.setAttribute(userid + "_" + requestid + "status", status);
				isworkflowdoc = "1";
			}
		}

		// fromoperation=1表示对流程做过操作,当做提交，退回操作时返回到流程图页面。
		if (fromoperation.equals("1") && (src.equals("submit") || src.equals("reject"))) {
			// TODO JHY
		}

		wfForwardManager.init();
		wfForwardManager.setWorkflowid(workflowid);
		wfForwardManager.setNodeid(nodeid);
		wfForwardManager.setIsremark(isremarkForRM);
		wfForwardManager.setRequestid(requestid);
		wfForwardManager.setBeForwardid(wfcurrrid);
		wfForwardManager.getWFNodeInfo();
		String IsPendingForward = wfForwardManager.getIsPendingForward();
		String IsTakingOpinions = wfForwardManager.getIsTakingOpinions();
		String IsHandleForward = wfForwardManager.getIsHandleForward();
		String IsBeForward = wfForwardManager.getIsBeForward();
		String IsSubmitedOpinion = wfForwardManager.getIsSubmitedOpinion();
		String IsSubmitForward = wfForwardManager.getIsSubmitForward();
		String IsAlreadyForward = wfForwardManager.getIsAlreadyForward();
		String IsWaitForwardOpinion = wfForwardManager.getIsWaitForwardOpinion();
		String IsBeForwardSubmit = wfForwardManager.getIsBeForwardSubmit();
		String IsBeForwardModify = wfForwardManager.getIsBeForwardModify();
		String IsBeForwardPending = wfForwardManager.getIsBeForwardPending();
		String IsBeForwardTodo = wfForwardManager.getIsBeForwardTodo();
		String IsBeForwardSubmitAlready = wfForwardManager.getIsBeForwardSubmitAlready();
		String IsBeForwardAlready = wfForwardManager.getIsBeForwardAlready();
		String IsBeForwardSubmitNotaries = wfForwardManager.getIsBeForwardSubmitNotaries();
		String IsFromWFRemark_T = wfForwardManager.getIsFromWFRemark();
		boolean IsFreeWorkflow = wfForwardManager.getIsFreeWorkflow(requestid, nodeid, Util.getIntValue(isremarkForRM));
		String IsFreeNode = wfForwardManager.getIsFreeNode(nodeid);
		session.setAttribute(userid + "_" + requestid + "wfcurrrid", "" + wfcurrrid);
		wfForwardManager.setCurrentNodeId(currentnodeid);
		boolean IsCanSubmit = wfForwardManager.getCanSubmit();
		// boolean IsCanSubmit2=wfForwardManager.getCanSubmit(forwardflag);
		boolean IsBeForwardCanSubmitOpinion = wfForwardManager.getBeForwardCanSubmitOpinion();
		boolean IsCanModify = wfForwardManager.getCanModify();
		wfCoadjutantManager.getCoadjutantRights(groupdetailid);
		String coadsigntype = wfCoadjutantManager.getSigntype();
		String coadissubmitdesc = wfCoadjutantManager.getIssubmitdesc();
		String coadisforward = wfCoadjutantManager.getIsforward();
		String coadismodify = wfCoadjutantManager.getIsmodify();
		String coadispending = wfCoadjutantManager.getIspending();
		if (!IsCanModify && coadismodify.equals("1"))
			IsCanModify = true;
		if (nodeid != currentnodeid && coadismodify.equals("1") && isremarkForRM.equals("7"))
			IsCanModify = false;

		if (IsCanModify) {
			isSignInput = "1";
		}
		boolean coadCanSubmit = wfCoadjutantManager.getCoadjutantCanSubmit(requestid, wfcurrrid, isremarkForRM, coadsigntype);
		boolean isMainSubmitted = wfCoadjutantManager.isMainSubmitted();
		session.setAttribute(userid + "_" + requestid + "isMainSubmitted", "" + isMainSubmitted);
		session.setAttribute(userid + "_" + requestid + "coadsigntype", coadsigntype);
		session.setAttribute(userid + "_" + requestid + "coadissubmitdesc", coadissubmitdesc);
		session.setAttribute(userid + "_" + requestid + "coadisforward", coadisforward);
		session.setAttribute(userid + "_" + requestid + "coadismodify", coadismodify);
		session.setAttribute(userid + "_" + requestid + "coadispending", coadispending);
		session.setAttribute(userid + "_" + requestid + "coadCanSubmit", "" + coadCanSubmit);
		session.setAttribute(userid + "_" + requestid + "IsPendingForward", IsPendingForward);
		session.setAttribute(userid + "_" + requestid + "IsTakingOpinions", IsTakingOpinions);
		session.setAttribute(userid + "_" + requestid + "IsHandleForward", IsHandleForward);
		session.setAttribute(userid + "_" + requestid + "IsBeForward", IsBeForward);
		session.setAttribute(userid + "_" + requestid + "IsBeForwardTodo", IsBeForwardTodo);
		session.setAttribute(userid + "_" + requestid + "IsBeForwardSubmitAlready", IsBeForwardSubmitAlready);
		session.setAttribute(userid + "_" + requestid + "IsBeForwardAlready", IsBeForwardAlready);
		session.setAttribute(userid + "_" + requestid + "IsBeForwardSubmitNotaries", IsBeForwardSubmitNotaries);
		session.setAttribute(userid + "_" + requestid + "IsFromWFRemark_T", IsFromWFRemark_T);
		session.setAttribute(userid + "_" + requestid + "IsSubmitedOpinion", IsSubmitedOpinion);
		session.setAttribute(userid + "_" + requestid + "IsSubmitForward", IsSubmitForward);
		session.setAttribute(userid + "_" + requestid + "IsAlreadyForward", IsAlreadyForward);
		session.setAttribute(userid + "_" + requestid + "IsWaitForwardOpinion", IsWaitForwardOpinion);
		session.setAttribute(userid + "_" + requestid + "IsBeForwardSubmit", IsBeForwardSubmit);
		session.setAttribute(userid + "_" + requestid + "IsBeForwardModify", IsBeForwardModify);
		session.setAttribute(userid + "_" + requestid + "IsBeForwardPending", IsBeForwardPending);
		session.setAttribute(userid + "_" + requestid + "IsCanSubmit", "" + IsCanSubmit);
		session.setAttribute(userid + "_" + requestid + "IsBeForwardCanSubmitOpinion", "" + IsBeForwardCanSubmitOpinion);
		session.setAttribute(userid + "_" + requestid + "IsCanModify", "" + IsCanModify);
		session.setAttribute(userid + "_" + requestid + "IsFreeWorkflow", "" + IsFreeWorkflow);
		session.setAttribute(userid + "_" + requestid + "IsFreeNode", "" + IsFreeNode);

		// 判断可否转发
		int Forwardid = 0;
		recordSet.executeSql("select isremark,isreminded,preisremark,id,groupdetailid,nodeid from workflow_currentoperator where requestid=" + requestid + " and userid=" + userid + " and usertype="
				+ usertype + " order by isremark,id");
		while (recordSet.next()) {
			Forwardid = Util.getIntValue(recordSet.getString("id"));
		}
		String wfSQL = "select * from workflow_Forward where requestid=" + requestid + " and BeForwardid=" + Forwardid;
		recordSet.executeSql(wfSQL);
		if (recordSet.next()) {
			IsFromWFRemark_T = Util.null2String(recordSet.getString("IsFromWFRemark")); // 待办提交后被转发人是否可提交意见
			IsBeForwardTodo = Util.null2String(recordSet.getString("IsBeForwardTodo")); // 待办可转发
			IsBeForwardAlready = Util.null2String(recordSet.getString("IsBeForwardAlready")); // 已办被转发人可转发
			IsBeForward = Util.null2String(recordSet.getString("IsBeForward")); // 办结被转发人是否可转发
		}
		boolean canForwd = false;
		if (takisremark == -2 && "1".equals(IsAlreadyForward)) { // 征询意见人\
			canForwd = true;
		}
		if (takisremark == 2 && "1".equals(IsAlreadyForward)) { // 征询意见接收人\
			canForwd = true;
		}
		if (takisremark != 2) {
			if (("0".equals(IsFromWFRemark_T) && "1".equals(IsBeForwardTodo)) || ("1".equals(IsFromWFRemark_T) && "1".equals(IsBeForwardAlready))
					|| ("2".equals(IsFromWFRemark_T) && "1".equals(IsBeForward))) {
				canForwd = true;
			}
		}

		//writeLog("---------810-----time:" + (System.currentTimeMillis() - start));
		//start = System.currentTimeMillis();

		session.setAttribute(userid + "_" + requestid + "canForwd", "" + canForwd);

		boolean isPendingRemark = false;
		if ("0".equals(isremarkForRM))
			isPendingRemark = true;
		if (isremarkForRM.equals("8") || (isremarkForRM.equals("1") && !IsCanSubmit) || ("7".equals(isremarkForRM) && !coadCanSubmit) || isOrgBeforeCoadSubmit) {
			if (isremarkForRM.equals("1") && wfForwardManager.hasChildCanSubmit(requestid + "", userid + "")) {
				recordSet.executeProc("workflow_CurrentOperator_Copy", requestid + "" + flag + userid + flag + usertype + "");
			} else if (isremarkForRM.equals("8") || ("7".equals(isremarkForRM) && !coadCanSubmit) || isOrgBeforeCoadSubmit) {
				recordSet.executeProc("workflow_CurrentOperator_Copy", requestid + "" + flag + userid + flag + usertype + "");
			}
			if (currentnodetype.equals("3")) {
				recordSet.executeSql("update workflow_currentoperator set iscomplete=1 where requestid=" + requestid + " and userid=" + userid + " and usertype=" + usertype);
			}
			isPendingRemark = true;
			if (currentnodetype.equals("3")) {
				recordSet.executeSql("select isremark from workflow_currentoperator  where requestid=" + requestid + " and nodeid=" + nodeid + " and userid=" + userid + " and usertype=" + usertype);
				if (recordSet.next()) {
					isremarkForRM = Util.null2String(recordSet.getString("isremark"));
				} else {
					isremarkForRM = "2";
				}
			} else {
				isremarkForRM = "2";
			}
			session.setAttribute(userid + "_" + requestid + "isremarkForRM", isremarkForRM + "");
			istoManagePage = false;
		}

		session.setAttribute(userid + "_" + requestid + "isremarkForRM", isremarkForRM + "");
		session.setAttribute(userid + "_" + requestid + "takisremark", takisremark + "");
		session.setAttribute(userid + "_" + requestid + "isPendingRemark", "" + isPendingRemark);
		if (isbill.equals("1")) {
			recordSet.execute("select billformid,billid from workflow_form where requestid = " + requestid);
			//recordSet.executeProc("workflow_form_SByRequestid", requestid + "");
			if (recordSet.next()) {
				formid = Util.getIntValue(recordSet.getString("billformid"), 0);
				billid = Util.getIntValue(recordSet.getString("billid"));
			}
			if (formid == 207) {// 计划任务审批单单独处理
				// 特殊处理，直接跳转到计划任务界面，进行审批操作
				int approverequest = Util.getIntValue(request.getParameter("requestid"), 0);
				int wt_requestid = 0;
				rs.execute("select * from worktask_requestbase where approverequest=" + approverequest);
				if (rs.next()) {
					wt_requestid = Util.getIntValue(rs.getString("requestid"), 0);
				}
				resultDatas.put("sendPage", "/worktask/request/ViewWorktask.jsp?requestid=" + wt_requestid + "&f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + usertype);
				return resultDatas;
			}
		}

		// xwj for td3450 20060112
		if (istoManagePage && !isprint) {
			poppupRemindInfoUtil.updatePoppupRemindInfo(userid, 0, (logintype).equals("1") ? "0" : "1", requestid);
		} else {
			String updatePoppupFlag = Util.null2String(request.getParameter("updatePoppupFlag"));
			if (!"1".equals(updatePoppupFlag)) {
				poppupRemindInfoUtil.updatePoppupRemindInfo(userid, 1, (logintype).equals("1") ? "0" : "1", requestid);
			}
		}
		session.setAttribute(userid + "_" + requestid + "requestname", requestname);
		session.setAttribute(userid + "_" + requestid + "workflowid", "" + workflowid);
		session.setAttribute(userid + "_" + requestid + "nodeid", "" + nodeid);
		session.setAttribute(userid + "_" + requestid + "preisremark", "" + preisremark);
		if (((isremarkForRM.equals("0") || isremarkForRM.equals("1")) && !IsCanSubmit) || (isremarkForRM.equals("7") && !coadCanSubmit)) {
			istoManagePage = false;
		}
		session.setAttribute(userid + "_" + requestid + "formid", "" + formid);
		session.setAttribute(userid + "_" + requestid + "billid", "" + billid);
		session.setAttribute(userid + "_" + requestid + "isbill", isbill);
		session.setAttribute(userid + "_" + requestid + "nodetype", nodetype);
		session.setAttribute(userid + "_" + requestid + "creater", "" + creater);
		session.setAttribute(userid + "_" + requestid + "creatertype", "" + creatertype);
		session.setAttribute(userid + "_" + requestid + "requestlevel", requestlevel);
		boolean islock = false;
		String sendPageUrl = loadNodeModeInfo(isfromtab, resultDatas, printdes, showdes, billid);
		if (!"".equals(sendPageUrl)) {
			resultDatas.put("sendPage", sendPageUrl);
			return resultDatas;
		}

		resultDatas.put("workflowid", workflowid);
		resultDatas.put("nodeid", nodeid);
		resultDatas.put("nodetype", nodetype);
		resultDatas.put("formid", formid);
		resultDatas.put("isbill", isbill);
		resultDatas.put("isprint", isprint ? "1" : "0");

		//writeLog("---------902-----time:" + (System.currentTimeMillis() - start));
		//start = System.currentTimeMillis();

		// 标识当前流程在待办
		Map<String, Object> layoutmap = new HashMap<String, Object>();
		if ("2".equals(ismode)) {
			layoutmap = new LayoutInfoService().generateLayoutInfo(Util.null2String(resultDatas.get("modeid")));
		}
		resultDatas.put("layoutinfo", layoutmap);

		//writeLog("---------912-----time:" + (System.currentTimeMillis() - start));
		//start = System.currentTimeMillis();

		String titlename = SystemEnv.getHtmlLabelName(18015, user.getLanguage()) + ":" + SystemEnv.getHtmlLabelName(553, user.getLanguage()) + " - " + Util.toScreen(workflowname, user.getLanguage())
				+ " - " + status + " " + "<span id='requestmarkSpan'>" + requestmark + "</span>";
		
		resultDatas.put("titlename", titlename);
		resultDatas.put("hiddenarea", hiddenarea);
		
		resultDatas.put("requestid", requestid);
		resultDatas.put("f_weaver_belongto_userid", userid);
		
		//生成隐藏域信息
		hiddenarea.put("workflowid", workflowid);
		hiddenarea.put("workflowtype", workflowtype);
		hiddenarea.put("nodeid", nodeid);
		hiddenarea.put("nodetype", nodetype);
		hiddenarea.put("formid", formid);
		hiddenarea.put("isbill", isbill);
		hiddenarea.put("billid", billid);
		hiddenarea.put("iscreate", "0");
		hiddenarea.put("needcheck", "");
		hiddenarea.put("inputcheck", "");
		hiddenarea.put("src", "");
		hiddenarea.put("topage", "");
		hiddenarea.put("uploadType", "");
		hiddenarea.put("selectfieldvalue", "");
		hiddenarea.put("isMultiDoc", "");
		hiddenarea.put("needoutprint", "");
		hiddenarea.put("htmlfieldids", "");
		hiddenarea.put("annexmaxUploadImageSize", "");
		hiddenarea.put("isremark", "0");
		hiddenarea.put("currentdate", currentdate);
		hiddenarea.put("currenttime", currenttime);
		hiddenarea.put("creater", creater);
		hiddenarea.put("creatertype", creatertype);
		hiddenarea.put("ismode", ismode);
		hiddenarea.put("workflowRequestLogId", "");
		hiddenarea.put("RejectNodes", "");
		hiddenarea.put("RejectToNodeid", "");
		hiddenarea.put("RejectToType", "");
		hiddenarea.put("SubmitToNodeid", "");
		hiddenarea.put("remarkLocation", "");
		hiddenarea.put("isdialog", "1");
		hiddenarea.put("isovertime", "");
		hiddenarea.put("needwfback", "");
		hiddenarea.put("lastOperator", lastOperator);
		hiddenarea.put("lastOperateDate", lastOperateDate);
		hiddenarea.put("lastOperateTime", lastOperateTime);
		hiddenarea.put("needcheckLock", "false");
		//JS事件需要隐藏域
		hiddenarea.put("isCptwf", "");
		hiddenarea.put("isSubmitDirectNode", "");
		hiddenarea.put("lastnodeid", "");	//值在右键按钮里面计算
		hiddenarea.put("isSignMustInput", "");
		hiddenarea.put("isFormSignature", "");
		hiddenarea.put("needconfirm", needconfirm);
		hiddenarea.put("fromFlowDoc", "");
		hiddenarea.put("isworkflowdoc", "");
		hiddenarea.put("temphasUseTempletSucceed", "");
		hiddenarea.put("createdoc", "");
		hiddenarea.put("edesign_layout", "");
		
        // 默认动态加载签字意见
        boolean signListType = false;
        recordSet.executeSql("select signlisttype from workflow_RequestUserDefault where userId = " + user.getUID());
        if (recordSet.next()) {
            signListType = "0".equals(recordSet.getString("signlisttype"));
        }
        resultDatas.put("signListType", signListType);
		
		if (istoManagePage && !isprint && !wfmonitor && isonlyview != 1 && !"1".equals(isworkflowhtmldoc) && !islock) {
			int isremark = -1;
			isSignInput = "1";
			String topage = URLEncoder.encode(Util.null2String(request.getParameter("topage"))); // 返回的页面
			String docfileid = Util.null2String(request.getParameter("docfileid")); // 新建文档的工作流字段
			String newdocid = Util.null2String(request.getParameter("docid")); // 新建的文档
			String uselessFlag = Util.null2String(request.getParameter("uselessFlag"));
			// 加入下一节点的操作人与当前节点的操作人是同一人，需要重新判断是否跳转到正文tab页
			if ("submit".equals(src)) {
				uselessFlag = "";
			}

			session.setAttribute(userid + "_" + requestid + "status", status);
			session.setAttribute(userid + "_" + requestid + "requestmark", requestmark);
			session.setAttribute(userid + "_" + requestid + "deleted", "" + deleted);
			session.setAttribute(userid + "_" + requestid + "workflowtype", workflowtype);
			session.setAttribute(userid + "_" + requestid + "helpdocid", "" + helpdocid);
			session.setAttribute(userid + "_" + requestid + "newdocid", newdocid);
			session.setAttribute(userid + "_" + requestid + "lastOperator", "" + lastOperator);
			session.setAttribute(userid + "_" + requestid + "lastOperateDate", lastOperateDate);
			session.setAttribute(userid + "_" + requestid + "lastOperateTime", lastOperateTime);

			if (recordSet.getDBType().equals("oracle")) {
				recordSet.executeSql("update workflow_currentoperator set viewtype=-2,operatedate=( case isremark when '2' then operatedate else to_char(sysdate,'yyyy-mm-dd') end  ) ,operatetime=( case isremark when '2' then operatetime else to_char(sysdate,'hh24:mi:ss') end  ) where requestid = "
								+ requestid + "  and userid =" + userid + " and usertype = " + usertype + " and viewtype<>-2 ");
			} else if (recordSet.getDBType().equals("db2")) {
				recordSet.executeSql("update workflow_currentoperator set viewtype=-2,operatedate=( case isremark when '2' then operatedate else to_char(current date,'yyyy-mm-dd') end ),operatetime=( case isremark when '2' then operatetime else to_char(current time,'hh24:mi:ss') end ) where requestid = "
								+ requestid + "  and userid =" + userid + " and usertype = " + usertype + " and viewtype<>-2");
			} else {
				recordSet.executeSql("update workflow_currentoperator set viewtype=-2,operatedate=( case isremark when '2' then operatedate else convert(char(10),getdate(),20) end ),operatetime=( case isremark when '2' then operatetime else convert(char(8),getdate(),108) end ) where requestid = "
								+ requestid + "  and userid =" + userid + " and usertype = " + usertype + " and viewtype<>-2");// update
			}
			
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
			
			int isviewonly = 0;
			if (isremark != 0 || "3".equals(nodetype) || isprint) {
				isviewonly = 1;
			}
			if (IsCanModify) {
				isviewonly = 0;
			}
			if ("1".equals(isaffirmance) && reEdit == 0) {
				isviewonly = 0;
			}
			hiddenarea.put("isremark", isremark);
			
			resultDatas.put("ismanagePage", "1");
			resultDatas.put("isworkflowdoc", isworkflowdoc);
			resultDatas.put("docfileid", docfileid);
			resultDatas.put("isviewonly", isviewonly);
			resultDatas.put("isSignInput", isSignInput);
			//加载签字意见框信息
			resultDatas.put("signinputinfo", new SignInputService().loadSignInputInfo(request, response));
			
			return resultDatas;
		}

		if ("8".equals(isremarkForRM)) {
			new Thread(new RequestPreProcessing(workflowid, Util.getIntValue(isbill), formid, requestid, requestname, "", nodeid, 0, false, "", user, true)).start();
		}

		resultDatas.put("ismanagePage", "0");
		resultDatas.put("isviewonly", "0");
		resultDatas.put("isSignInput", isSignInput);
		resultDatas.put("signinputinfo","");

		//writeLog("---------967-----time:" + (System.currentTimeMillis() - start));
		//start = System.currentTimeMillis();
		return resultDatas;
	}

	/**
	 * 更新数据
	 * 
	 * @return
	 */
	public Map<String,Object> updateRequestInfoData() {
		Map<String,Object> apidatas = new HashMap<String,Object>();
		String ismanagePage = Util.null2String(request.getParameter("ismanagePage"));
		//view页面
		if ("0".equals(ismanagePage)) {

			String currentnodetype = Util.null2String(request.getParameter("currentnodetype"));
			boolean wfmonitor = "true".equals(Util.null2String(request.getParameter("wfmonitor")));
			boolean isurger = "true".equals(Util.null2String(request.getParameter("isurger")));
			boolean islog = true; // 是否记录查看日志

			updateOldData(isprint, currentnodetype, islog, wfmonitor, isurger);
		}
		return apidatas;
	}

	private String loadNodeModeInfo(boolean isfromtab, Map<String, Object> resultDatas, int printdes, int showdes, int billid) {
		String ismode = Util.null2String(resultDatas.get("ismode"));
		int modeid = 0;
		if (ismode.equals("1") && showdes != 1) {
			recordSet.executeSql("select id from workflow_nodemode where isprint='0' and workflowid=" + workflowid + " and nodeid=" + nodeid);
			if (recordSet.next()) {
				modeid = recordSet.getInt("id");
			} else {
				recordSet.executeSql("select id from workflow_formmode where isprint='0' and formid=" + formid + " and isbill='" + isbill + "'");
				if (recordSet.next()) {
					modeid = recordSet.getInt("id");
				}
			}
		} else if ("2".equals(ismode)) {
			weaver.workflow.exceldesign.HtmlLayoutOperate htmlLayoutOperate = new weaver.workflow.exceldesign.HtmlLayoutOperate();
			modeid = htmlLayoutOperate.getActiveHtmlLayout(workflowid, nodeid, 0);
		}

		/**
		 * 模板模式在非IE浏览器提示 String isIE = (String)
		 * session.getAttribute("browser_isie"); if
		 * (!isIE.equalsIgnoreCase("true") && ismode.equals("1") && modeid != 0) {
		 * String messageLableId = ""; if (ismode.equals("1")) { messageLableId =
		 * "18017"; } else { messageLableId = "23682"; } ismode = "0";
		 * 
		 * return "/wui/common/page/sysRemind.jsp?f_weaver_belongto_userid=" +
		 * userid + "&f_weaver_belongto_usertype=" + usertype + "&labelid=" +
		 * messageLableId; }
		 */
		if (fromPDA.equals("1") && ismode.equals("1")) {
			modeid = 0;
		}

		resultDatas.put("modeid", modeid);

		boolean isnotprintmode = Util.null2String(request.getParameter("isnotprintmode")).equals("1");
		if (ismode.equals("1") && !isnotprintmode && isprint && printdes != 1 && !fromPDA.equals("1")) {
			String sendPageUrl = "PrintMode.jsp?requestid=" + requestid + "&isbill=" + isbill + "&workflowid=" + workflowid + "&formid=" + formid + "&nodeid=" + nodeid + "&billid=" + billid
					+ "&isfromtab=" + isfromtab + "&f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + usertype + "&f_weaver_belongto_userid=" + userid
					+ "&f_weaver_belongto_usertype=" + usertype;

			return sendPageUrl;
		}
		return "";
	}

	private void addRightMenu(String menuName, String menuType, String target, String menuFun,String menuIcon) {
		RightMenu rightMenu = new RightMenu();
		rightMenu.setMenuName(menuName);
		rightMenu.setMenuType(menuType);
		rightMenu.setTarget(target);
		rightMenu.setMenuFun(menuFun);
		rightMenu.setIsTop(topmenus.contains(menuType)?"1":"0");
		rightMenu.setMenuIcon(menuIcon);
		rightMenus.add(rightMenu);
	}

	private void updateOldData(boolean isprint, String currentnodetype, boolean islog, boolean wfmonitor, boolean isurger) {
		RecordSet recordSet2 = new RecordSet();
		String clientip = request.getRemoteAddr();
		boolean isOldWf = false;
		recordSet.executeSql("select nodeid from workflow_currentoperator where requestid = " + requestid);
		while (recordSet.next()) {
			if (recordSet.getString("nodeid") == null || "".equals(recordSet.getString("nodeid")) || "-1".equals(recordSet.getString("nodeid"))) {
				isOldWf = true;
			}
		}

		if (!isprint) {
			recordSet.executeSql("update workflow_currentoperator set viewtype=-2 where requestid = " + requestid + "  and userid =" + userid + " and usertype = " + usertype + " and viewtype<>-2");
			recordSet.executeProc("workflow_CurOpe_UpdatebyView", "" + requestid + flag + userid + flag + usertype);
			if (!currentnodetype.equals("3"))
				recordSet.executeProc("SysRemindInfo_DeleteHasnewwf", "" + userid + flag + usertype + flag + requestid);
			else
				recordSet.executeProc("SysRemindInfo_DeleteHasendwf", "" + userid + flag + usertype + flag + requestid);
		}

		if (islog) {
			if (isOldWf) {// 老数据 , 相对 td2104 以前
				recordSet.executeProc("workflow_RequestViewLog_Insert", requestid + "" + flag + userid + "" + flag + currentdate + flag + currenttime + flag + clientip + flag + usertype + flag
						+ nodeid + flag + "9" + flag + -1);
			} else {
				int showorder = 10000;
				String orderType = "";
				recordSet.executeSql("select agentorbyagentid, agenttype, showorder from workflow_currentoperator where userid = " + userid + " and nodeid = " + nodeid + " and requestid = "
						+ requestid + " and isremark in ('0','1','4','5','8','9','7') and usertype = " + usertype);
				if (recordSet.next()) {
					orderType = "1"; // 当前节点操作人
					showorder = recordSet.getInt("showorder");
				} else {
					orderType = "2";// 非当前节点操作人
					recordSet2.executeSql("select max(showorder) from workflow_requestviewlog where id = " + requestid + "  and ordertype = '2' and currentnodeid = " + nodeid);
					recordSet2.next();
					if (recordSet2.getInt(1) != -1) {
						showorder = recordSet2.getInt(1) + 1;
					}
				}
				if (wfmonitor) {
					orderType = "3";// 流程监控人查看
				}
				if (isurger) {
					orderType = "4";// 流程督办人查看
				}
				recordSet.executeProc("workflow_RequestViewLog_Insert", requestid + "" + flag + userid + "" + flag + currentdate + flag + currenttime + flag + clientip + flag + usertype + flag
						+ nodeid + flag + orderType + flag + showorder);
			}
		}
	}

	/**
	 * 加载已办页面右键菜单
	 * 
	 * @throws Exception
	 */
	private void loadViewRightMenu(Map<String, Object> resultDatas) throws Exception {
		rightMenus = new ArrayList<RightMenu>();
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
		//TODO E9新功能
//		try {
//			recordSet.executeSql("select * from SystemCustomMenuSet");
//			if (recordSet.next()) {
//				if ("".equals(forwardName)) {
//					forwardName = Util.processBody(Util.null2String(recordSet.getString("forwardName")).trim(), "" + user.getLanguage());
//				}
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//		}

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
			addRightMenu(SystemEnv.getHtmlLabelName(615, user.getLanguage()), "btn_doIntervenor", "_self", "doIntervenor()","");
		} else {
			if ((preisremark != 8 || (preisremark == 8 && isremarkForRM.equals("2"))) && !wfmonitor) {
				if (isurger) {
					addRightMenu(SystemEnv.getHtmlLabelName(21223, user.getLanguage()), "btn_Supervise", "_self", "doSupervise()","");
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
						addRightMenu(forwardName, "btn_forward", "_self", "doReviewE9()","icon-Right-menu-Turn-to-do");
						_iscanforward = true;
					}

					if (haveBackright) {
						addRightMenu(SystemEnv.getHtmlLabelName(18359, user.getLanguage()), "btn_doRetract", "_self", "doRetract()","icon-Right-menu-Forcible");
					}
				}
			} else if (preisremark == 8 && !wfmonitor) {// 抄送不需要提交也有转发按钮TD9144
				if (!haveRestartright && ((IsSubmitForward.equals("1") && (preisremark == 0 || preisremark == 8 || preisremark == 9)) || (IsBeForward.equals("1") && preisremark == 1)) && canview
						&& !isrequest.equals("1") && isurger == false && !"1".equals(session.getAttribute("istest"))) {
					addRightMenu(forwardName, "btn_forward", "_self", "doReviewE9()","icon-Right-menu-Turn-to-do");
					_iscanforward = true;
				}
			}
			if (haveStopright)
				addRightMenu(SystemEnv.getHtmlLabelName(20387, user.getLanguage()), "btn_end", "_self", "doStop()","icon-Right-menu-suspend");

			if (haveCancelright)
				addRightMenu(SystemEnv.getHtmlLabelName(16210, user.getLanguage()), "btn_backSubscrible", "_self", "doCancel()","icon-Right-menu-Revoke");
			if (isModifyLog.equals("1") && preisremark > -1 && !isurger) // TD10126
				addRightMenu(SystemEnv.getHtmlLabelName(21625, user.getLanguage()), "btn_doViewModifyLog", "_self", "doViewModifyLog()","icon-Right-menu-Journal");
			if (!isurger && !wfmonitor)
				this.loadWXRemindMenu(recordSet, sqlselectNewName, newWFName, newSMSName, newCHATSName, t_workflowid);
		}
		if (haveRestartright)
			addRightMenu(SystemEnv.getHtmlLabelName(18095, user.getLanguage()), "btn_next", "_self", "doRestart()","icon-Right-menu-Enable");
		String ismode = Util.null2String(request.getParameter("ismode"));
		int toexcel = Util.getIntValue(Util.null2String(request.getParameter("toexcel")), 0);
		int modeid = Util.getIntValue(Util.null2String(request.getParameter("modeid")), 0);

		if (modeid > 0 && "1".equals(ismode) && toexcel == 1) {
			addRightMenu(SystemEnv.getHtmlLabelName(17416, user.getLanguage()), "btn_excel", "_self", "ToExcel()","");
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
				addRightMenu(triSubwfName, "btn_relateCwork", "_top", "triSubwf2(" + subwfSetId + ",'" + workflowNames + "')","icon-Right-menu-Trigger-process");
			}
		}
		addRightMenu(SystemEnv.getHtmlLabelName(257, user.getLanguage()), "btn_print", "_self", "openSignPrint()","icon-Right-menu-Print-log");
		String iswfshare = Util.null2String((String) session.getAttribute(userid + "_" + requestid + "iswfshare"));
		if (!"1".equals(iswfshare))
			addRightMenu(SystemEnv.getHtmlLabelName(21533, user.getLanguage()), "btn_collect", "_self", "doPrintViewLog()","icon-Right-menu-Print-log");

		if (WorkflowVersion.hasVersion(workflowid + ""))
			addRightMenu(WorkflowVersion.getAboutButtonName(user), "btn_version", "_self", "aboutVersion(" + WorkflowVersion.getVersionID(workflowid + "") + ")","");

		if (weaver.workrelate.util.TransUtil.istask()) {
			addRightMenu(SystemEnv.getHtmlLabelName(15266, user.getLanguage()), "", "_top", "doCreateTask()","icon-Right-menu-New-Flow");
			addRightMenu(SystemEnv.getHtmlLabelName(124912, user.getLanguage()), "", "_top", "openTaskList()","icon-Right-menu-task-list");
		}

		resultDatas.put("forward", _iscanforward ? "1" : "0");
		resultDatas.put("rightMenus", rightMenus);
	}

	public Map<String,Object> getRightMenu() throws Exception {
		Map<String,Object> apidatas = new HashMap<String,Object>();
		// ismanagePage 0:viewpage 1：managepage
		
		topmenus  = new ArrayList<String>();
		topmenus.add("btn_submit");
		topmenus.add("btn_draft");
		topmenus.add("btn_subbackName");
		topmenus.add("btn_wfSave");
		topmenus.add("btn_freeWf");
		topmenus.add("btn_subnobackName");
		topmenus.add("btn_forward");
		topmenus.add("btn_forwardback3");
		topmenus.add("btn_rejectName");
		topmenus.add("btn_print");
		topmenus.add("btn_Supervise");
		topmenus.add("btn_doIntervenor");
		
		String ismanagePage = Util.null2String(request.getParameter("ismanagePage"));
		if ("1".equals(ismanagePage)) {
			loadManageRightMenu(apidatas);
		} else {
			loadViewRightMenu(apidatas);
		}
		return apidatas;
	}

	/**
	 * 加载待办页面右键菜单
	 * 
	 * @throws Exception
	 */
	private void loadManageRightMenu(Map<String, Object> resultDatas) throws Exception {
		rightMenus = new ArrayList<RightMenu>();
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
		nodeid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "nodeid"), 0);
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
		
		String FreeWorkflowname="";
		recordSet.executeSql("select IsPendingForward,IsTakingOpinions,IsHandleForward,freewfsetcurnameen,freewfsetcurnametw,freewfsetcurnamecn from workflow_flownode where workflowid=" + workflowid + " and nodeid=" + nodeid);
		if (recordSet.next()) {
			IsPendingForward = Util.null2String(recordSet.getString("IsPendingForward"));
			IsTakingOpinions = Util.null2String(recordSet.getString("IsTakingOpinions"));
			IsHandleForward = Util.null2String(recordSet.getString("IsHandleForward"));
			
		    if(user.getLanguage() == 8){
		        FreeWorkflowname=Util.null2String(recordSet.getString("freewfsetcurnameen"));
		    }
		    else if(user.getLanguage() == 9){
		        FreeWorkflowname=Util.null2String(recordSet.getString("freewfsetcurnametw"));
		    }
		    else {
		        FreeWorkflowname=Util.null2String(recordSet.getString("freewfsetcurnamecn"));
		    }
		}
		if("".equals(FreeWorkflowname.trim())){
			FreeWorkflowname = SystemEnv.getHtmlLabelName(21781,user.getLanguage());
		}

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
		//TODO E9新功能
//		try {
//			recordSet.executeSql("select * from SystemCustomMenuSet");
//			if (recordSet.next()) {
//				default_submitName_0 = Util.processBody(Util.null2String(recordSet.getString("submitName_0")).trim(), "" + user.getLanguage());
//				default_submitName_1 = Util.processBody(Util.null2String(recordSet.getString("submitName_1")).trim(), "" + user.getLanguage());
//				default_forhandName = Util.processBody(Util.null2String(recordSet.getString("forhandName")).trim(), "" + user.getLanguage());
//				default_subName = Util.processBody(Util.null2String(recordSet.getString("subName")).trim(), "" + user.getLanguage());
//				default_takingOpinionsName = Util.processBody(Util.null2String(recordSet.getString("takingOpinionsName")).trim(), "" + user.getLanguage());
//				if ("".equals(HandleForwardName)) {
//					HandleForwardName = default_forhandName;
//				}
//				if ("".equals(forsubName)) {
//					forsubName = default_subName;
//				}
//				if ("".equals(ccsubName)) {
//					ccsubName = default_subName;
//				}
//				if ("".equals(givingopinionsName)) {
//					givingopinionsName = default_takingOpinionsName;
//				}
//				if ("".equals(submitDirectName)) {
//					submitDirectName = Util.processBody(Util.null2String(recordSet.getString("submitDirectName")).trim(), "" + user.getLanguage());
//				}
//				if ("".equals(forwardName)) {
//					forwardName = Util.processBody(Util.null2String(recordSet.getString("forwardName")).trim(), "" + user.getLanguage());
//				}
//				if ("".equals(saveName)) {
//					saveName = Util.processBody(Util.null2String(recordSet.getString("saveName")).trim(), "" + user.getLanguage());
//				}
//				if ("".equals(rejectName)) {
//					rejectName = Util.processBody(Util.null2String(recordSet.getString("rejectName")).trim(), "" + user.getLanguage());
//				}
//				if ("".equals(takingopinionsName)) {
//					takingopinionsName = Util.processBody(Util.null2String(recordSet.getString("takingOpName")).trim(), "" + user.getLanguage());
//				}
//			}
//		} catch (Exception e) {
//			//e.printStackTrace();
//			writeLog("SystemCustomMenuSet存储过程不存在!");
//		}

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

		if (!fromPDA.equals("1") && !wfmonitor) {
			if (isaffirmance.equals("1") && nodetype.equals("0") && !reEdit.equals("1")) {// 提交确认菜单
				if (IsCanSubmit || coadCanSubmit) {
					addRightMenu(SystemEnv.getHtmlLabelName(16634, user.getLanguage()), "btn_draft", "", "doSubmit_Pre()","icon-Right-menu-Approval");
					if (!"1".equals(isSubmitDirectNode)) {
						isSubmitDirect = Util.null2String(request.getParameter("isSubmitDirect"));
					}
				}
				addRightMenu(SystemEnv.getHtmlLabelName(93, user.getLanguage()), "btn_draft", "_self", "doEdit()","icon-Right-menu-edit");
			} else {
				if (isremark == 1 || isremark == 9) {
					if ("".equals(ifchangstatus)) {
						addRightMenu(submitname, "btn_submit", "_self", "doRemark_nNoBack()","icon-Right-menu-batch");
					} else {
						if (takisremark == 2) {
							if (!"1".equals(hastakingOpinionsback) && !"1".equals(hastakingOpinionsnoback) && isremark == 1 && takisremark == 2) {
								addRightMenu(submitname, "btn_subbackName", "_self", "doRemark_nBack()","icon-Right-menu-batch");
							}
						} else if ((!"1".equals(hasforback) && !"1".equals(hasfornoback) && isremark == 1) || (!"1".equals(hasccback) && !"1".equals(hasccnoback) && isremark == 9)) {
							addRightMenu(submitname, "btn_subbackName", "_self", "doRemark_nBack()","icon-Right-menu-batch");
						}
						if (takisremark == 2) {
							if (("1".equals(hastakingOpinionsback) && isremark == 1 && takisremark == 2)) {
								addRightMenu(subbackName, "btn_subbackName", "_self", "doRemark_nBack()","icon-Right-menu-batch");
							}
							if (("1".equals(hastakingOpinionsnoback) && isremark == 1 && takisremark == 2)) {
								addRightMenu(subnobackName, "btn_subnobackName", "_self", "doRemark_nNoBack()","icon-Right-menu-batch");
							}
						} else {
							if (("1".equals(hasforback) && isremark == 1) || ("1".equals(hasccback) && isremark == 9)) {
								addRightMenu(subbackName, "btn_subbackName", "_self", "doRemark_nBack()","icon-Right-menu-batch");
							}
							if (("1".equals(hasfornoback) && isremark == 1) || ("1".equals(hasccnoback) && isremark == 9)) {
								addRightMenu(subnobackName, "btn_subnobackName", "_self", "doRemark_nNoBack()","icon-Right-menu-batch");
							}
						}
					}

					if (isremark == 1 && IsCanModify) {
						addRightMenu(saveName, "btn_wfSave", "_self", "doSave_nNew()","");
					}
					if (((isremark == 1 && canForwd) || (isremark == 9 && IsPendingForward.equals("1"))) && !"1".equals(session.getAttribute("istest"))) {
						addRightMenu(forwardName, "btn_forward", "_self", "doReviewE9()","icon-Right-menu-Turn-to-do");
						_iscanforward = true;
					}
				} else if (isremark == 5) {
					if ("".equals(ifchangstatus)) {
						addRightMenu(submitname, "btn_submit", "_self", "doSubmitNoBack()","icon-Right-menu-batch");
					} else {
						if (!"1".equals(hasnoback)) {
							addRightMenu(subbackName, "btn_subbackName", "_self", "doSubmitBack()","icon-Right-menu-batch");
						} else {
							if ("1".equals(hasback)) {
								addRightMenu(subbackName, "btn_subbackName", "_self", "doSubmitBack()","icon-Right-menu-batch");
							}
							addRightMenu(subnobackName, "btn_subnobackName", "_self", "doSubmitNoBack()","icon-Right-menu-batch");
						}
					}
					if ("1".equals(isSubmitDirect)) {
						addRightMenu(submitDirectName, "btn_submit", "_self", "doSubmitDirect('Submit')","icon-Right-menu-Approval");
					}
				} else {
					String subfun = "Submit";
					if (IsCanSubmit || coadCanSubmit) {
						if (isaffirmance.equals("1") && nodetype.equals("0") && reEdit.equals("1")) {
							subfun = "Affirmance";
						}
						if ("".equals(ifchangstatus)) {
							addRightMenu(submitname, "btn_submit", "_self", "do" + subfun + "NoBack()","icon-Right-menu-Approval");
						} else {
							if ((!"1".equals(hasnoback) && !"1".equals(hasback))) {
								addRightMenu(submitname, "btn_subbackName", "_self", "do" + subfun + "Back()","icon-Right-menu-Approval");
							} else {
								if ("1".equals(hasback)) {
									addRightMenu(subbackName, "btn_subbackName", "_self", "do" + subfun + "Back()","icon-Right-menu-Approval");
								}
								if ("1".equals(hasnoback)) {
									addRightMenu(subnobackName, "btn_subnobackName", "_self", "do" + subfun + "NoBack()","icon-Right-menu-Approval");
								}
							}
						}
						if ("1".equals(isSubmitDirect)) {
							addRightMenu(submitDirectName, "btn_submit", "_self", "doSubmitDirect('"+subfun+"')","icon-Right-menu-Approval");
						}
						if (IsFreeWorkflow) {
							if (iscnodefree.equals("0")) {
								//TODO
								addRightMenu(FreeWorkflowname, "", "_self", "doFreeWorkflow()","icon-Right-menu-Flow-setting");
							}
						}
						if (isImportDetail) {
							addRightMenu(SystemEnv.getHtmlLabelName(26255, user.getLanguage()), "", "_self", "doImportDetail()","icon-Right-menu-Detailed");
						}
						addRightMenu(saveName, "btn_wfSave", "_self", "doSave_nNew()","");
						if (isreject.equals("1")) {
							if (isremark == 7 && coadsigntype.equals("2")) {
							} else {
								addRightMenu(rejectName, "btn_rejectName", "_self", "doReject_New()","icon-Right-menu--go-back");
							}
						}
					}
					if (IsPendingForward.equals("1") && !"1".equals(session.getAttribute("istest"))) { // 转发
						addRightMenu(forwardName, "btn_forward", "_self", "doReviewE9()","icon-Right-menu-Turn-to-do");
						_iscanforward = true;
					}
					// System.out.println("-I-1188----IsTakingOpinions-----"+IsTakingOpinions);
					if (IsTakingOpinions.equals("1") && !"1".equals(session.getAttribute("istest"))) { // 征求意见
						addRightMenu(takingopinionsName, "btn_forward", "_self", "doReview2()","icon-Right-menu-Advice");
					}
					// System.out.println("-I-1194----IsHandleForward-----"+IsHandleForward);
					if (IsHandleForward.equals("1")) { // 转办
						if ("".equals(ifchangstatus) && !"1".equals(session.getAttribute("istest"))) {
							addRightMenu(HandleForwardName, "btn_forward", "_self", "doReview3()","icon-Right-menu-Turn-to-do");
						} else {
							if ((!"1".equals(hasforhandnoback) && !"1".equals(hasforhandback) && !"1".equals(session.getAttribute("istest")))) {
								addRightMenu(HandleForwardName, "btn_forward", "_self", "doReview3()","icon-Right-menu-Turn-to-do");
							} else {
								if ("1".equals(hasforhandback) && !"1".equals(session.getAttribute("istest"))) {
									addRightMenu(forhandbackName, "btn_forwardback3", "_self", "doReviewback3()","icon-Right-menu-Turn-to-do");
								}
								if ("1".equals(hasforhandnoback)) {
									addRightMenu(forhandnobackName, "btn_forwardnobacke3", "_self", "doReviewnoback3()","icon-Right-menu-Turn-to-do");
								}
							}
						}
					}
					if (isreopen.equals("1") && false) {
						addRightMenu(SystemEnv.getHtmlLabelName(244, user.getLanguage()), "btn_doReopen", "_self", "doReopen()","");
					}
				}
				/* added by cyril on 2008-07-09 for TD:8835 */
				if (isModifyLog.equals("1")) {
					addRightMenu(SystemEnv.getHtmlLabelName(21625, user.getLanguage()), "btn_doViewModifyLog", "_self", "doViewModifyLog()","icon-Right-menu-Journal");
				}

				//
				this.loadWXRemindMenu(recordSet, sqlselectNewName, newWFName, newSMSName, newCHATSName, t_workflowid);
				/* TD9145 END */
				if ("1".equals(hasovertime) && isremark == 0) {
					if ("".equals(newOverTimeName)) {
						newOverTimeName = SystemEnv.getHtmlLabelName(18818, user.getLanguage());
					}
					addRightMenu(newOverTimeName, "btn_newSMSName", "_top", "onNewOverTime()","icon-Right-menu-overtime");
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
						addRightMenu(triSubwfName, "btn_relateCwork", "_top", "triSubwf2(" + subwfSetId + ",'" + workflowNames + "')","icon-Right-menu-Trigger-process");
					}
				}

				if (!isfromtab && !"1".equals(session.getAttribute("istest"))) {
					//addRightMenu(SystemEnv.getHtmlLabelName(1290, user.getLanguage()), "btn_back", "_self", "doBack()","icon-Right-menu-Return");
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
					addRightMenu(SystemEnv.getHtmlLabelName(18360, user.getLanguage()), "btn_doDrawBack", "_self", "doDrawBack()","icon-Right-menu-File");
				}
				if (haveBackright) {
					addRightMenu(SystemEnv.getHtmlLabelName(18359, user.getLanguage()), "btn_doRetract", "_self", "doRetract()","icon-Right-menu-Forcible");
				}
				if (haveStopright) {
					addRightMenu(SystemEnv.getHtmlLabelName(20387, user.getLanguage()), "btn_end", "_self", "doStop()","icon-Right-menu-suspend");
				}
				if (haveCancelright) {
					addRightMenu(SystemEnv.getHtmlLabelName(16210, user.getLanguage()), "btn_backSubscrible", "_self", "doCancel()","icon-Right-menu-Revoke");
				}
				if (haveRestartright) {
					addRightMenu(SystemEnv.getHtmlLabelName(18095, user.getLanguage()), "btn_next", "_self", "doRestart()","icon-Right-menu-Enable");
				}
				if (nodetype.equals("0") && isremark != 1 && isremark != 9 && isremark != 7 && isremark != 5 && wfFunctionManageUtil.IsShowDelButtonByReject(requestid, workflowid)) { // 创建节点(退回创建节点也是)
					addRightMenu(SystemEnv.getHtmlLabelName(91, user.getLanguage()), "btn_doDelete", "_self", "doDelete()","icon-Right-menu-delete");
				}
			}
			addRightMenu(SystemEnv.getHtmlLabelName(257, user.getLanguage()), "btn_print", "_self", "openSignPrint()","icon-Right-menu-Print-log");
		}
		addRightMenu(SystemEnv.getHtmlLabelName(21533, user.getLanguage()), "btn_collect", "_self", "doPrintViewLog()","icon-Right-menu-Print-log");

		/** 任务相关菜单 QC129917 * */
		if (weaver.workrelate.util.TransUtil.istask()) {
			addRightMenu(SystemEnv.getHtmlLabelName(15266, user.getLanguage()), "", "_top", "doCreateTask()","icon-Right-menu-New-Flow");
			addRightMenu(SystemEnv.getHtmlLabelName(124912, user.getLanguage()), "", "_top", "openTaskList()","icon-Right-menu-task-list");
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

	private void loadWXRemindMenu(RecordSet recordSet, String sqlselectNewName, String newWFName, String newSMSName, String newCHATSName, int t_workflowid) throws Exception {
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
					addRightMenu(newWFName, "btn_newWFName", "_top", "onNewRequest(" + t_workflowid + ", " + requestid + ",0)","icon-Right-menu-New-Flow");
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
					addRightMenu(newSMSName, "btn_newSMSName", "_top", "onNewSms(" + workflowid + ", " + nodeid + ", " + requestid + ", " + menuid + ")","icon-Right-menu-New-SMS");
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
					addRightMenu(newCHATSName, "btn_newSMSName", "_top", "onNewChats(" + workflowid + ", " + nodeid + ", " + requestid + ", " + menuid + ")","icon-Right-menu-WeChat");
				}
			}
		}
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
	
	/**
	 * 判断custompage字段复制对应文
	 * @param request
	 * @param response
	 * @return
	 */
	public Map<String,Object> copyCustompageFile(HttpServletRequest request,HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		String rootpath = GCONST.getRootPath();
		String custompage = Util.null2String(request.getParameter("custompage"));
		String custompagee9 = "";
		String workflowid  = request.getParameter("workflowid");
		
		if("".equals(custompage)){
			apidatas.put("custompagee9", custompagee9);
			return apidatas;
		}
		
		String[] fileDirInfos  = custompage.split("/");
		String srcfilename = fileDirInfos[fileDirInfos.length-1];
		String destfilename = srcfilename.replace(".", "_e9.");
		
		String srcfile = rootpath;
		String destfile = rootpath;
		for(int i = 0;i<fileDirInfos.length-1;i++){
			if("".equals(Util.null2String(fileDirInfos[i]))){
				continue;
			}
			srcfile += fileDirInfos[i] + File.separatorChar;
			destfile+= fileDirInfos[i] + File.separatorChar;
		}
		
		srcfile += srcfilename;
		destfile+= destfilename;
		
		boolean flag = copyFile(srcfile,destfile,false);
		if(flag){
			apidatas.put("custompagee9", custompage.replace(srcfilename, destfilename));
		}
		return apidatas;
	}
	
	public static void main(String[] args){
		String custompage = "/meeting/template/MeetingSubmitRequestJs.jsp";
		String[] fileDirInfos  = custompage.split("/");
		
		String srcfilename = fileDirInfos[fileDirInfos.length-1];
		String destfilename = srcfilename.replace(".", "_e9.");
		
		String srcfile = "";
		String destfile = "";
		
		
		for(int i = 0;i<fileDirInfos.length-1;i++){
			if("".equals(Util.null2String(fileDirInfos[i]))){
				continue;
			}
			srcfile += fileDirInfos[i] + File.separatorChar;
			destfile+= fileDirInfos[i] + File.separatorChar;
		}
		
		srcfile +=  srcfilename;
		destfile +=  destfilename;
		
		System.out.println(srcfile);
		System.out.println(destfile);
		
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

	public List<RightMenu> getRightMenus() {
		return rightMenus;
	}

	public void setRightMenus(List<RightMenu> rightMenus) {
		this.rightMenus = rightMenus;
	}

	public String getCurrentdate() {
		return currentdate;
	}

	public String getCurrenttime() {
		return currenttime;
	}
	
	/**
	 * 
	 * @param srcFileName 
	 * @param destFileName
	 * @param overlay 是否允许覆盖
	 * @return
	 */
	public static boolean copyFile(String srcFileName, String destFileName, boolean overlay) {
		File srcFile = new File(srcFileName);
		// 判断源文件是否存在
		if (!srcFile.exists()) {
			new BaseBean().writeLog("源文件：" + srcFileName + "不存在！");
			return false;
		} else if (!srcFile.isFile()) {
			new BaseBean().writeLog("复制文件失败，源文件：" + srcFileName + "不是一个文件！");
			return false;
		}

		File destFile = new File(destFileName);
		if (destFile.exists()) {
			//如果目标文件存在并允许覆盖
			if (overlay) {
				//删除已经存在的目标文件，无论目标文件是目录还是单个文件
				new File(destFileName).delete();
			} else {
				//表示文件已存在，不用复制
				return true;
			}
		} else {
			//如果目标文件所在目录不存在，则创建目录
			if (!destFile.getParentFile().exists()) {
				//目标文件所在目录不存在
				if (!destFile.getParentFile().mkdirs()) {
					//复制文件失败：创建目标文件所在目录失败
					return false;
				}
			}
		}

		// 复制文件
		int byteread = 0; // 读取的字节数
		InputStream in = null;
		OutputStream out = null;
		try {
			in = new FileInputStream(srcFile);
			out = new FileOutputStream(destFile);
			byte[] buffer = new byte[1024];
			while ((byteread = in.read(buffer)) != -1) {
				out.write(buffer, 0, byteread);
			}
			return true;
		} catch (FileNotFoundException e) {
			return false;
		} catch (IOException e) {
			return false;
		} finally {
			try {
				if (out != null)
					out.close();
				if (in != null)
					in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public Map<String,Object> getIsFromWFRemark(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String f_weaver_belongto_userid = request.getParameter("userid");// 需要增加的代码
		String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");// 需要增加的代码
		User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);// 需要增加的代码
		int requestid = Util.getIntValue(request.getParameter("requestid"), -1);
		RecordSet  rs = new RecordSet();
		int usertype = (user.getLogintype()).equals("1") ? 0 : 1;
		rs.executeSql("select isremark,isreminded,preisremark,id,groupdetailid,nodeid,takisremark,(CASE WHEN isremark=9 THEN '7.5' "
				+ "WHEN (isremark=1 and takisremark=2) THEN '0.9' WHEN (preisremark=1 and takisremark=2) "
				+ "THEN '0.9' ELSE isremark END) orderisremark from workflow_currentoperator where requestid=" + requestid + " and userid=" + user.getUID() + " and usertype=" + usertype
				+ " order by orderisremark,islasttimes desc ");
		String isremarkForRM = "";
		if(rs.next()){
			isremarkForRM = Util.null2String(rs.getString("isremark"));
		}
		
		rs.execute("select currentnodetype from workflow_requestbase where requestid  =  " + requestid);
		String currentnodetype = "";
		if(rs.next()){
			currentnodetype =  Util.null2String(rs.getString("currentnodetype"));
		}
		
		String IsFromWFRemark = "";
		if (currentnodetype.equals("3")) {
			IsFromWFRemark = "2";
		} else {
			if ("1".equals(isremarkForRM) || "0".equals(isremarkForRM) || "7".equals(isremarkForRM) || "8".equals(isremarkForRM) || "9".equals(isremarkForRM)) {
				IsFromWFRemark = "0";
			} else if ("2".equals(isremarkForRM)) {
				IsFromWFRemark = "1";
			}
		}
		request.getSession().setAttribute(user.getUID() + "_" + requestid + "IsFromWFRemark", "" + IsFromWFRemark);
		return new HashMap<String,Object>();
	}
}
