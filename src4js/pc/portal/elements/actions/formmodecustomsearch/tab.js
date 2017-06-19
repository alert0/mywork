import { FORMMODECUSTOMSEARCH_STATE_TYPES } from '../../constants/ActionTypes';
const { FORMMODECUSTOMSEARCH_TAB_DATA, FORMMODECUSTOMSEARCH_TAB_REFRESH } = FORMMODECUSTOMSEARCH_STATE_TYPES
import { reqFormModeCustomSearchTabDatas } from '../../apis/formmodecustomsearch';
import ecLocalStorage from '../../util/ecLocalStorage';
import Immutable from 'immutable';

const initFormModeCustomSearchTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().eformmodecustomsearchtab.get("data");
        const itabid = getState().eformmodecustomsearchtab.get("tabid");
        const irefresh = getState().eformmodecustomsearchtab.get("refresh");
        const key = eid + "-" + tabid;
        ecLocalStorage.set("portal-" + window.global_hpid, "formmodecustomsearch-tab-" + key, data, true);
        dispatch({
            type: FORMMODECUSTOMSEARCH_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid),
            refresh: getImmutableData(key, false, irefresh)
        });
    }
}

const getFormModeCustomSearchTabDatas = (params) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        reqFormModeCustomSearchTabDatas(params).then((data) => {
            ecLocalStorage.set("portal-" + window.global_hpid, "formmodecustomsearch-tab-" + eid + "-" + tabid, data, true);
            if(window.global_isremembertab){
                let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "formmodecustomsearch-" + eid, true);
                if(edata){
                    edata['data'] = data;
                    edata['currenttab'] = tabid;
                    const nedata = Immutable.fromJS(edata).toJSON();
                    ecLocalStorage.set("portal-" + window.global_hpid, "formmodecustomsearch-" + eid, nedata, true);
                }
            }
            const tabidObj = getState().eformmodecustomsearchtab.get("tabid").toJSON();
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
        const idata = getState().eformmodecustomsearchtab.get("data");
        const itabid = getState().eformmodecustomsearchtab.get("tabid");
        const irefresh = getState().eformmodecustomsearchtab.get("refresh");
        const key = eid + "-" + tabid;
        dispatch({
            type: FORMMODECUSTOMSEARCH_TAB_DATA,
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
        const irefresh = getState().eformmodecustomsearchtab.get("refresh");
        const itabid = getState().eformmodecustomsearchtab.get("tabid");
        const key = eid + "-" + ntabid;
        if(window.global_isremembertab){
            let tabdata = ecLocalStorage.getObj("portal-" + window.global_hpid, "formmodecustomsearch-tab-" + key, true);
            let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "formmodecustomsearch-" + eid, true);
            if(edata){
                edata['data'] = tabdata;
                edata['currenttab'] = ntabid;
                const nedata = Immutable.fromJS(edata).toJSON();
                ecLocalStorage.set("portal-" + window.global_hpid, "formmodecustomsearch-" + eid, nedata, true); 
            }
        }
        dispatch({
            type: FORMMODECUSTOMSEARCH_TAB_REFRESH,
            tabid: getImmutableData(eid, ntabid, itabid),
            refresh: getImmutableData(key, refresh, irefresh)
        });
        params['tabid'] = ntabid;
        dispatch(getFormModeCustomSearchTabDatas(params));
    }
}

module.exports = {
    initFormModeCustomSearchTabDatas,
    getFormModeCustomSearchTabDatas,
    handleChangeTab,
};
