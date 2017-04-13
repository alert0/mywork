package com.api.workflow.web;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import weaver.workflow.request.RequestResources;
import weaver.workflow.workflow.WorkflowComInfo;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.api.workflow.service.FormDataService;
import com.api.workflow.service.FormInfoService;
import com.api.workflow.service.LayoutInfoService;
import com.api.workflow.service.LinkageCfgService;
import com.api.workflow.service.RequestFormService;
import com.api.workflow.service.RequestLogService;
import com.api.workflow.service.RequestOperation;
import com.api.workflow.service.RequestStatusLogService;
import com.api.workflow.service.SignInputService;
import com.api.workflow.util.PageUidFactory;
import com.cloudstore.dev.api.util.Util_TableMap;

/**
 * 流程表单相关接口
 * @author liuzy 2017/2/22
 */

@Path("/workflow/reqform")
public class RequestFormNewAction {

	
	@GET
	@Path("/loadForm")
	@Produces(MediaType.TEXT_PLAIN)
	public String loadForm(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try {
			User user = HrmUserVarify.getUser(request, response);
			long start = System.currentTimeMillis();
			int userid = user.getUID();
			String requestid = Util.null2String(request.getParameter("requestid"));
			//点击列表预加载，当表单请求到时直接返回
			boolean ispreload = Util.getIntValue(request.getParameter("ispreload")) == 1;
			/*boolean isdebug = (userid==8 || userid==80 || userid==1215||userid==1348||userid==3724||userid==4548);
			if(isdebug){
				System.out.println("-11-requestid-"+requestid+"-userid-"+userid+"-ispreload-"+ispreload+"-"+ (System.currentTimeMillis() - start));
				start = System.currentTimeMillis();
			}*/
			String preloadkey = Util.null2String(request.getParameter("preloadkey"));
			//获取预加载的内容的token
			String preloadValKey = preloadkey;
			//new weaver.general.BaseBean().writeLog("ispreload--"+ispreload+"---preloadkey---"+preloadkey);
			if (!"".equals(preloadkey)) {
				preloadkey = user.getUID() + "_" + preloadkey;
				preloadValKey = preloadkey + "_val";
				if (ispreload) {
					Util_TableMap.setVal(preloadkey, "loading");
				} else {
					//-----------------------------------------------------------------------------
					// 如果有预加载活动。
					// 注：预加载的内容只能使用一次，当前线程获取预加载的内容后，其他线程需要按照正常逻辑加载。
					//-----------------------------------------------------------------------------
					if (Util_TableMap.containsKey(preloadkey)) {
						//清除预加载标志
						Util_TableMap.clearVal(preloadkey);
						int i = 0;
						//预加载的内容，如果还没有加载好， 线程等待5s，5s后还未加载完成， 则按照正常逻辑加载。
						String cacheVal = null;
						while (i < 100) {
							cacheVal = Util_TableMap.getVal(preloadValKey);
							if (cacheVal != null) {
								/*if(isdebug){
									System.out.println("-12-requestid-"+requestid+"-preloadValKey-"+preloadValKey+"-i-"+i);
									System.out.println("-12-requestid-"+requestid+"-userid-"+userid+"-"+ (System.currentTimeMillis() - start));
									start = System.currentTimeMillis();
								}*/
								Util_TableMap.clearVal(preloadValKey);
								return cacheVal;
							}
							Thread.sleep(50);
						}
					}
				}
			}

			//权限加载判断、基础信息参数获取
			Map<String,Object> params = new RequestFormService(request, response).loadCompetence();
			apidatas.put("params", params);
			
			//加载表单信息，包括字段信息、明细信息等
			Map<String,Object> forminfo = new FormInfoService().generateFormInfo(request, response, params);
			apidatas.putAll(forminfo);
			
			//加载主表数据
			apidatas.put("maindata", new FormDataService().loadMainData(request, response, params));

			//拼接布局datajson，字符串拼接方式优化性能
			String apidatastr = JSON.toJSONString(apidatas);
			int ismode = Util.getIntValue(Util.null2String(params.get("ismode")), 0);
			int layoutid = Util.getIntValue(Util.null2String(params.get("modeid")), 0);
			String retstr = "";
			if (ismode == 2 && layoutid > 0) {        //设计器布局单独拼串
				String datajson = new LayoutInfoService().getLayoutDataJson(layoutid);
				apidatastr = apidatastr.substring(0, apidatastr.lastIndexOf("}"));
				retstr = apidatastr + ",\"datajson\":" + datajson + "}";
			} else {
				retstr = apidatastr;
			}
			
			//预加载结果处理
			if (ispreload && !"".equals(preloadkey)) {
				//预加载内容放入容器
				Util_TableMap.setVal(preloadValKey, retstr);
			}
			return retstr;
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSON.toJSONString(apidatas);
	}
	
	/**
	 * 表单联动信息
	 */
	@GET
	@Path("/linkagecfg")
	@Produces(MediaType.TEXT_PLAIN)
	public String getLinkageCfg(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try{
			int wfid = Util.getIntValue(request.getParameter("workflowid"));
			int nodeid = Util.getIntValue(request.getParameter("nodeid"));
			int formid = Util.getIntValue(request.getParameter("formid"));
			int isbill = Util.getIntValue(request.getParameter("isbill"));
			LinkageCfgService cfg = new LinkageCfgService(wfid, nodeid, formid, isbill);
			apidatas = cfg.getAllLinkageCfg();
		}catch(Exception e){
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSON.toJSONString(apidatas);
	}
	
	
	@GET
	@Path("/detailData")
	@Produces(MediaType.TEXT_PLAIN)
	public String detailData(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try {
			apidatas = new FormDataService().generateDetailData(request, response);
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSON.toJSONString(apidatas);
	}
	
	@GET
	@Path("/requestLog")
	@Produces(MediaType.TEXT_PLAIN)
	public String requestLog(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try {
			apidatas = new RequestLogService(request, response, true).getRequestLogData();
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSON.toJSONString(apidatas);
	}
	
	@GET
	@Path("/updateRequestLogPageSize")
	@Produces(MediaType.TEXT_PLAIN)
	public String updateRequestLogPageSize(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try {
			new RequestLogService(request, response, false).updateRequestLogPageSize();
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSON.toJSONString(apidatas);
	}
	
	@GET
	@Path("/signInput")
	@Produces(MediaType.TEXT_PLAIN)
	public String signInput(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try {
			apidatas = new SignInputService().loadSignInputInfo(request, response);
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSON.toJSONString(apidatas);
	}
	
	@GET
	@Path("/rightMenu")
	@Produces(MediaType.TEXT_PLAIN)
	public String rightMenu(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try {
			apidatas = new RequestFormService(request, response).getRightMenu();
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSON.toJSONString(apidatas);
	}
	
	@GET
	@Path("/updateReqInfo")
	@Produces(MediaType.TEXT_PLAIN)
	public String updateReqInfo(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try {
			apidatas = new RequestFormService(request, response).updateRequestInfoData();
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSON.toJSONString(apidatas);
	}
	
	@GET
	@Path("/addDocReadTag")
	@Produces(MediaType.TEXT_PLAIN)
	public String addDocReadTag(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try {
			apidatas = new RequestLogService(request, response, false).addDocReadTag();
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSON.toJSONString(apidatas);
	}
	
	@GET
	@Path("/copyCustomPageFile")
	@Produces(MediaType.TEXT_PLAIN)
	public String copyCustomPageFile(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try {
			apidatas = new RequestFormService().copyCustompageFile(request, response);
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSON.toJSONString(apidatas);
	}
	
	/**
	 * 代码块接口
	 */
	@GET
	@Path("/scripts")
	@Produces(MediaType.TEXT_PLAIN)
	public String getLayoutScripts(@Context HttpServletRequest request, @Context HttpServletResponse response){
		int layoutid = Util.getIntValue(request.getParameter("layoutid"));
		String scripts = new LayoutInfoService().getLayoutScripts(layoutid);
		return scripts;
	}
	
	@GET
	@Path("/rejectInfo")
	@Produces(MediaType.TEXT_PLAIN)
	public String rejectInfo(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try {
			apidatas = new RequestOperation().getRejectInfo(request, response);
		} catch (Exception e) {
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSON.toJSONString(apidatas);
	}


	
	
	/**
	 * 流程状态接口新
	 */
	@GET
	@Path("/wfstatusnew")
	@Produces(MediaType.TEXT_PLAIN)
	public String getWfStatusNew(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try{
			String requestid = request.getParameter("requestid");
			int pageSize = Util.getIntValue(request.getParameter("pageSize"), 30);
			int desrequestid = Util.getIntValue(request.getParameter("desrequestid"), 0);
			String isfirst = Util.null2String(request.getParameter("isfirst"));
			String isurger = Util.null2String(request.getParameter("isurger"));
			String desremark = Util.null2String(request.getParameter("desremark"));
			String parameter = Util.null2String(request.getParameter("parameter"));
			
			String f_weaver_belongto_userid=Util.null2String(request.getParameter("f_weaver_belongto_userid"));
			String f_weaver_belongto_usertype=Util.null2String(request.getParameter("f_weaver_belongto_usertype"));
			User user  = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
			
			String workflowid = "";
			RecordSet rs = new RecordSet();
			rs.executeSql("select workflowid from workflow_requestbase where requestid="+requestid);
			if(rs.next())
				workflowid = rs.getString("workflowid");
			
			RequestStatusLogService reqstatusLog = new RequestStatusLogService(workflowid, requestid);
			reqstatusLog.setUser(user);
			reqstatusLog.setDesrequestid(desrequestid);
			reqstatusLog.setIsurger(isurger);
			apidatas = reqstatusLog.getStatusLogNew(desremark,pageSize,isfirst,parameter);
			return JSONObject.toJSONString(apidatas);
		}catch(Exception e){
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSONObject.toJSONString(apidatas);
	}
	
	/**
	 * 流程状态数量接口
	 */
	@GET
	@Path("/wfstatuscount")
	@Produces(MediaType.TEXT_PLAIN)
	public String getWfStatusCount(@Context HttpServletRequest request, @Context HttpServletResponse response){
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try{
			//String workflowid = request.getParameter("workflowid");
			String requestid = request.getParameter("requestid");
			int desrequestid = Util.getIntValue(request.getParameter("desrequestid"), 0);
			String isurger = Util.null2String(request.getParameter("isurger"));
			String viewlogids = Util.null2String(request.getParameter("viewlogids"));
			String f_weaver_belongto_userid=Util.null2String(request.getParameter("f_weaver_belongto_userid"));
			String f_weaver_belongto_usertype=Util.null2String(request.getParameter("f_weaver_belongto_usertype"));
			User user  = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
			
			String workflowid = "";
			RecordSet rs = new RecordSet();
			rs.executeSql("select workflowid from workflow_requestbase where requestid="+requestid);
			if(rs.next())
				workflowid = rs.getString("workflowid");
			
			RequestStatusLogService reqstatusLog = new RequestStatusLogService(workflowid, requestid);
			reqstatusLog.setUser(user);
			reqstatusLog.setDesrequestid(desrequestid);
			reqstatusLog.setIsurger(isurger);
			apidatas = reqstatusLog.getStatusLogCount(viewlogids);
			return JSONObject.toJSONString(apidatas);
		}catch(Exception e){
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSONObject.toJSONString(apidatas);
	}
	
	/**
	 * 相关资源接口
	 */
	@GET
	@Path("/resources")
	@Produces(MediaType.TEXT_PLAIN)
	public String buildResourcesTableString(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		Map<String,Object> apidatas = new HashMap<String,Object>();
		try{
			String f_weaver_belongto_userid=request.getParameter("f_weaver_belongto_userid");
			String f_weaver_belongto_usertype=request.getParameter("f_weaver_belongto_usertype");
			User user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
			int userid=user.getUID();
			int requestid = Util.getIntValue(request.getParameter("requestid"));
			int workflowid = 0;
			RecordSet rs = new RecordSet();
			rs.executeSql("select workflowid from workflow_requestbase where requestid="+requestid);
			if(rs.next())
				workflowid = Util.getIntValue(rs.getString("workflowid"));
			WorkflowComInfo wfComInfo = new WorkflowComInfo();
			int formid = Util.getIntValue(wfComInfo.getFormId(workflowid+""));
			int isbill = Util.getIntValue(wfComInfo.getIsBill(workflowid+""));

			String reportid = Util.null2String(request.getParameter("reportid"));
			String isfromreport = Util.null2String(request.getParameter("isfromreport"));
			String isfromflowreport = Util.null2String(request.getParameter("isfromflowreport"));
			int tabindex = Util.getIntValue(request.getParameter("tabindex"), 0);
			String isshared = Util.null2String(request.getParameter("iswfshare"));
			RequestResources reqresources = new RequestResources(user, workflowid, requestid, isbill, formid,reportid,isfromreport,isfromflowreport,isshared);

			String fromSql = " " + reqresources.getReqResSqlByType(tabindex) + " ";
			String sqlWhere = " where 1=1 ";
			String backfields = " id, resname, restype, creator, creatortype, createdate, docid ";
			String orderby = " id ";
			//String pageid = PageIdConst.WF_REQUEST_REQUESTRESOURCES;
			String pageUid = PageUidFactory.getWfPageUid("REQUESTRES");

			String tableString = "<table instanceid=\"workflow_RequestSourceTable\" tabletype=\"none\" pageUid=\""+pageUid+"\" >"+
			                "	<sql backfields=\""+backfields+"\" sqlform=\""+fromSql+"\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlWhere)+"\" sqlorderby=\"" + orderby + "\" sqlprimarykey=\"id\" sqlsortway=\"ASC\" sqlisdistinct=\"true\" />"+
			                "	<head>"+
			                "		<col width=\"5%\" text=\"\" _key=\"imagehtml\" column=\"resname\" orderkey=\"resname\" transmethod=\"weaver.workflow.request.RequestResources.getResImageHtml\" otherpara=\"column:restype\" />"+
			                "		<col width=\"45%\" text=\""+SystemEnv.getHtmlLabelName(15924,user.getLanguage())+"\" _key=\"reshtml\" column=\"resname\" orderkey=\"resname\" transmethod=\"weaver.workflow.request.RequestResources.getResDisplayHtml\" otherpara=\"column:id+column:restype+" + requestid + "+" +  userid +"\" />"+
			                "		<col width=\"20%\" text=\""+SystemEnv.getHtmlLabelName(882,user.getLanguage())+"\" column=\"creator\" otherpara=\"0\" orderkey=\"creator\" transmethod=\"weaver.general.WorkFlowTransMethod.getWFSearchResultName\" />"+
			                "		<col width=\"30%\" text=\""+SystemEnv.getHtmlLabelName(1339,user.getLanguage())+"\" column=\"createdate\" orderkey=\"createdate\" />"+
			                "	</head>"+
			                "	<operates>"+
							"		<popedom transmethod=\"weaver.workflow.request.RequestResources.getResOperaotes\" otherpara=\"column:restype+column:docid+column:resname\"></popedom> " +
			                "		<operate href=\"javascript:resourceOperate.openReq();\" text=\""+SystemEnv.getHtmlLabelName(360,user.getLanguage())+"\" target=\"_self\" otherpara=\""+requestid+"\" index=\"0\"/>"+
			                "		<operate href=\"javascript:resourceOperate.openDoc();\" text=\""+SystemEnv.getHtmlLabelName(360,user.getLanguage())+"\" target=\"_self\" otherpara=\""+requestid+"\" index=\"1\"/>"+
			                "		<operate href=\"javascript:resourceOperate.downLoad();\" text=\""+SystemEnv.getHtmlLabelName(31156,user.getLanguage())+"\" target=\"_self\" otherpara=\""+requestid+"\" index=\"2\"/>"+
							"	</operates>"+
			                "</table>";
			String sessionkey = pageUid+"_"+Util.getEncrypt(Util.getRandom());
			Util_TableMap.setVal(sessionkey, tableString);
			apidatas.put("sessionkey", sessionkey);
		}catch(Exception e){
			e.printStackTrace();
			apidatas.put("api_status", false);
			apidatas.put("api_errormsg", "catch exception : " + e.getMessage());
		}
		return JSONObject.toJSONString(apidatas);
	}

}
