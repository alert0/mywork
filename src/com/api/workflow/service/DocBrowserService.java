package com.api.workflow.service;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import weaver.docs.docs.DocManager;
import weaver.docs.docs.reply.DocReplyUtil;
import weaver.docs.search.DocSearchComInfo;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.share.ShareManager;
import weaver.systeminfo.SystemEnv;
import com.api.workflow.util.PageUidFactory;

import com.cloudstore.dev.api.util.Util_TableMap;

public class DocBrowserService {
    
    public Map<String,Object> getDocList(HttpServletRequest request, HttpServletResponse response) throws Exception {
    		Map<String,Object> apidatas = new HashMap<String,Object>();
            User user = HrmUserVarify.getUser(request, response);
            String searchid = Util.null2String(request.getParameter("searchid"));
            String searchsubject = Util.null2String(request.getParameter("name"));
            String searchcreater = Util.null2String(request.getParameter("searchcreater"));
            String searchdatefrom = Util.null2String(request.getParameter("searchdatefrom"));
            String searchdateto = Util.null2String(request.getParameter("searchdateto"));
            String crmId = Util.null2String(request.getParameter("txtCrmId"));
            String secCategory = Util.null2String(request.getParameter("secCategory"));
            
            int date2during = Util.getIntValue(request.getParameter("date2during"),38);
            
            ShareManager shareManager = new ShareManager();
            String fromSql = "DocDetail  t1, " + shareManager.getShareDetailTableByUser("doc", user) + "  t2";
            String backfields = "id,maincategory,subcategory,seccategory," + "doccreaterid,ownerid,doclastmoddate,doclastmodtime," + "docsubject,docstatus,doccreatedate,doccreatetime," + "replydocid,docreplyable,isreply,replaydoccount,accessorycount,t1.usertype,t1.doctype,t1.countMark,t1.sumMark,t1.sumReadCount";
            DocSearchComInfo docSearchComInfo = new DocSearchComInfo();
            
            docSearchComInfo.resetSearchInfo();

            if (!searchid.equals(""))
                docSearchComInfo.setDocid(searchid);
            if (!secCategory.equals(""))
                docSearchComInfo.setSeccategory(secCategory);
            if (!searchsubject.equals(""))
                docSearchComInfo.setDocsubject(searchsubject);
            if (!searchdatefrom.equals(""))
                docSearchComInfo.setDoclastmoddateFrom(searchdatefrom);
            if (!searchdateto.equals(""))
                docSearchComInfo.setDoclastmoddateTo(searchdateto);
            if (!searchcreater.equals("")) {
                docSearchComInfo.setOwnerid(searchcreater);
                docSearchComInfo.setUsertype("1");
            }
            if (!crmId.equals("")) {
                docSearchComInfo.setDoccreaterid(crmId);
                docSearchComInfo.setUsertype("2");
            }
            docSearchComInfo.setOrderby("4");
            String orderclause = docSearchComInfo.FormatSQLOrder();
            
            
            String orderby = "";
            int pos = orderclause.indexOf(" by ");
            if (pos != -1) {
                orderby = orderclause.substring(pos + 3);
                orderby = Util.StringReplace(orderby, " desc", " ");
                orderby = Util.StringReplace(orderby, " asc", " ");
            }
            
            String sqlwhere = " where 1=1 ";
            String docstatus[] = new String[] { "1", "2", "5", "7" };
            for (int i = 0; i < docstatus.length; i++) {
                docSearchComInfo.addDocstatus(docstatus[i]);
            }

            String tempsqlwhere = docSearchComInfo.FormatSQLSearch(user.getLanguage());
            if (!tempsqlwhere.equals(""))
                sqlwhere += " and " + tempsqlwhere;
            sqlwhere += " and (ishistory is null or ishistory = 0) ";
            if(DocReplyUtil.isUseNewReply()) {
                sqlwhere += " and isreply != 1 ";
            }
			sqlwhere += " and t2.sourceid=t1.id ";
            DocManager dm = new DocManager();
            sqlwhere += dm.getDateDuringSql(date2during);
            String pageUid = PageUidFactory.getBrowserUID("doclist");
            String tableString = "<table instanceid='BrowseTable' tabletype='none' pageUid =\"" + pageUid + "\">" + 
                                        "<sql backfields=\"" + backfields + "\" sqlform=\"" + Util.toHtmlForSplitPage(fromSql) + "\" sqlwhere=\"" + sqlwhere + "\"  sqlorderby=\"" + orderby + "\"  sqlprimarykey=\"t1.id\" sqlsortway=\"Desc\"/>" + 
                                        "<head>"+ 
                                        "	<col width=\"0%\" hide=\"true\" text=\"\" column=\"id\"/>" + 
                                        "   <col width=\"30%\"  text=\"" + SystemEnv.getHtmlLabelName(229, user.getLanguage())+ "\" orderkey=\"docsubject\" column=\"docsubject\"/>" + 
                                        "   <col width=\"30%\"  text=\"" + SystemEnv.getHtmlLabelName(2094, user.getLanguage()) + "\" display=\"true\" orderkey=\"ownerid\" column=\"ownerid\" transmethod=\"weaver.hrm.resource.ResourceComInfo.getResourcename\"/>" + 
                                        "   <col width=\"35%\"  text=\"" + SystemEnv.getHtmlLabelName(723, user.getLanguage())+ "\" display=\"true\" orderkey=\"doclastmoddate\" column=\"doclastmoddate\" transmethod=\"weaver.splitepage.transform.SptmForDoc.getModifydate\" otherpara=\"column:doclastmodtime\"/>" + 
                                        "</head>" + 
                                  "</table>";
            String sessionkey = Util.getEncrypt(Util.getRandom());
            Util_TableMap.setVal(sessionkey, tableString);
            apidatas.put("result", sessionkey);
            return apidatas;
    }
}
