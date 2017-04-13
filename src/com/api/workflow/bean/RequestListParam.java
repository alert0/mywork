package com.api.workflow.bean;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import weaver.hrm.User;
import weaver.search.SearchClause;

public class RequestListParam implements Serializable{
	
	private static final long serialVersionUID = 7286887364756096159L;
	private User user = new User();
	private SearchClause SearchClause = new SearchClause();
	private Map<String,String> reqparams = new HashMap<String,String>();
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public SearchClause getSearchClause() {
		return SearchClause;
	}
	public void setSearchClause(SearchClause searchClause) {
		SearchClause = searchClause;
	}
	public Map<String, String> getReqparams() {
		return reqparams;
	}
	public void setReqparams(Map<String, String> reqparams) {
		this.reqparams = reqparams;
	}

}
