package com.api.browser.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weaver.general.Util;
import weaver.hrm.User;
import weaver.hrm.city.CityComInfo;
import weaver.hrm.country.CountryComInfo;
import weaver.hrm.province.ProvinceComInfo;

import com.api.browser.bean.BrowserTreeNode;
import com.api.browser.service.BrowserService;
import com.api.browser.util.BrowserConstant;
import com.api.browser.util.BrowserDataType;

/**
 * 获取城市信息
 * @author jhy Mar 27, 2017
 *
 */
public class CityBrowserService extends BrowserService{

	@Override
	public Map<String, Object> getBrowserData(Map<String, Object> params) throws Exception {
		Map<String, Object> apidatas = new HashMap<String, Object>();
		User user = (User) params.get("user");
		apidatas.put(BrowserConstant.BROWSER_RESULT_TYPE, BrowserDataType.TREE_DATA.getTypeid());
		if(user == null){
			apidatas.put(BrowserConstant.BROWSER_RESULT_DATA, null);
			return apidatas;
		}
		String isLoadAll = Util.null2String(params.get("isLoadAll"));
		String type = Util.null2s(Util.null2String(params.get("type")),CityComInfo.TYPE_GLOBAL);
		String id = Util.null2String(params.get("id"));
		List<BrowserTreeNode> nodeDatas = getTreeNodeInfo(type,id,isLoadAll);
		apidatas.put(BrowserConstant.BROWSER_RESULT_DATA, nodeDatas);
		return apidatas;
	}
	
	/**
	 * 
	 * @param type
	 * @param pid
	 * @return
	 * @throws Exception 
	 */
	private List<BrowserTreeNode> getTreeNodeInfo(String type,String pid,String isLoadAll) throws Exception{
		List<BrowserTreeNode> nodes  = new ArrayList<BrowserTreeNode>();
		pid = Util.null2String(pid);
		//加载国家
		if(CityComInfo.TYPE_GLOBAL.equals(type)){
            CountryComInfo rs = new CountryComInfo();
            rs.setTofirstRow();
            while (rs.next()) {
            	String canceled = rs.getCountryiscanceled();
            	if("1".equals(canceled)) continue;
                String id = rs.getCountryid();
                String name = rs.getCountryname();
                BrowserTreeNode node = new BrowserTreeNode(id,name,pid,hasChild(CityComInfo.TYPE_COUNTRY, id));
                node.setType(CityComInfo.TYPE_COUNTRY);
                node.setIcon("/images/treeimages/country_wev8.gif");
                if("1".equals(isLoadAll)){
                	node.setSubs(getTreeNodeInfo(CityComInfo.TYPE_COUNTRY,id,isLoadAll));
                }
                nodes.add(node);
            }
		}else if(type.equals(CityComInfo.TYPE_COUNTRY)){ 
			ProvinceComInfo provs = new ProvinceComInfo();
            provs.setTofirstRow();
            while (provs.next()) {
            	String canceledProvs = provs.getProvinceiscanceled();
            	if("1".equals(canceledProvs)) continue;
                if (!provs.getProvincecountryid().equals(pid)) continue;
                String provid = provs.getProvinceid();
                String provname = provs.getProvincename();
                BrowserTreeNode node = new BrowserTreeNode(provid,provname,pid,hasChild(CityComInfo.TYPE_PROVINCE,provid));
                node.setType(CityComInfo.TYPE_PROVINCE);
                node.setIcon("/images/treeimages/Home_wev8.gif");
                if("1".equals(isLoadAll)){
                	node.setSubs(getTreeNodeInfo(CityComInfo.TYPE_PROVINCE,provid,isLoadAll));
                }
                nodes.add(node);
            }
		}else if(type.equals(CityComInfo.TYPE_PROVINCE)){
			CityComInfo cityComInfo = new CityComInfo();
			cityComInfo.setTofirstRow();
            while (cityComInfo.next()) {
                if (!cityComInfo.getCityprovinceid().equals(pid)) continue;
                String canceledCity = cityComInfo.getCitycanceled();
            	if("1".equals(canceledCity)) continue;
                String cityid = cityComInfo.getCityid();
                String cityname = cityComInfo.getCityname();
                BrowserTreeNode node = new BrowserTreeNode(cityid,cityname,pid,false);
                node.setType(CityComInfo.TYPE_CITY);
                node.setIcon("/images/treeimages/subCopany_Colse_wev8.gif");
                nodes.add(node);
            }
		}
		return nodes;
	}
	
    private boolean hasChild(String type, String id) throws Exception {
        if (type.equals(CityComInfo.TYPE_COUNTRY)) {
            ProvinceComInfo provs = new ProvinceComInfo();
            provs.setTofirstRow();
            while (provs.next()) {
                if (provs.getProvincecountryid().equals(id)&&!"1".equals(provs.getProvinceiscanceled())) {
                    return true;
                }
            }
        } else if (type.equals(CityComInfo.TYPE_PROVINCE)) {
        	CityComInfo cityComInfo = new CityComInfo();
        	cityComInfo.setTofirstRow();
            while (cityComInfo.next()) {
                if (cityComInfo.getCityprovinceid().equals(id)) {
                    return true;
                }
            }
        }
        return false;
    }

}
