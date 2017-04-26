package com.api.portal.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;

import weaver.file.Prop;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.license.PluginUserCheck;
import weaver.rdeploy.portal.PortalUtil;
import weaver.rtx.RTXClientCom;
import weaver.rtx.RTXConfig;
import weaver.systeminfo.SystemEnv;

/**
 * @Comment :
 * @author : qingsg
 * @date : 2017年3月10日
 * @version 1.0
 */
@Path("/portal/toolbar")
public class ToolbarAction {
	@POST
	@Path("/toolbarmenu")
	@Produces(MediaType.TEXT_PLAIN)
	public String getToolbarMenuJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		User user = HrmUserVarify.getUser(request, response);
		String userid = "" + user.getUID();

		List<Map<String, Object>> iconList = new ArrayList<Map<String, Object>>();

		String isIE = (String) request.getSession(true).getAttribute("browser_isie");
		if (isIE == null || "".equals(isIE)) {
			isIE = "true";
			request.getSession(true).setAttribute("browser_isie", "true");
		}

		RTXClientCom rtxClient = new RTXClientCom();
		PluginUserCheck puc = new PluginUserCheck();

		// Message
		boolean canMessager = false;
		boolean isHaveEMessager = Prop.getPropValue("Messager2", "IsUseEMessager").equalsIgnoreCase("1");
		boolean isHaveMessager = Prop.getPropValue("Messager", "IsUseWeaverMessager").equalsIgnoreCase("1");
		int isHaveMessagerRight = puc.checkPluginUserRight("messager", userid);
		if ((isHaveMessager && user.getUID() != 1 && isHaveMessagerRight == 1) || isHaveEMessager) {
			canMessager = true;
		}
		// Mobile
		boolean havaMobile = false;
		if (Prop.getPropValue("EMobile4", "serverUrl") != null && !Prop.getPropValue("EMobile4", "serverUrl").equals("")) {
			havaMobile = true;
		}
		boolean showDownload = Prop.getPropValue("EMobileDownload", "showDownload").equalsIgnoreCase("1");
		String version = Prop.getPropValue("EMobileVersion", "version");
		// Mobile
		Map<String, Object> item = null;
		/*---------正式系统产品建议-start-------*/
		item = new HashMap<String, Object>();
		item.put("url", "/formmode/view/AddFormMode.jsp?mainid=0&modeId=125&formId=-290&type=1");
		item.put("key", "suggest");
		item.put("opentype", "0");
		item.put("isShowName", "1");
		item.put("img", "/wui/theme/ecology8/page/images/sus_wev8.png");
		item.put("name", "产品建议");
		iconList.add(item);
		/*---------正式系统产品建议-end-------*/
		// 0:新建页;1:弹出页;2:当前页
		if (PortalUtil.isShowToMsgPage()) {
			item = new HashMap<String, Object>();
			item.put("url", "/rdeploy/chatproject/main.jsp");
			item.put("key", "chatproject");
			item.put("opentype", "2");
			item.put("name", SystemEnv.getHtmlLabelName(127956, user.getLanguage()));
			iconList.add(item);
		}
		if (showDownload && havaMobile) {
			item = new HashMap<String, Object>();
			item.put("url", "http://emobile.weaver.com.cn/customerproduce.do?serverVersion=" + version);
			item.put("key", "emobile");
			item.put("opentype", "0");
			item.put("name", "E-Mobile");
			iconList.add(item);
		}
		// emessage
		if (canMessager) {
			item = new HashMap<String, Object>();
			item.put("url", "/messager/installm3/emessageproduce.jsp");
			item.put("key", "emessage");
			item.put("opentype", "0");
			item.put("name", "E-Message");
			iconList.add(item);
		}
		item = new HashMap<String, Object>();
		item.put("url", "/favourite/MyFavourite.jsp");
		item.put("key", "fav");
		item.put("opentype", "1");
		item.put("name", SystemEnv.getHtmlLabelName(2081, user.getLanguage()));
		iconList.add(item);

		if (rtxClient.isValidOfRTX()) {
			RTXConfig rtxConfig = new RTXConfig();
			String RtxOrElinkType = (Util.null2String(rtxConfig.getPorp(RTXConfig.RtxOrElinkType))).toUpperCase();
			String eLinkUrl = "/EimClientOpen.jsp", rtxUrl = "/RTXClientOpen.jsp?notify=true";
			if (!isIE.equalsIgnoreCase("true")) {
				eLinkUrl = "/wui/common/page/sysRemind.jsp?labelid=27463";
				rtxUrl = "/wui/common/page/sysRemind.jsp?labelid=83530";
			}
			if ("ELINK".equals(RtxOrElinkType)) {
				item = new HashMap<String, Object>();
				item.put("url", eLinkUrl);
				item.put("key", "elink");
				item.put("opentype", "2");
				item.put("name", SystemEnv.getHtmlLabelName(27463, user.getLanguage()));
				iconList.add(item);
			} else {
				item = new HashMap<String, Object>();
				item.put("url", rtxUrl);
				item.put("key", "rtx");
				item.put("opentype", "2");
				item.put("name", SystemEnv.getHtmlLabelName(83530, user.getLanguage()));
				iconList.add(item);
			}
		}

		JSONArray obj = new JSONArray(iconList);
		return obj.toString();
	}
}
