import { ELEMENT_URLS, REQ_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqWorkflowDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.WORKFLOW_URL, 'POST', params);
}

const reqWorkflowTabDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.WORKFLOW_TAB_URL, 'POST', params);
}

//获取自定义页面地址内容
const reqSignViewDatas = str => {
    return WeaTools.callApi(REQ_URLS.SIGN_VIEW_URL + str, 'GET', {});
}

module.exports = {
    reqWorkflowDatas,
    reqWorkflowTabDatas,
    reqSignViewDatas
};
