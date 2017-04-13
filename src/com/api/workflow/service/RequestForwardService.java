package com.api.workflow.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.alibaba.fastjson.JSON;

import weaver.conn.RecordSet;
import weaver.general.Pinyin4j;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.resource.MutilResourceBrowser;
import weaver.hrm.resource.ResourceComInfo;

@Path("/workflow/reqforward")
public class RequestForwardService {

	@GET
	@Path("/{requestid}")
	@Produces(MediaType.TEXT_PLAIN)
	public String getWfNodeOperators(@PathParam("requestid")
	String requestid, @Context
	HttpServletRequest request, @Context
	HttpServletResponse response) {
		User user = HrmUserVarify.getUser(request, response);// 需要增加的代码
		RecordSet rs = new RecordSet();

		StringBuffer sqlsb = new StringBuffer();
		sqlsb.append("select * ");
		sqlsb.append("	  from (select a.nodeid, ");
		sqlsb.append("	               b.nodename, ");
		sqlsb.append("              a.userid, ");
		sqlsb.append("              a.isremark, ");
		sqlsb.append("              a.lastisremark, ");
		sqlsb.append("              a.usertype, ");
		sqlsb.append("             a.agentorbyagentid, ");
		sqlsb.append("             a.agenttype, ");
		sqlsb.append("             a.receivedate, ");
		sqlsb.append("             a.receivetime, ");
		sqlsb.append("             a.operatedate, ");
		sqlsb.append("             a.operatetime, ");
		sqlsb.append("             a.viewtype, ");
		sqlsb.append("             a.nodetype ");
		sqlsb.append("        from (SELECT distinct requestid, ");
		sqlsb.append("                              userid, ");
		sqlsb.append("                              workflow_currentoperator.workflowid, ");
		sqlsb.append("                              workflowtype, ");
		sqlsb.append("                              isremark, ");
		sqlsb.append("                              lastisremark, ");
		sqlsb.append("                              usertype, ");
		sqlsb.append("                              workflow_currentoperator.nodeid, ");
		sqlsb.append("                              agentorbyagentid, ");
		sqlsb.append("                              agenttype, ");
		sqlsb.append("                              receivedate, ");
		sqlsb.append("                              receivetime, ");
		sqlsb.append("                              viewtype, ");
		sqlsb.append("                              iscomplete, ");
		sqlsb.append("                              operatedate, ");
		sqlsb.append("                              operatetime, ");
		sqlsb.append("                              nodetype ");
		sqlsb.append("                FROM workflow_currentoperator, workflow_flownode ");
		sqlsb.append("               where workflow_currentoperator.nodeid = ");
		sqlsb.append("                     workflow_flownode.nodeid ");
		sqlsb.append("                 and requestid = " + requestid + ") a, ");
		sqlsb.append("             workflow_nodebase b ");
		sqlsb.append("       where a.nodeid = b.id ");
		sqlsb.append("         and a.requestid = " + requestid + " ");
		sqlsb.append("         and a.agenttype <> 1 ");
		sqlsb.append("      union ");
		sqlsb.append("      select a.nodeid, ");
		sqlsb.append("             b.nodename, ");
		sqlsb.append("             a.userid, ");
		sqlsb.append("             a.isremark, ");
		sqlsb.append("             a.isremark as lastisremark, ");
		sqlsb.append("             a.usertype, ");
		sqlsb.append("             0 as agentorbyagentid, ");
		sqlsb.append("             '' as agenttype, ");
		sqlsb.append("             a.receivedate, ");
		sqlsb.append("             a.receivetime, ");
		sqlsb.append("             a.operatedate, ");
		sqlsb.append("             a.operatetime, ");
		sqlsb.append("             a.viewtype, ");
		sqlsb.append("             a.nodetype ");
		sqlsb.append("        from (SELECT distinct o.requestid, ");
		sqlsb.append("                              o.userid, ");
		sqlsb.append("                              o.workflowid, ");
		sqlsb.append("                              o.isremark, ");
		sqlsb.append("                              o.usertype, ");
		sqlsb.append("                              o.nodeid, ");
		sqlsb.append("                              o.receivedate, ");
		sqlsb.append("                              o.receivetime, ");
		sqlsb.append("                              o.viewtype, ");
		sqlsb.append("                              o.operatedate, ");
		sqlsb.append("                              o.operatetime, ");
		sqlsb.append("                              n.nodetype ");
		sqlsb.append("                FROM workflow_otheroperator o, workflow_flownode n ");
		sqlsb.append("               where o.nodeid = n.nodeid ");
		sqlsb.append("                 and o.requestid = " + requestid + ") a, ");
		sqlsb.append("             workflow_nodebase b ");
		sqlsb.append("       where a.nodeid = b.id ");
		sqlsb.append("         and a.requestid = " + requestid + ") a ");
		sqlsb.append(" order by a.nodetype,case when a.operatedate is null then 1 else 0 end,a.operatetime,a.receivedate, a.receivetime ");
		rs.executeSql(sqlsb.toString());

		ResourceComInfo rci = null;
		List<Map<String, Object>> operators = new ArrayList<Map<String, Object>>();
		try {
			rci = new ResourceComInfo();
			int tmpnodeid_old = -1;
	
			Map<String, Object> operator;
			List<String> operatorflag = new ArrayList<String>();
			while (rs.next()) {
				int tmpnodeid = rs.getInt("nodeid");
				String tmpnodename = rs.getString("nodename");
				String tmpuserid = rs.getString("userid");
				String tmpagentorbyagentid = rs.getString("agentorbyagentid");
				String tmpisremark = Util.null2String(rs.getString("isremark"));
	
				if (tmpnodeid_old != tmpnodeid) {
					tmpnodeid_old = tmpnodeid;
					operatorflag = new ArrayList<String>();
				}
				if (tmpisremark.equals("")) {
					tmpisremark = Util.null2String(rs.getString("lastisremark"));
				}
				int tmpusertype = rs.getInt("usertype");
				int tmpagenttype = rs.getInt("agenttype");
	
				if (tmpusertype == 0) {
					if (!operatorflag.contains(tmpuserid)) {
						operator = new HashMap<String, Object>();
						operator.put("uid", tmpuserid);
						String username = Util.toScreen(rci.getResourcename(tmpuserid), user.getLanguage());
						operator.put("data", username);
						operator.put("nodeid", tmpnodeid + "");
						operator.put("nodename", tmpnodename);
						operator.put("datapy", Pinyin4j.spell(username));
						operator.put("handed",tmpisremark.equals("2")?"1":"0");
						operator.put("jobtitlename", MutilResourceBrowser.getJobTitlesname(tmpuserid));
						operator.put("icon", rci.getMessagerUrls(tmpuserid));
						operators.add(operator);
						operatorflag.add(tmpuserid);
					}
					if (tmpagenttype == 2) {
						if (!operatorflag.contains(tmpuserid)) {
							operator = new HashMap<String, Object>();
							operator.put("uid", tmpagentorbyagentid);
							String username = Util.toScreen(rci.getResourcename(tmpagentorbyagentid), user.getLanguage());
							operator.put("data", username);
							operator.put("nodeid", tmpnodeid);
							operator.put("nodename", tmpnodename);
							operator.put("datapy", Pinyin4j.spell(username));
							operator.put("handed",tmpisremark.equals("2")?"1":"0");
							operator.put("jobtitlename", MutilResourceBrowser.getJobTitlesname(tmpagentorbyagentid));
							operator.put("icon", rci.getMessagerUrls(tmpagentorbyagentid));
							operators.add(operator);
							operatorflag.add(tmpuserid);
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return JSON.toJSONString(operators);
	}
}
