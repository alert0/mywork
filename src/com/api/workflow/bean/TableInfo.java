package com.api.workflow.bean;

import java.util.*;

public class TableInfo {
	
	private int tableindex;		//主表为0，明细1则为1
	private String tablename = "";
	private String tablecolumn = "";
	private Map<String,FieldInfo> fieldinfomap = new HashMap<String,FieldInfo>();
	private List<String> fieldorder;
	private DetailTableAttr detailtableattr;
	private int recordnum;
	
	public int getTableindex() {
		return tableindex;
	}
	public void setTableindex(int tableindex) {
		this.tableindex = tableindex;
	}
	public String getTablename() {
		return tablename;
	}
	public void setTablename(String tablename) {
		this.tablename = tablename;
	}
	public String getTablecolumn() {
		return tablecolumn;
	}
	public void setTablecolumn(String tablecolumn) {
		this.tablecolumn = tablecolumn;
	}
	public Map<String, FieldInfo> getFieldinfomap() {
		return fieldinfomap;
	}
	public void setFieldinfomap(Map<String, FieldInfo> fieldinfomap) {
		this.fieldinfomap = fieldinfomap;
	}
	public List<String> getFieldorder() {
		return fieldorder;
	}
	public void setFieldorder(List<String> fieldorder) {
		this.fieldorder = fieldorder;
	}
	public DetailTableAttr getDetailtableattr() {
		return detailtableattr;
	}
	public void setDetailtableattr(DetailTableAttr detailtableattr) {
		this.detailtableattr = detailtableattr;
	}
	public int getRecordnum() {
		return recordnum;
	}
	public void setRecordnum(int recordnum) {
		this.recordnum = recordnum;
	}
	
	
}
