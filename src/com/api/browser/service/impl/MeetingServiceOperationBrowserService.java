package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.general.Util;

import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;

/**
 * 服务项目
 * 
 * @author jhy Mar 29, 2017
 * 
 */
public class MeetingServiceOperationBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		String method = Util.null2String(params.get("method"));
		String systemIds = Util.null2String(params.get("systemIds"));

		String sqlwhere = " ";

		if ("src".equals(method)) {
			String type = Util.null2String(params.get("type"));
			String itemname = Util.null2String(params.get("itemname"));
			if (!"".equals(systemIds)) {
				sqlwhere += " and s.id not in(" + systemIds + ")";
			}
			// 查询条件
			if (!type.equals("")) {
				sqlwhere += " and type = '" + type + "' ";
			}
			if (!itemname.equals("")) {
				sqlwhere += " and itemname like '%" + itemname + "%' ";
			}
		} else if ("dest".equals(method)) {
			sqlwhere += " and s.id in (" + systemIds + ")";
		}
		
		String backfields = "s.*,t.name";
		String fromSql = "Meeting_Service_Item s join Meeting_Service_Type t on s.type=t.id";
		String orderby = "s.id";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("false","id"));
		SplitTableColBean colbean1 = new SplitTableColBean("itemname");
		colbean1.setIsHighlight("true");
		cols.add(colbean1);
		
		SplitTableColBean colbean2 = new SplitTableColBean("itemname");
		colbean2.setIsHighlight("true");
		cols.add(colbean2);
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,fromSql,sqlwhere,orderby,"s.id",cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}

}
