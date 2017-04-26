package com.api.browser.util;

/**
 * 浏览按钮返回的数据类型
 * @author jhy Apr 13, 2017
 * 
 */
public enum BrowserDataType {

	LIST_SPLIT_DATA(1, "分页列表"), LIST_ALL_DATA(2, "显示所有数据"), TREE_DATA(3, "树形数据");

	private BrowserDataType(int typeid, String typename) {
		this.typeid = typeid;
	}

	private int typeid;

	@Override
	public String toString() {
		return String.valueOf(this.typeid);
	}

	public int getTypeid() {
		return typeid;
	}

	public void setTypeid(int typeid) {
		this.typeid = typeid;
	}
}
