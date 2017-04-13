package com.api.workflow.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import weaver.conn.RecordSet;
import weaver.docs.category.SecCategoryComInfo;
import weaver.general.Util;
import weaver.general.browserData.BrowserManager;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import weaver.workflow.field.BrowserComInfo;

import com.api.workflow.bean.BrowserFieldAttr;
import com.api.workflow.bean.DetailTableAttr;
import com.api.workflow.bean.FieldInfo;
import com.api.workflow.bean.FileFieldAttr;
import com.api.workflow.bean.SelectFieldAttr;
import com.api.workflow.bean.SelectItem;
import com.api.workflow.bean.SpecialFieldAttr;
import com.api.workflow.bean.TableInfo;
import com.api.workflow.util.ServiceUtil;
import com.cloudstore.dev.api.util.Util_TableMap;

public class FormInfoService {
	
	private int requestid;
	private int workflowid;
	private int nodeid;
	private int formid;
	private int isbill;
	private int isprint;

	private User user;
	private String f_weaver_belongto_userid;
	private String f_weaver_belongto_usertype;
	private RecordSet rs = new RecordSet();
	
	private Map<String,TableInfo> tableinfomap = new LinkedHashMap<String,TableInfo>();
	private Map<String,Integer> detailmap = new HashMap<String,Integer>();
	private int detailnum = 0;
	
	private void init(HttpServletRequest request, HttpServletResponse response, Map<String,Object> params){
		this.f_weaver_belongto_userid = Util.null2String(params.get("f_weaver_belongto_userid"));
		this.f_weaver_belongto_usertype = Util.null2String(params.get("f_weaver_belongto_usertype"));
		this.user = HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype);
		
		this.requestid = Util.getIntValue(Util.null2String(params.get("requestid")), 0);
		this.workflowid = Util.getIntValue(Util.null2String(params.get("workflowid")), 0);
		this.nodeid = Util.getIntValue(Util.null2String(params.get("nodeid")), 0);
		this.formid = Util.getIntValue(Util.null2String(params.get("formid")), 0);
		this.isbill = Util.getIntValue(Util.null2String(params.get("isbill")), -1);
		this.isprint = Util.getIntValue(Util.null2String(params.get("isprint")), 0);
	}
	
	/**
	 * 生成表单信息、主表数据信息、明细表个数等
	 */
	public Map<String,Object> generateFormInfo(HttpServletRequest request, HttpServletResponse response,Map<String,Object> params) throws Exception{
		this.init(request, response, params);
		int ismode = Util.getIntValue(Util.null2String(params.get("ismode")));

		HashMap<String,String> wfinfo = new HashMap<String,String>();
		Map<String,Object> cellinfomap = new HashMap<String,Object>();
		Map<String,String> formatcfgmap = new HashMap<String,String>();
		if(ismode == 2){		//Html模式
			String layoutid = Util.null2String(params.get("modeid"));
			wfinfo.put("wfid", this.workflowid+"");
			wfinfo.put("nodeid", this.nodeid+"");
			wfinfo.put("formid", this.formid+"");
			wfinfo.put("isbill", this.isbill+"");
			wfinfo.put("isprint", this.isprint+"");
			wfinfo.put("modeid", layoutid);
			wfinfo.put("requestid", this.requestid+"");
			wfinfo.put("languageid", user.getLanguage()+"");
			wfinfo.put("iswfshare", Util.null2String(params.get("iswfshare")));
			
			LayoutInfoService layoutinfo = new LayoutInfoService();
			layoutinfo.setUser(user);
			layoutinfo.setWfinfo(wfinfo);
			layoutinfo.parseLayoutJson(layoutid, cellinfomap, formatcfgmap);
		}

		this.appendTableAttr();
		this.appendFieldList(formatcfgmap);
		if(ismode == 0)			//普通模式
			this.appendFieldOrderInfo();
		this.buildDetailRecordNum();
		
		String sessionkey = requestid+"_"+nodeid+"_"+user.getUID()+"_tableinfomap";
		Util_TableMap.setObjVal(sessionkey, tableinfomap);
		
		Map<String,Object> forminfo = new HashMap<String,Object>();
		forminfo.put("detailnum", detailnum);
		forminfo.put("tableinfo", tableinfomap);
		forminfo.put("cellinfo", cellinfomap);
		return forminfo;
	}

	/**
	 * 扩充表单所有table属性、明细权限等
	 */
	private void appendTableAttr(){
		String sql = "";
		//生成主表对象
		TableInfo maintableinfo = new TableInfo();
		tableinfomap.put("main", maintableinfo);
		maintableinfo.setTableindex(-1);
		if(isbill == 0){
			maintableinfo.setTablename("workflow_form");
		}else{
			rs.executeSql("select tablename from workflow_bill where id="+formid);
			if(rs.next())
				maintableinfo.setTablename(rs.getString("tablename"));
		}
		//生成明细表对象
		if(isbill == 0)
			sql = "select distinct groupid as tablename,'' as title from workflow_formfield where formid="+formid+" and isdetail='1' order by groupid";
		else if(isbill == 1)
			sql = "select tablename,title from workflow_billdetailtable where billid="+formid+" order by orderid";
		rs.executeSql(sql);
		this.detailnum = rs.getCounts();
		if(detailnum == 0)
			return;
		int groupid = 1;
		while(rs.next()){
			String tablename = rs.getString("tablename");
			detailmap.put(tablename, groupid);
			
			TableInfo tableinfo = new TableInfo();
			tableinfomap.put("detail_"+groupid, tableinfo);
			tableinfo.setTableindex(groupid);
			if(isbill == 0)
				tableinfo.setTablename("workflow_formdetail");
			else
				tableinfo.setTablename(tablename);
			DetailTableAttr detailbean = new DetailTableAttr();
			detailbean.setGroupid(groupid);
			detailbean.setDetailtable(tablename);
			detailbean.setDetailtitle(rs.getString("title"));
			tableinfo.setDetailtableattr(detailbean);
			groupid++;
		}
		String groupcolumn = "isadd,isedit,isdelete,ishidenull,isdefault,isneed,isopensapmul,defaultrows,isprintserial,allowscroll";
		rs.executeSql("select groupid,"+groupcolumn+" from workflow_nodeformgroup where nodeid="+nodeid+" order by groupid");
		while(rs.next()){
			int groupid_tmp = rs.getInt("groupid")+1;	//从0开始需加1
			if(!tableinfomap.containsKey("detail_"+groupid_tmp))
				continue;
			DetailTableAttr detailbean = tableinfomap.get("detail_"+groupid_tmp).getDetailtableattr();
			detailbean.setIsadd(ServiceUtil.convertInt(rs.getString("isadd")));
			detailbean.setIsedit(ServiceUtil.convertInt(rs.getString("isedit")));
			detailbean.setIsdelete(ServiceUtil.convertInt(rs.getString("isdelete")));
			detailbean.setIshidenull(ServiceUtil.convertInt(rs.getString("ishidenull")));
			detailbean.setIsdefault(ServiceUtil.convertInt(rs.getString("isdefault")));
			detailbean.setIsneed(ServiceUtil.convertInt(rs.getString("isneed")));
			detailbean.setIsopensapmul(ServiceUtil.convertInt(rs.getString("isopensapmul")));
			detailbean.setDefaultrows(ServiceUtil.convertInt(rs.getString("defaultrows")));
			detailbean.setIsprintserial(ServiceUtil.convertInt(rs.getString("isprintserial")));
			detailbean.setAllowscroll(ServiceUtil.convertInt(rs.getString("allowscroll")));
		}
	}
	
	/**
	 * 扩充字段信息
	 */
	private void appendFieldList(Map<String,String> formatcfgmap){
		String sql = "";
		RecordSet rs1 = new RecordSet();
		//生成系统字段信息
		boolean messageType = false;
		boolean chatsType = false;
		rs.executeSql("select messageType,chatsType from workflow_base where id="+this.workflowid);
		if(rs.next()){
			if(rs.getInt("messageType") == 1)	messageType = true;
			if(rs.getInt("chatsType") == 1)		chatsType = true;
		}
		Map<String,FieldInfo> mainfieldinfomap = tableinfomap.get("main").getFieldinfomap();
		rs.executeSql("select fieldid,isview,isedit,ismandatory from workflow_nodeform where nodeid="+this.nodeid+" and fieldid<0");
		while(rs.next()){
			FieldInfo sysfieldbean = new FieldInfo();
			int sysfieldid = Util.getIntValue(rs.getString("fieldid"),0);
			sysfieldbean.setFieldid(sysfieldid);
			sysfieldbean.setIsview(ServiceUtil.convertInt(rs.getString("isview")));
			sysfieldbean.setIsedit(ServiceUtil.convertInt(rs.getString("isedit")));
			sysfieldbean.setIsmand(ServiceUtil.convertInt(rs.getString("ismandatory")));
			if(sysfieldid == -1)
				sysfieldbean.setFieldlabel(SystemEnv.getHtmlLabelName(21192,user.getLanguage()));
			else if(sysfieldid == -2)
				sysfieldbean.setFieldlabel(SystemEnv.getHtmlLabelName(15534,user.getLanguage()));
			else if(sysfieldid == -3){
				if(!messageType)	continue;
				sysfieldbean.setFieldlabel(SystemEnv.getHtmlLabelName(17582,user.getLanguage()));
			}else if(sysfieldid == -4)
				sysfieldbean.setFieldlabel(SystemEnv.getHtmlLabelName(17614,user.getLanguage()));
			else if(sysfieldid == -5){
				if(!chatsType)		continue;
				sysfieldbean.setFieldlabel(SystemEnv.getHtmlLabelName(32812,user.getLanguage()));
			}else if(sysfieldid == -9)
				sysfieldbean.setFieldlabel(SystemEnv.getHtmlLabelName(22308,user.getLanguage()));
			mainfieldinfomap.put(sysfieldid+"", sysfieldbean);
		}
		//生成自定义字段信息
		BrowserComInfo browserComInfo = new BrowserComInfo();
		BrowserManager browserManager = new BrowserManager();
		SecCategoryComInfo secCategoryComInfo = new SecCategoryComInfo();
		//delete------a.fieldshowtypes,locatetype;
		String fieldcolumn = "a.id,a.fieldname,a.fielddbtype,a.fieldhtmltype,a.type,a.textheight,a.childfieldid,a.imgheight,a.imgwidth,a.qfws,a.textheight_2";
		if(isbill == 0){
			String queryfieldsql = "select "+fieldcolumn+",b.fieldorder,b.isdetail,-1 as detailtable from workflow_formdict a,workflow_formfield b "
				+ " where a.id=b.fieldid and b.formid="+formid+" and (b.isdetail is null or b.isdetail<>'1') union all "
				+ " select "+fieldcolumn+",b.fieldorder,b.isdetail,b.groupid as detailtable from workflow_formdictdetail a,workflow_formfield b "
				+ " where a.id=b.fieldid and b.formid="+formid+" and b.isdetail='1' ";
			sql = " select t1.*,t3.fieldlable,t2.isview,t2.isedit,t2.ismandatory from ("+queryfieldsql+") t1 "
				+ " left join workflow_nodeform t2 on t2.fieldid=t1.id and t2.nodeid="+nodeid
				+ " left join workflow_fieldlable t3 on t1.id=t3.fieldid and t3.formid="+formid+" and t3.langurageid="+user.getLanguage()+" order by t1.detailtable,t1.id";
		}else{
			sql = "select "+fieldcolumn+",a.fieldlabel,dsporder as fieldorder,viewtype as isdetail,detailtable,selectitemtype,pubchoiceid,pubchilchoiceid,"
				+ " b.isview,b.isedit,b.ismandatory from workflow_billfield a"
				+ " left join workflow_nodeform b on b.fieldid=a.id and b.nodeid="+nodeid
				+ " where a.billid="+formid+" order by a.viewtype,a.id";
		}
		//System.out.println("sql---"+sql);
		rs.executeSql(sql);
		while(rs.next()){
			int fieldid = rs.getInt("id");
			int isdetail = ServiceUtil.convertInt(rs.getString("isdetail"));
			int htmltype = ServiceUtil.convertInt(rs.getString("fieldhtmltype"));
			int detailtype = ServiceUtil.convertInt(rs.getString("type"));
			String fieldname = rs.getString("fieldname");
			String fielddbtype = rs.getString("fielddbtype");
			int groupid = -1;
			String symbol;
			if(isdetail == 1){	//明细
				groupid = detailmap.get(rs.getString("detailtable"));
				symbol = "detail_"+groupid;
			}else{
				symbol = "main";
			}
			if(!tableinfomap.containsKey(symbol))
				continue;
			TableInfo tableinfo = tableinfomap.get(symbol);
			//表单字段所有列名拼成串
			String tablecolumnstr = Util.null2String(tableinfo.getTablecolumn());
			tablecolumnstr += fieldname + ",";
			//字段list集合
			Map<String,FieldInfo> fieldinfomap = tableinfo.getFieldinfomap();
			FieldInfo bean = new FieldInfo();
			fieldinfomap.put(fieldid+"", bean);
			bean.setFieldid(fieldid);
			bean.setIsview(ServiceUtil.convertInt(rs.getString("isview")));
			bean.setIsedit(ServiceUtil.convertInt(rs.getString("isedit")));
			bean.setIsmand(ServiceUtil.convertInt(rs.getString("ismandatory")));
			bean.setFieldname(fieldname);
			if(isbill == 0)
				bean.setFieldlabel(ServiceUtil.convertChar(rs.getString("fieldlable")));
			else
				bean.setFieldlabel(ServiceUtil.convertChar(SystemEnv.getHtmlLabelName(rs.getInt("fieldlabel"), user.getLanguage())));
			bean.setFielddbtype(fielddbtype);
			bean.setHtmltype(htmltype);
			bean.setDetailtype(detailtype);
			bean.setIsdetail(isdetail);
			bean.setGroupid(groupid);
			if(fielddbtype.indexOf("varchar") > -1){
				int length = Util.getIntValue(fielddbtype.substring(fielddbtype.indexOf("(")+1, fielddbtype.indexOf(")")));
				bean.setLength(length);
			}
			bean.setTextheight(ServiceUtil.convertInt(rs.getString("textheight")));
			if(formatcfgmap.containsKey(fieldid+"")){
				bean.setFormatcfg(formatcfgmap.get(fieldid+""));
			}
			if(htmltype == 1 && (detailtype == 3 || detailtype == 4 || detailtype == 5)){
				int qfws = 2;
				if(detailtype == 3 && fielddbtype.indexOf(",") > -1)			//浮点数
					qfws = Util.getIntValue(fielddbtype.substring(fielddbtype.indexOf(",")+1, fielddbtype.indexOf(")")));
				else if(detailtype == 5)	//千分位字段
					qfws = ServiceUtil.convertInt(rs.getString("qfws"));
				bean.setQfws(qfws);
			}else if(htmltype == 3){	//浏览按钮
				BrowserFieldAttr browserattr = new BrowserFieldAttr();
				bean.setBrowserattr(browserattr);
				browserattr.setBrowserurl(browserComInfo.getBrowserurl(detailtype+""));
				browserattr.setLinkurl(browserComInfo.getLinkurl(detailtype+""));
				browserattr.setIssingle(browserManager.isSingleBrow(detailtype+""));
				browserattr.setCompleteurl(this.getBrowserCompleteUrl(fieldid, detailtype, fielddbtype));
				browserattr.setBindevent(this.getBrowserBindEvent(fieldid, detailtype));
			}else if(htmltype == 5){	//选择框
				SelectFieldAttr selectattr = new SelectFieldAttr();
				bean.setSelectattr(selectattr);
				selectattr.setChildfieldid(ServiceUtil.convertInt(rs.getString("childfieldid")));
				selectattr.setFieldshowtypes(ServiceUtil.convertInt(rs.getString("fieldshowtypes")));
				List<SelectItem> selectlist = new ArrayList<SelectItem>();
				rs1.executeSql("select id,selectvalue,selectname,isdefault,childitemid,cancel,isAccordToSubCom,docCategory from workflow_selectitem where fieldid="
						+fieldid+" and isbill="+isbill+" order by listorder,id");
				while(rs1.next()){
					SelectItem selectitem = new SelectItem();
					selectitem.setSelectvalue(rs1.getInt("selectvalue"));
					selectitem.setSelectname(rs1.getString("selectname"));
					if("y".equals(rs1.getString("isdefault")))
						selectitem.setIsdefault(1);
					else
						selectitem.setIsdefault(0);
					selectitem.setChilditemid(rs1.getString("childitemid"));
					selectitem.setCancel(ServiceUtil.convertInt(rs1.getString("cancel")));
					selectitem.setIsAccordToSubCom(Util.getIntValue(rs1.getString("isAccordToSubCom"), 0));
					String docCategory = Util.null2String(rs1.getString("docCategory"));
					selectitem.setDocCategory(docCategory);
					if(!"".equals(docCategory) && docCategory.indexOf(",")>-1){	//计算文档目录最大上传文件大小
						int secid = Util.getIntValue(docCategory.substring(docCategory.lastIndexOf(",") + 1), -1);
						int maxUploadSize = Util.getIntValue(secCategoryComInfo.getMaxUploadFileSize("" + secid), 5);
						selectitem.setMaxUploadSize(maxUploadSize);
					}
					selectlist.add(selectitem);
				}
				selectattr.setSelectitemlist(selectlist);
			}else if(htmltype == 6){	//图片上传
				FileFieldAttr fileattr = new FileFieldAttr();
				bean.setFileattr(fileattr);
				fileattr.setImgheight(ServiceUtil.convertInt(rs.getString("imgheight")));
				fileattr.setImgwidth(ServiceUtil.convertInt(rs.getString("imgwidth")));
			}else if(htmltype == 7){
				rs1.executeSql("select id,displayname,linkaddress,descriptivetext from workflow_specialfield where fieldid="+fieldid+" and isbill="+isbill);
				if(rs1.next()){
					SpecialFieldAttr specialattr = new SpecialFieldAttr();
					specialattr.setDisplayname(ServiceUtil.convertChar(rs1.getString("displayname")));
					specialattr.setLinkaddress(ServiceUtil.convertChar(rs1.getString("linkaddress")));
					specialattr.setDescriptivetext(ServiceUtil.convertChar(rs1.getString("descriptivetext")));
					bean.setSpecialattr(specialattr);
				}
			}
			tableinfo.setTablecolumn(tablecolumnstr);
		}
	}
	
	/**
	 * 扩充每个明细表条数信息
	 */
	private void buildDetailRecordNum(){
		int billmainid = this.getBillMainId();
		String sql = "";
		for(String key : tableinfomap.keySet()){
			if("main".equals(key))
				continue;
			TableInfo detailinfo = tableinfomap.get(key);
			int tableindex = detailinfo.getTableindex();
			sql = "select count(1) from "+detailinfo.getTablename();
			if(isbill == 0)
				sql += " where requestid="+requestid+" and billformid="+formid+" and groupid="+(tableindex-1);
			else if(isbill == 1)
				sql += " where mainid="+billmainid;
			rs.executeSql(sql);
			if(rs.next())
				detailinfo.setRecordnum(rs.getInt(1));
		}
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
	 * 普通模式，字段排序信息
	 */
	private void appendFieldOrderInfo(){
		for(Map.Entry<String,TableInfo> entry : tableinfomap.entrySet()){
			String symbol = entry.getKey();
			TableInfo tableinfo = entry.getValue();
			List<String> fieldorder = new ArrayList<String>();
			tableinfo.setFieldorder(fieldorder);
			String sql = "";
			if("main".equals(symbol)){
				fieldorder.add("-1");
				fieldorder.add("-2");
				fieldorder.add("-3");
				fieldorder.add("-5");
				if(isbill == 0)
					sql = "select fieldid from workflow_formfield where formid="+formid+" and (isdetail is null or isdetail<>'1') order by fieldorder,fieldid";
				else if(isbill == 1)
					sql = "select id from workflow_billfield where billid="+formid+" and (viewtype is null or viewtype<>1) order by dsporder,id";
			}else{
				if(isbill == 0)
					sql = "select fieldid from workflow_formfield where formid="+formid+" and isdetail='1' and groupid="+(tableinfo.getTableindex()-1)+" order by fieldorder,fieldid";
				else if(isbill == 1)
					sql = "select id from workflow_billfield where billid="+formid+" and viewtype=1 and detailtable='"+tableinfo.getTablename()+"' order by dsporder,id";
			}
			rs.executeSql(sql);
			while(rs.next()){
				fieldorder.add(rs.getString(1));
			}
		}
	}
	
	private String getBrowserCompleteUrl(int fieldid, int detailtype, String fielddbtype){
		String completeurl = "";
		if(detailtype == 160){		//角色人员
			RecordSet rs1 = new RecordSet();
			rs1.execute("select a.level_n,a.level2_n from workflow_groupdetail a,workflow_nodegroup b where a.groupid=b.id and a.type=50 and a.objid="
					+ fieldid +" and b.nodeid in (select nodeid from workflow_flownode where workflowid="+workflowid+")");
			String roleid = "";
			if(rs1.next()){
				roleid = rs.getString(1);
				int rolelevel_tmp = Util.getIntValue(rs.getString(2), 0);
				int beagenter = 0;	//暂设零
				roleid += "a"+rolelevel_tmp+"b"+beagenter;
			}
			completeurl = "javascript:getajaxurl("+detailtype+", '', '', '"+fieldid+"', '"+roleid+"')";
		}else if(detailtype == 161 || detailtype == 162 || detailtype == 256 || detailtype == 257){
			completeurl = "javascript:getajaxurl("+detailtype+", '"+fielddbtype+"')";
		}else{
			completeurl = "javascript:getajaxurl("+detailtype+")";
		}
		return completeurl;
	}
	
	private String getBrowserBindEvent(int fieldid, int detailtype){
		String bindevent = "wfbrowvaluechange(this, "+fieldid+")";
		return bindevent;
	}
	
	
	
}
