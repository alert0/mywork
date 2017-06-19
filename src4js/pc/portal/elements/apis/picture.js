import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqPictureDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.PICTURE_URL, 'POST', params);
}
module.exports = {
    reqPictureDatas
};
