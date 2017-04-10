import { PORTAL_URL } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqPortalDatas = (params = {}) => WeaTools.callApi(PORTAL_URL, 'POST', params);

module.exports = {
    reqPortalDatas
};
