import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqCustomMenuDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.CUSTOMMENU_URL, 'POST', params);
}
module.exports = {
    reqCustomMenuDatas
};
