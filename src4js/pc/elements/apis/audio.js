import { ELEMENT_URLS } from '../constants/ActionTypes';

import { WeaTools } from 'ecCom'; 

//获取门户信息api
const reqAudioDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.AUDIO_URL, 'POST', params);
}
module.exports = {
    reqAudioDatas
};
