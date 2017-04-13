package com.api.workflow.service;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import weaver.conn.RecordSet;
import weaver.crm.Maint.CustomerInfoComInfo;
import weaver.docs.category.SecCategoryComInfo;
import weaver.docs.docs.DocImageManager;
import weaver.general.AttachFileUtil;
import weaver.general.TimeUtil;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.resource.ResourceComInfo;
import weaver.systeminfo.SystemEnv;
import weaver.workflow.exceldesign.FormatFieldValue;
import weaver.workflow.request.RequestPreAddinoperateManager;
import weaver.workflow.request.WorkflowJspBean;

import com.alibaba.fastjson.JSONObject;
import com.api.workflow.bean.FieldInfo;
import com.api.workflow.bean.FieldValueBean;
import com.api.workflow.bean.SelectItem;
import com.api.workflow.bean.TableInfo;
import com.api.workflow.util.ServiceUtil;
import com.cloudstore.dev.api.util.Util_TableMap;

public class FormDataService {
	
	private int requestid;
	private int workflowid;
	private int nodeid;
	private int formid;
	private int isbill;
	private int isprint;
	private int desrequestid;

	private User user;
	private String f_weaver_belongto_userid;
	private String f_weaver_belongto_usertype;
	private RecordSet rs = new RecordSet();
	
	private Map<String,TableInfo> tableinfomap = new LinkedHashMap<String,TableInfo>();
	private HttpServletRequest request;

	private void init(HttpServletRequest request, HttpServletResponse response){
		this.request = request;
		this.f_weaver_belongto_userid = Util.null2String(request.getParameter("f_weaver_belongto_userid"));
		this.f_weaver_belongto_usertype = Util.null2String(request.getParameter("f_weaver_belongto_usertype"));
		this.user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
		
		this.requestid = Util.getIntValue(request.getParameter("requestid"), 0);
		this.workflowid = Util.getIntValue(request.getParameter("workflowid"), 0);
		this.nodeid = Util.getIntValue(request.getParameter("nodeid"), 0);
		this.formid = Util.getIntValue(request.getParameter("formid"), 0);
		this.isbill = Util.getIntValue(request.getParameter("isbill"), -1);
		this.isprint = Util.getIntValue(request.getParameter("isprint"), 0);
		this.desrequestid = Util.getIntValue(request.getParameter("desrequestid"), 0);
		
		String sessionkey = requestid+"_"+nodeid+"_"+user.getUID()+"_tableinfomap";
		this.tableinfomap = (Map<String,TableInfo>) Util_TableMap.getObjVal(sessionkey);
	}
	
	private void init(HttpServletRequest request, HttpServletResponse response, Map<String,Object> params){
		this.request = request;
		this.f_weaver_belongto_userid = Util.null2String(params.get("f_weaver_belongto_userid"));
		this.f_weaver_belongto_usertype = Util.null2String(params.get("f_weaver_belongto_usertype"));
		this.user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
		
		this.requestid = Util.getIntValue(Util.null2String(params.get("requestid")), 0);
		this.workflowid = Util.getIntValue(Util.null2String(params.get("workflowid")), 0);
		this.nodeid = Util.getIntValue(Util.null2String(params.get("nodeid")), 0);
		this.formid = Util.getIntValue(Util.null2String(params.get("formid")), 0);
		this.isbill = Util.getIntValue(Util.null2String(params.get("isbill")), -1);
		this.isprint = Util.getIntValue(Util.null2String(params.get("isprint")), 0);
		this.desrequestid = Util.getIntValue(Util.null2String(params.get("desrequestid")), 0);
		
		String sessionkey = requestid+"_"+nodeid+"_"+user.getUID()+"_tableinfomap";
		this.tableinfomap = (Map<String,TableInfo>) Util_TableMap.getObjVal(sessionkey);
	}

	/**
	 * 加载主表字段数据信息
	 */
	public Map<String,FieldValueBean> loadMainData(HttpServletRequest request, HttpServletResponse response, Map<String,Object> params) throws Exception{
		this.init(request, response, params);
		if(tableinfomap == null)
			throw new Exception("generateMainData Get forminfo Empty Exception");
		
		if(params.get("iscreate") == "1"){
			return this.generateCreateDefaultValue();
		}else{
			return this.generateMainData();
		}
	}
	
	/**
	 * 流程创建生成主表字段默认值
	 */
	private Map<String,FieldValueBean> generateCreateDefaultValue() throws Exception{
		String prjid = Util.null2String(request.getParameter("prjid"));
		String reqid = Util.null2String(request.getParameter("reqid"));
		String docid = Util.null2String(request.getParameter("docid"));
		String hrmid = Util.null2String(request.getParameter("hrmid"));
		String crmid = Util.null2String(request.getParameter("crmid"));
		//String defhrmid = body_isagent == 1 ? Util.getIntValue(beagenter2, 0)+"" : Util.getIntValue(hrmid, 0)+"";	//代理情况默认
		String defhrmid = Util.getIntValue(hrmid, 0)+"";
		ResourceComInfo resourceComInfo = new ResourceComInfo();
		CustomerInfoComInfo customerInfoComInfo = new CustomerInfoComInfo();

		Map<String,FieldValueBean> maindefdata = new HashMap<String,FieldValueBean>();
		// 获取节点前附加操作
        RequestPreAddinoperateManager requestPreAddM = new RequestPreAddinoperateManager();
		requestPreAddM.setCreater(user.getUID());
		requestPreAddM.setOptor(user.getUID());
		requestPreAddM.setWorkflowid(workflowid);
		requestPreAddM.setNodeid(nodeid);
		requestPreAddM.setRequestid(requestid);
		Hashtable getPreAddRule_hs = requestPreAddM.getPreAddRule();
		Hashtable inoperatefield_hs = (Hashtable) getPreAddRule_hs.get("inoperatefield_hs");
		Hashtable fieldvalue_hs = (Hashtable) getPreAddRule_hs.get("inoperatevalue_hs");
		//循环主表字段赋默认值
		TableInfo maininfo = this.tableinfomap.get("main");
		Map<String,FieldInfo> mainfields = maininfo.getFieldinfomap();
		for(Map.Entry<String,FieldInfo> entry : mainfields.entrySet()){
			FieldInfo fieldinfo = entry.getValue();
			int fieldid = fieldinfo.getFieldid();
			String fielddefvalue = "";
			String inoperatefield_tmp = Util.null2String((String) inoperatefield_hs.get("inoperatefield"+fieldid));
			if("1".equals(inoperatefield_tmp)){		//含节点前附加操作
				fielddefvalue = Util.null2String((String) fieldvalue_hs.get("inoperatevalue"+fieldid));
			}else{
				if (fieldinfo.getHtmltype() == 3) {
					int detailtype = fieldinfo.getDetailtype();
					if ((detailtype == 8 || detailtype == 135) && !prjid.equals("")) { // 浏览按钮为项目,从参数中获得项目默认值
						fielddefvalue = "" + Util.getIntValue(prjid, 0);
					} else if ((detailtype == 9 || detailtype == 37) && !docid.equals("")) { // 浏览按钮为文档,从参数中获得文档默认值
						fielddefvalue = "" + Util.getIntValue(docid, 0);
					} else if ((detailtype == 1 || detailtype == 17 || detailtype == 165 || detailtype == 166) && !hrmid.equals("")) { 	// 浏览按钮为人,从参数中获得人默认值
						fielddefvalue = "" + defhrmid;
					} else if ((detailtype == 7 || detailtype == 18) && !crmid.equals("")) { // 浏览按钮为CRM,从参数中获得CRM默认值
						fielddefvalue = "" + Util.getIntValue(crmid, 0);
					} else if ((detailtype == 16 || detailtype == 152 || detailtype == 171) && !reqid.equals("")) { // 浏览按钮为REQ,从参数中获得REQ默认值
						fielddefvalue = "" + Util.getIntValue(reqid, 0);
					} else if ((detailtype == 4 || detailtype == 57 || detailtype == 167 || detailtype == 168) && !hrmid.equals("")) { // 浏览按钮为部门,从参数中获得人对应部门默认值
						fielddefvalue = "" + Util.getIntValue(resourceComInfo.getDepartmentID(defhrmid), 0);
					} else if ((detailtype == 164 || detailtype == 169 || detailtype == 170 || detailtype == 194) && !hrmid.equals("")) { // 浏览按钮为分部,从参数中获得人对应分部默认值
						fielddefvalue = "" + Util.getIntValue(resourceComInfo.getSubCompanyID(defhrmid), 0);
					} else if ((detailtype == 24 || detailtype == 278) && !hrmid.equals("")) { // 浏览按钮为职务,从参数中获得人对应职务默认值
						fielddefvalue = "" + Util.getIntValue(resourceComInfo.getJobTitle(defhrmid), 0);
					} else if (detailtype == 32 && !hrmid.equals("")) {	
						fielddefvalue = "" + Util.getIntValue(request.getParameter("TrainPlanId"), 0);
					} else if (detailtype == 2) {// 日期
						fielddefvalue = TimeUtil.getCurrentDateString();
					} else if (detailtype == 19) {// 时间
						fielddefvalue = TimeUtil.getCurrentTimeString().substring(11, 16);
					} else if (detailtype == 178) {// 年份
						String currentdate_tmp = TimeUtil.getCurrentDateString();
						if (currentdate_tmp != null && currentdate_tmp.indexOf("-") >= 0)
							fielddefvalue = currentdate_tmp.substring(0, currentdate_tmp.indexOf("-"));
					}
					if ("0".equals(fielddefvalue))
						fielddefvalue = "";
				}
			}
			if(!"".equals(fielddefvalue)){
				maindefdata.put("field"+fieldid, this.buildFieldValueBean(fieldinfo, fielddefvalue));
			}
		}
		//URL参数传值
		Enumeration em = request.getParameterNames();
		while(em.hasMoreElements()){
			String paramName = (String) em.nextElement();
			if(Pattern.matches("field\\d+", paramName)){
				int fieldid = Util.getIntValue(paramName.substring(5));
				String paramValue = Util.null2String(request.getParameter(paramName));
				if(fieldid > 0 && !"".equals(paramValue) && mainfields.containsKey(fieldid)){
					maindefdata.put("field"+fieldid, this.buildFieldValueBean(mainfields.get(fieldid), paramValue));
				}
			}
		}
		//系统字段赋默认值
		int defaultName = 0;
		boolean messageType = false;
		boolean chatsType = false;
		int smsAlertsType = 0;
		int chatsAlertType = 0;
		rs.executeSql("select * from workflow_base where id="+workflowid);
		if(rs.next()){
			defaultName = Util.getIntValue(rs.getString("defaultName"), 0);
			if(rs.getInt("messageType") == 1)	messageType = true;
			if(rs.getInt("chatsType") == 1)		chatsType = true;
			smsAlertsType = Util.getIntValue(rs.getString("smsAlertsType"), 0);
			chatsAlertType = Util.getIntValue(rs.getString("chatsAlertType"), 0);
		}
		//流程标题-1
		int requestname_isview = mainfields.containsKey("-1") ? mainfields.get("-1").getIsview() : 0;
		if(defaultName == 1 || requestname_isview != 1){	//标题默认规则或标题字段未放置在模板上
			String username = "";
			if (this.user.getLogintype().equals("1"))
				username = resourceComInfo.getLastname(defhrmid);
			if (this.user.getLogintype().equals("2"))
				username = customerInfoComInfo.getCustomerInfoname(defhrmid);
			
			weaver.general.DateUtil DateUtil = new weaver.general.DateUtil();
			String deftitle = DateUtil.getWFTitleNew(""+workflowid, defhrmid, username, this.user.getLogintype());
			deftitle = Util.toScreenToEdit(deftitle, user.getLanguage());
			
			FieldValueBean requestnamebean = new FieldValueBean();
			requestnamebean.setValue(deftitle);
			maindefdata.put("field-1", requestnamebean);
		}
		// 紧急程度-2
		FieldValueBean requestlevelbean = new FieldValueBean();
		requestlevelbean.setValue("0");
		requestlevelbean.setShowname(this.transRequestLevelName(0));
		maindefdata.put("field-2", requestlevelbean);
		// 短信提醒-3
		if(messageType){
			FieldValueBean messagetypebean = new FieldValueBean();
			messagetypebean.setValue(smsAlertsType+"");
			messagetypebean.setShowname(this.transMessageTypeName(smsAlertsType));
			maindefdata.put("field-3", messagetypebean);
		}
		// 微信提醒-5
		if(chatsType){
			FieldValueBean chatstypebean = new FieldValueBean();
			chatstypebean.setValue(chatsAlertType+"");
			chatstypebean.setShowname(this.transChatsTypeName(chatsAlertType));
			maindefdata.put("field-5", chatstypebean);
		}
		return maindefdata;
	}
	
	/**
	 * 流程编辑生成主表数据信息
	 */
	private Map<String,FieldValueBean> generateMainData(){
		Map<String,FieldValueBean> maindata = new HashMap<String,FieldValueBean>();
		TableInfo maininfo = this.tableinfomap.get("main");
		String tablename = maininfo.getTablename();
		String tablecolumn = maininfo.getTablecolumn();
		if(tablecolumn.endsWith(","))
			tablecolumn = tablecolumn.substring(0, tablecolumn.length()-1);
		String recordsql = "";
		if(isbill == 0){
			recordsql = "select "+tablecolumn+" from "+tablename+" where requestid="+requestid+" and billformid="+formid;
		}else{
			recordsql = "select id,"+tablecolumn+" from "+tablename+" where requestid="+requestid;
		}
		rs.executeSql(recordsql);
		if(rs.next()){
			//自定义字段值
			Map<String,FieldInfo> mainfields = maininfo.getFieldinfomap();
			for(Map.Entry<String, FieldInfo> entry : mainfields.entrySet()){
				FieldInfo fieldinfo = entry.getValue();
				int fieldid = fieldinfo.getFieldid();
				String fieldvalue = Util.null2String(rs.getString(fieldinfo.getFieldname()));
				maindata.put("field"+fieldid, this.buildFieldValueBean(fieldinfo, fieldvalue));
			}
			//系统字段值
			rs.executeSql("select * from workflow_requestbase where requestid="+requestid);
			if(rs.next()){
				FieldValueBean requestnamebean = new FieldValueBean();
				requestnamebean.setValue(rs.getString("requestname"));
				maindata.put("field-1", requestnamebean);
				
				int requestlevel = Util.getIntValue(rs.getString("requestlevel"),0);
				FieldValueBean requestlevelbean = new FieldValueBean();
				requestlevelbean.setValue(requestlevel+"");
				requestlevelbean.setShowname(this.transRequestLevelName(requestlevel));
				maindata.put("field-2", requestlevelbean);
				
				int messagetype = Util.getIntValue(rs.getString("messagetype"),0);
				FieldValueBean messagetypebean = new FieldValueBean();
				messagetypebean.setValue(messagetype+"");
				messagetypebean.setShowname(this.transMessageTypeName(messagetype));
				maindata.put("field-3", messagetypebean);
				
				int chatstype = Util.getIntValue(rs.getString("chatstype"),0);
				FieldValueBean chatstypebean = new FieldValueBean();
				chatstypebean.setValue(chatstype+"");
				chatstypebean.setShowname(this.transChatsTypeName(chatstype));
				maindata.put("field-5", chatstypebean);
			}
			maininfo.setRecordnum(1);
		}else{
			maininfo.setRecordnum(0);
		}
		return maindata;
	}
	
	
	/**
	 * 生成明细表数据信息(可单个/多个明细请求)
	 */
	public Map<String,Object> generateDetailData(HttpServletRequest request, HttpServletResponse response) throws Exception{
		this.init(request, response);
		if(tableinfomap == null)
			throw new Exception("generateDetailData Get forminfo Empty Exception");
		
		Map<String,Object> apidatas = new HashMap<String,Object>();
		int billmainid = this.getBillMainId();
		String detailmark = Util.null2String(request.getParameter("detailmark"));
		String[] detailmarkArr = detailmark.split(",");
		for(String key : detailmarkArr){
			TableInfo detailinfo = this.tableinfomap.get(key);
			if(detailinfo == null)
				continue;
			int tableindex = detailinfo.getTableindex();
			String tablename = detailinfo.getTablename();
			String tablecolumn = detailinfo.getTablecolumn();
			if(tablecolumn.endsWith(","))
				tablecolumn = tablecolumn.substring(0, tablecolumn.length()-1);
			
			String recordsql = "";
			if(isbill == 0){
				recordsql = "select "+tablecolumn+" from "+tablename+" where requestid="+requestid+" and groupid="+(tableindex-1)+" order by id";
			}else{
				if(this.formid == 7)	//费用报销单据
					recordsql = "select id,"+tablecolumn+" from "+tablename+" where expenseid="+billmainid+" order by id";
				else
					recordsql = "select id,"+tablecolumn+" from "+tablename+" where mainid="+billmainid+" order by id";
			}
			rs.executeSql(recordsql);
			Map<String,FieldInfo> fieldinfomap = detailinfo.getFieldinfomap();
			List<Map<String,FieldValueBean>> fieldvaluelist = new ArrayList<Map<String,FieldValueBean>>();
			while(rs.next()){
				Map<String,FieldValueBean> fieldvaluemap = new HashMap<String,FieldValueBean>();
				for(Map.Entry<String, FieldInfo> entry : fieldinfomap.entrySet()){
					FieldInfo fieldinfo = entry.getValue();
					int fieldid = fieldinfo.getFieldid();
					String fieldvalue = Util.null2String(rs.getString(fieldinfo.getFieldname()));
					fieldvaluemap.put("field"+fieldid, this.buildFieldValueBean(fieldinfo, fieldvalue));
				}
				fieldvaluelist.add(fieldvaluemap);
			}
			apidatas.put(key, fieldvaluelist);
		}
		return apidatas;
	}
	
	/**
	 * 取新表单主表记录ID
	 */
	private int getBillMainId(){
		int billmainid = 0;
		if(isbill == 1){
			TableInfo maininfo = this.tableinfomap.get("main");
			rs.executeSql("select id from "+maininfo.getTablename()+" where requestid="+this.requestid);
			if(rs.next())
				billmainid = Util.getIntValue(rs.getString(1));
		}
		return billmainid;
	}
	

	
	/**
	 * 根据字段信息生成字段值对象
	 */
	private FieldValueBean buildFieldValueBean(FieldInfo fieldinfo, String fieldvalue){
		FieldValueBean bean = new FieldValueBean();
		int htmltype = fieldinfo.getHtmltype();
		int detailtype = fieldinfo.getDetailtype();
		if((htmltype == 1 && detailtype == 1) || htmltype == 2)
			fieldvalue = ServiceUtil.convertChar(fieldvalue);
		
		bean.setValue(fieldvalue);
		if(htmltype ==1 && detailtype == 4){
			Map<String,Object> specialobj = new HashMap<String,Object>();
			specialobj.put("thousandsVal", Util.milfloatFormat(fieldvalue));
			specialobj.put("upperVal", Util.numtochinese(fieldvalue));
			bean.setSpecialobj(specialobj);
		}else if(htmltype == 2 && detailtype == 2){	//图片懒加载
			bean.setValue(ServiceUtil.manageImgLazyLoad(fieldvalue));
		}else if(htmltype == 3){
			bean.setShowname(ServiceUtil.convertChar(this.getBrowserShowName(fieldinfo, fieldvalue)));
			if(detailtype == 16 || detailtype == 152){	//流程，多流程
				ServiceUtil.addRelatedWfSession(this.request, this.requestid, fieldvalue);
			}
		}else if(htmltype == 5){
			bean.setShowname(ServiceUtil.convertChar(this.getSelectShowName(fieldinfo, fieldvalue)));
		}else if(htmltype == 6){	//附件上传
			if("-2".equals(fieldvalue)){
				bean.setShowname(SystemEnv.getHtmlLabelName(21710, user.getLanguage()));	//给color:red
			}else{
				bean.setSpecialobj(this.getFileFieldSpecialObj(fieldvalue));
			}
		}
		String formatstr = fieldinfo.getFormatcfg();
		if(formatstr != null && !"".equals(formatstr) && !"".equals(fieldvalue)){
			JSONObject formatcfg = JSONObject.parseObject(formatstr);
			boolean needforamt = false;
			if(htmltype == 1 && (detailtype == 1 || detailtype == 2 || detailtype == 3 || detailtype == 5)){
				needforamt = true;
			}else if(htmltype == 3){
				int numberType = Util.getIntValue(formatcfg.getString("numberType"));
				if((detailtype == 2 && numberType == 3) || (detailtype == 19 && numberType == 4))
					needforamt = true;
			}
			if(needforamt){
				FormatFieldValue FormatFieldValue=new FormatFieldValue();
				formatstr = formatstr.substring(formatstr.indexOf("{")+1, formatstr.lastIndexOf("}"));
				bean.setFormatvalue(FormatFieldValue.FormatValue(fieldvalue, formatstr, htmltype, detailtype));
			}
		}
		return bean;
	}
	

	
	/**
	 * 浏览框字段获取showname
	 */
	private String getBrowserShowName(FieldInfo fieldinfo, String fieldvalue){
		int detailtype = fieldinfo.getDetailtype();
		int fieldid = fieldinfo.getFieldid();
		WorkflowJspBean workflowJspBean = new WorkflowJspBean();
		workflowJspBean.setUser(user);
		String linkurl = fieldinfo.getBrowserattr().getLinkurl();
		String showname = "";
		if(detailtype == 17){	//多人力资源分组特别处理
			workflowJspBean.setRequestid(requestid);
			StringBuffer _sbf = new StringBuffer(fieldvalue);
			String splitflg = "_____";
			//boolean showtype = isedit.equals("0") || !editbodyflag;
			boolean showtype = true;
			if (showtype)
				splitflg = "&nbsp";
			showname = workflowJspBean.getMultiResourceShowName(_sbf, linkurl, fieldid + "", user.getLanguage(), splitflg);
			boolean hasGroup = workflowJspBean.isHasGroup();
			if (showtype && hasGroup) {
				String[] fieldvalarray = fieldvalue.split(",");
				List<String> fieldvalList = new ArrayList<String>();
				for (int z = 0; z < fieldvalarray.length; z++) {
					if (!fieldvalList.contains(fieldvalarray[z]))
						fieldvalList.add(fieldvalarray[z]);
				}
				if (fieldvalList.size() > 0)
					showname += "&nbsp;<span style='color:#bfbfc0;'>（" + SystemEnv.getHtmlLabelName(83698, user.getLanguage()) + fieldvalList.size() + SystemEnv.getHtmlLabelName(84097, user.getLanguage()) + "）</span>";
			}
		}else{
			showname = workflowJspBean.getWorkflowBrowserShowName(fieldvalue, detailtype+"", linkurl, fieldvalue, fieldinfo.getFielddbtype());
		}
		return showname;
	}
	
	/**
	 * 选择框字段获取showname
	 */
	private String getSelectShowName(FieldInfo fieldinfo, String fieldvalue){
		List<SelectItem> selectitemlist = fieldinfo.getSelectattr().getSelectitemlist();
		if(selectitemlist == null || selectitemlist.size() == 0)
			return "";
		String showname = "";
		int _value = Util.getIntValue(fieldvalue);
		for(SelectItem item : selectitemlist){
			if(item.getSelectvalue() == _value){
				showname = item.getSelectname();
				break;
			}
		}
		return showname;
	}
	
	/**
	 * 附件上传字段值相关信息
	 */
	private Object getFileFieldSpecialObj(String fieldvalue){
		Map<String,Object> retobj = new HashMap<String,Object>();
		String belonguserlink = "f_weaver_belongto_userid="+f_weaver_belongto_userid+"&f_weaver_belongto_usertype="+f_weaver_belongto_usertype;
		try{
			RecordSet rs1 = new RecordSet();
			String imageids = this.delEmptyImageId(fieldvalue);
			boolean showBatchLoad = false;
			boolean wfForbidBatchLoad = false;
			rs1.executeSql("select forbidAttDownload from workflow_base where id=" + workflowid);
			if (rs1.next() && "1".equals(rs1.getString(1)))
				wfForbidBatchLoad = true;
			List<Map<String, String>> filedatas = new ArrayList<Map<String, String>>();
			if(!"".equals(imageids)){
				DocImageManager docImageManager = new DocImageManager();
				AttachFileUtil attachFileUtil = new AttachFileUtil();
				SecCategoryComInfo secCategoryComInfo = new SecCategoryComInfo();
				rs1.executeSql("select id,docsubject,accessorycount,SecCategory from docdetail where id in("+imageids+") order by id asc");
				boolean isfirst = true;
				int filenum = rs1.getCounts();
				while(rs1.next()){
					String showid = Util.null2String(rs1.getString(1));
					int accessoryCount = rs1.getInt(3);
					String SecCategory = Util.null2String(rs1.getString(4));
					docImageManager.resetParameter();
					docImageManager.setDocid(Integer.parseInt(showid));
					docImageManager.selectDocImageInfo();
	
					String fileid = "";
					long filesize = 0;
					String filename = "";
					String fileExtendName = "";
					int versionId = 0;
					if (docImageManager.next()) {
						fileid = docImageManager.getImagefileid();
						filesize = docImageManager.getImageFileSize(Util.getIntValue(fileid));
						filename = docImageManager.getImagefilename();
						fileExtendName = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
						versionId = docImageManager.getVersionId();
					}
					if (accessoryCount > 1)
						fileExtendName = "htm";
					
					String imgSrc = attachFileUtil.getImgStrbyExtendName(fileExtendName, 20);
					boolean nodownload = secCategoryComInfo.getNoDownload(SecCategory).equals("1") ? true : false;
					boolean showLoad = !nodownload && isprint != 1;
					if (accessoryCount == 1 && isprint != 1 && (!nodownload ||
							(!fileExtendName.equalsIgnoreCase("xls") && !fileExtendName.equalsIgnoreCase("doc") && !fileExtendName.equalsIgnoreCase("ppt") 
							&& !fileExtendName.equalsIgnoreCase("xlsx") && !fileExtendName.equalsIgnoreCase("docx") && !fileExtendName.equalsIgnoreCase("pptx")
							&& !fileExtendName.equalsIgnoreCase("pdf") && !fileExtendName.equalsIgnoreCase("pdfx"))))
						showLoad = true;
					//链接参考签字意见列表
					String filelink = "";
                    if (accessoryCount == 1 && (fileExtendName.equalsIgnoreCase("xls") || fileExtendName.equalsIgnoreCase("doc") || fileExtendName.equalsIgnoreCase("xlsx") 
                    		|| fileExtendName.equalsIgnoreCase("docx") || fileExtendName.equalsIgnoreCase("pdf"))) {
                    	filelink = "/docs/docs/DocDspExt.jsp?"+belonguserlink+"&id="+showid+"&imagefileId="+fileid+"&isFromAccessory=true&isrequest=1&requestid="+requestid+"&desrequestid="+desrequestid; 
                    } else {
                    	filelink = "/docs/docs/DocDsp.jsp?"+belonguserlink+"&id="+showid+"&isrequest=1&requestid="+requestid+"&desrequestid="+desrequestid;
                    }
                    String loadlink = "";
                    if (showLoad) {
                    	loadlink = "/weaver/weaver.file.FileDownload?fileid="+fileid+"&download=1&requestid="+requestid+"&desrequestid="+desrequestid;
                    }
					
					Map<String,String> filemap = new HashMap<String,String>();
					filemap.put("fileid", fileid);
					filemap.put("filesize", filesize/1024+"k");
					filemap.put("filename", filename);
					filemap.put("fileExtendName", fileExtendName);
					filemap.put("filelink", filelink);
					filemap.put("versionId", versionId+"");
					filemap.put("imgSrc", imgSrc);
					filemap.put("showLoad", showLoad+"");
					filemap.put("loadlink", loadlink);
					filedatas.add(filemap);
					
					if (isfirst) {	//显示批量下载
						if (filenum >1 && !wfForbidBatchLoad && !nodownload && isprint != 1)
							showBatchLoad = true;
						isfirst = false;
					}
				}
			}
			retobj.put("filedatas", filedatas);
			retobj.put("showBatchLoad", showBatchLoad);
		}catch(Exception e){
			e.printStackTrace();
		}
		return retobj;
	}
	
	private String delEmptyImageId(String fieldvalue){
		if(fieldvalue == null || "".equals(fieldvalue))
			return "";
		String[] imageidArr = fieldvalue.split(",");
		StringBuffer sb = new StringBuffer();
		for(String imageid : imageidArr){
			if(!"".equals(imageid))
				sb.append(",").append(imageid);
		}
		String imageids = sb.toString();
		if(imageids.startsWith(","))
			imageids = imageids.substring(1);
		return imageids;
	}
	
	private String transRequestLevelName(int requestlevel){
		String requestlevelshowname = "";
		if(requestlevel == 0)
			requestlevelshowname = SystemEnv.getHtmlLabelName(225,user.getLanguage());
		else if(requestlevel == 1)
			requestlevelshowname = SystemEnv.getHtmlLabelName(15533,user.getLanguage());
		else if(requestlevel == 2)
			requestlevelshowname = SystemEnv.getHtmlLabelName(2087,user.getLanguage());
		return requestlevelshowname;
	}
	
	private String transMessageTypeName(int messagetype){
		String messagetypeshowname = "";
		if(messagetype == 0)
			messagetypeshowname = SystemEnv.getHtmlLabelName(17583,user.getLanguage());
		else if(messagetype == 1)
			messagetypeshowname = SystemEnv.getHtmlLabelName(17584,user.getLanguage());
		else if(messagetype == 2)
			messagetypeshowname = SystemEnv.getHtmlLabelName(17584,user.getLanguage());
		return messagetypeshowname;
	}
	
	private String transChatsTypeName(int chatstype){
		String chatstypeshowname = "";
		if(chatstype == 0)
			chatstypeshowname = SystemEnv.getHtmlLabelName(19782,user.getLanguage());
		else if(chatstype == 1)
			chatstypeshowname = SystemEnv.getHtmlLabelName(26928,user.getLanguage());
		return chatstypeshowname;
	}
	
	
}
