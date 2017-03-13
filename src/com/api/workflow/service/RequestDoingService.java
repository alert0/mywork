package com.api.workflow.service;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.systeminfo.SystemEnv;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.resource.AllManagers;
import com.api.workflow.bean.PageTabInfo;
import com.api.workflow.bean.TreeCountCfg;
import com.api.workflow.bean.WfTreeNode;
import com.api.workflow.util.OtherSystemRequestUtil;
import com.api.workflow.util.SearchConditionUtil;

import weaver.workflow.workflow.WorkTypeComInfo;
import weaver.workflow.workflow.WorkflowComInfo;
import weaver.workflow.workflow.WorkflowVersion;

/**
 * 流程待办页面相关信息获取
 * @author liuzy
 */
public class RequestDoingService {
	
	/**
	 * 待办基础信息，包括树信息及分组信息
	 */
	public Map<String,Object> getBaseInfo(HttpServletRequest request, HttpServletResponse response) throws Exception {
		User user = HrmUserVarify.getUser(request, response);
		//左侧树数据
		List<WfTreeNode> treedata = this.getTreeData(request, response);
		
		//树计数配置信息
		List<TreeCountCfg> countcfg = new ArrayList<TreeCountCfg>();
		countcfg.add(new TreeCountCfg("flowOver", SystemEnv.getHtmlLabelName(84505,user.getLanguage()), true, "#9766fd", "#9766fd"));
		countcfg.add(new TreeCountCfg("flowNew",  SystemEnv.getHtmlLabelName(84379,user.getLanguage()), true, "#ff3232", "#ff3232"));
		countcfg.add(new TreeCountCfg("flowRes",  SystemEnv.getHtmlLabelName(84506,user.getLanguage()), true, "#fea468", "#fea468"));
		countcfg.add(new TreeCountCfg("flowAll",  SystemEnv.getHtmlLabelName(84382,user.getLanguage()), true, "#c5c5c5", "#c5c5c5"));
		
		//分页头部分组信息
		List<PageTabInfo> groupinfo  = new ArrayList<PageTabInfo>();
		groupinfo.add(new PageTabInfo("flowAll", SystemEnv.getHtmlLabelName(332, user.getLanguage()), 0, true, "#000000"));
		groupinfo.add(new PageTabInfo("flowNew", SystemEnv.getHtmlLabelName(25426, user.getLanguage()), 1, true, "#ff3232"));
		groupinfo.add(new PageTabInfo("flowRes", SystemEnv.getHtmlLabelName(21950, user.getLanguage()), 2, true, "#fea468"));
		groupinfo.add(new PageTabInfo("flowOver", SystemEnv.getHtmlLabelName(19081, user.getLanguage()), 3, true, "#9766fd"));
		groupinfo.add(new PageTabInfo("flowSup", SystemEnv.getHtmlLabelName(33220, user.getLanguage()), 4, true, "#000000"));
		
		//高级查询条件信息
		List<Map<String,Object>> conditioninfo = new SearchConditionUtil().getCondition("doing", user);
		
		Map<String,Object> apidatas = new HashMap<String,Object>();
		apidatas.put("pagetitle", SystemEnv.getHtmlLabelName(1207, user.getLanguage()));
		apidatas.put("treedata", treedata);
		apidatas.put("countcfg", countcfg);
		apidatas.put("groupinfo", groupinfo);
		apidatas.put("conditioninfo", conditioninfo);
		return apidatas;
	}
	
	/**
	 * 获取待办树
	 */
	private List<WfTreeNode> getTreeData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		User user = HrmUserVarify.getUser(request, response);
		AllManagers AllManagers = new AllManagers();
		RecordSet rs = new RecordSet();
		WorkflowComInfo wfComInfo = new WorkflowComInfo();
		WorkTypeComInfo wfTypeComInfo = new WorkTypeComInfo();

		String offical = Util.null2String(request.getParameter("offical"));
		int officalType = Util.getIntValue(request.getParameter("officalType"), -1);
		int usertype = 0;
		if ("2".equals(user.getLogintype()))
			usertype = 1;
		String userID = user.getUID() + "";
		String resourceid = Util.null2String(request.getParameter("resourceid"));
		AllManagers.getAll(resourceid);
		if ("".equals(resourceid))
			resourceid = "" + user.getUID();
		String userIDAll = String.valueOf(user.getUID());
		String belongtoshow = "";
		rs.executeSql("select * from HrmUserSetting where resourceId = " + userID);
		if (rs.next()) {
			belongtoshow = rs.getString("belongtoshow");
		}
		// QC235172,如果不是查看自己的代办，主从账号统一显示不需要判断
		if (!resourceid.equals(userID))
			belongtoshow = "";
		if (!"".equals(user.getBelongtoids()))
			userIDAll = userID + "," + user.getBelongtoids();

		boolean superior = false; // 是否为被查看者上级或者本身
		if ("".equals(resourceid) || userID.equals(resourceid)) {
			resourceid = userID;
			superior = true;
		} else {
			rs.executeSql("SELECT * FROM HrmResource WHERE ID = " + resourceid + " AND managerStr LIKE '%," + userID+ ",%'");
			if (rs.next())
				superior = true;
		}

		StringBuffer sqlsb = new StringBuffer();
		sqlsb.append("select wt.id workflowtype,case wb.isvalid when '3' then wb.activeversionid else wb.id end as workflowid ");
		sqlsb.append(" from workflow_type wt,workflow_base wb ");
		sqlsb.append(" where wt.id=wb.workflowtype and wb.isvalid in ('1','3') ");
		sqlsb.append(" and exists (select 1 from workflow_currentoperator wfc where workflowid=wb.id");
		sqlsb.append(" and ((isremark = '0' and (takisremark is null or takisremark=0)) or isremark in ('1','5','7','8','9') )");
		sqlsb.append(" and islasttimes = 1 ");
		if ("1".equals(belongtoshow)) {
			sqlsb.append(" and userid in (").append(userIDAll);
		} else {
			sqlsb.append(" and userid in (").append(resourceid);
		}
		sqlsb.append(" ) and usertype = ").append(usertype);
		/*sqlsb.append(" and exists (select 1 from workflow_requestbase c");
		sqlsb.append(" where (c.deleted <> 1 or c.deleted is null or c.deleted='') and c.workflowid = wfc.workflowid ");
		if (rs.getDBType().equals("oracle")) {
			sqlsb.append(" and (nvl(c.currentstatus,-1) = -1 or (nvl(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		} else {
			sqlsb.append(" and (isnull(c.currentstatus,-1) = -1 or (isnull(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		}
		sqlsb.append(" and c.requestid = wfc.requestid)");*/
		if (!superior) {
			sqlsb.append(" AND EXISTS (SELECT NULL FROM workFlow_CurrentOperator b WHERE wfc.workflowid = b.workflowid AND wfc.requestid = b.requestid AND b.userid in("
						+ user.getUID() + ") and b.usertype= " + usertype + ") ");
		}
		sqlsb.append(")");
		if (offical.equals("1")) {// 发文/收文/签报
			if (officalType == 1) {
				sqlsb.append(" and wb.isWorkflowDoc=1 and wb.officalType in (1,3)");
			} else if (officalType == 2) {
				sqlsb.append(" and wb.isWorkflowDoc=1 and wb.officalType=2");
			}
		}
		sqlsb.append(" order by wt.dsporder asc,wt.id ASC,wb.dsporder asc,wb.workflowname");
		
		List<WfTreeNode> tree = new ArrayList<WfTreeNode>();
		List<String> typelist = new ArrayList<String>();
		List<String> wflist = new ArrayList<String>();
		rs.executeSql(sqlsb.toString());
		while(rs.next()){
			String typeid = rs.getString("workflowtype");
			String wfid = rs.getString("workflowid");
			//wfid = WorkflowVersion.getActiveVersionWFID(wfid);
			if(!"1".equals(wfComInfo.getIsValid(wfid)))
				continue;
			List<WfTreeNode> childs = null;
			int typeindex = typelist.indexOf(typeid);
			if(typeindex == -1){
				typelist.add(typeid);
				childs = new ArrayList<WfTreeNode>();
				WfTreeNode typenode = new WfTreeNode();
				typenode.setDomid("type_"+typeid);
				typenode.setKey(typeid);
				typenode.setName(convertChar(wfTypeComInfo.getWorkTypename(typeid), user.getLanguage()));
				typenode.setIsopen(true);
				typenode.setHaschild(true);
				typenode.setChilds(childs);
				tree.add(typenode);
			}else{
				WfTreeNode typenode = tree.get(typeindex);
				childs = typenode.getChilds();
			}
			if(wflist.indexOf(wfid) == -1){		//流程多个版本可能重复add
				wflist.add(wfid);
				WfTreeNode wfnode = new WfTreeNode();
				wfnode.setDomid("wf_"+wfid);
				wfnode.setKey(wfid);
				wfnode.setName(convertChar(wfComInfo.getWorkflowname(wfid), user.getLanguage()));
				childs.add(wfnode);
			}
		}
		//集成异构系统数据
		new OtherSystemRequestUtil().extendToDoTreeData(tree, user);
		return tree;
	}
	
	/**
	 * 待办计数信息，包括树计算和全部流程计数
	 */
	public Map<String,Object> getCountInfo(HttpServletRequest request, HttpServletResponse response) throws Exception{
		RecordSet rs = new RecordSet();
		RecordSet RecordSet = new RecordSet();
		WorkflowComInfo WorkflowComInfo = new WorkflowComInfo();
		HttpSession session = request.getSession();
		AllManagers AllManagers = new AllManagers();
		String offical = Util.null2String(request.getParameter("offical"));
		int officalType = Util.getIntValue(request.getParameter("officalType"), -1);
		
		String f_weaver_belongto_userid = request.getParameter("f_weaver_belongto_userid");
		String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");
		User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
		if (user == null)
			throw new Exception("empty user");
		
		String cursltwftypeid = Util.null2String(request.getParameter("wftype"));
		String cursltwfid = Util.null2String(request.getParameter("workflowid"));
		if (Util.getIntValue(cursltwftypeid) < 0)
			cursltwftypeid = "";
		if (Util.getIntValue(cursltwfid) < 0)
			cursltwfid = "";
		
		String curoptwfid = Util.null2String(request.getParameter("optkeys"));
		if (!"".equals(cursltwfid) && "".equals(cursltwftypeid)) {
			cursltwftypeid = WorkflowComInfo.getWorkflowtype(cursltwfid);
		} else if (!"".equals(curoptwfid)) {
			String optkeysql = "select distinct workflowid from workflow_requestbase where requestid in (" + curoptwfid+ ")";
			RecordSet rs9 = new RecordSet();
			rs9.executeSql(optkeysql);
			while (rs9.next()) {
				cursltwftypeid += ","+ WorkflowComInfo.getWorkflowtype(WorkflowVersion.getActiveVersionWFID(rs9.getString(1)));
			}
			if (cursltwftypeid.length() > 1) {
				cursltwftypeid = cursltwftypeid.substring(1, cursltwftypeid.length());
			}
		}
		
		/*String topage_ForAllBill = Util.null2String((String) session.getAttribute("topage_ForAllBill"));
		if (!"".equals(topage_ForAllBill)) {
			int requestid = Util.getIntValue((String) session.getAttribute("requestidForAllBill"), 0);
			if (topage_ForAllBill.indexOf("/proj/process/ViewTask.jsp") == 0|| topage_ForAllBill.indexOf("/proj/plan/ViewTask.jsp") == 0) {
				response.sendRedirect(topage_ForAllBill + "&requestid=" + requestid);
				session.setAttribute("topage_ForAllBill", "");
				return "hasforward";
			} else if (topage_ForAllBill.indexOf("RequestOperation.jsp") > 0) {
				int tempInt = topage_ForAllBill.lastIndexOf("3D");
				String tempString = topage_ForAllBill.substring(tempInt + 2);
				response.sendRedirect("/proj/process/ViewTask.jsp?taskrecordid=" + tempString + "&requestid="+ requestid);
				session.setAttribute("topage_ForAllBill", "");
				return "hasforward";
			}
		}*/

		String resourceid = Util.null2String(request.getParameter("resourceid"));
		AllManagers.getAll(resourceid);
		if ("".equals(resourceid))
			resourceid = "" + user.getUID();
		boolean isSelf = false;
		if (resourceid.equals("" + user.getUID()))
			isSelf = true;
		int usertype = 0;
		if ("2".equals(user.getLogintype()))
			usertype = 1;
		String userID = String.valueOf(user.getUID());
		String userIDAll = String.valueOf(user.getUID());
		String belongtoshow = "";
		RecordSet.executeSql("select * from HrmUserSetting where resourceId = " + userID);
		if (RecordSet.next())
			belongtoshow = RecordSet.getString("belongtoshow");
		//QC235172,如果不是查看自己的代办，主从账号统一显示不需要判断
		if (!isSelf)
			belongtoshow = "";
		if (!"".equals(user.getBelongtoids()))
			userIDAll = userID + "," + user.getBelongtoids();
		
		boolean superior = false; //是否为被查看者上级或者本身
		if ("".equals(resourceid) || userID.equals(resourceid)) {
			resourceid = userID;
			superior = true;
		} else {
			rs.executeSql("SELECT * FROM HrmResource WHERE ID = " + resourceid + " AND managerStr LIKE '%," + userID+ ",%'");
			if (rs.next())
				superior = true;
		}

		/* edited by wdl 2006-06-14 left menu advanced menu */
		/*int fromAdvancedMenu = Util.getIntValue(request.getParameter("fromadvancedmenu"), 0);
		if (fromAdvancedMenu == 1) {
			String selectedContent = Util.null2String(request.getParameter("selectedContent"));
			String menuType = Util.null2String(request.getParameter("menuType"));
			int infoId = Util.getIntValue(request.getParameter("infoId"), 0);
			if (selectedContent != null && selectedContent.startsWith("key_")) {
				String menuid = selectedContent.substring(4);
				RecordSet.executeSql("select * from menuResourceNode where contentindex = '" + menuid + "'");
				selectedContent = "";
				while (RecordSet.next()) {
					String keyVal = RecordSet.getString(2);
					selectedContent += keyVal + "|";
				}
				if (selectedContent.indexOf("|") != -1)
					selectedContent = selectedContent.substring(0, selectedContent.length() - 1);
			}
			response.sendRedirect("/workflow/search/WFSearchCustom.jsp?fromadvancedmenu=1&infoId=" + infoId+ "&selectedContent=" + selectedContent + "&menuType=" + menuType);
			return "hasforward";
		}*/
		/* edited end */

		String tworkflowNodeIDs = "";
		ArrayList<String> wftypeList = new ArrayList<String>();
		ArrayList<String> workflowList = new ArrayList<String>();
		Map<String,Integer> flowallmap = new Hashtable<String,Integer>();//待办数量
		Map<String,Integer> flownewmap = new Hashtable<String,Integer>();//待办数量
		Map<String,Integer> flowresmap = new Hashtable<String,Integer>();//反馈数量
		Map<String,Integer> flowovermap = new Hashtable<String,Integer>();//超时数量
		Map<String,Integer> flowsupmap = new Hashtable<String,Integer>(); //被督办数量

		StringBuffer sqlsb = new StringBuffer();
		sqlsb.append("select workflowtype, workflowid from workflow_currentoperator");
		sqlsb.append("	  where ( (isremark = '0' and (takisremark is null or takisremark=0)) or ");
		sqlsb.append("        isremark = '1' or isremark = '5' or isremark = '8' or isremark = '9' or isremark = '7') ");
		sqlsb.append("   and islasttimes = 1 ");
		if (!"".equals(cursltwftypeid)) {
			sqlsb.append("   and workflowtype in ( ").append(cursltwftypeid).append(")");
		}
		if ("1".equals(belongtoshow)) {
			sqlsb.append("	    and userid in (").append(userIDAll);
		} else {
			sqlsb.append("	    and userid in (").append(resourceid);
		}
		sqlsb.append("  ) and usertype = ").append(usertype);
		sqlsb.append(" and  workflowid in (select id from workflow_base where (isvalid=1 or isvalid=3) )  ");
		sqlsb.append("   and exists (select 1 from workflow_requestbase c");
		sqlsb.append("         where (c.deleted <> 1 or c.deleted is null or c.deleted='') and c.workflowid = workflow_currentoperator.workflowid ");
		if (RecordSet.getDBType().equals("oracle")) {
			sqlsb.append(" and (nvl(c.currentstatus,-1) = -1 or (nvl(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		} else {
			sqlsb.append(" and (isnull(c.currentstatus,-1) = -1 or (isnull(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		}
		sqlsb.append("           and c.requestid = workflow_currentoperator.requestid)");
		if (!superior) {
			if ("1".equals(belongtoshow)) {
				sqlsb.append(" AND EXISTS (SELECT NULL FROM workFlow_CurrentOperator b WHERE workflow_currentoperator.workflowid = b.workflowid AND workflow_currentoperator.requestid = b.requestid AND b.userid in ("
							+ userIDAll + ") and b.usertype= " + usertype + ") ");
			} else {
				sqlsb.append(" AND EXISTS (SELECT NULL FROM workFlow_CurrentOperator b WHERE workflow_currentoperator.workflowid = b.workflowid AND workflow_currentoperator.requestid = b.requestid AND b.userid in ("
							+ user.getUID() + ") and b.usertype= " + usertype + ") ");
			}
		}
		if (offical.equals("1")) {//发文/收文/签报
			if (officalType == 1) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType in (1,3) and (isvalid=1 or isvalid=3))");
			} else if (officalType == 2) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType=2 and (isvalid=1 or isvalid=3))");
			}
		}
		sqlsb.append(" group by workflowtype, workflowid order by workflowtype, workflowid ");
		RecordSet.executeSql(sqlsb.toString());
		while (RecordSet.next()) {
			String theworkflowid = Util.null2String(RecordSet.getString("workflowid"));
			String theworkflowtype = Util.null2String(RecordSet.getString("workflowtype"));
			theworkflowid = WorkflowVersion.getActiveVersionWFID(theworkflowid);
			if(!"1".equals(WorkflowComInfo.getIsValid(theworkflowid)))
				continue;
			if (wftypeList.indexOf(theworkflowtype) == -1)
				wftypeList.add(theworkflowtype);
			if (workflowList.indexOf(theworkflowid) == -1)
				workflowList.add(theworkflowid);
		}
		StringBuffer wftypesb = new StringBuffer();
		StringBuffer wfsb = new StringBuffer();
		for(String _typeid : wftypeList){
			wftypesb.append(",").append(_typeid);
		}
		for(String _wfid : workflowList){
			wfsb.append(",").append(WorkflowVersion.getAllVersionStringByWFIDs(_wfid));
		}
		if (wftypesb.length() > 0)
			wftypesb = wftypesb.delete(0, 1);
		if (wfsb.length() > 0)
			wfsb = wfsb.delete(0, 1);

		/******************未读流程、反馈流程计数*********************/
		sqlsb = new StringBuffer();
		if ("1".equals(belongtoshow)) {
			sqlsb.append("select a.workflowtype, a.workflowid, a.viewtype, count(a.requestid) workflowcount ");
		} else {
			sqlsb.append("select a.workflowtype, a.workflowid, a.viewtype, count(distinct a.requestid) workflowcount ");
		}
		sqlsb.append("	  from workflow_currentoperator a ");
		sqlsb.append("	  where (((isremark='0' and (takisremark is null or takisremark=0 )) and isprocessed is null) ");
		sqlsb.append("	         or isremark = '1' or ");
		sqlsb.append("	        isremark = '8' or isremark = '9' or isremark = '7') ");
		sqlsb.append("	    and islasttimes = 1 ");
		if (!"".equals(cursltwftypeid)) {
			sqlsb.append("   and workflowtype in (").append(cursltwftypeid).append(")");
		}
		if ("1".equals(belongtoshow)) {
			sqlsb.append("	    and userid in (").append(userIDAll);
		} else {
			sqlsb.append("	    and userid in (").append(resourceid);
		}
		sqlsb.append("	)    and usertype = ").append(usertype);
		if (!"".equals(wftypesb.toString())) {
			sqlsb.append("	    and a.workflowtype in ( ").append(wftypesb).append(") ");
		}
		if (!"".equals(wfsb.toString())) {
			sqlsb.append("	    and a.workflowid in (").append(wfsb).append(")");
		}
		sqlsb.append("	    and exists (select c.requestid from workflow_requestbase c ");
		sqlsb.append("	          where (c.deleted <> 1 or c.deleted is null or c.deleted='') and c.requestid = a.requestid");
		if (RecordSet.getDBType().equals("oracle")) {
			sqlsb.append(" and (nvl(c.currentstatus,-1) = -1 or (nvl(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		} else {
			sqlsb.append(" and (isnull(c.currentstatus,-1) = -1 or (isnull(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		}
		sqlsb.append(")");
		if (!"".equals(tworkflowNodeIDs)) {
			sqlsb.append(" and a.nodeid in (" + WorkflowVersion.getAllRelationNodeStringByNodeIDs(tworkflowNodeIDs)+ ") ");
		}
		if (!superior) {
			if ("1".equals(belongtoshow)) {
				sqlsb.append(" AND EXISTS (SELECT NULL FROM workFlow_CurrentOperator b WHERE a.workflowid = b.workflowid AND a.requestid = b.requestid AND b.userid in ("
							+ userIDAll + ") and b.usertype= " + usertype + ") ");
			} else {
				sqlsb.append(" AND EXISTS (SELECT NULL FROM workFlow_CurrentOperator b WHERE a.workflowid = b.workflowid AND a.requestid = b.requestid AND b.userid in ("
							+ user.getUID() + ") and b.usertype= " + usertype + ") ");
			}
		}
		if (offical.equals("1")) {//发文/收文/签报
			if (officalType == 1) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType in (1,3) and (isvalid=1 or isvalid=3))");
			} else if (officalType == 2) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType=2 and (isvalid=1 or isvalid=3))");
			}
		}
		sqlsb.append(" group by a.viewtype, a.workflowtype, a.workflowid");
		//System.out.println("待办未读反馈计数SQL----" + sqlsb.toString());
		rs.executeSql(sqlsb.toString());
		while (rs.next()) {
			String _wfid = WorkflowVersion.getActiveVersionWFID(Util.null2String(rs.getString("workflowid")));
			int _count = Util.getIntValue(rs.getString("workflowcount"), 0);
			int viewtype = Util.getIntValue(rs.getString("viewtype"), 2);
			int wfindex = workflowList.indexOf(_wfid);
			if (wfindex != -1) {
				int flowall_temp = flowallmap.containsKey(_wfid) ? flowallmap.get(_wfid) : 0;
				flowall_temp += _count;
				flowallmap.put(_wfid, flowall_temp);
				if (viewtype == 0) {
					int flownew_temp = flownewmap.containsKey(_wfid) ? flownewmap.get(_wfid) : 0;
					flownew_temp += _count;
					flownewmap.put(_wfid, flownew_temp);
				}
				if (viewtype == -1) {
					int flowres_temp = flowresmap.containsKey(_wfid) ? flowresmap.get(_wfid) : 0;
					flowres_temp += _count;
					flowresmap.put(_wfid, flowres_temp);
				}
			}
		}

		/******************超时流程计数*********************/
		sqlsb = new StringBuffer();
		if ("1".equals(belongtoshow)) {
			sqlsb.append("select a.workflowtype,a.workflowid, count(distinct a.requestid) overcount ");
		} else {
			sqlsb.append("select a.workflowtype,a.workflowid, count(a.requestid) overcount ");
		}
		sqlsb.append("  from workflow_currentoperator a ");
		sqlsb.append("  where (((isremark='0' and (takisremark is null or takisremark=0 )) and (isprocessed = '2' or isprocessed = '3')) or ");
		sqlsb.append("        isremark = '5') ");
		sqlsb.append("    and islasttimes = 1 ");
		if (!"".equals(cursltwftypeid)) {
			sqlsb.append("   and workflowtype in (").append(cursltwftypeid).append(")");
		}
		if ("1".equals(belongtoshow)) {
			sqlsb.append("	    and userid in (").append(userIDAll);
		} else {
			sqlsb.append("	    and userid in (").append(resourceid);
		}
		sqlsb.append("   ) and usertype = ").append(usertype);
		if (!"".equals(wftypesb.toString())) {
			sqlsb.append("    and a.workflowtype in (").append(wftypesb).append(")");
		}
		if (!"".equals(wfsb.toString())) {
			sqlsb.append("    and a.workflowid in (").append(wfsb).append(")");
		}
		sqlsb.append("    and exists (select 1 from workflow_requestbase c");
		sqlsb.append("         where (c.deleted <> 1 or c.deleted is null or c.deleted='') and c.workflowid = a.workflowid ");
		if (RecordSet.getDBType().equals("oracle")) {
			sqlsb.append(" and (nvl(c.currentstatus,-1) = -1 or (nvl(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		} else {
			sqlsb.append(" and (isnull(c.currentstatus,-1) = -1 or (isnull(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		}
		sqlsb.append("           and c.requestid = a.requestid)");
		if (!"".equals(tworkflowNodeIDs)) {
			sqlsb.append(" and a.nodeid in (" + WorkflowVersion.getAllRelationNodeStringByNodeIDs(tworkflowNodeIDs)+ ") ");
		}
		if (!superior) {
			sqlsb.append(" AND EXISTS (SELECT NULL FROM workFlow_CurrentOperator b WHERE a.workflowid = b.workflowid AND a.requestid = b.requestid AND b.userid="
						+ user.getUID() + " and b.usertype= " + usertype + ") ");
		}
		if (offical.equals("1")) {//发文/收文/签报
			if (officalType == 1) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType in (1,3) and (isvalid=1 or isvalid=3))");
			} else if (officalType == 2) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType=2 and (isvalid=1 or isvalid=3))");
			}
		}
		sqlsb.append(" GROUP BY a.workflowtype, a.workflowid ");
		RecordSet.executeSql(sqlsb.toString());
		//System.out.println("待办超时计数SQL----"+sqlsb.toString());
		while (RecordSet.next()) {
			String _wfid = WorkflowVersion.getActiveVersionWFID(Util.null2String(RecordSet.getString("workflowid")));
			int _count = RecordSet.getInt("overcount");
			int wfindex = workflowList.indexOf(_wfid);
			if (wfindex != -1) {
				int flowall_temp = flowallmap.containsKey(_wfid) ? flowallmap.get(_wfid) : 0;
				flowall_temp += _count;
				flowallmap.put(_wfid, flowall_temp);
			}
			int flowover_temp = flowovermap.containsKey(_wfid) ? flowovermap.get(_wfid) : 0;
			flowover_temp += _count;
			flowovermap.put(_wfid, flowover_temp);
		}

		/******************被督办流程计数,和其他查询不冲突*********************/
		sqlsb = new StringBuffer();
		sqlsb.append("select a.workflowtype, a.workflowid, count(0) workflowcount ");
		sqlsb.append("	  from workflow_currentoperator a ");
		sqlsb.append("	  where ((isremark = '0' and (isprocessed is null or ");
		sqlsb.append("	        (isprocessed <> '2' and isprocessed <> '3'))) or isremark = '1' or ");
		sqlsb.append("	        isremark = '8' or isremark = '9' or isremark = '7') ");
		sqlsb.append("	    and islasttimes = 1 ");
		if (!"".equals(cursltwftypeid)) {
			sqlsb.append("   and workflowtype in (").append(cursltwftypeid).append(")");
		}
		if ("1".equals(belongtoshow)) {
			sqlsb.append("	    and userid in (").append(userIDAll);
		} else {
			sqlsb.append("	    and userid in (").append(resourceid);
		}
		sqlsb.append("	)    and usertype = ").append(usertype);
		if (!"".equals(wftypesb.toString())) {
			sqlsb.append("	    and a.workflowtype in (").append(wftypesb).append(")");
		}
		if (!"".equals(wfsb.toString())) {
			sqlsb.append("	    and a.workflowid in (").append(wfsb).append(")");
		}
		sqlsb.append("	    and exists (select c.requestid ");
		sqlsb.append("	           from workflow_requestbase c ");
		sqlsb.append("	          where (c.deleted <> 1 or c.deleted is null or c.deleted='') and c.requestid = a.requestid");
		sqlsb.append("		and ( select count(0) from workflow_requestlog where requestid = a.requestid and logtype='s') > 0");
		if (RecordSet.getDBType().equals("oracle")) {
			sqlsb.append(" and (nvl(c.currentstatus,-1) = -1 or (nvl(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		} else {
			sqlsb.append(" and (isnull(c.currentstatus,-1) = -1 or (isnull(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		}
		sqlsb.append(")");
		if (!"".equals(tworkflowNodeIDs)) {
			sqlsb.append(" and a.nodeid in (" + WorkflowVersion.getAllRelationNodeStringByNodeIDs(tworkflowNodeIDs)+ ") ");
		}
		if (!superior) {
			sqlsb.append(" AND EXISTS (SELECT NULL FROM workFlow_CurrentOperator b WHERE a.workflowid = b.workflowid AND a.requestid = b.requestid AND b.userid="
						+ user.getUID() + " and b.usertype= " + usertype + ") ");
		}
		if (offical.equals("1")) {//发文/收文/签报
			if (officalType == 1) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType in (1,3) and (isvalid=1 or isvalid=3))");
			} else if (officalType == 2) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType=2 and (isvalid=1 or isvalid=3))");
			}
		}
		sqlsb.append(" GROUP BY a.workflowtype, a.workflowid");
		RecordSet.executeSql(sqlsb.toString());
		//System.out.println("待办督办计数SQL-----"+sqlsb.toString());
		while (RecordSet.next()) {
			String tworkflowid = WorkflowVersion.getActiveVersionWFID(Util.null2String(RecordSet.getString("workflowid")));
			int _count = RecordSet.getInt(3);
			int flowsup_temp = flowsupmap.containsKey(tworkflowid) ? flowsupmap.get(tworkflowid) : 0;
			flowsup_temp += _count;
			flowsupmap.put(tworkflowid, flowsup_temp);
		}
		
		if (!"".equals(cursltwftypeid)) {
			if (wftypeList.size() == 0) {
				String[] curoptwfarrary = cursltwftypeid.split(",");
				for (int i = 0; i < curoptwfarrary.length; i++) {
					wftypeList.add(curoptwfarrary[i]);
				}
			}
			String _tempwfsql = "SELECT id FROM workflow_base WHERE workflowtype in (" + cursltwftypeid + ")";
			RecordSet _temprs = new RecordSet();
			_temprs.executeSql(_tempwfsql);
			while (_temprs.next()) {
				String _tempwfid = Util.null2String(_temprs.getString("id"));
				if (!workflowList.contains(_tempwfid)) {
					workflowList.add(_tempwfid);
				}
			}
		}
		
		/**************生成计数对象*****************/
		Map<String,Map<String,String>> countmap = new HashMap<String,Map<String,String>>();
		int total_all = 0;
		int total_new = 0;
		int total_res = 0;
		int total_over = 0;
		int total_sup = 0;
		for (int i = 0; i < wftypeList.size(); i++) {
			String typeid = (String) wftypeList.get(i);
			int type_all = 0;
			int type_new = 0;
			int type_res = 0;
			int type_over = 0;
			int type_sup = 0;
			for (int j = 0; j < workflowList.size(); j++) {
				String workflowid = (String) workflowList.get(j);
				String curtypeid = WorkflowComInfo.getWorkflowtype(workflowid);
				if (!curtypeid.equals(typeid))
					continue;
				int wf_all = Util.getIntValue(flowallmap.get(workflowid)+"", 0);
				int wf_new = Util.getIntValue(flownewmap.get(workflowid)+"", 0);
				int wf_res = Util.getIntValue(flowresmap.get(workflowid)+"", 0);
				int wf_over = Util.getIntValue(flowovermap.get(workflowid)+"", 0);
				int wf_sup = Util.getIntValue(flowsupmap.get(workflowid)+"", 0);
				Map<String,String> wfcountmap = new HashMap<String,String>();
				wfcountmap.put("domid", "wf_"+workflowid);
				wfcountmap.put("keyid", workflowid);
				wfcountmap.put("workflowname", WorkflowComInfo.getWorkflowname(workflowid));
				wfcountmap.put("flowAll", wf_all+"");
				wfcountmap.put("flowNew", wf_new+"");
				wfcountmap.put("flowRes", wf_res+"");
				wfcountmap.put("flowOver", wf_over+"");
				wfcountmap.put("flowSup", wf_sup+"");
				countmap.put(wfcountmap.get("domid"), wfcountmap);
				type_all += wf_all;
				type_new += wf_new;
				type_res += wf_res;
				type_over += wf_over;
				type_sup += wf_sup;
				total_all += wf_all;
				total_new += wf_new;
				total_res += wf_res;
				total_over += wf_over;
				total_sup += wf_sup;
			}
			Map<String,String> typecountmap = new HashMap<String,String>();
			typecountmap.put("domid", "type_"+typeid);
			typecountmap.put("keyid", typeid);
			typecountmap.put("flowAll", type_all+"");
			typecountmap.put("flowNew", type_new+"");
			typecountmap.put("flowRes", type_res+"");
			typecountmap.put("flowOver", type_over+"");
			typecountmap.put("flowSup", type_sup+"");
			countmap.put(typecountmap.get("domid"), typecountmap);
		}
		//集成异构系统数据
		new OtherSystemRequestUtil().extendToDoCountData(countmap, user);
		total_all += new OtherSystemRequestUtil().getToDoFlowAllCount(user);
		total_new += new OtherSystemRequestUtil().getToDoFlowNewCount(user);
		
		//生成全部流程总计信息
		Map<String,String> totalcountmap = new HashMap<String,String>();
		totalcountmap.put("flowAll", total_all+"");
		totalcountmap.put("flowNew", total_new+"");
		totalcountmap.put("flowRes", total_res+"");
		totalcountmap.put("flowOver", total_over+"");
		totalcountmap.put("flowSup", total_sup+"");
		
		Map<String,Object> apidatas = new HashMap<String,Object>();
		apidatas.put("totalcount", totalcountmap);
		apidatas.put("treecount", countmap);
		return apidatas;
	}
	
	private String convertChar(String str, int languageid){
		return Util.toScreenForJs(Util.toScreen(str, languageid));
	}
	
}
