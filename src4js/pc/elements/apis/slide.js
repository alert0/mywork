import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqSlideDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.SLIDE_URL, 'POST', params);
}
module.exports = {
    reqSlideDatas
};
