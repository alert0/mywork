import { PORTAL_HPDATA, PORTAL_PARAMS } from '../constants/ActionTypes';
import ecLocalStorage from '../util/ecLocalStorage.js';
import { reqPortalDatas } from '../apis/portal';
import Immutable from 'immutable';
const getPortalDatas = (params) => {
    //关闭右键菜单弹窗
    onRightClickMenuClose();
    
    return (dispatch, getState) => {
        const { hpid } = params;
        window.isPortalRender = false;
        reqPortalDatas(params).then((data) => {
            if(data.hasRight === "true"){
                window.global_isremembertab = data.hpinfo.isremembertab !== "0";
                ecLocalStorage.set("portal-" + hpid+"-"+params.isSetting, "hpdata", data, true);
            }
            dispatch(handleImmutableData(hpid+"-"+params.isSetting,data));
            window.isRefreshPortal = false;
        });
    }
}

const getImmutableData = (key, old, im) => {
    var ndata = {};
    ndata[key] = old;
    var nresult = im.merge(Immutable.fromJS(ndata));
    return nresult;
}

const handleImmutableData = (key, data) => {
    return (dispatch, getState) => {
        const ihpdata = getState().portal.get("hpdata");
        dispatch({
            type: PORTAL_HPDATA,
            hpdata: getImmutableData(key, data, ihpdata)
        });
    }
}

const setParamsState = (params) => {
    return (dispatch, getState) => {
        const iparams = getState().portal.get("params");
        dispatch({
            type: PORTAL_PARAMS,
            params: getImmutableData(params.hpid+"-"+params.isSetting, params, iparams)
        });
    }
}

module.exports = {
    getPortalDatas,
    setParamsState
};
