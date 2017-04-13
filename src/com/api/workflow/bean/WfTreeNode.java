package com.api.workflow.bean;

import java.io.Serializable;
import java.util.List;

public class WfTreeNode implements Serializable{

	private static final long serialVersionUID = 5044021437443378846L;
	private String domid;
	private String key;
	private String name;
	private boolean isopen;
	private boolean haschild;
	private List<WfTreeNode> childs;
	public String getDomid() {
		return domid;
	}
	public void setDomid(String domid) {
		this.domid = domid;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public boolean isIsopen() {
		return isopen;
	}
	public void setIsopen(boolean isopen) {
		this.isopen = isopen;
	}
	public boolean isHaschild() {
		return haschild;
	}
	public void setHaschild(boolean haschild) {
		this.haschild = haschild;
	}
	public List<WfTreeNode> getChilds() {
		return childs;
	}
	public void setChilds(List<WfTreeNode> childs) {
		this.childs = childs;
	}
	
	
}
