import { PORTAL_HPDATA } from '../constants/ActionTypes';
import ecLocalStorage from '../util/ecLocalStorage.js';
import { reqPortalDatas } from '../apis/portal';
import Immutable from 'immutable';
const getPortalDatas = (params) => {
    return (dispatch, getState) => {
        const { hpid } = params;
        reqPortalDatas(params).then((data) => {
            window.isPortalRender = false;
            if(data.hasRight === "true"){
                window.global_isremembertab = data.hpinfo.isremembertab !== "0";
                ecLocalStorage.set("portal-" + hpid, "hpdata", data, true);
            }
            dispatch(handleImmutableData(hpid,data));
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

module.exports = {
    getPortalDatas
};
