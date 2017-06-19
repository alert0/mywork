import { ADDWF_STATE_TYPES } from '../../constants/ActionTypes';
const { ADDWF_TAB_DATA, ADDWF_TAB_REFRESH } = ADDWF_STATE_TYPES
import { reqAddWfTabDatas } from '../../apis/addwf';
import ecLocalStorage from '../../util/ecLocalStorage';
import Immutable from 'immutable';

const initAddWfTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().eaddwftab.get("data");
        const itabid = getState().eaddwftab.get("tabid");
        const irefresh = getState().eaddwftab.get("refresh");
        const key = eid + "-" + tabid;
        ecLocalStorage.set("portal-" + window.global_hpid, "addwf-tab-" + key, data, true);
        dispatch({
            type: ADDWF_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid),
            refresh: getImmutableData(key, false, irefresh)
        });
    }
}

const getAddWfTabDatas = (params) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        reqAddWfTabDatas(params).then((data) => {
            ecLocalStorage.set("portal-" + window.global_hpid, "addwf-tab-" + eid + "-" + tabid, data, true);
            if(window.global_isremembertab){
                let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "addwf-" + eid, true);
                if(edata){
                    edata['data'] = data;
                    edata['currenttab'] = tabid;
                    const nedata = Immutable.fromJS(edata).toJSON();
                    ecLocalStorage.set("portal-" + window.global_hpid, "addwf-" + eid, nedata, true);
                }
            }
            const tabidObj = getState().eaddwftab.get("tabid").toJSON();
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
        const idata = getState().eaddwftab.get("data");
        const itabid = getState().eaddwftab.get("tabid");
        const irefresh = getState().eaddwftab.get("refresh");
        const key = eid + "-" + tabid;
        dispatch({
            type: ADDWF_TAB_DATA,
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
        const irefresh = getState().eaddwftab.get("refresh");
        const itabid = getState().eaddwftab.get("tabid");
        const key = eid + "-" + ntabid;
        if(window.global_isremembertab){
            let tabdata = ecLocalStorage.getObj("portal-" + window.global_hpid, "addwf-tab-" + key, true);
            let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "addwf-" + eid, true);
            if(edata){
                edata['data'] = tabdata;
                edata['currenttab'] = ntabid;
                const nedata = Immutable.fromJS(edata).toJSON();
                ecLocalStorage.set("portal-" + window.global_hpid, "addwf-" + eid, nedata, true); 
            }
        }
        dispatch({
            type: ADDWF_TAB_REFRESH,
            tabid: getImmutableData(eid, ntabid, itabid),
            refresh: getImmutableData(key, refresh, irefresh)
        });
        params['tabid'] = ntabid;
        dispatch(getAddWfTabDatas(params));
    }
}

module.exports = {
    initAddWfTabDatas,
    getAddWfTabDatas,
    handleChangeTab,
};
