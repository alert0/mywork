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

import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.page.interfaces.PortalMenuInterface;
import weaver.page.interfaces.commons.PageInterfaceFactory;

/**
 * @Comment :
 * @author : qingsg
 * @date : 2017年3月10日
 * @version 1.0
 */
@Path("/portal/portalmenu")
public class PortalMenuAction {
	@POST
	@Path("/portalmenu")
	@Produces(MediaType.TEXT_PLAIN)
	public String getPortalMenuJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		User user = HrmUserVarify.getUser(request, response);

		int parentid = Util.getIntValue(request.getParameter("parentid"), 0);
		boolean needChild = !"0".equals(Util.null2String(request.getParameter("needchild"), "1"));

		String outStr = "{}";
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("user", user);
		param.put("parenthpid", parentid);
		param.put("needChild", needChild);
		PortalMenuInterface pi = new PageInterfaceFactory<PortalMenuInterface>().getImplementByInterface(PortalMenuInterface.class.getName());
		outStr = pi.getPortalMenuJson(param);
		return outStr;
	}
}
