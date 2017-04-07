package com.api.workflow.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import net.sourceforge.pinyin4j.PinyinHelper;
import weaver.conn.RecordSet;
import weaver.general.BaseBean;
import weaver.general.Pinyin4j;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.hrm.company.DepartmentComInfo;
import weaver.hrm.job.JobTitlesComInfo;
import weaver.hrm.resource.ResourceComInfo;
import weaver.share.ShareManager;
import weaver.soa.workflow.WorkFlowInit;

import com.alibaba.fastjson.JSON;
import com.api.workflow.bean.WfBean;
import com.api.workflow.bean.WfType;
import com.api.workflow.bean.WfUser;
import weaver.workflow.workflow.WorkTypeComInfo;
import weaver.workflow.workflow.WorkflowVersion;

/**
 * 新建流程Service
 * 
 * @author wuser0326
 * 
 */
@Path("/workflow/createreq")
public class CreateRequestService extends BaseBean {

	private User user;
	private Map<String, WfType> wftypeInfo = null;
	private WorkTypeComInfo worktypecominfo = null;
	private ResourceComInfo resourceComInfo = null;
	private DepartmentComInfo departmentComInfo = null;
	private JobTitlesComInfo jobTitlesComInfo = null;
	private RecordSet rs = null;
	private ShareManager shareManager = null;
	private WorkFlowInit workflowInit = null;
	private List<String> usedtodoList = null;

	private String[] colors = null;
	private String[] imgs = null;

	private String isuserdefault; // 是否收藏
	private String selectedworkflow;
	private String currentdate;
	private String currenttime;

	private long start = System.currentTimeMillis();

	private void init() {
		this.wftypeInfo = new HashMap<String, WfType>();
		this.shareManager = new ShareManager();
		this.workflowInit = new WorkFlowInit();
		try {
			this.worktypecominfo = new WorkTypeComInfo();
			this.departmentComInfo = new DepartmentComInfo();
			this.resourceComInfo = new ResourceComInfo();
			this.jobTitlesComInfo = new JobTitlesComInfo();
		} catch (Exception e) {
			e.printStackTrace();
		}
		this.rs = new RecordSet();
		this.usedtodoList = new ArrayList<String>();
		Calendar today = Calendar.getInstance();
		this.currentdate = Util.add0(today.get(Calendar.YEAR), 4) + "-" + Util.add0(today.get(Calendar.MONTH) + 1, 2) + "-" + Util.add0(today.get(Calendar.DAY_OF_MONTH), 2);

		this.currenttime = Util.add0(today.get(Calendar.HOUR_OF_DAY), 2) + ":" + Util.add0(today.get(Calendar.MINUTE), 2) + ":" + Util.add0(today.get(Calendar.SECOND), 2);
		this.selectedworkflow = "";

		this.colors = new String[] { "#55D2D4", "#B37BFA", "#FFC62E", "#8DCE36", "#37B2FF", "#FF9537", "#FF5E56", "#FFC62E" };
		this.imgs = new String[] { "icon-New-Flow-Personnel-matters", "icon-New-Flow-contract", "icon-New-Flow-task", "icon-New-Flow-printing", "icon-New-Flow-summary", "icon-cooperation-approval",
				"icon-cooperation-theme", "icon-meeting-cycle" };
	}

	/**
	 * 1:查询当前用户所有有创建权限的流程 2:判断次账号是否有流程创建权限 3:判断当前流程是否收藏
	 */
	@GET
	@Path("/wfinfo")
	@Produces(MediaType.TEXT_PLAIN)
	public String loadCreateWfInfo(@Context HttpServletRequest request,@Context HttpServletResponse response) {
		this.user = HrmUserVarify.getUser(request,response);
		init();
		String belongtoshow = "";

		// 判断主次账户是否统一显示
		rs.executeQuery("select belongtoshow from HrmUserSetting where resourceId = ?", user.getUID());
		if (rs.next()) {
			belongtoshow = Util.null2String(rs.getString("belongtoshow"));
		}
		writeLog("---------111:" + (System.currentTimeMillis() - start));
		start = System.currentTimeMillis();
		String userIDAll = String.valueOf(user.getUID());
		if (!"".equals(Util.null2String(user.getBelongtoids())) && "1".equals(belongtoshow)) {
			userIDAll = user.getUID() + "," + user.getBelongtoids();
		}

		String logintype = user.getLogintype();
		int usertype = 0;
		if (logintype.equals("2")) {
			usertype = 1;
		}
		writeLog("---------123:" + (System.currentTimeMillis() - start));
		start = System.currentTimeMillis();
		if (usertype == 0) {
			rs.executeProc("workflow_RUserDefault_Select", String.valueOf(user.getUID()));
			if (rs.next()) {
				selectedworkflow = rs.getString("selectedworkflow");
				isuserdefault = rs.getString("isuserdefault");
			}
		}
		writeLog("---------116:" + (System.currentTimeMillis() - start));
		start = System.currentTimeMillis();
		// isuserdefault = ("1".equals(needall))?"0":isuserdefault;

		if (!selectedworkflow.equals(""))
			selectedworkflow += "|";

		// 加载常用流程
		loadUsedtodoWf(usertype);
		writeLog("---------125:" + (System.currentTimeMillis() - start));
		start = System.currentTimeMillis();
		// 加载所有可创建流程
		loadAllWfCreateInfo(userIDAll, usertype);
		writeLog("---------129:" + (System.currentTimeMillis() - start));
		start = System.currentTimeMillis();
		// 加载可代理创建流程
		if (usertype == 0) {
			loadWfAgentInfo(userIDAll);
		}
		writeLog("---------135:" + (System.currentTimeMillis() - start));
		start = System.currentTimeMillis();
		// 剔除数据中心流程
		getAllInputReport();
		writeLog("---------139:" + (System.currentTimeMillis() - start));
		start = System.currentTimeMillis();
		List<WfType> wftypes = sortWfTypes();
		return JSON.toJSONString(wftypes);
	}

	/**
	 * 加载当前用户主次账号所有的可新建流程
	 * 
	 * @return
	 */
	private void loadAllWfCreateInfo(String userIDAll, int usertype) {
		String[] arr = userIDAll.split(",");
		int userid = 0;
		User _User = null;
		WfType wftype = null;
		String typeid, workflowid = "";
		writeLog("----开始加载数据-----155:" + (System.currentTimeMillis() - start));
		start = System.currentTimeMillis();
		for (int i = 0; i < arr.length; i++) {
			String sql = "select t2.workflowtype,t1.workflowid,t2.workflowname,t2.isimportwf from ShareInnerWfCreate t1,workflow_base t2 where t1.workflowid=t2.id   and t2.isvalid='1' and t1.usertype = ? ";
			userid = Util.getIntValue(arr[i]);
			_User = workflowInit.getUser(userid);
			String wfcrtSqlWhere = shareManager.getWfShareSqlWhere(_User, "t1");
			// 所有可创建流程类型集合
			sql += " and " + wfcrtSqlWhere + " order by  t2.dsporder asc, t2.workflowname ";
			rs.executeQuery(sql, usertype);
			writeLog("----查询SQL------165:" + sql);
			writeLog("----查询时间-----165:" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
			while (rs.next()) {
				typeid = rs.getString("workflowtype");
				wftype = wftypeInfo.get(typeid);
				if (wftype == null) {
					wftype = new WfType();
					wftype.setId(typeid);
					wftype.setTypeName(worktypecominfo.getWorkTypename(typeid));
					// 设置该类型是否收藏
					if (selectedworkflow.indexOf("T" + typeid + "|") > 0) {
						wftype.setWftypeColl("1");
					} else {
						wftype.setWftypeColl("0");
					}
					wftypeInfo.put(typeid, wftype);
				}

				workflowid = rs.getString("workflowid");
				Map<String, WfBean> wfbeanInfo = wftype.getWfbeanInfo();
				WfBean wfbean = wfbeanInfo.get(workflowid);
				if (wfbean == null) {
					wfbean = new WfBean();
					wfbean.setId(workflowid);
					String wfname = Util.null2String(rs.getString("workflowname"));
					wfbean.setName(wfname);
					wfbean.setTypeId(typeid);
					wfbean.setIsImportWf(rs.getString("isimportwf"));
					if (selectedworkflow.indexOf("W" + workflowid + "|") > 0 && isuserdefault.equals("1")) {
						wfbean.setWfColl("1");
					} else {
						wfbean.setWfColl("0");
					}
					if (usedtodoList.contains(workflowid)) {
						wfbean.setUsedtodo("1");
						wfbean.setUsedtodoorder(usedtodoList.indexOf(workflowid));
					}

					wfbean.setLetter(getWfNameFirstLetter(wfname));
					wfbean.setSpell(Pinyin4j.spell(wfname));
					wfbeanInfo.put(workflowid, wfbean);
				}

				// 主账号
				if (user.getUID() == userid) {
					wfbean.setUser(getWfUser(String.valueOf(user.getUID())));
				} else {
					WfUser belonguser = getWfUser(String.valueOf(userid));
					if(!wfbean.getBelongtoUsers().contains(belonguser)){
						wfbean.getBelongtoUsers().add(belonguser);
					}
				}
			}

			writeLog("----轮询时间-----165:" + (System.currentTimeMillis() - start));
			start = System.currentTimeMillis();
		}
	}

	private String getWfNameFirstLetter(String wfname) {
		char chinese = wfname.charAt(0);
		String letter = PinyinHelper.toHanyuPinyinStringArray(chinese) == null ? chinese + "" : PinyinHelper.toHanyuPinyinStringArray(chinese)[0];
		letter = (letter.charAt(0) + "").toUpperCase();
		return letter;
	}

	private WfUser getWfUser(String userId) {
		WfUser wfUser = new WfUser();
		wfUser.setId(userId);
		wfUser.setLastname(resourceComInfo.getLastname(userId));
		wfUser.setSubcompany(resourceComInfo.getSubCompanyID(userId));
		wfUser.setDepartment(resourceComInfo.getDepartmentID(userId));
		wfUser.setJobtitlename(jobTitlesComInfo.getJobTitlesname(resourceComInfo.getJobTitle(userId)));
		try {
			wfUser.setDepartmentName(departmentComInfo.getDepartmentname(wfUser.getDepartment()));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return wfUser;
	}

	/**
	 * 记载当前用户主次账号所有代理创建的流程
	 * 
	 * @param userIDAll
	 */
	private void loadWfAgentInfo(String userIDAll) {

		// 创建代理增加功能
		// 获得当前的日期和时间
		String begindate, begintime, enddate, endtime = "";
		String agentworkflowtype, agentworkflow = "";
		int beagenterid = 0;
		ResourceComInfo rcominfo = null;
		try {
			rcominfo = new ResourceComInfo();
		} catch (Exception e) {
			e.printStackTrace();
		}

		String agentUserSql = "select distinct t.bagentuid from workflow_agentConditionSet t,workflow_base t1 where t.workflowid=t1.id and t.agenttype>'0' and t.iscreateagenter=1 and t.agentuid in ("
				+ userIDAll + ") ";
		RecordSet agentRs = new RecordSet();
		agentRs.executeSql(agentUserSql);
		while (agentRs.next()) {
			int bagentuid = Util.getIntValue(agentRs.getString(1));

			String bstatus = rcominfo.getStatus(bagentuid + "");
			if ("5".equals(bstatus) || "".equals(bstatus)) {
				continue;
			}

			User bagentUser = new User(bagentuid);

			String bagentWfcrtSqlWhereMain = shareManager.getWfShareSqlWhere(bagentUser, "t3");
			String agentUserPermissionSql = "select distinct t1.workflowtype,t.workflowid,t.bagentuid,t.begindate,t.begintime,t.enddate,t.endtime,t1.workflowname,t1.isimportwf "
					+ " from workflow_agentConditionSet t,workflow_base t1, ShareInnerWfCreate t3 " + " where t.workflowid=t1.id and t.agenttype>'0' and t.iscreateagenter=1 and t.agentuid in ("
					+ userIDAll + ") " + " and t1.id=t3.workflowid and t3.usertype=0 and " + bagentWfcrtSqlWhereMain + " order by t1.workflowtype,t.workflowid";

			rs.executeSql(agentUserPermissionSql);
			while (rs.next()) {
				begindate = Util.null2String(rs.getString("begindate"));
				begintime = Util.null2String(rs.getString("begintime"));
				enddate = Util.null2String(rs.getString("enddate"));
				endtime = Util.null2String(rs.getString("endtime"));
				agentworkflowtype = Util.null2String(rs.getString("workflowtype"));
				agentworkflow = Util.null2String(rs.getString("workflowid"));
				beagenterid = Util.getIntValue(rs.getString("bagentuid"), 0);
				agentworkflow = WorkflowVersion.getActiveVersionWFID(agentworkflow);
				// 判断代理时间是否到期
				if (!"".equals(begindate)) {
					if ((begindate + " " + begintime).compareTo(currentdate + " " + currenttime) > 0)
						continue;
				}
				if (!"".equals(enddate)) {
					if ((enddate + " " + endtime).compareTo(currentdate + " " + currenttime) < 0)
						continue;
				}

				// 验证必要数据是否为空
				if ("".equals(agentworkflowtype) || beagenterid == 0 || "".equals(agentworkflow)) {
					continue;
				}

				// 更新数据到集合
				WfType wftype = wftypeInfo.get(agentworkflowtype);
				if (wftype == null) {
					wftype = new WfType();
					wftype.setId(agentworkflowtype);
					wftype.setTypeName(worktypecominfo.getWorkTypename(agentworkflowtype));
					// 设置该类型是否收藏
					if (selectedworkflow.indexOf("T" + agentworkflowtype + "|") > 0 && isuserdefault.equals("1")) {
						wftype.setWftypeColl("1");
					} else {
						wftype.setWftypeColl("0");
					}
					wftypeInfo.put(agentworkflowtype, wftype);
				}

				// 初始化WfType会更新无需验证是否为空
				Map<String, WfBean> wfbeanInfo = wftype.getWfbeanInfo();
				WfBean wfbean = wfbeanInfo.get(agentworkflow);
				if (wfbean == null) {
					wfbean = new WfBean();
					wfbean.setId(agentworkflow);
					String wfname = Util.null2String(rs.getString("workflowname"));
					wfbean.setName(wfname);
					wfbean.setTypeId(agentworkflowtype);
					wfbean.setIsImportWf(Util.null2String(rs.getString("isimportwf")));
					if (selectedworkflow.indexOf("W" + agentworkflow + "|") > 0 && isuserdefault.equals("1")) {
						wfbean.setWfColl("1");
					} else {
						wfbean.setWfColl("0");
					}
					if (usedtodoList.contains(agentworkflow)) {
						wfbean.setUsedtodo("1");
						wfbean.setUsedtodoorder(usedtodoList.indexOf(agentworkflow));
					}
					wfbean.setLetter(getWfNameFirstLetter(wfname));
					wfbean.setSpell(Pinyin4j.spell(wfname));
					wfbeanInfo.put(agentworkflow, wfbean);
				}

				WfUser beagentuser  =  getWfUser(String.valueOf(beagenterid));
				if(!wfbean.getBeagenters().contains(beagentuser)){
					wfbean.getBeagenters().add(beagentuser);
				}
			}
		}
	}

	/**
	 * 剔除数据中心流程
	 */
	private void getAllInputReport() {
		String dataCenterWorkflowTypeId = "";
		rs.executeSql("select currentId from sequenceindex where indexDesc='dataCenterWorkflowTypeId'");
		if (rs.next()) {
			dataCenterWorkflowTypeId = Util.null2String(rs.getString("currentId"));
		}
		if ("".equals(dataCenterWorkflowTypeId)) {
			return;
		}
		wftypeInfo.remove(dataCenterWorkflowTypeId);
	}

	/**
	 * 加载当前用户使用频率最高的10条流程
	 */
	private void loadUsedtodoWf(int usertype) {
		if (usertype == 0) {
			String agentWfcrtSqlWhere = shareManager.getWfShareSqlWhere(user, "t1");

			String selectSql = " case workflow_base.isvalid when '3' then workflow_base.activeversionid else WorkflowUseCount.wfid end as wfid,WorkflowUseCount.userid, sum(WorkflowUseCount.count) as count ";
			String groupbySql = " group by case workflow_base.isvalid when '3' then workflow_base.activeversionid else WorkflowUseCount.wfid end,WorkflowUseCount.userid ";
			String innerjoinSql = " inner join workflow_base  on workflow_base.id = WorkflowUseCount.Wfid";

			if (rs.getDBType().equals("oracle")) {
				rs.execute("SELECT * FROM (select "
								+ selectSql
								+ " from WorkflowUseCount "
								+ innerjoinSql
								+ "  where WorkflowUseCount.userid ="
								+ user.getUID()
								+ " and (wfid in(select distinct t1.workflowid from  ShareInnerWfCreate t1,workflow_base t2 where t1.workflowid=t2.id and t2.isvalid in ('1','3') and t1.usertype = "
								+ usertype
								+ " and "
								+ agentWfcrtSqlWhere
								+ ") or wfid in( select distinct t.workflowid from workflow_agentConditionSet t,workflow_base t1 where exists (select * from HrmResource b where t.bagentuid=b.id and b.status<4) and  t.workflowid=t1.id and t.agenttype>'0' and t.iscreateagenter=1 and t.agentuid="
								+ user.getUID() + " and ((t.beginDate+t.beginTime+':00'<='" + currentdate + currenttime + "' and t.endDate+t.endTime+':00'>='" + currentdate + currenttime
								+ "'))or(t.beginDate+t.beginTime='' and t.endDate+t.endTime = ''))) " + groupbySql + "  order by count desc) WHERE ROWNUM <= 12 ORDER BY ROWNUM ASC");
			} else {
				String sql = "select top 12 "
						+ selectSql
						+ " from WorkflowUseCount "
						+ innerjoinSql
						+ "  where WorkflowUseCount.userid ="
						+ user.getUID()
						+ " and wfid in ("
						+ "select t.workflowid from workflow_agentConditionSet t,workflow_base t1 where exists (select * from HrmResource b where t.bagentuid=b.id and b.status<4) and t.workflowid=t1.id and t.agenttype>'0' and t.iscreateagenter=1 and t.agentuid="
						+ user.getUID() + "  union all select  t1.workflowid from  ShareInnerWfCreate t1,workflow_base t2 where t1.workflowid=t2.id and t2.isvalid in ('1','3')) " + groupbySql
						+ " order by count desc";

				rs.execute(sql);
			}

			while (rs.next()) {
				usedtodoList.add(rs.getString("wfid"));
			}
		}
	}

	// 排序，并计算各个类型在前台显示的位置
	private List<WfType> sortWfTypes() {
		rs.executeQuery("select id from workflow_type order by dsporder ");
		int colorIndex = 0;
		List<WfType> result = new ArrayList<WfType>();
		while (rs.next()) {
			String wftypeid = rs.getString(1);
			WfType wftype = wftypeInfo.get(wftypeid);
			if (wftype == null) {
				continue;
			}
			wftype.setColor(colors[colorIndex % (colors.length)]);
			wftype.setImg(imgs[colorIndex % (colors.length)]);
			colorIndex++;
			wftype.getWfbeans().addAll(wftype.getWfbeanInfo().values());
			wftype.setWfbeanInfo(null);
			result.add(wftype);
		}
		writeLog("---------414:" + (System.currentTimeMillis() - start));
		return result;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@GET
	@Path("/managewfcoll")
	@Produces(MediaType.TEXT_PLAIN)
	public String manageWfColl(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		int userid = HrmUserVarify.getUser(request,response).getUID();
		String worktypeid = request.getParameter("worktypeid");
		String workflowid = request.getParameter("workflowid");
		String needall = request.getParameter("needall");// 1：添加自定义；0：删除自定义
		String style = "insert";
		// 获取自定义流程信息
		String sql = "select selectedworkflow , isuserdefault from workflow_RequestUserDefault where userid=" + userid;
		String selectedworkflow = "";
		String isuserdefault = "0";// 自定义流程是否启动
		RecordSet recordSet = new RecordSet();
		recordSet.executeSql(sql);
		while (recordSet.next()) {
			style = "update";
			selectedworkflow = recordSet.getString("selectedworkflow");
			isuserdefault = recordSet.getString("isuserdefault");
		}
		if (needall.equals("1")) {
			String[] swfs = selectedworkflow.split("\\|");
			boolean b = true;
			for (String swf : swfs) {
				if (swf.equalsIgnoreCase(worktypeid)) {
					b = false;
					break;
				}
			}
			if (b) {
				selectedworkflow = selectedworkflow + "|" + worktypeid;
			}

			b = true;
			for (String swf : swfs) {
				if (swf.equalsIgnoreCase(workflowid)) {
					b = false;
					break;
				}
			}
			if (b) {
				selectedworkflow = selectedworkflow + "|" + workflowid;
			}
			if (isuserdefault.equals("0")) {
				isuserdefault = "1";
			}
			if (style.equals("insert")) {
				sql = "insert into workflow_RequestUserDefault(userid,selectedworkflow,isuserdefault) values(?,?,1)";
				recordSet.executeUpdate(sql, userid, worktypeid + "|" + workflowid);
			} else if (style.equals("update")) {
				sql = "update workflow_RequestUserDefault set isuserdefault=1,selectedworkflow=? where userid=?";
				recordSet.executeUpdate(sql, selectedworkflow, userid);
			}
		} else if (needall.equals("0")) {
			// 删除自定义
			if (selectedworkflow.indexOf(workflowid) != -1) {
				String[] workflowids = selectedworkflow.split("\\|");
				selectedworkflow = "";
				for (String wfid : workflowids) {
					if (!wfid.equalsIgnoreCase(workflowid)) {
						selectedworkflow = selectedworkflow + wfid + "|";
					}
				}
				if (selectedworkflow.length() > 0) {
					selectedworkflow = selectedworkflow.substring(0, (selectedworkflow.length() - 1));
				}

			}
			if (selectedworkflow.indexOf(worktypeid) != -1) {
				// 工作流程类型删除
				String tid = worktypeid.substring(worktypeid.indexOf("T") + 1);
				sql = "select id from workflow_base where workflowtype=" + tid;
				recordSet.executeSql(sql);
				boolean b = true;
				String[] swfs = selectedworkflow.split("\\|");
				while (recordSet.next()) {
					for (String swf : swfs) {
						if (swf.equalsIgnoreCase("W" + recordSet.getString("id"))) {
							b = false;
							break;
						}
					}
					if (!b) {
						break;
					}
				}
				if (b) {
					selectedworkflow = "";
					for (String swf : swfs) {
						if (!swf.equalsIgnoreCase(worktypeid)) {
							selectedworkflow = selectedworkflow + swf + "|";
						}
					}
					if (selectedworkflow.length() > 0) {
						selectedworkflow = selectedworkflow.substring(0, (selectedworkflow.length() - 1));
					}

				}
			}
			if (selectedworkflow.length() == 0) {
				sql = "delete from workflow_RequestUserDefault where userid=" + userid;
				recordSet.execute(sql);
			} else {
				sql = "update workflow_RequestUserDefault set isuserdefault=1,selectedworkflow=? where userid=?";
				recordSet.executeUpdate(sql, selectedworkflow, userid);
			}
		}
		return "1";
	}
}
