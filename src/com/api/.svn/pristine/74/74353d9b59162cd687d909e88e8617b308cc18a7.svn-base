package com.api.workflow.service;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import weaver.conn.RecordSet;
import weaver.general.BaseBean;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import com.api.workflow.bean.PageTabInfo;
import com.api.workflow.bean.TreeCountCfg;
import com.api.workflow.bean.WfTreeNode;
import com.api.workflow.util.OtherSystemRequestUtil;
import com.api.workflow.util.SearchConditionUtil;

import weaver.workflow.workflow.WorkTypeComInfo;
import weaver.workflow.workflow.WorkflowComInfo;
import weaver.workflow.workflow.WorkflowVersion;

/**
 * 流程我的请求相关信息获取
 * @author liuzy 2016/12/14
 */
public class RequestMineService {
	

	/**
	 * 我的请求基础信息，包括树信息及分组信息
	 */
	public Map<String,Object> getBaseInfo(HttpServletRequest request, HttpServletResponse response) throws Exception {
		User user = HrmUserVarify.getUser(request, response);
		//左侧树数据
		List<WfTreeNode> treedata = this.getTreeData(request, response);
		
		//树计数配置信息
		List<TreeCountCfg> countcfg = new ArrayList<TreeCountCfg>();
		countcfg.add(new TreeCountCfg("flowNew",  SystemEnv.getHtmlLabelName(84379,user.getLanguage()), true, "#ff3232", "#ff3232"));
		countcfg.add(new TreeCountCfg("flowRes",  SystemEnv.getHtmlLabelName(84506,user.getLanguage()), true, "#fea468", "#fea468"));
		countcfg.add(new TreeCountCfg("flowAll",  SystemEnv.getHtmlLabelName(84382,user.getLanguage()), false, "#c5c5c5", "#c5c5c5"));
		
		//分页头部分组信息
		List<PageTabInfo> groupinfo  = new ArrayList<PageTabInfo>();
		groupinfo.add(new PageTabInfo("flowAll", SystemEnv.getHtmlLabelName(332, user.getLanguage()), 0, false, ""));
		groupinfo.add(new PageTabInfo("flowUnFinish", SystemEnv.getHtmlLabelName(17999, user.getLanguage()), 1, false, ""));
		groupinfo.add(new PageTabInfo("flowFinish", SystemEnv.getHtmlLabelName(18800, user.getLanguage()), 2, false, ""));
		groupinfo.add(new PageTabInfo("flowNew", SystemEnv.getHtmlLabelName(25426, user.getLanguage()), 4, false, ""));
		groupinfo.add(new PageTabInfo("flowRes", SystemEnv.getHtmlLabelName(21950, user.getLanguage()), 3, false, ""));
		
		//高级查询条件信息
		List<Map<String,Object>> conditioninfo = new SearchConditionUtil().getCondition("mine", user);
		
		Map<String,Object> apidatas = new HashMap<String,Object>();
		apidatas.put("pagetitle", SystemEnv.getHtmlLabelName(1210, user.getLanguage()));
		apidatas.put("treedata", treedata);
		apidatas.put("countcfg", countcfg);
		apidatas.put("groupinfo", groupinfo);
		apidatas.put("conditioninfo", conditioninfo);
		return apidatas;
	}

	/**
	 * 获取我的请求树
	 */
	private List<WfTreeNode> getTreeData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		RecordSet rs = new RecordSet();
		WorkflowComInfo wfComInfo = new WorkflowComInfo();
		WorkTypeComInfo wfTypeComInfo = new WorkTypeComInfo();
		HttpSession session = request.getSession();
		String offical = Util.null2String(request.getParameter("offical"));
		int officalType = Util.getIntValue(request.getParameter("officalType"), -1);
		
		String f_weaver_belongto_userid = request.getParameter("f_weaver_belongto_userid");
		String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");
		User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
		int usertype = 0;
		if ("2".equals(user.getLogintype()))
			usertype = 1;
		
		boolean isinit = judgeIsInit(request);
		int date2during = Util.getIntValue(request.getParameter("date2during"), 0);
		if (isinit) {
			BaseBean baseBean = new BaseBean();
			String date2durings = Util.null2String(baseBean.getPropValue("wfdateduring", "wfdateduring"));
			String[] date2duringTokens = Util.TokenizerString2(date2durings, ",");
			int olddate2during = 0;
			if (date2duringTokens.length > 0)
				olddate2during = Util.getIntValue(date2duringTokens[0], 0);
			if (olddate2during < 0 || olddate2during > 36)
				olddate2during = 0;
			date2during = olddate2during;
		}
		String resourceid = "" + user.getUID();
		String userID = String.valueOf(user.getUID());
		String belongtoshow = "";
		rs.executeSql("select * from HrmUserSetting where resourceId = " + userID);
		if (rs.next())
			belongtoshow = rs.getString("belongtoshow");
		String userIDAll = String.valueOf(user.getUID());
		String Belongtoids = user.getBelongtoids();
		if (!"".equals(Belongtoids))
			userIDAll = userID + "," + Belongtoids;
		
		/* edited by wdl 2006-06-14 left menu advanced menu */
		/*int fromAdvancedMenu = Util.getIntValue(request.getParameter("fromadvancedmenu"), 0);
		if (fromAdvancedMenu == 1) {
			String selectedContent = Util.null2String(request.getParameter("selectedContent"));
			String menuType = Util.null2String(request.getParameter("menuType"));
			int infoId = Util.getIntValue(request.getParameter("infoId"), 0);
			if (selectedContent != null && selectedContent.startsWith("key_")) {
				String menuid = selectedContent.substring(4);
				rs.executeSql("select * from menuResourceNode where contentindex = '" + menuid + "'");
				selectedContent = "";
				while (rs.next()) {
					String keyVal = rs.getString(2);
					selectedContent += keyVal + "|";
				}
				if (selectedContent.indexOf("|") != -1)
					selectedContent = selectedContent.substring(0, selectedContent.length() - 1);
			}
			response.sendRedirect("/workflow/search/WFSearchCustom.jsp?f_weaver_belongto_userid=" + user.getUID()+ "&f_weaver_belongto_usertype=" + usertype 
				+ "&offical=" + offical + "&officalType=" + officalType+ "&fromadvancedmenu=1&infoId=" + infoId + "&selectedContent=" + selectedContent + "&menuType="+ menuType);
			return "hasforward";
		}*/
		/* edited end */
		
		StringBuffer sqlsb = new StringBuffer();
		sqlsb.append("select wt.id workflowtype,case wb.isvalid when '3' then wb.activeversionid else wb.id end as workflowid ");
		sqlsb.append(" from workflow_type wt,workflow_base wb ");
		sqlsb.append(" where wt.id=wb.workflowtype and wb.isvalid in ('1','3') ");
		sqlsb.append(" and exists (select 1 from workflow_requestbase t1 where workflowid=wb.id");
		if ("1".equals(belongtoshow)) {
			sqlsb.append(" and t1.creater in ( ").append(userIDAll);
		} else {
			sqlsb.append(" and t1.creater in (").append(resourceid);
		}
		sqlsb.append(") and t1.creatertype = ").append(usertype);
		/*if (rs.getDBType().equals("oracle")) {
			sqlsb.append(" and (nvl(t1.currentstatus,-1) = -1 or (nvl(t1.currentstatus,-1)=0 and t1.creater="+ user.getUID() + ")) ");
		} else {
			sqlsb.append(" and (isnull(t1.currentstatus,-1) = -1 or (isnull(t1.currentstatus,-1)=0 and t1.creater="+ user.getUID() + ")) ");
		}*/
		sqlsb.append(" )");
		if (offical.equals("1")) {// 发文/收文/签报
			if (officalType == 1) {
				sqlsb.append(" and wb.isWorkflowDoc=1 and wb.officalType in (1,3)");
			} else if (officalType == 2) {
				sqlsb.append(" and wb.isWorkflowDoc=1 and wb.officalType=2");
			}
		}
		sqlsb.append(" order by wt.dsporder asc,wt.id asc,wb.dsporder asc,wb.workflowname");
		//System.out.println("我的请求树SQL----"+sqlsb.toString());
		
		List<WfTreeNode> tree = new ArrayList<WfTreeNode>();
		List<String> typelist = new ArrayList<String>();
		List<String> wflist = new ArrayList<String>();
		rs.executeSql(sqlsb.toString());
		while (rs.next()) {
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
		new OtherSystemRequestUtil().extendMineTreeData(tree, user);
		return tree;
	}
	
	/**
	 * 我的请求计数信息
	 */
	public Map<String,Object> getCountInfo(HttpServletRequest request, HttpServletResponse response) throws Exception {
		RecordSet RecordSet = new RecordSet();
		WorkflowComInfo wfComInfo = new WorkflowComInfo();
		HttpSession session = request.getSession();
		String offical = Util.null2String(request.getParameter("offical"));
		int officalType = Util.getIntValue(request.getParameter("officalType"), -1);
		User user = HrmUserVarify.getUser(request, response);
		if (user == null)
			throw new Exception("empty user");
		
		int usertype = 0;
		if ("2".equals(user.getLogintype()))
			usertype = 1;
		
		boolean isinit = judgeIsInit(request);
		int date2during = Util.getIntValue(request.getParameter("date2during"), 0);
		if (isinit) {
			BaseBean baseBean = new BaseBean();
			String date2durings = Util.null2String(baseBean.getPropValue("wfdateduring", "wfdateduring"));
			String[] date2duringTokens = Util.TokenizerString2(date2durings, ",");
			int olddate2during = 0;
			if (date2duringTokens.length > 0)
				olddate2during = Util.getIntValue(date2duringTokens[0], 0);
			if (olddate2during < 0 || olddate2during > 36)
				olddate2during = 0;
			date2during = olddate2during;
		}
		String resourceid = "" + user.getUID();
		String userID = String.valueOf(user.getUID());
		String belongtoshow = "";
		RecordSet.executeSql("select * from HrmUserSetting where resourceId = " + userID);
		if (RecordSet.next())
			belongtoshow = RecordSet.getString("belongtoshow");
		String userIDAll = String.valueOf(user.getUID());
		String Belongtoids = user.getBelongtoids();
		if (!"".equals(Belongtoids))
			userIDAll = userID + "," + Belongtoids;

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
			response.sendRedirect("/workflow/search/WFSearchCustom.jsp?offical=" + offical + "&officalType="+ officalType 
				+ "&fromadvancedmenu=1&infoId=" + infoId + "&selectedContent=" + selectedContent+ "&menuType=" + menuType);
			return "hasforward";
		}*/
		/* edited end */

		ArrayList<String> wftypes = new ArrayList<String>();
		ArrayList<String> workflows = new ArrayList<String>();
		Map<String,Integer> flowallmap = new HashMap<String,Integer>();
		Map<String,Integer> flownewmap = new HashMap<String,Integer>();
		Map<String,Integer> flowresmap = new HashMap<String,Integer>();
		Map<String,Integer> flowovermap = new HashMap<String,Integer>();

		StringBuffer sqlsb = new StringBuffer();
		sqlsb.append("select count(distinct t1.requestid) typecount, ");
		sqlsb.append("      t2.workflowtype,t1.workflowid,t1.currentnodetype ");
		sqlsb.append(" from workflow_requestbase t1, workflow_base t2,workflow_currentoperator t3 ");
		if ("1".equals(belongtoshow)) {
			sqlsb.append(" where t1.creater in ( ").append(userIDAll);
		} else {
			sqlsb.append(" where t1.creater in (").append(resourceid);
		}
		sqlsb.append(") and t1.creatertype = ").append(usertype);
		sqlsb.append("  and t1.workflowid = t2.id ");
		sqlsb.append("  and t1.requestid = t3.requestid ");
		sqlsb.append("  and t3.islasttimes=1 ");
		sqlsb.append("  and (t2.isvalid='1' or t2.isvalid='3') ");
		if (RecordSet.getDBType().equals("oracle")) {
			sqlsb.append(" and (nvl(t1.currentstatus,-1) = -1 or (nvl(t1.currentstatus,-1)=0 and t1.creater="+ user.getUID() + ")) ");
		} else {
			sqlsb.append(" and (isnull(t1.currentstatus,-1) = -1 or (isnull(t1.currentstatus,-1)=0 and t1.creater="+ user.getUID() + ")) ");
		}
		sqlsb.append("  and exists ");
		sqlsb.append("		(select 1 from workflow_currentoperator");
		sqlsb.append("        where workflow_currentoperator.islasttimes='1' ");
		if ("1".equals(belongtoshow)) {
			sqlsb.append("          and workflow_currentoperator.userid in (" + userIDAll+ wfComInfo.getDateDuringSql(date2during) + ")) ");
		} else {
			sqlsb.append("          and workflow_currentoperator.userid in ( " + resourceid+ wfComInfo.getDateDuringSql(date2during) + ")) ");
		}
		if (offical.equals("1")) {// 发文/收文/签报
			if (officalType == 1) {
				sqlsb.append(" and t1.workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType in (1,3) and isvalid=1)");
			} else if (officalType == 2) {
				sqlsb.append(" and t1.workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType=2 and isvalid=1)");
			}
		}
		sqlsb.append("group by t2.workflowtype, t1.workflowid, t1.currentnodetype");
		RecordSet.executeSql(sqlsb.toString());
		// System.out.println("我的请求总个数计数SQL----"+sqlsb.toString());
		while (RecordSet.next()) {
			String typeid = RecordSet.getString("workflowtype");
			String wfid = RecordSet.getString("workflowid");
			wfid = WorkflowVersion.getActiveVersionWFID(wfid);
			if(!"1".equals(wfComInfo.getIsValid(wfid)))
				continue;
			int _count = RecordSet.getInt("typecount");
			if (wftypes.indexOf(typeid) == -1)
				wftypes.add(typeid);
			if (workflows.indexOf(wfid) == -1)
				workflows.add(wfid);
			int flowall_temp = flowallmap.containsKey(wfid) ? flowallmap.get(wfid) : 0;
			flowall_temp += _count;
			flowallmap.put(wfid, flowall_temp);
		}

		StringBuffer wfsb = new StringBuffer();
		StringBuffer wftypesb = new StringBuffer();
		for(String wfid : workflows){
			wfsb.append(",").append(WorkflowVersion.getAllVersionStringByWFIDs(wfid));
		}
		for(String typeid : wftypes){
			wftypesb.append(",").append(typeid);
		}
		if (wfsb.length() > 0)
			wfsb = wfsb.delete(0, 1);
		if(wftypesb.length() > 0)
			wftypesb = wftypesb.delete(0, 1);

		sqlsb = new StringBuffer();
		sqlsb.append(" select t3.workflowtype, t3.workflowid, count(distinct t1.requestid) viewcount,t3.viewtype,t3.isremark ");
		sqlsb.append(" from workflow_requestbase t1, workflow_base t2,workflow_currentoperator t3 ");
		sqlsb.append(" where t1.creater = ").append(resourceid);
		sqlsb.append(" and t3.userid = ").append(resourceid);
		sqlsb.append("  and t1.creatertype = ").append(usertype);
		sqlsb.append("  and t1.workflowid = t2.id ");
		sqlsb.append("	    and t3.workflowtype in ( ").append(wftypesb).append(") ");
		sqlsb.append("	    and t3.workflowid in (").append(wfsb).append(")");
		sqlsb.append("  and t1.requestid = t3.requestid ");
		sqlsb.append("  and t3.islasttimes=1 ");
		sqlsb.append("  and (t2.isvalid='1' or t2.isvalid='3') ");
		sqlsb.append(" and (t1.deleted=0 or t1.deleted is null) and ((t3.isremark in('2','4') and t1.currentnodetype = '3') or t1.currentnodetype <> '3' ) ");
		if (RecordSet.getDBType().equals("oracle")) {
			sqlsb.append(" and (nvl(t1.currentstatus,-1) = -1 or (nvl(t1.currentstatus,-1)=0 and t1.creater="+ user.getUID() + ")) ");
		} else {
			sqlsb.append(" and (isnull(t1.currentstatus,-1) = -1 or (isnull(t1.currentstatus,-1)=0 and t1.creater="+ user.getUID() + ")) ");
		}
		sqlsb.append("  and exists ");
		sqlsb.append("		(select 1 from workflow_currentoperator");
		sqlsb.append("        where workflow_currentoperator.islasttimes='1' ");
		sqlsb.append("          and workflow_currentoperator.userid = " + resourceid+ wfComInfo.getDateDuringSql(date2during) + ") ");
		if (offical.equals("1")) {// 发文/收文/签报
			if (officalType == 1) {
				sqlsb.append(" and t1.workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType in (1,3) and isvalid=1)");
			} else if (officalType == 2) {
				sqlsb.append(" and t1.workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType=2 and isvalid=1)");
			}
		}
		sqlsb.append(" group by viewtype,t3.isremark, t3.workflowtype, t3.workflowid");
		RecordSet.execute(sqlsb.toString());
		// System.out.println("我的请求计数SQL----"+sqlsb.toString());
		while (RecordSet.next()) {
			String wfid = WorkflowVersion.getActiveVersionWFID(Util.null2String(RecordSet.getString("workflowid")));
			if(!"1".equals(wfComInfo.getIsValid(wfid)))
				continue;
			int _count = Util.getIntValue(RecordSet.getString("viewcount"), 0);
			String _isremark = RecordSet.getString("isremark");
			String _viewtype = RecordSet.getString("viewtype");
			if (workflows.indexOf(wfid) != -1) {
				if (_isremark.equals("5")) {
					int flowover_temp = flowovermap.containsKey(wfid) ? flowovermap.get(wfid) : 0;
					flowover_temp += _count;
					flowovermap.put(wfid, flowover_temp);
				} else {
					if (_viewtype.equals("0")) {
						int flownew_temp = flownewmap.containsKey(wfid) ? flownewmap.get(wfid) : 0;
						flownew_temp += _count;
						flownewmap.put(wfid, flownew_temp);
					}
					if (_viewtype.equals("-1")) {
						int flowres_temp = flowresmap.containsKey(wfid) ? flowresmap.get(wfid) : 0;
						flowres_temp += _count;
						flowresmap.put(wfid, flowres_temp);
					}
				}
			}
		}

		/********************生成计数对象*********************/
		Map<String,Map<String,String>> countmap = new HashMap<String,Map<String,String>>();
		String typeid = "";
		String workflowid = "";
		for (int i = 0; i < wftypes.size(); i++) {
			typeid = (String) wftypes.get(i);
			int type_all = 0;
			int type_new = 0;
			int type_res = 0;
			int type_over = 0;

			for (int j = 0; j < workflows.size(); j++) {
				workflowid = (String) workflows.get(j);
				String curtypeid = wfComInfo.getWorkflowtype(workflowid);
				if (!curtypeid.equals(typeid))
					continue;
				int wf_all = Util.getIntValue(flowallmap.get(workflowid)+"", 0);
				int wf_new = Util.getIntValue(flownewmap.get(workflowid)+"", 0);
				int wf_res = Util.getIntValue(flowresmap.get(workflowid)+"", 0);
				int wf_over = Util.getIntValue(flowovermap.get(workflowid)+"", 0);
				if(wf_all <= 0)
					continue;
				Map<String,String> wfcountmap = new HashMap<String,String>();
				wfcountmap.put("domid", "wf_"+workflowid);
				wfcountmap.put("keyid", workflowid);
				wfcountmap.put("workflowname", wfComInfo.getWorkflowname(workflowid));
				wfcountmap.put("flowAll", wf_all+"");
				wfcountmap.put("flowNew", wf_new+"");
				wfcountmap.put("flowRes", wf_res+"");
				wfcountmap.put("flowOver", wf_over+"");
				countmap.put(wfcountmap.get("domid"), wfcountmap);
				type_all += wf_all;
				type_new += wf_new;
				type_res += wf_res;
				type_over += wf_over;
			}
			if(type_all <= 0)
				continue;
			Map<String,String> typecountmap = new HashMap<String,String>();
			typecountmap.put("domid", "type_"+typeid);
			typecountmap.put("keyid", typeid);
			typecountmap.put("flowAll", type_all+"");
			typecountmap.put("flowNew", type_new+"");
			typecountmap.put("flowRes", type_res+"");
			typecountmap.put("flowOver", type_over+"");
			countmap.put(typecountmap.get("domid"), typecountmap);
		}
		//集成异构系统数据
		new OtherSystemRequestUtil().extendMineCountData(countmap, user);
		
		Map<String,Object> apidatas = new HashMap<String,Object>();
		apidatas.put("treecount", countmap);
		return apidatas;
	}
	
	
	private String convertChar(String str, int languageid){
		return Util.toScreenForJs(Util.toScreen(str, languageid));
	}
	
	private boolean judgeIsInit(HttpServletRequest request){
		boolean isinit = true;
		Enumeration em = request.getParameterNames();
		while (em.hasMoreElements()) {
			String paramName = (String) em.nextElement();
			if (!paramName.equals(""))
				isinit = false;
			break;
		}
		return isinit;
	}
	
}
