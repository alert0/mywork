package com.api.browser.bean;

import com.api.browser.util.BrowserDataType;

/**
 * 
 * @author jhy Apr 13, 2017
 *
 */
public class BrowserData {
	
	/**
	 * 返回的数据类型
	 */
	private BrowserDataType type; 
	
	/**
	 * 返回的数据
	 */
	private String browserData;
	

	public BrowserDataType getType() {
		return type;
	}

	public void setType(BrowserDataType type) {
		this.type = type;
	}

	public String getBrowserData() {
		return browserData;
	}

	public void setBrowserData(String browserData) {
		this.browserData = browserData;
	}
	
	
}
