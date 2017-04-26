package com.api.portal.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import weaver.page.interfaces.HomepageInterface;
import weaver.page.interfaces.commons.PageInterfaceFactory;

/**
 * @Comment : 
 * @author : qingsg
 * @date : 2017年3月7日
 * @version 1.0
 */
@Path("/portal/homepage")
public class HomepageAction {
	@POST
	@Path("/hpdata")
	@Produces(MediaType.TEXT_PLAIN)
	public String getHpDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		HomepageInterface hi=  new PageInterfaceFactory<HomepageInterface>().getImplementByInterface(HomepageInterface.class.getName());
		return hi.getHpAllElementJson(request,response);
	}
}
