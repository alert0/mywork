import {WeaTools} from 'ecCom';

// 插件管理
export const getPlugin = () => WeaTools.callApi('/api/portal/plugin/pluginmanage', 'POST', {}, 'json');
// 生日提醒
export const getBirthdayInfo = () => WeaTools.callApi('/api/portal/plugin/birthdayinfo', 'POST', {}, 'json');
// 清空邮件垃圾箱
export const clearEmailDustbin = () => WeaTools.callApi('/email/new/MailManageOperation.jsp', 'POST', {operation: 'deleteAll', folderid: '-3'}, 'text');