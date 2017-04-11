package com.api.browser.service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.PageIdConst;
import weaver.general.StaticObj;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

/**
 * 自定义单选
 * 
 * @author jhy Apr 5, 2017
 * 
 */
public class CommonBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");

		String isreport = Util.null2String(Util.null2String(params.get("isreport")), "0");
		String name = Util.null2String(params.get("name"));
		String type = Util.null2String(params.get("type"));
		String workflowid = Util.null2String(Util.null2String(params.get("workflowid")), "-1");
		String currenttime = Util.null2String(params.get("currenttime"));
		String issearch = Util.null2String(params.get("issearch"));
		String othercallback = Util.null2String(params.get("othercallback"));

		String bts[] = type.split("\\|");
		String frombrowserid = "";
		type = bts[0];
		if (bts.length > 1) {
			frombrowserid = bts[1];
		}
		type = java.net.URLDecoder.decode(type);
		if (type.indexOf("browser.") == -1) {
			type = "browser." + type;
		}
		String userid = user.getUID() + "";
		weaver.interfaces.workflow.browser.Browser browser = (weaver.interfaces.workflow.browser.Browser) StaticObj.getServiceByFullname(type, Browser.class);
		String outpage = Util.null2String(browser.getOutPageURL());
		String href = Util.null2String(browser.getHref());
		href = Util.null2String(browser.getHref("" + userid, href));
		String from = Util.null2String(browser.getFrom());
		String showtree = Util.null2String(browser.getShowtree());
		if ("1".equals(showtree)) {
			return apidatas;
		}
		browser.initBaseBrowser("", type, from);

		Map showfieldMap = browser.getShowfieldMap();
		int fieldsize = 2;
		if ("2".equals(from)) {
			if (null != browser.getShowfieldMap()) {
				fieldsize = browser.getShowfieldMap().size();
			}
		}
		String PageConstId = PageIdConst.CommonBrowser + "_" + type;
		String tableString = "";
		if (fieldsize > 0) {
			String requestjson = requestToSpitParam1(params);
			int colwidth = 100 / (fieldsize);
			if (!from.equals("2")) {
				tableString = ""
						+ "<table instanceid=\"BrowseTable\" pageId=\"\" pagesize=\"10\"  datasource=\"weaver.interfaces.workflow.browser.BaseBrowserDataSource.getDataResourceList3\" sourceparams=\""
						+ Util.toHtmlForSplitPage(requestjson) + "\" tabletype=\"none\" pageBySelf=\"true\">"
						+ "<sql backfields=\"*\"  sqlform=\"temp\" sqlorderby=\"id\"  sqlprimarykey=\"id\" sqlsortway=\"desc\"  />" + "<head>";
				tableString += "<col width=\"0%\" hide=\"true\" text=\"" + SystemEnv.getHtmlLabelName(413, user.getLanguage()) + "\" column=\"ids\" orderkey=\"ids\"/>";
				tableString += "<col width=\"" + colwidth + "%\"  text=\"" + Util.null2String(browser.getNameHeader()) + "\" column=\"names\" orderkey=\"names\"/>";
				tableString += "<col width=\"" + colwidth + "%\"  text=\"" + Util.null2String(browser.getDescriptionHeader()) + "\" column=\"descs\" orderkey=\"descs\"/>" + "</head>" + "</table>";
			} else {
				Set keyset = showfieldMap.keySet();
				tableString = "<table instanceid=\"BrowseTable\" pageId=\"\" pagesize=\"" + PageIdConst.getPageSize(PageConstId, user.getUID(), PageIdConst.Browser)
						+ "\"  datasource=\"weaver.interfaces.workflow.browser.BaseBrowserDataSource.getDataResourceList3\" sourceparams=\"" + Util.toHtmlForSplitPage(requestjson)
						+ "\" tabletype=\"none\" pageBySelf=\"true\">" + "<sql backfields=\"*\"  sqlform=\"temp\" sqlorderby=\"id\"  sqlprimarykey=\"id\" sqlsortway=\"desc\"  />" + "<head>";
				tableString += "<col width=\"0%\" hide=\"true\" text=\"" + SystemEnv.getHtmlLabelName(413, user.getLanguage()) + "\" column=\"ids\" orderkey=\"ids\"/>";
				for (Iterator it = keyset.iterator(); it.hasNext();) {
					String keyname = (String) it.next();
					String showname = Util.null2String((String) showfieldMap.get(keyname));
					if ("".equals(showname))
						continue;
					tableString += "<col width=\"" + colwidth + "%\"  text=\"" + Util.null2String(showname) + "\" column=\"" + keyname + "s\" orderkey=\"" + keyname + "s\"/>";
				}
				tableString += "</head>" + "</table>";
			}
		}
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}

	public static String requestToSpitParam1(Map<String, Object> params) {
		StringBuffer sb = new StringBuffer();
		Iterator<String> it = params.keySet().iterator();
		while (it.hasNext()) {
			String paramname = it.next();
			if (!"".equals(paramname)) {
				String paramvalue = Util.null2String(params.get(paramname));
				paramvalue = paramvalue.replaceAll("[+]", "@#add#@");
				;// 字符串中包含特殊字符，处理为可用的。
				if (!paramname.equals("splitflag") && !paramname.equals("mouldID") && !paramname.equals("currenttime") && !paramname.equals("type") && !paramname.equals("workflowid")) {
					// paramvalue=AES.encrypt(paramvalue, "1");

				}
				if (!paramname.equals("requestjson")) {
					sb.append(("".equals(sb.toString())) ? (paramname + ":" + paramvalue) : ("+" + paramname + ":" + paramvalue));
				}
			}
		}
		return sb.toString();
	}

}
