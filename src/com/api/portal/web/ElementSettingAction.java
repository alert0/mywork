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

import net.sf.json.JSONObject;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.page.interfaces.ElementSettingInterface;
import weaver.page.interfaces.commons.PageInterfaceFactory;
/**
 * @Comment : 
 * @author : qingsg
 * @date : 2017年4月6日
 * @version 1.0
 */
@Path("/portal/setting")
public class ElementSettingAction {
	private ElementSettingInterface esi = new PageInterfaceFactory<ElementSettingInterface>().getImplementByInterface(ElementSettingInterface.class.getName());
	@POST
	@Path("/esetting")
	@Produces(MediaType.TEXT_PLAIN)
	public String getElementSettingJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return esi.getElementSettingJson(request, response);
	}
	@POST
	@Path("/saveSetting")
	@Produces(MediaType.TEXT_PLAIN)
	public String saveElementSettingJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		User user = HrmUserVarify.getUser (request , response);
		Map<String,Object> map = new HashMap<String,Object>();
		JSONObject jsonObj = JSONObject.fromObject(request.getParameter("jsonStr"));
		map.put("user", user);
		map.put("json", jsonObj);
		return JSONObject.fromObject(esi.saveElementSetting(map)).toString();
	}
}
