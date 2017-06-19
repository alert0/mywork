import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqOutDataDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.OUTDATA_URL, 'POST', params);
}

const reqOutDataTabDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.OUTDATA_TAB_URL, 'POST', params);
}

module.exports = {
    reqOutDataDatas,
    reqOutDataTabDatas
};
