import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqBlogStatusDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.BLOGSTATUS_URL, 'POST', params);
}

module.exports = {
    reqBlogStatusDatas
};
