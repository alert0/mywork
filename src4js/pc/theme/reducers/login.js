import Immutable from 'immutable';
import {LOGIN} from '../constants/ActionTypes';
import ECLocalStorage from '../util/ecLocalStorage';

/**
 * 登录页
 *
 * @param state
 *              loginTheme          登录主题
 *
 *              loginType           登录类型，表单登录(form)和扫描二维码(QRCode)登录
 *
 *              hasMultiLang        是否有多语言
 *              multiLangVisible    是否显示多语言
 *              langId              语言 id
 *              langText            语言描述
 *
 *              hasDynamicPassword  是否有动态密码
 *              isRememberAccount   是否记住账号
 *              isRememberPassword  是否记住密码
 *              cacheAccount        缓存的账号
 *              cachePassword       缓存的密码
 *              hasValidateCode     是否有验证码
 *              maxWrongTimes       登录最多错误次数
 *              wrongTimes          登录错误次数
 *              validateCode        验证码
 *              isLogging           是否正在登录
 *
 *              loginQRCode         登录二维码 UUID
 *
 * @param action
 * @returns {*}
 */
export default function login(state = Immutable.fromJS({
    loginTheme: '',

    loginType: ECLocalStorage.getStr('login', 'loginType', false) || 'form',

    hasMultiLang: false,
    multiLangVisible: false,
    langId: '7',
    langText: '简体中文',

    hasDynamicPassword: false,
    isRememberAccount: ECLocalStorage.getObj('login', 'isRememberAccount', false) || false,
    isRememberPassword: ECLocalStorage.getObj('login', 'isRememberPassword', false) || false,
    cacheAccount: ECLocalStorage.getStr('login', 'cacheAccount', false) || '',
    cachePassword: ECLocalStorage.getStr('login', 'cachePassword', false) || '',
    hasValidateCode: false,
    maxWrongTimes: -1,
    wrongTimes: 0,
    validateCode: '/weaver/weaver.file.MakeValidateCode',
    isLogging: false,

    loginQRCode: ''
}), action) {
    switch (action.type) {
        case LOGIN.LOGIN_THEME:
            return state.merge(action.value);

        case LOGIN.LOGIN_TYPE:
            return state.merge(action.value);

        case LOGIN.LOGIN_MULTI_LANG:
            return state.merge(action.value);

        case LOGIN.LOGIN_FORM:
            return state.merge(action.value);

        case LOGIN.LOGIN_QR_CODE:
            return state.merge(action.value);

        default:
            return state;
    }
}
