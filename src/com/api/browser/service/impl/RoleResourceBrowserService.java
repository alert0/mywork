package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import org.json.JSONArray;

import weaver.conn.RecordSet;
import weaver.general.SplitPageParaBean;
import weaver.general.SplitPageUtil;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.hrm.common.Tools;
import weaver.hrm.company.DepartmentComInfo;
import weaver.hrm.company.SubCompanyComInfo;
import weaver.hrm.resource.ResourceComInfo;

import com.api.browser.service.BrowserService;
import com.api.browser.util.SqlUtils;

/**
 * 	
 * 
 * @author jhy Apr 5, 2017
 * 
 */
public class RoleResourceBrowserService extends BrowserService {

	/**
	 * params 
	 * src 
	 * currentPage
	 * pageSize
	 * roleid 
	 */
	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		RecordSet rs = new RecordSet();
		ResourceComInfo resourceComInfo = new ResourceComInfo();
		DepartmentComInfo deptComInfo = new DepartmentComInfo();
		SubCompanyComInfo subCompanyComInfo = new SubCompanyComInfo();
		String src = Util.null2String(params.get("src"));
		String isNoAccount = Util.null2String(params.get("isNoAccount"));
		String check_per = Util.null2String(params.get("selectids"));
		if (check_per.trim().startsWith(",")) {
			check_per = check_per.substring(1);
		}
		String roleids = Tools.getURLDecode(Util.null2String(params.get("roleid")));
		String[] resourcroles = roleids.split("_");
		check_per = "";
		String roleid = "0";
		if (resourcroles.length > 0)
			roleid = "" + resourcroles[0];
		if (resourcroles.length == 2) {
			check_per = Util.null2String("" + resourcroles[1]);
		}
		StringTokenizer st = new StringTokenizer(check_per, ",");
		int perpage = Util.getIntValue(Util.null2String(params.get("pageSize")), 10);
		int pagenum = Util.getIntValue(Util.null2String(params.get("currentPage")), 1);

		List<Map<String,Object>> datas  =  new ArrayList<Map<String,Object>>();
		Map<String,Object> linedata = null;
		if (src.equalsIgnoreCase("dest")) {// 右侧已选择列表的sql条件
			String id = null;
			if (st != null) {
				while (st.hasMoreTokens()) {
					linedata =  new HashMap<String,Object>();
					id = st.nextToken();
					String departmentname = deptComInfo.getDepartmentname(resourceComInfo.getDepartmentID(id));
					String subcompanyname = subCompanyComInfo.getSubCompanyname(resourceComInfo.getSubCompanyID(id));

					linedata.put("id", id);
					linedata.put("lastname", resourceComInfo.getLastname(id));
					linedata.put("departmentname", departmentname);
					linedata.put("subcompanyname", subcompanyname);
					datas.add(linedata);
				}
			}
			apidatas.put("currentPage", 1);
			apidatas.put("totalPage", 1);
			apidatas.put("datas", datas);
		} else {// 左侧待选择列表的sql条件
			String lastname = Tools.getURLDecode(Util.null2String(params.get("lastname")));
			int uid = user.getUID();
			int index = roleid.indexOf("a");
			int rolelevel = 0;
			if (index > -1) {
				int roledid_tmp = Util.getIntValue(roleid.substring(0, index), 0);
				String rolelevelStr = roleid.substring(index + 1);

				roleid = "" + roledid_tmp;
				index = rolelevelStr.indexOf("b");
				if (index > -1) {
					rolelevel = Util.getIntValue(rolelevelStr.substring(0, index), 0);
					uid = Util.getIntValue(rolelevelStr.substring(index + 1), 0);
					if (uid <= 0) {
						uid = user.getUID();
					}
				} else {
					rolelevel = Util.getIntValue(rolelevelStr);
				}
			}
			String sqlWhere = "";
			if (!roleid.equals("")) {
				sqlWhere += " and a.ID in (select t1.ResourceID from hrmrolemembers t1,hrmroles t2 where t1.roleid = t2.ID and t2.ID in (" + roleid + ")) ";
			}
			String sqlAdd = "";
			if (rolelevel != 0) {
				if (rolelevel == 1) {
					int subcomid = Util.getIntValue(resourceComInfo.getSubCompanyID("" + uid), 0);
					sqlWhere += " and a.subcompanyid1=" + subcomid + " ";
				} else if (rolelevel == 2) {
					int subcomid = Util.getIntValue(resourceComInfo.getSubCompanyID("" + uid), 0);
					int supsubcomid = Util.getIntValue(subCompanyComInfo.getSupsubcomid("" + subcomid), 0);
					sqlWhere += " and a.subcompanyid1=" + supsubcomid + " ";
				} else if (rolelevel == 3) {
					int departid = Util.getIntValue(resourceComInfo.getDepartmentID("" + uid), 0);
					sqlWhere += " and a.departmentid=" + departid + " ";
				}
			}

			String excludeId = Util.null2String(params.get("excludeId"));
			if (excludeId.length() == 0)
				excludeId = check_per;
			if (excludeId.length() > 0) {
				sqlWhere += " and a.id not in (" + excludeId + ")";
			}

			if (lastname.length() > 0) {
				sqlWhere += " and a.lastname like '%" + Util.fromScreen2(lastname, user.getLanguage()) + "%' ";
			}
			sqlWhere = SqlUtils.replaceFirstAnd(sqlWhere);
			
			SplitPageParaBean spp = new SplitPageParaBean();
			spp.setBackFields(" a.id,a.lastname,a.departmentid,a.subcompanyid1,a.jobtitle,a.dsporder ");
			spp.setSqlFrom(" from HrmResource a ");
			spp.setSqlWhere(sqlWhere);
			spp.setSqlOrderBy("a.dsporder,a.lastname");
			spp.setPrimaryKey("a.id");
			spp.setDistinct(true);
			spp.setSortWay(spp.ASC);
			SplitPageUtil spu = new SplitPageUtil();
			spu.setSpp(spp);

			int RecordSetCounts = spu.getRecordCount();
			int totalPage = RecordSetCounts / perpage;
			if (totalPage % perpage > 0 || totalPage == 0) {
				totalPage++;
			}
			rs = spu.getCurrentPageRs(pagenum, perpage);

			JSONArray jsonArr = new JSONArray();
			while (rs.next()) {
				linedata =  new HashMap<String,Object>();
				String departmentname = deptComInfo.getDepartmentName(rs.getString("departmentid"));
				String subcompanyname = subCompanyComInfo.getSubCompanyname(rs.getString("subcompanyid1"));

				linedata.put("id", rs.getString("id"));
				linedata.put("lastname", rs.getString("lastname"));
				linedata.put("departmentname", departmentname);
				linedata.put("subcompanyname", subcompanyname);
				datas.add(linedata);
			}
			apidatas.put("currentPage", pagenum);
			apidatas.put("totalPage", totalPage);
			apidatas.put("datas", datas);
		}
		return apidatas;
	}
}
