package com.api.workflow.service;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import weaver.conn.RecordSet;
import weaver.general.BaseBean;
import weaver.general.PageIdConst;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import weaver.workflow.monitor.Monitor;
import weaver.workflow.request.WFLinkInfo;

import com.alibaba.fastjson.JSONObject;
import com.api.workflow.util.PageUidFactory;

import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 流程共享接口
 */
@Path("/workflow/share")
public class WorkflowShareService extends BaseBean {

	/**
	 * 流程共享列表
	 * ***/
	@GET
	@Path("/sharelist")
	@Produces(MediaType.TEXT_PLAIN)
	public String getResultTree(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		Map<String,Object> retmap = new HashMap<String,Object>();
		try{
			User user = HrmUserVarify.getUser(request, response);
			HttpSession session = request.getSession();
			RecordSet RecordSet = new RecordSet();
			WFLinkInfo wfLinkInfo = new WFLinkInfo();
			Monitor monitor = new Monitor();
			String f_weaver_belongto_userid=request.getParameter("f_weaver_belongto_userid");//需要增加的代码
			String f_weaver_belongto_usertype=request.getParameter("f_weaver_belongto_usertype");//需要增加的代码
			user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype) ;//需要增加的代码
			int userid=user.getUID();  
			String requestid = Util.null2String(request.getParameter("requestid"));
			String wfid = Util.null2String(request.getParameter("wfid"));
			int subcompanyid = -1;
			int nowuserid = user.getUID();
			String logintype = user.getLogintype();  
			int usertype = 0;
			if(logintype.equals("1")) usertype = 0;
			if(logintype.equals("2")) usertype = 1;
			boolean isshowdelete = false;
			/////////////////////////////////////////////
			String currentnodeid = "";
			currentnodeid = String.valueOf(wfLinkInfo.getCurrentNodeid(Integer.parseInt(requestid),nowuserid,Util.getIntValue(logintype,1)));
			String nodetype = wfLinkInfo.getNodeType(Integer.parseInt(currentnodeid));
			String currentnodetype = "";
			String creater = "";
			RecordSet.executeSql("select currentnodetype,creater from workflow_Requestbase where requestid = " + requestid);
			while(RecordSet.next())	{
				currentnodetype = Util.null2String(RecordSet.getString("currentnodetype"));
				creater = Util.null2String(RecordSet.getString(2));
				if(nodetype.equals("")) nodetype = currentnodetype;
			}
			/////////////////////////////////////////////
			RecordSet.executeSql("select isremark,isreminded,preisremark,id,groupdetailid,nodeid,(CASE WHEN isremark=9 THEN '7.5' ELSE isremark END) orderisremark from workflow_currentoperator where requestid="+requestid+" and userid="+nowuserid+" and usertype="+usertype+" order by orderisremark,id ");
			while(RecordSet.next())	{
				String isremark = Util.null2String(RecordSet.getString("isremark")) ;
				String tmpnodeid = Util.null2String(RecordSet.getString("nodeid"));
				if( isremark.equals("1")||isremark.equals("5") || isremark.equals("7")|| isremark.equals("9") ||(isremark.equals("0")  && !nodetype.equals("3")) ) {
					currentnodeid=tmpnodeid;
					break;
				}
			}
			/////////////////////////////////////////////
			
			//流程节点操作者有添加、删除权限（创建、审批、归档）
			//代理人有添加、删除权限

			String isremark = "";
			String preisremark = "";
			String agentorbyagentid = "";
			String agenttype = "";//是否被代理

			RecordSet.executeSql("select isremark,preisremark,agentorbyagentid,agenttype from WORKFLOW_CURRENTOPERATOR where requestid = "+  requestid + " and workflowid = " + wfid + " and userid = " + nowuserid);
			while(RecordSet.next()) {
				isremark = RecordSet.getString("isremark");
				preisremark = RecordSet.getString("preisremark");
				agentorbyagentid = RecordSet.getString("agentorbyagentid");
				agenttype = RecordSet.getString("agenttype");
				if("0".equals(isremark) || ("2".equals(isremark) && "0".equals(preisremark)) || "4".equals(isremark) || "1".equals(agenttype)){
					isshowdelete = true;
				}
			}
			
			//流程监控人有添加、删除权限
			weaver.workflow.monitor.MonitorDTO dto = monitor.getMonitorInfo(userid+"",creater,wfid);
			if(dto.getIsview())
				isshowdelete = true;
			
			String orderby = " id ";
			String tableString = "";
			String sqlwhere = " wfid = " + wfid + " and requestid = " + requestid;
			String isshowpara = requestid+"+"+wfid+"+"+nowuserid;
			String pageUid = PageUidFactory.getWfPageUid("wfshare");
			String otherParaobj = "column:departmentid+column:subcompanyid+column:userid+column:roleid+column:rolelevel+"+user.getLanguage()+"+column:jobid+column:joblevel+column:jobobj";
			String otherParalvl = "column:deptlevel+column:deptlevelMax+column:sublevel+column:sublevelMax+column:seclevel+column:seclevelMax+column:roleseclevel+column:roleseclevelMax+column:jobid+column:joblevel+column:jobobj";
			//System.out.println("[" + sqlwhere + "]");
			String backfields = " id,wfid,requestid,permissiontype,departmentid,deptlevel,subcompanyid,sublevel,seclevel,userid,seclevelMax,deptlevelMax,sublevelMax,roleid,rolelevel,roleseclevel,roleseclevelMax,iscanread,operator,currentnodeid,jobid,joblevel,jobobj ";
			String fromSql = " Workflow_SharedScope ";
			tableString = " <table instanceid=\"\" tabletype=\"checkbox\" pageUid=\"" + pageUid + "\" pagesize=\""+PageIdConst.getPageSize(PageIdConst.WF_REQUEST_SHARE,user.getUID())+"\" >"
					+ " <checkboxpopedom  id=\"checkbox\" popedompara=\""+isshowpara+"\" showmethod=\"weaver.workflow.request.WFShareTransMethod.getCheckbox\"  />"
					+ "       <sql backfields=\""
					+ backfields
					+ "\" sqlform=\""
					+ fromSql
					+ "\"  sqlwhere=\""
					+ Util.toHtmlForSplitPage(sqlwhere)
					+ "\"  sqlorderby=\""
					+ orderby
					+ "\"  sqlprimarykey=\"id\" sqlsortway=\"ASC\" sqlisdistinct=\"true\" />"
					+ "       <head>"
					+ "           <col width=\"20%\"  text=\""
					+ SystemEnv.getHtmlLabelName(21956, user.getLanguage())
					+ "\" column=\"permissiontype\" orderkey=\"permissiontype\" otherpara=\""+user.getLanguage()+"\" transmethod=\"weaver.workflow.request.WFShareTransMethod.getWFPermissiontype\" />"
					+ "           <col width=\"20%\"  text=\""
					+ SystemEnv.getHtmlLabelName(106, user.getLanguage())
					+ "\" column=\"permissiontype\" orderkey=\"permissiontype\" otherpara=\""
					+ otherParaobj
					+ "\" transmethod=\"weaver.workflow.request.WFShareTransMethod.getWFPermissionObj\" />"
					+ "           <col width=\"20%\"  text=\""
					+ SystemEnv.getHtmlLabelName(683, user.getLanguage())
					+ "\" column=\"permissiontype\" orderkey=\"permissiontype\" otherpara=\""
					+ otherParalvl
					+ "\" transmethod=\"weaver.workflow.request.WFShareTransMethod.getWFPermissionlevel\" />"
					
					+ "<col width=\"20%\"  text=\""
					+ SystemEnv.getHtmlLabelName(1380, user.getLanguage())+ SystemEnv.getHtmlLabelName(504, user.getLanguage())
					+ "\" column=\"iscanread\" orderkey=\"iscanread\" otherpara=\""+user.getLanguage()+"\" transmethod=\"weaver.workflow.request.WFShareTransMethod.getWFIsCanread\" />"
					+ "<col width=\"20%\"  text=\""
					+ SystemEnv.getHtmlLabelName(82615, user.getLanguage())
					+ "\" column=\"operator\" orderkey=\"operator\" transmethod=\"weaver.workflow.request.WFShareTransMethod.getWFOperator\" />"
					
					+ "       </head>";
            if(isshowdelete){
            	tableString += "		<operates>"+
            	"		<popedom column=\"id\" transmethod=\"weaver.workflow.request.WFShareTransMethod.checkWFPrmOperate\"></popedom> "+
            	"		<operate href=\"javascript:onDel();\" text=\""+SystemEnv.getHtmlLabelName(91,user.getLanguage())+"\" target=\"_self\" index=\"0\"/>"+
				"		</operates>";
            }
            tableString += " </table>";
			
			String sessionkey = user.getUID()+"_"+pageUid;
			Util_TableMap.setVal(sessionkey, tableString);
			retmap.put("sessionkey", sessionkey);
		}catch(Exception e){
			retmap.put("api_status", false);
			retmap.put("api_errormsg", e.getMessage());
			e.printStackTrace();
		}
		return JSONObject.toJSONString(retmap);
	}
	
}
