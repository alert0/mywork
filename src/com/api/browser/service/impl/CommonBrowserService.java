package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import weaver.general.StaticObj;
import weaver.general.Util;
import weaver.hrm.User;

import com.api.browser.bean.SplitTableBean;
import com.api.browser.bean.SplitTableColBean;
import com.api.browser.service.Browser;
import com.api.browser.service.BrowserService;
import com.api.browser.util.SplitTableUtil;

/**
 * 自定义单选
 * 
 * 根据datafrom 判断
 * 1： 则返回 sql 
 * 2： WebService
 * 3： 其他
 * 
 * 如果是datafrom 是数据源则拿到对应的SQL 
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
		if (fieldsize > 0) {
			String requestjson = requestToSpitParam1(params);
			int colwidth = 100 / (fieldsize);
			if (!from.equals("2")) {
				List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
				cols.add(new SplitTableColBean("true", "ids"));
				cols.add(new SplitTableColBean(colwidth + "%", Util.null2String(browser.getNameHeader()), "names", "names"));
				cols.add(new SplitTableColBean(colwidth + "%", Util.null2String(browser.getDescriptionHeader()), "descs", "descs"));
				SplitTableBean tableBean = new SplitTableBean(" * ", "temp", "", "id", "id", cols);
				tableBean.setDatasource("weaver.interfaces.workflow.browser.BaseBrowserDataSource.getDataResourceList3");
				tableBean.setSourceparams(Util.toHtmlForSplitPage(requestjson));
				SplitTableUtil.getTableString(apidatas, tableBean);
			} else {
				Set keyset = showfieldMap.keySet();
				List<SplitTableColBean> cols = new ArrayList<SplitTableColBean>();
				cols.add(new SplitTableColBean("true", "ids"));
				for (Iterator it = keyset.iterator(); it.hasNext();) {
					String keyname = (String) it.next();
					String showname = Util.null2String((String) showfieldMap.get(keyname));
					if ("".equals(showname))
						continue;
					cols.add(new SplitTableColBean(colwidth + "%", Util.null2String(showname), keyname + "s", keyname + "s"));
				}

				SplitTableBean tableBean = new SplitTableBean(" * ", "temp", "", "id", "id", cols);
				tableBean.setDatasource("weaver.interfaces.workflow.browser.BaseBrowserDataSource.getDataResourceList3");
				tableBean.setSourceparams(Util.toHtmlForSplitPage(requestjson));
				SplitTableUtil.getTableString(apidatas, tableBean);
			}
		}
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
