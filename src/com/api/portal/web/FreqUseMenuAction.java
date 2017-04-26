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
import weaver.page.interfaces.CommonMenuInterface;
import weaver.page.interfaces.commons.PageInterfaceFactory;

/**
 * @Comment :
 * @author : qingsg
 * @date : 2017年3月10日
 * @version 1.0
 */
@Path("/portal/frequsemenu")
public class FreqUseMenuAction {
	@POST
	@Path("/frequsemenu")
	@Produces(MediaType.TEXT_PLAIN)
	public String getFreqUseMenuJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		User user = HrmUserVarify.getUser(request, response);

		// 是否返回没有连接的菜单，默认是
		String shownourlmenu = Util.null2String(request.getParameter("shownourlmenu"), "y");
		
		String outStr = "{}";
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("user", user);
		param.put("shownourlmenu", shownourlmenu);
		CommonMenuInterface si = new PageInterfaceFactory<CommonMenuInterface>().getImplementByInterface(CommonMenuInterface.class.getName());
		outStr = si.getCommonMenuJson(param);
		return outStr;
	}
}
