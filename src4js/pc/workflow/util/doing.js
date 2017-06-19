import Immutable from 'immutable'

//分页控件---设为只读
const doReadIt = (requestid, otherpara, obj) => {
	const viewScope = window.store_e9_workflow.getState().workflowlistDoing.get('nowRouterWfpath');
	try{
		document.getElementById("wflist_"+requestid+"span").innerHTML = "";
	}catch(e){}
	if(viewScope == 'queryFlow')
		return;
    const state = window.store_e9_workflow.getState()['workflow' + viewScope];
	const flag = state && state.getIn(['sharearg','flag']);
	const viewType = state && state.getIn(['sharearg','viewType']);
	const overtimetype = state && state.getIn(['sharearg','overtimetype']);
	jQuery.ajax({
		type : "GET",
		url : "/workflow/search/WFSearchResultReadIt.jsp?f_weaver_belongto_userid=&f_weaver_belongto_usertype=0&requestid=" + requestid + ",&flag="+flag,
		success : () => {
			if (flag == "newWf") {
				parent.window.location.href = "/system/sysRemindWfLink.jsp?f_weaver_belongto_userid=" + otherpara + "&f_weaver_belongto_usertype=0&flag=newWf";
			} else if (flag == "rejectWf") {
				parent.window.location.href = "/system/sysRemindWfLink.jsp?f_weaver_belongto_userid=" + otherpara + "&f_weaver_belongto_usertype=0&flag=rejectWf";
			} else if (flag == "overtime") {
				parent.window.location.href = "/workflow/search/WFTabForOverTime.jsp?f_weaver_belongto_userid="
						+ otherpara + "&f_weaver_belongto_usertype=0&isovertime=1&viewType="+viewType+"&isFromMessage=1&flag=overtime&overtimetype="+overtimetype;
			} else if (flag == "endWf") {
				parent.window.location.href = "/system/sysRemindWfLink.jsp?f_weaver_belongto_userid=" + otherpara + "&f_weaver_belongto_usertype=0&flag=endWf";
			} else {
				window._table.reLoad();
			}
		}
	});
}

window.doReadIt = doReadIt;

//分页控件---转发，zdialog
const doReview = (requestid, userid , resourceids) => {
	resourceids = resourceids == null ?"":resourceids;	
	const forwardurl = "/workflow/request/Remark.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=0&requestid=" + requestid+"&resourceids="+resourceids;
	let dlg = new window.top.Dialog(); // 定义Dialog对象
	dlg.Model = false;
	dlg.Width = 1060;
	dlg.Height = 500;
	dlg.URL = forwardurl;
	dlg.Title = SystemEnvLabel.getHtmlLabelName(24964);
	dlg.maxiumnable = true;
	dlg.show();
	//window.dialog = dlg;
}

window.doReview = doReview;

//分页控件---打印功能
const doPrint = (requestid, userid) => {
	const printurl = "/workflow/request/PrintRequest.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=0&requestid=" 
		+ requestid + "&isprint=1&fromFlowDoc=1";
	const width = screen.availWidth - 10;
	const height = screen.availHeight - 50;
	let szFeatures = "top=0,";
	szFeatures += "left=0,";
	szFeatures += "width=" + width + ",";
	szFeatures += "height=" + height + ",";
	szFeatures += "directories=no,";
	szFeatures += "status=yes,toolbar=no,location=no,";
	szFeatures += "menubar=no,";
	szFeatures += "scrollbars=yes,";
	szFeatures += "resizable=yes";
	window.open(printurl, "", szFeatures);
}

window.doPrint = doPrint;


// 分页控件---查看表单日志
const seeFormLog = (requestid, nodeid) => {
	let dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	const url = "/workflow/request/RequestModifyLogView.jsp?requestid=" + requestid + "&nodeid=" + nodeid + "&isAll=0&ismonitor=0&urger=0";
	dialog.Title = SystemEnvLabel.getHtmlLabelName(21625);
	dialog.Width = 550;
	dialog.Height = 550;
	dialog.Drag = true;
	dialog.maxiumnable = true;
	dialog.URL = url;
	dialog.show();
}

window.seeFormLog = seeFormLog;

//顶部按钮--批量设为只读
const doAllReadIt = () => {
	const viewScope = window.store_e9_workflow.getState().workflowlistDoing.get('nowRouterWfpath');
    const list = window.store_e9_workflow.getState()['workflow' + viewScope];
	//const list = window.store_e9_workflow.getState().workflowList;
	
	const requestid = list.get('selectedRowKeys');
	const flag = list.getIn(['sharearg','flag']);
	const userid = list.getIn(['sharearg','userID']);
	const usertype = list.getIn(['sharearg','usertype']);
	const logintype = list.getIn(['sharearg','logintype']);
	const viewType = list.getIn(['sharearg','viewType']);
	const overtimetype = list.getIn(['sharearg','overtimetype']);
	
	if (requestid != "") {
		$.ajax({
			type : "GET",
			url : "/workflow/search/WFSearchResultReadIt.jsp?requestid=" + requestid
					+ "&userid="+userid+"&usertype="+usertype+"&logintype="+logintype+"&flag="+flag,
			success : () => {
				if (flag == "newWf") {
					parent.window.location.href = "/system/sysRemindWfLink.jsp?flag=newWf";
				} else if (flag == "rejectWf") {
					parent.window.location.href = "/system/sysRemindWfLink.jsp?flag=rejectWf";
				} else if (flag == "overtime") {
					parent.window.location.href = "/workflow/search/WFTabForOverTime.jsp?isovertime=1&viewType="+viewType+"&isFromMessage=1&flag=overtime&overtimetype="+overtimetype;
				} else if (flag == "endWf") {
					parent.window.location.href = "/system/sysRemindWfLink.jsp?flag=endWf";
				} else {
					window._table.reLoad();
				}
			}
		});
	} else {
		top.Dialog.alert(SystemEnvLabel.getHtmlLabelName(20149));
	}
}

window.doAllReadIt = doAllReadIt;


//change--刷新整个页面
const reLoadFullPage = () => {
	
}

window.reLoadFullPage = reLoadFullPage;

const openFullWindowHaveBarForWFList = (url, requestid) => {
	try {
		document.getElementById("wflist_" + requestid + "span").innerHTML = "";
	} catch (e) {}
	const redirectUrl = url;
	const width = screen.availWidth - 10;
	const height = screen.availHeight - 50;
	let szFeatures = "top=0,";
	szFeatures += "left=0,";
	szFeatures += "width=" + width + ",";
	szFeatures += "height=" + height + ",";
	szFeatures += "directories=no,";
	szFeatures += "status=yes,toolbar=no,location=no,";
	szFeatures += "menubar=no,";
	szFeatures += "scrollbars=yes,";
	szFeatures += "resizable=yes"; // channelmode
	window.open(redirectUrl, "", szFeatures);
}

window.openFullWindowHaveBarForWFList = openFullWindowHaveBarForWFList;

const showallreceived = (requestid, returntdid) => {
	jQuery.ajax({
		url : "/workflow/search/WorkflowUnoperatorPersons.jsp?requestid="+ requestid + "&returntdid=" + returntdid,
		type : "post",
		success : function(res) {
			try {
				jQuery("#" + returntdid).html(jQuery.trim(res));
				jQuery("#" + returntdid).parent().attr("title", jQuery.trim(res).replace(/[\r\n]/gm, ""))
			} catch (e) {}
		}
	});
}

window.showallreceived = showallreceived;

window._table = {
	reLoad: () => {
		const viewScope = window.store_e9_workflow.getState().workflowlistDoing.get('nowRouterWfpath');
	    const state = window.store_e9_workflow.getState()['workflow' + viewScope];
	    const comsWeaTable = window.store_e9_workflow.getState().comsWeaTable
	    const current = comsWeaTable.getIn([comsWeaTable.get('tableNow'), 'current']);
		
		if(viewScope == 'queryFlow'){
			window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowQueryAction.doSearch({current}));
		}else{
			window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowListAction.initDatas());
			window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowListAction.doSearch({current}));
		}
	}
}




