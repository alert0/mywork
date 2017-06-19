import { PORTAL_BE_LIST_URL, PORTAL_ADD_ELEMENT } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const addReactElement = (params = {}) => WeaTools.callApi(PORTAL_ADD_ELEMENT, 'POST', params);

module.exports = {
    addReactElement,
};
