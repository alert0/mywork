import { ELEMENT_URLS } from '../constants/ActionTypes';
import { WeaTools } from 'ecCom';

const reqCustomPageDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.CUSTOMPAGE_URL, 'POST', params);
}
const reqCustomPageTabDatas = (params = {}) => {
    return WeaTools.callApi(ELEMENT_URLS.CUSTOMPAGE_TAB_URL, 'POST', params);
}

module.exports = {
    reqCustomPageDatas,
    reqCustomPageTabDatas
};
