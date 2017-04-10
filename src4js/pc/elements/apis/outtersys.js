import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqOutterSysDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.OUTTERSYS_URL, 'POST', params);
}
module.exports = {
    reqOutterSysDatas
};
