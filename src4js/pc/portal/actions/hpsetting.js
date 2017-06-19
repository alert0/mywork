import { PORTAL_HP_SETTING, PORTAL_HP_SETTING_MAX, PORTAL_HP_SETTING_CLOSE } from '../constants/ActionTypes';
import Immutable from 'immutable';
import {getHpSettingInfo} from '../apis/hpsetting.js';
const handleCustomHpSetting = (hpid, subCompanyId,hpname) => {
    return (dispatch, getState) => {
        const params={
            hpid,
            subCompanyId,
        }
        getHpSettingInfo(params).then((data) => {
            if(!data.status){
                dispatch({
                    type: PORTAL_HP_SETTING,
                    hpid: hpid,
                    hpname:hpname,
                    subCompanyId: subCompanyId,
                    data:data,
                    max: true,
                    close: false,
                    refreshElement: true
                });
            }
        });
    }
}


const maxCustomHpSetting = (max) => {
    return (dispatch, getState) => {
        dispatch({
            type: PORTAL_HP_SETTING_MAX,
            max: max,
            refreshElement: false
        });
    }
}

const closeCustomHpSetting = (close) => {
    return (dispatch, getState) => {
        dispatch({
            type: PORTAL_HP_SETTING_CLOSE,
            close: true
        });
    }
}
module.exports = {
    handleCustomHpSetting,
    maxCustomHpSetting,
    closeCustomHpSetting
};

