package com.api.browser.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import weaver.systeminfo.language.LanguageComInfo;

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
		
		//设置表头
		List<Map<String,Object>> columns = new ArrayList<Map<String,Object>>();
		Map<String,Object> column = new HashMap<String,Object>();
		column.put("dataIndex", "languageid");
		column.put("title", SystemEnv.getHtmlLabelName(84,user.getLanguage()));
		columns.add(column);
		
		column = new HashMap<String,Object>();
		column.put("dataIndex", "languagename");
		column.put("title", SystemEnv.getHtmlLabelName(195,user.getLanguage()));
		columns.add(column);
		apidatas.put("columns", columns);
		
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
		return apidatas;
	}
}
