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
import weaver.page.interfaces.QuickSearchItemsInterface;
import weaver.page.interfaces.commons.PageInterfaceFactory;

/**
 * @Comment :
 * @author : qingsg
 * @date : 2017年3月10日
 * @version 1.0
 */
@Path("/portal/quicksearch")
public class QuickSearchAction {
	@POST
	@Path("/quicksearchtypes")
	@Produces(MediaType.TEXT_PLAIN)
	public String getQuickSearchTypesJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		User user = HrmUserVarify.getUser(request, response);

		String removeIds = Util.null2String(request.getParameter("removeids"));

		String outStr = "{}";
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("user", user);
		param.put("removeids", removeIds);
		QuickSearchItemsInterface qi = new PageInterfaceFactory<QuickSearchItemsInterface>().getImplementByInterface(QuickSearchItemsInterface.class.getName());
		outStr = qi.getQuickSearchMenuJson(param);
		return outStr;
	}
}
