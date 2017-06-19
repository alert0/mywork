import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqDocContentDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.DOCCONTENT_URL, 'POST', params);
}
module.exports = {
    reqDocContentDatas
};
