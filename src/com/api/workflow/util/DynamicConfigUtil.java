package com.api.workflow.util;

import java.util.*;
import java.util.regex.*;

import weaver.general.BaseBean;
import weaver.general.Util;
import weaver.conn.RecordSet;

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
	
	
}
