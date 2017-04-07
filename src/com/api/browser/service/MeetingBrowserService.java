package com.api.browser.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.api.browser.util.SqlUtils;
import com.cloudstore.dev.api.util.Util_TableMap;

import weaver.general.TimeUtil;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;
import weaver.workflow.browserdatadefinition.ConditionField;

/**
 * 会议
 * @author jhy Mar 27, 2017
 *
 */
public class MeetingBrowserService extends BrowserService {

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		String name = Util.null2String(params.get("name"));
		String address = Util.null2String(params.get("address"));
		String begindatefrom = Util.null2String(params.get("begindatefrom"));
		String begindateto = Util.null2String(params.get("begindateto"));
		int timeSag = Util.getIntValue(Util.null2String(params.get("timeSag")));
		String flag = Util.null2String(params.get("flag"));

		String bdf_wfid = Util.null2String(params.get("bdf_wfid"));
		String bdf_fieldid = Util.null2String(params.get("bdf_fieldid"));
		String bdf_viewtype = Util.null2String(params.get("bdf_viewtype"));
		boolean isbdf=false;
		List<ConditionField> list=null;
		ConditionField conditionField=null;
		String conditionFieldName="";
		if(!"".equals(bdf_wfid)&&!"".equals(bdf_fieldid)&&!"".equals(bdf_viewtype)){
			list=ConditionField.readAll(Util.getIntValue(bdf_wfid),Util.getIntValue(bdf_fieldid),Util.getIntValue(bdf_viewtype));
		}

		if(list!=null&&list.size()>0){
			isbdf=true;
			if(!"1".equals(flag)){//是否是点击搜索 1表示点击搜索
				for(int i=0;i< list.size();i++){
					conditionField=list.get(i);
					conditionFieldName=conditionField.getFieldName();
					
					//处理后台设置默认值
					if("name".equalsIgnoreCase(conditionFieldName)){
						name="".equals(name)?conditionField.getValue():name;
					}else if("address".equalsIgnoreCase(conditionFieldName)){
						if("2".equals(conditionField.getValueType())){
							address="".equals(address)?conditionField.getValue():address;
						}else if("3".equals(conditionField.getValueType())){
							if(conditionField.isGetValueFromFormField()){
								String formAddress=Util.null2String(params.get("bdf_address"));
								address="".equals(address)?formAddress:address;//获取表单字段值
							}
						}
					}else if("begindateselect".equalsIgnoreCase(conditionFieldName)){
						int selectType=Util.getIntValue(conditionField.getValueType(),0);
						if(selectType==6){
							begindatefrom="".equals(begindatefrom)?conditionField.getStartDate():begindatefrom;
							begindateto="".equals(begindateto)?conditionField.getEndDate():begindateto;
						}else if(selectType==8){//获取表单字段值
							if(conditionField.isGetValueFromFormField()){
								String formDate=Util.null2String(params.get("bdf_begindateselect"));
								begindatefrom="".equals(begindatefrom)?formDate:begindatefrom;
								begindateto="".equals(begindateto)?formDate:begindateto;
							}
							selectType=6;
						}
						timeSag=timeSag>-1?timeSag:selectType;
					}
				}
			}
		}
		//如果timeSag==-1则赋值0
		timeSag=timeSag==-1?0:timeSag;
		String titlename ="";
		String sqlwhere="";
		sqlwhere+=" and meetingstatus=2 and repeattype=0";
		if(!name.equals("")) {
		    sqlwhere += " and  name like '%"+name+"%'";
		} 

		if(!address.equals("")) {
		    sqlwhere += " and  address ="+address;
		} 
		//时间处理
		if(timeSag > 0&&timeSag<6){
			String tempfromdate = TimeUtil.getDateByOption(""+timeSag,"0");
			String tempenddate = TimeUtil.getDateByOption(""+timeSag,"1");
			if(!tempfromdate.equals("")){
				sqlwhere += " and begindate >= '" + tempfromdate + "'";
			}
			if(!tempenddate.equals("")){
				sqlwhere += " and begindate <= '" + tempenddate + "'";
			}
		}else{
			if(timeSag==6){//指定时间
				if (!begindatefrom.equals("")) {
				    sqlwhere += " and begindate>='" + begindatefrom + "'";
				}
				if (!begindateto.equals("")) {
				    sqlwhere += " and begindate<='" + begindateto + "'";
				}
			}
		} 
		
		//得到pageNum 与 perpage
		int perpage=9;
		//设置好搜索条件
		String backFields =" id ,name,begindate,address,customizeaddress ";
		String fromSql = " meeting ";
		
		sqlwhere  = SqlUtils.replaceFirstAnd(sqlwhere);
		String orderBy = "begindate desc";
		String tableString=""+
					"<table pagesize=\""+perpage+"\" tabletype=\"none\">"+
					"<sql backfields=\""+backFields+"\" sqlform=\""+Util.toHtmlForSplitPage(fromSql)+"\" sqlorderby=\""+orderBy+"\"  sqlprimarykey=\"id\" sqlsortway=\"desc\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere)+"\" />"+
					"<head>"+
						"<col width=\"10%\"  text=\""+SystemEnv.getHtmlLabelName(84,user.getLanguage())+"\" column=\"id\" orderkey=\"id\"  />"+
						"<col width=\"30%\"  text=\""+SystemEnv.getHtmlLabelName(195,user.getLanguage())+"\" column=\"name\" orderkey=\"name\" />"+
						"<col width=\"30%\"  text=\""+SystemEnv.getHtmlLabelName(742,user.getLanguage())+"\" column=\"begindate\" orderkey=\"begindate\" />"+
						"<col width=\"30%\"  text=\""+SystemEnv.getHtmlLabelName(780,user.getLanguage())+"\" column=\"address\" orderkey=\"address\" otherpara=\""+user.getLanguage()+"+column:customizeaddress\" transmethod=\"weaver.meeting.Maint.MeetingTransMethod.getMeetingAddress\"  />"+
					"</head>"+
					"</table>";
		
		String sessionkey = Util.getEncrypt(Util.getRandom());
		Util_TableMap.setVal(sessionkey, tableString);
		apidatas.put("result", sessionkey);
		return apidatas;
	}
}
