package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;
import com.api.browser.util.SqlUtils;

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

		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("30%",SystemEnv.getHtmlLabelName(413, user.getLanguage()),"lastname","lastname"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(416, user.getLanguage()),"sex","sex","com.api.browser.service.impl.MutiCareerBrowserService.getSexLabel",String.valueOf(user.getLanguage())));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(818, user.getLanguage()),"educationlevel","educationlevel","weaver.hrm.job.EduLevelComInfo.getEducationLevelname"));
		cols.add(new SplitTableColBean("30%",SystemEnv.getHtmlLabelName(1856, user.getLanguage()),"careername","careername","weaver.hrm.job.JobTitlesComInfo.getJobTitlesname"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,"","id",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
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
