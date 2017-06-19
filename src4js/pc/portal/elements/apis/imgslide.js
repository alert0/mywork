import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqImgSlideDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.IMGSLIDE_URL, 'POST', params);
}
module.exports = {
    reqImgSlideDatas
};
