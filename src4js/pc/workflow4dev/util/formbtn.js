import Immutable from 'immutable'
const openFullWindowHaveBar = (url) => {
	var redirectUrl = url;
	var width = screen.availWidth - 10;
	var height = screen.availHeight - 50;
	var szFeatures = "top=0,";
	szFeatures += "left=0,";
	szFeatures += "width=" + width + ",";
	szFeatures += "height=" + height + ",";
	szFeatures += "directories=no,";
	szFeatures += "status=yes,toolbar=no,location=no,";
	szFeatures += "menubar=no,";
	szFeatures += "scrollbars=yes,";
	szFeatures += "resizable=yes"; //channelmode
	window.open(redirectUrl, "", szFeatures);
}

window.openFullWindowHaveBar = openFullWindowHaveBar;

const openUnFullWindow = (url,width,height,top,left) => {
	var szFeatures = "top="+top+"," ;
	szFeatures +="left="+left+"," ;
	szFeatures +="width="+width+"," ;
	szFeatures +="height="+height+"," ;
	szFeatures +="directories=no," ;
	szFeatures +="status=yes,toolbar=no,location=no," ;
	szFeatures +="menubar=no," ;
	szFeatures +="scrollbars=yes," ;
	szFeatures +="resizable=yes" ; //channelmode
	window.open(url,"",szFeatures) ;
}

window.openUnFullWindow  = openUnFullWindow;

/**
 * 提交需返回
 */
const doSubmitBack = () => { 
	const para = {actiontype:"requestOperation",src:"submit",needwfback:"1"};
	const isFree = window.store_e9_workflow.getState().workflowReq.getIn(['rightMenu','isFree']);
	const freewftype = window.store_e9_workflow.getState().workflowReq.getIn(['rightMenu','freewftype']);
	const isremark = window.store_e9_workflow.getState().workflowReq.getIn(['rightMenu','isremark']);
	const takisremark = window.store_e9_workflow.getState().workflowReq.getIn(['rightMenu','takisremark']);
	const nodetype = window.store_e9_workflow.getState().workflowReq.getIn(['params','nodetype']);
	const isCptwf = window.store_e9_workflow.getState().workflowReq.getIn(['params','isCptwf']);
	
	if(isCptwf){
		
	}if(isFree == "1" && freewftype == "1" && nodetype == "0" && isremark == "0" && takisremark == "0"){
		doFreeWorkflow();
	}else{
		window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doSubmitE9(para)) 
	}
}

window.doSubmitBack = doSubmitBack;

/**
 * 
 */
const doSubmit_Pre = () => {
	const para = {actiontype:"requestOperation",src:"submit"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doSubmitE9(para)) 
}

window.doSubmit_Pre = doSubmit_Pre;


/**
 * 提交后不需返回
 */
const doSubmitNoBack = () => {
	const para = {actiontype:"requestOperation",src:"submit",needwfback:"0"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doSubmitE9(para)) 
}

window.doSubmitNoBack = doSubmitNoBack;
/**
 * 流程保存
 */
const doSave_nNew = () => { 
	const para = {actiontype:"requestOperation",src:"save"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doSubmitE9(para)) 
}

window.doSave_nNew = doSave_nNew;

//流程督办
const doSupervise = () => { 
	const para = {actiontype:"requestOperation",src:"supervise"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doSubmitE9(para)) 
}

window.doSupervise = doSupervise;

//表单---转发，zdialog
const doReviewE9 = (destuserid) => {
	const params = {showForward: true,forwardflag: "1"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.setShowForward(params));
}

window.doReviewE9 = doReviewE9;

//批注需反馈
const doRemark_nBack = () => { 
	const para = {actiontype:"remarkOperation",src:"save",needwfback:"1"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doSubmitE9(para)) 
}

window.doRemark_nBack = doRemark_nBack;

//批注不需反馈
const doRemark_nNoBack = () => {
	const para = {actiontype:"remarkOperation",src:"save",needwfback:"0"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doSubmitE9(para)) 
}

window.doRemark_nNoBack = doRemark_nNoBack;

/**
 * 流程打印
 */
const openSignPrint = () => {
	const formstate = window.store_e9_workflow.getState().workflowReq.get('submitParams');
	const requestid = formstate.get('requestid');
	const userid = formstate.get('f_weaver_belongto_userid');
	doPrint(requestid, userid);
}

window.openSignPrint = openSignPrint;

//流程暂停
const doStop = () => { window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doStop()) }

window.doStop = doStop;

//流程撤销
const doCancel = () => { window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doCancel()) }

window.doCancel = doCancel;

//流程启用
const doRestart = () => { window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doRestart()) }

window.doRestart = doRestart;

//流程强制收回
const doRetract = () => { window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doRetract()) }

window.doRetract = doRetract;

//强制归档
const doDrawBack = () => { window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doDrawBack()) }

window.doDrawBack = doDrawBack;

//打印日志
const doPrintViewLog = () => {
	var diag_vote = null;
	if(window.top.Dialog) {
		diag_vote = new window.top.Dialog();
	} else {
		diag_vote = new Dialog();
	}

	const params = window.store_e9_workflow.getState().workflowReq.get('params');
	const requestid = params.get('requestid');
	const userid = params.get('f_weaver_belongto_userid');
	const usertype = params.get('f_weaver_belongto_usertype');

	diag_vote.currentWindow = window;
	diag_vote.Width = 800;
	diag_vote.Height = 550;
	diag_vote.Modal = true;
	diag_vote.maxiumnable = true;
	diag_vote.Title = SystemEnvLabel.getHtmlLabelName(21533);
	diag_vote.URL = "/workflow/request/WorkflowLogNew.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=" + usertype + "&requestid=" + requestid;
	diag_vote.show();
}

window.doPrintViewLog = doPrintViewLog;

//新建任务列表
const openTaskList = () => {
	const requestid = window.store_e9_workflow.getState().workflowReq.getIn(['params', 'requestid']);
	openWin("/workrelate/task/data/TaskList.jsp?requestids=" + requestid);
}

window.openTaskList = openTaskList;

//新建任务
const doCreateTask = () => {
	const requestid = window.store_e9_workflow.getState().workflowReq.getIn(['params', 'requestid']);
	openWin("/workrelate/task/data/Add.jsp?requestids=" + requestid);
}

window.doCreateTask = doCreateTask;

const openWin = (url, showw, showh) => {
	if(showw == null || typeof(showw) == "undefined") showw = 900;
	if(showh == null || typeof(showh) == "undefined") showh = 520;
	var redirectUrl = url;
	var height = screen.height;
	var width = screen.width;
	var top = (height - showh) / 2;
	var left = (width - showw) / 2;
	var szFeatures = "top=" + top + ",";
	szFeatures += "left=" + left + ",";
	szFeatures += "width=" + showw + ",";
	szFeatures += "height=" + showh + ",";
	szFeatures += "directories=no,";
	szFeatures += "status=yes,";
	szFeatures += "menubar=no,";
	szFeatures += "scrollbars=yes,";
	szFeatures += "resizable=yes"; //channelmode
	window.open(redirectUrl, "", szFeatures);
}
//window.openWin = openWin;

const chekcremark = (remarkcontent) => {
	let hasvalue = true;
	if(remarkcontent == null) {
		hasvalue = false;
	} else {
		while(remarkcontent.indexOf(" ") >= 0) {
			remarkcontent = remarkcontent.replace(" ", "");
		}
		while(remarkcontent.indexOf("\\n") >= 0) {
			remarkcontent = remarkcontent.replace("\r\n", "");
		}
	}

	if(remarkcontent == "") {
		hasvalue = false;
	}
	return hasvalue;
}

window.chekcremark = chekcremark;

//退回
const doReject_New = () => { window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doReject()) }

window.doReject_New = doReject_New;

//
const doViewModifyLog = () => {
	const { f_weaver_belongto_userid, requestid, nodeid, wfmonitor } = window.store_e9_workflow.getState().workflowReq.get('params').toJS();
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	const ismonitor = wfmonitor ? "1" : "0";
	var url = "/workflow/request/RequestModifyLogView.jsp?f_weaver_belongto_userid=" + f_weaver_belongto_userid + "&f_weaver_belongto_usertype=0&requestid=" + requestid + "&nodeid=" + nodeid + "&isAll=0&ismonitor=" + ismonitor + "&urger=0";
	dialog.Title = "表单日志";
	dialog.Width = 1000;
	dialog.Height = 550;
	dialog.Drag = true;
	dialog.maxiumnable = true;
	dialog.URL = url;
	dialog.show();
}

window.doViewModifyLog = doViewModifyLog;

//流程删除
const doDelete = () => { window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doDeleteE9()) }

window.doDelete = doDelete;

//
const doSubmitDirect = (subfun) => {
	const ifchangstatus  = window.store_e9_workflow.getState().workflowReq.getIn(['submitParams','ifchangstatus']);
	const { hasback, hasnoback,lastnodeid } = window.store_e9_workflow.getState().workflowReq.get('rightMenu').toJS();
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.updateSubmitParams({SubmitToNodeid:lastnodeid}));
	if("" != ifchangstatus && ("1" == hasback || ("" == hasback && "" == hasnoback))) {
		if("Affirmance" == subfun) {
			doAffirmanceBack();
		} else {
			doSubmitBack();
		}
	} else {
		if("Affirmance" == subfun) {
			doAffirmanceNoBack();
		} else {
			doSubmitNoBack();
		}
	}
}

window.doSubmitDirect = doSubmitDirect;

const doLocationHref = (resourceid, forwardflag,needwfback) => {
	const params = window.store_e9_workflow.getState().workflowReq.get('params');
	const requestname = window.store_e9_workflow.getState().workflowReqForm.get('mainData').getIn(['field-1', 'value']);

	const id = params.get('requestid');
	const f_weaver_belongto_userid = params.get('f_weaver_belongto_userid');
	const workflowRequestLogId = '';
	
	const  _url = "/workflow/request/Remark.jsp?f_weaver_belongto_userid=" + f_weaver_belongto_userid + "&f_weaver_belongto_usertype=0&requestid=" + id + "&workflowRequestLogId=" + workflowRequestLogId +"&forwardflag=" + forwardflag + "&requestname=" + requestname+"&resourceid="+resourceid+"&needwfback="+needwfback;
	let dialogtitle = '流程转发';
	if(forwardflag == 2){
		dialogtitle = '意见征询';
	}else if(forwardflag == 3){
		dialogtitle = '流程转办';
	}
	try {
		openDialog(dialogtitle,_url);
	} catch(e) {
		var forwardurl = "/workflow/request/Remark.jsp?f_weaver_belongto_userid=" + f_weaver_belongto_userid + "&f_weaver_belongto_usertype=0&requestid=" + id + "&forwardflag=" + forwardflag + param + "&workflowRequestLogId=" + workflowRequestLogId;
		openFullWindowHaveBar(forwardurl);
	}
}

//转办需反馈
const doReviewback3 = () => {
	const params = {showForward: true,forwardflag: "3",needwfback: "1"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.setShowForward(params));
}

window.doReviewback3 =  doReviewback3;

//转办
const doReview3 = () =>{
	const params = {showForward: true,forwardflag: "3"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.setShowForward(params));
}

window.doReview3 = doReview3;

//意见征询
const doReview2 = (resourceid) =>{
	const params = {showForward: true,forwardflag: "2"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.setShowForward(params));
}

window.doReview2 = doReview2;

//转办不需反馈
const doReviewnoback3 = (resourceid) =>{
	const params = {showForward: true,forwardflag: "3",needwfback:"0"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.setShowForward(params));
}

window.doReviewnoback3 = doReviewnoback3;

//超时设置 
const onNewOverTime = () =>{
	const params = window.store_e9_workflow.getState().workflowReq.get('params').toJS();
	const {f_weaver_belongto_userid,workflowid,nodeid,requestid,formid,billid} = params;
	var redirectUrl =  "/workflow/request/OverTimeSetByNodeUser.jsp?f_weaver_belongto_userid="+f_weaver_belongto_userid+"&f_weaver_belongto_usertype=0&workflowid="+workflowid+"&nodeid="+nodeid+"&requestid="+requestid+"&formid="+formid+"&isbill=0&billid="+billid;
	var dialog = new window.top.Dialog();
    dialog.currentWindow = window;
    dialog.URL = redirectUrl;
	dialog.Title ="超时设置 ";
    dialog.Height = screen.availHeight/2;
    dialog.Width = screen.availWidth/2;
    dialog.Drag = true;
    dialog.show();
}

window.onNewOverTime = onNewOverTime;

//新建流程
const onNewRequest = (workflowid,requestid,agent) => {
	const params = window.store_e9_workflow.getState().workflowReq.get('params');
	const userid = params.get('f_weaver_belongto_userid');
	var redirectUrl =  "/workflow/request/AddRequest.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype=0&workflowid="+workflowid+"&isagent="+agent+"&reqid="+requestid;
	openFullWindowHaveBar(redirectUrl);
}

window.onNewRequest = onNewRequest;

//新建短信
const onNewSms = (wfid, nodeid, reqid, menuid) => {
	const params = window.store_e9_workflow.getState().workflowReq.get('params');
	const userid = params.get('f_weaver_belongto_userid');
	const redirectUrl =  "/sms/SendRequestSms.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype=0&workflowid="+wfid+"&nodeid="+nodeid+"&reqid="+reqid + "&menuid=" + menuid;
	const width = screen.availWidth/2;
	const height = screen.availHeight/2;
	const top = height/2;
	const left = width/2;
	openUnFullWindow(redirectUrl,width,height,top,left);
}

window.onNewSms = onNewSms;

//新建微信
const onNewChats =(wfid, nodeid,reqid, menuid) =>{ 
	const params = window.store_e9_workflow.getState().workflowReq.get('params');
	const userid = params.get('f_weaver_belongto_userid');
	var redirectUrl =  "/wechat/sendWechat.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype=0&workflowid="+wfid+"&nodeid="+nodeid+"&reqid="+reqid+"&actionid=dialog&menuid=" + menuid;
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	dialog.Title = "新建微信 ";
	dialog.Width = 1000;
	dialog.Height = 350;
	dialog.Drag = true;
	dialog.maxiumnable = true;
	dialog.URL = redirectUrl;
	dialog.show();
} 

window.onNewChats = onNewChats;

//关于版本
const aboutVersion = (versionid) =>{ window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.aboutVersion(versionid)); }

window.aboutVersion = aboutVersion;

//流转设定
const doFreeWorkflow = () =>{
    //如果流程为自由流程，则默认显示自由流程设置窗体
	//  if( '<%=isFree%>' == '1' ){
	//       //初始化自由流程设置
	//      if(jQuery(".freeNode").find("input[name='indexnum']").length <= 0){
	//          jQuery(".freeNode").append("<input type='hidden' id='rownum' name='rownum' value='1'/>");
	//          jQuery(".freeNode").append("<input type='hidden' id='indexnum' name='indexnum' value='1'/>");
	//          jQuery(".freeNode").append("<input type='hidden' id='checkfield' name='checkfield' value='nodename_0,operators_0'/>");
	//      }
	//
	//      //打开自由流程设置浏览框
	//      var dlg = new window.top.Dialog();//定义Dialog对象
	//	    　　dlg.Width = 1000;//定义长度
	//	    　　dlg.Height = 550;
	//	    　　dlg.URL = "/workflow/request/FreeNodeShow.jsp?f_weaver_belongto_userid=<%=userid%>&f_weaver_belongto_usertype=<%=usertype%>&workflowid=<%=workflowid%>&requestid=<%=requestid%>&isroutedit=<%=init_road%>&istableedit=<%=init_frms%>";
	//	    　　dlg.Title = "<%=SystemEnv.getHtmlLabelName(83284,user.getLanguage())%>";
	//	        dlg.maxiumnable = false;
	//	    　　dlg.show();
	//	        // 保留对话框对象
	//	        window.top.freewindow = window;
	//	        window.top.freedialog = dlg;
	//	
	//	        return;
	//  }
	const params = window.store_e9_workflow.getState().workflowReq.get('params');
	const userid = params.get('f_weaver_belongto_userid');
	const requestid  = params.get('requestid');
	const iscnodefree = window.store_e9_workflow.getState().workflowReq.getIn(['rightMenu','iscnodefree']);
	
	var url="/workflow/workflow/BrowserMain.jsp?&url=/workflow/request/FreeWorkflowSet.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype=0&requestid="+requestid+"&iscnodefree="+iscnodefree;
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	dialog.Width = 550;
	dialog.Height = 550;
	dialog.Modal = true;
	dialog.Title = '流转设定';
	dialog.URL =url;
	dialog.isIframe=false;
	dialog.show();
}

window.doFreeWorkflow = doFreeWorkflow;

//触发子流程
const triSubwf2 = (subwfid,workflowNames) =>{
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.triggerSubWf(subwfid,workflowNames));
}

window.triSubwf2 = triSubwf2;


const doAffirmanceBack = () =>{
	const para = {actiontype:"requestOperation",src:"save",needwfback:"1","isaffirmance":"1"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.updateSubmitToNodeId());
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doSubmitE9(para)) 
}

window.doAffirmanceBack = doAffirmanceBack;


const doAffirmanceNoBack = () =>{
	const para = {actiontype:"requestOperation",src:"save",needwfback:"0","isaffirmance":"1"};
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.updateSubmitToNodeId());
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doSubmitE9(para))
}

//流程共享
const doShare  = () =>{
	const params = window.store_e9_workflow.getState().workflowReq.get('params');
	const requestid  = params.get("requestid");
	const requestname = params.get("requestname");
	
	var returnjson = '[{"sharetype":"workflow","sharetitle":"'+requestname+'","objectname":"FW:CustomShareMsg","shareid":"'+requestid+'"}]';
    var url="/social/im/SocialHrmBrowserForShare.jsp?sharejson="+encodeURIComponent(returnjson);
    var diag =new window.top.Dialog();
    diag.currentWindow = window; 
    diag.Modal = true;
    diag.Drag=true;
    diag.Width =400;	
    diag.Height =500;
    diag.ShowButtonRow=false;
    diag.Title = "分享";
    diag.URL =url;
    diag.openerWin = window;
    diag.show();
    document.body.click();
}
window.doShare = doShare;

//流程导入
const doImportWorkflow =() =>{
	const params = window.store_e9_workflow.getState().workflowReq.get('params');
	const userid = params.get('f_weaver_belongto_userid');
	const formid = params.get('formid');
	const isbill = params.get('isbill');
	const workflowid = params.get('workflowid');
	const ismode = params.get('ismode');
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	var url = "/systeminfo/BrowserMain.jsp?url="+escape("/workflow/request/RequestImport.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype=0&formid="+formid+"&isbill="+isbill+"&workflowid="+workflowid+"&status=2&ismode="+ismode+"&isfromE9=1");
	var title = "导入流程";
	dialog.Width = 600;
	dialog.Height = 600;
	dialog.Title=title;
	dialog.Drag = true;
	dialog.maxiumnable = true;
	dialog.URL = url;
	dialog.callbackfun = function(paramobj, datas) {
		window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.requestImport(datas));					
	};
	dialog.show();
}

window.doImportWorkflow  = doImportWorkflow;

const doEdit = () =>{
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doEdit());
}

window.doEdit = doEdit;

//明细导入
const doImportDetail =() =>{
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doImportDetail());
}
window.doImportDetail = doImportDetail;
//
const openDialog = (title, url) => {　
	var dlg = new window.top.Dialog();
	dlg.currentWindow = window;
	dlg.Model = false;　　　
	dlg.Width = 1060;
	dlg.Height = 500;　　　
	dlg.URL = url;　　　
	dlg.Title = title;
	dlg.maxiumnable = true;　　　
	dlg.show();
	window.dialog = dlg;
}

window.openDialog = openDialog;
