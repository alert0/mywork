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
import weaver.hrm.User;
import weaver.page.interfaces.UserInterface;
import weaver.page.interfaces.commons.PageInterfaceFactory;

/**
 * @Comment : 
 * @author : qingsg
 * @date : 2017年4月10日
 * @version 1.0
 */
@Path("/portal/user")
public class UserAction {
	@POST
	@Path("/userinfo")
	@Produces(MediaType.TEXT_PLAIN)
	public String getUserDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		User user = (User)request.getSession(true).getAttribute("weaver_user@bean") ;
		String userId = request.getParameter("userid");
		
		String jsonStr = "{}";
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("user", user);
		param.put("userid", userId);
		UserInterface si=  new PageInterfaceFactory<UserInterface>().getImplementByInterface(UserInterface.class.getName());
		jsonStr = si.getUserJson(param);
		return jsonStr;
	}
}
