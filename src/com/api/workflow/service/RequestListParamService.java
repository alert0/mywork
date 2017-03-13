package com.api.workflow.service;

import java.util.*;

import java.sql.Timestamp;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.search.SearchClause;
import weaver.systeminfo.menuconfig.LeftMenuInfo;
import weaver.systeminfo.menuconfig.LeftMenuInfoHandler;
import com.api.workflow.bean.RequestListParam;
//import weaver.workflow.request.todo.RequestUtil;
import weaver.workflow.workflow.WorkflowComInfo;
import weaver.workflow.workflow.WorkflowVersion;

public class RequestListParamService {

	/**
	 * 生成待办、已办、我的请求分页数据参数/查询条件等
	 */
	public RequestListParam generateParams(HttpServletRequest request, HttpServletResponse response) throws Exception{
		User user = HrmUserVarify.getUser(request, response);
		SearchClause SearchClause = new SearchClause();
		Map<String,String> reqparams = new HashMap<String,String>();
		
		//参数封装到bean对象
		RequestListParam parambean = new RequestListParam();
		parambean.setUser(user);
		parambean.setSearchClause(SearchClause);
		parambean.setReqparams(reqparams);
		
		HttpSession session = request.getSession();
		RecordSet RecordSet = new RecordSet();
		//RequestUtil requestutil = new RequestUtil();
		WorkflowComInfo WorkflowComInfo = new WorkflowComInfo();

		session.removeAttribute("branchid");
		session.setAttribute("orientSearchClause", SearchClause);
		String whereclause = "";
		String whereclause2 = "";
		String whereclause_menu = "";
		String orderclause = "";
		String orderclause2 = "";

		String resourceid = Util.null2String(request.getParameter("resourceid"));
		if ("".equals(resourceid))
			resourceid = "" + user.getUID();
		
		String userid = resourceid;
		boolean isoracle = (RecordSet.getDBType()).equals("oracle");
		boolean isdb2 = (RecordSet.getDBType()).equals("db2");
		int usertype = 0;
		if("2".equals(user.getLogintype()))
			usertype = 1;
		if (userid.equals(""))
			userid = "" + user.getUID();

		String belongtoshow = "";
		RecordSet.executeSql("select * from HrmUserSetting where resourceId = " + userid);
		if (RecordSet.next())
			belongtoshow = RecordSet.getString("belongtoshow");
		//QC235172,如果不是查看自己的代办，主从账号统一显示不需要判断
		if (!"".equals(resourceid) && !userid.equals(resourceid))
			belongtoshow = "";
		String userIDAll = String.valueOf(userid);
		String Belongtoids = user.getBelongtoids();
		if (!"".equals(Belongtoids))
			userIDAll = userid + "," + Belongtoids;

		SearchClause.resetClause();
		String method = Util.null2String(request.getParameter("method"));
		String scope = Util.null2String(request.getParameter("viewScope"));
		String overtime = Util.null2String(request.getParameter("overtime"));
		String fromPDA = Util.null2String((String) session.getAttribute("loginPAD")); //从PDA登录
		String complete1 = Util.null2String(request.getParameter("complete"));
		String workflowidtemp = Util.null2String(request.getParameter("workflowid"));
		String wftypetemp = Util.null2String(request.getParameter("wftype"));
		String cdepartmentid = Util.null2String(request.getParameter("cdepartmentid"));
		int date2during = Util.getIntValue(Util.null2String(request.getParameter("date2during")), 0);
		//int viewType = Util.getIntValue(Util.null2String(request.getParameter("viewType")), 0);
		//int isajaxfresh = Util.getIntValue(Util.null2String(request.getParameter("isajaxfresh")), -1);
		String complete = Util.null2String(request.getParameter("complete"));
		int viewcondition = Util.getIntValue(request.getParameter("viewcondition"), 0);
		String processing = "";
		//System.out.println("method--  "+method+"  --complete--  "+complete+"  --viewcondition--  "+viewcondition);
		
		//boolean isopenofs = requestutil.getOfsSetting().getIsuse() == 1;
		//boolean showdone = requestutil.getOfsSetting().getShowdone().equals("1");
		boolean isopenofs = false;
		boolean showdone = false;
		
		//重构reqparams对象参数
		reqparams.put("resourceid", resourceid);
		if (complete.equals("0") || complete.equals("3") || complete.equals("4"))
			reqparams.put("iswaitdo", "1");
		
		//set排序字段
		if ("doing".equals(scope)) {
			orderclause = "t2.receivedate ,t2.receivetime ";
			orderclause2 = orderclause;
		} else if ("done".equals(scope)) {
			orderclause = "operatedate, operatetime ";
			orderclause2 = orderclause;
		} else if ("mine".equals(scope)){
			orderclause = "t1.createdate, t1.createtime ";
			orderclause2 = orderclause;
		}
		SearchClause.setOrderClause(orderclause);
		SearchClause.setOrderClause2(orderclause2);
		
		//门户菜单sql条件
		int fromAdvancedMenu = Util.getIntValue(request.getParameter("fromadvancedmenu"), 0);
		if (fromAdvancedMenu == 1) {
			String selectedContent = Util.null2String(request.getParameter("selectedContent"));
			int infoId = Util.getIntValue(request.getParameter("infoId"), 0);
			String selectedworkflow = "";
			String inSelectedWorkflowStr = "";
			LeftMenuInfoHandler infoHandler = new LeftMenuInfoHandler();
			LeftMenuInfo info = infoHandler.getLeftMenuInfo(infoId);
			if (info != null) {
				selectedworkflow = info.getSelectedContent();
			}
			if (!"".equals(selectedContent)) {
				selectedworkflow = selectedContent;
			}
			List selectedWorkflowIdList = Util.TokenizerString(selectedworkflow, "|");
			for (Iterator it = selectedWorkflowIdList.iterator(); it.hasNext();) {
				String tmpstr = (String) it.next();
				if (tmpstr.indexOf("W") > -1)
					inSelectedWorkflowStr += "," + tmpstr.substring(1);
			}
			if (inSelectedWorkflowStr.substring(0, 1).equals(","))
				inSelectedWorkflowStr = inSelectedWorkflowStr.substring(1);
			whereclause_menu = " and t1.workflowid in ("+ WorkflowVersion.getAllVersionStringByWFIDs(inSelectedWorkflowStr) + ") ";
		}
		
		//拼接sql条件
		whereclause = " (t1.deleted=0 or t1.deleted is null)  ";
		if("doing".equals(scope) && ("all".equals(method) || "reqeustbytype".equals(method) || "reqeustbywfid".equals(method))){
			if("reqeustbytype".equals(method)){
				String wftype = Util.null2String(request.getParameter("wftype"));
				whereclause += whereclause_menu;
				whereclause += " and t1.workflowid in( select id from workflow_base where workflowtype = " + wftype + ") ";
				if (isopenofs)
					whereclause2 += " and workflowid in (select workflowid from ofs_workflow where sysid=" + wftype+ " and cancel=0 )";
			}else if("reqeustbywfid".equals(method)){
				String workflowid = Util.null2String(request.getParameter("workflowid"));
				if (!"".equals(workflowid)) {
					String tempwfids = WorkflowVersion.getAllVersionStringByWFIDs(workflowid);
					if (workflowid.indexOf("-") != -1)
						tempwfids = workflowid;
					whereclause += " and t1.workflowid in (" + tempwfids + ") ";
					whereclause2 += " and workflowid=" + workflowid;
				}
				SearchClause.setWorkflowId(workflowid);
			}
			String nodeids = Util.null2String(request.getParameter("nodeids"));
			if (!"".equals(nodeids)) {
				whereclause += " and t1.currentnodeid in ("+ WorkflowVersion.getAllRelationNodeStringByNodeIDs(nodeids) + ") ";
				whereclause2 += " and 1=2 ";
			}
			if (complete.equals("0")) {
				processing = "0"; //待办
				if (viewcondition == 3) {
					whereclause += " and (t2.isremark = '5' or (t2.isremark = '0' and isprocessed is not null ))  and (t1.currentnodetype <> '3' or (t2.isremark in ('1', '8', '9') and t1.currentnodetype = '3')) and t2.islasttimes=1";
				} else if (viewcondition == 1 || viewcondition == 2 || viewcondition == 4) {
					whereclause += " and (((t2.isremark='0' and (t2.takisremark is null or t2.takisremark=0 )) or t2.isremark in('1','5','8','9','7'))  or (t2.isremark = '0' and t2.isprocessed is null)) and t2.islasttimes=1";
				} else {
					whereclause += " and ((t2.isremark='0' and (t2.takisremark is null or t2.takisremark=0 )) or t2.isremark in('1','5','8','9','7')) and t2.islasttimes=1";
				}
				if (viewcondition == 1)		//未读
					whereclause += " and t2.viewtype = '0' and t2.isremark != '5' and (t1.currentnodetype <> '3' or  (t2.isremark in ('1', '8', '9') and t1.currentnodetype = '3')) and t2.isprocessed is null ";
				else if (viewcondition == 2)	//反馈
					whereclause += " and t2.viewtype = '-1'";
				else if (viewcondition == 4)	//被督办
					whereclause += " and t2.requestid in (select requestid from workflow_requestlog where logtype='s')";
				if (isopenofs) {
					if (viewcondition == 0) {//全部
						whereclause2 += " and userid=" + user.getUID() + " and islasttimes=1 and isremark='0' ";
					} else if (viewcondition == 1) {//未读
						whereclause2 += " and userid=" + user.getUID() + " and islasttimes=1 and isremark='0' and viewtype=0 ";
					} else {
						whereclause2 += " and 1=2 ";
					}
				}
			}
			SearchClause.setWhereClause(whereclause);
			SearchClause.setWhereclauseOs(whereclause2);//统一待办条件
			SearchClause.setOrderclauseOs(" operatedate, operatetime ");
			
			reqparams.put("fromself", "1");
			reqparams.put("viewcondition", viewcondition+"");
			reqparams.put("processing", processing);
			return parambean;
		}else if("done".equals(scope) && ("all".equals(method) || "reqeustbytype".equals(method) || "reqeustbywfid".equals(method))){
			if("reqeustbytype".equals(method)){
				String wftype = Util.null2String(request.getParameter("wftype"));
				whereclause += whereclause_menu;
				whereclause += " and t1.workflowid in( select id from workflow_base   where workflowtype = " + wftype + ") ";
				whereclause2 += " and workflowid in ( select workflowid from ofs_workflow   where sysid = " + wftype + " and (cancel=0 or cancel is null) ) ";
			}else if("reqeustbywfid".equals(method)){
				String workflowid = Util.null2String(request.getParameter("workflowid"));
				whereclause2 += " and workflowid=" + workflowid;
				SearchClause.setWorkflowId(workflowid);
			}
			if (complete.equals("2")) {
				processing = "2";
				whereclause += " and (t2.isremark in('2','4') or (t2.isremark=0 and t2.takisremark =-2)) and t2.islasttimes=1";
				if (viewcondition == 1)			//未归档
					whereclause += " and (t2.isremark ='2' or (t2.isremark=0 and t2.takisremark =-2)) and t2.iscomplete=0 ";
				else if (viewcondition == 2)	//已归档
					whereclause += " and t2.iscomplete=1 and t1.currentnodetype = 3 ";
				else if (viewcondition == 4)	//未读
					whereclause += " and t2.viewtype=0 ";
				else if (viewcondition == 3)	//反馈
					whereclause += " and t2.viewtype=-1 ";
				if (isopenofs && showdone) {
					if (viewcondition == 0) {//全部
						whereclause2 += " and userid=" + user.getUID() + " and islasttimes=1 and isremark in ('2','4') ";
					} else if (viewcondition == 1) {//未归档
						whereclause2 += " and userid=" + user.getUID() + " and islasttimes=1 and isremark='2' and iscomplete=0 ";
					} else if (viewcondition == 2) {//已归档
						whereclause2 += " and userid=" + user.getUID() + " and islasttimes=1 and isremark in ('2','4') and iscomplete=1";
					} else {
						whereclause2 += " and 1=2 ";
					}
				} else {
					whereclause2 += " and 1=2 ";
				}
			}
			SearchClause.setWhereClause(whereclause);
			SearchClause.setWhereclauseOs(whereclause2);//统一待办条件
			SearchClause.setOrderclauseOs(" operatedate, operatetime ");
			
			reqparams.put("fromself", "1");
			reqparams.put("viewcondition", viewcondition+"");
			reqparams.put("processing", processing);
			return parambean;
		}else if ("mine".equals(scope) && ("all".equals(method) || "reqeustbytype".equals(method) || "reqeustbywfid".equals(method))) {		//我的请求-全部流程
			if("reqeustbytype".equals(method)){
				String wftype = Util.null2String(request.getParameter("wftype"));
				whereclause += whereclause_menu;
				if (isopenofs) {
					whereclause2 += " and workflowid in (select workflowid from ofs_workflow where sysid=" + wftype+ " and cancel=0 )";
				}
				whereclause += " and t1.workflowid in( select id from workflow_base where workflowtype = " + wftype + " and (isvalid='1' or isvalid='3')) ";
				reqparams.put("myrequest", "myreqeustbywftype");
			}else if("reqeustbywfid".equals(method)){
				String workflowid = Util.null2String(request.getParameter("workflowid"));
				whereclause2 += " and workflowid=" + workflowid;
				SearchClause.setWorkflowId(workflowid);
				reqparams.put("myrequest", "myreqeustbywfid");
			}else if("all".equals(method)){
				reqparams.put("myrequest", "myall");
			}
			if ("1".equals(belongtoshow)) {
				whereclause += " and t1.creater in (" + userIDAll + ") and t1.creatertype = " + usertype;
			} else {
				whereclause += " and t1.creater in (" + userid + ") and t1.creatertype = " + usertype;
			}
			//whereclause2 += requestutil.getSqlWhere("3", userid, "");
			if (viewcondition == 1) { //未归档
				whereclause += " and t1.currentnodetype <> '3' and t2.islasttimes=1 ";
				whereclause2 += " and iscomplete=0 ";
			} else if (viewcondition == 2) { //已归档
				whereclause += " and (t2.isremark in('1', '2','4','5','8','9') or (t2.isremark=0 and t2.takisremark =-2)) and t1.currentnodetype = '3' and t2.islasttimes=1";
				whereclause2 += " and iscomplete=1 ";
			} else if (viewcondition == 0 || viewcondition == 4 || viewcondition == 3) { //全部、未读、反馈
				whereclause += " and ((t1.currentnodetype <> '3') or (t2.isremark in('1','2','4','5','8','9') and t1.currentnodetype = '3' )) and t2.islasttimes=1 ";
				if(viewcondition == 4){		//未读
					whereclause += " and t2.viewtype=0 ";
					whereclause2 += " and 1=2 ";
				}else if(viewcondition == 3){	//反馈
					whereclause += " and t2.viewtype=-1 ";
					whereclause2 += " and 1=2 ";
				}
			} /*else if (viewcondition == 5) {//超时
				whereclause += " and t1.currentnodetype = '3'  and (t2.isremark=5 or (t2.isremark = '0' and isprocessed <> '1' ))  and t1.currentnodetype <> 3 ";
				whereclause2 += " and 1=2 ";
			}*/
			SearchClause.setWhereClause(whereclause);
			SearchClause.setWhereclauseOs(whereclause2);
			SearchClause.setOrderclauseOs("createdate,createtime");
			
			reqparams.put("fromself", "1");
			return parambean;
		}else if (method.equals("viewhrm")) {
			if (isoracle) {
				whereclause += " and (',' + TO_CHAR(t1.hrmids) + ',' LIKE '%," + resourceid + ",%') ";
			} else if (isdb2) {
				whereclause += " and (',' + VARCHAR(t1.hrmids) + ',' LIKE '%," + resourceid + ",%') ";
			} else {
				whereclause += " and (',' + CONVERT(varchar,t1.hrmids) + ',' LIKE '%," + resourceid + ",%') ";
			}
			SearchClause.setWhereClause(whereclause);
			return parambean;
		}else if (method.equals("reqeustbywftypeNode")) {
			//TD8778 褚俊 根据流程类型进入流程列表页面，精确到流程节点
			String wftype = Util.null2String(request.getParameter("wftype"));
			/* edited by wdl 2006-06-14 left menu advanced menu */
			if (fromAdvancedMenu == 1) {
				int infoId = Util.getIntValue(request.getParameter("infoId"), 0);
				String workFlowIDsRequest = Util.null2String(request.getParameter("workFlowIDsRequest"));
				String workFlowNodeIDsRequest = Util.null2String(request.getParameter("workFlowNodeIDsRequest"));
				String selectedworkflow = "";
				String inSelectedStr = "";
				List selectedWorkflowIdList = Util.TokenizerString(workFlowIDsRequest, ",");
				for (int i = 0; i < selectedWorkflowIdList.size(); i++) {
					String wfID = (String) selectedWorkflowIdList.get(i);
					if (!"".equals(workFlowNodeIDsRequest)) {
						inSelectedStr += "or ( t1.workflowid = " + wfID + " and t1.currentnodeid in (" + WorkflowVersion.getAllRelationNodeStringByNodeIDs(workFlowNodeIDsRequest) + ") ) ";
					} else {
						inSelectedStr += "or ( t1.workflowid = " + wfID + " ) ";
					}
				}
				if (!"".equals(inSelectedStr)) {
					inSelectedStr = inSelectedStr.substring(2);
					if (!"".equals(whereclause)) {
						whereclause = whereclause + " and ";
					}
					whereclause += " ( " + inSelectedStr + " ) ";
				}
			}
			/* edited end */
			whereclause += " and t1.workflowid in( select id from workflow_base   where workflowtype = " + wftype+ ") ";
			if (complete.equals("0")) {
				whereclause += " ((t2.isremark=0 and (t2.takisremark is null or t2.takisremark=0 )) or t2.isremark in('1','5','8','9','7')) and t2.islasttimes=1";
			} else if (complete.equals("1")) {
				whereclause += " and  ((t2.isremark in('2','4') or (t2.isremark=0 and t2.takisremark =-2)) or (t2.isremark=0 and t2.takisremark =-2)) and t1.currentnodetype = '3' and iscomplete=1 and islasttimes=1";
			} else if (complete.equals("2")) {	//complete=2表示已办事宜
				whereclause += " and t2.isremark ='2' and t2.iscomplete=0 and  t2.islasttimes=1";
			}
			SearchClause.setWhereClause(whereclause);
			return parambean;
		}else if (method.equals("reqeustbybill")) {
			//add by ben根据单据号得到流程 
			String billid = Util.null2String(request.getParameter("billid"));
			if ("163".equals(billid)) {
				whereclause += " and t1.workflowid in(select id from workflow_base where (formid = "+ billid 
					+ " or formid in (select formid from carbasic where isuse=1)) and id not in (select workflowid from carbasic where isuse=0) and isbill='1') ";
			} else {
				whereclause += " and t1.workflowid in( select id from workflow_base   where formid = " + billid+ " and isbill='1') ";
			}
			if (complete.equals("0")) { //未审批
				whereclause += " and ((t2.isremark=0 and (t2.takisremark is null or t2.takisremark=0 )) or t2.isremark in('1','5','8','9','7')) and t2.islasttimes=1 ";
			} else if (complete.equals("1")) {
				whereclause += " and (t2.isremark in('2','4') or (t2.isremark=0 and t2.takisremark =-2)) and t1.currentnodetype = '3' and iscomplete=1 and islasttimes=1";
			} else if (complete.equals("2")) { 	//complete=2表示已办事宜
				whereclause += "   and ((t2.isremark ='2' and t1.currentnodetype <> 3 and t2.iscomplete=0) or  (t1.currentnodetype = '3')) and  t2.islasttimes=1";
			}
			SearchClause.setWhereClause(whereclause);
			return parambean;
		}

		throw new Exception("unknown request method");
		/****************下面部分暂不知从哪请求过来的，先过滤掉************/
		/*String createrid = Util.null2String(request.getParameter("createrid"));
		String docids = Util.null2String(request.getParameter("docids"));
		String crmids = Util.null2String(request.getParameter("crmids"));
		String hrmids = Util.null2String(request.getParameter("hrmids"));
		String prjids = Util.null2String(request.getParameter("prjids"));
		String creatertype = Util.null2String(request.getParameter("creatertype"));
		String workflowid = Util.null2String(request.getParameter("workflowid"));
		String nodetype = Util.null2String(request.getParameter("nodetype"));
		String fromdate = Util.null2String(request.getParameter("fromdate"));
		String todate = Util.null2String(request.getParameter("todate"));
		String lastfromdate = Util.null2String(request.getParameter("lastfromdate"));
		String lasttodate = Util.null2String(request.getParameter("lasttodate"));
		String requestmark = Util.null2String(request.getParameter("requestmark"));
		String branchid = Util.null2String(request.getParameter("branchid"));
		if (!branchid.equals(""))
			session.setAttribute("branchid", branchid);
		int during = Util.getIntValue(request.getParameter("during"), 0);
		int order = Util.getIntValue(request.getParameter("order"), 0);
		int isdeleted = Util.getIntValue(request.getParameter("isdeleted"), 0);
		String requestname = Util.fromScreen2(request.getParameter("requestname"), user.getLanguage());
		requestname = requestname.trim();
		int subday1 = Util.getIntValue(request.getParameter("subday1"), 0);
		int subday2 = Util.getIntValue(request.getParameter("subday2"), 0);
		int maxday = Util.getIntValue(request.getParameter("maxday"), 0);
		int state = Util.getIntValue(request.getParameter("state"), 0);
		String requestlevel = Util.fromScreen(request.getParameter("requestlevel"), user.getLanguage());
		//add by xhheng @20050414 for TD 1545
		int iswaitdo = Util.getIntValue(request.getParameter("iswaitdo"), 0);

		Calendar now = Calendar.getInstance();
		String today = Util.add0(now.get(Calendar.YEAR), 4) + "-" + Util.add0(now.get(Calendar.MONTH) + 1, 2) + "-"+ Util.add0(now.get(Calendar.DAY_OF_MONTH), 2);
		int year = now.get(Calendar.YEAR);
		int month = now.get(Calendar.MONTH);
		int day = now.get(Calendar.DAY_OF_MONTH);

		Date newdate = new Date();
		long datetime = newdate.getTime();
		Timestamp timestamp = new Timestamp(datetime);
		String CurrentTime = (timestamp.toString()).substring(11, 13) + ":" + (timestamp.toString()).substring(14, 16)+ ":" + (timestamp.toString()).substring(17, 19);

		if (!createrid.equals("")) {
			if (whereclause.equals("")) {
				whereclause += " t1.creater='" + createrid + "'";
			} else {
				whereclause += " and t1.creater='" + createrid + "'";
			}
			if (!creatertype.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " t1.creatertype='" + creatertype + "'";
				} else {
					whereclause += " and t1.creatertype='" + creatertype + "'";
				}
			}
		}

		//添加附件上传文档的查询
		if (!docids.equals("")) {
			RecordSet.executeSql("select fieldname from workflow_formdict where fieldhtmltype=6 ");
		}

		if (isoracle) {
			if (!docids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " ((concat(concat(',' , To_char(t1.docids)) , ',') LIKE '%," + docids + ",%') ";
				} else {
					whereclause += " and ((concat(concat(',' , To_char(t1.docids)) , ',') LIKE '%," + docids + ",%') ";
				}
				while (RecordSet.next()) {
					String fieldname = RecordSet.getString("fieldname");
					whereclause += " or (concat(concat(',' , To_char(t4." + fieldname + ")) , ',') LIKE '%," + docids+ ",%') ";
				}
				whereclause += ") ";
			}
			if (!crmids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " (concat(concat(',' , To_char(t1.crmids)) , ',') LIKE '%," + crmids + ",%') ";
				} else {
					whereclause += " and (concat(concat(',' , To_char(t1.crmids)) , ',') LIKE '%," + crmids + ",%') ";
				}
			}
			if (!hrmids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " (concat(concat(',' , To_char(t1.hrmids)) , ',') LIKE '%," + hrmids + ",%') ";
				} else {
					whereclause += " and (concat(concat(',' , To_char(t1.hrmids)) , ',') LIKE '%," + hrmids + ",%') ";
				}
			}
			if (!prjids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " (concat(concat(',' , To_char(t1.prjids)) , ',') LIKE '%," + prjids + ",%') ";
				} else {
					whereclause += " and (concat(concat(',' , To_char(t1.prjids)) , ',') LIKE '%," + prjids + ",%') ";
				}
			}
		} else if (isdb2) {
			if (!docids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " ((concat(concat(',' , varchar(t1.docids)) , ',') LIKE '%," + docids + ",%') ";
				} else {
					whereclause += " and ((concat(concat(',' , varchar(t1.docids)) , ',') LIKE '%," + docids + ",%') ";
				}
				while (RecordSet.next()) {
					String fieldname = RecordSet.getString("fieldname");
					whereclause += " or (concat(concat(',' , varchar(t4." + fieldname + ")) , ',') LIKE '%," + docids+ ",%') ";
				}
				whereclause += ") ";
			}
			if (!crmids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " (concat(concat(',' , varchar(t1.crmids)) , ',') LIKE '%," + crmids + ",%') ";
				} else {
					whereclause += " and (concat(concat(',' , varchar(t1.crmids)) , ',') LIKE '%," + crmids + ",%') ";
				}
			}
			if (!hrmids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " (concat(concat(',' , varchar(t1.hrmids)) , ',') LIKE '%," + hrmids + ",%') ";
				} else {
					whereclause += " and (concat(concat(',' , varchar(t1.hrmids)) , ',') LIKE '%," + hrmids + ",%') ";
				}
			}
			if (!prjids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " (concat(concat(',' , varchar(t1.prjids)) , ',') LIKE '%," + prjids + ",%') ";
				} else {
					whereclause += " and (concat(concat(',' , varchar(t1.prjids)) , ',') LIKE '%," + prjids + ",%') ";
				}
			}
		} else {
			if (!docids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " ((',' + CONVERT(varchar,t1.docids) + ',' LIKE '%," + docids + ",%') ";
				} else {
					whereclause += " and ((',' + CONVERT(varchar,t1.docids) + ',' LIKE '%," + docids + ",%') ";
				}
				while (RecordSet.next()) {
					String fieldname = RecordSet.getString("fieldname");
					whereclause += " or (',' + CONVERT(varchar,t4." + fieldname + ") + ',' LIKE '%," + docids + ",%') ";
				}
				whereclause += ") ";
			}
			if (!crmids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " (',' + CONVERT(varchar,t1.crmids) + ',' LIKE '%," + crmids + ",%') ";
				} else {
					whereclause += " and (',' + CONVERT(varchar,t1.crmids) + ',' LIKE '%," + crmids + ",%') ";
				}
			}
			if (!hrmids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " (',' + CONVERT(varchar,t1.hrmids) + ',' LIKE '%," + hrmids + ",%') ";
				} else {
					whereclause += " and (',' + CONVERT(varchar,t1.hrmids) + ',' LIKE '%," + hrmids + ",%') ";
				}
			}
			if (!prjids.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " (',' + CONVERT(varchar,t1.prjids) + ',' LIKE '%," + prjids + ",%') ";
				} else {
					whereclause += " and (',' + CONVERT(varchar,t1.prjids) + ',' LIKE '%," + prjids + ",%') ";
				}
			}
		}
		if (!workflowid.equals("")) {
			if (whereclause.equals("")) {
				whereclause += " t1.workflowid in(" + WorkflowVersion.getAllVersionStringByWFIDs(workflowid) + ")";
			} else {
				whereclause = "t1.workflowid in(" + WorkflowVersion.getAllVersionStringByWFIDs(workflowid) + ") and "+ whereclause;
			}
		}
		if (!cdepartmentid.equals("")) {
			String tempWhere = "";
			ArrayList tempArr = Util.TokenizerString(cdepartmentid, ",");
			for (int i = 0; i < tempArr.size(); i++) {
				String tempcdepartmentid = (String) tempArr.get(i);
				if (tempWhere.equals(""))
					tempWhere += "departmentid=" + tempcdepartmentid;
				else
					tempWhere += " or departmentid=" + tempcdepartmentid;
			}
			if (!tempWhere.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " exists(select 1 from hrmresource where t1.creater=id and t1.creatertype='0' and ("+ tempWhere + "))";
				} else {
					whereclause += " and exists(select 1 from hrmresource where t1.creater=id and t1.creatertype='0' and ("+ tempWhere + "))";
				}
			}
		}
		whereclause += WorkflowComInfo.getDateDuringSql(date2during);
		if (!requestname.equals("")) {
			if (whereclause.equals("")) {
				whereclause += " t1.requestname like '%" + requestname + "%'";
			} else {
				whereclause += " and t1.requestname like '%" + requestname + "%'";
			}
		}
		if (!nodetype.equals("")) {
			if (whereclause.equals("")) {
				whereclause += " t1.currentnodetype='" + nodetype + "'";
			} else {
				whereclause += " and t1.currentnodetype='" + nodetype + "'";
			}
		}
		if (!requestmark.equals("")) {
			if (whereclause.equals("")) {
				whereclause += " t1.requestmark like '%" + requestmark + "%'";
			} else {
				whereclause += " and t1.requestmark like '%" + requestmark + "%'";
			}
		}

		if (!lastfromdate.equals("")) {
			if (whereclause.equals("")) {
				whereclause += " t1.lastoperatedate>='" + lastfromdate + "'";
			} else {
				whereclause += " and t1.lastoperatedate>='" + lastfromdate + "'";
			}
		}
		if (!lasttodate.equals("")) {
			if (whereclause.equals("")) {
				whereclause += " t1.lastoperatedate<='" + lasttodate + "'";
			} else {
				whereclause += " and t1.lastoperatedate<='" + lasttodate + "'";
			}
		}
		if (during == 0) {
			if (!fromdate.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " t1.createdate>='" + fromdate + "'";
				} else {
					whereclause += " and t1.createdate>='" + fromdate + "'";
				}
			}
			if (!todate.equals("")) {
				if (whereclause.equals("")) {
					whereclause += " t1.createdate<='" + todate + "'";
				} else {
					whereclause += " and t1.createdate<='" + todate + "'";
				}
			}
		} else {
			if (during == 1) {
				if (whereclause.equals(""))
					whereclause += " t1.createdate='" + today + "'";
				else
					whereclause += " and t1.createdate='" + today + "'";
			}
			if (during == 2) {
				Calendar tempday = Calendar.getInstance();
				tempday.clear();
				tempday.set(year, month, day - 1);
				String lastday = Util.add0(tempday.get(Calendar.YEAR), 4) + "-"
					+ Util.add0(tempday.get(Calendar.MONTH) + 1, 2) + "-"
					+ Util.add0(tempday.get(Calendar.DAY_OF_MONTH), 2);
				if (whereclause.equals(""))
					whereclause += " ((t1.createdate='" + today + "' and t1.createtime<='" + CurrentTime + "')"
						+ " or (t1.createdate='" + lastday + "' and t1.createtime>='" + CurrentTime + "')) ";
				else
					whereclause += " and ((t1.createdate='" + today + "' and t1.createtime<='" + CurrentTime + "')"
						+ " or (t1.createdate='" + lastday + "' and t1.createtime>='" + CurrentTime + "')) ";
			}
			if (during == 3) {
				int days = now.getTime().getDay();
				Calendar tempday = Calendar.getInstance();
				tempday.clear();
				tempday.set(year, month, day - days);
				String lastday = Util.add0(tempday.get(Calendar.YEAR), 4) + "-"+ Util.add0(tempday.get(Calendar.MONTH) + 1, 2) + "-"+ Util.add0(tempday.get(Calendar.DAY_OF_MONTH), 2);
				if (whereclause.equals(""))
					whereclause += " t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
				else
					whereclause += " and t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
			}
			if (during == 4) {
				Calendar tempday = Calendar.getInstance();
				tempday.clear();
				tempday.set(year, month, day - 7);
				String lastday = Util.add0(tempday.get(Calendar.YEAR), 4) + "-"+ Util.add0(tempday.get(Calendar.MONTH) + 1, 2) + "-"+ Util.add0(tempday.get(Calendar.DAY_OF_MONTH), 2);
				if (whereclause.equals(""))
					whereclause += " t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
				else
					whereclause += " and t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
			}
			if (during == 5) {
				Calendar tempday = Calendar.getInstance();
				tempday.clear();
				tempday.set(year, month, 1);
				String lastday = Util.add0(tempday.get(Calendar.YEAR), 4) + "-"+ Util.add0(tempday.get(Calendar.MONTH) + 1, 2) + "-"+ Util.add0(tempday.get(Calendar.DAY_OF_MONTH), 2);
				if (whereclause.equals(""))
					whereclause += " t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
				else
					whereclause += " and t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
			}
			if (during == 6) {
				Calendar tempday = Calendar.getInstance();
				tempday.clear();
				tempday.set(year, month, day - 30);
				String lastday = Util.add0(tempday.get(Calendar.YEAR), 4) + "-"+ Util.add0(tempday.get(Calendar.MONTH) + 1, 2) + "-"+ Util.add0(tempday.get(Calendar.DAY_OF_MONTH), 2);
				if (whereclause.equals(""))
					whereclause += " t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
				else
					whereclause += " and t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
			}
			if (during == 7) {
				Calendar tempday = Calendar.getInstance();
				tempday.clear();
				tempday.set(year, 0, 1);
				String lastday = Util.add0(tempday.get(Calendar.YEAR), 4) + "-"+ Util.add0(tempday.get(Calendar.MONTH) + 1, 2) + "-"+ Util.add0(tempday.get(Calendar.DAY_OF_MONTH), 2);
				if (whereclause.equals(""))
					whereclause += " t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
				else
					whereclause += " and t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
			}
			if (during == 8) {
				Calendar tempday = Calendar.getInstance();
				tempday.clear();
				tempday.set(year, month, day - 365);
				String lastday = Util.add0(tempday.get(Calendar.YEAR), 4) + "-"+ Util.add0(tempday.get(Calendar.MONTH) + 1, 2) + "-"+ Util.add0(tempday.get(Calendar.DAY_OF_MONTH), 2);
				if (whereclause.equals(""))
					whereclause += " t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
				else
					whereclause += " and t1.createdate<='" + today + "' and t1.createdate>='" + lastday + "'";
			}
		}

		if (isoracle) {
			if (subday1 != 0) {
				if (whereclause.equals(""))
					whereclause += "  (to_date(t1.lastoperatedate,'YYYY-MM-DD')-to_date(t1.createdate,'YYYY-MM-DD'))>"+ subday1;
				else
					whereclause += " and (to_date(t1.lastoperatedate,'YYYY-MM-DD')-to_date(t1.createdate,'YYYY-MM-DD'))>"+ subday1;
			}
			if (subday2 != 0) {
				if (whereclause.equals(""))
					whereclause += "  (to_date(t1.lastoperatedate,'YYYY-MM-DD')-to_date(t1.createdate,'YYYY-MM-DD'))<="+ subday2;
				else
					whereclause += " and (to_date(t1.lastoperatedate,'YYYY-MM-DD')-to_date(t1.createdate,'YYYY-MM-DD'))<="+ subday2;
			}
			if (maxday != 0) {
				if (whereclause.equals(""))
					whereclause += "  (to_date(t1.lastoperatedate,'YYYY-MM-DD')-to_date(t1.createdate,'YYYY-MM-DD'))="+ maxday;
				else
					whereclause += " and (to_date(t1.lastoperatedate,'YYYY-MM-DD')-to_date(t1.createdate,'YYYY-MM-DD'))="+ maxday;
			}
		} else if (isdb2) {
			if (subday1 != 0) {
				if (whereclause.equals(""))
					whereclause += "  (date(t1.lastoperatedate,'YYYY-MM-DD')-date(t1.createdate,'YYYY-MM-DD'))>"+ subday1;
				else
					whereclause += " and (date(t1.lastoperatedate,'YYYY-MM-DD')-date(t1.createdate,'YYYY-MM-DD'))>"+ subday1;
			}
			if (subday2 != 0) {
				if (whereclause.equals(""))
					whereclause += "  (date(t1.lastoperatedate,'YYYY-MM-DD')-date(t1.createdate,'YYYY-MM-DD'))<="+ subday2;
				else
					whereclause += " and (date(t1.lastoperatedate,'YYYY-MM-DD')-date(t1.createdate,'YYYY-MM-DD'))<="+ subday2;
			}
			if (maxday != 0) {
				if (whereclause.equals(""))
					whereclause += "  (date(t1.lastoperatedate,'YYYY-MM-DD')-date(t1.createdate,'YYYY-MM-DD'))="+ maxday;
				else
					whereclause += " and (date(t1.lastoperatedate,'YYYY-MM-DD')-date(t1.createdate,'YYYY-MM-DD'))="+ maxday;
			}
		} else {
			if (subday1 != 0) {
				if (whereclause.equals(""))
					whereclause += "  (convert(datetime,t1.lastoperatedate)-convert(datetime,t1.createdate))>"+ subday1;
				else
					whereclause += " and (convert(datetime,t1.lastoperatedate)-convert(datetime,t1.createdate))>"+ subday1;
			}
			if (subday2 != 0) {
				if (whereclause.equals(""))
					whereclause += "  (convert(datetime,t1.lastoperatedate)-convert(datetime,t1.createdate))<="+ subday2;
				else
					whereclause += " and (convert(datetime,t1.lastoperatedate)-convert(datetime,t1.createdate))<="+ subday2;
			}
			if (maxday != 0) {
				if (whereclause.equals(""))
					whereclause += " (convert(datetime,t1.lastoperatedate)-convert(datetime,t1.createdate))=" + maxday;
				else
					whereclause += " and (convert(datetime,t1.lastoperatedate)-convert(datetime,t1.createdate))="+ maxday;
			}
		}

		if (state == 1) {
			if (whereclause.equals("")) {
				whereclause += " t1.currentnodetype='3'";
			} else {
				whereclause += " and t1.currentnodetype='3'";
			}
		}
		if (state == 2) {
			if (whereclause.equals("")) {
				whereclause += " t1.currentnodetype<>'3'";
			} else {
				whereclause += " and t1.currentnodetype<>'3'";
			}
		}

		if (isdeleted != 2) {
			if (whereclause.equals("")) {
				if (isdeleted == 0)
					whereclause += " (exists (select 1 from workflow_base where (isvalid=1 or isvalid=3) and workflow_base.id=t2.workflowid)) ";
				else
					whereclause += " exists (select 1 from workflow_base where (isvalid=0  or isvalid is null) and workflow_base.id=t2.workflowid) ";
			} else {
				if (isdeleted == 0)
					whereclause += " and (exists (select 1 from workflow_base where (isvalid=1 or isvalid=3) and workflow_base.id=t2.workflowid)) ";
				else
					whereclause += " and exists (select 1 from workflow_base where (isvalid=0  or isvalid is null) and workflow_base.id=t2.workflowid) ";
			}
		}

		if (!requestlevel.equals("")) {
			if (whereclause.equals(""))
				whereclause += " t1.requestlevel=" + requestlevel;
			else
				whereclause += " and t1.requestlevel=" + requestlevel;
		}

		if (whereclause.equals(""))
			whereclause += "  islasttimes=1 ";
		else
			whereclause += " and islasttimes=1 ";

		orderclause = "t2.receivedate ,t2.receivetime";
		orderclause2 = "t2.receivedate ,t2.receivetime";

		SearchClause.setOrderClause(orderclause);
		SearchClause.setOrderClause2(orderclause2);
		SearchClause.setWhereClause(whereclause);

		SearchClause.setWorkflowId(workflowid);
		SearchClause.setNodeType(nodetype);
		SearchClause.setFromDate(fromdate);
		SearchClause.setToDate(todate);
		SearchClause.setCreaterType(creatertype);
		SearchClause.setCreaterId(createrid);
		SearchClause.setRequestLevel(requestlevel);
		SearchClause.setDepartmentid(cdepartmentid);
		
		reqparams.put("query", "1");
		reqparams.put("iswaitdo", iswaitdo+"");
		reqparams.put("docids", docids);
		return parambean;*/
	}

}
