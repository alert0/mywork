package com.api.portal.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import org.json.JSONObject;
import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.synergy.SynergyComInfo;
/**
 * @Comment : 
 * @author : qingsg
 * @date : 2017年3月10日
 * @version 1.0
 */
@Path("/portal/synergy")
public class SynergyInfoAction {
	@POST
	@Path("/synergyinfo")
	@Produces(MediaType.TEXT_PLAIN)
	public String getSynergyInfoJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		SynergyComInfo sc = new SynergyComInfo();
		RecordSet rs = new RecordSet();
		JSONObject loginCheckObject = new JSONObject();
		String _synergypath = Util.null2String(request.getParameter("path"));
		String _s_hpid = sc.isSynergyModule(_synergypath, request);
		
		int hpid = 0;
		boolean isuse = false;
		if (!"".equals(_s_hpid)) {
			hpid = -Util.getIntValue(_s_hpid);
			rs.execute("select * from synergyconfig where hpid=" + hpid);
			if (rs.next()) {
				if ("1".equals(rs.getString("isuse"))) {
					isuse = true;
				}
			}
		}
		loginCheckObject.put("hpid", hpid);
		loginCheckObject.put("isuse", isuse);
		return loginCheckObject.toString();
	}
}
