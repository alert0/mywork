import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqStockDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.STOCK_URL, 'POST', params);
}
module.exports = {
    reqStockDatas
};
