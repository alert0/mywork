import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqMailDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.MAIL_URL, 'POST', params);
}


module.exports = {
    reqMailDatas
};
