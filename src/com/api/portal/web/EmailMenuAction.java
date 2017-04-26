package com.api.portal.web;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import weaver.email.MailCommonMethod;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * @Comment :
 * @author : qingsg
 * @date : 2017年3月29日
 * @version 1.0
 */
@Path("/portal/emailmenu")
public class EmailMenuAction {
	@POST
	@Path("/emailmenu")
	@Produces(MediaType.TEXT_PLAIN)
	public String getEmailMenuJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		User user = HrmUserVarify.getUser(request, response);

		JSONArray emailArray = new JSONArray();
		MailCommonMethod mcm = new MailCommonMethod();
		// 顶部"我的邮件"菜单id
		String emailMenuId = "536";

		// 写信
		JSONObject writeObject = new JSONObject();
		writeObject.put("id", emailMenuId + "01");
		writeObject.put("parentId", emailMenuId);
		writeObject.put("levelid", emailMenuId + "01");
		writeObject.put("name", SystemEnv.getHtmlLabelName(30912, user.getLanguage()));
		writeObject.put("icon", "");
		writeObject.put("url", mcm.getMailAddUrl(""));
		writeObject.put("routeurl", "");
		// 内部邮件
		JSONArray writeChildArray = new JSONArray();
		JSONObject writeChildObject = new JSONObject();
		writeChildObject.put("id", emailMenuId + "0101");
		writeChildObject.put("parentId", emailMenuId + "01");
		writeChildObject.put("levelid", emailMenuId + "0101");
		writeChildObject.put("name", SystemEnv.getHtmlLabelName(24714, user.getLanguage()));
		writeChildObject.put("icon", "");
		writeChildObject.put("url", mcm.getMailAddUrl("1"));
		writeChildObject.put("routeurl", "");
		writeChildObject.put("child", new JSONArray());
		writeChildArray.add(writeChildObject);
		// 外部邮件
		writeChildObject.put("id", emailMenuId + "0102");
		writeChildObject.put("parentId", emailMenuId + "01");
		writeChildObject.put("levelid", emailMenuId + "0102");
		writeChildObject.put("name", SystemEnv.getHtmlLabelName(31139, user.getLanguage()));
		writeChildObject.put("icon", "");
		writeChildObject.put("url", mcm.getMailAddUrl("-1"));
		writeChildObject.put("routeurl", "");
		writeChildObject.put("child", new JSONArray());
		writeChildArray.add(writeChildObject);
		writeObject.put("child", writeChildArray);
		emailArray.add(writeObject);

		// 接收
		JSONObject receiveObject = new JSONObject();
		receiveObject.put("id", emailMenuId + "02");
		receiveObject.put("parentId", emailMenuId);
		receiveObject.put("levelid", emailMenuId + "02");
		receiveObject.put("name", SystemEnv.getHtmlLabelName(18526, user.getLanguage()));
		receiveObject.put("icon", "");
		receiveObject.put("url", "/email/new/MailInboxList.jsp?folderid=0&receivemail=true&receivemailid=0");
		receiveObject.put("routeurl", "");
		JSONArray receiveChildArray = new JSONArray();
		List receiveList = mcm.getMailAccountList(user);
		for (int i = 0; i < receiveList.size(); i++) {
			Map map = (Map) receiveList.get(i);
			JSONObject receiveChildObject = new JSONObject();
			receiveChildObject.put("id", emailMenuId + "02" + i);
			receiveChildObject.put("parentId", emailMenuId + "02");
			receiveChildObject.put("levelid", emailMenuId + "02" + i);
			receiveChildObject.put("name", (String) map.get("name"));
			receiveChildObject.put("icon", "");
			receiveChildObject.put("url", (String) map.get("url"));
			receiveChildObject.put("routeurl", "");
			receiveChildObject.put("child", new JSONArray());
			receiveChildArray.add(receiveChildObject);
		}
		receiveObject.put("child", receiveChildArray);
		emailArray.add(receiveObject);

		// --------------------------------------------------
		// 收件箱
		JSONObject inboxObject = new JSONObject();
		inboxObject.put("id", emailMenuId + "03");
		inboxObject.put("parentId", emailMenuId);
		inboxObject.put("levelid", emailMenuId + "03");
		inboxObject.put("name", SystemEnv.getHtmlLabelName(19816, user.getLanguage()));
		inboxObject.put("icon", "");
		inboxObject.put("url", "/email/new/MailInboxList.jsp?folderid=0&receivemail=true&receivemailid=0");
		inboxObject.put("routeurl", "");
		inboxObject.put("child", new JSONArray());
		inboxObject.put("count", mcm.getComnCount(user, "folderid=0"));
		inboxObject.put("countId", "unreadMailCount_id");
		emailArray.add(inboxObject);

		// 已发送
		JSONObject outboxObject = new JSONObject();
		outboxObject.put("id", emailMenuId + "04");
		outboxObject.put("parentId", emailMenuId);
		outboxObject.put("levelid", emailMenuId + "04");
		outboxObject.put("name", SystemEnv.getHtmlLabelName(19558, user.getLanguage()));
		outboxObject.put("icon", "");
		outboxObject.put("url", "/email/new/MailInboxList.jsp?folderid=-1");
		outboxObject.put("routeurl", "");
		outboxObject.put("child", new JSONArray());
		emailArray.add(outboxObject);

		// 草稿箱
		JSONObject drafboxObject = new JSONObject();
		drafboxObject.put("id", emailMenuId + "05");
		drafboxObject.put("parentId", emailMenuId);
		drafboxObject.put("levelid", emailMenuId + "05");
		drafboxObject.put("name", SystemEnv.getHtmlLabelName(2039, user.getLanguage()));
		drafboxObject.put("icon", "");
		drafboxObject.put("url", "/email/new/MailInboxList.jsp?folderid=-2");
		drafboxObject.put("routeurl", "");
		drafboxObject.put("child", new JSONArray());
		emailArray.add(drafboxObject);

		// 垃圾箱
		JSONObject delboxObject = new JSONObject();
		delboxObject.put("id", emailMenuId + "06");
		delboxObject.put("parentId", emailMenuId);
		delboxObject.put("levelid", emailMenuId + "06");
		delboxObject.put("name", SystemEnv.getHtmlLabelName(2040, user.getLanguage()));
		delboxObject.put("icon", "");
		delboxObject.put("url", "/email/new/MailInboxList.jsp?folderid=-3");
		delboxObject.put("routeurl", "");
		delboxObject.put("child", new JSONArray());
		delboxObject.put("titleUrlIcon", "/email/images/clear_wev8.png");
		emailArray.add(delboxObject);

		// 待办邮件
		JSONObject waitdealObject = new JSONObject();
		waitdealObject.put("id", emailMenuId + "07");
		waitdealObject.put("parentId", emailMenuId);
		waitdealObject.put("levelid", emailMenuId + "07");
		waitdealObject.put("name", SystemEnv.getHtmlLabelName(83090, user.getLanguage()));
		waitdealObject.put("icon", "");
		waitdealObject.put("url", "/email/new/MailInboxList.jsp?waitdeal=1");
		waitdealObject.put("routeurl", "");
		waitdealObject.put("child", new JSONArray());
		waitdealObject.put("count", mcm.getComnCount(user, "waitdeal=1"));
		waitdealObject.put("countId", "waitDealCount_id");
		emailArray.add(waitdealObject);

		// 内部邮件
		JSONObject internalObject = new JSONObject();
		internalObject.put("id", emailMenuId + "08");
		internalObject.put("parentId", emailMenuId);
		internalObject.put("levelid", emailMenuId + "08");
		internalObject.put("name", SystemEnv.getHtmlLabelName(24714, user.getLanguage()));
		internalObject.put("icon", "");
		internalObject.put("url", "/email/new/MailInboxList.jsp?isInternal=1");
		internalObject.put("routeurl", "");
		internalObject.put("child", new JSONArray());
		emailArray.add(internalObject);

		// 标星邮件
		JSONObject starObject = new JSONObject();
		starObject.put("id", emailMenuId + "09");
		starObject.put("parentId", emailMenuId);
		starObject.put("levelid", emailMenuId + "09");
		starObject.put("name", SystemEnv.getHtmlLabelName(81337, user.getLanguage()));
		starObject.put("icon", "");
		starObject.put("url", "/email/new/MailInboxList.jsp?star=1");
		starObject.put("routeurl", "");
		starObject.put("child", new JSONArray());
		emailArray.add(starObject);

		// --------------------------------------------------
		// 我的文件夹
		JSONObject folderObject = new JSONObject();
		folderObject.put("id", emailMenuId + "10");
		folderObject.put("parentId", emailMenuId);
		folderObject.put("levelid", emailMenuId + "10");
		folderObject.put("name", SystemEnv.getHtmlLabelName(81348, user.getLanguage()));
		folderObject.put("icon", "");
		folderObject.put("url", "");
		folderObject.put("routeurl", "");
		JSONArray folderChildArray = new JSONArray();
		List folderList = mcm.getMyFileList(user, "folderManage");
		for (int i = 0; i < folderList.size(); i++) {
			Map map = (Map) folderList.get(i);
			JSONObject folderChildObject = new JSONObject();
			folderChildObject.put("id", emailMenuId + "10" + i);
			folderChildObject.put("parentId", emailMenuId + "10");
			folderChildObject.put("levelid", emailMenuId + "10" + i);
			folderChildObject.put("name", (String) map.get("name"));
			folderChildObject.put("icon", "");
			folderChildObject.put("url", (String) map.get("url"));
			folderChildObject.put("routeurl", "");
			folderChildObject.put("child", new JSONArray());
			folderChildArray.add(folderChildObject);
		}
		folderObject.put("child", folderChildArray);
		folderObject.put("titleUrlIcon", "/email/images/manage_wev8.png");
		folderObject.put("titleUrl", mcm.getMailSettingUrl("folder"));
		folderObject.put("hasTopLine", "true");
		emailArray.add(folderObject);

		// 我的标签
		JSONObject tagObject = new JSONObject();
		tagObject.put("id", emailMenuId + "11");
		tagObject.put("parentId", emailMenuId);
		tagObject.put("levelid", emailMenuId + "11");
		tagObject.put("name", SystemEnv.getHtmlLabelName(81349, user.getLanguage()));
		tagObject.put("icon", "");
		tagObject.put("url", "");
		tagObject.put("routeurl", "");
		JSONArray tagChildArray = new JSONArray();
		List tagList = mcm.getMyFileList(user, "tagManage");
		for (int i = 0; i < tagList.size(); i++) {
			Map map = (Map) tagList.get(i);
			JSONObject tagChildObject = new JSONObject();
			tagChildObject.put("id", emailMenuId + "11" + i);
			tagChildObject.put("parentId", emailMenuId + "11");
			tagChildObject.put("levelid", emailMenuId + "11" + i);
			tagChildObject.put("name", (String) map.get("name"));
			tagChildObject.put("icon", "");
			tagChildObject.put("url", (String) map.get("url"));
			tagChildObject.put("routeurl", "");
			tagChildObject.put("child", new JSONArray());
			tagChildObject.put("tagColor", (String) map.get("color"));
			tagChildArray.add(tagChildObject);
		}
		tagObject.put("child", tagChildArray);
		tagObject.put("titleUrlIcon", "/email/images/manage_wev8.png");
		tagObject.put("titleUrl", mcm.getMailSettingUrl("label"));
		emailArray.add(tagObject);

		// --------------------------------------------------
		// 联系人
		JSONObject contactsObject = new JSONObject();
		contactsObject.put("id", emailMenuId + "12");
		contactsObject.put("parentId", emailMenuId);
		contactsObject.put("levelid", emailMenuId + "12");
		contactsObject.put("name", SystemEnv.getHtmlLabelName(572, user.getLanguage()));
		contactsObject.put("icon", "");
		contactsObject.put("url", "/email/new/Contacts.jsp");
		contactsObject.put("routeurl", "");
		contactsObject.put("child", new JSONArray());
		contactsObject.put("hasTopLine", "true");
		emailArray.add(contactsObject);

		// 附件中心
		JSONObject attachmentObject = new JSONObject();
		attachmentObject.put("id", emailMenuId + "13");
		attachmentObject.put("parentId", emailMenuId);
		attachmentObject.put("levelid", emailMenuId + "13");
		attachmentObject.put("name", SystemEnv.getHtmlLabelName(156, user.getLanguage()));
		attachmentObject.put("icon", "");
		attachmentObject.put("url", "/email/new/MailAttachmentTab.jsp");
		attachmentObject.put("routeurl", "");
		attachmentObject.put("child", new JSONArray());
		emailArray.add(attachmentObject);

		// --------------------------------------------------
		// 邮件设置
		JSONObject settingObject = new JSONObject();
		settingObject.put("id", emailMenuId + "14");
		settingObject.put("parentId", emailMenuId);
		settingObject.put("levelid", emailMenuId + "14");
		settingObject.put("name", SystemEnv.getHtmlLabelName(24751, user.getLanguage()));
		settingObject.put("icon", "");
		settingObject.put("url", "/email/new/MailSetting.jsp");
		settingObject.put("routeurl", "");
		settingObject.put("child", new JSONArray());
		settingObject.put("hasTopLine", "true");
		emailArray.add(settingObject);

		if (HrmUserVarify.checkUserRight("Email:monitor", user)) {
			// 邮件监控
			JSONObject monitorObject = new JSONObject();
			monitorObject.put("id", emailMenuId + "15");
			monitorObject.put("parentId", emailMenuId);
			monitorObject.put("levelid", emailMenuId + "15");
			monitorObject.put("name", SystemEnv.getHtmlLabelName(71, user.getLanguage()) + SystemEnv.getHtmlLabelName(665, user.getLanguage()));
			monitorObject.put("icon", "");
			monitorObject.put("url", "/email/new/MailMonitorFrame.jsp");
			monitorObject.put("routeurl", "");
			monitorObject.put("child", new JSONArray());
			emailArray.add(monitorObject);
		}

		return emailArray.toString();
	}
}
