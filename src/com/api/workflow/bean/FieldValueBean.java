package com.api.workflow.bean;

import java.io.Serializable;

public class FieldValueBean implements Serializable{
	
	private static final long serialVersionUID = 3373084040465947530L;
	private String value;
	private String showname;
	private String formatvalue;
	private Object specialobj;
	
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getShowname() {
		return showname;
	}
	public void setShowname(String showname) {
		this.showname = showname;
	}
	public String getFormatvalue() {
		return formatvalue;
	}
	public void setFormatvalue(String formatvalue) {
		this.formatvalue = formatvalue;
	}
	public Object getSpecialobj() {
		return specialobj;
	}
	public void setSpecialobj(Object specialobj) {
		this.specialobj = specialobj;
	}
	
	
}
