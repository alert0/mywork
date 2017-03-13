import {WeaTools} from 'weaCom'

export const getFormReqInfo = params => {
	return WeaTools.callApi('/api/workflow/request/reqinfo', 'GET', params);
}

export const getRequestSubmit = params => {
	return WeaTools.callApi('/workflow/core/ControlServlet.jsp?action=RequestSubmitAction', 'POST', params);
}

export const getFormLayout = params => {
	return WeaTools.callApi('/api/workflow/request/forminfo', 'GET', params);
}

export const getWorkflowStatus = params => {
	return WeaTools.callApi('/api/workflow/request/wfstatus', 'GET', params);
}

export const getResourcesKey = params => {
	return WeaTools.callApi('/api/workflow/request/resources', 'GET', params);
}

export const loadScriptContent = params => {
	return WeaTools.callApi('/api/workflow/request/scripts', 'GET', params,'text');
}

export const loadCustompage = params => {
	return WeaTools.callApi(params.custompage, 'GET', params.custompageparam,'text');
}

export const updateUserTxStatus = params =>{
	return WeaTools.callApi('/workflow/request/WorkflowSignStatusAjax.jsp', 'GET', params);
}
