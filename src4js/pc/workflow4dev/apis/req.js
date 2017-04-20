import {WeaTools} from 'ecCom'

export const loadForm = params => {
	return WeaTools.callApi('/api/workflow/reqform/loadForm', 'GET', params);
}

export const loadDetailData = params => {
	return WeaTools.callApi('/api/workflow/reqform/detailData', 'GET', params);
}

export const loadRequestLog = params => {
	return WeaTools.callApi('/api/workflow/reqform/requestLog', 'GET', params);
}

export const updateRequestLogPageSize = params => {
	return WeaTools.callApi('/api/workflow/reqform/updateRequestLogPageSize', 'GET', params);
}

export const getSignInput = params => {
	return WeaTools.callApi('/api/workflow/reqform/signInput', 'GET', params);
}

export const getRightMenu = params => {
	return WeaTools.callApi('/api/workflow/reqform/rightMenu', 'GET', params);
}

export const updateReqInfo = params => {
	return WeaTools.callApi('/api/workflow/reqform/updateReqInfo', 'GET', params);
}

export const loadScriptContent = params => {
	return WeaTools.callApi('/api/workflow/reqform/scripts', 'GET', params,'text');
}

export const copyCustomPageFile = params => {
	return WeaTools.callApi('/api/workflow/reqform/copyCustomPageFile', 'GET', params);
}

export const loadCustompage = params => {
	return WeaTools.callApi(params.custompage, 'GET', params.custompageparam,'text');
}

export const getRejectInfo = params => {
	return WeaTools.callApi('/api/workflow/reqform/rejectInfo', 'GET', params);
}



export const getRequestSubmit = params => {
	return WeaTools.callApi('/workflow/core/ControlServlet.jsp?action=RequestSubmitAction', 'POST', params);
}

export const getWfStatus = params => {
	return WeaTools.callApi('/api/workflow/reqform/wfstatusnew', 'GET', params);
}

export const getWfStatusCount = params => {
	return WeaTools.callApi('/api/workflow/reqform/wfstatuscount', 'GET', params);
}

export const getResourcesKey = params => {
	return WeaTools.callApi('/api/workflow/reqform/resources', 'GET', params);
}

export const updateUserTxStatus = params =>{
	return WeaTools.callApi('/workflow/request/WorkflowSignStatusAjax.jsp', 'GET', params);
}
