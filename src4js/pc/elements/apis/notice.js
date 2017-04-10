import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqNoticeDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.NOTICE_URL, 'POST', params);
}
module.exports = {
    reqNoticeDatas
};
