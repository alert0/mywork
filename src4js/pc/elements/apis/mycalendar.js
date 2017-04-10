import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取日历日程信息api
const reqMyCalendarDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.MYCALENDAR_URL, 'POST', params);
}

module.exports = {
   reqMyCalendarDatas
};
