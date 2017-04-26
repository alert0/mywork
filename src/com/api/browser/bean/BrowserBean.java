package com.api.browser.bean;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * 浏览按钮属性
 * @author jhy Apr 25, 2017
 *
 */
public class BrowserBean implements Serializable{
	
	private static final long serialVersionUID = 8007702056167773947L;
	
	private String type;
	private String name;
	private int viewAttr; 
	private String title;
	private String desc;
	private boolean isSingle;
	private List<BrowserValueInfo> value;
	private String onChange;
	private String icon;
	private String iconColor;
	private String linkUrl;
	private Map<String,Object> style;
	private int isDetail;
	private String dataURL;
	private String conditionURL;
	private String completeURL;
	private Map<String,Object> dataParams;
	private Map<String,Object> completeParams;
	private int isAutoComplete;
	private boolean hasAdd;
	private String ddUrl;
	private String addOnClick;
	private String _callbackForAdd;
	private Map<String,Object> _callbackForAddParams;
	
	public void init(){
		this.viewAttr =  2;
		this.isSingle = true;
		this.isDetail = 0;
		this.isAutoComplete = 0;
		this.hasAdd  = false;
	}
	
	public BrowserBean() {
		init();
	}
	
	public BrowserBean(String type, String name, String title) {
		init();
		this.type = type;
		this.name = name;
		this.title = title;
	}

	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getViewAttr() {
		return viewAttr;
	}
	public void setViewAttr(int viewAttr) {
		this.viewAttr = viewAttr;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public boolean isSingle() {
		return isSingle;
	}
	public void setSingle(boolean isSingle) {
		this.isSingle = isSingle;
	}
	public List<BrowserValueInfo> getValue() {
		return value;
	}
	public void setValue(List<BrowserValueInfo> value) {
		this.value = value;
	}
	public String getOnChange() {
		return onChange;
	}
	public void setOnChange(String onChange) {
		this.onChange = onChange;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public String getIconColor() {
		return iconColor;
	}
	public void setIconColor(String iconColor) {
		this.iconColor = iconColor;
	}
	public String getLinkUrl() {
		return linkUrl;
	}
	public void setLinkUrl(String linkUrl) {
		this.linkUrl = linkUrl;
	}
	public Map<String, Object> getStyle() {
		return style;
	}
	public void setStyle(Map<String, Object> style) {
		this.style = style;
	}
	public int getIsDetail() {
		return isDetail;
	}
	public void setIsDetail(int isDetail) {
		this.isDetail = isDetail;
	}
	public String getDataURL() {
		return dataURL;
	}
	public void setDataURL(String dataURL) {
		this.dataURL = dataURL;
	}
	public String getConditionURL() {
		return conditionURL;
	}
	public void setConditionURL(String conditionURL) {
		this.conditionURL = conditionURL;
	}
	public String getCompleteURL() {
		return completeURL;
	}
	public void setCompleteURL(String completeURL) {
		this.completeURL = completeURL;
	}
	public Map<String, Object> getDataParams() {
		return dataParams;
	}
	public void setDataParams(Map<String, Object> dataParams) {
		this.dataParams = dataParams;
	}
	public Map<String, Object> getCompleteParams() {
		return completeParams;
	}
	public void setCompleteParams(Map<String, Object> completeParams) {
		this.completeParams = completeParams;
	}
	public int getIsAutoComplete() {
		return isAutoComplete;
	}
	public void setIsAutoComplete(int isAutoComplete) {
		this.isAutoComplete = isAutoComplete;
	}
	public boolean isHasAdd() {
		return hasAdd;
	}
	public void setHasAdd(boolean hasAdd) {
		this.hasAdd = hasAdd;
	}
	public String getDdUrl() {
		return ddUrl;
	}
	public void setDdUrl(String ddUrl) {
		this.ddUrl = ddUrl;
	}
	public String getAddOnClick() {
		return addOnClick;
	}
	public void setAddOnClick(String addOnClick) {
		this.addOnClick = addOnClick;
	}
	public String get_callbackForAdd() {
		return _callbackForAdd;
	}
	public void set_callbackForAdd(String forAdd) {
		_callbackForAdd = forAdd;
	}
	public Map<String, Object> get_callbackForAddParams() {
		return _callbackForAddParams;
	}
	public void set_callbackForAddParams(Map<String, Object> forAddParams) {
		_callbackForAddParams = forAddParams;
	}
}
