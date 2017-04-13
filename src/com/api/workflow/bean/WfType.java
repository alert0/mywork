package com.api.workflow.bean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class WfType implements Serializable{

	private static final long serialVersionUID = -1476477376137409514L;
	private String id;
	private String type1Id;
	private String type2;
	private String typeName;
	private int    order;
	private Map<String,WfBean> wfbeanInfo;
	private String wftypeColl;
	private List<WfBean> wfbeans;
	private String color;
	private String img;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getType1Id() {
		return type1Id;
	}
	public void setType1Id(String type1Id) {
		this.type1Id = type1Id;
	}
	public String getType2() {
		return type2;
	}
	public void setType2(String type2) {
		this.type2 = type2;
	}
	public String getTypeName() {
		return typeName;
	}
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
	public int getOrder() {
		return order;
	}
	public void setOrder(int order) {
		this.order = order;
	}
	
	public Map<String, WfBean> getWfbeanInfo() {
		return wfbeanInfo;
	}
	public void setWfbeanInfo(Map<String, WfBean> wfbeanInfo) {
		this.wfbeanInfo = wfbeanInfo;
	}
	public WfType() {
		this.wfbeanInfo =  new LinkedHashMap<String,WfBean>();
		this.wfbeans = new ArrayList<WfBean>();
	}
	public String getWftypeColl() {
		return wftypeColl;
	}
	public void setWftypeColl(String wftypeColl) {
		this.wftypeColl = wftypeColl;
	}
	public List<WfBean> getWfbeans() {
		return wfbeans;
	}
	public void setWfbeans(List<WfBean> wfbeans) {
		this.wfbeans = wfbeans;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getImg() {
		return img;
	}
	public void setImg(String img) {
		this.img = img;
	}
}
