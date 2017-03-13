package com.api.workflow.web;

public class ActionFactory {
	private static ActionFactory af = new ActionFactory();
	private String baseActionName;
	
	public static ActionFactory getInstance() {
		return af;
	}
	
	public String getBaseActionName() {
		return baseActionName;
	}

	public void setBaseActionName(String baseActionName) {
		this.baseActionName = baseActionName;
	}

	public Action getBaseAction() {
		Action a = null;
		try {
			a = (Action) Class.forName("com.api.workflow.web."+baseActionName).newInstance();
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		return a;
	}
}
