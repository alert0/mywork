package com.api.workflow.service;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import weaver.conn.RecordSet;
import weaver.crm.Maint.CustomerInfoComInfo;
import weaver.docs.category.SecCategoryComInfo;
import weaver.docs.docs.DocComInfo;
import weaver.docs.docs.DocImageManager;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.resource.ResourceComInfo;
import weaver.systeminfo.SystemEnv;
import weaver.workflow.request.ComparatorUtilBean;
import weaver.workflow.request.RequestComInfo;
import weaver.workflow.request.RequestNodeFlow;
import weaver.workflow.request.RevisionConstants;
import weaver.workflow.request.TexttoPDFManager;
import weaver.workflow.request.WFLinkInfo;
import weaver.workflow.sysPhrase.WorkflowPhrase;
import weaver.workflow.workflow.WFNodeMainManager;

/**
 * 加载签字意见输入框的相关信息
 * 
 * @author wuser0326
 * 
 */
public class SignInputService {

    /**
     * 
     * @param request
     * @param response
     * @return
     */
    public Map<String,Object> loadSignInputInfo(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        String f_weaver_belongto_userid = request.getParameter("f_weaver_belongto_userid");// 需要增加的代码
        String f_weaver_belongto_usertype = request.getParameter("f_weaver_belongto_usertype");// 需要增加的代码
        User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);// 需要增加的代码
        int userid = user.getUID();
        int usertype = "2".equals(user.getLogintype()) ? 1 : 0;

        // 初始化
        Map<String, Object> resultDatas = new HashMap<String, Object>();
        resultDatas.put("fileuserid", userid);
        resultDatas.put("fileloginyype", user.getLogintype());
        
        RecordSet rs = new RecordSet();
        ResourceComInfo rescominfo = null;
        DocComInfo doccominfo = null;
        RequestComInfo wfcominfo = null;
        SecCategoryComInfo secCategoryComInfo = null;
        try {
            rescominfo = new ResourceComInfo();
            doccominfo = new DocComInfo();
            wfcominfo = new RequestComInfo();
            secCategoryComInfo = new SecCategoryComInfo();
        } catch (Exception e) {
            e.printStackTrace();
        }

        int requestid = Util.getIntValue(request.getParameter("requestid"), 0);
        int workflowid = Util.getIntValue(request.getParameter("workflowid"), 0);
        int nodeid = Util.getIntValue(request.getParameter("nodeid"), 0);
        int currentnodeid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "currentnodeid"), 0);
        
        //测试先从session中取数据
        workflowid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "workflowid"), 0);
        nodeid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "nodeid"), 0);
        currentnodeid = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "currentnodeid"), 0);
        if(workflowid == 0 || nodeid == 0){
        	String sql = "select t.nodeid,t.workflowid from workflow_currentoperator t left join workflow_nodebase t1 on t.nodeid  = t1.id  where t.requestid=? and t.userid=? and t.usertype=? order by t.id desc";
        	rs.executeQuery(sql, requestid, userid, usertype);
        	if (rs.next()) {
        		nodeid = Util.getIntValue(rs.getString(1), 0);
        		workflowid = Util.getIntValue(rs.getString(2),0);
        	}
        	if (nodeid < 1) {
        		sql = "select t.currentnodeid,t.workflowid from workflow_requestbase t left join workflow_nodebase t1 on t.currentnodeid = t1.id  where t.requestid= ?";
        		rs.executeQuery(sql, requestid);
        		if (rs.next()) {
        			nodeid = Util.getIntValue(rs.getString(1), 0);
        			workflowid = Util.getIntValue(rs.getString(2),0);
        		}
        	}
        }
        
        //判断是否显示签字意见输入框
        /**
        boolean IsBeForwardCanSubmitOpinion="true".equals(session.getAttribute(userid+"_"+requestid+"IsBeForwardCanSubmitOpinion"))?true:false;
        rs.execute("select isview from workflow_nodeform where fieldid=-4 and nodeid="+nodeid);
		 int isview_ = 0;
		 if(rs.next()){
			isview_ = Util.getIntValue(rs.getString("isview"), 0);
		 }
		 
		 */
        

        TexttoPDFManager tpdfm = new TexttoPDFManager();
        Map texttoPDFMap = tpdfm.getTexttoPDFMap(requestid, workflowid, currentnodeid, 0);
        boolean isSavePDF = "1".equals((String) texttoPDFMap.get("isSavePDF"));
        boolean isSaveDecryptPDF = "1".equals((String) texttoPDFMap.get("isSaveDecryptPDF"));

        String isTexttoPDF = "0";
        if (isSavePDF || isSaveDecryptPDF) {
            isTexttoPDF = "1";
        }
        String pdffieldid = Util.null2String((String) texttoPDFMap.get("pdffieldid"));
        String pdfdocId = Util.null2String((String) texttoPDFMap.get("pdfdocId"));
        String versionId = Util.null2String((String) texttoPDFMap.get("versionId"));
        int operationtype = Util.getIntValue((String) texttoPDFMap.get("operationtype"), 0);
        String decryptpdffieldid = Util.null2String((String) texttoPDFMap.get("decryptpdffieldid"));

        resultDatas.put("pdffieldid", pdffieldid);
        resultDatas.put("pdfdocId", pdfdocId);
        resultDatas.put("versionId", versionId);
        resultDatas.put("operationtype", operationtype);
        resultDatas.put("decryptpdffieldid", decryptpdffieldid);
        resultDatas.put("isTexttoPDF", isTexttoPDF);

        String remarkLocation = "";
        boolean isSystemBill = false;
        String ___isbill = (String) session.getAttribute("__isbill");
        String ___formid = Util.null2String(session.getAttribute("__formid"));
        if (!___formid.equals("") && Integer.parseInt(___formid) > 0 && ___isbill.equals("1")) {
            isSystemBill = true;
        }

        resultDatas.put("isSystemBill", isSystemBill);
        char flag = Util.getSeparator();
        int usertype2 = user.getLogintype().equals("1") ? 0 : 1;

        if (session.getAttribute("__remarkLocation") != null) {
            remarkLocation = (String) session.getAttribute("__remarkLocation");
        } else {
            rs.executeProc("workflow_RequestLog_SBUser", "" + requestid + flag + "" + user.getUID() + flag + "" + usertype2 + flag + "1");
            if (rs.next()) {
                remarkLocation = Util.null2String(rs.getString("remarkLocation"));
            }
        }

        if (session.getAttribute("__remarkLocation") != null) {
            session.removeAttribute("__remarkLocation");
        }

        resultDatas.put("remarkLocation", remarkLocation);

        // 加载节点签字意见设置信息
        String isFormSignature = null;
        String isSignMustInput = "0";
        String isHideInput = "0";
        int formSignatureWidth = RevisionConstants.Form_Signature_Width_Default;
        int formSignatureHeight = RevisionConstants.Form_Signature_Height_Default;
        rs.executeSql("select isFormSignature,formSignatureWidth,formSignatureHeight,issignmustinput,ishideinput from workflow_flownode where workflowId=" + workflowid + " and nodeId=" + nodeid);
        if (rs.next()) {
            isFormSignature = Util.null2String(rs.getString("isFormSignature"));
            formSignatureWidth = Util.getIntValue(rs.getString("formSignatureWidth"), RevisionConstants.Form_Signature_Width_Default);
            formSignatureHeight = Util.getIntValue(rs.getString("formSignatureHeight"), RevisionConstants.Form_Signature_Height_Default);
            isSignMustInput = "" + Util.getIntValue(rs.getString("issignmustinput"), 0);
            isHideInput = "" + Util.getIntValue(rs.getString("ishideinput"), 0);
        }
        int isUseWebRevision_t = Util.getIntValue(new weaver.general.BaseBean().getPropValue("weaver_iWebRevision", "isUseWebRevision"), 0);
        if (isUseWebRevision_t != 1) {
            isFormSignature = "";
        }

        resultDatas.put("isFormSignature", isFormSignature);
        resultDatas.put("formSignatureWidth", formSignatureWidth);
        resultDatas.put("formSignatureHeight", formSignatureHeight);
        resultDatas.put("isSignMustInput", isSignMustInput);
        resultDatas.put("isHideInput", isHideInput);

        // 加载流程签字意见设置信息
        String needconfirm = "";
        String isannexupload_edit = "";
        String annexdocCategory_edit = "";
        String isSignDoc_edit = "";
        String isSignWorkflow_edit = "";
        rs.execute("select needAffirmance,isannexupload,annexdocCategory,isSignDoc,isSignWorkflow,isSignWorkflow from workflow_base where id=" + workflowid);
        if (rs.next()) {
            needconfirm = Util.null2o(rs.getString("needAffirmance"));
            isannexupload_edit = Util.null2String(rs.getString("isannexupload"));
            annexdocCategory_edit = Util.null2String(rs.getString("annexdocCategory"));
            isSignDoc_edit = Util.null2String(rs.getString("isSignDoc"));
            isSignWorkflow_edit = Util.null2String(rs.getString("isSignWorkflow"));
        }

        resultDatas.put("needconfirm", needconfirm);
        resultDatas.put("isSignWorkflow_edit", isSignWorkflow_edit);
        resultDatas.put("isannexupload_edit", isannexupload_edit);
        resultDatas.put("isSignDoc_edit", isSignDoc_edit);

        // 附件上传目录及相关文件
        int annexmainId = 0;
        int annexsubId = 0;
        int annexsecId = 0;
        if ("1".equals(isannexupload_edit) && annexdocCategory_edit != null && !annexdocCategory_edit.equals("")) {
            annexmainId = Util.getIntValue(annexdocCategory_edit.substring(0, annexdocCategory_edit.indexOf(',')));
            annexsubId = Util.getIntValue(annexdocCategory_edit.substring(annexdocCategory_edit.indexOf(',') + 1, annexdocCategory_edit.lastIndexOf(',')));
            annexsecId = Util.getIntValue(annexdocCategory_edit.substring(annexdocCategory_edit.lastIndexOf(',') + 1));
        }
        int annexmaxUploadImageSize = Util.getIntValue(secCategoryComInfo.getMaxUploadFileSize("" + annexsecId), 5);
        if (annexmaxUploadImageSize <= 0) {
            annexmaxUploadImageSize = 5;
        }

        resultDatas.put("annexmainId", annexmainId);
        resultDatas.put("annexsubId", annexsubId);
        resultDatas.put("annexsecId", annexsecId);
        resultDatas.put("annexmaxUploadImageSize", annexmaxUploadImageSize);

        // 加载签字意见、相关附件、相关文档、相关流程、文件上传目录
        rs.executeProc("workflow_RequestLog_SBUser", "" + requestid + flag + "" + userid + flag + "" + usertype + flag + "1");
        String myremark = "";
        String annexdocids = "";
        String signdocids = "";
        String signworkflowids = "";
        int workflowRequestLogId = -1;
        if (rs.next()) {
            myremark = Util.null2String(rs.getString("remark"));
            annexdocids = Util.null2String(rs.getString("annexdocids"));
            workflowRequestLogId = Util.getIntValue(rs.getString("requestLogId"), -1);
            signdocids = Util.null2String(rs.getString("signdocids"));
            signworkflowids = Util.null2String(rs.getString("signworkflowids"));
        }
        
        resultDatas.put("remarkText10404", "");
        resultDatas.put("remark", myremark);
        resultDatas.put("workflowRequestLogId", workflowRequestLogId);

        // 获得被代理人
        String tempbeagenter = "" + userid;
        rs.executeSql("select agentorbyagentid, agenttype from workflow_currentoperator where usertype=0 and isremark in ('0', '1', '7', '8', '9')  and requestid=" + requestid + " and userid=" + userid + " order by isremark, id");
        if (rs.next()) {
            int beagenter2 = rs.getInt(1);
            int tempagenttype = rs.getInt(2);
            if (tempagenttype == 2 && beagenter2 > 0)
                tempbeagenter = "" + beagenter2;
        }
        String tempbeagentername = rescominfo.getResourcename(tempbeagenter);
        resultDatas.put("tempbeagentername", tempbeagentername);
        resultDatas.put("tempbeagenter", tempbeagenter);

        // 相关文档
        String docnames = doccominfo.getMuliDocName2(signdocids);
        docnames = docnames.replaceAll("<br>", "&nbsp;&nbsp;").replaceAll("<a", "<a style=\"color:#123885;\"");

        resultDatas.put("docnames", docnames);
        resultDatas.put("signdocids", signdocids);

        // 相关流程
        String workflownames = "";
        String[] tempWfArray = Util.TokenizerString2(signworkflowids, ",");
        if (null != tempWfArray && tempWfArray.length > 0) {
            for (String tempwfid : tempWfArray) {
                workflownames += "<a style=\"color:#123885;\" href='/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype + "&requestid=" + tempwfid + "&isrequest=1' target='_blank'>" + wfcominfo.getRequestname(tempwfid)
                        + "</a>&nbsp;&nbsp;";
            }
        }
        resultDatas.put("workflownames", workflownames);
        resultDatas.put("signworkflowids", signworkflowids);

        // 相关附件
        String fieldannexuploadname = "";
        String annexnames = "";
        DocImageManager docImageManager = new DocImageManager();
        tempWfArray = Util.TokenizerString2(annexdocids, ",");
        try {
            for (String annexid : tempWfArray) {
                if ("".equals(annexid)) {
                    continue;
                }
                docImageManager.resetParameter();
                docImageManager.setDocid(Integer.parseInt(annexid));
                docImageManager.selectDocImageInfo();
                if (docImageManager.next()) {
                    annexnames += "<a style=\"color:#123885;\"  href='javascript:void(0);' onclick=\"parent.openFullWindowHaveBar('/docs/docs/DocDsp.jsp?id=" + annexid + "&isrequest=1&requestid=" + requestid + "&desrequestid=0')\">" + docImageManager.getImagefilename() + "</a>&nbsp;&nbsp;";
                    annexnames += "<button class=\"wffbtn\" type='button' accesskey=\"1\" onclick=\"addDocReadTag('" + annexid + "');top.location='/weaver/weaver.file.FileDownload?fileid=" + annexid + "&download=1&requestid=" + requestid
                            + "&desrequestid=0'\" style='color:#123885;border:0px;line-height:20px;font-size:12px;padding:3px;background:rgb(248, 248, 248);'>[" + SystemEnv.getHtmlLabelName(258, user.getLanguage()) + docImageManager.getImageFileSize(Integer.parseInt(annexid))
                            + "KB]</button>&nbsp;&nbsp;<br>";
                    if (fieldannexuploadname.equals("")) {
                        fieldannexuploadname = docImageManager.getImagefilename();
                    } else {
                        fieldannexuploadname += "////~~weaversplit~~////" + docImageManager.getImagefilename();
                    }
                }
            }
        } catch (Exception e1) {
            e1.printStackTrace();
        }

        resultDatas.put("annexnames", annexnames);
        resultDatas.put("fieldannexuploadname", fieldannexuploadname);
        resultDatas.put("annexdocids", annexdocids);

        // 加载常用批示语相关
        if (!"1".equals(isFormSignature)) {
            //WorkflowPhrase workflowPhrase = new WorkflowPhrase();
            //boolean hasRight = workflowPhrase.hasPrivateRight();
            resultDatas.put("hasAddWfPhraseRight", true);
        }

        boolean isSuccess = rs.executeProc("sysPhrase_selectByHrmId", "" + userid);
        List<Map<String,String>> phraseInfo = new ArrayList<Map<String,String>>();
        if (isSuccess) {
            while (rs.next()) {
            	Map<String,String> _phrases = new HashMap<String,String>();
            	_phrases.put("workflowPhrases", Util.null2String(rs.getString("phraseShort")));
            	_phrases.put("workflowPhrasesContent", Util.toHtml(Util.null2String(rs.getString("phrasedesc"))));
            	phraseInfo.add(_phrases);
            }
        }
        resultDatas.put("phraseInfo", phraseInfo);
        
        // 流程干预
        int intervenorright = Util.getIntValue((String) session.getAttribute(userid + "_" + requestid + "intervenorright"), 0);
        if (intervenorright > 0) {
            try {
                loadIntervenorNodeInfo(user, resultDatas, rs, rescominfo, requestid, workflowid, nodeid, session);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return resultDatas;
    }

    /**
     * 加载流程干预可干预的节点信息
     * 
     * @param user
     * @param resultDatas
     * @param rs
     * @param rescominfo
     * @param requestid
     * @param workflowid
     * @param nodeid
     * @param session
     * @throws Exception
     */
    private void loadIntervenorNodeInfo(User user, Map<String, Object> resultDatas, RecordSet rs, ResourceComInfo rescominfo, int requestid, int workflowid, int nodeid, HttpSession session) throws Exception {
        int nodetype = Util.getIntValue((String) session.getAttribute(user.getUID() + "_" + requestid + "nodetype"), 0);
        int formid = Util.getIntValue((String) session.getAttribute(user.getUID() + "_" + requestid + "formid"), 0);
        int isbill = Util.getIntValue((String) session.getAttribute(user.getUID() + "_" + requestid + "isbill"), 0);
        int billid = Util.getIntValue((String) session.getAttribute(user.getUID() + "_" + requestid + "billid"), 0);
        int creater = Util.getIntValue((String) session.getAttribute(user.getUID() + "_" + requestid + "creater"), 0);
        int creatertype = Util.getIntValue((String) session.getAttribute(user.getUID() + "_" + requestid + "creatertype"), 0);

        String billtablename = "";
        int operatorsize = 0;
        String nodeattr = "";
        int nextnodeid = -1;
        String intervenoruserids = "";
        String intervenoruseridsType = "";
        String intervenorusernames = "";

        Hashtable<String, String> intervenorNodeInfo = new Hashtable<String, String>();

        WFNodeMainManager wfnmm = new WFNodeMainManager();
        CustomerInfoComInfo cifc = new CustomerInfoComInfo();
        ArrayList BrancheNodes = new ArrayList();
        wfnmm.setWfid(workflowid);
        wfnmm.selectWfNode();
        while (wfnmm.next()) {
            if (wfnmm.getNodeid() == nodeid)
                nodeattr = wfnmm.getNodeattribute();
        }
        if (nodeattr.equals("2")) {
            WFLinkInfo wfLinkInfo = new WFLinkInfo();
            BrancheNodes = wfLinkInfo.getFlowBrancheNodes(requestid, workflowid, nodeid);
        }

        boolean hasnextnodeoperator = false;
        Hashtable operatorsht = new Hashtable();

        if (isbill == 1) {
            rs.executeSql("select tablename from workflow_bill where id = " + formid); // 查询工作流单据表的信息
            if (rs.next())
                billtablename = rs.getString("tablename"); // 获得单据的主表
        }
        // 查询节点操作者
        RequestNodeFlow requestNodeFlow = new RequestNodeFlow();
        requestNodeFlow.setRequestid(requestid);
        requestNodeFlow.setNodeid(nodeid);
        requestNodeFlow.setNodetype("" + nodetype);
        requestNodeFlow.setWorkflowid(workflowid);
        requestNodeFlow.setUserid(user.getUID());
        requestNodeFlow.setUsertype((user.getLogintype()).equals("1") ? 0 : 1);
        requestNodeFlow.setCreaterid(creater);
        requestNodeFlow.setCreatertype(creatertype);
        requestNodeFlow.setIsbill(isbill);
        requestNodeFlow.setBillid(billid);
        requestNodeFlow.setBilltablename(billtablename);
        requestNodeFlow.setRecordSet(rs);
        requestNodeFlow.setIsintervenor("1");
        hasnextnodeoperator = requestNodeFlow.getNextNodeOperator();

        if (hasnextnodeoperator) {
            operatorsht = requestNodeFlow.getOperators();
            nextnodeid = requestNodeFlow.getNextNodeid();
            operatorsize = operatorsht.size();
            if (operatorsize > 0) {

                TreeMap map = new TreeMap(new ComparatorUtilBean());
                Enumeration tempKeys = operatorsht.keys();
                try {
                    while (tempKeys.hasMoreElements()) {
                        String tempKey = (String) tempKeys.nextElement();
                        ArrayList tempoperators = (ArrayList) operatorsht.get(tempKey);
                        map.put(tempKey, tempoperators);
                    }
                } catch (Exception e) {
                }
                Iterator iterator = map.keySet().iterator();
                while (iterator.hasNext()) {
                    String operatorgroup = (String) iterator.next();
                    ArrayList operators = (ArrayList) operatorsht.get(operatorgroup);
                    for (int i = 0; i < operators.size(); i++) {
                        String operatorandtype = (String) operators.get(i);
                        String[] operatorandtypes = Util.TokenizerString2(operatorandtype, "_");
                        String opertor = operatorandtypes[0];
                        String opertortype = operatorandtypes[1];
                        String opertorsigntype = operatorandtypes[3];
                        if (opertorsigntype.equals("-3") || opertorsigntype.equals("-4"))
                            continue;
                        intervenoruserids += opertor + ",";
                        intervenoruseridsType += opertortype + ",";
                        if ("0".equals(opertortype)) {
                            intervenorusernames += "<A href='javaScript:openhrm(" + opertor + ");' onclick='pointerXY(event);'>" + rescominfo.getResourcename(opertor) + "</A>&nbsp;";
                        } else {
                            intervenorusernames += cifc.getCustomerInfoname(opertor) + " ";
                        }

                    }
                }
            }
        }
        if (intervenoruserids.length() > 1) {
            intervenoruserids = intervenoruserids.substring(0, intervenoruserids.length() - 1);
            intervenoruseridsType = intervenoruseridsType.substring(0, intervenoruseridsType.length() - 1);
        }

        wfnmm.setWfid(workflowid);
        wfnmm.selectWfNode();
        String nodeattribute = "0";
        while (wfnmm.next()) {
            int tmpid = wfnmm.getNodeid();
            String tmpname = wfnmm.getNodename();
            String tmptype = wfnmm.getNodetype();
            String tempnodeattr = wfnmm.getNodeattribute();
            if (tmpid == nodeid) {
                nodeattribute = tempnodeattr;
            }
            if (tempnodeattr.equals("2")) {// 25428
                tmpname += "(" + SystemEnv.getHtmlLabelName(21395, user.getLanguage()) + ")";
            }
            if (nodeattr.equals("2")) {
                if (!tempnodeattr.equals("2")) {
                    if (tmpid == nextnodeid) {
                        intervenoruserids = "";
                        intervenoruseridsType = "";
                        intervenorusernames = "";
                    }
                } else if (!BrancheNodes.contains(tmpid + "")) {
                    continue;
                }
            } else {
                if (tempnodeattr.equals("2")) {
                    if (tmpid == nextnodeid) {
                        intervenoruserids = "";
                        intervenoruseridsType = "";
                        intervenorusernames = "";
                    }
                    continue;
                }
            }
            intervenorNodeInfo.put(tmpid + "_" + tmptype + "_" + tempnodeattr, tmpname);
        }

        resultDatas.put("nextnodeid", nextnodeid);
        resultDatas.put("currentnodeattr", nodeattribute);
        resultDatas.put("intervenorNodeInfo", intervenorNodeInfo);

        resultDatas.put("intervenoruserids", intervenoruserids);
        resultDatas.put("intervenoruseridsType", intervenoruseridsType);
        resultDatas.put("intervenorusernames", intervenorusernames);
    }
}
