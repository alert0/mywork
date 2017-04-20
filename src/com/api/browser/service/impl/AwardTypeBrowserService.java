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
		
		String pageUID = "ec842e08-4961-4cce-acfe-6da52d3e104e";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(195, user.getLanguage()),"name","name"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(63, user.getLanguage()),"awardtype","awardtype","com.api.browser.service.AwardTypeBrowserService.getAwardtypeLabel",String.valueOf(user.getLanguage())));
		cols.add(new SplitTableColBean("60%",SystemEnv.getHtmlLabelName(15667, user.getLanguage()),"description","description"));
		
		SplitTableBean tableBean  =  new SplitTableBean(pageUID,backfields,fromSql,sqlwhere,"","id","Desc",cols);
		SplitTableUtil.getTableString(apidatas,tableBean);
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
