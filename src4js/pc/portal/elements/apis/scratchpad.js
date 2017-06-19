import { ELEMENT_URLS, REQ_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqScratchpadDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.SCRATCHPAD_URL, 'POST', params);
}

//保存或更新标签元素内容
const reqSaveContent = params => {
    return WeaTools.callApi(REQ_URLS.SCRATCHPAD_URL, 'POST', params,'text');
}
module.exports = {
    reqScratchpadDatas,
    reqSaveContent
};
