import Immutable from 'immutable'

const resetWorkflow = (url, title, type) => {
	if(type == '3') {
		openFullWindowHaveBar(url);
		return;
	} else if(type == '1' || type == '2') {
		url = "/workflow/request/WFReset.jsp?wfid=" + url + "&type=" + type;
		title = '流转设置';
	}
	dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	dialog.Title = title;
	dialog.Width = 1020;
	dialog.Height = 580;
	dialog.Drag = true;
	dialog.maxiumnable = false;
	dialog.URL = url;
	dialog.show();
}

window.resetWorkflow = resetWorkflow;

//生成系统提醒流程
const triggerSystemWorkflow = (prefix, url, title, loginuserid, type) => {
	const requestid = window.store_e9_workflow.getState().workflowReq.getIn(['params','requestid'])
	prefix = prefix.replace(/~0~/g, "<span class='importantInfo'>");
	prefix = prefix.replace(/~1~/g, "</span>");
	prefix = prefix.replace(/~2~/g, "<span class='importantDetailInfo'>");
	var infohtml = jQuery('.message-detail').html();
	if(!infohtml) {
		infohtml = "";
	} else {
		infohtml = "<div class='message-detail'>" + infohtml + "</div>";
	}
	var botfix = '进行设置';
	if('流程干预' == title) {
		botfix = '流程干预';
	}
	var messagedetail = infohtml + '<span>' + prefix + '，请<a id="wfSErrorResetBtn" style="color:#2b8ae2!important;" href="' + url + '" title="' + title + '" type="' + type + '"> 点击这里 </a>' + botfix + '</span>';
	var ahtml = jQuery('.message-bottom span').html();
	jQuery('<span> 点击这里 <span>').replaceAll('.message-bottom .sendMsgBtn');
	jQuery.ajax({
		type: 'post',
		url: '/workflow/request/TriggerRemindWorkflow.jsp?_' + new Date().getTime() + "=1",
		data: {
			remark: messagedetail,
			loginuserid: loginuserid,
			requestid: requestid
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			jQuery('.message-bottom span').html(ahtml);
		},
		success: function(data, textStatus) {
			window.top.Dialog.alert('已成功向管理员发送提醒流程');
		}
	});
}

window.triggerSystemWorkflow = triggerSystemWorkflow;

//重新选择操作者
const rechoseoperator = () => {
	var eh_dialog = null;
	if(window.top.Dialog)
		eh_dialog = new window.top.Dialog();
	else
		eh_dialog = new Dialog();
	eh_dialog.currentWindow = window;
	eh_dialog.Width = 650;
	eh_dialog.Height = 500;
	eh_dialog.Modal = true;
	eh_dialog.maxiumnable = false;
	eh_dialog.Title = '请选择';
	eh_dialog.URL = "/workflow/request/requestChooseOperator.jsp";
	eh_dialog.callbackfun = function(paramobj, datas) {
		let chrostoperatorinfo = {
			eh_setoperator:'y',
			eh_relationship:datas.relationship,
			eh_operators:datas.operators
		};
		const formdatas = window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.getformdatas());
		window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.setOperateInfo(chrostoperatorinfo));
		window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doSubmitE9Api('requestOperation','submit',"",formdatas));
	};
	eh_dialog.closeHandle = function(paramobj, datas) {
		const eh_setoperator = window.store_e9_workflow.getState().workflowReq.getIn(['params','hiddenarea']).get('eh_setoperator');
		if(eh_setoperator != 'y'){
			const formdatas = window.store_e9_workflow.dispatch(getformdatas());
			window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.setOperateInfo({eh_setoperator:'n'}));
			window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.doSubmitE9Api('requestOperation','submit',"",formdatas));
		}
	};
	eh_dialog.show();
}

window.rechoseoperator = rechoseoperator;