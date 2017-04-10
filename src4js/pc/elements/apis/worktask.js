import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqWorkTaskDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.WORKTASK_URL, 'POST', params);
}
module.exports = {
    reqWorkTaskDatas
};
