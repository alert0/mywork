package com.api.browser.service;

import java.util.ArrayList;
import java.util.List;

import weaver.conn.RecordSet;
import weaver.cpt.capital.CapitalComInfo;
import weaver.crm.Maint.CustomerInfoComInfo;
import weaver.docs.senddoc.DocReceiveUnitComInfo;
import weaver.formmode.tree.CustomTreeUtil;
import weaver.general.StaticObj;
import weaver.general.Util;
import weaver.hrm.company.DepartmentComInfo;
import weaver.hrm.company.SubCompanyComInfo;
import weaver.hrm.companyvirtual.DepartmentVirtualComInfo;
import weaver.hrm.companyvirtual.SubCompanyVirtualComInfo;
import weaver.hrm.resource.MutilResourceBrowser;
import weaver.hrm.resource.ResourceComInfo;
import weaver.interfaces.workflow.browser.Browser;
import weaver.interfaces.workflow.browser.BrowserBean;
import weaver.proj.Maint.ProjectInfoComInfo;
import weaver.workflow.field.BrowserComInfo;
import weaver.workflow.request.ResourceConditionManager;

import com.api.browser.bean.BrowserValueInfo;
import com.api.workflow.bean.FieldInfo;

/**
 * 
 * @author jhy Apr 24, 2017
 * 
 */
public class BrowserValueInfoService {

	/**
	 * 根据WorkflowJspBean改造
	 * 
	 * @param fieldType
	 * @param fieldValue
	 * @param languageId
	 * @param fielddbtype
	 * @return
	 * @throws Exception
	 */
	public List<BrowserValueInfo> getBrowserValueInfo(FieldInfo fieldinfo, String fieldValue, int languageId, int requestid) throws Exception {
		List<BrowserValueInfo> datas = new ArrayList<BrowserValueInfo>();
		String fieldType = Util.null2String(fieldinfo.getDetailtype());
		String fielddbtype = Util.null2String(fieldinfo.getFielddbtype());
		fieldValue = Util.null2String(fieldValue);
		if ("".equals(fieldType))
			return datas;
		if ("".equals(fieldValue))
			return datas;
		String[] valueArr = fieldValue.split(",");
		// 客户，多客户
		if ("7".equals(fieldType) || "18".equals(fieldType)) {
			CustomerInfoComInfo cci = new CustomerInfoComInfo();
			for (String cusId : valueArr) {
				datas.add(new BrowserValueInfo(cusId, cci.getCustomerInfoname(cusId)));
			}
			// 日期时间
		} else if (fieldType.equals("2") || fieldType.equals("19")) {
			datas.add(new BrowserValueInfo(fieldValue, fieldValue));
			// 项目，多项目
		} else if (fieldType.equals("8") || fieldType.equals("135")) {
			ProjectInfoComInfo pici = new ProjectInfoComInfo();
			for (String proId : valueArr) {
				datas.add(new BrowserValueInfo(proId, pici.getProjectInfoname(proId)));
			}
			// 多人力
		} else if ("17".equals(fieldType)) {
			int fieldid = fieldinfo.getFieldid();
			getMultResourceValueInfo(fieldValue, fieldid, languageId, datas, requestid);
			// 单人力
		} else if ("1".equals(fieldType) || "165".equals(fieldType) || "166".equals(fieldType) || "160".equals(fieldType)) {
			ResourceComInfo rci = new ResourceComInfo();
			for (String resourceId : valueArr) {
				datas.add(new BrowserValueInfo(resourceId, rci.getResourcename(resourceId)));
			}
		} else if ("4".equals(fieldType) || "57".equals(fieldType) || "167".equals(fieldType) || "168".equals(fieldType)) {
			// 部门，多部门
			DepartmentComInfo dci = new DepartmentComInfo();
			for (String depId : valueArr) {
				datas.add(new BrowserValueInfo(depId, dci.getDepartmentname(depId)));
			}
		} else if ("23".equals(fieldType)) {
			// 资产
			CapitalComInfo cci = new CapitalComInfo();
			for (String capId : valueArr) {
				datas.add(new BrowserValueInfo(capId, cci.getCapitalname(capId)));
			}
		} else if ("142".equals(fieldType)) {
			// 收发文单位
			DocReceiveUnitComInfo docReceiveUnitComInfo = new DocReceiveUnitComInfo();
			for (String docReceiveId : valueArr) {
				datas.add(new BrowserValueInfo(docReceiveId, docReceiveUnitComInfo.getReceiveUnitName(docReceiveId)));
			}
		} else if ("141".equals(fieldType)) {
			// 人力资源条件
			ResourceConditionManager rcm = new ResourceConditionManager();
			datas.add(new BrowserValueInfo(fieldValue, rcm.getFormShowName(fieldValue, languageId)));
		} else if ("118".equals(fieldType)) {
			//
		} else if ("161".equals(fieldType)) {
			// 自定义单选
			Browser browser = (Browser) StaticObj.getServiceByFullname(fielddbtype, Browser.class);
			BrowserBean bb = browser.searchById(fieldValue);
			String desc = Util.null2String(bb.getDescription());
			String name = Util.null2String(bb.getName());
			name = name.replaceAll("<", "&lt;");
			name = name.replaceAll(">", "&gt;");
			BrowserValueInfo temp = new BrowserValueInfo(fieldValue, name);
			temp.setTips(desc);
			datas.add(temp);
		} else if ("162".equals(fieldType)) {
			// 自定义多选
			Browser browser = (Browser) StaticObj.getServiceByFullname(fielddbtype, Browser.class);
			for (String curid : valueArr) {
				BrowserBean bb = browser.searchById(curid);
				String name = Util.null2String(bb.getName()).replaceAll("<", "&lt;").replaceAll(">", "&gt;");
				String desc = Util.null2String(bb.getDescription());
				BrowserValueInfo temp = new BrowserValueInfo(curid, name);
				temp.setTips(desc);
				datas.add(temp);
			}
			// 自定义树形单选
		} else if ("256".equals(fieldType) || "257".equals(fieldType)) {
			CustomTreeUtil customTreeUtil = new CustomTreeUtil();
			datas.add(new BrowserValueInfo(fieldValue, customTreeUtil.getTreeFieldShowName(fieldValue, fielddbtype)));
		} else {
			BrowserComInfo bci = new BrowserComInfo();
			String tablename = bci.getBrowsertablename(fieldType); // 浏览框对应的表,比如人力资源表
			String columname = bci.getBrowsercolumname(fieldType); // 浏览框对应的表名称字段
			String keycolumname = bci.getBrowserkeycolumname(fieldType); // 浏览框对应的表值字段
			RecordSet rs = new RecordSet();
			String sql = "select " + keycolumname + "," + columname + " from " + tablename + " where " + keycolumname + " in ( " + fieldValue + ")";
			rs.executeSql(sql);
			while (rs.next()) {
				String showid = Util.null2String(rs.getString(1));
				String tempshowname = Util.null2String(rs.getString(2));
				datas.add(new BrowserValueInfo(showid, tempshowname));
			}
		}
		return datas;
	}

	/**
	 * 多人力
	 * 
	 * @param fieldvalue
	 * @param fieldid
	 * @param languageid
	 * @param datas
	 * @param requestid
	 * @throws Exception
	 */
	private void getMultResourceValueInfo(String fieldvalue, int fieldid, int languageid, List<BrowserValueInfo> datas, int requestid) throws Exception {
		String fieldvalMD5 = Util.getEncrypt(fieldvalue);
		fieldvalue = "," + fieldvalue + ",";

		SubCompanyComInfo subcominfo = new SubCompanyComInfo();
		DepartmentComInfo depcominfo = new DepartmentComInfo();
		SubCompanyVirtualComInfo subcominfo2 = new SubCompanyVirtualComInfo();
		DepartmentVirtualComInfo depcominfo2 = new DepartmentVirtualComInfo();
		ResourceComInfo rescominfo = new ResourceComInfo();

		RecordSet rs = new RecordSet();
		RecordSet rs2 = new RecordSet();
		rs.executeSql("select requestid, fieldid, type, typeid, ids, md5 from workflow_reqbrowextrainfo where requestid=" + requestid + " and fieldid=" + fieldid + " order by id ");
		while (rs.next()) {
			List<BrowserValueInfo> userInfos = new ArrayList<BrowserValueInfo>();
			String valmd5 = Util.null2String(rs.getString("md5"));
			if (!valmd5.equals(fieldvalMD5)) {
				break;
			}

			int type = Util.getIntValue(Util.null2String(rs.getString("type")));
			int typeid = Util.getIntValue(Util.null2String(rs.getString("typeid")));
			String ids = Util.null2String(rs.getString("ids"));
			fieldvalue = fieldvalue.replace("," + ids + ",", ",");

			String[] idarry = ids.split(",");
			if (type != 9) {
				for (String resourceId : idarry) {
					userInfos.add(getUserInfo(resourceId, rescominfo, depcominfo, subcominfo));
				}
			}
			String title = "";
			String typeName = "resource";
			switch (type) {
			case 2:
				title = subcominfo.getSubCompanyname(typeid + "");
				typeName = "subcom";
				break;
			case 3:
				title = depcominfo.getDepartmentname(typeid + "");
				typeName = "dept";
				break;
			case 4:
				String sql = "select name from HrmGroup where id=" + typeid;
				rs2.executeSql(sql);
				if (rs2.next()) {
					title = Util.null2String(rs2.getString("name"));
				}
				typeName = "group";
				break;
			case 5:
				title = subcominfo2.getSubCompanyname(typeid + "");
				typeName = "subcom";
				break;
			case 7:
				title = depcominfo2.getDepartmentname(typeid + "");
				typeName = "dept";
				break;
			case 9:
				title = "所有人";
				typeName = "all";
				break;
			default:
				break;
			}

			if (type == 9) {
				BrowserValueInfo allUser = new BrowserValueInfo();
				allUser.setType(typeName);
				allUser.setLastname(title);
				allUser.setIds(ids);
				allUser.setCount(idarry.length);
				allUser.setId("all_users");
				datas.add(allUser);
			} else {
				String nodeid = typeName + "_" + typeid + "x";
				datas.add(new BrowserValueInfo(typeid + "", typeName, userInfos, nodeid, title));
			}

		}

		String[] resArray = fieldvalue.split(",");
		for (String resourceId : resArray) {
			if ("".equals(Util.null2String(resourceId))) {
				continue;
			}
			datas.add(getUserInfo(resourceId, rescominfo, depcominfo, subcominfo));
		}
	}

	private BrowserValueInfo getUserInfo(String userid, ResourceComInfo rcomInfo, DepartmentComInfo deptComInfo, SubCompanyComInfo subCompanyComInfo) throws Exception {
		BrowserValueInfo rbvi = new BrowserValueInfo();
		rbvi.setId(userid);
		rbvi.setLastname(rcomInfo.getLastname(userid));
		rbvi.setJobtitlename(MutilResourceBrowser.getJobTitlesname(userid));
		rbvi.setIcon(rcomInfo.getMessagerUrls(userid));
		rbvi.setType("resource");
		rbvi.setNodeid("resource_" + userid + "x");
		rbvi.setDepartmentname(deptComInfo.getDepartmentname(rcomInfo.getDepartmentID(userid)));
		String subcompanyid = deptComInfo.getSubcompanyid1(rcomInfo.getDepartmentID(userid));
		String parentsubcompanyid = subCompanyComInfo.getSupsubcomid(subcompanyid);
		rbvi.setSubcompanyname(subCompanyComInfo.getSubcompanyname(subcompanyid));
		rbvi.setSupsubcompanyname(subCompanyComInfo.getSubcompanyname(parentsubcompanyid));
		return rbvi;
	}
}
