package com.api.workflow.bean;

import java.io.Serializable;

public class SearchConditionOption implements Serializable{

	private static final long serialVersionUID = 363769579655304111L;
	private String key;
	private String showname;
	private boolean selected= false;
	
	public SearchConditionOption(){}
	
	public SearchConditionOption(String key, String showname){
		this.key = key;
		this.showname = showname;
	}
	
	public SearchConditionOption(String key, String showname, boolean selected){
		this.key = key;
		this.showname = showname;
		this.selected = selected;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getShowname() {
		return showname;
	}

	public void setShowname(String showname) {
		this.showname = showname;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}
	
	
}
