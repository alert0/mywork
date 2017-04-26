package com.api.portal.web;

import java.util.ArrayList;
import java.util.Iterator;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import weaver.common.DateUtil;
import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.settings.RemindSettings;

/**
 * @Comment :
 * @author : qingsg
 * @date : 2017年3月29日
 * @version 1.0
 */
@Path("/portal/plugin")
public class PluginAction {
	@POST
	@Path("/pluginmanage")
	@Produces(MediaType.TEXT_PLAIN)
	public String getPluginManageJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		JSONObject pluginObject = new JSONObject();
		JSONArray pluginJSArray = new JSONArray();
		JSONArray pluginCSSArray = new JSONArray();

		RecordSet rs = new RecordSet();
		rs.execute("select * from hppluginsetting where isuse=1 order by ordernum");
		while (rs.next()) {
			String filepath = rs.getString("filepath");
			String[] arr = filepath.split(",");
			for (String temp : arr) {
				temp = temp.trim();
				if (!"".equals(temp)) {
					if (temp.endsWith(".js")) {
						pluginJSArray.add(temp);
					} else if (temp.endsWith(".css")) {
						pluginCSSArray.add(temp);
					}
				}
			}
		}

		pluginObject.put("pluginJS", pluginJSArray);
		pluginObject.put("pluginCSS", pluginCSSArray);

		return pluginObject.toString();
	}

	@POST
	@Path("/birthdayinfo")
	@Produces(MediaType.TEXT_PLAIN)
	public String getBirthDayInfoJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		JSONArray jsonArr = new JSONArray();
		JSONObject jsonObj = new JSONObject();

		ServletContext application = request.getSession().getServletContext();
		ArrayList<String[]> birthEmployers = (ArrayList<String[]>) application.getAttribute("birthEmployers");
		RemindSettings settings = (RemindSettings) application.getAttribute("hrmsettings");// 生日提醒参数
		int birthdialogstyle = Util.getIntValue(settings.getBirthdialogstyle(), 1);// 弹窗样式
		String birthshowfield = settings.getBirthshowfield();// 显示字段
		String congratulation = Util.stringReplace4DocDspExt(settings.getCongratulation());
		String birthshowfieldcolor = "";// Util.null2String(settings.getBirthshowfieldcolor(),"");//字段颜色
		String birthshowcontentcolor = "";// Util.null2String(settings.getBirthshowcontentcolor(),"");//提醒内容颜色
		if ("".equals(birthshowfieldcolor)) {
			birthshowfieldcolor = "3b486d";
		}
		if ("".equals(birthshowcontentcolor)) {
			birthshowcontentcolor = "3b486d";
		}
		String url = "/images_face/ecologyFace_1/BirthdayFace/1/BirthdayBg_3_wev8.jpg";
		int rowIndex = 0;
		RecordSet rs = new RecordSet();
		rs.executeSql("select docid,docname from HrmResourcefile where resourceid='0' and scopeId ='-99' and fieldid='-99' order by id");
		while (rs.next()) {
			rowIndex++;
			if (birthdialogstyle == rowIndex) {
				url = "/weaver/weaver.file.FileDownload?fileid=" + Util.null2String(rs.getString("docid"));
			}
		}

		if (birthEmployers != null) {
			Iterator<String[]> iter = birthEmployers.iterator();
			String[] empInfo = null;
			String[] deptinfo = null;
			while (iter.hasNext()) {
				empInfo = iter.next();
				deptinfo = new String[empInfo.length];
				String comInfo = "";
				String nameInfo = "";
				for (int i = 1; empInfo != null && i < empInfo.length; i++) {
					if (Util.null2String(empInfo[i]).length() == 0)
						continue;
					if (birthshowfield.indexOf("3") == -1 && i == 1)
						continue;// 分部
					if (birthshowfield.indexOf("2") == -1 && i == 2)
						continue;// 部门
					if (comInfo.length() > 0)
						comInfo += "-";
					comInfo += empInfo[i];
					deptinfo[i] = empInfo[i];
				}

				if (comInfo.length() > 0) {
					if (birthshowfield.indexOf("3") != -1 && birthshowfield.indexOf("2") != -1) {
						comInfo = deptinfo[2] + "-" + deptinfo[1];
					} else if (birthshowfield.indexOf("3") != -1) {
						comInfo = deptinfo[1];
					} else if (birthshowfield.indexOf("2") != -1) {
						comInfo = deptinfo[2];
					}
				}
				nameInfo = empInfo[0];
				JSONObject tmp = new JSONObject();
				tmp.put("lastname", nameInfo);
				tmp.put("detialInfo", comInfo);
				jsonArr.add(tmp);
			}
		}

		jsonObj.put("bgimg", url);
		jsonObj.put("curdate", DateUtil.getCurrentDate());
		jsonObj.put("congratulation", congratulation);
		jsonObj.put("textcolor", birthshowfieldcolor);
		jsonObj.put("usercolor", birthshowcontentcolor);
		jsonObj.put("userlist", jsonArr.toString());
		return jsonObj.toString();
	}
}
