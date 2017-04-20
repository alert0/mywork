package com.api.browser.bean;

public class ListHeadBean {
	
	private String dataIndex;
	private String title;
	private boolean hide;
	private String width;
	
	
	public ListHeadBean() {
	}

	public ListHeadBean(String dataIndex, boolean hide) {
		this.dataIndex = dataIndex;
		this.hide = hide;
	}

	public ListHeadBean(String dataIndex, String title, String width) {
		this.dataIndex = dataIndex;
		this.title = title;
		this.width = width;
	}

	public ListHeadBean(String dataIndex, String title) {
		this.dataIndex = dataIndex;
		this.title = title;
	}
	public String getDataIndex() {
		return dataIndex;
	}
	public void setDataIndex(String dataIndex) {
		this.dataIndex = dataIndex;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public boolean isHide() {
		return hide;
	}
	public void setHide(boolean hide) {
		this.hide = hide;
	}
	public String getWidth() {
		return width;
	}
	public void setWidth(String width) {
		this.width = width;
	}

}
