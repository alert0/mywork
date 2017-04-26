package com.api.portal.web;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import weaver.conn.RecordSet;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;

/**
 * @Comment :
 * @author : qingsg
 * @date : 2017年3月10日
 * @version 1.0
 */
@Path("/portal/theme")
public class ThemeConfigAction {
	@POST
	@Path("/themeconfig")
	@Produces(MediaType.TEXT_PLAIN)
	public String getThemeConfigJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		User user = HrmUserVarify.getUser(request, response);
		String userid = "" + user.getUID();

		Map<String, Object> map = new HashMap<String, Object>();
		if (userid != null && userid != "") {
			RecordSet rs = new RecordSet();
			String sql = "select a.logo,b.logocolor,b.hrmcolor,b.leftcolor,b.topcolor from hrmusersetting c inner join (select * from systemtemplate where templatetype='ecology8') a on c.templateid=a.id inner join ecology8theme b on a.skin=b.id where c.resourceid=" + userid;
			rs.executeSql(sql);
			while (rs.next()) {
				map.put("logo", rs.getString("logo"));
				map.put("logocolor", rs.getString("logocolor"));
				map.put("hrmcolor", rs.getString("hrmcolor"));
				map.put("leftcolor", rs.getString("leftcolor"));
				map.put("topcolor", rs.getString("topcolor"));
			}
		}
		JSONObject obj = new JSONObject(map);
		return obj.toString();
	}
}
