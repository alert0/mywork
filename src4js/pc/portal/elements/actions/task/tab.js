import { TASK_STATE_TYPES } from '../../constants/ActionTypes';
const { TASK_TAB_DATA, TASK_TAB_REFRESH } = TASK_STATE_TYPES
import { reqTaskTabDatas } from '../../apis/task';
import ecLocalStorage from '../../util/ecLocalStorage';
import Immutable from 'immutable';

const initTaskTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().etasktab.get("data");
        const itabid = getState().etasktab.get("tabid");
        const irefresh = getState().etasktab.get("refresh");
        const key = eid + "-" + tabid;
        ecLocalStorage.set("portal-" + window.global_hpid, "task-tab-" + key, data, true);
        dispatch({
            type: TASK_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid),
            refresh: getImmutableData(key, false, irefresh)
        });
    }
}

const getTaskTabDatas = (params) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        reqTaskTabDatas(params).then((data) => {
            ecLocalStorage.set("portal-" + window.global_hpid, "task-tab-" + eid + "-" + tabid, data, true);
            if(window.global_isremembertab){
                let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "task-" + eid, true);
                if(edata){
                    edata['data'] = data;
                    edata['currenttab'] = tabid;
                    const nedata = Immutable.fromJS(edata).toJSON();
                    ecLocalStorage.set("portal-" + window.global_hpid, "task-" + eid, nedata, true);
                }
            }
            const tabidObj = getState().etasktab.get("tabid").toJSON();
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
        const idata = getState().etasktab.get("data");
        const itabid = getState().etasktab.get("tabid");
        const irefresh = getState().etasktab.get("refresh");
        const key = eid + "-" + tabid;
        dispatch({
            type: TASK_TAB_DATA,
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
        const irefresh = getState().etasktab.get("refresh");
        const itabid = getState().etasktab.get("tabid");
        const key = eid + "-" + ntabid;
        if(window.global_isremembertab){
            let tabdata = ecLocalStorage.getObj("portal-" + window.global_hpid, "task-tab-" + key, true);
            let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "task-" + eid, true);
            if(edata){
                edata['data'] = tabdata;
                edata['currenttab'] = ntabid;
                const nedata = Immutable.fromJS(edata).toJSON();
                ecLocalStorage.set("portal-" + window.global_hpid, "task-" + eid, nedata, true); 
            }
        }
        dispatch({
            type: TASK_TAB_REFRESH,
            tabid: getImmutableData(eid, ntabid, itabid),
            refresh: getImmutableData(key, refresh, irefresh)
        });
        params['tabid'] = ntabid;
        dispatch(getTaskTabDatas(params));
    }
}

module.exports = {
    initTaskTabDatas,
    getTaskTabDatas,
    handleChangeTab,
};
