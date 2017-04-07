package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 应聘人
 * 
 * @author jhy Mar 29, 2017
 * 
 */
public class MutiCareerBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String lastname = Util.null2String(params.get("lastname"));
		String educationlevel = Util.null2String(params.get("educationlevel"));
		String sex = Util.null2String(params.get("sex"));
		String jobtitle = Util.null2String(params.get("jobtitle"));
		
		String sqlwhere =  " ";
		if (!lastname.equals("")) {
			sqlwhere += " and a.lastname like '%" + Util.fromScreen2(lastname, user.getLanguage()) + "%' ";
		}
		if (!educationlevel.equals("")) {
			sqlwhere += " and a.educationlevel='" + educationlevel + "' ";
		}
		if (!sex.equals("")) {
			sqlwhere += " and a.sex = '" + sex + "' ";
		}
		if (!jobtitle.equals("")) {
			sqlwhere += " and b.careername = '" + jobtitle + "' ";
		}
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		String backfields = " a.id,a.lastname,a.educationlevel,a.sex,b.careername ";
		String fromSql = " HrmCareerApply a left join HrmCareerInvite b on a.jobtitle = b.id left join HrmJobTitles c on b.careername = c.id  ";
		String tableString =" <table id='BrowseTable' instanceid='BrowseTable' tabletype='none' pagesize=\"10\">"+ 
							" <sql backfields=\""+backfields+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" sqlwhere=\""+sqlwhere+"\"  sqlorderby=\"\"  sqlprimarykey=\"id\" sqlsortway=\"Desc\"/>"+
							" <checkboxpopedom  id=\"checkbox\"  />"+
							"	<head>"+
							"		<col hide=\"true\" orderkey=\"id\" column=\"id\"/>"+ 
							"		<col width=\"20%\"  text=\""+ SystemEnv.getHtmlLabelName(413,user.getLanguage())  +"\" orderkey=\"lastname\" column=\"lastname\"/>"+ 
							"		<col width=\"20%\"  text=\""+ SystemEnv.getHtmlLabelName(416,user.getLanguage())  +"\" orderkey=\"sex\" column=\"sex\" otherpara=\""+user.getLanguage()+"\" transmethod=\"com.api.browser.service.MutiCareerBrowserService.getSexLabel\" />"+
							"		<col width=\"20%\"  text=\""+ SystemEnv.getHtmlLabelName(818,user.getLanguage())  +"\" orderkey=\"educationlevel\" column=\"educationlevel\" transmethod=\"weaver.hrm.job.EduLevelComInfo.getEducationLevelname\"/>"+
							"		<col width=\"30%\"  text=\""+ SystemEnv.getHtmlLabelName(1856,user.getLanguage()) +"\" orderkey=\"careername\" column=\"careername\" transmethod=\"weaver.hrm.job.JobTitlesComInfo.getJobTitlesname\" />"+
							"	</head>"+   			
							" </table>";

		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
	
	/**
	 * 
	 * @param sex
	 * @param languageid
	 * @return
	 */
	public String getSexLabel(String sex,String languageid){
		if("0".equals(sex))
			return SystemEnv.getHtmlLabelName(417,Util.getIntValue(languageid,7));
		if("1".equals(sex))
			return SystemEnv.getHtmlLabelName(418,Util.getIntValue(languageid,7));
		return "";
	}

}
