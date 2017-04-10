import { WORKFLOW_STATE_TYPES } from '../../constants/ActionTypes';
const { WORKFLOW_TAB_DATA, WORKFLOW_TAB_REFRESH } = WORKFLOW_STATE_TYPES
import { reqWorkflowTabDatas } from '../../apis/workflow';
import ecLocalStorage from '../../util/ecLocalStorage';
import Immutable from 'immutable';

const initWorkflowTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().eworkflowtab.get("data");
        const itabid = getState().eworkflowtab.get("tabid");
        const irefresh = getState().eworkflowtab.get("refresh");
        const key = eid + "-" + tabid;
        ecLocalStorage.set("portal-" + window.global_hpid, "workflow-tab-" + key, data, true);
        dispatch({
            type: WORKFLOW_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid),
            refresh: getImmutableData(key, false, irefresh)
        });
    }
}

const getWorkflowTabDatas = (params) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        reqWorkflowTabDatas(params).then((data) => {
            ecLocalStorage.set("portal-" + window.global_hpid, "workflow-tab-" + eid + "-" + tabid, data, true);
            if(window.global_isremembertab){
                let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "workflow-" + eid, true);
                if(edata){
                    edata['data'] = data;
                    edata['currenttab'] = tabid;
                    const nedata = Immutable.fromJS(edata).toJSON();
                    ecLocalStorage.set("portal-" + window.global_hpid, "workflow-" + eid, nedata, true);
                }
            }
            const tabidObj = getState().eworkflowtab.get("tabid").toJSON();
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
        const idata = getState().eworkflowtab.get("data");
        const itabid = getState().eworkflowtab.get("tabid");
        const irefresh = getState().eworkflowtab.get("refresh");
        const key = eid + "-" + tabid;
        dispatch({
            type: WORKFLOW_TAB_DATA,
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
        const irefresh = getState().eworkflowtab.get("refresh");
        const itabid = getState().eworkflowtab.get("tabid");
        const key = eid + "-" + ntabid;
        if(window.global_isremembertab){
            let tabdata = ecLocalStorage.getObj("portal-" + window.global_hpid, "workflow-tab-" + key, true);
            let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "workflow-" + eid, true);
            if(edata){
                edata['data'] = tabdata;
                edata['currenttab'] = ntabid;
                const nedata = Immutable.fromJS(edata).toJSON();
                ecLocalStorage.set("portal-" + window.global_hpid, "workflow-" + eid, nedata, true); 
            }
        }
        dispatch({
            type: WORKFLOW_TAB_REFRESH,
            tabid: getImmutableData(eid, ntabid, itabid),
            refresh: getImmutableData(key, refresh, irefresh)
        });
        params['tabid'] = ntabid;
        dispatch(getWorkflowTabDatas(params));
    }
}

module.exports = {
    initWorkflowTabDatas,
    getWorkflowTabDatas,
    handleChangeTab,
};
