import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqFavouriteDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.FAVOURITE_URL, 'POST', params);
}
module.exports = {
    reqFavouriteDatas
};
