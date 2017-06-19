import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqMagazineDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.MAGAZINE_URL, 'POST', params);
}
module.exports = {
    reqMagazineDatas
};
