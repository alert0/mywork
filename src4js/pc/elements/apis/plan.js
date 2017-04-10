import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqPlanDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.PLAN_URL, 'POST', params);
}

const reqPlanTabDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.PLAN_TAB_URL, 'POST', params);
}

module.exports = {
    reqPlanDatas,
    reqPlanTabDatas
};
