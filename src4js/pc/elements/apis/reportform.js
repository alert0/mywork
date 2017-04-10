import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqReportFormDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.REPORTFORM_URL, 'POST', params);
}

const reqReportFormTabDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.REPORTFORM_TAB_URL, 'POST', params);
}

module.exports = {
    reqReportFormDatas,
    reqReportFormTabDatas
};
