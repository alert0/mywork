package com.api.workflow.bean;

import java.util.ArrayList;
import java.util.List;

public class WfBean {
	private String id;
	private String typeId;
	private String type2;
	private String name;
	private String url;
	private String wfColl; //流程是否已经收藏 ("1"：收藏,"0"：未收藏)
	private String isImportWf; //流程导入
	private String usedtodo; //常用流程
	private List<WfUser> beagenters; //代理人
	private List<WfUser> belongtoUsers; //有流程创建权限的次账号 
	private WfUser user;
	private String letter;
	private String spell;
	private Integer usedtodoorder; //常用流程順序
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTypeId() {
		return typeId;
	}
	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}
	public String getType2() {
		return type2;
	}
	public void setType2(String type2) {
		this.type2 = type2;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUrl() {
		return url;
	}
	public String getUsedtodo() {
		return usedtodo;
	}
	public void setUsedtodo(String usedtodo) {
		this.usedtodo = usedtodo;
	}
	public List<WfUser> getBeagenters() {
		return beagenters;
	}
	public void setBeagenters(List<WfUser> beagenters) {
		this.beagenters = beagenters;
	}
	public List<WfUser> getBelongtoUsers() {
		return belongtoUsers;
	}
	public void setBelongtoUsers(List<WfUser> belongtoUsers) {
		this.belongtoUsers = belongtoUsers;
	}
	public String getWfColl() {
		return wfColl;
	}
	public void setWfColl(String wfColl) {
		this.wfColl = wfColl;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public WfUser getUser() {
		return user;
	}
	public void setUser(WfUser user) {
		this.user = user;
	}
	public String getIsImportWf() {
		return isImportWf;
	}
	public void setIsImportWf(String isImportWf) {
		this.isImportWf = isImportWf;
	}
	public WfBean() {
		this.beagenters = new ArrayList<WfUser>();
		this.belongtoUsers = new ArrayList<WfUser>();
	}
	public String getLetter() {
		return letter;
	}
	public void setLetter(String letter) {
		this.letter = letter;
	}
	public String getSpell() {
		return spell;
	}
	public void setSpell(String spell) {
		this.spell = spell;
	}
	public Integer getUsedtodoorder() {
		return usedtodoorder;
	}
	public void setUsedtodoorder(Integer usedtodoorder) {
		this.usedtodoorder = usedtodoorder;
	}
}
