package com.api.workflow.util;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.api.workflow.service.LayoutInfoService;

import weaver.conn.RecordSet;
import weaver.general.BaseBean;
import weaver.general.Util;
import weaver.general.WorkFlowTransMethod;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;

/**
 * SPA模式下反射类
 * @author liuzy 2017/01/09
 */
public class WorkFlowSPATransMethod extends BaseBean {

	private WorkFlowTransMethod workFlowTransMethod = new WorkFlowTransMethod();
	
	private static Map<String,Boolean> tabmap = new HashMap<String,Boolean>();

	public static Map<String, Boolean> getTabmap() {
		return tabmap;
	}

	/*@GET
	@Path("/opentab")
	@Produces(MediaType.TEXT_PLAIN)
	public String openTab(@Context HttpServletRequest request, @Context HttpServletResponse response){
		User user = HrmUserVarify.getUser(request, response);
		this.getTabmap().put(user.getUID()+"", true);
		return "hasopen";
	}
	
	@GET
	@Path("/closetab")
	@Produces(MediaType.TEXT_PLAIN)
	public String closeTab(@Context HttpServletRequest request, @Context HttpServletResponse response){
		User user = HrmUserVarify.getUser(request, response);
		this.getTabmap().remove(user.getUID()+"");
		return "hasclose";
	}*/

	public String getWfNewLinkWithTitle(String requestname, String para2) {
		String requestnamelink = workFlowTransMethod.getWfNewLinkWithTitle(requestname, para2);
		String[] tempStr = Util.splitString(para2, "+");
		String requestid = Util.null2String(tempStr[0]);
		String workflowid = Util.null2String(tempStr[1]);
		String nodeid = Util.null2String(tempStr[5]);
		String isremark = Util.null2String(tempStr[6]);
		int userid = Util.getIntValue(Util.null2String(tempStr[7]));
		
		requestnamelink = this.manageSPARequestNameLink(requestnamelink, requestid, workflowid, nodeid, userid, isremark);
		return requestnamelink;
	}
	
	public String getWfNewLinkWithTitle2(String requestname, String para2) throws Exception {
		String requestnamelink = workFlowTransMethod.getWfNewLinkWithTitle2(requestname, para2);
		String[] tempStr = Util.splitString(para2, "+");
		String requestid = Util.null2String(tempStr[0]);
		String workflowid = Util.null2String(tempStr[1]);
		String nodeid = Util.null2String(tempStr[5]);
		String isremark = Util.null2String(tempStr[6]);
		int userid = Util.getIntValue(Util.null2String(tempStr[7]));
		
		requestnamelink = this.manageSPARequestNameLink(requestnamelink, requestid, workflowid, nodeid, userid, isremark);
		return requestnamelink;
	}
	
	public String getWfShareLinkWithTitle(String requestname, String para2) {
		String requestnamelink = workFlowTransMethod.getWfShareLinkWithTitle(requestname, para2);
		String[] tempStr = Util.splitString(para2, "+");
		String requestid = Util.null2String(tempStr[0]);
        String workflowid=Util.null2String(tempStr[1]);
        String nodeid = Util.null2String(tempStr[5]);
        String isremark = Util.null2String(tempStr[6]);
        int userid = Util.getIntValue(Util.null2String(tempStr[7]));
        
        requestnamelink = this.manageSPARequestNameLink(requestnamelink, requestid, workflowid, nodeid, userid, isremark);
		return requestnamelink;
	}
	
	public String getWfShareLinkWithTitle2(String requestname, String para2) throws Exception{
		String requestnamelink = workFlowTransMethod.getWfShareLinkWithTitle2(requestname, para2);
		String[] tempStr = Util.splitString(para2, "+");
		String requestid = Util.null2String(tempStr[0]);
		String workflowid = Util.null2String(tempStr[1]);
		String nodeid = Util.null2String(tempStr[5]);
		String isremark = Util.null2String(tempStr[6]);
		int userid = Util.getIntValue(Util.null2String(tempStr[7]));
		
		requestnamelink = this.manageSPARequestNameLink(requestnamelink, requestid, workflowid, nodeid, userid, isremark);
		return requestnamelink;
	}
	
	public String manageSPARequestNameLink(String requestnamelink, String requestid, String workflowid, String nodeid, int userid, String isremark){	
		boolean reqRoute = ServiceUtil.judgeWfFormReqRoute(requestid, workflowid, nodeid, userid, isremark);
		if(reqRoute){
			String funstr = "openFullWindowHaveBarForWFList";
			//String funstrnew = ServiceUtil.judgeSpaOpenWindow(userid) ? "openSPA4Single" : "openSPA";
			String funstrnew = tabmap.containsKey(userid+"") ? "openSPA4SingleTab" : "openSPA4Single";
			int idx = requestnamelink.indexOf(funstr);
			if(idx < 0)
				return requestnamelink;
			String str1 = requestnamelink.substring(0, idx);
			String str2 = requestnamelink.substring(idx+funstr.length());
			requestnamelink = str1 + funstrnew + str2.replaceFirst("/workflow/request/ViewRequest.jsp", "/main/workflow/req");
		}
		return requestnamelink;
	}
}
