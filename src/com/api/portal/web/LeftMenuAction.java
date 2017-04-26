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
import weaver.page.interfaces.SystemMenuInterface;
import weaver.page.interfaces.commons.PageInterfaceFactory;

/**
 * @Comment :
 * @author : qingsg
 * @date : 2017年3月10日
 * @version 1.0
 */
@Path("/portal/leftmenu")
public class LeftMenuAction {
	@POST
	@Path("/leftmenu")
	@Produces(MediaType.TEXT_PLAIN)
	public String getLeftMenuJson(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		User user = HrmUserVarify.getUser(request, response);

		int parentid = Util.getIntValue(request.getParameter("parentid"), 0);
		boolean needChild = !"0".equals(Util.null2String(request.getParameter("needchild"), "1"));
		boolean withPortal = !"0".equals(Util.null2String(request.getParameter("withportal"), "1"));
		// 是否根据点击数排序，默认为根据点击数排序
		boolean isSortByClick = !"0".equals(Util.null2String(request.getParameter("sortbyclick"), "1"));

		String outStr = "{}";
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("user", user);
		param.put("parentId", parentid);
		param.put("showAllSubMenu", needChild);
		param.put("sortByClick", isSortByClick);
		param.put("withPortal", withPortal);
		SystemMenuInterface si = new PageInterfaceFactory<SystemMenuInterface>().getImplementByInterface(SystemMenuInterface.class.getName());
		outStr = si.getFrontMenuPotalJson(param);
		return outStr;
	}
}
