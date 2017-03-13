package com.api.workflow.util;

import java.util.UUID;

/**
 * React化分页组参考pageuid生成类
 * 
 * @author liuzy 2016/12/15
 */
public class PageUidFactory {

	/**
	 * 获取React分页组件所需pageuid，每个分页组件唯一，直接通过Main程序生成随机UID常量即可
	 * 
	 * @return
	 */
	public static String getWfPageUid(String param){
		if("1".equals(param))
			return "0f57de4d-89bb-4b96-ac78-48ce9b834592";
		else if("2".equals(param))
			return "a789a53d-942d-4c88-85c4-4b95976cb2bb";
		else if("3".equals(param))
			return "d19e30a9-c139-445e-9630-f55f236ce175";
		else if("4".equals(param))
			return "71f4907f-1842-4c33-a3bb-337c397b57ea";
		else if("5".equals(param))
			return "9f067169-f212-441d-8a9b-8665407836ce";
		else if("6".equals(param))
			return "520c2417-e4ab-4642-b843-613add73caa2";
		else if("7".equals(param))
			return "16cab812-511e-4fed-9262-7519d582b9d0";
		else if("8".equals(param))
			return "e749769e-22ee-4190-9a4b-14e197b20135";
		else if("9".equals(param))
			return "5d9beb6e-549f-4882-970a-1020c922fcf1";
		else if("10".equals(param))
			return "0f2e73ed-b9c9-455f-9ead-ae019d05f2a5";
		else if("11".equals(param))
			return "06e5a77c-ee98-49c3-8c1a-00493c2fec31";
		else if("12".equals(param))
			return "646124a2-412d-4444-8ea9-2c5bf34facb3";
		else if("13".equals(param))
			return "57661e6b-062c-4af7-97e2-45117567c978";
		else if("14".equals(param))
			return "7e480d1e-9b9e-4d52-b8d6-f781f4c6a321";
		else if("15".equals(param))
			return "e5cda919-03dd-4de6-bc08-049265a157c8";
		else if("16".equals(param))
			return "6b5285af-b528-4c27-8b5f-47c3ad343b1c";
		else if ("REQUESTRES".equals(param)) // 相关资源
			return "28b1c813-81a8-4cf3-8421-1981e1de3675";
		else if ("SearchWorkflow".equals(param)) // 查询流程
			return "69a2cf53-4d18-4c63-a3ee-a53f57b3c52a";
		else if ("wfshare".equals(param)) // 共享列表
			return "5ed80b1c-617c-4c4e-b98c-26f46f7a0066";
		return "";
	}
	
	/**
	 * 浏览框列表pageuid
	 * 
	 * @param param
	 * @return
	 */
	public static String getBrowserUID(String param){
		if("wflist".equals(param)){
			return "4dffb183-b75e-44c4-95ed-3c7398ecff85";
		}else if("wftypelist".equals(param)){
			return "f58d24e7-ffff-4489-a773-eb40135b3100";
		}else if("prolist".equals(param)){
			return "000a19db-657e-4570-b720-8d51366f4224";
		}else if("cuslist".equals(param)){
			return "25fe8018-3f78-42c7-80fb-5803a2446c9c";
		}else if("doclist".equals(param)){
			return "0068f8a8-958d-4fef-a62c-ed728cc974c7";
		} else if ("rolelist".equals(param)) {
			return "0068f8a8-958d-4fef-a62c-ed728cc974c8";
		} else if ("hrmcountrylist".equals(param)) {
			return "0068f8a8-958d-4fef-a62c-ed728cc974c9";
		} else if ("customerstatuslist".equals(param)) {
			return "0068f8a8-958d-4fef-a62c-ed728cc974d0";
		} else if ("customertypelist".equals(param)) {
			return "0068f8a8-958d-4fef-a62c-ed728cc974d1";
		} else if ("customerdesclist".equals(param)) {
			return "0068f8a8-958d-4fef-a62c-ed728cc974d2";
		} else if ("customersizelist".equals(param)) {
			return "0068f8a8-958d-4fef-a62c-ed728cc974d3";
		} else if ("projecttypeList".equals(param)) {
			return "0068f8a8-958d-4fef-a62c-ed728cc974d4";
		} else if ("worktypeList".equals(param)) {
			return "0068f8a8-958d-4fef-a62c-ed728cc974d5";
		}

		return "";
	}
	
	public static void main(String[] args){
		for(int i=0; i<10; i++){
			UUID uuid = UUID.randomUUID();
			System.err.println(uuid);
		}
	}
	
}
