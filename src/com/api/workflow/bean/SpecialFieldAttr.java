package com.api.workflow.bean;

import java.io.Serializable;

public class SpecialFieldAttr implements Serializable{

	private static final long serialVersionUID = 7761393615368118002L;
	private String displayname;
	private String linkaddress;
	private String descriptivetext;
	
	public String getDisplayname() {
		return displayname;
	}
	public void setDisplayname(String displayname) {
		this.displayname = displayname;
	}
	public String getLinkaddress() {
		return linkaddress;
	}
	public void setLinkaddress(String linkaddress) {
		this.linkaddress = linkaddress;
	}
	public String getDescriptivetext() {
		return descriptivetext;
	}
	public void setDescriptivetext(String descriptivetext) {
		this.descriptivetext = descriptivetext;
	}
	
}
