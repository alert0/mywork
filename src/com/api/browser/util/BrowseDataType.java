package com.api.browser.util;

/**
 * 
 * @author jhy Apr 13, 2017
 * 
 */
public enum BrowseDataType {

	LIST_SPLIT_DATA(1, "分页列表"), LIST_ALL_DATA(2, "显示所有数据"), TREE_DATA(3, "树形数据");

	private BrowseDataType(int typeid, String typename) {
		this.typeid = typeid;
	}

	private int typeid;

	@Override
	public String toString() {
		return String.valueOf(this.typeid);
	}
}
