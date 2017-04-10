import Immutable from 'immutable';
import {LOGIN4E9} from '../constants/ActionTypes';
import ECLocalStorage from '../util/ecLocalStorage';

/**
 * e9登录页
 *
 * @param state
 *              loginBgImage          登录页当前使用的背景图片
 *              loginLogoImage        登录页 logo 图片
 *
 *              loginBgImages         登录页背景图片库
 *              loginBgImagesVisible  是否显示登录页背景图片库
 *
 * @param action
 * @returns {*}
 */
export default function login4e9(state = Immutable.fromJS({
    loginBgImage: ECLocalStorage.getStr('login', 'loginBgImage', false) || '',
    loginLogoImage: ECLocalStorage.getStr('login', 'loginLogoImage', false) || '',

    loginBgImages: [],
    loginBgImagesVisible: false
}), action) {
    switch (action.type) {
        case LOGIN4E9.LOGIN4E9_IMAGES:
            return state.merge(action.value);

        default:
            return state;
    }
}
