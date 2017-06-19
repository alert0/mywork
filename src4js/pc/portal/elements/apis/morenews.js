import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqMoreNewsDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.MORENEWS_URL, 'POST', params);
}
module.exports = {
    reqMoreNewsDatas
};
