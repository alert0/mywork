import {WeaTools} from 'weaCom';

export const getTopLogo = () => WeaTools.callApi('/page/interfaces/themeColorListJson.jsp', 'GET', {}, 'json');
export const getTopMenu = () => WeaTools.callApi('/page/interfaces/leftMenuToJson.jsp?parentid=0&needchild=0&withportal=0', 'GET', {}, 'json');
export const getFreqUseMenu = () => WeaTools.callApi('/page/interfaces/commonMenuToJson.jsp?shownourlmenu=n', 'GET', {}, 'json');
export const getQuickSearchTypes = () => WeaTools.callApi('/page/interfaces/quickSearchItemsToJson.jsp', 'GET', {}, 'json');
export const getRemindList = () => WeaTools.callApi('/wui/theme/ecology9/page/getRemindInfo.jsp', 'GET', {}, 'json');
export const getToolbarMenu = () => WeaTools.callApi('/page/interfaces/toolbarIconToJson.jsp', 'GET', {}, 'json');
export const getToolbarMoreMenu = () => WeaTools.callApi('/page/interfaces/toolbarMoreMenuToJson.jsp?menutype=front', 'GET', {}, 'json');
export const getAccount = () => WeaTools.callApi('/page/interfaces/accountListJson.jsp', 'GET', {}, 'json');
export const getBirthdayInfo = () => WeaTools.callApi('/hrm/resource/getBirthdayInfo.jsp', 'GET', {}, 'json');
export const getPortalMenu = () => WeaTools.callApi('/page/interfaces/portalMenuToJson.jsp?parentid=0', 'GET', {}, 'json');
export const getEmailMenu = () => WeaTools.callApi('/wui/theme/ecology9/page/emailMenuJSON.jsp', 'GET', {}, 'json');
export const getCommonMenu = (params = {}) => WeaTools.callApi('/page/interfaces/leftMenuToJson.jsp', 'POST', params, 'json');
export const getPlugin = () => WeaTools.callApi('/wui/common/page/pluginManage.jsp', 'GET', {}, 'text');
export const clearEmail = () => WeaTools.callApi('/email/new/MailManageOperation.jsp?operation=deleteAll&folderid=-3', 'GET', {}, 'text');
export const logout = () => WeaTools.callApi('/login/LoginUtil.jsp', 'POST', {type: 'logout'}, 'text');