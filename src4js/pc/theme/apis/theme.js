import {WeaTools} from 'ecCom';

// e9登录页图片
export const getLoginImages = () => WeaTools.callApi('/api/portal/login/logininfo', 'POST', {method: 'preload'}, 'json');
// e9主题配置
export const getThemeConfig = () => WeaTools.callApi('/api/portal/theme/themeconfig', 'POST', {}, 'json');
// 顶部菜单
export const getTopMenu = () => WeaTools.callApi('/api/portal/leftmenu/leftmenu', 'POST', {parentid: '0', needchild: '0', withportal: '0'}, 'json');
// 常用菜单
export const getFreqUseMenu = () => WeaTools.callApi('/api/portal/frequsemenu/frequsemenu', 'POST', {shownourlmenu: 'n'}, 'json');
// 快速搜索类型
export const getQuickSearchTypes = () => WeaTools.callApi('/api/portal/quicksearch/quicksearchtypes', 'POST', {}, 'json');
// 工具栏菜单
export const getToolbarMenu = () => WeaTools.callApi('/api/portal/toolbar/toolbarmenu', 'POST', {}, 'json');
// 工具栏更多菜单
export const getToolbarMoreMenu = () => WeaTools.callApi('/api/portal/toolbarmore/toolbarmoremenu', 'POST', {menutype: 'front'}, 'json');
// 账号
export const getAccount = () => WeaTools.callApi('/api/portal/account/accountlist', 'POST', {}, 'json');
// 门户菜单
export const getPortalMenu = () => WeaTools.callApi('/api/portal/portalmenu/portalmenu', 'POST', {parentid: 0}, 'json');
// 邮件菜单
export const getEmailMenu = () => WeaTools.callApi('/api/portal/emailmenu/emailmenu', 'POST', {}, 'json');
// 模块菜单
export const getCommonMenu = (params = {}) => WeaTools.callApi('/api/portal/leftmenu/leftmenu', 'POST', params, 'json');
// 消息提醒
export const getRemindList = () => WeaTools.callApi('/page/interfaces/getRemindInfo.jsp', 'POST', {}, 'json');