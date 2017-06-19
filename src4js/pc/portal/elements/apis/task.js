import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqTaskDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.TASK_URL, 'POST', params);
}

const reqTaskTabDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.TASK_TAB_URL, 'POST', params);
}

module.exports = {
    reqTaskDatas,
    reqTaskTabDatas
};
