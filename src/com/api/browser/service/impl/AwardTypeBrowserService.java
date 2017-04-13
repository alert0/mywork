package com.api.browser.service.impl;

import java.util.HashMap;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.service.BrowserService;
import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 奖惩种类
 * @author jhy Mar 29, 2017
 *
 */
public class AwardTypeBrowserService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		
		String awardtype = Util.null2String(params.get("awardtype"));
		String name = Util.null2String(params.get("name"));
		String description = Util.null2String(params.get("description"));
		
		String sqlwhere = " ";
		if(!awardtype.equals("")){
			sqlwhere += " and awardtype = '" + awardtype + "' ";
		}
			
		if(!name.equals("")){
			sqlwhere += " and name like '%";
			sqlwhere += Util.fromScreen2(name,user.getLanguage());
			sqlwhere += "%'";
		}

		if(!description.equals("")){
			sqlwhere += " and description like '%";
			sqlwhere += Util.fromScreen2(description,user.getLanguage());
			sqlwhere += "%'";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		
		String backfields = " id,name,awardtype,description ";
		String fromSql = " HrmAwardType  ";
		String tableString =" <table id='BrowseTable' instanceid='BrowseTable' tabletype='none' pagesize=\"10\">"+ 
							" <sql backfields=\""+backfields+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" sqlwhere=\""+sqlwhere+"\"  sqlorderby=\"\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>"+
							"	<head>"+
							"		<col hide=\"true\" orderkey=\"id\" column=\"id\"/>"+ 
							"		<col width=\"20%\"  text=\""+ SystemEnv.getHtmlLabelName(195,user.getLanguage()) +"\" orderkey=\"name\" column=\"name\"/>"+ 
							"		<col width=\"20%\"  text=\""+ SystemEnv.getHtmlLabelName(63,user.getLanguage()) +"\"  display=\"true\" orderkey=\"awardtype\" column=\"awardtype\" otherpara=\""+user.getLanguage()+"\" transmethod=\"com.api.browser.service.AwardTypeBrowserService.getAwardtypeLabel\"/>"+ 
							"		<col width=\"60%\"  text=\""+ SystemEnv.getHtmlLabelName(15667,user.getLanguage()) +"\" orderkey=\"description\" column=\"description\"/>"+ 
							"	</head>"+   			
							" </table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
	
	/**
	 * 
	 * @param awardtype
	 * @param languageid
	 * @return
	 */
	public String getAwardtypeLabel(String awardtype,String languageid){
		if("0".equals(awardtype))
			return SystemEnv.getHtmlLabelName(809,Util.getIntValue(languageid,7));
		if("1".equals(awardtype))
			return SystemEnv.getHtmlLabelName(810,Util.getIntValue(languageid,7));
		return "";
	}
}
