import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqWeatherDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.WEATHER_URL, 'POST', params);
}
module.exports = {
    reqWeatherDatas
};
