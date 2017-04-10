import { REPORTFORM_STATE_TYPES } from '../../constants/ActionTypes';
const { REPORTFORM_TAB_DATA, REPORTFORM_TAB_REFRESH } = REPORTFORM_STATE_TYPES
import { reqReportFormTabDatas } from '../../apis/reportform';
import ecLocalStorage from '../../util/ecLocalStorage';
import Immutable from 'immutable';

const initReportFormTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().ereportformtab.get("data");
        const itabid = getState().ereportformtab.get("tabid");
        const irefresh = getState().ereportformtab.get("refresh");
        const key = eid + "-" + tabid;
        ecLocalStorage.set("portal-" + window.global_hpid, "reportform-tab-" + key, data, true);
        dispatch({
            type: REPORTFORM_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid),
            refresh: getImmutableData(key, false, irefresh)
        });
    }
}

const getReportFormTabDatas = (params) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        reqReportFormTabDatas(params).then((data) => {
            ecLocalStorage.set("portal-" + window.global_hpid, "reportform-tab-" + eid + "-" + tabid, data, true);
            if(window.global_isremembertab){
                let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "reportform-" + eid, true);
                if(edata){
                    edata['data'] = data;
                    edata['currenttab'] = tabid;
                    const nedata = Immutable.fromJS(edata).toJSON();
                    ecLocalStorage.set("portal-" + window.global_hpid, "reportform-" + eid, nedata, true);
                }
            }
            const tabidObj = getState().ereportformtab.get("tabid").toJSON();
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
        const idata = getState().ereportformtab.get("data");
        const itabid = getState().ereportformtab.get("tabid");
        const irefresh = getState().ereportformtab.get("refresh");
        const key = eid + "-" + tabid;
        dispatch({
            type: REPORTFORM_TAB_DATA,
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
        const irefresh = getState().ereportformtab.get("refresh");
        const itabid = getState().ereportformtab.get("tabid");
        const key = eid + "-" + ntabid;
        if(window.global_isremembertab){
            let tabdata = ecLocalStorage.getObj("portal-" + window.global_hpid, "reportform-tab-" + key, true);
            let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "reportform-" + eid, true);
            if(edata){
                edata['data'] = tabdata;
                edata['currenttab'] = ntabid;
                const nedata = Immutable.fromJS(edata).toJSON();
                ecLocalStorage.set("portal-" + window.global_hpid, "reportform-" + eid, nedata, true); 
            }
        }
        dispatch({
            type: REPORTFORM_TAB_REFRESH,
            tabid: getImmutableData(eid, ntabid, itabid),
            refresh: getImmutableData(key, refresh, irefresh)
        });
        params['tabid'] = ntabid;
        dispatch(getReportFormTabDatas(params));
    }
}

module.exports = {
    initReportFormTabDatas,
    getReportFormTabDatas,
    handleChangeTab,
};
