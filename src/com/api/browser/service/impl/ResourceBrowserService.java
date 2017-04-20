package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import weaver.general.Util;
import weaver.general.browserData.BrowserManager;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.appdetach.AppDetachComInfo;
import weaver.hrm.company.DepartmentComInfo;
import weaver.hrm.company.SubCompanyComInfo;
import weaver.hrm.resource.MutilResourceBrowser;
import weaver.hrm.resource.ResourceComInfo;
import weaver.systeminfo.systemright.CheckSubCompanyRight;
import weaver.workflow.browserdatadefinition.ConditionField;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.api.browser.service.BrowserService;

/**
 * 人力资源
 * @author jhy Apr 18, 2017
 *
 */
public class ResourceBrowserService extends BrowserService{

	@Override
	public Map<String, Object> browserAutoComplete(String type, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		String whereClause = "";
		ResourceComInfo resourceComInfo = new ResourceComInfo();
		SubCompanyComInfo subCompanyComInfo = new SubCompanyComInfo();
		User user = HrmUserVarify.getUser(request,response);
		String virtualtype = Util.null2String(request.getParameter("virtualtype"));
		//人力资源 165 分权单人力 166 分权多人力
		if(whereClause.equals("")){
			whereClause = "t1.departmentid = t2.id";
		}else{
			whereClause += " and t1.departmentid = t2.id";
		}
		if(Util.getIntValue(virtualtype)<-1){
			whereClause += " and t1.virtualtype = "+virtualtype;
		}
		
		if(whereClause.indexOf("status")!=-1){
			//包含status 说明外部已控制状态
		}else{
			//只显示在职人员
			if(whereClause.equals("")){
				whereClause+=" (t1.status = 0 or t1.status = 1 or t1.status = 2 or t1.status = 3) ";
			}else{
				whereClause+=" and (t1.status = 0 or t1.status = 1 or t1.status = 2 or t1.status = 3) ";
			}
		}
		
		/***********流程浏览数据定义功能 begin**************/
		String bdf_wfid = Util.null2String(request.getParameter("bdf_wfid"));
		String bdf_fieldid = Util.null2String(request.getParameter("bdf_fieldid"));
		String bdf_viewtype = Util.null2String(request.getParameter("bdf_viewtype"));
		List<ConditionField> lsConditionField = null;
		if(bdf_wfid.length()>0){
			lsConditionField = ConditionField.readAll(Util.getIntValue(bdf_wfid),Util.getIntValue(bdf_fieldid),Util.getIntValue(bdf_viewtype));
		}
		
		if(lsConditionField!=null&&lsConditionField.size()>0){
		for(ConditionField conditionField : lsConditionField ){
			String filedname = conditionField.getFieldName();
			String valuetype = conditionField.getValueType();
			boolean isReadonly = conditionField.isReadonly();
			boolean isHide=conditionField.isHide();
			if(!isReadonly && !isHide)continue;
			
			boolean isGetValueFromFormField = conditionField.isGetValueFromFormField();
			String filedvalue = "";
			if(isGetValueFromFormField){
				//表单字段 bdf_fieldname
				filedvalue = Util.null2String(request.getParameter("bdf_"+filedname));
				if(filedvalue.length()>0){
					filedvalue = Util.TokenizerString2(filedvalue,",")[0];
					if(filedname.equals("subcompanyid")){
						filedvalue = conditionField.getSubcompanyIds(filedvalue);
					}else if(filedname.equals("departmentid")){
						filedvalue = conditionField.getDepartmentIds(filedvalue);
					}
				}
			}else{
				if(valuetype.equals("1")){
					//当前操作者所属
					if(filedname.equals("subcompanyid")){
						filedvalue = ""+resourceComInfo.getSubCompanyID(""+user.getUID());
					}else if(filedname.equals("departmentid")){
						filedvalue = ""+resourceComInfo.getDepartmentID(""+user.getUID());
					}
				}else{
					//指定字段
					filedvalue = conditionField.getValue();
				}
			}
			
			if(Util.null2String(filedvalue).length()>0){
				if(filedname.equals("lastname")){
				 	whereClause += " and t1.lastname = '"+filedvalue+"' ";
				}else if(filedname.equals("status")){
					if(filedvalue.equals("8") || filedvalue.equals("")){
						whereClause += " and t1.status in ( 0,1,2,3 )";
					}
				}else if(filedname.equals("subcompanyid")){
					whereClause += " and t1.subcompanyid1 = '"+filedvalue+"' ";
				}else if(filedname.equals("departmentid")){
					whereClause += " and t1.departmentid = '"+filedvalue+"' ";
				}else if(filedname.equals("jobtitle")){
					whereClause += " and t1.jobtitle = '"+filedvalue+"' ";
				}else if(filedname.equals("roleid")){
					whereClause += " and t1.ID in (select hrmrolemembers.ResourceID from hrmrolemembers ,hrmroles where hrmrolemembers.roleid = hrmroles.ID and hrmroles.ID="+filedvalue+" ) " ;
				}
			}
		}
		}
		/***********流程浏览数据定义功能 end **************/
		HttpSession session = request.getSession();
		if(type.equals("165") || type.equals("166")){
	    int beagenter = Util.getIntValue((String)session.getAttribute("beagenter_"+user.getUID()));
	    if(beagenter <= 0){
	    	beagenter = user.getUID();
	    }
	    int fieldid=Util.getIntValue(request.getParameter("fieldid"));
	    int isdetail=Util.getIntValue(request.getParameter("isdetail"));
	    int isbill=Util.getIntValue(request.getParameter("isbill"),1);
	    if(fieldid!=-1){
	    	CheckSubCompanyRight checkSubCompanyRight = new CheckSubCompanyRight();
	    	checkSubCompanyRight.setDetachable(1);
	    	checkSubCompanyRight.setIsbill(isbill);
	    	checkSubCompanyRight.setFieldid(fieldid);
	    	checkSubCompanyRight.setIsdetail(isdetail);
		    boolean onlyselfdept=checkSubCompanyRight.getDecentralizationAttr(beagenter,"Resources:decentralization",fieldid,isdetail,isbill);
		    boolean isall=checkSubCompanyRight.getIsall();
		    String departments=Util.null2String(checkSubCompanyRight.getDepartmentids());
		    String subcompanyids=Util.null2String(checkSubCompanyRight.getSubcompanyids());
		    if(!isall){
		        if(onlyselfdept){
		        		if(departments.length()>0&&!departments.equals("0")){
		        			whereClause+=" and t1.departmentid in("+departments+")";
		        		}
		        }else{
		        		if(subcompanyids.length()>0&&!subcompanyids.equals("0")){
		        			whereClause+=" and t1.subcompanyid1 in("+subcompanyids+")";
		        		}
		        }
		    }
	    }
		}else if(type.equals("160")){
			String roleids = Util.null2String(request.getParameter("roleid"));
			ArrayList resourcrole = Util.TokenizerString(roleids,"_");
			String roleid="0";
			int uid = user.getUID();
			if (resourcrole.size()>0) roleid=""+resourcrole.get(0);
			int index = roleid.indexOf("a");
			int rolelevel = 0;
			if(index > -1){
				int roledid_tmp = Util.getIntValue(roleid.substring(0, index), 0);
				String rolelevelStr = roleid.substring(index+1);
				
				roleid = ""+roledid_tmp;
				index = rolelevelStr.indexOf("b");
				if(index > -1){
					rolelevel = Util.getIntValue(rolelevelStr.substring(0, index), 0);
					uid = Util.getIntValue(rolelevelStr.substring(index+1), 0);
					if(uid <= 0){
						uid = user.getUID();
					}
				}else{
					rolelevel= Util.getIntValue(rolelevelStr);
				}
			}

			if(roleid.length()==0){
				whereClause+=" and 1=2 ";
			}else{
				whereClause+=" and t1.ID in (select ResourceID from hrmrolemembers a,hrmroles b where a.roleid = b.ID and b.ID="+roleid+")";
			}
			
			if(rolelevel != 0){
				if(rolelevel == 1){
					int subcomid = Util.getIntValue(resourceComInfo.getSubCompanyID(""+uid), 0);
					whereClause += " and t1.subcompanyid1="+subcomid+" ";
				}else if(rolelevel == 2){
					int subcomid = Util.getIntValue(resourceComInfo.getSubCompanyID(""+uid), 0);
					int supsubcomid = Util.getIntValue(subCompanyComInfo.getSupsubcomid(""+subcomid), 0);
					whereClause += " and t1.subcompanyid1="+supsubcomid+" ";
				}else if(rolelevel == 3){
					int departid = Util.getIntValue(resourceComInfo.getDepartmentID(""+uid), 0);
					whereClause += " and t1.departmentid="+departid+" ";
				}
			}
		}
		//Added by wcd 2014-11-28 增加分权控制 start
		AppDetachComInfo appDetachComInfo  = new AppDetachComInfo();
		String tempSql = appDetachComInfo.getScopeSqlByHrmResourceSearch(String.valueOf(user.getUID()), true, "resource_t1");
		whereClause += (tempSql==null||tempSql.length()==0) ? "" : (" and "+tempSql);
		//Added by wcd 2014-11-28 增加分权控制 end
		BrowserManager browserManager = new BrowserManager();
		browserManager.setType(type);
		browserManager.setOrderKey("t1.dsporder");
		browserManager.setOrderWay("asc");
		String result  = "";
		if(Util.getIntValue(virtualtype)<-1){
			result = browserManager.getResult(request, "t1.id,lastname,departmentname", "HrmResourcevirtualview t1,hrmdepartmentvirtual t2", whereClause, PAGENUM,"t1");
		}else{
			result = browserManager.getResult(request, "t1.id,lastname,departmentname", "hrmresource t1,hrmdepartment t2", whereClause, PAGENUM,"t1");
		}
		
		DepartmentComInfo deptComInfo = new DepartmentComInfo();
		JSONArray arr = (JSONArray)JSON.parse(result);
		for(int i = 0 ; i < arr.size();i++){
			JSONObject userInfo  = (JSONObject)arr.get(i);
			String resourceid  = userInfo.getString("id");
			userInfo.put("lastname", resourceComInfo.getLastname(resourceid));
			userInfo.put("jobtitlename", MutilResourceBrowser.getJobTitlesname(resourceid));
			userInfo.put("icon", resourceComInfo.getMessagerUrls(resourceid));
			userInfo.put("type", "resource");
			userInfo.put("departmentname", deptComInfo.getDepartmentname(resourceComInfo.getDepartmentID(resourceid)));
			String subcompanyid  = deptComInfo.getSubcompanyid1(resourceComInfo.getDepartmentID(resourceid));
			String parentsubcompanyid  = subCompanyComInfo.getSupsubcomid(subcompanyid);
			userInfo.put("subcompanyname", subCompanyComInfo.getSubcompanyname(subcompanyid));
			userInfo.put("supsubcompanyname", subCompanyComInfo.getSubcompanyname(parentsubcompanyid));
		}
		apidatas.put("datas", arr);
		return apidatas;
	}
}
