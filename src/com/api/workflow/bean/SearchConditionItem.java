package com.api.workflow.bean;

import java.io.Serializable;
import java.util.List;

import com.api.browser.bean.BrowserBean;
import com.api.workflow.util.ConditionType;

public class SearchConditionItem implements Serializable{

	private static final long serialVersionUID = -7372241015882160206L;

	private ConditionType conditionType;
	/**标识参数*/
	private String key;
	
	/**显示、提交参数*/
	private String label;
	private String relatekey;
	private String[] domkey;
	private List<SearchConditionOption> options;
	
	/**布局参数*/
	private int labelcol;
	private int fieldcol;
	
	/**组件参数*/
	private BrowserBean browserConditionParam;
	
	public SearchConditionItem(){}
	
	public SearchConditionItem(String key, String label, String relatekey, 
			String[] domkey, List<SearchConditionOption> options, int labelcol, int fieldcol){
		this.key = key;
		this.label = label;
		this.relatekey = relatekey;
		this.domkey = domkey;
		this.options = options;
		this.labelcol = labelcol;
		this.fieldcol = fieldcol;
	}

	public SearchConditionItem(ConditionType conditionType, String label, String relatekey, String[] domkey, List<SearchConditionOption> options, int labelcol, int fieldcol,
			BrowserBean browserConditionParam) {
		super();
		this.conditionType = conditionType;
		this.label = label;
		this.relatekey = relatekey;
		this.domkey = domkey;
		this.options = options;
		this.labelcol = labelcol;
		this.fieldcol = fieldcol;
		this.browserConditionParam = browserConditionParam;
	}

	public SearchConditionItem(String key, String label, String relatekey, String[] domkey, List<SearchConditionOption> options, int labelcol, int fieldcol, BrowserBean browserConditionParam) {
		this.key = key;
		this.label = label;
		this.relatekey = relatekey;
		this.domkey = domkey;
		this.options = options;
		this.labelcol = labelcol;
		this.fieldcol = fieldcol;
		this.browserConditionParam = browserConditionParam;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getRelatekey() {
		return relatekey;
	}

	public void setRelatekey(String relatekey) {
		this.relatekey = relatekey;
	}

	public String[] getDomkey() {
		return domkey;
	}

	public void setDomkey(String[] domkey) {
		this.domkey = domkey;
	}

	public List<SearchConditionOption> getOptions() {
		return options;
	}

	public void setOptions(List<SearchConditionOption> options) {
		this.options = options;
	}

	public int getLabelcol() {
		return labelcol;
	}

	public void setLabelcol(int labelcol) {
		this.labelcol = labelcol;
	}

	public int getFieldcol() {
		return fieldcol;
	}

	public void setFieldcol(int fieldcol) {
		this.fieldcol = fieldcol;
	}

	public BrowserBean getBrowserConditionParam() {
		return browserConditionParam;
	}

	public void setBrowserConditionParam(BrowserBean browserConditionParam) {
		this.browserConditionParam = browserConditionParam;
	}

	public ConditionType getConditionType() {
		return conditionType;
	}

	public void setConditionType(ConditionType conditionType) {
		this.conditionType = conditionType;
	}
}
