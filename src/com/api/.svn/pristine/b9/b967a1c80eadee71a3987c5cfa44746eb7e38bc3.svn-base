package com.api.workflow.util;

import java.util.*;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.User;
import com.api.workflow.bean.WfTreeNode;
//import weaver.workflow.request.todo.RequestUtil;

/**
 * E9需求-统一待办方法统一放到此类中，便于兼容E8等
 * @author liuzy
 */
public class OtherSystemRequestUtil {
	
	//待办树集成异构系统信息
	public void extendToDoTreeData(List<WfTreeNode> tree, User user){
		/*if (RequestUtil.isOpenOtherSystemToDo()) {
			RecordSet rs = new RecordSet();
			RecordSet rs1 = new RecordSet();
			RecordSet rs2 = new RecordSet();
			rs.executeSql("select sysid,sysshortname,sysfullname,(select COUNT(requestid) from ofs_todo_data where userid="+ user.getUID()
						+ " AND workflowid in (select workflowid from ofs_workflow where ofs_workflow.sysid=ofs_sysinfo.sysid and cancel=0) and isremark='0') as dbs from ofs_sysinfo where cancel=0 order by sysid desc");
			while (rs.next()) {
				String _typeid = rs.getString(1);
				String _typename = rs.getString(2);
				int dbs = rs.getInt("dbs");
				if (dbs == 0)
					continue;
				if (new RequestUtil().getOfsSetting().getShowsysname().equals("2"))
					_typename = rs.getString(3);
				WfTreeNode typenode = new WfTreeNode();
				typenode.setDomid("type_"+_typeid);
				typenode.setKey(_typeid);
				typenode.setName(_typename);
				typenode.setIsopen(true);
				typenode.setHaschild(true);
				List<WfTreeNode> childs = new ArrayList<WfTreeNode>();
				typenode.setChilds(childs);
				
				rs1.executeSql("select workflowid,workflowname from ofs_workflow where sysid="+_typeid+" and cancel=0 order by workflowname asc, workflowid desc");//查询OS流程
				while (rs1.next()) {
					String _wfid = rs1.getString(1);
					String _wfname = rs1.getString(2);
					rs2.executeSql("select count(requestid) from ofs_todo_data where userid="+user.getUID()+" AND workflowid=" + _wfid + " and isremark='0' ");
					if (rs2.next() && rs2.getInt(1) == 0)
						continue;
					WfTreeNode wfnode = new WfTreeNode();
					wfnode.setDomid("wf_"+_wfid);
					wfnode.setKey(_wfid);
					wfnode.setName(_wfname);
					childs.add(wfnode);
				}
				if(childs.size()>0)
					tree.add(typenode);
			}
		}*/
	}
	
	//待办树计数集成异构系统信息
	public void extendToDoCountData(Map<String,Map<String,String>> countmap, User user){
		/*if (new RequestUtil().getOfsSetting().getIsuse() == 1) {
			RecordSet rs = new RecordSet();
			RecordSet rs1 = new RecordSet();
			RecordSet rs2 = new RecordSet();
			rs.executeSql("select sysid,sysshortname from ofs_sysinfo order by sysid desc");
			while (rs.next()) {
				String _typeid = rs.getString(1);
				rs1.executeSql("select workflowid,workflowname from ofs_workflow where sysid=" + _typeid+ " and Cancel=0 order by workflowid desc");
				int wfcountall = 0;
				int wfnewcountall = 0;
				while (rs1.next()) {
					String _wfid = rs1.getString(1);
					String sqlos = "select COUNT(requestid) from ofs_todo_data where workflowid=" + _wfid+ " and userid=" + user.getUID() + " and isremark='0' and islasttimes=1";
					rs2.executeSql(sqlos);
					int wfcount = 0;
					if (rs2.next())
						wfcount = Util.getIntValue(rs2.getString(1), 0);
					if(wfcount == 0)
						continue;
					sqlos = "select COUNT(requestid) from ofs_todo_data where workflowid=" + _wfid + " and userid="+ user.getUID() + " and isremark='0' and islasttimes=1 and viewtype=0 ";
					rs2.executeSql(sqlos);
					int wfnewcount = 0;
					if (rs2.next())
						wfnewcount = Util.getIntValue(rs2.getString(1), 0);
					
					Map<String,String> wfcountmap = new HashMap<String,String>();
					wfcountmap.put("domid", "wf_"+_wfid);
					wfcountmap.put("keyid", _wfid);
					wfcountmap.put("flowAll", wfcount+"");
					wfcountmap.put("flowNew", wfnewcount+"");
					wfcountmap.put("flowRes", "0");
					wfcountmap.put("flowOver", "0");
					wfcountmap.put("flowSup", "0");
					countmap.put(wfcountmap.get("domid"), wfcountmap);
					wfcountall += wfcount;
					wfnewcountall += wfnewcount;
				}
				Map<String,String> typecountmap = new HashMap<String,String>();
				typecountmap.put("domid", "type_"+_typeid);
				typecountmap.put("keyid", _typeid);
				typecountmap.put("flowAll", wfcountall+"");
				typecountmap.put("flowNew", wfnewcountall+"");
				typecountmap.put("flowRes", "0");
				typecountmap.put("flowOver", "0");
				typecountmap.put("flowSup", "0");
				if(wfcountall > 0)
					countmap.put(typecountmap.get("domid"), typecountmap);
			}
		}*/
	}
	
	public int getToDoFlowAllCount(User user){
		/*if (new RequestUtil().getOfsSetting().getIsuse() == 1) {
			RecordSet RecordSet = new RecordSet();
			RecordSet.executeSql("select COUNT(requestid) from ofs_todo_data where userid=" + user.getUID()+ " and isremark='0' and islasttimes=1");
			if (RecordSet.next())
				return Util.getIntValue(RecordSet.getString(1), 0);
		}*/
		return 0;
	}
	
	public int getToDoFlowNewCount(User user){
		/*if (new RequestUtil().getOfsSetting().getIsuse() == 1) {
			RecordSet RecordSet = new RecordSet();
			RecordSet.executeSql("select COUNT(requestid) from ofs_todo_data where userid=" + user.getUID()+ " and isremark='0' and islasttimes=1 and viewtype=0 ");
			if (RecordSet.next())
				return Util.getIntValue(RecordSet.getString(1), 0);
		}*/
		return 0;
	}
	
	//已办树集成异构系统信息
	public void extendHandledTreeData(List<WfTreeNode> tree, User user){
		/*RequestUtil requestutil = new RequestUtil();
		if (requestutil.getOfsSetting().getIsuse() == 1) {
			RecordSet rs = new RecordSet();
			RecordSet rs1 = new RecordSet();
			RecordSet rs2 = new RecordSet();
			rs.executeSql("select sysid,sysshortname,sysfullname,(select COUNT(requestid) from ofs_todo_data where userid="+ user.getUID()
						+ " AND sysid=ofs_sysinfo.sysid and isremark in (2,4) and islasttimes=1 ) as c from ofs_sysinfo where cancel=0 order by sysid desc");
			while (rs.next()) {
				String _typeid = rs.getString(1);
				String _typename = rs.getString(2);
				int c = rs.getInt("c");
				if (c <= 0)
					continue;
				if (requestutil.getOfsSetting().getShowsysname().equals("2"))
					_typename = rs.getString(3);
				WfTreeNode typenode = new WfTreeNode();
				typenode.setDomid("type_"+_typeid);
				typenode.setKey(_typeid);
				typenode.setName(convertChar(_typename, user.getLanguage()));
				typenode.setIsopen(true);
				typenode.setHaschild(true);
				List<WfTreeNode> childs = new ArrayList<WfTreeNode>();
				typenode.setChilds(childs);
				
				rs1.executeSql("select workflowid,workflowname from ofs_workflow where sysid=" + _typeid+ " order by workflowname asc,workflowid desc");//查询OS流程
				while (rs1.next()) {
					String _wfid = rs1.getString(1);
					String _wfname = rs1.getString(2);
					rs2.executeSql("select count(requestid) from ofs_todo_data where userid=" + user.getUID()+ " AND workflowid=" + _wfid + " and isremark in (2,4) and islasttimes=1 ");
					if (rs2.next() && rs2.getInt(1) == 0)
						continue;
					WfTreeNode wfnode = new WfTreeNode();
					wfnode.setDomid("wf_"+_wfid);
					wfnode.setKey(_wfid);
					wfnode.setName(_wfname);
					childs.add(wfnode);
				}
				if(childs.size() > 0)
					tree.add(typenode);
			}
		}*/
	}
	
	//已办树计数集成异构系统信息
	public void extendHandledCountData(Map<String,Map<String,String>> countmap, User user){
		/*if (new RequestUtil().getOfsSetting().getIsuse() == 1) {
			RecordSet rs = new RecordSet();
			RecordSet rs1 = new RecordSet();
			RecordSet rs2 = new RecordSet();
			rs.executeSql("select sysid,(select COUNT(requestid) from ofs_todo_data where userid="+ user.getUID()
						+ " AND workflowid in (select workflowid from ofs_workflow where sysid=ofs_sysinfo.sysid and cancel=0) and isremark in (2,4) and islasttimes=1) as allc,(select COUNT(requestid) from ofs_todo_data where userid="
						+ user.getUID()
						+ " AND workflowid in (select workflowid from ofs_workflow where sysid=ofs_sysinfo.sysid and cancel=0) and isremark in (2,4) and islasttimes=1 and viewtype=0 ) as newc from ofs_sysinfo  where cancel=0 ");
			while (rs.next()) {
				String _typeid = rs.getString("sysid");
				int allc = rs.getInt("allc");
				if(allc == 0)
					continue;
				Map<String,String> typecountmap = new HashMap<String,String>();
				typecountmap.put("domid", "type_"+_typeid);
				typecountmap.put("keyid", _typeid);
				typecountmap.put("flowAll", allc+"");
				typecountmap.put("flowNew", rs.getInt("newc")+"");
				typecountmap.put("flowRes", "0");
				countmap.put(typecountmap.get("domid"), typecountmap);
				
				rs1.executeSql("select workflowid,workflowname from ofs_workflow where sysid=" + _typeid+ " and cancel=0");
				while (rs1.next()) {
					String _wfid = rs1.getString(1);
					rs2.executeSql("select COUNT(requestid) from ofs_todo_data where userid=" + user.getUID()+ " AND workflowid=" + _wfid + " and isremark in (2,4) and islasttimes=1");
					int wfcount = 0;
					if (rs2.next())
						wfcount = Util.getIntValue(rs2.getString(1), 0);
					if(wfcount == 0)
						continue;
					rs2.executeSql("select COUNT(requestid) from ofs_todo_data where userid=" + user.getUID()+ " AND workflowid=" + _wfid + " and isremark in (2,4) and islasttimes=1 and viewtype=0 ");
					int wfnewcount = 0;
					if (rs2.next())
						wfnewcount = Util.getIntValue(rs2.getString(1), 0);
					Map<String,String> wfcountmap = new HashMap<String,String>();
					wfcountmap.put("domid", "wf_"+_wfid);
					wfcountmap.put("keyid", _wfid);
					wfcountmap.put("flowAll", wfcount+"");
					wfcountmap.put("flowNew", wfnewcount+"");
					wfcountmap.put("flowRes", "0");
					countmap.put(wfcountmap.get("domid"), wfcountmap);
				}
			}
		}*/
	}
	
	//我的请求树集成异构系统信息
	public void extendMineTreeData(List<WfTreeNode> tree, User user){
		/*if (new RequestUtil().getOfsSetting().getIsuse() == 1) {
			RecordSet rs = new RecordSet();
			RecordSet rs1 = new RecordSet();
			RecordSet rs2 = new RecordSet();
			rs.executeSql("select sysid,sysshortname from ofs_sysinfo where cancel=0 order by sysid desc ");	// 查询流程分类数据
			while (rs.next()) {
				String _typeid = rs.getString(1);
				String _typename = rs.getString(2);
				rs1.executeSql("select 1 from ofs_todo_data where creatorid=" + user.getUID()+ " and creatorid=userid and islasttimes=1 and sysid=" + _typeid);
				int allwfcount = rs1.getCounts();
				if (allwfcount == 0)
					continue;
				WfTreeNode typenode = new WfTreeNode();
				typenode.setDomid("type_"+_typeid);
				typenode.setKey(_typeid);
				typenode.setName(convertChar(_typename, user.getLanguage()));
				typenode.setIsopen(true);
				typenode.setHaschild(true);
				List<WfTreeNode> childs = new ArrayList<WfTreeNode>();
				typenode.setChilds(childs);
				
				rs1.executeSql("select workflowid,workflowname from ofs_workflow where sysid=" + _typeid
					+ " and cancel=0  order by workflowname asc,workflowid desc");// 查询EAS流程
				while (rs1.next()) {
					String _wfid = rs1.getString(1);
					String _wfname = rs1.getString(2);
					rs2.executeSql("select count(*) from ofs_todo_data where creatorid=" + user.getUID()
						+ " and creatorid=userid and islasttimes=1 and workflowid=" + _wfid + " and sysid=" + _typeid);
					if (rs2.next() && rs2.getInt(1) == 0)
						continue;
					WfTreeNode wfnode = new WfTreeNode();
					wfnode.setDomid("wf_"+_wfid);
					wfnode.setKey(_wfid);
					wfnode.setName(_wfname);
					childs.add(wfnode);
				}
				if(childs.size() > 0)
					tree.add(typenode);
			}
		}*/
	}
	
	//我的请求树计数集成异构系统信息
	public void extendMineCountData(Map<String,Map<String,String>> countmap, User user){
		/*if (new RequestUtil().getOfsSetting().getIsuse() == 1) {
			RecordSet rs = new RecordSet();
			RecordSet rs1 = new RecordSet();
			RecordSet rs2 = new RecordSet();
			rs.executeSql("select sysid,(select COUNT(requestid) from ofs_todo_data where creatorid = "+ user.getUID()
						+ "  and creatorid=userid AND islasttimes=1 AND workflowid in (select workflowid from ofs_workflow where sysid=ofs_sysinfo.sysid and cancel=0) ) as allc,(select COUNT(requestid) from ofs_todo_data where creatorid="
						+ user.getUID()
						+ " and creatorid=userid and isremark='0' AND workflowid in (select workflowid from ofs_workflow where sysid=ofs_sysinfo.sysid and cancel=0) ) as alldb from ofs_sysinfo  where cancel=0 ");
			while (rs.next()) {
				String _typeid = rs.getString("sysid");
				int allc = rs.getInt("allc");
				if(allc == 0)
					continue;
				Map<String,String> typecountmap = new HashMap<String,String>();
				typecountmap.put("domid", "type_"+_typeid);
				typecountmap.put("keyid", _typeid);
				typecountmap.put("flowAll", allc+"");
				typecountmap.put("flowNew", rs.getInt("alldb")+"");
				typecountmap.put("flowRes", "0");
				typecountmap.put("flowOver", "0");
				countmap.put(typecountmap.get("domid"), typecountmap);

				rs1.executeSql("select workflowid,workflowname from ofs_workflow where sysid=" + _typeid+ " and cancel=0");
				while (rs1.next()) {
					String _wfid = rs1.getString(1);
					rs2.executeSql("select COUNT(requestid) from ofs_todo_data where creatorid=" + user.getUID()
						+ " and creatorid=userid AND islasttimes=1 AND workflowid=" + _wfid + " ");
					int wfcount = 0;
					if (rs2.next())
						wfcount = Util.getIntValue(rs2.getString(1), 0);
					if(wfcount == 0)
						continue;
					rs2.executeSql("select count(*) from ofs_todo_data where creatorid=" + user.getUID()
						+ " and creatorid=userid AND islasttimes=1 and isremark='0' and workflowid=" + _wfid + " and sysid=" + _typeid);
					int wfnewcount = 0;
					if (rs2.next())
						wfnewcount = Util.getIntValue(rs2.getString(1), 0);
					Map<String,String> wfcountmap = new HashMap<String,String>();
					wfcountmap.put("domid", "wf_"+_wfid);
					wfcountmap.put("keyid", _wfid);
					wfcountmap.put("flowAll", wfcount+"");
					wfcountmap.put("flowNew", wfnewcount+"");
					wfcountmap.put("flowRes", "0");
					wfcountmap.put("flowOver", "0");
					countmap.put(wfcountmap.get("domid"), wfcountmap);
				}
			}
		}*/
	}
	
	
	private String convertChar(String str, int languageid){
		return Util.toScreenForJs(Util.toScreen(str, languageid));
	}
	
}
