package com.api.browser.bean;

import com.api.browser.util.BrowseDataType;

/**
 * 
 * @author jhy Apr 13, 2017
 *
 */
public class BrowserData {
	
	/**
	 * 返回的数据类型
	 */
	private BrowseDataType type; 
	
	/**
	 * 返回的数据
	 */
	private String browserData;
	

	public BrowseDataType getType() {
		return type;
	}

	public void setType(BrowseDataType type) {
		this.type = type;
	}

	public String getBrowserData() {
		return browserData;
	}

	public void setBrowserData(String browserData) {
		this.browserData = browserData;
	}
	
	
}
