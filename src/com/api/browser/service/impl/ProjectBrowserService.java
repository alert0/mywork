package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import weaver.conn.RecordSet;
import weaver.cpt.util.CommonShareManager;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;

/**
 * 项目浏览框接口
 * 
 * @author wuser0326
 * 
 */
public class ProjectBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception{
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");

		String check_per = Util.null2String(params.get("systemIds"));
		String resourceids = Util.null2String(params.get("resourceids"));

		if (check_per.trim().startsWith(",")) {
			check_per = check_per.substring(1);
		}

		String name = Util.null2String(params.get("name"));
		String from = Util.null2String(params.get("from"));
		String description = Util.null2String(params.get("description"));
		String prjtype = Util.null2String(params.get("prjtype"));
		String worktype = Util.null2String(params.get("worktype"));
		String manager = Util.null2String(params.get("manager"));
		String status = Util.null2String(params.get("status"));
		String statusAll = Util.null2String(params.get("statusAll"));
		String sqlwhere = Util.null2String(params.get("sqlwhere"));

		RecordSet recordSet = new RecordSet();

		String resourcenames = "";
		if (!check_per.equals("")) {
			String strtmp = "select id,name from Prj_ProjectInfo  where id in (" + check_per + ")";
			recordSet.executeSql(strtmp);
			Hashtable<String, String> ht = new Hashtable<String, String>();
			while (recordSet.next()) {
				ht.put(Util.null2String(recordSet.getString("id")), Util.null2String(recordSet.getString("name")));
			}
			try {
				StringTokenizer st = new StringTokenizer(check_per, ",");
				while (st.hasMoreTokens()) {
					String s = st.nextToken();
					resourceids += "," + s;
					resourcenames += "," + ht.get(s).toString();
				}
			} catch (Exception e) {
				resourceids = "";
				resourcenames = "";
			}
		}

		if (!name.equals("")) {
			sqlwhere += " and t1.name like '%" + Util.fromScreen2(name, user.getLanguage()) + "%' ";
		}
		if (!description.equals("")) {
			sqlwhere += " and t1.description like '%" + Util.fromScreen2(description, user.getLanguage()) + "%' ";
		}
		if (!prjtype.equals("")) {
			sqlwhere += " and t1.prjtype = " + prjtype;
		}
		if (!worktype.equals("")) {
			sqlwhere += " and t1.worktype = " + worktype;
		}
		if (!manager.equals("")) {
			sqlwhere += " and t1.manager = " + manager;
		}
		if (!status.equals("")) {
			sqlwhere += " and t1.status =" + status + " ";
		}
		if (!statusAll.equals("")) {
			sqlwhere += " and t1.status in (" + statusAll + ") ";
		}

		String permissionSql = "";
		CommonShareManager csm = new CommonShareManager();
		if ("prjtskimp".equalsIgnoreCase(from)) {
			permissionSql = " (" + csm.getPrjShareWhereByUserCanEdit(user) + ") ";
		} else {
			permissionSql = " (" + csm.getPrjShareWhereByUser(user) + ") ";
		}

		if (!"".equals(permissionSql)) {
			sqlwhere += " and " + permissionSql;
		}
		String backfields = "t1.id, t1.name, t1.status,t1.prjtype,t1.worktype,t1.manager";
		String sqlfrom = "Prj_ProjectInfo t1 ";
		
		List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
		cols.add(new SplitTableColBean("true","id"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(195, user.getLanguage()),"name","name"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(586, user.getLanguage()),"prjtype","prjtype","weaver.proj.Maint.ProjectTypeComInfo.getProjectTypename"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(432, user.getLanguage()),"worktype","worktype","weaver.proj.Maint.ProjectTypeComInfo.getProjectTypename"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(144, user.getLanguage()),"manager","manager","weaver.hrm.resource.ResourceComInfo.getResourcename"));
		cols.add(new SplitTableColBean("20%",SystemEnv.getHtmlLabelName(587, user.getLanguage()),"status","status","weaver.proj.Maint.ProjectStatusComInfo.getProjectStatusdesc"));
		
		SplitTableBean tableBean  =  new SplitTableBean(backfields,sqlfrom,sqlwhere,"t1.id","t1.id",cols);
		tableBean.setSqlsortway("ASC");
		SplitTableUtil.getTableString(apidatas,tableBean);
		return apidatas;
	}
}
