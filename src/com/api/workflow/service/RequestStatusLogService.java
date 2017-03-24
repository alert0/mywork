package com.api.workflow.service;

import weaver.conn.RecordSet;
import weaver.crm.Maint.CustomerInfoComInfo;
import weaver.general.TimeUtil;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.hrm.resource.ResourceComInfo;
import weaver.workflow.monitor.Monitor;

import java.util.*;

/**
 * Created by CC on 2017-03-07.
 */
public class RequestStatusLogService {

    private User user = null;

    private int workflowid = 0;

    private int requestid = 0;

    private String isurger = "";

    private int desrequestid = 0;

	public RequestStatusLogService(String workflowid, String requestid) {
		this.workflowid = Util.getIntValue(workflowid, 0);
		this.requestid = Util.getIntValue(requestid, 0);
	}
	public RequestStatusLogService() {}
	
    public static Map<Integer, String> nodeNameCominfo = new HashMap<Integer, String>();

    public Map<String, Object> getStatusLogNew(String viewlogids, int pageSize, int currentid,int desremark) throws Exception {
        Monitor monitor = new Monitor();
        RecordSet rs = new RecordSet();
        int currentMaxId = 0;
        if (isurger.equals("true") || monitor.hasMonitor(requestid+"", user.getUID() + "")) {
            StringBuffer sqlsb = new StringBuffer();
            sqlsb.append(" select a.id,a.nodeid, ");
            sqlsb.append("                 b.nodename, ");
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
            sqlsb.append("             ,a.operator ");
            sqlsb.append("        from (SELECT distinct top ").append(pageSize);
            sqlsb.append("				o.id, " );
            sqlsb.append("				o.requestid, " );
            sqlsb.append("                              o.userid, ");
            sqlsb.append("                              o.workflowid, ");
            sqlsb.append("                              o.workflowtype, ");
            sqlsb.append("                              o.isremark, ");
            sqlsb.append("                              o.lastisremark, ");
            sqlsb.append("                              o.usertype, ");
            sqlsb.append("                              o.nodeid, ");
            sqlsb.append("                              o.agentorbyagentid, ");
            sqlsb.append("                              o.agenttype, ");
            sqlsb.append("                              o.receivedate, ");
            sqlsb.append("                              o.receivetime, ");
            sqlsb.append("                              o.viewtype, ");
            sqlsb.append("                              o.iscomplete, ");
            sqlsb.append("                              o.operatedate, ");
            sqlsb.append("                              o.operatetime, ");
            sqlsb.append("                              nodetype ");
            sqlsb.append("                              ,wr.operator ");
            sqlsb.append("                FROM workflow_currentoperator o ");

            sqlsb.append("                left join workflow_requestlog wr");
            sqlsb.append("                on wr.requestid=o.requestid");
            sqlsb.append("                and wr.nodeid=o.nodeid");
            sqlsb.append("                and wr.operator = o.userid");
            sqlsb.append("                and wr.logtype <> '1'");

            sqlsb.append("                , workflow_flownode ");

            sqlsb.append("               where o.nodeid = ");
            sqlsb.append("                     workflow_flownode.nodeid ");
            if(desremark ==1){//1:已提交
            	sqlsb.append(" AND o.isremark='2' AND wr.operator IS NOT null ");
            }else if(desremark == 2){//2：未提交
            	sqlsb.append(" and ((o.isremark = '0' and (o.takisremark is null or o.takisremark=0)) or o.isremark in ('1','5','7','8','9') )");
            }else if(desremark == 3){//3:已查看
            	sqlsb.append(" and (((o.isremark = '2' AND wr.operator IS NULL) or o.isremark in ('0','1','4','5','7','8','9')) AND o.viewtype IN (-1,-2)) ");
            }else if(desremark == 4){//4:未查看
            	sqlsb.append(" AND o.viewtype = 0 ");
            }
            sqlsb.append(" 			and o.id > ").append(currentid);
            sqlsb.append("                 and o.requestid = " + requestid + ") a, ");
            sqlsb.append("             workflow_nodebase b ");
            sqlsb.append("       where a.nodeid = b.id ");
            sqlsb.append("         and a.requestid = " + requestid + " ");
            sqlsb.append("         and a.agenttype <> 1 ");
            sqlsb.append("         order by  a.id ");
            //System.out.println("20170309 =====> sqlsb.toString() = "+sqlsb.toString());
            rs.executeSql(sqlsb.toString());

        } else {
            // 处理相关流程的查看权限
            if ("".equals(viewlogids)) {
                this.getViewLogids();
            }
            StringBuffer sqlsb = new StringBuffer();
            sqlsb.append("		select a.id,a.nodeid, ");
            sqlsb.append("             b.nodename, ");
            sqlsb.append("             a.userid, ");
            sqlsb.append("             a.isremark, ");
            sqlsb.append("             a.lastisremark, ");
            sqlsb.append("             a.usertype, ");
            sqlsb.append("             a.agentorbyagentid, ");
            sqlsb.append("             a.agenttype, ");
            sqlsb.append("             a.receivedate, ");
            sqlsb.append("             a.receivetime, ");
            sqlsb.append("             a.operatedate, ");
            sqlsb.append("             a.operatetime, ");
            sqlsb.append("             a.viewtype, ");
            sqlsb.append("             a.nodetype ");
            sqlsb.append("             ,a.operator ");
            sqlsb.append("        from (SELECT distinct top ").append(pageSize);
            sqlsb.append("				o.id, " );
            sqlsb.append("				o.requestid, " );
            sqlsb.append("                              o.userid, ");
            sqlsb.append("                              o.workflowid, ");
            sqlsb.append("                              o.workflowtype, ");
            sqlsb.append("                              o.isremark, ");
            sqlsb.append("                              o.lastisremark, ");
            sqlsb.append("                              o.usertype, ");
            sqlsb.append("                              o.nodeid, ");
            sqlsb.append("                              o.agentorbyagentid, ");
            sqlsb.append("                              o.agenttype, ");
            sqlsb.append("                              o.receivedate, ");
            sqlsb.append("                              o.receivetime, ");
            sqlsb.append("                              o.viewtype, ");
            sqlsb.append("                              o.iscomplete, ");
            sqlsb.append("                              o.operatedate, ");
            sqlsb.append("                              o.operatetime, ");
            sqlsb.append("                              nodetype ");
            sqlsb.append("                              ,wr.operator ");
            sqlsb.append("                FROM workflow_currentoperator o ");
            sqlsb.append("                left join workflow_requestlog wr");
            sqlsb.append("                on wr.requestid=o.requestid");
            sqlsb.append("                and wr.nodeid=o.nodeid");
            sqlsb.append("                and wr.operator = o.userid");
            sqlsb.append("                and wr.logtype <> '1'");

            sqlsb.append("                , workflow_flownode ");

            sqlsb.append("               where o.nodeid = ");
            sqlsb.append("                     workflow_flownode.nodeid ");
            if(desremark ==1){//1:已提交
            	sqlsb.append(" AND o.isremark='2' AND wr.operator IS NOT null ");
            }else if(desremark == 2){//2：未提交
            	sqlsb.append(" and ((o.isremark = '0' and (o.takisremark is null or o.takisremark=0)) or o.isremark in ('1','5','7','8','9') )");
            }else if(desremark == 3){//3:已查看
            	sqlsb.append(" and (((o.isremark = '2' AND wr.operator IS NULL) or o.isremark in ('0','1','4','5','7','8','9')) AND o.viewtype IN (-1,-2)) ");
            }else if(desremark == 4){//4:未查看
            	sqlsb.append(" AND o.viewtype = 0 ");
            }
            sqlsb.append(" 			and o.id > ").append(currentid);
            sqlsb.append("                 and o.requestid = " + requestid + ") a, ");
            sqlsb.append("             workflow_nodebase b ");
            sqlsb.append("       where a.nodeid = b.id ");
            sqlsb.append("         and a.requestid = " + requestid + " ");
            sqlsb.append("         and a.agenttype <> 1 ");
            sqlsb.append("         and a.nodeid in (" + viewlogids + ") ");
            sqlsb.append("         order by a.id ");
            
            //System.out.println("20170309 =====> sqlsb.toString() = "+sqlsb.toString());
            rs.executeSql(sqlsb.toString());
        }
        List<Map<String, String>> statuslist = new ArrayList<Map<String, String>>();
        while (rs.next()) {
        	currentMaxId = rs.getInt("id");
            int tmpnodeid = rs.getInt("nodeid");
            String tmpnodename = rs.getString("nodename");
            Map<String, String> nodekv = null;
            if (statuslist.size() == 0) {
                nodekv = new HashMap<String, String>();
                statuslist.add(nodekv);
            } else {
                Map<String, String> temmap = statuslist.get(statuslist.size() - 1);
                int tnodeid = Util.getIntValue(temmap.get("nodeid"), 0);
                if (tnodeid == tmpnodeid) {
                    nodekv = temmap;
                } else {
                    nodekv = new HashMap<String, String>();
                    statuslist.add(nodekv);
                }
            }
            nodekv.put("nodeid", tmpnodeid + "");
            nodekv.put("nodename", tmpnodename + "");
        }
        
        Map<String, Object> result = new HashMap<String, Object>();
        
        List<Map<String, Object>> allstatuslist = new ArrayList<Map<String, Object>>();
        List<Map<String, Object>> submitstatuslist = new ArrayList<Map<String, Object>>();
        List<Map<String, Object>> nosubmitstatuslist = new ArrayList<Map<String, Object>>();
        List<Map<String, Object>> viewstatuslist = new ArrayList<Map<String, Object>>();
        List<Map<String, Object>> noviewstatuslist = new ArrayList<Map<String, Object>>();
        //提交节点信息--滚动加载到当前currentoperator对应最大id
        result.put("currentMaxId", currentMaxId);
        result.put("viewlogids", viewlogids);
        if(desremark ==1){//1:已提交
        	//提交节点信息
        	result.put("submit", submitstatuslist);
        }else if(desremark == 2){//2：未提交
        	result.put("nosubmit", nosubmitstatuslist);
        }else if(desremark == 3){//3:已查看
        	result.put("view", viewstatuslist);
        }else if(desremark == 4){//4:未查看
        	result.put("noview", noviewstatuslist);
        }else{
        	//所有节点信息
        	result.put("all", allstatuslist);
        }
        //数字统计转到新接口count中
        
        ResourceComInfo resourceComInfo = new ResourceComInfo();
        CustomerInfoComInfo customerInfoComInfo = new CustomerInfoComInfo();

        rs.beforFirst();
        for (Iterator<Map<String, String>> it = statuslist.iterator(); it.hasNext();) {

            Map<String, String> nodekv = it.next();
            int fnodeid = Util.getIntValue(nodekv.get("nodeid"));
            String namename = nodekv.get("nodename");
            
            Map<String, Object> all_nodemap = new HashMap<String, Object>();
            all_nodemap.put("nodeid", fnodeid);
            all_nodemap.put("nodename", namename);
            
            Map<String, Object> submit_nodemap = new HashMap<String, Object>();
            Map<String, Object> nosubmit_nodemap = new HashMap<String, Object>();
            Map<String, Object> view_nodemap = new HashMap<String, Object>();
            Map<String, Object> noview_nodemap = new HashMap<String, Object>();
            List<Map<String, String>> nodeallstatuslist = new ArrayList<Map<String, String>>();
            List<Map<String, String>> nodesubmitstatuslist = new ArrayList<Map<String, String>>();
            List<Map<String, String>> nodenosubmitstatuslist = new ArrayList<Map<String, String>>();
            List<Map<String, String>> nodeviewstatuslist = new ArrayList<Map<String, String>>();
            List<Map<String, String>> nodenoviewstatuslist = new ArrayList<Map<String, String>>();
            
            if(desremark ==1){//1:已提交
            	//提交节点信息
            	submit_nodemap.putAll(all_nodemap);
            	submitstatuslist.add(submit_nodemap);
            	submit_nodemap.put("list", nodesubmitstatuslist);
            }else if(desremark == 2){//2：未提交
            	nosubmit_nodemap.putAll(all_nodemap);
            	nosubmitstatuslist.add(nosubmit_nodemap);
            	nosubmit_nodemap.put("list", nodenosubmitstatuslist);
            }else if(desremark == 3){//3:已查看
            	view_nodemap.putAll(all_nodemap);
            	viewstatuslist.add(view_nodemap);
            	view_nodemap.put("list", nodeviewstatuslist);
            }else if(desremark == 4){//4:未查看
            	noview_nodemap.putAll(all_nodemap);
            	noviewstatuslist.add(noview_nodemap);
            	noview_nodemap.put("list", nodenoviewstatuslist);
            }else{
            	//所有节点信息
            	allstatuslist.add(all_nodemap);
            	all_nodemap.put("list", nodeallstatuslist);
            }
            int submitCount = 0;
            int viewCount = 0;
            int noviewCount = 0;
            int listcount = 0;
            boolean islight = false;
            while (rs.next()) {
                int tmpnodeid = rs.getInt("nodeid");

                if (tmpnodeid != fnodeid) {
                    rs.previous();
                    break;
                }

                //String tmpnodename = rs.getString("nodename");
                String tmpuserid = rs.getString("userid");
                String tmpisremark = Util.null2String(rs.getString("isremark"));
                if (tmpisremark.equals("")) {
                    tmpisremark = Util.null2String(rs.getString("lastisremark"));
                }
                int tmpusertype = rs.getInt("usertype");
                String tmpagentorbyagentid = rs.getString("agentorbyagentid");
                int tmpagenttype = rs.getInt("agenttype");
                String tmpreceivedate = rs.getString("receivedate");
                String tmpreceivetime = rs.getString("receivetime");
                String tmpoperatedate = rs.getString("operatedate");
                String tmpoperatetime = rs.getString("operatetime");
                String viewtype = rs.getString("viewtype");
                boolean flags = false;
                String tmpIntervel = "";
                // 如果tmpisremark=2 判断时候在日志表里有该人（确定是否是由非会签得到的isremark=2）

                String operator = rs.getString("operator");
                if (operator != null && !"".equals(operator)) {
                    flags = true;
                }
                if (tmpisremark.equals("2") && tmpoperatedate != null && !tmpoperatedate.equals("")) {
                    tmpIntervel = TimeUtil.timeInterval2(tmpreceivedate + " " + tmpreceivetime, tmpoperatedate + " " + tmpoperatetime, user.getLanguage());
                }
                islight = !islight;
                // 操作人
                String _statususername = "";
                String _operatorid = "";
                String _operatortype = "0";
                if (tmpusertype == 0) {
                    if (tmpagenttype != 2) {
                        _operatorid = tmpuserid;
                        _statususername = Util.toScreen(resourceComInfo.getResourcename(tmpuserid), user.getLanguage());
                    } else {
                        _operatorid = tmpagentorbyagentid + "," + tmpuserid;
                        _statususername = Util.toScreen(resourceComInfo.getResourcename(tmpagentorbyagentid), user.getLanguage()) + "->" + Util.toScreen(resourceComInfo.getResourcename(tmpuserid), user.getLanguage());
                    }
                } else {
                    _operatorid = tmpuserid;
                    _operatortype = "1";
                    _statususername = Util.toScreen(customerInfoComInfo.getCustomerInfoname(tmpuserid), user.getLanguage());
                }

                // 查看状态 1:未查看， 2：:以查看， 3：已提交， 4:暂停， 5:撤销, 6:启用
                int _statusCode = 0;
                
                if (tmpisremark.equals("2") && flags) {
                    _statusCode = 3;
                    submitCount++;
                } else if (tmpisremark.equals("0") || tmpisremark.equals("1") || tmpisremark.equals("5") || tmpisremark.equals("4") || tmpisremark.equals("8") || tmpisremark.equals("9") || tmpisremark.equals("7") || (tmpisremark.equals("2") && !flags)) {
                    if (viewtype.equals("-2") || (viewtype.equals("-1") && !tmpoperatedate.equals(""))) {
                        _statusCode = 2;
                        viewCount++;
                    } else {
                        _statusCode = 1;
                        noviewCount++;
                    }
                }
                listcount++;
                String _reveivedate = "";
                String _operatedate = "";
                String _intervel = "";

                if (!tmpisremark.equals("s") && !tmpisremark.equals("c") && !tmpisremark.equals("r")) {
                    _reveivedate = Util.toScreen(tmpreceivedate, user.getLanguage()) + " " + Util.toScreen(tmpreceivetime, user.getLanguage());
                }
                _operatedate = Util.toScreen(tmpoperatedate, user.getLanguage()) + " " + Util.toScreen(tmpoperatetime, user.getLanguage());

                _intervel = Util.toScreen(tmpIntervel, user.getLanguage());
                
                Map<String, String> _statusmap = new HashMap<String, String>();
                _statusmap.put("statuscode", String.valueOf(_statusCode));
                _statususername = _statususername.replaceAll("\\\t", "");
                _statusmap.put("operator", _statususername);
                _statusmap.put("reveivedate", _reveivedate);
                _statusmap.put("operatedate", _operatedate);
                _statusmap.put("intervel", _intervel);
                _statusmap.put("operatorid", _operatorid);
                _statusmap.put("operatortype", _operatortype);
                
                
                //所有节点
                nodeallstatuslist.add(_statusmap);
                //查看状态 1:未查看， 2：:以查看， 3：已提交， 4:暂停， 5:撤销, 6:启用
                if (tmpisremark.equals("2") && flags) {
                    nodesubmitstatuslist.add(_statusmap);
                } else if (tmpisremark.equals("0") || tmpisremark.equals("1") || tmpisremark.equals("5") || tmpisremark.equals("4") || tmpisremark.equals("8") || tmpisremark.equals("9") || tmpisremark.equals("7") || (tmpisremark.equals("2") && !flags)) {
                    if (viewtype.equals("-2") || (viewtype.equals("-1") && !tmpoperatedate.equals(""))) {
                        nodeviewstatuslist.add(_statusmap);
                    } else if (viewtype.equals("0")) {
                        nodenoviewstatuslist.add(_statusmap);
                    }
                }

                if ((!tmpisremark.equals("2") && !tmpisremark.equals("4")) || (tmpisremark.equals("4") && viewtype.equals("0"))) {
                    if (!tmpisremark.equals("s") && !tmpisremark.equals("s") && !tmpisremark.equals("c") && !tmpisremark.equals("r")) {
                        nodenosubmitstatuslist.add(_statusmap);
                    }
                }
            }
            
            if(desremark ==1){//1:已提交
            	//提交节点信息
            	submit_nodemap.put("listcount", listcount);
            }else if(desremark == 2){//2：未提交
            	nosubmit_nodemap.put("listcount", listcount);
            }else if(desremark == 3){//3:已查看
            	view_nodemap.put("listcount", listcount);
            }else if(desremark == 4){//4:未查看
            	noview_nodemap.put("listcount", listcount);
            }else{
            	//所有节点信息
            	all_nodemap.put("listcount", listcount);
            }
            
            //--已提交、已查看、未查看
			all_nodemap.put("submitCount", submitCount);//--已提交
			all_nodemap.put("viewCount", viewCount);//--已查看
            all_nodemap.put("noviewCount", noviewCount);//--未查看
            
        }
        
        return result;
    }
    
    /***
     * 获取五种类型计数
     * desremark 0:总人次、1:已提交、2：未提交、3:已查看、4:未查看
     * **/
    public Map<String, Object> getStatusLogCount(String viewlogids) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        // 获得当前用户的id，类型和名称。如果类型为1，表示为内部用户（人力资源），2为外部用户（CRM）
        int userid = user.getUID();
        String logintype = user.getLogintype();
        int usertype = 0;

        if(logintype.equals("2")) {
            usertype = 1;
        }

        if (workflowid == 0) {
            getWorkflowId();
        }

        if (user == null) {
            return result;
        }

        if ("".equals(viewlogids)) {
            this.getViewLogids();
        }
        
        RecordSet rs = new RecordSet();
        for(int desremark=0;desremark<5;desremark++){
	        StringBuilder stssql = new StringBuilder();
	        stssql.append("SELECT count(DISTINCT id) num ");
	        stssql.append("  FROM workflow_currentoperator o " );
	        stssql.append("  left join workflow_requestlog wr " );
	        stssql.append("    on wr.requestid = o.requestid " );
	        stssql.append("   and wr.nodeid = o.nodeid " );
	        stssql.append("   and wr.operator = o.userid " );
	        stssql.append("   and wr.logtype <> '1' " );
	        stssql.append("   where o.requestid =  " ).append(this.requestid);
	        if (!"".equals(viewlogids)) {
	            stssql.append(" and o.nodeid in (" + viewlogids + ") ");
	        }
	        if(desremark == 1){//1:已提交
	        	stssql.append(" AND o.isremark='2' AND wr.operator IS NOT null ");
	        }else if(desremark == 2){//2：未提交
	        	stssql.append(" and ((o.isremark = '0' and (o.takisremark is null or o.takisremark=0)) or o.isremark in ('1','5','7','8','9') )");
	        }else if(desremark == 3){//3:已查看
	        	stssql.append(" and (((o.isremark = '2' AND wr.operator IS NULL) or o.isremark in ('0','1','4','5','7','8','9')) AND o.viewtype IN (-1,-2)) ");
	        }else if(desremark == 4){//4:未查看
	        	stssql.append(" AND o.viewtype = 0 ");
	        }
	        rs.executeSql(stssql.toString());
	        while (rs.next()) {
	            int num =  Util.getIntValue(rs.getString("num"),0);
	            if(desremark == 1){//1:已提交
	            	result.put("submitcount", num);
	            }else if(desremark == 2){//2：未提交
	            	result.put("nosubmitcount", num);
	            }else if(desremark == 3){//3:已查看
	            	result.put("viewcount", num);
	            }else if(desremark == 4){//4:未查看
	            	result.put("noviewcount", num);
	            }else{//所有信息
	            	result.put("allcount", num);
	            }
	        }
        }
        result.put("viewlogids", viewlogids);
        return result;
    }

    public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public int getDesrequestid() {
		return desrequestid;
	}

	public void setDesrequestid(int desrequestid) {
		this.desrequestid = desrequestid;
	}

	public String getIsurger() {
		return isurger;
	}
	public void setIsurger(String isurger) {
		this.isurger = isurger;
	}
	/**
     * 获取节点名称
     * @param nodeid
     * @return
     */
    private String getNodeName(int nodeid) {
        if (nodeNameCominfo.get(nodeid) == null) {
            loadNodeInfo();
        }

        return nodeNameCominfo.get(nodeid);
    }

    /**
     * 获取节点类型
     * @param nodeid
     * @return
     */
//    private int getNodeType(int nodeid) {
//        if (nodeTypeCominfo.get(nodeid) == null) {
//            loadNodeInfo();
//        }
//        return nodeTypeCominfo.get(nodeid);
//    }

    /**
     * loadding本流程的节点信息
     */
    private void loadNodeInfo() {
        RecordSet rs = new RecordSet();
        rs.executeSql("select a.id, a.nodename, b.nodetype from workflow_nodebase a, workflow_flownode b where a.id=b.nodeid and b.workflowid=" + this.workflowid);
        while (rs.next()) {
            int nodeId = Util.getIntValue(rs.getString("id"));
            String nodeName = Util.null2String(rs.getString("nodename"));
            int nodeType = Util.getIntValue(rs.getString("nodetype"));
            nodeNameCominfo.put(nodeId, nodeName);
//            nodeTypeCominfo.put(nodeId, nodeType);
        }
    }
    /**
     * 查询workflowid
     * @return workflowid
     */
    private int getWorkflowId() {
        RecordSet recordSet = new RecordSet();
        // 查询请求的相关工作流基本信息
        recordSet.executeProc("workflow_Requestbase_SByID",requestid+"");
        if(recordSet.next()){
            workflowid = Util.getIntValue(recordSet.getString("workflowid"), 0);
        }
        return workflowid;
    }

    private void getViewLogids() {
        int userid = user.getUID();
        RecordSet rs = new RecordSet();
        RecordSet rs1 = new RecordSet();
        String viewLogIds = "";
        ArrayList canViewIds = new ArrayList();
        String viewNodeId = "-1";
        String tempNodeId = "-1";
        String singleViewLogIds = "-1";
        rs.executeSql("select distinct nodeid from workflow_currentoperator where requestid="
                + requestid + " and userid=" + userid);

        while (rs.next()) {
            viewNodeId = rs.getString("nodeid");
            rs1.executeSql("select viewnodeids from workflow_flownode where workflowid="
                    + workflowid + " and nodeid=" + viewNodeId);
            if (rs1.next()) {
                singleViewLogIds = rs1.getString("viewnodeids");
            }

            if ("-1".equals(singleViewLogIds)) {// 全部查看
                rs1.executeSql("select nodeid from workflow_flownode where workflowid= "
                        + workflowid
                        + " and exists(select 1 from workflow_nodebase where id=workflow_flownode.nodeid and (requestid is null or requestid="
                        + requestid + "))");
                while (rs1.next()) {
                    tempNodeId = rs1.getString("nodeid");
                    if (!canViewIds.contains(tempNodeId)) {
                        canViewIds.add(tempNodeId);
                    }
                }
            } else if (singleViewLogIds == null
                    || "".equals(singleViewLogIds)) {// 全部不能查看

            } else {// 查看部分
                String tempidstrs[] = Util.TokenizerString2(
                        singleViewLogIds, ",");
                for (int i = 0; i < tempidstrs.length; i++) {
                    if (!canViewIds.contains(tempidstrs[i])) {
                        canViewIds.add(tempidstrs[i]);
                    }
                }
            }
        }


        // 处理相关流程的查看权限
        if (desrequestid > 0) {
            rs.executeSql("select  distinct a.nodeid from  workflow_currentoperator a  where a.requestid="
                    + requestid
                    + " and  exists (select 1 from workflow_currentoperator b where b.isremark in ('2','4') and b.requestid="
                    + desrequestid + "  and  a.userid=b.userid)");
            while (rs.next()) {
                viewNodeId = rs.getString("nodeid");
                rs1.executeSql("select viewnodeids from workflow_flownode where workflowid="
                        + workflowid + " and nodeid=" + viewNodeId);
                if (rs1.next()) {
                    singleViewLogIds = rs1.getString("viewnodeids");
                }

                if ("-1".equals(singleViewLogIds)) {// 全部查看
                    rs1.executeSql("select nodeid from workflow_flownode where workflowid= "
                            + workflowid
                            + " and exists(select 1 from workflow_nodebase where id=workflow_flownode.nodeid and (requestid is null or requestid="
                            + desrequestid + "))");
                    while (rs1.next()) {
                        tempNodeId = rs1.getString("nodeid");
                        if (!canViewIds.contains(tempNodeId)) {
                            canViewIds.add(tempNodeId);
                        }
                    }
                } else if (singleViewLogIds == null
                        || "".equals(singleViewLogIds)) {// 全部不能查看

                } else {// 查看部分
                    String tempidstrs[] = Util.TokenizerString2(
                            singleViewLogIds, ",");
                    for (int i = 0; i < tempidstrs.length; i++) {
                        if (!canViewIds.contains(tempidstrs[i])) {
                            canViewIds.add(tempidstrs[i]);
                        }
                    }
                }
            }
        }
        if (canViewIds.size() > 0) {
            for (int a = 0; a < canViewIds.size(); a++) {
                viewLogIds += (String) canViewIds.get(a) + ",";
            }
            viewLogIds = viewLogIds.substring(0, viewLogIds.length() - 1);
        } else {
            viewLogIds = "-1";
        }
    }
}
