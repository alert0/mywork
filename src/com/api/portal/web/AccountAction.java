package com.api.portal.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import weaver.general.BaseBean;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.company.DepartmentComInfo;
import weaver.hrm.company.SubCompanyComInfo;
import weaver.hrm.job.JobTitlesComInfo;
import weaver.hrm.resource.ResourceComInfo;
import weaver.login.Account;

/**
 * @Comment :
 * @author : qingsg
 * @date : 2017年3月10日
 * @version 1.0
 */
@Path("/portal/account")
public class AccountAction extends BaseBean {
	@POST
	@Path("/accountlist")
	@Produces(MediaType.TEXT_PLAIN)
	public String getAccountListJson(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		try {
			ResourceComInfo rci = new ResourceComInfo();
			SubCompanyComInfo scci = new SubCompanyComInfo();
			DepartmentComInfo dci = new DepartmentComInfo();
			JobTitlesComInfo jtci = new JobTitlesComInfo();

			User user = HrmUserVarify.getUser(request, response);

			List<Map<String, Object>> userList = new ArrayList<Map<String, Object>>();

			if (weaver.general.GCONST.getMOREACCOUNTLANDING()) {
				List<Map<String, Object>> accounts = (List<Map<String, Object>>) request.getSession().getAttribute("accounts");
				if (accounts != null && accounts.size() > 1) {
					Iterator<Map<String, Object>> iter = accounts.iterator();
					while (iter.hasNext()) {
						Account a = (Account) iter.next();
						Map<String, Object> line = new HashMap<String, Object>();
						line.put("userid", "" + a.getId());
						line.put("icon", rci.getMessagerUrls("" + a.getId()));
						line.put("username", rci.getResourcename("" + a.getId()));
						line.put("jobs", jtci.getJobTitlesname("" + a.getJobtitleid()));
						line.put("subcompanyid", a.getSubcompanyid());
						line.put("deptid", a.getDepartmentid());
						line.put("subcompanyname", scci.getSubCompanyname("" + a.getSubcompanyid()));
						line.put("deptname", dci.getDepartmentname("" + a.getDepartmentid()));
						line.put("iscurrent", user.getUID() == a.getId() ? "1" : "0");
						userList.add(line);
					}
				}
			}

			if (userList.size() == 0) {
				Map<String, Object> line = new HashMap<String, Object>();
				line.put("userid", "" + user.getUID());
				line.put("icon", rci.getMessagerUrls("" + user.getUID()));
				line.put("username", rci.getResourcename("" + user.getUID()));
				line.put("jobs", jtci.getJobTitlesname(user.getJobtitle()));
				line.put("subcompanyid", user.getUserSubCompany1());
				line.put("deptid", user.getUserDepartment());
				line.put("subcompanyname", scci.getSubCompanyname("" + user.getUserSubCompany1()));
				line.put("deptname", dci.getDepartmentname("" + user.getUserDepartment()));
				line.put("iscurrent", "1");
				userList.add(line);
			}

			Map<String, Object> userInfo = new HashMap<String, Object>();
			userInfo.put("userid", "" + user.getUID());
			userInfo.put("icon", rci.getMessagerUrls("" + user.getUID()));
			userInfo.put("username", rci.getResourcename("" + user.getUID()));
			userInfo.put("jobs", jtci.getJobTitlesname(user.getJobtitle()));
			userInfo.put("subcompanyid", user.getUserSubCompany1());
			userInfo.put("deptid", user.getUserDepartment());
			userInfo.put("subcompanyname", scci.getSubCompanyname("" + user.getUserSubCompany1()));
			userInfo.put("deptname", dci.getDepartmentname("" + user.getUserDepartment()));
			userInfo.put("iscurrent", "1");
			userInfo.put("accountlist", userList);

			JSONObject obj = new JSONObject(userInfo);
			return obj.toString();
		} catch (Exception e) {
			writeLog("com.api.portal.web.AccountAction : ", e);

			return "{}";
		}
	}
}
