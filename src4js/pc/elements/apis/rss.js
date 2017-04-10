import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqRssDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.RSS_URL, 'POST', params);
}

const reqRssTabDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.RSS_TAB_URL, 'POST', params);
}

module.exports = {
    reqRssDatas,
    reqRssTabDatas
};
