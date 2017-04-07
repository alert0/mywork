package com.api.browser.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.api.browser.util.SqlUtils;

import weaver.conn.RecordSet;
import weaver.general.SplitPageParaBean;
import weaver.general.SplitPageUtil;
import weaver.general.Util;

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
		int perpage = Util.getIntValue(Util.null2String(params.get("pageSize")), 10);
		int pagenum = Util.getIntValue(Util.null2String(params.get("currentPage")), 1);

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
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		SplitPageParaBean spp = new SplitPageParaBean();
		spp.setBackFields("  s.*,t.name  ");
		spp.setSqlFrom("  Meeting_Service_Item s join Meeting_Service_Type t on s.type=t.id ");
		spp.setSqlWhere(sqlwhere);
		spp.setSqlOrderBy(" s.id ");
		spp.setPrimaryKey("s.id");
		spp.setDistinct(true);
		spp.setSortWay(spp.ASC);
		SplitPageUtil spu = new SplitPageUtil();
		spu.setSpp(spp);

		RecordSet rs = null;
		if ("src".equals(method)) {
			int RecordSetCounts = spu.getRecordCount();
			int totalPage = RecordSetCounts / perpage;
			if (totalPage % perpage > 0 || totalPage == 0) {
				totalPage++;
			}
			rs = spu.getCurrentPageRs(pagenum, perpage);
		}
		if ("dest".equals(method)) {
			rs = spu.getAllRs();
			pagenum = 1;
		}
		List<Map<String, Object>> datas = new ArrayList<Map<String, Object>>();
		if (rs != null) {
			Map<String, Object> operation = null;
			while (rs.next()) {
				operation = new HashMap<String, Object>();
				operation.put("id", rs.getString("id"));
				operation.put("itemname", rs.getString("itemname"));
				operation.put("name", rs.getString("name"));
				datas.add(operation);
			}
		}

		apidatas.put("datas", datas);
		apidatas.put("currentPage", pagenum);

		if ("dest".equals(method)) {
			apidatas.put("o", datas.size() > 0 ? 1 : 0);
		}
		return apidatas;
	}

}
