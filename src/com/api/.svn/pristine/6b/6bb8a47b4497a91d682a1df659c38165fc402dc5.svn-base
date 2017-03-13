package com.api.workflow.util;

import weaver.conn.RecordSet;
import weaver.general.BaseBean;
import weaver.general.Util;
import weaver.general.WorkFlowTransMethod;

/**
 * SPA模式下反射类
 * @author liuzy 2017/01/09
 */
public class WorkFlowSPATransMethod extends BaseBean {

	private WorkFlowTransMethod workFlowTransMethod = new WorkFlowTransMethod();

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
			String funstrnew =  "openSPA4Single";
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
