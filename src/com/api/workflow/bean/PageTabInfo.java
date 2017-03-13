package com.api.workflow.bean;

public class PageTabInfo {
	private String groupid;
	private String title;
	private int viewcondition;
	private boolean showcount;
	private String color;
	
	public PageTabInfo(){
	}
	
	public PageTabInfo(String groupid, String title, int viewcondition, boolean showcount, String color){
		this.groupid = groupid;
		this.title = title;
		this.viewcondition = viewcondition;
		this.showcount = showcount;
		this.color = color;
	}
	
	public String getGroupid() {
		return groupid;
	}
	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public int getViewcondition() {
		return viewcondition;
	}
	public void setViewcondition(int viewcondition) {
		this.viewcondition = viewcondition;
	}
	public boolean isShowcount() {
		return showcount;
	}
	public void setShowcount(boolean showcount) {
		this.showcount = showcount;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	
}
