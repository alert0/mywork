package com.api.workflow.bean;

import java.io.Serializable;

import com.api.workflow.util.RequestMenuType;

public class RightMenu implements Serializable {

	private static final long serialVersionUID = -4448694547539992102L;
	private String menuName;
	private String menuFun;
	private String menuIcon;
	private RequestMenuType type;
	private String isTop;
	private String menuType;

	public RightMenu(String menuName, RequestMenuType type, String menuFun, String menuIcon) {
		this.menuName = menuName;
		this.menuFun = menuFun;
		this.menuIcon = menuIcon;
		this.type = type;
		this.isTop = type.isTop() ? "1" : "0";
	}

	public RightMenu() {
		
	}
	public RequestMenuType getType() {
		return type;
	}

	public void setType(RequestMenuType type) {
		this.type = type;
	}

	public String getMenuType() {
		return menuType;
	}

	public void setMenuType(String menuType) {
		this.menuType = menuType;
	}

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

	public String getMenuIcon() {
		return menuIcon;
	}

	public void setMenuIcon(String menuIcon) {
		this.menuIcon = menuIcon;
	}

	public String getIsTop() {
		return isTop;
	}

	public void setIsTop(String isTop) {
		this.isTop = isTop;
	}
}
