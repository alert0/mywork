import {WeaTools} from 'ecCom'

export const loadForm = params => {
	return WeaTools.callApi('/api/workflow/request/loadForm', 'GET', params);
}

export const loadDetailData = params => {
	return WeaTools.callApi('/api/workflow/request/detailData', 'GET', params);
}

export const loadRequestLog = params => {
	return WeaTools.callApi('/api/workflow/request/requestLog', 'GET', params);
}

export const updateRequestLogPageSize = params => {
	return WeaTools.callApi('/api/workflow/request/updateRequestLogPageSize', 'GET', params);
}

export const getSignInput = params => {
	return WeaTools.callApi('/api/workflow/request/signInput', 'GET', params);
}

export const getRightMenu = params => {
	return WeaTools.callApi('/api/workflow/request/rightMenu', 'GET', params);
}

export const updateReqInfo = params => {
	return WeaTools.callApi('/api/workflow/request/updateReqInfo', 'GET', params);
}

export const loadScriptContent = params => {
	return WeaTools.callApi('/api/workflow/request/scripts', 'GET', params,'text');
}

export const copyCustomPageFile = params => {
	return WeaTools.callApi('/api/workflow/request/copyCustomPageFile', 'GET', params);
}

export const loadCustompage = params => {
	return WeaTools.callApi(params.custompage, 'GET', params.custompageparam,'text');
}

export const getRejectInfo = params => {
	return WeaTools.callApi('/api/workflow/request/rejectInfo', 'GET', params);
}



export const getRequestSubmit = params => {
	return WeaTools.callApi('/workflow/core/ControlServlet.jsp?action=RequestSubmitAction', 'POST', params);
}

export const getWfStatus = params => {
	return WeaTools.callApi('/api/workflow/request/wfstatusnew', 'GET', params);
}

export const getWfStatusCount = params => {
	return WeaTools.callApi('/api/workflow/request/wfstatuscount', 'GET', params);
}

export const getResourcesKey = params => {
	return WeaTools.callApi('/api/workflow/request/resources', 'GET', params);
}

export const updateUserTxStatus = params =>{
	return WeaTools.callApi('/workflow/request/WorkflowSignStatusAjax.jsp', 'GET', params);
}

//请求提交
export const requestSubmit = params =>{
	return WeaTools.callApi('/api/workflow/request/requestOperation', 'POST', params);
}
//批注提交
export const reqRemarkOperation = params =>{
	return WeaTools.callApi('/api/workflow/request/remarkOperation', 'POST', params);
}
//转发提交
export const reqRemarkOperate= params => {
	return WeaTools.callApi('/api/workflow/request/remarkOperate', 'POST', params);
}
//暂停 撤销 强制归档 强制收回
export const reqFunctionLink = params => {
	return WeaTools.callApi('/api/workflow/request/functionLink', 'POST', params);
}
