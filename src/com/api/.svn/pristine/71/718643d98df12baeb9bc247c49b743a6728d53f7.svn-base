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
 * 流程已办页面相关信息获取
 * @author liuzy 2016/12/14
 */
public class RequestDoneService {
	
	/**
	 * 已办基础信息，包括树信息及分组信息
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
		List<Map<String,Object>> conditioninfo = new SearchConditionUtil().getCondition("done", user);
		
		Map<String,Object> apidatas = new HashMap<String,Object>();
		apidatas.put("pagetitle", SystemEnv.getHtmlLabelName(17991, user.getLanguage()));
		apidatas.put("treedata", treedata);
		apidatas.put("countcfg", countcfg);
		apidatas.put("groupinfo", groupinfo);
		apidatas.put("conditioninfo", conditioninfo);
		return apidatas;
	}

	/**
	 * 获取已办树
	 */
	private List<WfTreeNode> getTreeData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		User user = HrmUserVarify.getUser(request, response);
		RecordSet rs = new RecordSet();
		WorkTypeComInfo wfTypeComInfo = new WorkTypeComInfo();
		WorkflowComInfo wfComInfo = new WorkflowComInfo();
		HttpSession session = request.getSession();
		String offical = Util.null2String(request.getParameter("offical"));
		int officalType = Util.getIntValue(request.getParameter("officalType"), -1);

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
		String resourceid = Util.null2String(request.getParameter("resourceid"));
		int usertype = 0;
		if("2".equals(user.getLogintype()))
			usertype = 1;
		if (resourceid.equals(""))
			resourceid = "" + user.getUID();
		String userID = String.valueOf(user.getUID());
		String userIDAll = String.valueOf(user.getUID());
		String belongtoshow = "";
		rs.executeSql("select * from HrmUserSetting where resourceId = " + userID);
		if (rs.next())
			belongtoshow = rs.getString("belongtoshow");
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
			response.sendRedirect("/workflow/search/WFSearchCustom.jsp?offical=" + offical + "&officalType="+ officalType 
				+ "&fromadvancedmenu=1&infoId=" + infoId + "&selectedContent=" + selectedContent+ "&menuType=" + menuType);
			return "hasforward";
		}*/
		/* edited end */

		StringBuffer sqlsb = new StringBuffer();
		sqlsb.append("select wt.id workflowtype,case wb.isvalid when '3' then wb.activeversionid else wb.id end as workflowid  ");
		sqlsb.append(" from workflow_type wt,workflow_base wb ");
		sqlsb.append(" where wt.id=wb.workflowtype and wb.isvalid in ('1','3') ");
		sqlsb.append(" and exists (select 1 from workflow_currentoperator wfc where workflowid=wb.id");
		sqlsb.append(" and (isremark in('2','4') or (isremark=0 and takisremark =-2)) ");
		sqlsb.append(" and islasttimes = 1 ");
		if ("1".equals(belongtoshow)) {
			sqlsb.append(" and userid in (").append(userIDAll);
		} else {
			sqlsb.append(" and userid in (").append(user.getUID());
		}
		sqlsb.append(" )  and usertype = ").append(usertype).append(wfComInfo.getDateDuringSql(date2during));
		/*sqlsb.append("	 and exists ");
		sqlsb.append("	  (select 1 from workflow_requestbase c");
		sqlsb.append("	          where (c.deleted <> 1 or c.deleted is null or c.deleted='') and c.workflowid = workflow_currentoperator.workflowid ");
		sqlsb.append("	            and c.requestid = workflow_currentoperator.requestid ");
		if (rs.getDBType().equals("oracle")) {
			sqlsb.append(" and (nvl(c.currentstatus,-1) = -1 or (nvl(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		} else {
			sqlsb.append(" and (isnull(c.currentstatus,-1) = -1 or (isnull(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		}
		sqlsb.append(")");*/
		sqlsb.append(" )");
		if (offical.equals("1")) {
			if (officalType == 1) {
				sqlsb.append(" and wb.isWorkflowDoc=1 and wb.officalType in (1,3)");
			} else if (officalType == 2) {
				sqlsb.append(" and wb.isWorkflowDoc=1 and wb.officalType=2");
			}
		}
		sqlsb.append(" order by wt.dsporder asc,wt.id asc,wb.dsporder asc,wb.workflowname");
		
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
		new OtherSystemRequestUtil().extendHandledTreeData(tree, user);
		return tree;
	}
	
	/**
	 * 已办计数信息
	 */
	public Map<String,Object> getCountInfo(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		WorkflowComInfo wfComInfo = new WorkflowComInfo();
		RecordSet RecordSet = new RecordSet();
		String offical = Util.null2String(request.getParameter("offical"));
		int officalType = Util.getIntValue(request.getParameter("officalType"), -1);

		String f_weaver_belongto_userid = request.getParameter("f_weaver_belongto_userid");
		String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");
		User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
		if (user == null)
			throw new Exception("empty user");
		
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
		String resourceid = Util.null2String(request.getParameter("resourceid"));
		int usertype = 0;
		if("2".equals(user.getLogintype()))
			usertype = 1;
		if (resourceid.equals(""))
			resourceid = "" + user.getUID();
		String userID = String.valueOf(user.getUID());
		String userIDAll = String.valueOf(user.getUID());
		String belongtoshow = "";
		RecordSet.executeSql("select * from HrmUserSetting where resourceId = " + userID);
		if (RecordSet.next())
			belongtoshow = RecordSet.getString("belongtoshow");
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
		Map<String,Integer> flowallmap = new HashMap<String,Integer>();	//所有
		Map<String,Integer> flownewmap = new HashMap<String,Integer>();	//未读
		Map<String,Integer> flowresmap = new HashMap<String,Integer>();	//反馈

		StringBuffer sqlsb = new StringBuffer();
		sqlsb.append("select workflowtype,workflowid,viewtype, ");
		if ("1".equals(belongtoshow)) {
			sqlsb.append("   count(requestid) workflowcount ");
		} else {
			sqlsb.append("   count(distinct requestid) workflowcount ");
		}
		sqlsb.append("  from workflow_currentoperator ");
		sqlsb.append(" where (isremark in('2','4') or (isremark=0 and takisremark =-2)) ");
		sqlsb.append("   and islasttimes = 1 ");
		if ("1".equals(belongtoshow)) {
			sqlsb.append(" and userid in ( ").append(userIDAll);
		} else {
			sqlsb.append(" and userid in (").append(user.getUID());
		}
		sqlsb.append("  ) and usertype = ").append(usertype).append(wfComInfo.getDateDuringSql(date2during));
		sqlsb.append("	 and exists ");
		sqlsb.append("	  (select 1 from workflow_requestbase c");
		sqlsb.append("	          where (c.deleted <> 1 or c.deleted is null or c.deleted='') and c.workflowid = workflow_currentoperator.workflowid ");
		sqlsb.append("	            and c.requestid = workflow_currentoperator.requestid ");
		if ("1".equals(belongtoshow)) {
			if (RecordSet.getDBType().equals("oracle")) {
				sqlsb.append(" and (nvl(c.currentstatus,-1) = -1 or (nvl(c.currentstatus,-1)=0 and c.creater in ("+ userIDAll + "))) ");
			} else {
				sqlsb.append(" and (isnull(c.currentstatus,-1) = -1 or (isnull(c.currentstatus,-1)=0 and c.creater in ("+ userIDAll + "))) ");
			}
		} else {
			if (RecordSet.getDBType().equals("oracle")) {
				sqlsb.append(" and (nvl(c.currentstatus,-1) = -1 or (nvl(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
			} else {
				sqlsb.append(" and (isnull(c.currentstatus,-1) = -1 or (isnull(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
			}
		}
		sqlsb.append(")");
		if (offical.equals("1")) {
			if (officalType == 1) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType in (1,3) and (isvalid=1 or isvalid=3))");
			} else if (officalType == 2) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType=2 and (isvalid=1 or isvalid=3))");
			}
		}
		sqlsb.append(" group by workflowtype, workflowid, viewtype ");
		sqlsb.append(" order by workflowtype, workflowid");
		RecordSet.executeSql(sqlsb.toString());
		//System.out.println("已办全部/反馈计数SQL-----"+sqlsb.toString());
		while (RecordSet.next()) {
			String _wfid = Util.null2String(RecordSet.getString("workflowid"));
			String theworkflowtype = Util.null2String(RecordSet.getString("workflowtype"));
			int _count = Util.getIntValue(RecordSet.getString("workflowcount"), 0);
			int viewtype = Util.getIntValue(RecordSet.getString("viewtype"), -2);
			_wfid = WorkflowVersion.getActiveVersionWFID(_wfid);
			if(!"1".equals(wfComInfo.getIsValid(_wfid)))
				continue;
			if (workflows.indexOf(_wfid) == -1)
				workflows.add(_wfid);
			int flowall_temp = flowallmap.containsKey(_wfid) ? flowallmap.get(_wfid) : 0;
			flowall_temp += _count;
			flowallmap.put(_wfid, flowall_temp);
			if(viewtype == -1){
				int flowres_temp = flowresmap.containsKey(_wfid) ? flowresmap.get(_wfid) : 0;
				flowres_temp += _count;
				flowresmap.put(_wfid, flowres_temp);
			}
			if (wftypes.indexOf(theworkflowtype) == -1)
				wftypes.add(theworkflowtype);
		}
		sqlsb = new StringBuffer();
		sqlsb.append("select workflowtype,workflowid,viewtype,count(distinct requestid) workflowcount ");
		sqlsb.append("  from workflow_currentoperator ");
		sqlsb.append(" where (isremark in('2','4') or (isremark=0 and takisremark =-2)) ");
		sqlsb.append("   and islasttimes = 1 ");
		if ("1".equals(belongtoshow)) {
			sqlsb.append(" and userid in ( ").append(userIDAll);
		} else {
			sqlsb.append(" and userid in (").append(user.getUID());
		}
		sqlsb.append("  ) and usertype = ").append(usertype);
		sqlsb.append("   and viewtype = 0 ");
		sqlsb.append("   and (agentType <> '1' or agentType is null) ").append(wfComInfo.getDateDuringSql(date2during));
		sqlsb.append("	 and exists (select 1 from workflow_requestbase c");
		sqlsb.append("	          where (c.deleted <> 1 or c.deleted is null or c.deleted='') and c.workflowid = workflow_currentoperator.workflowid ");
		sqlsb.append("	            and c.requestid = workflow_currentoperator.requestid ");
		if (RecordSet.getDBType().equals("oracle")) {
			sqlsb.append(" and (nvl(c.currentstatus,-1) = -1 or (nvl(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		} else {
			sqlsb.append(" and (isnull(c.currentstatus,-1) = -1 or (isnull(c.currentstatus,-1)=0 and c.creater="+ user.getUID() + ")) ");
		}
		sqlsb.append(")");
		if (offical.equals("1")) {
			if (officalType == 1) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType in (1,3) and isvalid=1)");
			} else if (officalType == 2) {
				sqlsb.append(" and workflowid in (select id from workflow_base where isWorkflowDoc=1 and officalType=2 and isvalid=1)");
			}
		}
		sqlsb.append(" group by workflowtype, workflowid, viewtype ");
		sqlsb.append(" order by workflowtype, workflowid");
		//System.out.println("已办未读计数SQL-----"+sqlsb.toString());
		RecordSet.executeSql(sqlsb.toString());
		while (RecordSet.next()) {
			String _wfid = Util.null2String(RecordSet.getString("workflowid"));
			int _count = Util.getIntValue(RecordSet.getString("workflowcount"), 0);
			int viewtype = Util.getIntValue(RecordSet.getString("viewtype"), -2);
			_wfid = WorkflowVersion.getActiveVersionWFID(_wfid);
			if(!"1".equals(wfComInfo.getIsValid(_wfid)) || viewtype != 0)
				continue;
			int flownew_temp = flownewmap.containsKey(_wfid) ? flownewmap.get(_wfid) : 0;
			flownew_temp += _count;
			flownewmap.put(_wfid, flownew_temp);
		}
		/***********生成对象************/
		Map<String,Map<String,String>> countmap = new HashMap<String,Map<String,String>>();
		String typeid = "";
		String workflowid = "";
		for (int i = 0; i < wftypes.size(); i++) {
			typeid = (String) wftypes.get(i);
			int type_all = 0;
			int type_new = 0;
			int type_res = 0;
			for (int j = 0; j < workflows.size(); j++) {
				workflowid = (String) workflows.get(j);
				String curtypeid = wfComInfo.getWorkflowtype(workflowid);
				if (!curtypeid.equals(typeid))
					continue;
				int wf_all = Util.getIntValue(flowallmap.get(workflowid)+"", 0);
				int wf_new = Util.getIntValue(flownewmap.get(workflowid)+"", 0);
				int wf_res = Util.getIntValue(flowresmap.get(workflowid)+"", 0);
				if(wf_all <= 0)
					continue;
				Map<String,String> wfcountmap = new HashMap<String,String>();
				wfcountmap.put("domid", "wf_"+workflowid);
				wfcountmap.put("keyid", workflowid);
				wfcountmap.put("workflowname", wfComInfo.getWorkflowname(workflowid));
				wfcountmap.put("flowAll", wf_all+"");
				wfcountmap.put("flowNew", wf_new+"");
				wfcountmap.put("flowRes", wf_res+"");
				countmap.put(wfcountmap.get("domid"), wfcountmap);
				type_all += wf_all;
				type_new += wf_new;
				type_res += wf_res;
			}
			if(type_all <= 0)
				continue;
			Map<String,String> typecountmap = new HashMap<String,String>();
			typecountmap.put("domid", "type_"+typeid);
			typecountmap.put("keyid", typeid);
			typecountmap.put("flowAll", type_all+"");
			typecountmap.put("flowNew", type_new+"");
			typecountmap.put("flowRes", type_res+"");
			countmap.put(typecountmap.get("domid"), typecountmap);
		}
		//集成异构系统数据
		new OtherSystemRequestUtil().extendHandledCountData(countmap, user);
		
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
