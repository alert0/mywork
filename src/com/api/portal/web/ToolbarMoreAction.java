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
import weaver.page.interfaces.ToolbarMoreMenuInterface;
import weaver.page.interfaces.commons.PageInterfaceFactory;

/**
 * @Comment :
 * @author : qingsg
 * @date : 2017年3月10日
 * @version 1.0
 */
@Path("/portal/toolbarmore")
public class ToolbarMoreAction {
	@POST
	@Path("/toolbarmoremenu")
	@Produces(MediaType.TEXT_PLAIN)
	public String getToolbarMoreMenuJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		User user = HrmUserVarify.getUser(request, response);

		String menutype = Util.null2String(request.getParameter("menutype"), "all"); // front|back|all

		String outStr = "{}";
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("user", user);
		param.put("menutype", menutype);
		ToolbarMoreMenuInterface si = new PageInterfaceFactory<ToolbarMoreMenuInterface>().getImplementByInterface(ToolbarMoreMenuInterface.class.getName());
		outStr = si.getToolbarMoreMenuJson(param);
		return outStr;
	}
}
