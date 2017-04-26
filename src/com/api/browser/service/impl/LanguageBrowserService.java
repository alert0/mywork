package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import weaver.systeminfo.language.LanguageComInfo;

import com.api.browser.bean.ListHeadBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.BrowserConstant;
import com.api.browser.util.BrowserDataType;

/**
 * 语言
 * @author jhy Mar 28, 2017
 *
 */
public class LanguageBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		
		//加载数据
		List<Map<String,Object>> datas = new ArrayList<Map<String,Object>>();
		LanguageComInfo languageComInfo = new LanguageComInfo();
		Map<String,Object> lanaguageInfo = null;
		while(languageComInfo.next()){
			lanaguageInfo = new HashMap<String,Object>();
			lanaguageInfo.put("languageid", languageComInfo.getLanguageid());
			lanaguageInfo.put("languagename", languageComInfo.getLanguagename());
			datas.add(lanaguageInfo);
		}
		apidatas.put("datas", datas);
		
		//设置表头
		List<ListHeadBean> tableHeadColumns =  new ArrayList<ListHeadBean>();
		tableHeadColumns.add(new ListHeadBean("languageid",SystemEnv.getHtmlLabelName(84,user.getLanguage())));
		tableHeadColumns.add(new ListHeadBean("languagename",SystemEnv.getHtmlLabelName(195,user.getLanguage())));
		
		apidatas.put(BrowserConstant.BROWSER_RESULT_COLUMN, tableHeadColumns);
		apidatas.put(BrowserConstant.BROWSER_RESULT_DATA, datas);
		apidatas.put(BrowserConstant.BROWSER_RESULT_TYPE, BrowserDataType.LIST_ALL_DATA.getTypeid());

		return apidatas;
	}
}
