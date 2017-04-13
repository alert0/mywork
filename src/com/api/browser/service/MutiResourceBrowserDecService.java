package com.api.browser.service;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import java.util.StringTokenizer;

import javax.servlet.http.Cookie;

import org.json.JSONArray;
import org.json.JSONObject;

import weaver.conn.RecordSet;
import weaver.file.Prop;
import weaver.general.GCONST;
import weaver.general.SplitPageParaBean;
import weaver.general.SplitPageUtil;
import weaver.general.Util;
import weaver.hrm.User;
import weaver.hrm.company.DepartmentComInfo;
import weaver.hrm.company.SubCompanyComInfo;
import weaver.hrm.resource.ResourceComInfo;
import weaver.systeminfo.systemright.OrganizationUtil;

/**
 * 分权多人力
 * @author jhy Apr 11, 2017
 *
 */
public class MutiResourceBrowserDecService extends BrowserService {

//	@Override
//	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
//		Map<String, Object> apidatas = new HashMap<String, Object>();
//		User user = (User) params.get("user");
//		String src = Util.null2String(params.get("src"));
//		String tabid = Util.null2String(params.get("tabid"));
//		String nodeid = Util.null2String(params.get("nodeid"));
//		String mode=Prop.getPropValue(GCONST.getConfigFile() , "authentic");
//		String companyid = Util.null2String(params.get("companyid"));
//		String subcompanyid = Util.null2String(params.get("subcompanyid"));
//		String departmentid = Util.null2String(params.get("departmentid"));
//		String groupid = Util.null2String(params.get("groupid"));
//		String isNoAccount = Util.null2String(params.get("isNoAccount"));
//
//		int fieldid=Util.getIntValue(Util.null2String(params.get("fieldid")));
//		int isdetail=Util.getIntValue(Util.null2String(params.get("isdetail")));
//		int isbill=Util.getIntValue(Util.null2String(params.get("isbill")),1);
//		RecordSet rs = new RecordSet();
//		boolean isoracle = rs.getDBType().equals("oracle");
//		if(tabid.equals("")) tabid="0";
//
//		int uid=user.getUID();
//		    String rem = null;
////		    Cookie[] cks = request.getCookies();
////
////		    for (int i = 0; i < cks.length; i++) {
////		        //System.out.println("ck:"+cks[i].getName()+":"+cks[i].getValue());
////		        if (cks[i].getName().equals("resourcemulti" + uid)) {
////		            rem = cks[i].getValue();
////		            break;
////		        }
////		    }
////
////		    if (rem != null)
////		        rem = tabid + rem.substring(1);
////		    else
////		        rem = tabid;
////		    if (!nodeid.equals(""))
////		        rem = rem.substring(0, 1) + "|" + nodeid;
////
////		Cookie ck = new Cookie("resourcemulti"+uid,rem);  
////		ck.setMaxAge(30*24*60*60);
////		response.addCookie(ck);
//
//		String[] atts=Util.TokenizerString2(rem,"|");
//		if(tabid.equals("0")&&atts.length>1){
//		   nodeid=atts[1];
//		  if(nodeid.indexOf("com")>-1){
//		    //subcompanyid=nodeid.substring(nodeid.indexOf("_")+1);
//		    //System.out.println("subcompanyid"+subcompanyid);
//		    }
//		  else{
//		    //departmentid=nodeid.substring(nodeid.lastIndexOf("_")+1);
//		    //System.out.println("departmentid"+departmentid);
//		    }
//		}
//		else if(tabid.equals("1") && atts.length>1) {
//			//groupid=atts[1];
//		}
//		//System.out.println("departmentid"+departmentid);
//		//System.out.println("tabid"+tabid);
//
//		String check_per = Util.null2String(params.get("selectedids"));
//		if(check_per.equals(",")){
//			check_per = "";
//		}
//		if(check_per.equals("")){
//			check_per = Util.null2String(params.get("systemIds"));
//		}
//		String resourceids = "" ;
//		String resourcenames ="";
//		String dpids="";
//		StringTokenizer st = null;
//		Hashtable ht = null;
//		Hashtable htdp = null;
//		//濡傛灉椤甸潰浼犺繃鏉ョ殑鏄嚜瀹氫箟缁刬d,鑰屼笉鏄痳esourceids锛屽垯鎶奼roup鍒嗚В鎴恟esourceids
//		    String initgroupid=Util.null2String(params.get("initgroupid"));
//
//		    if(!initgroupid.equals("")){
//		        check_per="";
//		        rs.executeSql("select userid from hrmgroupmembers where groupid="+initgroupid) ;
//		        String userid;
//		        while(rs.next()){
//		            userid=rs.getString("userid");
//		            if(check_per.equals(""))
//		            check_per+=userid;
//		            else
//		            check_per=check_per+","+userid;
//		        }
//		    }
//		 String coworkid= Util.null2String(params.get("coworkid"));
//		  if(!coworkid.equals("")){
//		        check_per="";
//		        rs.executeSql("select coworkers from cowork_items where id="+coworkid) ;
//		        String userid;
//		        while(rs.next()){
//		            userid=rs.getString("coworkers");
//		            if(check_per.equals(""))
//		            check_per+=userid;
//		            else
//		            check_per=check_per+","+userid;
//		        }
//		    }
//		  String cowtypeid = Util.null2String(params.get("cowtypeid"));
//		  if(!cowtypeid.equals("")){
//		      check_per="";
//		      rs.executeSql("select members from cowork_types where id="+cowtypeid) ;
//		      String userid;
//		      while(rs.next()){
//		          userid=rs.getString("members");
//		          if(check_per.equals(""))
//		          check_per+=userid;
//		          else
//		          check_per=check_per+","+userid;
//		      }
//		  }
//		  
//		  String workID= Util.null2String(params.get("workID"));
//		  if(!workID.equals("")){
//		        check_per="";
//		        rs.executeSql("select resourceID from WorkPlan where id="+workID) ;
//		        String userid;
//		        while(rs.next()){
//		            userid=rs.getString("resourceID");
//		            if(check_per.equals(""))
//		            check_per+=userid;
//		            else
//		            check_per=check_per+","+userid;
//		        }
//		    }
//			 DepartmentComInfo deptComInfo =  new DepartmentComInfo();
//			 SubCompanyComInfo subCompanyComInfo = new SubCompanyComInfo();
//		if(!check_per.equals("")){
//			//if(check_per.substring(0,1).equals(","))check_per = check_per.substring(1);
//			//if(check_per.substring(check_per.length()-1).equals(","))check_per = check_per.substring(0,check_per.length()-1);
//			if(check_per.substring(0,1).equals(","))check_per = check_per.substring(1);
//			if(check_per.substring(0,1).equals(","))check_per = check_per.substring(1);
//			if(check_per.substring(check_per.length()-1).equals(","))check_per = check_per.substring(0,check_per.length()-1);
//			if(check_per.substring(check_per.length()-1).equals(","))check_per = check_per.substring(0,check_per.length()-1);
//			try{
//			String strtmp = "select id,lastname,departmentid from HrmResource where id in ("+check_per+")";
//		    if(!initgroupid.equals(""))
//		           strtmp = "select id,lastname,departmentid from HrmResource where id in (select userid from hrmgroupmembers where groupid="+initgroupid+")"; 
//
//			if(!coworkid.equals("")&&isoracle){
//		      strtmp = "select id,lastname,departmentid from HrmResource where exists  (select 1  from cowork_items where id="+coworkid+" and dbms_lob.instr(coworkers,','||hrmresource.id||',',1,1)>0 )"; 
//			}
//			//System.out.print(strtmp);
//		   rs.executeSql(strtmp);
//			 ht = new Hashtable();
//			 htdp = new Hashtable();
//			//boolean ifhave=false;
//
//			while(rs.next()){
//				//ifhave=true;
//		        String department = Util.toScreen(rs.getString("departmentid"),user.getLanguage());
//		                        String mark=deptComInfo.getDepartmentmark(department);
//
//		                        if(mark.length()>6)
//		                        mark=mark.substring(0,6);
//		                        int length=mark.getBytes().length;
//		                        if(length<12){
//		                            for(int i=0;i<12-length;i++){
//		                              mark+=" ";
//		                            }
//		                        }
//		                        String subcid=deptComInfo.getSubcompanyid1(department);
//		                        String subc= subCompanyComInfo.getSubCompanyname(subcid);
//		                        String lastname=rs.getString("lastname");
//		                        length=lastname.getBytes().length;
//		                        if(length<10){
//		                            for(int i=0;i<10-length;i++){
//		                              lastname+=" ";
//		                            }
//		                        }
//		                        lastname=lastname+" | "+mark+" | "+subc;
//		        ht.put(rs.getString("id"),lastname);
//		        htdp.put(rs.getString("id"),department);
//			}
//		    strtmp = "select id,lastnrsHrmResourcemanager where id in ("+check_per+")";
//			rs.executeSql(strtmp);
//			while(rs.next()){
//				
//		                        String lastname=rs.getString("lastname");
//		                        String department = rs.getString("departmentid");
//		                        int length=lastname.getBytes().length;
//		                        if(length<10){
//		                            for(int i=0;i<10-length;i++){
//		                              lastname+=" ";
//		                            }
//		                        }
//		                        lastname=lastname;
//		        ht.put(rs.getString("id"),lastname);
//		        htdp.put(rs.getString("id"),department);
//			}
//			st = new StringTokenizer(check_per,",");
//
//			//while(st.hasMoreTokens()){
//				//String s = st.nextToken();
//				//resourceids +=","+s;
//				//resourcenames += ","+Util.StringReplace(ht.get(s).toString(),",","锛?);
//			//}
//			}catch(Exception e){
//				//resourceids="";
//				//resourcenames="";
//			}
//		}
//		int perpage = Util.getIntValue(Util.null2String(params.get("pageSize")),10) ;
//		int pagenum = Util.getIntValue(Util.null2String(params.get("currentPage")) , 1) ;
//		JSONArray jsonArr = new JSONArray();
//		JSONObject json = new JSONObject();
//		String id=null;
//		String departmentname=null;
//		String subcompanyname=null;
//		ResourceComInfo resourceComInfo = new ResourceComInfo();
//		if(src.equalsIgnoreCase("dest")){//鍙充晶宸查EUR夋嫨鍒楄〃鐨剆ql鏉′欢	
//			if(st!=null){
//				while(st.hasMoreTokens()){
//					id = st.nextToken();
//					String tmp_lastname = resourceComInfo.getLastname(id);
//					departmentname = deptComInfo.getDepartmentname(htdp.get(id).toString());
//					String tmp_subcompanyid = deptComInfo.getSubcompanyid1(htdp.get(id).toString());
//					subcompanyname = subCompanyComInfo.getSubCompanyname(tmp_subcompanyid);
//					JSONObject tmp = new JSONObject();
//					tmp.put("id",id);
//					tmp.put("lastname",tmp_lastname);
//					tmp.put("departmentname",departmentname);
//					tmp.put("subcompanyname",subcompanyname);
//					jsonArr.add(tmp);
//				}
//			}
//			int totalPage = jsonArr.size();
//			if(totalPage%perpage>0||totalPage==0){
//				totalPage++;
//			}
//
//			json.put("currentPage", 1);
//			json.put("totalPage", 1);
//			json.put("mapList",jsonArr.toString());
//			out.println(json.toString());
//			return;
//		}else{//宸︿晶寰呴EUR夋嫨鍒楄〃鐨剆ql鏉′欢
//			Calendar today = Calendar.getInstance();
//			String currentdate = Util.add0(today.get(Calendar.YEAR), 4) +"-"+
//							 Util.add0(today.get(Calendar.MONTH) + 1, 2) +"-"+
//							 Util.add0(today.get(Calendar.DAY_OF_MONTH), 2) ;
//			
//			String lastname = Util.null2String(params.get("lastname"));
//			
//			String resourcetype = Util.null2String(params.get("resourcetype"));
//			String resourcestatus = Util.null2String(params.get("resourcestatus"));
//			String jobtitle = Util.null2String(params.get("jobtitle"));
//			 //departmentid = Util.null2String(params.get("departmentid"));
//			String sqlwhere = Util.null2String(params.get("sqlwhere"));
//			String status = Util.null2String(params.get("status"));
//			String firstname = Util.null2String(params.get("firstname"));
//			String seclevelto=Util.fromScreen(params.get("seclevelto"),user.getLanguage());    
//			String roleid = Util.null2String(params.get("roleid"));
//			if(tabid.equals("0")&&departmentid.equals("")&&sqlwhere.equals("")) departmentid=user.getUserDepartment()+"";
//			
//			if(departmentid.equals("0"))    departmentid="";
//			
//			if(subcompanyid.equals("0"))    subcompanyid="";
//
//			if(status.equals("-1")) status = "";
//			
//			//Added by wcd 2014-11-14 澧炲姞鏄惁鍖呭惈涓嬬骇鏈烘瀯 start
//			rs.executeSql("select detachable from SystemSet");
//			int detachable=0;
//			if(rs.next()){
//				detachable=rs.getInt("detachable");
//			}
//			String alllevel = Util.null2String(params.get("alllevel"),"1");
//			String alllevel_old = "";  
//			if(alllevel_old.equals("1")){
//				if(sqlwhere.length() == 0){
//					if(subcompanyid.trim().length() != 0){
//						subcompanyid = this.getAllSubId(subcompanyid,subcompanyid);
//						sqlwhere = "where subcompanyid1 in("+subcompanyid+") ";
//					}else if(departmentid.trim().length() != 0){
//						departmentid = this.getAllDeptId(departmentid,departmentid);	
//						sqlwhere = "where departmentid in("+departmentid+") ";
//					}
//				}else{
//					if(sqlwhere.indexOf("subcompanyid1")!=-1){
//						if(subcompanyid.trim().length() == 0 || detachable == 1){
//							subcompanyid = sqlwhere.substring(sqlwhere.indexOf("(")+1,sqlwhere.indexOf(")"));
//						}
//						if(detachable == 0){
//							subcompanyid = this.getAllSubId(subcompanyid,subcompanyid);
//						}
//						sqlwhere = "";
//						if(subcompanyid.trim().length() != 0){
//							sqlwhere += "where subcompanyid1 in("+subcompanyid+") ";
//						}
//						if(departmentid.trim().length() != 0){
//							departmentid = this.getAllDeptId(departmentid,departmentid);	
//							sqlwhere += (subcompanyid.trim().length() != 0?" and ":" where ")+" departmentid in("+departmentid+") ";
//						}
//					}else if(sqlwhere.indexOf("departmentid")!=-1){
//						if(departmentid.trim().length() == 0 || detachable == 1){
//							departmentid = sqlwhere.substring(sqlwhere.indexOf("(")+1,sqlwhere.indexOf(")"));
//						}
//						if(detachable == 0){
//							departmentid = this.getAllDeptId(departmentid,departmentid);
//						}
//						if(departmentid.trim().length() != 0){
//							sqlwhere = "where departmentid in("+departmentid+") ";
//						}
//					}
//				}
//			}else {
//				if(sqlwhere.length()==0)sqlwhere += " where 1=1";
//				if(!departmentid.equals("")){
//					sqlwhere += " and departmentid in(" + departmentid +") " ;
//				}
//				if(departmentid.equals("")&&!subcompanyid.equals("")){
//					sqlwhere += " and subcompanyid1 in(" + subcompanyid +") " ;
//				}
//			}
//			
//			if(sqlwhere.length()==0)sqlwhere += " where 1=1";
//			//Added by wcd 2014-11-14 澧炲姞鏄惁鍖呭惈涓嬬骇鏈烘瀯 end
//			if(!lastname.equals("")){
//				sqlwhere += " and( lastname like '%" + Util.fromScreen2(lastname,user.getLanguage()) +"%' or pinyinlastname like '%"+Util.fromScreen2(lastname,user.getLanguage()).toLowerCase()+"%')";
//			}
//			if(!firstname.equals("")){
//				sqlwhere += " and firstname like '%" + Util.fromScreen2(firstname,user.getLanguage()) +"%' ";
//			}
//			if(!seclevelto.equals("")){
//				sqlwhere += " and HrmResource.seclevel <= '"+ seclevelto + "' ";
//			}
//			if(!resourcetype.equals("")){
//				sqlwhere += " and resourcetype = '"+ resourcetype + "' ";
//			}
//
//			if(!jobtitle.equals("")){
//				sqlwhere += " and jobtitle in(select id from HrmJobTitles where jobtitlename like '%" + Util.fromScreen2(jobtitle,user.getLanguage()) +"%') ";
//				//sqlwhere += " and jobtitle ="+jobtitle;
//			}
//			
//			if(!status.equals("")&&!status.equals("9")){
//				sqlwhere += " and status =" + status +" " ;
//			}
//			if(status.equals("")){
//				sqlwhere += " and (status =0 or status = 1 or status = 2 or status = 3) ";
//			}
//		 	if(!roleid.equals("")){
//				sqlwhere += " and    HrmResource.ID in (select t1.ResourceID from hrmrolemembers t1,hrmroles t2 where t1.roleid = t2.ID and t2.ID="+roleid+" ) " ;
//		  }
//		 	
//			String noAccountSql="";
//		 	if(!isNoAccount.equals("1")){
//				if(mode==null||!mode.equals("ldap")){
//					noAccountSql=" and loginid is not null "+(rs.getDBType().equals("oracle")?"":" and loginid<>'' ");
//			 	}else{
//			 	//loginid、account字段整合 qc：128484
//					//noAccountSql=" and account is not null "+(rs.getDBType().equals("oracle")?"":" and account<>'' ");
//					noAccountSql=" and loginid is not null "+(rs.getDBType().equals("oracle")?"":" and loginid<>'' ");
//			 	}
//		 	}
//			sqlwhere+=(isNoAccount.equals("1")?"":noAccountSql); //鏄惁鏄剧ず鏃犺处鍙蜂汉鍛? 
//			
//			String sqlfrom = "HrmResource";
//			/*if(mode==null||!mode.equals("ldap")){		 
//				if(tabid.equals("0")&&!subcompanyid.equals("")){
//					sqlwhere +=" and subcompanyid1="+Util.getIntValue(subcompanyid);
//				}else if(tabid.equals("0")&&!departmentid.equals("")){
//					sqlwhere +=" and departmentid="+Util.getIntValue(departmentid);
//				}
//			}else{
//				if(tabid.equals("0")&&!subcompanyid.equals("")){
//					sqlwhere += " and subcompanyid1="+Util.getIntValue(subcompanyid);
//				}else if(tabid.equals("0")&&!departmentid.equals("")){
//					sqlwhere+=" and departmentid="+Util.getIntValue(departmentid);
//				}
//			}*/
//			if(tabid.equals("1")&&!groupid.equals("")){
//				sqlfrom = "hrmresource, HrmGroupMembers";
//				sqlwhere += " and HrmResource.id= userid and groupid="+groupid+(isNoAccount.equals("1")?"":noAccountSql);
//			}
//			//add by alan for td:10343
//			//boolean isInit = Util.null2String(params.get("isinit")).equals("");//鏄惁鐐瑰嚮杩囨悳绱?
//			//if((tabid.equals("2") && isInit) ||(tabid.equals("0") && nodeid.equals(""))) sqlstr = "select HrmResource.id,lastname,departmentid,jobtitle from HrmResource WHERE 1=2";
//			
//			if(tabid.equals("2") && fieldid>0){
//				OrganizationUtil.reset();
//				OrganizationUtil.selectData(user.getUID(),fieldid+"",isdetail,isbill);
//				if(OrganizationUtil.isIsdepat()){
//		            String dptids = OrganizationUtil.getDepartmentids();
//		            if(!dptids.equals("")&&!dptids.equals("0")&&!dptids.equals("-1")){
//		            	sqlwhere+=" and departmentid in ("+dptids+") ";
//		            }
//		        }else{
//		        	String subcids = OrganizationUtil.getSubcompanyids();
//		            if(!subcids.equals("")&&!subcids.equals("0")&&!subcids.equals("-1")){
//		            	sqlwhere+=" and subcompanyid1 in ("+subcids+") ";
//		            }
//		        }
//		        
//			}
//			
//			//灞忚斀宸查EUR変汉鍛?
//			String excludeId = Util.null2String(params.get("excludeId"));
//			if(excludeId.length()==0)excludeId=check_per;
//			if(excludeId.length()>0){
//				sqlwhere += " and HrmResource.id not in ("+excludeId+")";
//			}
//			
//			SplitPageParaBean spp = new SplitPageParaBean();
//			spp.setBackFields(" HrmResource.id as id, lastname, departmentid, subcompanyid1, jobtitle, HrmResource.dsporder ");
//			spp.setSqlFrom(sqlfrom);
//			spp.setSqlWhere(sqlwhere);
//			spp.setSqlOrderBy("HrmResource.dsporder,lastname");
//			spp.setPrimaryKey("id");
//			spp.setDistinct(true);
//			spp.setSortWay(spp.ASC);
//			SplitPageUtil spu = new SplitPageUtil();
//			spu.setSpp(spp);
//			
//			int RecordSetCounts = spu.getRecordCount();
//			int totalPage = RecordSetCounts/perpage;
//			if(totalPage%perpage>0||totalPage==0){
//				totalPage++;
//			}
//			
//			rs = spu.getCurrentPageRs(pagenum, perpage);
//			
//			while(rs.next()) {
//				id = rs.getString("id");
//				departmentname = deptComInfo.getDepartmentName(rs.getString("departmentid"));
//				subcompanyname = subCompanyComInfo.getSubCompanyname(rs.getString("subcompanyid1"));
//			
//				JSONObject tmp = new JSONObject();
//				tmp.put("id",id);
//				tmp.put("lastname",rs.getString("lastname"));
//				tmp.put("departmentname",departmentname);
//				tmp.put("subcompanyname",subcompanyname);
//				jsonArr.add(tmp);
//			}
//			json.put("currentPage", pagenum);
//			json.put("totalPage", totalPage);
//			json.put("mapList",jsonArr.toString());
//			out.println(json.toString());
//		
//		
//		return super.getBrowserData(params);
//	}
}
