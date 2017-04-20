package com.api.browser.bean;

import java.io.Serializable;
import java.util.List;

import com.api.browser.util.SqlUtils;

import weaver.general.Util;

/**
 * tableString
 * 
 * @author jhy Apr 16, 2017
 * 
 */
public class SplitTableBean implements Serializable {

	private static final long serialVersionUID = -2490260904947284539L;
	// table
	private String pageUID;
	private String tableType;
	private String pagesize;
	private String instanceid;
	private String datasource;
	private String sourceparams;

	// sql
	private String backfields;
	private String sqlform;
	private String sqlwhere;
	private String sqlorderby;
	private String sqlprimarykey;
	private String sqlsortway;
	private String sqlisdistinct;
	
	// col
	private List<SplitTableColBean> cols;

	public SplitTableBean() {
	}
	
	
	/**
	 * 
	 * @param backfields
	 * @param sqlform
	 * @param sqlwhere
	 * @param sqlorderby
	 * @param sqlprimarykey
	 * @param sqlsortway
	 * @param cols
	 */
	public SplitTableBean(String backfields, String sqlform, String sqlwhere, String sqlorderby, String sqlprimarykey, List<SplitTableColBean> cols) {
		this.backfields = backfields;
		this.sqlform = sqlform;
		this.sqlwhere = sqlwhere;
		this.sqlorderby = sqlorderby;
		this.sqlprimarykey = sqlprimarykey;
		this.cols = cols;
	}

	/**
	 * 
	 * @param pageUID
	 * @param tableType
	 * @param pagesize
	 * @param instanceid
	 * @param backfields
	 * @param sqlform
	 * @param sqlwhere
	 * @param sqlorderby
	 * @param sqlprimarykey
	 * @param sqlsortway
	 * @param cols
	 */
	public SplitTableBean(String pageUID, String tableType, String pagesize, String instanceid, String backfields, String sqlform, String sqlwhere, String sqlorderby, String sqlprimarykey,
			String sqlsortway, List<SplitTableColBean> cols) {
		this.pageUID = pageUID;
		this.tableType = tableType;
		this.pagesize = pagesize;
		this.instanceid = instanceid;
		this.backfields = backfields;
		this.sqlform = sqlform;
		this.sqlwhere = sqlwhere;
		this.sqlorderby = sqlorderby;
		this.sqlprimarykey = sqlprimarykey;
		this.sqlsortway = sqlsortway;
		this.cols = cols;
	}


	/**
	 * 
	 * @param pageUID
	 * @param backfields
	 * @param sqlform
	 * @param sqlwhere
	 * @param sqlorderby
	 * @param sqlprimarykey
	 * @param sqlsortway
	 * @param cols
	 */
	public SplitTableBean(String pageUID, String backfields, String sqlform, String sqlwhere, String sqlorderby, String sqlprimarykey, String sqlsortway, List<SplitTableColBean> cols) {
		super();
		this.pageUID = pageUID;
		this.backfields = backfields;
		this.sqlform = sqlform;
		this.sqlwhere = sqlwhere;
		this.sqlorderby = sqlorderby;
		this.sqlprimarykey = sqlprimarykey;
		this.sqlsortway = sqlsortway;
		this.cols = cols;
	}
	
	/**
	 * 
	 * @param pageUID
	 * @param tableType
	 * @param backfields
	 * @param sqlform
	 * @param sqlwhere
	 * @param sqlorderby
	 * @param sqlprimarykey
	 * @param sqlsortway
	 * @param cols
	 */
	public SplitTableBean(String pageUID, String tableType, String backfields, String sqlform, String sqlwhere, String sqlorderby, String sqlprimarykey, String sqlsortway, List<SplitTableColBean> cols) {
		this.pageUID = pageUID;
		this.tableType = tableType;
		this.backfields = backfields;
		this.sqlform = sqlform;
		this.sqlwhere = sqlwhere;
		this.sqlorderby = sqlorderby;
		this.sqlprimarykey = sqlprimarykey;
		this.sqlsortway = sqlsortway;
		this.cols = cols;
	}

	public String getPageUID() {
		return Util.null2String(pageUID);
	}

	public void setPageUID(String pageUID) {
		this.pageUID = pageUID;
	}

	public String getTableType() {
		tableType = Util.null2String(tableType);
		return "".equals(tableType) ? "none" : tableType;
	}

	public void setTableType(String tableType) {
		this.tableType = tableType;
	}

	public String getPagesize() {
		return pagesize == null ? "10" : pagesize;
	}

	public void setPagesize(String pagesize) {
		this.pagesize = pagesize;
	}

	public String getInstanceid() {
		return instanceid;
	}

	public void setInstanceid(String instanceid) {
		this.instanceid = instanceid;
	}

	public String getBackfields() {
		return backfields;
	}

	public void setBackfields(String backfields) {
		this.backfields = backfields;
	}

	public String getSqlform() {
		return sqlform;
	}

	public void setSqlform(String sqlform) {
		this.sqlform = sqlform;
	}

	public String getSqlwhere() {
		sqlwhere = SqlUtils.replaceFirstAnd(sqlwhere);
		return sqlwhere;
	}

	public void setSqlwhere(String sqlwhere) {
		this.sqlwhere = sqlwhere;
	}

	public String getSqlorderby() {
		return sqlorderby;
	}

	public void setSqlorderby(String sqlorderby) {
		this.sqlorderby = sqlorderby;
	}

	public String getSqlprimarykey() {
		return sqlprimarykey;
	}

	public void setSqlprimarykey(String sqlprimarykey) {
		this.sqlprimarykey = sqlprimarykey;
	}

	public String getSqlsortway() {
		sqlsortway = Util.null2String(sqlsortway);
		return "".equals(sqlsortway) ? "DESC" : sqlsortway;
	}

	public void setSqlsortway(String sqlsortway) {
		this.sqlsortway = sqlsortway;
	}

	public List<SplitTableColBean> getCols() {
		return cols;
	}

	public void setCols(List<SplitTableColBean> cols) {
		this.cols = cols;
	}

	public String getSqlisdistinct() {
		return sqlisdistinct == null ? "false" : sqlisdistinct;
	}

	public void setSqlisdistinct(String sqlisdistinct) {
		this.sqlisdistinct = sqlisdistinct;
	}


	public String getDatasource() {
		return datasource;
	}


	public void setDatasource(String datasource) {
		this.datasource = datasource;
	}


	public String getSourceparams() {
		return sourceparams;
	}


	public void setSourceparams(String sourceparams) {
		this.sourceparams = sourceparams;
	}
}
