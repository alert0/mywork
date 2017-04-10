import {WeaTools} from 'ecCom';
import * as THEME_API from '../apis/theme';
import {LOGIN4E9} from '../constants/ActionTypes';
import ECLocalStorage from '../util/ecLocalStorage';

/**
 * 加载登录页图片
 *
 * @returns {function(*, *)}
 */
export function loadLoginImages() {
    return (dispatch, getState) => {
        THEME_API.getLoginImages().then((result) => {
            let loginBgImages = result.bgsrc;
            let loginLogoImage = result.logoSrc;

            // 判断当前使用的背景图片是否存在背景图片库中，若存在，继续使用该背景图片，若不存在，使用背景图片库第一张
            let loginBgImage = getState().login4e9.get('loginBgImage');
            if (loginBgImages && loginBgImages.length) {
                let isExists = false;
                for (let i = 0, len = loginBgImages.length; i < len; i++) {
                    if (loginBgImages[i] == loginBgImage) {
                        isExists = true;
                    }
                }
                if (!isExists) {
                    loginBgImage = loginBgImages[0];
                    ECLocalStorage.set('login', 'loginBgImage', loginBgImage, false);
                }
            } else {
                loginBgImage = '';
                ECLocalStorage.set('login', 'loginBgImage', '', false);
            }

            ECLocalStorage.set('login', 'loginLogoImage', loginLogoImage, false);

            dispatch({
                type: LOGIN4E9.LOGIN4E9_IMAGES,
                value: {
                    loginBgImage: loginBgImage,
                    loginLogoImage: loginLogoImage,
                    loginBgImages: loginBgImages
                }
            });
        });
    }
}

/**
 * 切换登录页背景图片
 *
 * @param loginBgImage     登录页背景图片
 *
 * @returns {function(*, *)}
 */
export function changeLoginBgImage(loginBgImage) {
    ECLocalStorage.set('login', 'loginBgImage', loginBgImage, false);

    return (dispatch) => {
        dispatch({
            type: LOGIN4E9.LOGIN4E9_IMAGES,
            value: {
                loginBgImage: loginBgImage
            }
        });
    }
}

/**
 * 加载登录页背景图片库
 *
 * @returns {function(*, *)}
 */
export function loadLoginBgImages() {
    return (dispatch) => {
        THEME_API.getLoginImages().then((result) => {
            let loginBgImages = result.bgsrc;

            dispatch({
                type: LOGIN4E9.LOGIN4E9_IMAGES,
                value: {
                    loginBgImages: loginBgImages
                }
            });
        });
    }
}

/**
 * 显示隐藏登录页背景图片库
 *
 * @param visible     是否显示
 *
 * @returns {function(*, *)}
 */
export function changeLoginBgImagesVisible(visible) {
    return (dispatch) => {
        dispatch({
            type: LOGIN4E9.LOGIN4E9_IMAGES,
            value: {
                loginBgImagesVisible: visible
            }
        });
    }
}