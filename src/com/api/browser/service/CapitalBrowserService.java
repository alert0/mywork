package com.api.browser.service;

import java.util.List;
import java.util.Map;

import org.json.JSONObject;

import weaver.conn.RecordSet;
import weaver.cpt.util.CommonShareManager;
import weaver.cpt.util.CptWfUtil;
import weaver.general.Util;
import weaver.general.browserData.BrowserManager;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.resource.ResourceComInfo;
import weaver.proj.util.PropUtil;
import weaver.proj.util.SQLUtil;
import weaver.systeminfo.SystemEnv;
import weaver.systeminfo.systemright.CheckSubCompanyRight;
import weaver.workflow.browserdatadefinition.ConditionField;

/**
 * 资产
 * @author jhy Mar 27, 2017
 *
 */
public class CapitalBrowserService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		RecordSet rs  = new RecordSet();
		User user = (User) params.get("user");
		rs.executeSql("select cptdetachable from SystemSet");
		int detachable=0;
		if(rs.next()){
		    detachable=rs.getInt("cptdetachable");
		}
		int reqid=Util.getIntValue(Util.null2String(params.get("reqid")));

		int belid = user.getUserSubCompany1();
		int userId = user.getUID();
		char flag=Util.getSeparator();
		String sqlwhere1 = Util.null2String(params.get("sqlwhere"));
		String stateid = Util.null2String(params.get("cptstateid"));
		String sptcount = Util.null2String(params.get("cptsptcount"));

		String sqlwhere = " ";
		String tempwhere = sqlwhere1;
		String isCapital = Util.null2String(params.get("isCapital"));
		String isInit = Util.null2String(params.get("isInit"));
		String rightStr = "";
		if(HrmUserVarify.checkUserRight("Capital:Maintenance",user)){
			rightStr = "Capital:Maintenance";
		}
		String blonsubcomid = "";

		String capitalgroupid = Util.null2String(params.get("capitalgroupid"));

		if(!capitalgroupid.equals("")){
			isInit = "1";//从树点击转到的请求
		}
		//资产流转情况页面 可以查看数量是0的资产
		String inculdeNumZero = Util.null2s(Util.null2String(params.get("inculdeNumZero")), "1");
		//判断是否有资产组条件
		int indexofsql;
		if((indexofsql=tempwhere.indexOf("capitalgroupid"))!=-1){
			String tempstr = tempwhere.substring(indexofsql+15);
			tempwhere = tempwhere.substring(0,indexofsql-1);
			tempstr = " (capitalgroupid = "+tempstr.trim()+" or capitalgroupid in(select id from CptCapitalAssortment where supassortmentstr like '%|"+tempstr.trim()+"|%'))";
			tempwhere = tempwhere.concat(tempstr);

		}

		int ishead = 0;
		int isdata = 0;
		if(!sqlwhere1.equals("")){
			if(ishead==0){
				ishead = 1;
				sqlwhere += tempwhere;
			}
			if(sqlwhere1.indexOf("isdata")!=-1){
				String sqlwhere_tmp = sqlwhere1.substring(sqlwhere1.indexOf("isdata")+1);
				int index1 = sqlwhere_tmp.indexOf("'1'");
				int index2 = sqlwhere_tmp.indexOf("'2'");
				int index11 = sqlwhere_tmp.indexOf("1");
				int index22 = sqlwhere_tmp.indexOf("2");
				if(index1==-1 && index2>-1){
					isdata = 2;
				}else if(index1>-1 && index2==-1){
					isdata = 1;
				}else if(index11==-1 && index22>-1){
					isdata = 2;
				}else if(index11>-1 && index22==-1){
					isdata = 1;
				}
			}
			else{
				if(ishead==0){
					ishead = 1;
					sqlwhere += " where isdata = '2' ";
				}
				else{
					sqlwhere += " and isdata = '2' ";
				}
			}
		}else{
			if(ishead==0){
				ishead = 1;
				sqlwhere += " where isdata = '"+("0".equals(isCapital)?"1":"2")+"' ";
			}
			else{
				sqlwhere += " and isdata = '"+("0".equals(isCapital)?"1":"2")+"' ";
			}
		}
		if(isdata==0){
			isdata=2;
		}
		if(!stateid.equals("")){
				sqlwhere += " and stateid in (";
				sqlwhere += Util.fromScreen2(stateid,user.getLanguage());
				sqlwhere += ") ";
		}
		if(!sptcount.equals("")){
				sqlwhere += " and sptcount = '";
				sqlwhere += Util.fromScreen2(sptcount,user.getLanguage());
				sqlwhere += "'";
		}
		if(!capitalgroupid.equals("")&&!capitalgroupid.equals("0")){
		    if("sqlserver".equalsIgnoreCase( rs.getDBType())){

		        String mysql = "WITH cptgroupinfo AS ( ";
		        mysql += "SELECT id,"+
		                "        supassortmentid"+
		                " FROM   cptcapitalassortment"+
		                " WHERE  id = "+capitalgroupid+
		                " UNION ALL"+
		                " SELECT a.id,"+
		                "        a.supassortmentid"+
		                " FROM   cptcapitalassortment AS a,"+
		                "        cptgroupinfo AS b"+
		                " WHERE  a.supassortmentid = b.id";
		        mysql += ") SELECT id FROM cptgroupinfo ";
		        rs.executeSql(mysql);
		        String mycptgroupid="";
		        while(rs.next()){
		            mycptgroupid+=rs.getString("id")+",";
		        }
		        if(mycptgroupid.endsWith(",")){
		            mycptgroupid=mycptgroupid.substring(0,mycptgroupid.length()-1);
		        }
		        if(!"".equals(mycptgroupid)){
		            sqlwhere+=" and capitalgroupid in("+mycptgroupid+")";
		        }


		    }else if("oracle".equalsIgnoreCase( rs.getDBType())){
		        sqlwhere += " and exists(select 1 from (select ts1.id from CPTCAPITALASSORTMENT ts1 start with ts1.ID = '"+capitalgroupid+"' connect by prior ts1.id = ts1.SUPASSORTMENTID) ts2 where ts2.id=T1.CAPITALGROUPID ) ";
		    }
		    else{
		        sqlwhere += " and (capitalgroupid = "+capitalgroupid+" or capitalgroupid in(select id from CptCapitalAssortment where supassortmentstr like '%|"+capitalgroupid+"|%')) ";
		    }

		}

		//权限条件 modify by ds Td:9699
		if(detachable == 1 && userId!=1){
			 if(isdata ==2){
				String sqltmp = "";
				rs.executeProc("HrmRoleSR_SeByURId", ""+userId+flag+rightStr);
				while(rs.next()){
				    blonsubcomid=rs.getString("subcompanyid");
					sqltmp += (", "+blonsubcomid);
				}
				if(!"".equals(sqltmp)){//角色设置的权限
					sqltmp = sqltmp.substring(1);
						sqlwhere += " and blongsubcompany in ("+sqltmp+") ";
				}else{
						sqlwhere += " and blongsubcompany in ("+belid+") ";
				}
			}else if(isdata==1){
				CheckSubCompanyRight cscr = new CheckSubCompanyRight();
				int allsubids[] = cscr.getSubComByUserRightId(user.getUID(),rightStr);
				String allsubid = "";
				for(int i=0;i<allsubids.length;i++){
					if(allsubids[i]>0){
						allsubid += (allsubid.equals("")?"":",") + allsubids[i];
					}	
				}
				if(allsubid.equals("")) allsubid = user.getUserSubCompany1() + "";
				if(!"".equals(allsubid)){//角色设置的权限
						sqlwhere += " and blongsubcompany in ("+allsubid+") ";
				}else{
						sqlwhere += " and blongsubcompany in ("+allsubid+") ";
				}
			}
		}

		//流程浏览定义条件
		if("1".equals( isCapital)){
			int bdf_wfid=Util.getIntValue(Util.null2String(params.get("bdf_wfid")),-1);
			int bdf_fieldid=Util.getIntValue(Util.null2String(params.get("bdf_fieldid")),-1);
			int bdf_viewtype=Util.getIntValue(Util.null2String(params.get("bdf_viewtype")),-1);
			List<ConditionField> lst=null;
			if(params.get("bdf_wfid")!=null && (lst=ConditionField.readAll(bdf_wfid, bdf_fieldid, bdf_viewtype)).size()>0){
				ResourceComInfo rci = new ResourceComInfo();
				for(int i=0;i<lst.size();i++){
					ConditionField f=lst.get(i);
					String fname=f.getFieldName();
					String fvalue= f.getValue();
					boolean isHide=f.isHide();
					boolean isReadOnly= f.isReadonly();
					if(isHide||isReadOnly){
						if(!"".equals(fvalue) && "mark".equalsIgnoreCase(fname)){
							sqlwhere+=" and t1.mark like '%"+fvalue+"%' ";
						}else if(!"".equals(fvalue) && "fnamark".equalsIgnoreCase(fname)){
							sqlwhere+=" and t1.fnamark like '%"+fvalue+"%' ";
						}else if(!"".equals(fvalue) && "name".equalsIgnoreCase(fname)){
							sqlwhere+=" and t1.name like '%"+fvalue+"%' ";
						}else if(!"".equals(fvalue) && "capitalSpec".equalsIgnoreCase(fname)){
							sqlwhere+=" and t1.capitalSpec like '%"+fvalue+"%' ";
						}else if("departmentid".equalsIgnoreCase(fname)){
							String vtype= f.getValueType();
							if("1".equals(vtype)){//当前操作者的值
								fvalue=rci.getDepartmentID( ""+user.getUID());
							}else if("3".equals(vtype)){//取表单字段值
								fvalue="";
								if(f.isGetValueFromFormField()){
									fvalue=Util.null2String( f.getDepartmentIds( Util.null2String(params.get("bdf_"+fname)).split(",")[0]));
								}
							}
							if(!"".equals(fvalue)){
								sqlwhere+=" and t1.departmentid='"+fvalue+"' ";
							}
						}
					}
					
				}
			}
		}

		String needHideField=",";//用来隐藏字段
		if(!"1".equals(isCapital)){//资产资料
			needHideField+="isinner,barcode,fnamark,stateid,blongdepartment,departmentid,capitalnum,startdate,enddate,manudate,stockindate,location,selectdate,contractno,invoice,deprestartdate,usedyear,currentprice,";
		}
		//组合查询条件
		String queryformjson=Util.null2String(params.get("queryformjsoninfo"));
		//System.out.println("queryformjson:"+queryformjson);
		if(!"".equals(queryformjson)){
			RecordSet rs_condition = new RecordSet();
			StringBuffer cusSql=new StringBuffer();//自定义字段条件
			net.sf.json.JSONObject jsonObject= net.sf.json.JSONObject.fromObject(queryformjson);
			String sql_condition="select t1.*,t2.fieldname,t2.fieldlabel,t2.fieldhtmltype,t2.type,t2.issystem from cpt_browdef t1,cptDefineField t2 where t1.iscondition=1 and t1.fieldid=t2.id  order by t1.displayorder";
			rs_condition.executeSql(sql_condition);
			while(rs_condition.next()){
				String fieldname=Util.null2String(rs_condition.getString("fieldname"));
			    int fieldhtmltype=Util.getIntValue(rs_condition.getString("fieldhtmltype"),0);
				if(needHideField.contains(","+fieldname+",")) continue;
				if(fieldhtmltype==2||fieldhtmltype==6||fieldhtmltype==7){
					continue;
				}
				String fieldid=Util.null2String(rs_condition.getString("fieldid"));
			    String fielddbtype=Util.null2String(rs_condition.getString("fielddbtype"));
			    String type=Util.null2String(rs_condition.getString("type"));
				String val=Util.null2String( jsonObject.get(fieldname));
				int issystem=Util.getIntValue(rs_condition.getString("issystem"),0);
			    if(issystem!=1){
			    	val=Util.null2String( jsonObject.get("field"+fieldid));
			    }
				//System.out.println("key:"+fieldname+"\tval:"+val+"\tfieldhtmltype:"+fieldhtmltype+"\ttype:"+type);
				if(!"".equals(val)){
					if(fieldhtmltype==3){
			 			boolean isSingle="true".equalsIgnoreCase( BrowserManager.browIsSingle(""+type));
			 			if(isSingle){
			 				cusSql.append( " and t1."+fieldname+" ='"+val+"'  ");
			 			}else {
			 				String dbtype= rs_condition.getDBType();
			 				if("oracle".equalsIgnoreCase(dbtype)){
			 					cusSql.append(SQLUtil.filteSql(rs_condition.getDBType(),  " and ','+t1."+fieldname+"+',' like '%,"+val+",%'  "));
			 				}else{
			 					cusSql.append(" and ','+convert(varchar(2000),t1."+fieldname+")+',' like '%,"+val+",%'  ");
			 				}
						}
			 		}else if(fieldhtmltype==4){
			 			if("1".equals(val)){
			 				cusSql.append(" and t1."+fieldname+" ='"+val+"'  ");
			 			}
			 		}else if(fieldhtmltype==5){
			 			cusSql.append(" and exists(select 1 from cpt_SelectItem ttt2 where ttt2.fieldid="+fieldid+" and ttt2.selectvalue='"+val+"' and ttt2.selectvalue=t1."+fieldname+" ) ");
			 		}else{
			 			cusSql.append(" and t1."+fieldname+" like'%"+val+"%'  ");
			 		}
				}
			}
			if(cusSql.length()>5){
				sqlwhere+=cusSql.toString();
			}
		}
		//System.out.println("sqlwhere:"+sqlwhere);
			
		String pageId=Util.null2String(PropUtil.getPageId("cpt_capitalbrowserlist"));
		if("1".equals(isCapital)){
			CommonShareManager chm = new CommonShareManager();
			chm.setAliasTableName("t2");
			sqlwhere+= " and exists(select 1 from CptCapitalShareInfo t2 where t2.relateditemid=t1.id and ("+chm.getShareWhereByUser("cpt", user)+") ) ";
		}
		if(isInit.equals("0")) {
			sqlwhere += " and 1=2"; 
		}
		if(params.get("currpage")!=null) {
//			String pageSqlKey = Util.null2String(params.get("pagesql"));
//			sqlwhere ="";
//			if(session.getAttribute(pageSqlKey)!=null){
//				sqlwhere = (String)session.getAttribute(pageSqlKey);
//			}
		}

		String orderby =" t1.id ";
		String tableString = "";
		int perpage=7;                                 
		String backfields = " t1.*,"+("oracle".equalsIgnoreCase( rs.getDBType())?"(nvl(capitalnum,0)-nvl(frozennum,0))":"(isnull(capitalnum,0)-isnull(frozennum,0))")+" cptnum ";
		String fromSql  = " CptCapital t1 ";


		//剔除掉在途的请求自身的数量
		String includeNumZeroSqlwhere="";
		if(!"1".equals(inculdeNumZero)&& (2==isdata) ){
				includeNumZeroSqlwhere = " and  ";
			if("oracle".equalsIgnoreCase(rs.getDBType())){
				includeNumZeroSqlwhere += "  (nvl(capitalnum,0)-nvl(frozennum,0))>0 ";
			}else{
				includeNumZeroSqlwhere += "  (isnull(capitalnum,0)-isnull(frozennum,0))>0 ";
			}
		}
		if(reqid>0&&"1".equals(isCapital)){
			String sql2="select t1.currentnodetype,t1.workflowid,t2.formid from workflow_requestbase t1,workflow_base t2 where t1.workflowid=t2.id and t1.requestid="+reqid;
			int formid=0;
			int wfid=0;
			int currentnodetype=0;
			
			rs.executeSql(sql2);
			while(rs.next()){
				formid=rs.getInt("formid");
				wfid=rs.getInt("workflowid");
				currentnodetype=rs.getInt("currentnodetype");
			}
		    rs.executeSql("select wftype  from cpt_cptwfconf where wfid="+wfid);
			String wftype="";
			if(rs.next()){
				wftype=Util.null2String(rs.getString("wftype"));
			}
			if(!"apply".equals(wftype)){
			
				if(currentnodetype>0&&currentnodetype<3 ){
					CptWfUtil cwfu = new CptWfUtil();
					JSONObject jsonObject= cwfu.getCptwfInfo(""+wfid);
					if(jsonObject.length()>0){
						String cptmaintablename="formtable_main_"+(-formid);
						rs.execute("select tablename from workflow_bill where id="+formid);
						while(rs.next()){
							cptmaintablename=rs.getString("tablename");
						}
						String cptdetailtablename=cptmaintablename;
						String zcname=jsonObject.getString("zcname");
						String zcsl=jsonObject.getString("slname");
						int zcViewtype=Util.getIntValue( ""+jsonObject.getInt("zctype"),0);
						if(zcViewtype==1){
							cptdetailtablename+="_dt1";
						}else if(zcViewtype==2){
							cptdetailtablename+="_dt2";
						}else if(zcViewtype==3){
							cptdetailtablename+="_dt3";
						}else if(zcViewtype==4){
							cptdetailtablename+="_dt4";
						}
						String cptsearchsql="";
						if(!cptdetailtablename.equals(cptmaintablename)){
							cptsearchsql=" select d."+zcname+" as currentzcid,sum(d."+zcsl+") as currentreqnum from "+cptmaintablename+" m ,"+cptdetailtablename+" d where d.mainid=m.id and m.requestid="+reqid+" group by d."+zcname+" ";
						}else{
							cptsearchsql="select m."+zcname+" as currentzcid,sum(m."+zcsl+") as currentreqnum from "+cptmaintablename+" m  where  m.requestid="+reqid+" group by m."+zcname+" ";
						}
						
						backfields = " t2.currentreqnum,t1.*,"+("oracle".equalsIgnoreCase( rs.getDBType())?"(nvl(capitalnum,0)-nvl(frozennum,0)+nvl(currentreqnum,0))":"(isnull(capitalnum,0)-isnull(frozennum,0)+isnull(currentreqnum,0))")+" cptnum ";
						fromSql  = " CptCapital t1 left outer join ("+cptsearchsql+") t2 on t2.currentzcid=t1.id ";
						
						if(ishead==0){
							ishead = 1;
							includeNumZeroSqlwhere=" where ";
						}else{
							includeNumZeroSqlwhere = " and  ";
						}
						if("oracle".equalsIgnoreCase(rs.getDBType())){
							includeNumZeroSqlwhere += "  (nvl(capitalnum,0)-nvl(frozennum,0)+nvl(currentreqnum,0))>0 ";
						}else{
							includeNumZeroSqlwhere += "  (isnull(capitalnum,0)-isnull(frozennum,0)+isnull(currentreqnum,0))>0 ";
						}
					}
				}
			}
		}

		//out.println("sql:\n select "+backfields+" from "+fromSql+" "+sqlwhere+includeNumZeroSqlwhere+" order by "+orderby);
		String sql_title="select t1.*,t2.fieldname,t2.fieldlabel,t2.fieldhtmltype,t2.type from cpt_browdef t1,cptDefineField t2 where t1.istitle=1 and t1.fieldid=t2.id  order by t1.displayorder";
		rs.executeSql(sql_title);

		tableString =   " <table  pagesize=\""+perpage+"\" instanceid=\"BrowseTable\" id=\"BrowseTable\" tabletype=\"none\"  >"+
		                "       <sql backfields=\""+backfields+"\" sqlform=\""+fromSql+"\" sqlwhere=\""+Util.toHtmlForSplitPage(sqlwhere+includeNumZeroSqlwhere)+"\"  sqlorderby=\""+orderby+"\"  sqlprimarykey=\"t1.id\" sqlsortway=\"asc\" sqlisdistinct=\"false\" />"+
		                "       <head>"+
		                "           <col width=\"0%\" hide=\"true\" text=\""+"ID"+"\" column=\"id\"  transmethod='weaver.cpt.util.CapitalTransUtil.getBrowserRetInfo' otherpara='"+isCapital+"' />";
		                while(rs.next()){
		                	String fieldname=rs.getString("fieldname");
		                	if(needHideField.contains(","+fieldname+",")) continue;
		                	int fieldid=rs.getInt("fieldid");
		                	int fieldlabel=rs.getInt("fieldlabel");
		                	int fieldhtmltype=rs.getInt("fieldhtmltype");
		                	int type=rs.getInt("type");
		                	if("resourceid".equalsIgnoreCase(fieldname)&&!"1".equals(isCapital) ){
		                		fieldlabel=1507;
		                	}
		                	if("capitalnum".equalsIgnoreCase(fieldname)){
		                		fieldname="cptnum";
		                	}
		                	
		                	tableString+="<col width=\"5%\"  text=\""+SystemEnv.getHtmlLabelName(fieldlabel ,user.getLanguage()) +"\" column=\""+fieldname+"\" orderkey=\""+fieldname+"\" otherpara=\""+user.getUID()+"+"+fieldid+"+"+fieldhtmltype+"+"+type+"\" transmethod='weaver.cpt.util.CptFieldManager.getBrowserFieldvalue' />";
		                }
		                tableString+="       </head>"+
		                " </table>";
		
		
		return super.getBrowserData(params);
	}
	

}
