package com.api.workflow.service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.alibaba.fastjson.JSON;
import com.api.workflow.bean.LinkageCfgBean;

import weaver.conn.RecordSet;
import weaver.general.BaseBean;
import weaver.general.Util;

public class LinkageCfgService extends BaseBean{
	
	private int wfid;
	private int nodeid;
	private int formid;
	private int isbill;

	private Map<String,Object> dataInputCfg = new HashMap<String,Object>();		//字段联动
	private Map<String,Object> fieldSqlCfg = new HashMap<String,Object>();		//SQL赋值
	private Map<String,Object> fieldMathCfg = new HashMap<String,Object>();		//字段赋值
	private Map<String,Object> fieldDateCfg = new HashMap<String,Object>();		//日期计算
	private Map<String,Object> rowCalCfg = new HashMap<String,Object>();		//行规则
	private Map<String,Object> colCalCfg = new HashMap<String,Object>();		//列合计
	private Map<String,Object> mainCalCfg = new HashMap<String,Object>();		//列赋值
	//private Map<String,Object> selectLinkCfg = new HashMap<String,Object>();	//选择框联动
	private Map<String,Object> viewAttrCfg = new HashMap<String,Object>();		//显示属性联动
	
	public LinkageCfgService(int wfid, int nodeid, int formid, int isbill){
		this.wfid = wfid;
		this.nodeid = nodeid;
		this.formid = formid;
		this.isbill = isbill;
	}
	
	/**
	 * 获取表单涉及所有联动配置
	 */
	public Map<String,Object> getAllLinkageCfg(){
		Map<String,Object> cfg = new HashMap<String,Object>();
		this.buildDataInputCfg();
		this.buildFieldAttrCfg();
		this.buildRowColRuleCfg();
		this.buildViewAttrCfg();
		cfg.put("dataInputCfg", dataInputCfg);
		cfg.put("fieldSqlCfg", fieldSqlCfg);
		cfg.put("fieldMathCfg", fieldMathCfg);
		cfg.put("fieldDateCfg", fieldDateCfg);
		cfg.put("rowCalCfg", rowCalCfg);
		cfg.put("colCalCfg", colCalCfg);
		cfg.put("mainCalCfg", mainCalCfg);
		cfg.put("viewAttrCfg", viewAttrCfg);
		System.err.println(JSON.toJSONString(cfg));
		return cfg;
	}
	
	private List<LinkageCfgBean> getFieldCfgList(String fieldid, Map<String,Object> cfgmap){
		return cfgmap.containsKey(fieldid) ? (List<LinkageCfgBean>)cfgmap.get(fieldid) : new ArrayList<LinkageCfgBean>();
	}
	
	/**
	 * 生成字段联动配置
	 */
	private void buildDataInputCfg(){
		RecordSet rs = new RecordSet();
		RecordSet rs1 = new RecordSet();
		RecordSet rs2 = new RecordSet();
		rs.executeSql("select id,triggerfieldname,type,detailindex from Workflow_DataInput_entry where workflowid="+wfid+" order by id");
		while(rs.next()){
			String triggerfieldname = Util.null2String(rs.getString("triggerfieldname")).substring(5);
			int detailindex = Util.getIntValue(rs.getString("detailindex"), 0);
			String trifield = triggerfieldname+"_"+detailindex;
			List<LinkageCfgBean> cfglist = this.getFieldCfgList(trifield, dataInputCfg);
			rs1.executeSql("select id from Workflow_DataInput_main where entryid="+rs.getString("id")+" order by id");
			while(rs1.next()){
				String datainputid = rs1.getString("id");
				List<String> relatefields = new ArrayList<String>();
				rs2.executeSql("select pagefieldname,pagefieldindex from Workflow_DataInput_field where datainputid="+datainputid+" and type=1");
				while(rs2.next()){
					String relatekey = rs2.getString("pagefieldname").substring(5);
					relatekey += "_"+Util.getIntValue(rs2.getString("pagefieldindex"), 0);
					if(relatefields.indexOf(relatekey) == -1)
						relatefields.add(relatekey);
				}
				cfglist.add(new LinkageCfgBean("", datainputid, relatefields));
			}
			dataInputCfg.put(trifield, cfglist);
		}
	}
	
	/**
	 * 生成字段属性联动配置
	 */
	private void buildFieldAttrCfg(){
		Pattern p = Pattern.compile("(\\$)(\\d+)(\\$)");
		Matcher m;
		RecordSet rs = new RecordSet();
		rs.executeSql("select * from workflow_nodefieldattr where nodeid="+nodeid+" and formid="+formid+" and isbill="+isbill+" order by id");
		while(rs.next()){
			int keyid = rs.getInt("id");
			int caltype = Util.getIntValue(rs.getString("caltype"), 0);
			String assignfield= rs.getString("fieldid");
			String str = rs.getString("attrcontent");
			if(caltype == 0){	//默认类型判断
				if(str.indexOf("doFieldSQL(\"") > -1)
					caltype = 1;
				else if(str.indexOf("doFieldMath(\"") > -1)
					caltype = 2;
				else if(str.indexOf("doFieldDate(\"") > -1)
					caltype = 3;
			}
			if(caltype != 1 && caltype != 2 && caltype != 3)
				continue;
			
			List<String> allfields = new ArrayList<String>();
			m = p.matcher(str);
			while(m.find()){
				String fieldid = m.group(2);
				if(allfields.indexOf(fieldid) == -1)	//去重
					allfields.add(m.group(2));
			}
			for(String trifield : allfields){
				List<String> relatefields = new ArrayList<String>();
				relatefields.addAll(allfields);
				relatefields.remove(relatefields.indexOf(trifield));
				if(caltype == 1){
					List<LinkageCfgBean> cfglist = this.getFieldCfgList(trifield, fieldSqlCfg);
					cfglist.add(new LinkageCfgBean(assignfield, keyid, relatefields));
					fieldSqlCfg.put(trifield, cfglist);
				}else if(caltype == 2){
					int index = str.indexOf("doFieldMath(\"");
					if(index < 0)	continue;
					String attrcontent = str.substring(index+13, str.lastIndexOf("\")")).trim();
					Map<String,String> config = new HashMap<String,String>();
					config.put("attrcontent", attrcontent);
					config.put("transtype", rs.getString("transtype"));
					
					List<LinkageCfgBean> cfglist = this.getFieldCfgList(trifield, fieldMathCfg);
					cfglist.add(new LinkageCfgBean(assignfield, config, relatefields));
					fieldMathCfg.put(trifield, cfglist);
				}else if(caltype == 3){
					List<LinkageCfgBean> cfglist = this.getFieldCfgList(trifield, fieldDateCfg);
					cfglist.add(new LinkageCfgBean(assignfield, keyid, relatefields));
					fieldDateCfg.put(trifield, cfglist);
				}
			}
		}
	}
	
	/**
	 * 生成行列规则配置
	 */
	private void buildRowColRuleCfg(){
		RecordSet rs = new RecordSet();
		rs.executeSql("select rowcalstr,colcalstr,maincalstr from workflow_formdetailinfo where formid="+formid);
		if(rs.next()){
			Pattern p = Pattern.compile("(detailfield_)(\\d+)");
			Matcher m;
			List<String> rowcalcfg = Util.TokenizerString(rs.getString("rowcalstr"), ";");
			List<String> colcalcfg = Util.TokenizerString(rs.getString("colcalstr"), ";");
			List<String> maincalcfg = Util.TokenizerString(rs.getString("maincalstr"), ";");
			for(String str : rowcalcfg){
				String assignfield = str.substring(0, str.indexOf("=")).replace("detailfield_", "").trim();
				String evalstr = str.substring(str.indexOf("=")+1);
				List<String> allfields = new ArrayList<String>();
				m = p.matcher(evalstr);
				while(m.find()){
					String fieldid = m.group(2);
					if(allfields.indexOf(fieldid) == -1)	//去重
						allfields.add(m.group(2));
				}
				for(String trifield : allfields){
					List<LinkageCfgBean> cfglist = this.getFieldCfgList(trifield, rowCalCfg);
					cfglist.add(new LinkageCfgBean(assignfield, evalstr));
					rowCalCfg.put(trifield, cfglist);
				}
			}
			for(String str : colcalcfg){
				m = p.matcher(str);
				if(m.find()){
					colCalCfg.put(m.group(2), "needsum");
				}
			}
			Pattern p_main = Pattern.compile("(mainfield_)(\\d+)");
			for(String str : maincalcfg){
				m = p.matcher(str);
				if(m.find()){
					String trifield = m.group(2);
					m = p_main.matcher(str);
					if(m.find()){
						mainCalCfg.put(trifield, m.group(2));
					}
				}
			}
		}
	}
	
	
	/**
	 * 生成显示属性联动配置
	 */
	private void buildViewAttrCfg(){
		RecordSet rs = new RecordSet();
		rs.executeSql("select selectfieldid,selectfieldvalue,changefieldids,viewattr from workflow_viewattrlinkage where workflowid="+wfid
			+ " and nodeid="+nodeid+" order by selectfieldid,selectfieldvalue,viewattr");	//排序不可变
		Map<String,List<String>> allRelateField = new HashMap<String,List<String>>();
		while(rs.next()){
			String trifield = Util.null2String(rs.getString("selectfieldid"));
			String trifieldvalue = Util.null2String(rs.getString("selectfieldvalue"));
			if(trifield.indexOf("_") == -1)	
				continue;
			Map<String,Object> fieldCfg = viewAttrCfg.containsKey(trifield) ? (Map<String,Object>)viewAttrCfg.get(trifield) : new HashMap<String,Object>();
			viewAttrCfg.put(trifield, fieldCfg);
			
			Map<String,Object> changeValueCfg = fieldCfg.containsKey(trifieldvalue) ? (Map<String,Object>)fieldCfg.get(trifieldvalue) : new HashMap<String,Object>();
			fieldCfg.put(trifieldvalue, changeValueCfg);
			
			List<String> relateFieldList = allRelateField.containsKey(trifield) ? allRelateField.get(trifield) : new ArrayList<String>();
			allRelateField.put(trifield, relateFieldList);
			
			List<String> changefieldlist = Util.TokenizerString(Util.null2String(rs.getString("changefieldids")), ",");
			String viewattr = Util.null2String(rs.getString("viewattr"));
			for(String changefield : changefieldlist){
				changeValueCfg.put(changefield, viewattr);
				if(relateFieldList.indexOf(changefield) == -1)
					relateFieldList.add(changefield);
			}
		}
		for(Map.Entry<String, Object> entry : viewAttrCfg.entrySet()){
			Map<String,Object> fieldCfg = (Map<String,Object>)entry.getValue();
			if(allRelateField.containsKey(entry.getKey())){
				fieldCfg.put("relateFields", allRelateField.get(entry.getKey()));
			}
		}
	}
	
}
