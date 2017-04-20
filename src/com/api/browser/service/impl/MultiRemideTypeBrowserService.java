package com.api.browser.service.impl;

import java.util.HashMap;
import java.util.Map;

import com.api.browser.service.BrowserService;

import weaver.meeting.MeetingBrowser;

/**
 * 提醒方式
 * 
 * @author jhy Mar 29, 2017
 * 
 */
public class MultiRemideTypeBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		apidatas.put("datas", MeetingBrowser.getRemindMap());
		return apidatas;
	}
	
}
