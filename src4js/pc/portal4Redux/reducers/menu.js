import Immutable from 'immutable';
import {PORTAL_LEFT_MENU} from '../constants/ActionTypes';
import ECLocalStorage from '../util/ecLocalStorage';

/**
 * 门户左侧菜单组件状态
 *
 * @param state     左侧菜单状态
 *          leftMenuMode：左侧菜单展示模式。1、展开状态（inline），即菜单垂直展开；2、收缩状态（vertical），即菜单水平展开
 *          leftMenu: 左侧菜单数据
 *          selectedMenu: 左侧菜单被选中的菜单
 *          leftMenuType: 左侧菜单类型。目前类型分为三种：门户菜单（portal），邮件菜单（email），模块菜单（common）
 * @param action    改变左侧菜单状态的操作
 * @returns {*}
 */
export function portalLeftMenu(state = Immutable.fromJS({
    leftMenuMode: ECLocalStorage.getStr('portalLeftMenu', 'leftMenuMode', false) || 'inline',
    leftMenu: [],
    selectedMenu: {},
    leftMenuType: 'portal'
}), action) {
    switch (action.type) {
        case PORTAL_LEFT_MENU.PORTAL_LEFT_MENU:
            return state.merge(action.value);

        case PORTAL_LEFT_MENU.PORTAL_LEFT_MENU_MODE:
            return state.merge(action.value);

        case PORTAL_LEFT_MENU.PORTAL_LEFT_MENU_SELECTED_MENU:
            return state.merge(action.value);

        default:
            return state
    }
}