package com.api.browser.bean;

import java.util.List;


public class BrowserValueInfo {

	//common
	private String id;
	private String lastname;
	private String tips;
	
	//group
	private String type;
	private List<BrowserValueInfo> users;
	private String nodeid;
	private String ids;
	private int count;
	
	//user
	private String jobtitlename;
	private String icon;
	private String departmentname;
	private String subcompanyname;
	private String supsubcompanyname;
	
	
	
	public BrowserValueInfo() {
	}


	public BrowserValueInfo(String id, String lastname) {
		this.id = id;
		this.lastname = lastname;
	}


	public BrowserValueInfo(String id, String type, List<BrowserValueInfo> users, String nodeid, String lastname) {
		this.id = id;
		this.type = type;
		this.users = users;
		this.nodeid = nodeid;
		this.lastname = lastname;
	}


	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}


	public String getLastname() {
		return lastname;
	}


	public void setLastname(String lastname) {
		this.lastname = lastname;
	}


	public String getTips() {
		return tips;
	}


	public void setTips(String tips) {
		this.tips = tips;
	}


	public String getType() {
		return type;
	}


	public void setType(String type) {
		this.type = type;
	}


	public List<BrowserValueInfo> getUsers() {
		return users;
	}


	public void setUsers(List<BrowserValueInfo> users) {
		this.users = users;
	}


	public String getNodeid() {
		return nodeid;
	}


	public void setNodeid(String nodeid) {
		this.nodeid = nodeid;
	}


	public String getIds() {
		return ids;
	}


	public void setIds(String ids) {
		this.ids = ids;
	}


	public int getCount() {
		return count;
	}


	public void setCount(int count) {
		this.count = count;
	}


	public String getJobtitlename() {
		return jobtitlename;
	}


	public void setJobtitlename(String jobtitlename) {
		this.jobtitlename = jobtitlename;
	}


	public String getIcon() {
		return icon;
	}


	public void setIcon(String icon) {
		this.icon = icon;
	}


	public String getDepartmentname() {
		return departmentname;
	}


	public void setDepartmentname(String departmentname) {
		this.departmentname = departmentname;
	}


	public String getSubcompanyname() {
		return subcompanyname;
	}


	public void setSubcompanyname(String subcompanyname) {
		this.subcompanyname = subcompanyname;
	}


	public String getSupsubcompanyname() {
		return supsubcompanyname;
	}


	public void setSupsubcompanyname(String supsubcompanyname) {
		this.supsubcompanyname = supsubcompanyname;
	}

}
