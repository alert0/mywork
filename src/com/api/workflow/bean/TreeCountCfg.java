package com.api.workflow.bean;

import java.io.Serializable;

public class TreeCountCfg implements Serializable{

	private static final long serialVersionUID = 5546776150431129806L;
	private String name;
	private String title;
	private boolean isshow;		//是否显示在树右侧
	private String color;
	private String hovercolor;
	
	public TreeCountCfg(){
	}
	
	public TreeCountCfg(String name, String title, boolean isshow, String color, String hovercolor){
		this.name = name;
		this.title = title;
		this.isshow = isshow;
		this.color = color;
		this.hovercolor = hovercolor;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public boolean isIsshow() {
		return isshow;
	}

	public void setIsshow(boolean isshow) {
		this.isshow = isshow;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getHovercolor() {
		return hovercolor;
	}

	public void setHovercolor(String hovercolor) {
		this.hovercolor = hovercolor;
	}
	
}
