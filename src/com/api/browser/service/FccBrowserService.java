package com.api.browser.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringEscapeUtils;

import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.conn.RecordSet;
import weaver.fna.general.FnaCommon;
import weaver.fna.maintenance.FnaCostCenter;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 成本中心
 * @author jhy Mar 28, 2017
 *
 */
public class FccBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		RecordSet rs= new RecordSet();
		String fccname = Util.null2String(params.get("fccname"));
		String fcccode = Util.null2String(params.get("fcccode"));
		String workflowid = Util.null2String(params.get("workflowid"));
		String fieldid = Util.null2String(params.get("fieldid"));


		String search = Util.null2String(params.get("search"));
		boolean isoracle = (rs.getDBType()).equals("oracle") ;
		boolean isInit = Util.null2String(params.get("isinit")).equals("");//是否点击过搜索
		int fccGroupId = Util.getIntValue(Util.null2String(params.get("fccGroupId")), -1);

		int perpage=6;

		//获取所有浏览数据定义的成本中心id
		//(fccArray0：存储成本中心类别;fccArray1：存储成本中心)
		FnaCommon fnac = new FnaCommon();
		List fccArray = fnac.getWfBrowdefList(workflowid, fieldid, "251");
		Set fccArray0 = new HashSet();
		Set fccArray1 = new HashSet();
		try{
			//查找上下级所有的成本中心、成本中心类别
			if(fccArray!=null && fccArray.size()>0) {
				FnaCostCenter fcc = new FnaCostCenter();
				fcc.getAllSubCostcenterType(fccArray, fccArray0, fccArray1);
			}
		}catch(Exception e) {
			rs.writeLog(e);
		}


		String backfields = " a.id,a.name,a.code ";
		String fromSql  = " FnaCostCenter a";

		String sqlwhere = " where "+FnaCostCenter.getDbUserName()+"getFccArchive1(a.id) = 0 and a.type = 1 ";
		if(fccGroupId > -1) {
			sqlwhere += " and a.supFccId = "+fccGroupId+" ";
		}
		if(!"".equals(fccname)) {
			sqlwhere += " and a.name like '%"+StringEscapeUtils.escapeSql(fccname)+"%' ";
		}
		if(!"".equals(fcccode)) {
			sqlwhere += " and a.code like '%"+StringEscapeUtils.escapeSql(fcccode)+"%' ";
		}

		String supClause = "";
		if(fccArray0 != null && fccArray0.size() > 0) {
			String ids = "0";
			for(Object obj : fccArray0) {
				ids += ","+(String)obj;
			}
			supClause = " a.supFccId in ("+ids+") ";
			
		}
		String subClause = "";
		if(fccArray1 != null && fccArray1.size() > 0) {
			String ids = "";
			for(Object obj : fccArray1) {
				ids += ","+(String)obj;
			}
			if(!ids.equals("")) {
				ids = ids.substring(1);
			}
			subClause = " a.id in ("+ids+") ";
		}

		sqlwhere += (!supClause.equals("")) ? " and "+supClause : "";
		sqlwhere += (!subClause.equals("")) ? " and "+subClause : "";

		String orderby =" a.code,a.name ";

		String tableString =   " <table instanceid=\"FccBrowserList\" id=\"FccBrowserList\" tabletype=\"none\" pagesize=\""+perpage+"\" >"+
		                "       <sql backfields=\""+Util.toHtmlForSplitPage(backfields)+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" "+
								" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere)+"\"  sqlorderby=\""+Util.toHtmlForSplitPage(orderby)+"\" "+
		                		" sqlprimarykey=\"id\" sqlsortway=\"asc\" sqlisdistinct=\"true\" />"+
		                "       <head>"+
		                "           <col width=\"0%\" text=\"ID\" column=\"id\" "+
									" transmethod=\"weaver.fna.general.FnaSplitPageTransmethod.getIptHidden2\" otherpara=\"column:id+id\" />"+
						"           <col width=\"50%\" text=\""+SystemEnv.getHtmlLabelName(195,user.getLanguage())+"\" column=\"name\" orderkey=\"name\" "+
									" transmethod=\"weaver.fna.general.FnaSplitPageTransmethod.getIptHidden1\" otherpara=\"column:id+name\" />"+
						"           <col width=\"50%\" text=\""+SystemEnv.getHtmlLabelName(1321,user.getLanguage())+"\" column=\"code\" orderkey=\"code\" "+
			     				" transmethod=\"weaver.fna.general.FnaCommon.escapeHtml\" />"+
		                "       </head>"+
		                " </table>";
		
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

}
