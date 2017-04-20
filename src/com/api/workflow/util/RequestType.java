package com.api.workflow.util;

/**
 * 请求类型
 * 
 * @author jhy Apr 18, 2017
 * 
 */
public enum RequestType {

	VIEW_REQ(0, "已办请求"), MANAGE_REQ(1, "待办请求"), CREATE_REQ(2, "新建请求");

	private int id;
	private String description;

	private RequestType(int id, String description) {
		this.id = id;
		this.description = description;
	}

	public int getId() {
		return id;
	}

	public String getDescription() {
		return description;
	}
}
