import {message} from 'antd';
import {WeaTools} from 'ecCom';
import * as LOGIN_API from '../apis/login';
import {LOGIN} from '../constants/ActionTypes';
import ECLocalStorage from '../util/ecLocalStorage';
import {showDialog} from '../util/themeUtil';

/**
 * 加载登录主题
 *
 * @returns {function(*)}
 */
export function loadLoginTheme() {
    return (dispatch) => {
        dispatch({
            type: LOGIN.LOGIN_THEME,
            value: {
                loginTheme: 'ecology9'
            }
        });
    }
}

/**
 * 切换登录方式：表单登录和扫描二维码登录
 *
 * @param loginType     登录类型：'form'和'QRCode'
 *
 * @returns {function(*)}
 */
export function changeLoginType(loginType) {
    loginType = loginType == 'form' ? 'QRCode' : 'form';
    ECLocalStorage.set('login', 'loginType', loginType, false);

    return (dispatch) => {
        dispatch({
            type: LOGIN.LOGIN_TYPE,
            value: {
                loginType: loginType
            }
        });
    }
}

/**
 * 加载登录页表单配置
 *
 * @returns {function(*)}
 */
export function loadLoginFormSetting() {
    return (dispatch) => {
        LOGIN_API.getLoginFormSetting().then((result) => {
            let hasMultiLang = (result.multilang == '1');
            let hasDynamicPassword = (result.showDynamicPwd == '1');
            let hasValidateCode = (result.needvalidate == '1');
            let maxWrongTimes = parseInt(result.numvalidatewrong, 10);

            dispatch({
                type: LOGIN.LOGIN_FORM,
                value: {
                    hasMultiLang: hasMultiLang,
                    hasDynamicPassword: false,
                    hasValidateCode: hasValidateCode,
                    maxWrongTimes: maxWrongTimes
                }
            });
        });
    }
}

/**
 * 显示隐藏多语言
 *
 * @param visible    是否显示
 *
 * @returns {function(*)}
 */
export function changeMultiLangVisible(visible) {
    return (dispatch) => {
        dispatch({
            type: LOGIN.LOGIN_MULTI_LANG,
            value: {
                multiLangVisible: visible
            }
        });
    }
}

/**
 * 选择语言
 *
 * @param visible           是否显示
 * @param langId            语言 id
 * @param langText          语言描述
 *
 * @returns {function(*)}
 */
export function selectLang(visible, langId, langText) {
    return (dispatch) => {
        dispatch({
            type: LOGIN.LOGIN_MULTI_LANG,
            value: {
                multiLangVisible: visible,
                langId: langId,
                langText: langText
            }
        });
    }
}

/**
 * 验证账号是否有动态密码
 *
 * @param account   账号
 *
 * @returns {function(*)}
 */
export function checkHasDynamicPassword(account) {
    return (dispatch) => {
        LOGIN_API.checkHasDynamicPassword({type: 'checkTokenKey', loginid: account}).then((result) => {
            let hasDynamicPassword = true;
            if (result.status != 3) {
                hasDynamicPassword = false;
            }

            dispatch({
                type: LOGIN.LOGIN_FORM,
                value: {
                    hasDynamicPassword: hasDynamicPassword
                }
            });
        });
    }
}

/**
 * 是否记住账号
 *
 * @param isRemember   是否记住
 *
 * @returns {function(*, *)}
 */
export function changeRememberAccount(isRemember) {
    return (dispatch, getState) => {
        dispatch({
            type: LOGIN.LOGIN_FORM,
            value: {
                isRememberAccount: isRemember,
                isRememberPassword: !isRemember ? isRemember : getState().login.get('isRememberPassword')
            }
        });
    }
}

/**
 * 是否记住密码
 *
 * @param isRemember   是否记住
 *
 * @returns {function(*, *)}
 */
export function changeRememberPassword(isRemember) {
    return (dispatch, getState) => {
        dispatch({
            type: LOGIN.LOGIN_FORM,
            value: {
                isRememberAccount: isRemember ? isRemember : getState().login.get('isRememberAccount'),
                isRememberPassword: isRemember
            }
        });
    }
}

/**
 * 改变验证码
 *
 * @param validateCode    验证码
 *
 * @returns {function(*)}
 */
export function changeValidateCode(validateCode) {
    return (dispatch) => {
        dispatch({
            type: LOGIN.LOGIN_FORM,
            value: {
                validateCode: validateCode
            }
        });
    }
}

/**
 * 加载登录二维码
 *
 * @returns {function(*)}
 */
export function loadLoginQRCode() {
    return (dispatch) => {
        LOGIN_API.getLoginQRCode().then((result) => {
            let loginQRCode = result.qrcode;

            dispatch({
                type: LOGIN.LOGIN_QR_CODE,
                value: {
                    loginQRCode: loginQRCode
                }
            });
        });
    }
}

/**
 * 登录
 *
 * @param params    登录表单数据
 *
 * @returns {function(*)}
 */
export function onLogin(params) {
    return (dispatch) => {
        const {
            account, password, dynamicPassword, validateCode,
            isRememberAccount, isRememberPassword,
            onChangeValidateCode
        } = params;

        // 修改登录按钮为“正在登录”状态
        dispatch({
            type: LOGIN.LOGIN_FORM,
            value: {
                isLogging: true
            }
        });

        LOGIN_API.login({
            type: 'checklogin',
            loginid: account,
            userpassword: password,
            tokenAuthKey: dynamicPassword,
            validatecode: validateCode
        }).then((result) => {
            // 登录请求成功，修改登录按钮为正常状态
            dispatch({
                type: LOGIN.LOGIN_FORM,
                value: {
                    isLogging: false
                }
            });

            if (result.loginstatus == 'true') {
                message.destroy();

                // 记住帐号/密码
                let cacheAccount = '';
                let cachePassword = '';
                if (isRememberAccount) {
                    cacheAccount = account;
                }
                if (isRememberPassword) {
                    cachePassword = password;
                }
                ECLocalStorage.set('login', 'cacheAccount', cacheAccount, false);
                ECLocalStorage.set('login', 'cachePassword', cachePassword, false);
                ECLocalStorage.set('login', 'isRememberAccount', isRememberAccount, false);
                ECLocalStorage.set('login', 'isRememberPassword', isRememberPassword, false);

                dispatch({
                    type: LOGIN.LOGIN_FORM,
                    value: {
                        isRememberAccount: isRememberAccount,
                        isRememberPassword: isRememberPassword,
                        cacheAccount: cacheAccount,
                        cachePassword: cachePassword,
                        wrongTimes: 0
                    }
                });

                ECLocalStorage.storageInit();
                let pathname = ECLocalStorage.getDefaultRoute();
                weaHistory.push({pathname: pathname});
            } else {
                let errorMsg = result.msg;
                let errorUrl = '';
                let errorBtnText = '';
                if (errorMsg == '') {
                    errorMsg = '登录失败';
                }

                if (result.msgcode == '120') {
                    errorUrl = '/login/bindTokenKey.jsp';
                    errorBtnText = '绑定令牌';
                } else if (result.msgcode == '122') {
                    errorUrl = '/login/syncTokenKey.jsp';
                    errorBtnText = "同步令牌";
                }

                // 验证码填写错误，重新请求新的验证码
                if (result.msgcode == '52') {
                    onChangeValidateCode();
                }

                // 返回错误信息提示
                message.error((
                    <span>
                        {errorMsg}
                        {errorUrl != '' ? <span className="e9login-error-msg" onClick={() => showDialog({title: errorBtnText, url: errorUrl, callbackfunc: () => {}})}>{errorBtnText}</span> : ''}
                    </span>
                ), 10);

                // 修改登录错误次数
                dispatch({
                    type: LOGIN.LOGIN_FORM,
                    value: {
                        wrongTimes: parseInt(result.sumpasswordwrong || 0, 10)
                    }
                });
            }
        });
    }
}

/**
 * 退出
 */
export function onLogout() {
    top.Dialog.confirm("确定要退出系统吗？", function () {
        LOGIN_API.logout().then(() => weaHistory.push({pathname: '/'}));
    });
}
