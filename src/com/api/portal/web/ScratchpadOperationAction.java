package com.api.portal.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import weaver.general.Util;
import weaver.page.interfaces.element.scratchpad.ScratchpadOperationInterface;
import weaver.page.interfaces.element.scratchpad.impl.ScratchpadOperationImpl;
/**
 * @Comment : 便签元素保存Action
 * @author : qingsg
 * @date : 2017年4月12日
 * @version 1.0
 */
@Path("/portal/scratchpad")
public class ScratchpadOperationAction {

	@POST
	@Path("/saveScratchpad")
	@Produces(MediaType.TEXT_PLAIN)
	public String getSaveScratchpadJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		request.setCharacterEncoding("UTF-8");
		int paduserid = Util.getIntValue(request.getParameter("userid"));
		String padcontent = Util.null2String(request.getParameter("padcontent"));
		String operation = Util.null2String(request.getParameter("operation"));
		String eid = Util.null2String(request.getParameter("eid"));
		ScratchpadOperationInterface soi = new ScratchpadOperationImpl();
		return soi.saveScratchpad(eid, paduserid, operation, padcontent);
	}


}
