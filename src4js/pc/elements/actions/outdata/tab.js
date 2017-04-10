import { OUTDATA_STATE_TYPES } from '../../constants/ActionTypes';
const { OUTDATA_TAB_DATA, OUTDATA_TAB_REFRESH } = OUTDATA_STATE_TYPES
import { reqOutDataTabDatas } from '../../apis/outdata';
import ecLocalStorage from '../../util/ecLocalStorage';
import Immutable from 'immutable';

const initOutDataTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().eoutdatatab.get("data");
        const itabid = getState().eoutdatatab.get("tabid");
        const irefresh = getState().eoutdatatab.get("refresh");
        const key = eid + "-" + tabid;
        ecLocalStorage.set("portal-" + window.global_hpid, "outdata-tab-" + key, data, true);
        dispatch({
            type: OUTDATA_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid),
            refresh: getImmutableData(key, false, irefresh)
        });
    }
}

const getOutDataTabDatas = (params) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        reqOutDataTabDatas(params).then((data) => {
            ecLocalStorage.set("portal-" + window.global_hpid, "outdata-tab-" + eid + "-" + tabid, data, true);
            if(window.global_isremembertab){
                let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "outdata-" + eid, true);
                if(edata){
                    edata['data'] = data;
                    edata['currenttab'] = tabid;
                    const nedata = Immutable.fromJS(edata).toJSON();
                    ecLocalStorage.set("portal-" + window.global_hpid, "outdata-" + eid, nedata, true);
                }
            }
            const tabidObj = getState().eoutdatatab.get("tabid").toJSON();
            if(tabidObj[eid] === tabid){
                dispatch(handleImmutableData(params, false, data));
            }
        });
    }
}

const getImmutableData = (key, old, im) => {
    var ndata = {};
    ndata[key] = old;
    var nresult = im.merge(Immutable.fromJS(ndata));
    return nresult;
}

const handleImmutableData = (params, refresh, data) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        const idata = getState().eoutdatatab.get("data");
        const itabid = getState().eoutdatatab.get("tabid");
        const irefresh = getState().eoutdatatab.get("refresh");
        const key = eid + "-" + tabid;
        dispatch({
            type: OUTDATA_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid),
            refresh: getImmutableData(key, refresh, irefresh)
        });
    }
}

const handleChangeTab = (params, ntabid) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        const refresh = ntabid === tabid;
        const irefresh = getState().eoutdatatab.get("refresh");
        const itabid = getState().eoutdatatab.get("tabid");
        const key = eid + "-" + ntabid;
        if(window.global_isremembertab){
            let tabdata = ecLocalStorage.getObj("portal-" + window.global_hpid, "outdata-tab-" + key, true);
            let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "outdata-" + eid, true);
            if(edata){
                edata['data'] = tabdata;
                edata['currenttab'] = ntabid;
                const nedata = Immutable.fromJS(edata).toJSON();
                ecLocalStorage.set("portal-" + window.global_hpid, "outdata-" + eid, nedata, true); 
            }
        }
        dispatch({
            type: OUTDATA_TAB_REFRESH,
            tabid: getImmutableData(eid, ntabid, itabid),
            refresh: getImmutableData(key, refresh, irefresh)
        });
        params['tabid'] = ntabid;
        dispatch(getOutDataTabDatas(params));
    }
}

module.exports = {
    initOutDataTabDatas,
    getOutDataTabDatas,
    handleChangeTab,
};
