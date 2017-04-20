package com.api.browser.util;

import java.util.List;
import java.util.Map;

import weaver.general.Util;

import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 组装TableString字符串
 * @author jhy Apr 17, 2017
 *
 */
public class SplitTableUtil {

	private static final String SUF_MARK = "\"";

	public static String getTableString(SplitTableBean splitTable) {
		StringBuilder tableString = new StringBuilder();
		// table
		tableString.append("<table tabletype=\"").append(splitTable.getTableType()).append(SUF_MARK);
		if(splitTable.getPageUID() != null){
			tableString.append(" pageUid=\"").append(splitTable.getPageUID()).append(SUF_MARK);
		}
		tableString.append(" pagesize=\"").append(splitTable.getPagesize()).append(SUF_MARK);
		if(splitTable.getDatasource() != null){
			tableString.append(" datasource=\"").append(splitTable.getDatasource()).append(SUF_MARK);	
		}
		if(splitTable.getSourceparams() != null){
			tableString.append(" sourceparams=\"").append(splitTable.getSourceparams()).append(SUF_MARK);
		}
		tableString.append(">");
		// sql
		tableString.append("<sql backfields=\"").append(splitTable.getBackfields()).append(SUF_MARK);
		tableString.append(" sqlform=\"").append(Util.toHtmlForSplitPage(splitTable.getSqlform())).append(SUF_MARK);
		tableString.append(" sqlwhere=\"").append(splitTable.getSqlwhere()).append(SUF_MARK);
		tableString.append(" sqlorderby=\"").append(splitTable.getSqlorderby()).append(SUF_MARK);
		tableString.append(" sqlprimarykey=\"").append(splitTable.getSqlprimarykey()).append(SUF_MARK);
		tableString.append(" sqlsortway=\"").append(splitTable.getSqlsortway()).append(SUF_MARK);
		tableString.append(" sqlisdistinct=\"").append(splitTable.getSqlisdistinct()).append(SUF_MARK);
		tableString.append("/>");
		// col
		tableString.append("<head>");
		List<SplitTableColBean> cols = splitTable.getCols();
		for (SplitTableColBean colBean : cols) {
			tableString.append("<col hide=\"").append(colBean.getHide()).append(SUF_MARK);
			if (colBean.getWidth() != null)
				tableString.append(" width=\"").append(colBean.getWidth()).append(SUF_MARK);
			if (colBean.getText() != null)
				tableString.append(" text=\"").append(colBean.getText()).append(SUF_MARK);
			if (colBean.getColumn() != null)
				tableString.append(" column=\"").append(colBean.getColumn()).append(SUF_MARK);
			if (colBean.getOrderkey() != null)
				tableString.append(" orderkey=\"").append(colBean.getOrderkey()).append(SUF_MARK);
			if (colBean.getTransmethod() != null)
				tableString.append(" transmethod=\"").append(colBean.getTransmethod()).append(SUF_MARK);
			if (colBean.getOtherpara() != null)
				tableString.append(" otherpara=\"").append(colBean.getOtherpara()).append(SUF_MARK);
			if (colBean.getIsHighlight() != null)
				tableString.append(" isHighlight=\"").append(colBean.getIsHighlight()).append(SUF_MARK);
			tableString.append("/>");
		}
		tableString.append("</head>");
		tableString.append("</table>");
		return tableString.toString();
	}

	public static void getTableString(Map<String, Object> apidatas, SplitTableBean splitTable) {
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, getTableString(splitTable));
		System.out.println(Util_TableMap.getVal(sessionkey));
		apidatas.put(BrowserConstant.BROWSER_RESULT_TYPE, BrowseDataType.LIST_SPLIT_DATA.getTypeid());
		apidatas.put(BrowserConstant.BROWSER_RESULT_DATA, sessionkey);
	}
}
