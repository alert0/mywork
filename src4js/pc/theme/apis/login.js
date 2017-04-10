import {WeaTools} from 'ecCom';

// 获取登录表单配置
export const getLoginFormSetting = () => WeaTools.callApi('/login/LoginUtil.jsp', 'POST', {type: 'hrmsetting'}, 'json');
// 验证登录账号是否有动态密码
export const checkHasDynamicPassword = (params = {}) => WeaTools.callApi('/login/LoginUtil.jsp', 'POST', params, 'json');
// 表单登录
export const login = (params = {}) => WeaTools.callApi('/login/LoginUtil.jsp', 'POST', params, 'json');
// 退出
export const logout = () => WeaTools.callApi('/login/LoginUtil.jsp', 'POST', {type: 'logout'}, 'text');
// 二维码
export const getLoginQRCode = () => WeaTools.callApi('/api/portal/login/logininfo', 'POST', {method: 'qrcode'}, 'json');
// 扫码登录
export const qcLogin = (params = {}) => WeaTools.callApi('/mobile/plugin/login/QCLoginStatus.jsp', 'POST', params, 'text');