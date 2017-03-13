import { REQ_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'weaCom'; 

//获取门户信息api
const reqHpDatas = params => {
    return WeaTools.callApi(REQ_URLS.HOMEPAGE_URL, 'POST', params);
}

//获取元素信息api
const reqEDatas = params => {
    return WeaTools.callApi(REQ_URLS.ELEMENT_URL, 'POST', params);
}

//获取元素信息api
const reqEHtml = url => {
    return WeaTools.callApi(url, 'GET', {}, 'html');
}

//获取元素tab内容api
const reqTabDatas = params => {
    return WeaTools.callApi(REQ_URLS.ELEMENTTABCONTENTDATA_URL, 'POST', params);
}

//获取日历日程信息api
const reqMyCalendarDatas = params => {
    return WeaTools.callApi(REQ_URLS.ELEMENT_URL, 'POST', params);
}

//获取通讯录元素内容
const reqContactsDatas = params => {
    return WeaTools.callApi(REQ_URLS.ELEMENTTABCONTENTDATA_URL, 'POST', params);
}

//保存或更新标签元素内容
const reqSaveContent = params => {
    return WeaTools.callApi(REQ_URLS.SCRATCHPAD_URL, 'POST', params);
}

//获取自定义页面地址内容
const reqCustomPageHtml = url => {
    return WeaTools.callApi(url, 'GET', {}, 'html');
}

module.exports = {
    reqHpDatas,
    reqEDatas,
    reqEHtml,
    reqTabDatas,
    reqMyCalendarDatas,
    reqContactsDatas,
    reqSaveContent,
    reqCustomPageHtml
};
