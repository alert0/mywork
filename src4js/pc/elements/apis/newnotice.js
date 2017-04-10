import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqNewNoticeDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.NEWNOTICE_URL, 'POST', params);
}
module.exports = {
    reqNewNoticeDatas
};
