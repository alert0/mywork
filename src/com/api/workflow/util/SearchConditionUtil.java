package com.api.workflow.util;

import java.util.*;

import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

import com.api.workflow.bean.SearchConditionItem;
import com.api.workflow.bean.SearchConditionOption;

public class SearchConditionUtil {

	/**
	 * 获取流程列表的高级查询条件
	 * @param viewScope  doing(待办)、done(已办)、mine(我的请求)
	 */
	public List<Map<String,Object>> getCondition(String viewScope, User user){
		List<Map<String,Object>> grouplist = new ArrayList<Map<String,Object>>();
		
		Map<String,Object> groupitem1 = new HashMap<String,Object>();
		List<SearchConditionItem> itemlist1 = new ArrayList<SearchConditionItem>();
		groupitem1.put("title", SystemEnv.getHtmlLabelName(32905, user.getLanguage()));
		groupitem1.put("defaultshow", true);
		groupitem1.put("items", itemlist1);
		grouplist.add(groupitem1);
		
		Map<String,Object> groupitem2 = new HashMap<String,Object>();
		List<SearchConditionItem> itemlist2 = new ArrayList<SearchConditionItem>();
		groupitem2.put("title", SystemEnv.getHtmlLabelName(32843,user.getLanguage()));
		groupitem2.put("defaultshow", true);
		groupitem2.put("items", itemlist2);
		grouplist.add(groupitem2);
		
		List<SearchConditionOption> requestLevelOption = getRequestLevelOption(user.getLanguage());
		List<SearchConditionOption> archiveStatusOption = getArchiveStatusOption_done(user.getLanguage());
		List<SearchConditionOption> vaildStatusOption = getVaildStatusOption_list(user.getLanguage());
		List<SearchConditionOption> nodeTypeOption = getNodeTypeOption(user.getLanguage());
		//生成常用条件
		itemlist1.add(new SearchConditionItem(ConditionKeyFactory.KEY1, SystemEnv.getHtmlLabelName(229, user.getLanguage()),
			"", new String[]{"requestname"}, null, 6, 18));
		itemlist1.add(new SearchConditionItem(ConditionKeyFactory.KEY1, SystemEnv.getHtmlLabelName(19502, user.getLanguage()),
			"", new String[]{"wfcode"}, null, 6, 18));
		itemlist1.add(new SearchConditionItem(ConditionKeyFactory.KEY9, SystemEnv.getHtmlLabelName(26361, user.getLanguage()),
			"", new String[]{"workflowid"}, null, 6, 18));
		itemlist1.add(new SearchConditionItem(ConditionKeyFactory.KEY3, SystemEnv.getHtmlLabelName(722, user.getLanguage()),
			"", new String[]{"createdateselect","createdatefrom","createdateto"}, getDateSelectOption(user.getLanguage(), false, false), 6, 18));
		itemlist1.add(new SearchConditionItem(ConditionKeyFactory.KEY4, SystemEnv.getHtmlLabelName(882, user.getLanguage()),
			"", new String[]{"creatertype","createrid","createrid2"}, null, 6, 18));
		itemlist1.add(new SearchConditionItem(ConditionKeyFactory.KEY1, SystemEnv.getHtmlLabelNames("882,714", user.getLanguage()),
			"", new String[]{"workcode"}, null, 6, 18));
		
		//生成其他条件
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY6, SystemEnv.getHtmlLabelName(19225, user.getLanguage()),
			"", new String[]{"ownerdepartmentid"}, null, 6, 18));
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY7, SystemEnv.getHtmlLabelName(22788, user.getLanguage()),
			"", new String[]{"creatersubcompanyid"}, null, 6, 18));
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY8, SystemEnv.getHtmlLabelName(33234, user.getLanguage()),
			"", new String[]{"workflowtype"}, null, 6, 18));
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY2, SystemEnv.getHtmlLabelName(15534, user.getLanguage()),
			"", new String[]{"requestlevel"}, requestLevelOption, 6, 18));
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY3, SystemEnv.getHtmlLabelName(17994, user.getLanguage()),
			"", new String[]{"recievedateselect","recievedatefrom","recievedateto"}, getDateSelectOption(user.getLanguage(), false, false), 6, 18));
		if("done".equals(viewScope) || "mine".equals(viewScope)){
			itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY3, SystemEnv.getHtmlLabelName(32532, user.getLanguage()),
				"", new String[]{"operatedateselect","operatedatefrom","operatedateto"}, getDateSelectOption(user.getLanguage(), false, false), 6, 18));
			itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY2, SystemEnv.getHtmlLabelName(15112, user.getLanguage()),
				"", new String[]{"archivestatus"}, archiveStatusOption, 6, 18));
		}
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY2, SystemEnv.getHtmlLabelName(19061, user.getLanguage()),
			"", new String[]{"wfstatu"}, vaildStatusOption, 6, 18));
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY2, SystemEnv.getHtmlLabelName(15536, user.getLanguage()),
			"", new String[]{"nodetype"}, nodeTypeOption, 6, 18));
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY5, SystemEnv.getHtmlLabelName(16354, user.getLanguage()),
			"", new String[]{"unophrmid"}, null, 6, 18));
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY11, SystemEnv.getHtmlLabelName(857, user.getLanguage()),
			"", new String[]{"docids"}, null, 6, 18));
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY5, SystemEnv.getHtmlLabelName(179, user.getLanguage()),
			"", new String[]{"hrmcreaterid"}, null, 6, 18));
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY12, SystemEnv.getHtmlLabelName(783, user.getLanguage()),
			"", new String[]{"crmids"}, null, 6, 18));
		itemlist2.add(new SearchConditionItem(ConditionKeyFactory.KEY13, SystemEnv.getHtmlLabelName(782, user.getLanguage()),
			"", new String[]{"proids"}, null, 6, 18));
		
		return grouplist;
	}
	
	
	//查询条件-日期下拉(含上个月、上一年)
	public static List<SearchConditionOption> getDateSelectOption(int languageid){
		return getDateSelectOption(languageid, true, true);
	}
	public static List<SearchConditionOption> getDateSelectOption(int languageid, boolean has7, boolean has8){
		List<SearchConditionOption> options = new ArrayList<SearchConditionOption>();
		options.add(new SearchConditionOption("0", SystemEnv.getHtmlLabelName(332, languageid), true));
		options.add(new SearchConditionOption("1", SystemEnv.getHtmlLabelName(15537, languageid)));
		options.add(new SearchConditionOption("2", SystemEnv.getHtmlLabelName(15539, languageid)));
		options.add(new SearchConditionOption("3", SystemEnv.getHtmlLabelName(15541, languageid)));
		if(has7)
			options.add(new SearchConditionOption("7", SystemEnv.getHtmlLabelName(27347, languageid)));
		options.add(new SearchConditionOption("4", SystemEnv.getHtmlLabelName(21904, languageid)));
		options.add(new SearchConditionOption("5", SystemEnv.getHtmlLabelName(15384, languageid)));
		if(has8)
			options.add(new SearchConditionOption("8", SystemEnv.getHtmlLabelName(81716, languageid)));
		options.add(new SearchConditionOption("6", SystemEnv.getHtmlLabelName(32530, languageid)));
		return options;
	}
	
	//查询条件-紧急程度下拉项
	public static List<SearchConditionOption> getRequestLevelOption(int languageid){
		List<SearchConditionOption> options = new ArrayList<SearchConditionOption>();
		options.add(new SearchConditionOption("", "", true));
		options.add(new SearchConditionOption("0", SystemEnv.getHtmlLabelName(225, languageid)));
		options.add(new SearchConditionOption("1", SystemEnv.getHtmlLabelName(15533, languageid)));
		options.add(new SearchConditionOption("2", SystemEnv.getHtmlLabelName(2087, languageid)));
		return options;
	}
	
	//查询条件-处理状态下拉项
	public static List<SearchConditionOption> getManageStatusOption(int languageid){
		List<SearchConditionOption> options = new ArrayList<SearchConditionOption>();
		options.add(new SearchConditionOption("0", SystemEnv.getHtmlLabelName(332, languageid), true));
		options.add(new SearchConditionOption("1", SystemEnv.getHtmlLabelName(16658, languageid)));
		options.add(new SearchConditionOption("2", SystemEnv.getHtmlLabelName(24627, languageid)));
		return options;
	}
	
	//查询条件-归档状态下拉项
	public static List<SearchConditionOption> getArchiveStatusOption(int languageid){
		List<SearchConditionOption> options = new ArrayList<SearchConditionOption>();
		options.add(new SearchConditionOption("0", SystemEnv.getHtmlLabelName(332, languageid), true));
		options.add(new SearchConditionOption("1", SystemEnv.getHtmlLabelName(17999, languageid)));
		options.add(new SearchConditionOption("2", SystemEnv.getHtmlLabelName(18800, languageid)));
		return options;
	}
	
	//查询条件-归档状态下拉项(已办)
	public static List<SearchConditionOption> getArchiveStatusOption_done(int languageid){
		List<SearchConditionOption> options = new ArrayList<SearchConditionOption>();
		options.add(new SearchConditionOption("0", SystemEnv.getHtmlLabelName(332, languageid), true));
		options.add(new SearchConditionOption("1", SystemEnv.getHtmlLabelName(18800, languageid)));
		options.add(new SearchConditionOption("2", SystemEnv.getHtmlLabelName(17999, languageid)));
		return options;
	}
	
	
	//查询条件-流程状态下拉项
	public static List<SearchConditionOption> getVaildStatusOption(int languageid){
		List<SearchConditionOption> options = new ArrayList<SearchConditionOption>();
		options.add(new SearchConditionOption("0", SystemEnv.getHtmlLabelName(2246, languageid), true));
		options.add(new SearchConditionOption("1", SystemEnv.getHtmlLabelName(2245, languageid)));
		options.add(new SearchConditionOption("2", SystemEnv.getHtmlLabelName(332, languageid)));
		return options;
	}
	
	//查询条件-流程状态下拉项(待办、已办、我的请求)
	public static List<SearchConditionOption> getVaildStatusOption_list(int languageid){
		List<SearchConditionOption> options = new ArrayList<SearchConditionOption>();
		options.add(new SearchConditionOption("1", SystemEnv.getHtmlLabelName(2246, languageid), true));
		options.add(new SearchConditionOption("0", SystemEnv.getHtmlLabelName(2245, languageid)));
		options.add(new SearchConditionOption("2", SystemEnv.getHtmlLabelName(332, languageid)));
		return options;
	}
	
	//查询条件-节点类型下拉框
	public static List<SearchConditionOption> getNodeTypeOption(int languageid){
		List<SearchConditionOption> options = new ArrayList<SearchConditionOption>();
		options.add(new SearchConditionOption("", "", true));
		options.add(new SearchConditionOption("0", SystemEnv.getHtmlLabelName(125, languageid)));
		options.add(new SearchConditionOption("1", SystemEnv.getHtmlLabelName(142, languageid)));
		options.add(new SearchConditionOption("2", SystemEnv.getHtmlLabelName(725, languageid)));
		options.add(new SearchConditionOption("3", SystemEnv.getHtmlLabelName(251, languageid)));
		return options;
	}
	
}
