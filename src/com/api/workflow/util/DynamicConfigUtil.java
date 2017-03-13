package com.api.workflow.util;

import java.util.*;
import java.util.regex.*;

import weaver.general.BaseBean;
import weaver.general.Util;
import weaver.conn.RecordSet;
import com.api.workflow.bean.FieldAttrDynamicCfg;

public class DynamicConfigUtil extends BaseBean {
	
	/**
	 * 行列规则配置
	 */
	public Map<String,List<String>> getRowColRuleCfg(int formid, int isbill){
		List<String> rowcalcfg = new ArrayList<String>();
		List<String> colcalcfg = new ArrayList<String>();
		List<String> maincalcfg = new ArrayList<String>();
		List<String> rowtrifields = new ArrayList<String>();
		List<String> coltrifields = new ArrayList<String>();
		List<String> maintrifields = new ArrayList<String>();
		RecordSet rs = new RecordSet();
		rs.executeSql("select rowcalstr,colcalstr,maincalstr from workflow_formdetailinfo where formid="+formid);
		Pattern p = Pattern.compile("detailfield_\\d+");
		Matcher m;
		if(rs.next()){
			rowcalcfg = Util.TokenizerString(rs.getString("rowcalstr"), ";");
			colcalcfg = Util.TokenizerString(rs.getString("colcalstr"), ";");
			maincalcfg = Util.TokenizerString(rs.getString("maincalstr"), ";");
			for(String str : rowcalcfg){
				str = str.substring(str.indexOf("="));
				m = p.matcher(str);
				while(m.find()){
					rowtrifields.add(m.group().substring(12));
				}
			}
			for(String str : colcalcfg){
				m = p.matcher(str);
				while(m.find()){
					coltrifields.add(m.group().substring(12));
				}
			}
			for(String str : maincalcfg){
				str = str.substring(str.indexOf("="));
				m = p.matcher(str);
				while(m.find()){
					maintrifields.add(m.group().substring(12));
				}
			}
		}
		Map<String,List<String>> cfgmap = new HashMap<String,List<String>>();
		cfgmap.put("rowcalcfg", rowcalcfg);
		cfgmap.put("colcalcfg", colcalcfg);
		cfgmap.put("maincalcfg", maincalcfg);
		cfgmap.put("rowtrifields", rowtrifields);
		cfgmap.put("coltrifields", coltrifields);
		cfgmap.put("maintrifields", maintrifields);
		return cfgmap;
	}
	
	/**
	 * 字段联动配置
	 */
	public List<String> getDataInputDynamicCfg(int wfid){
		RecordSet rs = new RecordSet();
		List<String> cfglist = new ArrayList<String>();
		rs.executeSql("select triggerfieldname from workflow_datainput_entry where workflowid="+wfid);
		while(rs.next()){
			cfglist.add(rs.getString("triggerfieldname"));
		}
		return cfglist;
	}
	
	/**
	 * 字段属性联动配置
	 */
	public List<FieldAttrDynamicCfg> getFieldAttrDynamicCfg(int nodeid, int formid, int isbill){
		RecordSet rs = new RecordSet();
		List<FieldAttrDynamicCfg> cfglist = new ArrayList<FieldAttrDynamicCfg>();
		rs.executeSql("select * from workflow_nodefieldattr where nodeid="+nodeid+" and formid="+formid+" and isbill="+isbill+" order by id");
		Pattern p = Pattern.compile("\\$(-)?\\d+\\$");
		Matcher m;
		while(rs.next()){
			int keyid = rs.getInt("id");
			int caltype = rs.getInt("caltype");
			if(caltype < 1)		caltype = 1;
			int assignfield = rs.getInt("fieldid");
			String attrcontent = rs.getString("attrcontent");
			List<String> relatefield = new ArrayList<String>();
			m = p.matcher(attrcontent);
			while(m.find()){
				String fieldid = m.group();
				fieldid = fieldid.substring(1, fieldid.length()-1);
				relatefield.add(fieldid);
			}
			m = p.matcher(attrcontent);
			while(m.find()){
				String trifield = m.group();
				trifield = trifield.substring(1, trifield.length()-1);
				FieldAttrDynamicCfg cfg = new FieldAttrDynamicCfg();
				cfg.setKeyid(keyid);
				cfg.setCaltype(caltype);
				cfg.setTrifield(Util.getIntValue(trifield));
				cfg.setRelatefield(relatefield);
				cfg.setAssignfield(assignfield);
				cfglist.add(cfg);
			}
		}
		return cfglist;
	}
	
	/**
	 * 显示属性联动配置
	 */
	public Map<String,Object> getViewAttrLinkageCfg(int wfid, int nodeid){
		RecordSet rs = new RecordSet();
		rs.executeSql("select fieldid,selectfieldvalue,changefieldids,viewattr from workflow_viewattrlinkage where workflowid="+wfid+" and nodeid="+nodeid);
		while(rs.next()){
			
		}
		return null;
	}
	
}
