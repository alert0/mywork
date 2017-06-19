import { ELEMENT_URLS, REQ_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqSearchEngineDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.SEARCHENGINE_URL, 'POST', params);
}

module.exports = {
    reqSearchEngineDatas
};
