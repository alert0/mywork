package com.api.workflow.bean;

import java.util.List;

public class SelectFieldAttr {

	private int childfieldid;
	private int fieldshowtypes;
	private int selectitemtype;
	private int pubchoiceid;
	private int pubchilchoiceid;
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
	public int getSelectitemtype() {
		return selectitemtype;
	}
	public void setSelectitemtype(int selectitemtype) {
		this.selectitemtype = selectitemtype;
	}
	public int getPubchoiceid() {
		return pubchoiceid;
	}
	public void setPubchoiceid(int pubchoiceid) {
		this.pubchoiceid = pubchoiceid;
	}
	public int getPubchilchoiceid() {
		return pubchilchoiceid;
	}
	public void setPubchilchoiceid(int pubchilchoiceid) {
		this.pubchilchoiceid = pubchilchoiceid;
	}
	public List<SelectItem> getSelectitemlist() {
		return selectitemlist;
	}
	public void setSelectitemlist(List<SelectItem> selectitemlist) {
		this.selectitemlist = selectitemlist;
	}
	
	
}
