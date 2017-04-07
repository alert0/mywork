package com.api.workflow.bean;

import java.util.List;

public class LinkageCfgBean {
	private String assignfield;		//赋值字段
	private Object config;			//联动配置
	private List<String> relatefields;	//相关取值字段
	
	public LinkageCfgBean(String assignfield, Object config){
		this.assignfield = assignfield;
		this.config = config;
	}
	
	public LinkageCfgBean(String assignfield, Object config, List<String> relatefields){
		this(assignfield, config);
		this.relatefields = relatefields;
	}

	public String getAssignfield() {
		return assignfield;
	}

	public void setAssignfield(String assignfield) {
		this.assignfield = assignfield;
	}

	public Object getConfig() {
		return config;
	}

	public void setConfig(Object config) {
		this.config = config;
	}

	public List<String> getRelatefields() {
		return relatefields;
	}

	public void setRelatefields(List<String> relatefields) {
		this.relatefields = relatefields;
	}
	
}
