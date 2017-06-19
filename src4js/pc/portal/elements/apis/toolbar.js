import { REQ_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqIsLockElement = (params = {}) => {
    return WeaTools.callApi(REQ_URLS.ELEMENT_ISLOCK_URL, 'POST', params);
}
const reqUnLockElement = (params = {}) => {
    return WeaTools.callApi(REQ_URLS.ELEMENT_UNLOCK_URL, 'POST', params);
}

const reqDeleteElement = (params = {}) => {
    return WeaTools.callApi(REQ_URLS.ELEMENT_DELETE_URL, 'POST', params);
}

module.exports = {
    reqIsLockElement,
    reqUnLockElement,
    reqDeleteElement
};
