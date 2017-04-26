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
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import weaver.WorkPlan.WorkPlanShareUtil;
import weaver.conn.RecordSet;
import weaver.cowork.CoworkDAO;
import weaver.cpt.util.CptWfUtil;
import weaver.crm.Maint.CustomerInfoComInfo;
import weaver.file.FileUpload;
import weaver.formmode.setup.ModeRightInfo;
import weaver.general.BaseBean;
import weaver.general.GCONST;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.resource.ResourceComInfo;
import weaver.meeting.MeetingShareUtil;
import weaver.mobile.webservices.common.ChatResourceShareManager;
import weaver.mobile.webservices.workflow.soa.RequestPreProcessing;
import weaver.system.SysWFLMonitor;
import weaver.systeminfo.SystemEnv;
import weaver.workflow.msg.PoppupRemindInfoUtil;
import weaver.workflow.report.ReportAuthorization;
import weaver.workflow.request.RequestAddShareMode;
import weaver.workflow.request.RequestCheckUser;
import weaver.workflow.request.RequestDoc;
import weaver.workflow.request.RequestShare;
import weaver.workflow.request.SubWorkflowManager;
import weaver.workflow.request.WFCoadjutantManager;
import weaver.workflow.request.WFForwardManager;
import weaver.workflow.request.WFLinkInfo;
import weaver.workflow.request.WFShareAuthorization;
import weaver.workflow.request.WFUrgerManager;
import weaver.workflow.workflow.WFManager;
import weaver.workflow.workflow.WorkflowComInfo;
import weaver.worktask.worktask.WTRequestManager;

import com.api.workflow.util.RequestType;

/**
 * 功能 1：加载流程表单权限信息 2：加载右键菜单 3：加载签字意见相关基础数据
 * 
 * @author wuser0326
 * 
 */
public class RequestFormNewService extends BaseBean {
	
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
	private char flag = Util.getSeparator();
	private String fromPDA; // 从PDA登录
	private boolean isprint;
	private Map<String, Object> hiddenarea = new HashMap<String, Object>();

	private void init() {
		session = request.getSession();

		String f_weaver_belongto_userid = request.getParameter("f_weaver_belongto_userid");
		String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");
		user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
		userid = user.getUID();
		usertype = "2".equals(user.getLogintype()) ? 1 : 0;
		logintype = user.getLogintype();

		requestid = Util.getIntValue(request.getParameter("requestid"), -1);

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

	public RequestFormNewService(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.request = request;
		this.response = response;
		init();
	}

	public RequestFormNewService() {
	}

	/**
	 * 加载权限
	 * 
	 * @throws Exception
	 */
	public Map<String, Object> loadCompetence() throws Exception {
		RecordSet recordSet = new RecordSet();
		String iscreate = Util.null2String(request.getParameter("iscreate"));
		if ("1".equals(iscreate)) {
			return loadReqAddCompetence();
		}

		long start = System.currentTimeMillis();
		boolean isdebug = (userid == 8 || userid == 80 || userid == 1215 || userid == 1348 || userid == 3724 || userid == 4548);
		if (isdebug) {
			System.out.println("-131-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}
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
		 * String sql = "select t.nodeid from workflow_currentoperator t left
		 * join workflow_nodebase t1 on t.nodeid = t1.id where t.requestid=? and
		 * t.userid=? and t.usertype=? order by t.id desc"; rs.executeQuery(sql,
		 * requestid, userid, usertype); if (rs.next()) { nodeid =
		 * Util.getIntValue(rs.getString(1), 0); canview = true; isrequest =
		 * "0"; } if (nodeid < 1) { sql = "select t.currentnodeid from
		 * workflow_requestbase t left join workflow_nodebase t1 on
		 * t.currentnodeid = t1.id where t.requestid= ?"; rs.executeQuery(sql,
		 * requestid); if (rs.next()) { nodeid =
		 * Util.getIntValue(rs.getString(1), 0); } } String nodetype =
		 * wfLinkInfo.getNodeType(nodeid); // 节点类型 0:创建 1:审批
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

		if (isdebug) {
			System.out.println("-132-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}
		recordSet.executeSql("select isremark,isreminded,preisremark,id,groupdetailid,nodeid,takisremark,(CASE WHEN isremark=9 THEN '7.5'  WHEN (isremark = 4 ) THEN '1.5'"
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
			// 计算nodeid， 不再重复计算
			isrequest = "0";
			if (nodeid <= 0) {
				nodeid = tmpnodeid;
				nodetype = wfLinkInfo.getNodeType(nodeid);
			}
		}
		if (isdebug) {
			System.out.println("-133-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}

		// writeLog("---------216-----time:" + (System.currentTimeMillis() -
		// start));
		// start = System.currentTimeMillis();

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
		if (isdebug) {
			System.out.println("-134-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
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
		// writeLog("---------285-----time:" + (System.currentTimeMillis() -
		// start));
		// start = System.currentTimeMillis();
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

		if (isdebug) {
			System.out.println("-135-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}
		// 查询请求的相关工作流基本信息
		recordSet.executeProc("workflow_Requestbase_SByID", requestid + "");
		if (isdebug) {
			System.out.println("-136-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}
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
		if (isdebug) {
			System.out.println("-137-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}

		// 判断当前工作流的当前节点，是否需要默认打开正文tab页
		// boolean isOpenTextTab = new
		// WFDocumentManager().isOpenTextTab(workflowid + "", nodeid + "");
		// resultDatas.put("isOpenTextTab", isOpenTextTab);
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

		// writeLog("---------396-----time:" + (System.currentTimeMillis() -
		// start));
		// start = System.currentTimeMillis();

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

		// writeLog("---------455-----time:" + (System.currentTimeMillis() -
		// start));
		// start = System.currentTimeMillis();

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

		// writeLog("---------492-----time:" + (System.currentTimeMillis() -
		// start));
		// start = System.currentTimeMillis();
		session.setAttribute(userid + "_" + requestid + "isintervenor", "" + isintervenor);
		session.setAttribute(userid + "_" + requestid + "intervenorright", "" + intervenorright);
		resultDatas.put("intervenorright", intervenorright);
		poppupRemindInfoUtil.updatePoppupRemindInfo(userid, 10, (logintype).equals("1") ? "0" : "1", requestid);
		poppupRemindInfoUtil.updatePoppupRemindInfo(userid, 14, (logintype).equals("1") ? "0" : "1", requestid);
		session.removeAttribute(userid + "_" + requestid + "currentusercanview");
		String iswfshare = "0";

		if (isdebug) {
			System.out.println("-138-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}
		if (!canview && !isurger && !wfmonitor && !coworkDAO.haveRightToViewWorkflow(Integer.toString(userid), Integer.toString(requestid))) {
			// writeLog("---------503-----time:" + (System.currentTimeMillis() -
			// start));
			// start = System.currentTimeMillis();
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
		if (isdebug) {
			System.out.println("-139-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}
		resultDatas.put("iswfshare", iswfshare);

		// writeLog("---------582-----time:" + (System.currentTimeMillis() -
		// start));
		// start = System.currentTimeMillis();

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
		String isModifyLog = Util.null2String(wfManager.getIsModifyLog()); // 是否记录表单日志
																			// by
																			// cyril
																			// on
																			// 2008-07-09
																			// for

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
			recordSet
					.execute("select c1.id from workflow_currentoperator c1 where c1.requestid="
							+ requestid
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

		if (isdebug) {
			System.out.println("-1391-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}

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
		session.setAttribute(userid + "_" + requestid + "reEdit", reEdit + "");
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

		if (isdebug) {
			System.out.println("-1392-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
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

		// writeLog("---------810-----time:" + (System.currentTimeMillis() -
		// start));
		// start = System.currentTimeMillis();

		session.setAttribute(userid + "_" + requestid + "canForwd", "" + canForwd);
		if (isdebug) {
			System.out.println("-1393-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}

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
			// recordSet.executeProc("workflow_form_SByRequestid", requestid +
			// "");
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

		if (isdebug) {
			System.out.println("-1394-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}

		// 标识当前流程在待办
		Map<String, Object> layoutmap = new HashMap<String, Object>();
		if ("2".equals(ismode)) {
			layoutmap = new LayoutInfoService().generateLayoutInfo(Util.null2String(resultDatas.get("modeid")));
		}
		resultDatas.put("layoutinfo", layoutmap);

		// writeLog("---------912-----time:" + (System.currentTimeMillis() -
		// start));
		// start = System.currentTimeMillis();

		String titlename = SystemEnv.getHtmlLabelName(18015, user.getLanguage()) + ":" + SystemEnv.getHtmlLabelName(553, user.getLanguage()) + " - " + Util.toScreen(workflowname, user.getLanguage())
				+ " - " + status + " " + "<span id='requestmarkSpan'>" + requestmark + "</span>";

		resultDatas.put("titlename", titlename);
		resultDatas.put("hiddenarea", hiddenarea);

		resultDatas.put("requestid", requestid);
		resultDatas.put("f_weaver_belongto_userid", userid);

		// 生成隐藏域信息
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
		// JS事件需要隐藏域
		hiddenarea.put("isCptwf", "");
		hiddenarea.put("isSubmitDirectNode", "");
		hiddenarea.put("lastnodeid", ""); // 值在右键按钮里面计算
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

		if (isdebug) {
			System.out.println("-1395-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}
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
				recordSet
						.executeSql("update workflow_currentoperator set viewtype=-2,operatedate=( case isremark when '2' then operatedate else to_char(sysdate,'yyyy-mm-dd') end  ) ,operatetime=( case isremark when '2' then operatetime else to_char(sysdate,'hh24:mi:ss') end  ) where requestid = "
								+ requestid + "  and userid =" + userid + " and usertype = " + usertype + " and viewtype<>-2 ");
			} else if (recordSet.getDBType().equals("db2")) {
				recordSet
						.executeSql("update workflow_currentoperator set viewtype=-2,operatedate=( case isremark when '2' then operatedate else to_char(current date,'yyyy-mm-dd') end ),operatetime=( case isremark when '2' then operatetime else to_char(current time,'hh24:mi:ss') end ) where requestid = "
								+ requestid + "  and userid =" + userid + " and usertype = " + usertype + " and viewtype<>-2");
			} else {
				recordSet
						.executeSql("update workflow_currentoperator set viewtype=-2,operatedate=( case isremark when '2' then operatedate else convert(char(10),getdate(),20) end ),operatetime=( case isremark when '2' then operatetime else convert(char(8),getdate(),108) end ) where requestid = "
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

			resultDatas.put("requestType", RequestType.MANAGE_REQ.getId());
			resultDatas.put("isworkflowdoc", isworkflowdoc);
			resultDatas.put("docfileid", docfileid);
			resultDatas.put("isviewonly", isviewonly);
			resultDatas.put("isSignInput", isSignInput);
			// 加载签字意见框信息
			resultDatas.put("signinputinfo", new SignInputService().loadSignInputInfo(request, response));

			return resultDatas;
		}
		if (isdebug) {
			System.out.println("-1396-requestid-" + requestid + "-userid-" + userid + "-" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}

		if ("8".equals(isremarkForRM)) {
			new Thread(new RequestPreProcessing(workflowid, Util.getIntValue(isbill), formid, requestid, requestname, "", nodeid, 0, false, "", user, true)).start();
		}

		resultDatas.put("requestType", RequestType.VIEW_REQ.getId());
		resultDatas.put("isviewonly", "1");
		resultDatas.put("isSignInput", isSignInput);
		resultDatas.put("signinputinfo", "");

		// writeLog("---------967-----time:" + (System.currentTimeMillis() -
		// start));
		// start = System.currentTimeMillis();
		return resultDatas;
	}

	/**
	 * 更新数据
	 * 
	 * @return
	 */
	public Map<String, Object> updateRequestInfoData() {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		// view页面
		String currentnodetype = Util.null2String(request.getParameter("currentnodetype"));
		boolean wfmonitor = "true".equals(Util.null2String(request.getParameter("wfmonitor")));
		boolean isurger = "true".equals(Util.null2String(request.getParameter("isurger")));
		boolean islog = true; // 是否记录查看日志

		updateOldData(isprint, currentnodetype, islog, wfmonitor, isurger);
		return apidatas;
	}

	private String loadNodeModeInfo(boolean isfromtab, Map<String, Object> resultDatas, int printdes, int showdes, int billid) {
		RecordSet recordSet = new RecordSet();
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

	private Map<String, Object> loadReqAddCompetence() throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		apidatas.put("f_weaver_belongto_userid", user.getUID());
		RecordSet rs = new RecordSet();
		// 获得工作流的基本信息
		String workflowid = Util.null2String(request.getParameter("workflowid"));
		apidatas.put("workflowid", workflowid);

		CptWfUtil cptwfutil = new CptWfUtil();
		// 资产自定义流程类型
		String cptwftype = cptwfutil.getAllCptWftype("" + workflowid);
		boolean isCptwf = false;
		boolean ismodeCptwf = false;
		if (!"".equals(cptwftype)) {
			isCptwf = "fetch".equalsIgnoreCase(cptwftype) || "move".equalsIgnoreCase(cptwftype) || "lend".equalsIgnoreCase(cptwftype) || "discard".equalsIgnoreCase(cptwftype)
					|| "back".equalsIgnoreCase(cptwftype) || "loss".equalsIgnoreCase(cptwftype) || "mend".equalsIgnoreCase(cptwftype) || "mode_fetch".equalsIgnoreCase(cptwftype)
					|| "mode_move".equalsIgnoreCase(cptwftype) || "mode_lend".equalsIgnoreCase(cptwftype) || "mode_discard".equalsIgnoreCase(cptwftype) || "mode_back".equalsIgnoreCase(cptwftype)
					|| "mode_loss".equalsIgnoreCase(cptwftype) || "mode_mend".equalsIgnoreCase(cptwftype);
			ismodeCptwf = cptwftype.startsWith("mode_");
		}
		apidatas.put("ismodeCptwf", ismodeCptwf);
		apidatas.put("isCptwf", isCptwf);

		WorkflowComInfo wfComInfo = new WorkflowComInfo();
		String workflowname = wfComInfo.getWorkflowname(workflowid);
		workflowname = Util.processBody(workflowname, user.getLanguage() + "");
		String workflowtype = wfComInfo.getWorkflowtype(workflowid); // 工作流种类

		apidatas.put("workflowname", workflowname);
		apidatas.put("workflowtype", workflowtype);

		String nodeid = "";
		String formid = "";
		String isbill = "0";
		int helpdocid = 0;
		int messageType = 0;
		int chatsType = 0;// 微信提醒(QC:98106)
		int defaultName = 0;
		String smsAlertsType = "0";
		String chatsAlertType = "0";// 微信提醒(QC:98106)
		String docCategory = "";
		String isannexupload = "";
		String annexdocCategory = "";
		String needAffirmance = ""; // 是否需要提交确认

		String fromFlowDoc = Util.null2String(request.getParameter("fromFlowDoc")); // 是否从流程创建文档而来
		String isworkflowdoc = "0";// 是否是公文,1代表是

		FileUpload fu = new FileUpload(request);
		int userid = user.getUID();
		String logintype = user.getLogintype();
		String username = "";
		if (logintype.equals("1")) {
			ResourceComInfo resComInfo = new ResourceComInfo();
			username = Util.toScreen(resComInfo.getResourcename("" + userid), user.getLanguage());
		}
		if (logintype.equals("2")) {
			CustomerInfoComInfo cusComInfo = new CustomerInfoComInfo();
			username = Util.toScreen(cusComInfo.getCustomerInfoname("" + userid), user.getLanguage());
		}
		apidatas.put("username", username);

		String custompage = "";
		// 查询该工作流的表单id，是否是单据（0否，1是），帮助文档id
		rs.executeProc("workflow_Workflowbase_SByID", workflowid);
		if (rs.next()) {
			formid = Util.null2String(rs.getString("formid"));
			isbill = "" + Util.getIntValue(rs.getString("isbill"), 0);
			helpdocid = Util.getIntValue(rs.getString("helpdocid"), 0);
			// modify by xhheng @20050318 for TD1689,
			// 顺便将messageType、docCategory的获取统一至此
			messageType = rs.getInt("messageType");
			smsAlertsType = rs.getString("smsAlertsType");
			// 微信提醒START(QC:98106)
			chatsType = rs.getInt("chatsType");
			chatsAlertType = rs.getString("chatsAlertType");
			// 微信提醒END(QC:98106)
			defaultName = rs.getInt("defaultName");
			docCategory = rs.getString("docCategory");
			isannexupload = Util.null2String(rs.getString("isannexUpload"));
			annexdocCategory = Util.null2String(rs.getString("annexdoccategory"));
			needAffirmance = Util.null2o(rs.getString("needAffirmance"));
			custompage = Util.null2String(rs.getString("custompage"));
		}

		// 查询该工作流的当前节点id （即改工作流的创建节点 ）

		rs.executeProc("workflow_CreateNode_Select", workflowid);
		if (rs.next())
			nodeid = Util.null2String(rs.getString(1));

		apidatas.put("nodeid", nodeid);
		apidatas.put("formid", formid);
		apidatas.put("isbill", isbill);
		apidatas.put("nodeid", nodeid);
		apidatas.put("helpdocid", helpdocid);
		apidatas.put("messageType", messageType);
		apidatas.put("smsAlertsType", smsAlertsType);
		apidatas.put("chatsType", chatsType);
		apidatas.put("chatsAlertType", chatsAlertType);
		apidatas.put("defaultName", defaultName);
		apidatas.put("docCategory", docCategory);
		apidatas.put("isannexupload", isannexupload);
		apidatas.put("annexdocCategory", annexdocCategory);
		apidatas.put("needAffirmance", needAffirmance);
		apidatas.put("custompage", custompage);

		// 检查用户是否有创建权限
		RequestCheckUser requestCheckUser = new RequestCheckUser();
		requestCheckUser.setUserid(userid);
		requestCheckUser.setWorkflowid(Util.getIntValue(workflowid, 0));
		requestCheckUser.setLogintype(logintype);
		requestCheckUser.checkUser();
		int hasright = requestCheckUser.getHasright();

		int isagent = Util.getIntValue(request.getParameter("isagent"), 0);
		int beagenter = Util.getIntValue(request.getParameter("beagenter"), 0);
		if (isagent == 1) {
			hasright = 1;
		}
		apidatas.put("isagent", isagent);
		apidatas.put("beagenter", beagenter);
		apidatas.put("hasright", hasright);

		session.setAttribute(workflowid + "isagent" + user.getUID(), "" + isagent);
		session.setAttribute(workflowid + "beagenter" + user.getUID(), "" + beagenter);
		if (hasright == 0) {
			response.sendRedirect("/notice/noright.jsp");
			return apidatas;
		}
		// 判断是否有流程创建文档，并且在该节点是有正文字段
		RequestDoc flowDoc = new RequestDoc();
		boolean docFlag = flowDoc.haveDocFiled(workflowid, nodeid);
		String docFlagss = docFlag ? "1" : "0";
		session.setAttribute("requestAdd" + user.getUID(), docFlagss);

		apidatas.put("docFlagss", docFlagss);

		// 判断正文字段是否显示选择按钮
		ArrayList newTextList = flowDoc.getDocFiled(workflowid);
		if (newTextList != null && newTextList.size() > 0) {
			String newTextNodes = "" + newTextList.get(5);
			String flowDocField = "" + newTextList.get(1);
			session.setAttribute("requestFlowDocField" + user.getUID(), flowDocField);
			session.setAttribute("requestAddNewNodes" + user.getUID(), newTextNodes);
		}

		if (!fromFlowDoc.equals("1")) {
			if (docFlag) {
				isworkflowdoc = "1";
			}
		}
		apidatas.put("isworkflowdoc", isworkflowdoc);
		// 对不同的模块来说,可以定义自己相关的内容，作为请求默认值，比如将 docid 赋值，作为该请求的默认文档
		// 默认的值可以赋多个，中间用逗号格开
		String prjid = Util.null2String(request.getParameter("prjid"));
		String docid = Util.null2String(request.getParameter("docid"));
		String crmid = Util.null2String(request.getParameter("crmid"));
		String hrmid = Util.null2String(request.getParameter("hrmid"));
		String reqid = Util.null2String(request.getParameter("reqid"));
		if (hrmid.equals("") && logintype.equals("1"))
			hrmid = "" + userid;
		if (crmid.equals("") && logintype.equals("2"))
			crmid = "" + userid;

		apidatas.put("prjid", prjid);
		apidatas.put("docid", docid);
		apidatas.put("crmid", crmid);
		apidatas.put("hrmid", hrmid);
		apidatas.put("reqid", reqid);

		// 工作流建立完成后将返回的页面
		String topage = Util.null2String(request.getParameter("topage"));
		if (isbill.equals("1")) {
			session.setAttribute("topage_ForAllBill", topage);
		}

		Map fieldMap = request.getParameterMap();
		Set keySet = fieldMap.keySet();
		Iterator it = keySet.iterator();
		String fieldUrl = "";
		while (it.hasNext()) {
			String key = Util.null2String((String) it.next());
			if (key.startsWith("field")) {
				String[] valueArr = (String[]) fieldMap.get(key);
				for (int i = 0; i < valueArr.length; i++) {
					String value = valueArr[i];
					fieldUrl += "&" + key + "=" + URLEncoder.encode(value);
				}
			}
		}
		if (!"".equals(fieldUrl)) {
			fieldUrl = fieldUrl.substring(1, fieldUrl.length());
			fieldUrl = URLEncoder.encode(fieldUrl);
		}
		apidatas.put("fieldUrl", fieldUrl);

		// 请求提交的时候需要检查必输的字段名，多个必输项用逗号格开，requestname为新建请求中第一行的请求说明，是每一个请求都必须有的
		// TopTitle.jsp 页面参数
		String titlename = SystemEnv.getHtmlLabelName(18015, user.getLanguage()) + ":" + SystemEnv.getHtmlLabelName(125, user.getLanguage()) + " - " + Util.toScreen(workflowname, user.getLanguage())
				+ " - " + SystemEnv.getHtmlLabelName(125, user.getLanguage());

		// add by xhheng @20050206 for TD 1544，requestid设为-1
		String requestid = "-1";
		// add by mackjoe at 2005-12-20 增加模板应用
		String ismode = "";
		int modeid = 0, version = 0;
		int isform = 0;
		int showdes = 0;
		rs.executeSql("select ismode,showdes from workflow_flownode where workflowid=" + workflowid + " and nodeid=" + nodeid);
		if (rs.next()) {
			ismode = Util.null2String(rs.getString("ismode"));
			showdes = Util.getIntValue(Util.null2String(rs.getString("showdes")), 0);
		}

		if (ismode.equals("1") && showdes != 1) {
			rs.executeSql("select id from workflow_nodemode where isprint='0' and workflowid=" + workflowid + " and nodeid=" + nodeid);
			if (rs.next()) {
				modeid = rs.getInt("id");
			} else {
				rs.executeSql("select id from workflow_formmode where isprint='0' and formid=" + formid + " and isbill=" + isbill);
				if (rs.next()) {
					modeid = rs.getInt("id");
					isform = 1;
				}
			}
		} else if ("2".equals(ismode)) {
			weaver.workflow.exceldesign.HtmlLayoutOperate htmlLayoutOperate = new weaver.workflow.exceldesign.HtmlLayoutOperate();
			modeid = htmlLayoutOperate.getActiveHtmlLayout(Util.getIntValue(workflowid), Util.getIntValue(nodeid), 0);
			version = htmlLayoutOperate.getLayoutVersion(modeid);
		}
		apidatas.put("ismode", ismode);
		apidatas.put("modeid", modeid);
		apidatas.put("version", version);
		apidatas.put("isform", isform);
		apidatas.put("requestid", requestid);
		apidatas.put("titlename", titlename);
		apidatas.put("requestType", RequestType.CREATE_REQ.getId());
		apidatas.put("isviewonly", "0");
		apidatas.put("iscreate", "1");
		return apidatas;
	}



	private void updateOldData(boolean isprint, String currentnodetype, boolean islog, boolean wfmonitor, boolean isurger) {
		RecordSet recordSet = new RecordSet();
		RecordSet recordSet2 = new RecordSet();
		String clientip = request.getRemoteAddr();
		boolean isOldWf = false;
		recordSet.executeSql("select nodeid from workflow_currentoperator where requestid = " + requestid);
		while (recordSet.next()) {
			if (recordSet.getString("nodeid") == null || "".equals(recordSet.getString("nodeid")) || "-1".equals(recordSet.getString("nodeid"))) {
				isOldWf = true;
			}
		}

		String sql = "select t.nodeid from workflow_currentoperator t left join workflow_nodebase t1 on t.nodeid  = t1.id  where t.requestid=? and t.userid=? and t.usertype=? order by t.id desc";
		recordSet.executeQuery(sql, requestid, userid, usertype);
		if (recordSet.next()) {
			nodeid = Util.getIntValue(recordSet.getString(1), 0);
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
	 * 判断custompage字段复制对应文
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public Map<String, Object> copyCustompageFile(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		String rootpath = GCONST.getRootPath();
		String custompage = Util.null2String(request.getParameter("custompage"));
		String custompagee9 = "";
		String workflowid = request.getParameter("workflowid");

		if ("".equals(custompage)) {
			apidatas.put("custompagee9", custompagee9);
			return apidatas;
		}

		String[] fileDirInfos = custompage.split("/");
		String srcfilename = fileDirInfos[fileDirInfos.length - 1];
		String destfilename = srcfilename.replace(".", "_e9.");

		String srcfile = rootpath;
		String destfile = rootpath;
		for (int i = 0; i < fileDirInfos.length - 1; i++) {
			if ("".equals(Util.null2String(fileDirInfos[i]))) {
				continue;
			}
			srcfile += fileDirInfos[i] + File.separatorChar;
			destfile += fileDirInfos[i] + File.separatorChar;
		}

		srcfile += srcfilename;
		destfile += destfilename;

		boolean flag = copyFile(srcfile, destfile, false);
		if (flag) {
			apidatas.put("custompagee9", custompage.replace(srcfilename, destfilename));
		}
		return apidatas;
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
	 * @param overlay
	 *            是否允许覆盖
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
			// 如果目标文件存在并允许覆盖
			if (overlay) {
				// 删除已经存在的目标文件，无论目标文件是目录还是单个文件
				new File(destFileName).delete();
			} else {
				// 表示文件已存在，不用复制
				return true;
			}
		} else {
			// 如果目标文件所在目录不存在，则创建目录
			if (!destFile.getParentFile().exists()) {
				// 目标文件所在目录不存在
				if (!destFile.getParentFile().mkdirs()) {
					// 复制文件失败：创建目标文件所在目录失败
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

	public Map<String, Object> getIsFromWFRemark(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String f_weaver_belongto_userid = request.getParameter("userid");// 需要增加的代码
		String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");// 需要增加的代码
		User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);// 需要增加的代码
		int requestid = Util.getIntValue(request.getParameter("requestid"), -1);
		RecordSet rs = new RecordSet();
		int usertype = (user.getLogintype()).equals("1") ? 0 : 1;
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
		return new HashMap<String, Object>();
	}
}
