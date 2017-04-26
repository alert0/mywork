package com.api.portal.web;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

/**
 * @Comment :
 * @author : qingsg
 * @date : 2017年3月10日
 * @version 1.0
 */
@Path("/portal/login")
public class LoginInfoAction {
	@POST
	@Path("/logininfo")
	@Produces(MediaType.TEXT_PLAIN)
	public String getLoginInfoJson(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		String method = request.getParameter("method");

		if ("qrcode".equals(method)) {
			String qrcode = UUID.randomUUID().toString();
			return "{\"qrcode\":\"" + qrcode + "\"}";
		} else if ("preload".equals(method)) {
			String formLeft = "50%";
			String formTop = "20%";
			String logoLeft = "20%";
			String logoTop = "30%";
			String isCombine = "1";
			String logoSrc = "/wui/theme/ecology9/image/e9.png";
			String[] bgArray = { "/wui/theme/ecology9/image/bg1.jpg", "/wui/theme/ecology9/image/bg2.jpg", "/wui/theme/ecology9/image/bg3.jpg", "/wui/theme/ecology9/image/bg4.jpg", "/wui/theme/ecology9/image/bg5.jpg" };

			Map<String, Object> param = new HashMap<String, Object>();
			param.put("formLeft", formLeft);
			param.put("formTop", formTop);
			param.put("logoLeft", logoLeft);
			param.put("logoTop", logoTop);
			param.put("isCombine", isCombine);
			param.put("logoSrc", logoSrc);
			param.put("bgsrc", bgArray);
			JSONObject obj = new JSONObject(param);
			return obj.toString();
		}

		return "{}";
	}
}
