/**
 * Created by Administrator on 2017/5/10.
 */
import { PORTAL_SETTING_INFO,PORTAL_DOPORTALSYNIZE} from '../constants/ActionTypes';

import { WeaTools } from 'ecCom';

//获取门户设置信息
const getHpSettingInfo = (params = {}) => WeaTools.callApi(PORTAL_SETTING_INFO, 'POST',params);
const doPortalSynize =(params ={}) => WeaTools.callApi(PORTAL_DOPORTALSYNIZE, 'POST',params);

module.exports = {
    getHpSettingInfo,
    doPortalSynize,
};