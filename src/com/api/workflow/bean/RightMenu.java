package com.api.workflow.bean;

import java.io.Serializable;

public class RightMenu implements Serializable{
	
	private static final long serialVersionUID = -4448694547539992102L;
	private String menuName;
	private String menuFun;
	private String target;
	private String menuIcon;
	private String buttonId;
	private String isTop;
	private String menuType;
	
	public String getMenuName() {
		return menuName;
	}
	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}
	public String getMenuFun() {
		return menuFun;
	}
	public void setMenuFun(String menuFun) {
		this.menuFun = menuFun;
	}
	public String getTarget() {
		return target;
	}
	public void setTarget(String target) {
		this.target = target;
	}
	public String getMenuIcon() {
		return menuIcon;
	}
	public void setMenuIcon(String menuIcon) {
		this.menuIcon = menuIcon;
	}
	public String getButtonId() {
		return buttonId;
	}
	public void setButtonId(String buttonId) {
		this.buttonId = buttonId;
	}
	public String getIsTop() {
		return isTop;
	}
	public void setIsTop(String isTop) {
		this.isTop = isTop;
	}
	public String getMenuType() {
		return menuType;
	}
	public void setMenuType(String menuType) {
		this.menuType = menuType;
	}
}
