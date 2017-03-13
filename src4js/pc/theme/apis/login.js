import {WeaTools} from 'weaCom';

export const getLoginBgImages = () => WeaTools.callApi('/page/interfaces/loginInfoToJson.jsp?method=preload', 'GET', {}, 'json');
export const getLoginQRCode = () => WeaTools.callApi('/page/interfaces/loginInfoToJson.jsp?method=loaded', 'GET', {}, 'json');
export const getLoginFormSetting = () => WeaTools.callApi('/login/LoginUtil.jsp', 'POST', {type: 'hrmsetting'}, 'json');
export const checkHasDynamicPassword = (params = {}) => WeaTools.callApi('/login/LoginUtil.jsp', 'POST', params, 'json');
export const login = (params = {}) => WeaTools.callApi('/login/LoginUtil.jsp', 'POST', params, 'json');