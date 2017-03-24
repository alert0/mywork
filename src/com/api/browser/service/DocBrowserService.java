package com.api.browser.service;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

import weaver.docs.docs.DocManager;
import weaver.docs.docs.reply.DocReplyUtil;
import weaver.docs.search.DocSearchComInfo;
import weaver.general.TimeUtil;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.share.ShareManager;
import weaver.systeminfo.SystemEnv;
import weaver.workflow.search.WfAdvanceSearchUtil;

import com.api.workflow.util.PageUidFactory;
import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 
 * @author jhy Mar 24, 2017
 *
 */
public class DocBrowserService extends BrowserService{
	
	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception{
		Map<String,Object> apidatas = new HashMap<String,Object>();
		User user = (User) params.get("user");
        String searchid = Util.null2String(params.get("searchid"));
        String searchsubject = Util.null2String(params.get("name"));
        String searchcreater = Util.null2String(params.get("searchcreater"));
        String crmId = Util.null2String(params.get("txtCrmId"));
        String secCategory = Util.null2String(params.get("secCategory"));
        
        int date2during = Util.getIntValue(Util.null2String(params.get("date2during")),38);
        
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
		sqlwhere +=  handDateCondition("searchdate","searchdatefrom","searchdateto","doclastmoddate",params);
		
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
    
    //public Map<String,Object> getDocList(HttpServletRequest request, HttpServletResponse response) throws Exception {}
    
    public static String handDateCondition(String namefiled, String from, String to,
			String tname,Map<String, Object> params) throws ParseException {
    	
		String createdateselect = Util.null2String(params.get(namefiled));
		String condition = "";

		if (!createdateselect.equals("")) {
			if (WfAdvanceSearchUtil.TODAY.equals(createdateselect))
				condition = " and " + tname + ">='" + TimeUtil.getToday()
						+ "'  and  " + tname + "  <='" + TimeUtil.getToday()
						+ " 23:59:59'  ";
			else if (WfAdvanceSearchUtil.WEEK.equals(createdateselect))
				condition = " and " + tname + ">='"
						+ TimeUtil.getFirstDayOfWeek() + "'  and  " + tname
						+ "<='" + TimeUtil.getLastDayOfWeek() + "'";
			else if (WfAdvanceSearchUtil.MONTH.equals(createdateselect))
				condition = " and " + tname + ">='"
						+ TimeUtil.getFirstDayOfMonth() + "'  and  " + tname
						+ "<='" + TimeUtil.getLastDayOfMonth() + "'";
			else if (WfAdvanceSearchUtil.SEASON.equals(createdateselect))
				condition = " and " + tname + ">='"
						+ TimeUtil.getFirstDayOfSeason() + "'  and  " + tname
						+ "<='" + TimeUtil.getLastDayDayOfSeason() + "'";
			else if (WfAdvanceSearchUtil.YEAR.equals(createdateselect))
				condition = " and " + tname + ">='"
						+ TimeUtil.getFirstDayOfTheYear() + "' and " + tname
						+ "<='" + TimeUtil.getLastDayOfYear() + "'";
			//else if (WfAdvanceSearchUtil.PERIOD.equals(createdateselect)) {
			else if(WfAdvanceSearchUtil.PERIOD.equals(createdateselect)){
				StringBuffer sb = new StringBuffer("");
				String createdatefrom = Util.null2String(params.get(from));
				String createdateto = Util
						.null2String(params.get(to));
				if (!createdatefrom.equals("")) {
					sb.append("  and  " + tname + ">='" + createdatefrom + "'");
				}
				if (!createdateto.equals("")) {
					sb.append("  and  " + tname + "<='" + createdateto + "'");
				}
				condition = sb.toString();
			}
		}
		return condition;

	}



}
