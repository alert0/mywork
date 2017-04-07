package com.api.browser.util;

public class SqlUtils {

	public static final String WHERE = "where";
	public static final String AND = "and";

	public static String replaceFirstAnd(String sqlWhere) {
		if (null == sqlWhere || "".equals(sqlWhere))
			return "";
		if (sqlWhere.indexOf(WHERE) > -1)
			return sqlWhere;
		if (sqlWhere.indexOf(AND) > -1) {
			return sqlWhere.replaceFirst(AND, WHERE);
		}
		return "";
	}
}
