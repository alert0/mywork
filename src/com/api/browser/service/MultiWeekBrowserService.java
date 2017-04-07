package com.api.browser.service;

import java.util.HashMap;
import java.util.Map;

import weaver.meeting.MeetingBrowser;

/**
 * 星期多选
 * 
 * @author jhy Mar 29, 2017
 * 
 */
public class MultiWeekBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		apidatas.put("datas", MeetingBrowser.getWeekMap());
		return apidatas;
	}
}
