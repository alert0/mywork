import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqNewsDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.NEWS_URL, 'POST', params);
}

const reqNewsTabDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.NEWS_TAB_URL, 'POST', params);
}

module.exports = {
    reqNewsDatas,
    reqNewsTabDatas
};
