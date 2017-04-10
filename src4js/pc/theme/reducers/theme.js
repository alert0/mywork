import Immutable from 'immutable';
import {THEME} from '../constants/ActionTypes';

/**
 * 主题
 *
 * @param state
 *          themeInfo               主题信息
 *
 *          topLogoImage            顶部 logo
 *
 *          topMenu                 顶部菜单
 *          topMenuVisible          顶部菜单是否可见
 *          topMenuSelected         选中的顶部菜单
 *
 *          freqUseMenu             常用菜单
 *          freqUseMenuVisible      常用菜单是否可见
 *
 *          quickSearchTypes        快速搜索类型
 *          quickSearchTypesVisible 快速搜索类型是否可见
 *          quickSearchTypesSelected选中的快速搜索类型
 *
 *          hasRemind               是否有新消息
 *          remindList              消息列表
 *          remindListVisible       消息列表是否可见
 *
 *          toolbarMenu             工具栏菜单
 *
 *          toolbarMoreMenu         工具栏更多菜单
 *          toolbarMoreMenuVisible  工具栏更多菜单是否可见
 *
 *          account                 账号信息
 *          accountVisible          账号信息是否可见
 *
 *          leftMenuMode            左侧菜单展示模式。1、展开状态（inline），即菜单垂直展开；2、收缩状态（vertical），即菜单水平展开
 *          leftMenu                左侧菜单
 *          leftMenuSelected        左侧菜单被选中的菜单
 *          leftMenuType            左侧菜单类型。目前类型分为三种：门户菜单（portal），邮件菜单（email），模块菜单（common）
 * @param action
 * @returns {*}
 */
export default function theme(state = Immutable.fromJS({
    themeInfo: {
        themeType: '',
        themeColorType: ''
    },

    topLogoImage: '',

    topMenu: [],
    topMenuVisible: false,
    topMenuSelected: {menuId: 0, menuName: '我的门户'},

    freqUseMenu: [],
    freqUseMenuVisible: false,

    quickSearchTypes: [],
    quickSearchTypesVisible: false,
    quickSearchTypesSelected: {},

    hasRemind: false,
    remindList: [],
    remindListVisible: false,

    toolbarMenu: [],

    toolbarMoreMenu: [],
    toolbarMoreMenuVisible: false,

    account: {},
    accountVisible: false,

    leftMenuMode: 'inline',
    leftMenu: [],
    leftMenuSelected: {},
    leftMenuType: 'portal'
}), action) {
    switch (action.type) {
        case THEME.THEME_INFO:
            return state.merge(action.value);

        case THEME.THEME_TOP_LOGO:
            return state.merge(action.value);

        case THEME.THEME_TOP_MENU:
            return state.merge(action.value);

        case THEME.THEME_TOP_FREQ_USE_MENU:
            return state.merge(action.value);

        case THEME.THEME_TOP_QUICK_SEARCH:
            return state.merge(action.value);

        case THEME.THEME_TOP_REMIND:
            return state.merge(action.value);

        case THEME.THEME_TOP_TOOLBAR:
            return state.merge(action.value);

        case THEME.THEME_TOP_TOOLBAR_MORE:
            return state.merge(action.value);

        case THEME.THEME_TOP_ACCOUNT:
            return state.merge(action.value);

        case THEME.THEME_LEFT_MENU:
            return state.merge(action.value);

        default:
            return state
    }
}