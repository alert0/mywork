package com.api.browser.bean;

import java.util.List;
import java.util.Map;

/**
 * 浏览框树节点信息
 * @author jhy Apr 26, 2017
 *
 */
public class BrowserTreeNode {
	
	private String id;
	private String name;
	private String desc;
	private String linkUrl;
	private String icon;
	private String pid;
	private boolean isParent;
	private List<BrowserTreeNode> subs;
	private String type; //类型
	//其他属性
	private Map<String,Object> prop;
	
	
	public BrowserTreeNode() {
	}
	
	public BrowserTreeNode(String id, String name, String pid, boolean isParent) {
		this.id = id;
		this.name = name;
		this.pid = pid;
		this.isParent = isParent;
	}
	public BrowserTreeNode(String id, String name, String pid, boolean isParent, List<BrowserTreeNode> subs) {
		this.id = id;
		this.name = name;
		this.pid = pid;
		this.isParent = isParent;
		this.subs = subs;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getLinkUrl() {
		return linkUrl;
	}
	public void setLinkUrl(String linkUrl) {
		this.linkUrl = linkUrl;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public boolean getIsParent() {
		return isParent;
	}
	public void setIsParent(boolean isParent) {
		this.isParent = isParent;
	}
	public List<BrowserTreeNode> getSubs() {
		return subs;
	}
	public void setSubs(List<BrowserTreeNode> subs) {
		this.subs = subs;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}

	public Map<String, Object> getProp() {
		return prop;
	}

	public void setProp(Map<String, Object> prop) {
		this.prop = prop;
	}

	public void setParent(boolean isParent) {
		this.isParent = isParent;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
