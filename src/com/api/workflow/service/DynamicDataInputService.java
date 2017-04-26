package com.api.workflow.service;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.workflow.datainput.DynamicDataInput;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 
 */
public class DynamicDataInputService {

    private int workflowid = 0;

	public DynamicDataInputService() {}
	
    /***
     * 字段联动，主表联动主表、主表联动明细表
     * 
     * **/
    public Map<String, Object> getDataInput(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        RecordSet rs = new RecordSet();
        RecordSet rsObj = new RecordSet();
        String workflowid = request.getParameter("workflowid");
        String datainputids = request.getParameter("entryid");
        String nodeid = request.getParameter("nodeid");
        String fformid = "";
        String isbill = "";
		rs.executeSql("select formid,isbill from workflow_base where id="+workflowid);
		if(rs.next()){
			fformid = rs.getString("formid");
			isbill = rs.getString("isbill");
		}
        //获取当前节点所有可见字段的类型信息。
        Map<String, String[]> mapFieldInfos = DynamicDataInput.getFieldInfos(workflowid, nodeid, isbill);
        
        //ArrayList arrTrgFieldNames = Util.TokenizerString(strTrgFieldNames, ",");
        String arrayentry[] = Util.splitString(datainputids, ",");
        for(int temp=0; temp<arrayentry.length; temp++){
        	String datainputid= arrayentry[temp];
        	String trgFieldName = Util.null2String((String)request.getParameter("trifield_"+datainputid));
        	if(trgFieldName != null && !trgFieldName.trim().equals("") ){
        		DynamicDataInput DDI = new DynamicDataInput(workflowid,trgFieldName,isbill);
        		//查询将当前字段作为取值参数的所有联动信息
        		String entryid = "";
        		Hashtable outdatahash = new Hashtable();
    			rsObj.executeSql("select entryid,IsCycle,WhereClause from Workflow_DataInput_main where id="+datainputid+" order by orderid");
    			ArrayList outdatasList=new ArrayList();
    			ArrayList outfieldnamelist=new ArrayList();
    			ArrayList groupids = null ;
    			while(rsObj.next()){
    				entryid = rsObj.getString("entryid");
    				String type = getEntryType(entryid);
	    				groupids = DDI.GetOutFieldIndex(datainputid);//查询出明细个数
	    				//获取联动信息中的 所有取值字段名称 及 取值字段值。
	    				ArrayList infieldnamelist = DDI.GetInFieldName(datainputid);
	    				for(int i=0;i<infieldnamelist.size();i++){
	    					//String paramName = datainputid+"|"+(String)infieldnamelist.get(i)+suffixField;
	    					String paramName = (String)infieldnamelist.get(i);
	    					String inputFieldValue = Util.null2String(request.getParameter(paramName));
	    					//记录日志信息
	    					DDI.SetInFields((String)infieldnamelist.get(i),inputFieldValue);
	    				}
	    				//获取联动信息中的 所有条件字段名称 及 条件字段值。
	    				ArrayList conditionfieldnameList = DDI.GetConditionFieldName(datainputid);
	    				for(int j=0;j<conditionfieldnameList.size();j++){
	    					DDI.SetConditonFields((String)conditionfieldnameList.get(j),Util.null2String(request.getParameter(datainputid+"|"+(String)conditionfieldnameList.get(j))));
	    				}
	    		        DDI.GetOutDataWithIndex(datainputid,type);
	    		        outfieldnamelist = DDI.GetOutFieldNameList();
	    		        outdatasList = DDI.GetOutDataWithIndex(datainputid,type);
	    		        //DDI.GetOutData(datainputid);
	    		        //outdatasList = DDI.GetOutDataList();
	    		      	//赋值字段为主表字段的更新
	    		        Map<String,String> changemainValue = new HashMap<String,String>();
	    		        Map<String,Object> addDetailRow = new HashMap<String,Object>();
	    				if(DDI.GetIsCycle().equals("1")){
	    					//当赋值字段为主表字段时， outdatasList仅包含一个元素。
	    					//主表联动主表--start
	    					for(int i=0;i<outdatasList.size();i++){
	    				 		outdatahash = (Hashtable)outdatasList.get(i);
	    				 		//对赋值字段进行循环。
	    				 		for(int j=0; j<outfieldnamelist.size(); j++){
	    				 			String fieldName = (String)outfieldnamelist.get(j);
	    				 		    String fieldValue = (String)outdatahash.get(fieldName);
	    				 		   	fieldValue = Util.toExcelData(fieldValue);
	    				 		    changemainValue.put(fieldName, fieldValue);
	    				 		}
	    	       			}
	    					
	    					//获取此次取值所需要设置前端值的列表
	    					List tempObj = DynamicDataInput.getBrowserButtonValue(outfieldnamelist, outdatasList, mapFieldInfos,isbill);
	    					if(tempObj != null){
								for(int i=0;i<tempObj.size();i++){
									Map map=(Map)tempObj.get(i);
									changemainValue.put((String)map.get("fieldId"),(String)map.get("showInfo"));
								}
	    					}
	    					if(changemainValue.size()>0){
	    						addDetailRow.put("changeValue",changemainValue);
	    						result.put("assignInfo_"+datainputid, addDetailRow);
	    					}
	    					//主表联动主表--end
	    					//主表联动明细表--start
	    					
	    					Map<String,Object> detaillistRow = new HashMap<String,Object>();
	    					for(int dtidx = 0 ; dtidx < groupids.size() ; dtidx++){
	    		      			int tmpgroupid = Util.getIntValue(groupids.get(dtidx).toString(),1) ;
	    		      			int groupid = getNewGroupid(Util.getIntValue(fformid,0),tmpgroupid);
	    		      			int jsgroupid = groupid -1 ;
	    		      			
	    		      			outfieldnamelist = DDI.GetOutFieldNameListWithIndex(datainputid,tmpgroupid+"") ;
	    		      			outdatasList = DDI.GetOutDataWithIndex(datainputid,tmpgroupid+"");//DDI.GetOutDataList();
	    		      			List<Map<String,String>> addlist = new ArrayList<Map<String,String>>();
	    		      			for(int i=0;i<outdatasList.size();i++){
	    		      				Map<String,String> detailmap = new HashMap<String,String>();
	    		      				outdatahash = (Hashtable)outdatasList.get(i);
		    				 		for(int j=0; j<outfieldnamelist.size(); j++){
		    				 			String tempfieldname = outfieldnamelist.get(j).toString();
		    				 		    String tempValue = (String)outdatahash.get(tempfieldname);
		    				 		    detailmap.put(tempfieldname, tempValue);
		    				 		}
		    				 		List detailobj = DynamicDataInput.getBrowserButtonValue(outfieldnamelist, outdatasList, mapFieldInfos,isbill);
		        					if(detailobj != null){
		    							for(int k=0;k<detailobj.size();k++){
		    								Map map=(Map)detailobj.get(k);
		    								detailmap.put((String)map.get("fieldId"),(String)map.get("showInfo"));
		    							}
		        					}
		        					addlist.add(detailmap);
	    		      			}
	    		      			detaillistRow.put("detail_"+groupid, addlist);
	    					}
	    					if(detaillistRow.size()>0){
	    						addDetailRow.put("addDetailRow", detaillistRow);
	    						result.put("assignInfo_"+datainputid, addDetailRow);
	    					}
	    					//主表联动明细表--end
    		       	}else if(DDI.GetIsCycle().equals("2")){
    		       	//明细表联动明细表--start
    					for(int i=0;i<outdatasList.size();i++){
    				 		outdatahash = (Hashtable)outdatasList.get(i);
    				 		//对赋值字段进行循环。
    				 		for(int j=0; j<outfieldnamelist.size(); j++){
    				 			String fieldName = (String)outfieldnamelist.get(j);
    				 		    String fieldValue = (String)outdatahash.get(fieldName);
    				 		   	fieldValue = Util.toExcelData(fieldValue);
    				 		    changemainValue.put(fieldName, fieldValue);
    				 		}
    	       			}
    					
    					//获取此次取值所需要设置前端值的列表
    					List tempObj = DynamicDataInput.getBrowserButtonValue(outfieldnamelist, outdatasList, mapFieldInfos,isbill);
    					if(tempObj != null){
							for(int i=0;i<tempObj.size();i++){
								Map map=(Map)tempObj.get(i);
								changemainValue.put((String)map.get("fieldId"),(String)map.get("showInfo"));
							}
    					}
    					if(changemainValue.size()>0){
    						addDetailRow.put("changeValue",changemainValue);
    						result.put("assignInfo_"+datainputid, addDetailRow);
    					}
    					//明细表联动明细表--end
    		       	} 
    			}
        	}
        }
        return result;
    }

    public int getNewGroupid(int billid,int groupid){
    	RecordSet rs = new RecordSet();
    	int newgroupid = 0 ;
    	String sql = "";
    	if(rs.getDBType().equals("oracle")){
    		sql = " SELECT t.rid FROM (select rownum as rid,orderid from (SELECT tablename, orderid FROM Workflow_billdetailtable  WHERE billid = "+billid+" order by id) t1) t WHERE t.orderid="+groupid ;
    	}else{
    		sql = "SELECT t.rowid FROM (SELECT ROW_NUMBER() OVER (ORDER BY ORDERid) AS rowid ,tablename,orderid FROM Workflow_billdetailtable WHERE billid="+billid+" ) t WHERE t.orderid="+groupid ;
    	}
    	rs.executeSql(sql);
    	if(rs.next()){
    		newgroupid = rs.getInt(1);
    	}else{
    		newgroupid = groupid ;
    	}

    	return newgroupid ;
    }
    
    public String getEntryType(String entryid){
    	RecordSet rs = new RecordSet();
    	String type = "";
    	String sql = " SELECT type FROM Workflow_DataInput_entry where id = "+entryid;
    	rs.executeSql(sql);
    	if(rs.next()){
    		type = rs.getString("type");
    	}
    	return type;
    }
}
