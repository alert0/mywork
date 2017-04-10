import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqFlashDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.FLASH_URL, 'POST', params);
}
module.exports = {
    reqFlashDatas
};
