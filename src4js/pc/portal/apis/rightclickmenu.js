import { RIGHT_CLICK_MENU_URL } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqRightClickMenu = (params = {}) => WeaTools.callApi(RIGHT_CLICK_MENU_URL, 'POST', params);
module.exports = {
    reqRightClickMenu,
};
