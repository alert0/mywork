import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取元素信息api
const reqNoReactEHtml = url => {
    return WeaTools.callApi(url, 'GET', {}, 'html');
}
module.exports = {
    reqNoReactEHtml
};
