package com.api.workflow.util;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.User;

public class ServiceUtil {
	//private static Map<String,Boolean> spaconfig = new HashMap<String,Boolean>();
	
	/**
	 * 接口中文都需特殊字符转译，否则前端response.json()会报错
	 */
	public static String convertChar(String str){
		str = str.replace("\t", "");
		str = str.replace("\r", "");
		str = str.replace("\n", "");
		str = str.replace("\f", "");
		//str = str.replace("\\", "\\\\");
		return str;
	}
	
	/**
	 * String转Int，默认为0
	 */
	public static int convertInt(String str){
		return Util.getIntValue(str, 0);
	}
	
	/**
	 * 相关请求增加session信息
	 */
	public static void addRelatedWfSession(HttpServletRequest request, int requestid, String relatedrequestids) {
		HttpSession session = request.getSession();
		for(String relatedrequestid : relatedrequestids.split(",")){
			int tempnum = Util.getIntValue(String.valueOf(session.getAttribute("slinkwfnum")));
			tempnum++;
			session.setAttribute("resrequestid" + tempnum, relatedrequestid);
			session.setAttribute("slinkwfnum", "" + tempnum);
		}
		session.setAttribute("desrequestid", requestid+"");
		session.setAttribute("haslinkworkflow", "1");
	}
	
	/**
	 * 根据用户配置清除缓存
	 *//*
	public static void removeSpaConfig(int userid){
		spaconfig.remove(userid+"_wfspaopenwindow");
	}
	
	*//**
	 * 根据用户判断是否SPA下弹窗打开
	 *//*
	public static boolean judgeSpaOpenWindow(int userid){
		RecordSet rs = new RecordSet();
		boolean openwindow = true;
		String key = userid+"_wfspaopenwindow";
		if(spaconfig.containsKey(key))
			return spaconfig.get(key);
		else{
			rs.executeSql("select wfspaopenwindow from workflow_RequestUserDefault where userid="+userid);
			if(rs.next() && !"1".equals(rs.getString(1)))
				openwindow = false;
			spaconfig.put(key, openwindow);
			return openwindow;
		}
	}*/
	
	/**
	 * 判断SPA模式下是否请求到路由或原地址
	 * @return true:请求路径地址   false：请求原地址
	 */
	public static boolean judgeWfFormReqRoute(String requestid, String workflowid, String nodeid, int userid, String isremark){
		RecordSet rs = new RecordSet();
		if("1".equals(isremark) || "8".equals(isremark) || "9".equals(isremark)){		//抄送、转发需计算是否是某节点操作者
			rs.executeSql("select isprocessed,isremark,userid,nodeid from workflow_currentoperator where requestid = "
					+ requestid + " and userid="+userid+" order by receivedate desc, receivetime desc");
			while (rs.next()) {
				String isremark_tmp = Util.null2String(rs.getString("isremark"));
				if("0".equals(isremark_tmp)) {
					int nodeid_tmp = Util.getIntValue(rs.getString("nodeid"), 0);
					if (nodeid_tmp != 0) {
						isremark = "0";
						nodeid = nodeid_tmp+"";
						break;
					}
				}
			}
		}
		boolean reqRoute = nodeSupportSPA(nodeid);
		//待办暂只支持只读字段
		if(reqRoute && ("0".equals(isremark) || "5".equals(isremark))){
			rs.executeSql("select count(1) from workflow_nodeform where nodeid="+nodeid+" and isedit=1");
			if(rs.next() && rs.getInt(1) > 0)
				reqRoute = false;
		}
		return reqRoute;
	}
	
	/**
	 * 根据节点判断是否支持SPA模式
	 */
	public static boolean nodeSupportSPA(String nodeid){
		boolean supportSPA = false;
		boolean supportNormal = false;		//SPA模式支持普通模板
		boolean suppoerE7Layout = false;	//SPA模式支持E7源码模板
		RecordSet rs = new RecordSet();
		int ismode = 0;
		rs.executeSql("select ismode from workflow_flownode where nodeid="+nodeid);
		if(rs.next())
			ismode = Util.getIntValue(rs.getString("ismode"));
		if(supportNormal && ismode == 0){
			supportSPA = true;
		}else if(ismode == 2){
			rs.executeSql("select version from workflow_nodehtmllayout where nodeid="+nodeid+" and type=0 and isactive=1 order by id desc");
			if(rs.next()){
				int version = rs.getInt(1);
				if(version == 2 || (suppoerE7Layout && (version == 0 || version == 1)))
					supportSPA = true;
			}
		}
		return supportSPA;
	}
	
	public static boolean isReqRoute(String requestid,User user){
		int userid = user.getUID();
		int usertype = 0;
		if ("2".equals(user.getLogintype()))
			usertype = 1;
		int nodeid = 0;
		String isremark = "";
		RecordSet rs  = new RecordSet();
		String sql = "select isremark,isreminded,preisremark,id,groupdetailid,nodeid,takisremark,(CASE WHEN isremark=9 THEN '7.5' "
			+ "WHEN (isremark=1 and takisremark=2) THEN '0.9' WHEN (preisremark=1 and takisremark=2) "
			+ "THEN '0.9' ELSE isremark END) orderisremark from workflow_currentoperator where requestid=" + requestid 
			+ " and userid=" + userid + " and usertype=" + usertype
			+ " order by orderisremark,islasttimes desc ";
		rs.execute(sql);
		while(rs.next()){
			int tmpnodeid = Util.getIntValue(rs.getString("nodeid"));
			String tmpisremark = Util.null2String(rs.getString("isremark"));
			if ("0".equals(tmpisremark) || "1".equals(tmpisremark) || "5".equals(tmpisremark)
				|| "7".equals(tmpisremark) || "8".equals(tmpisremark) || "9".equals(tmpisremark)){
				nodeid = tmpnodeid;
				isremark = tmpisremark;
				break;
			}
			nodeid = tmpnodeid;
			isremark = tmpisremark;
		}
		boolean reqRoute = nodeSupportSPA(nodeid+"");
		//待办暂只支持只读字段
		if(reqRoute && ("0".equals(isremark) || "5".equals(isremark))){
			rs.executeSql("select count(1) from workflow_nodeform where nodeid="+nodeid+" and isedit=1");
			if(rs.next() && rs.getInt(1) > 0)
				reqRoute = false;
		}
		return reqRoute;
	}
	
	/**
	 * 图片懒加载处理，懒加载
	 */
	public static String manageImgLazyLoad(String text){
		int curindex = 0;
		while(text.indexOf("<img ", curindex) > -1){
			int index1 = text.indexOf("<img ", curindex);
			int index2 = text.indexOf(">", index1);
			String begstr = text.substring(0, index1);
			String imgstr = text.substring(index1, index2+1);
			String endstr = text.substring(index2+1);
			imgstr = imgstr.replace(" src", " original-src").replace(" style", " original-style")
				.replace(" width", " original-width").replace(" height", " original-height");
			imgstr = imgstr.substring(0,4) + " class=\"lazyimg\" src=\"/images/imgLazyDefault_wev9.gif\" style=\"width:18px;height:18px;\" " + imgstr.substring(4);
			text = begstr + imgstr + endstr;
			curindex = index2;
		}
		return text;
	}
	
}
