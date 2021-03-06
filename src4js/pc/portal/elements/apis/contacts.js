import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqContactsDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.CONTACTS_URL, 'POST', params);
}

const reqContactsTabDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.CONTACTS_TAB_URL, 'POST', params);
}

module.exports = {
    reqContactsDatas,
    reqContactsTabDatas
};
