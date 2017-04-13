package com.api.workflow.bean;

import java.io.Serializable;
import java.util.List;

public class SelectFieldAttr implements Serializable{

	private static final long serialVersionUID = 3277734710651043432L;
	private int childfieldid;
	private int fieldshowtypes;
	//private int selectitemtype;
	//private int pubchoiceid;
	//private int pubchilchoiceid;
	private List<SelectItem> selectitemlist;
	
	
	public int getChildfieldid() {
		return childfieldid;
	}
	public void setChildfieldid(int childfieldid) {
		this.childfieldid = childfieldid;
	}
	public int getFieldshowtypes() {
		return fieldshowtypes;
	}
	public void setFieldshowtypes(int fieldshowtypes) {
		this.fieldshowtypes = fieldshowtypes;
	}
	public List<SelectItem> getSelectitemlist() {
		return selectitemlist;
	}
	public void setSelectitemlist(List<SelectItem> selectitemlist) {
		this.selectitemlist = selectitemlist;
	}
	
	
}
