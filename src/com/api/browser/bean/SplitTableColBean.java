package com.api.browser.bean;


/**
 * 列信息
 * 
 * @author jhy Apr 16, 2017
 * 
 */
public class SplitTableColBean {

	private String hide;
	private String width;
	private String text;
	private String column;
	private String orderkey;
	private String transmethod;
	private String otherpara;
	private String isHighlight;

	public SplitTableColBean() {

	}

	public SplitTableColBean(String column) {
		this.column = column;
	}

	public SplitTableColBean(String hide, String column) {
		this.hide = hide;
		this.column = column;
	}

	public SplitTableColBean(String width, String text, String column, String orderkey) {
		this.width = width;
		this.text = text;
		this.column = column;
		this.orderkey = orderkey;
	}

	public SplitTableColBean(String width, String text, String column, String transmethod, String otherpara) {
		this.width = width;
		this.text = text;
		this.column = column;
		this.transmethod = transmethod;
		this.otherpara = otherpara;
	}

	public SplitTableColBean(String width, String text, String column, String orderkey, String transmethod, String otherpara) {
		this.width = width;
		this.text = text;
		this.column = column;
		this.orderkey = orderkey;
		this.transmethod = transmethod;
		this.otherpara = otherpara;
	}

	public String getHide() {
		return hide == null ? "false" : hide;
	}

	public void setHide(String hide) {
		this.hide = hide;
	}

	public String getWidth() {
		return width;
	}

	public void setWidth(String width) {
		this.width = width;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getColumn() {
		return column;
	}

	public void setColumn(String column) {
		this.column = column;
	}

	public String getOrderkey() {
		return orderkey;
	}

	public void setOrderkey(String orderkey) {
		this.orderkey = orderkey;
	}

	public String getTransmethod() {
		return transmethod;
	}

	public void setTransmethod(String transmethod) {
		this.transmethod = transmethod;
	}

	public String getOtherpara() {
		return otherpara;
	}

	public void setOtherpara(String otherpara) {
		this.otherpara = otherpara;
	}

	public String getIsHighlight() {
		return isHighlight;
	}

	public void setIsHighlight(String isHighlight) {
		this.isHighlight = isHighlight;
	}
}
