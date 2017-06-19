import { BLOGSTATUS_STATE_TYPES } from '../../constants/ActionTypes';
const { BLOGSTATUS_TAB_DATA, BLOGSTATUS_TAB_REFRESH, BLOGSTATUS_TAB_TABID } = BLOGSTATUS_STATE_TYPES
import ecLocalStorage from '../../util/ecLocalStorage';
import Immutable from 'immutable';

const initBlogStatusTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().eblogstatustab.get("data");
        const itabid = getState().eblogstatustab.get("tabid");
        const key = eid + "-" + tabid;
        ecLocalStorage.set("portal-" + window.global_hpid, "blogstatus-tab-" + key, data, true);
        dispatch({
            type: BLOGSTATUS_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid)
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
        const idata = getState().eblogstatustab.get("data");
        const itabid = getState().eblogstatustab.get("tabid");
        const key = eid + "-" + tabid;
        dispatch({
            type: BLOGSTATUS_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid)
        });
    }
}

const handleChangeTab = (eid, ntabid) => {
    return (dispatch, getState) => {
        const itabid = getState().eblogstatustab.get("tabid");
        dispatch({
            type: BLOGSTATUS_TAB_TABID,
            tabid: getImmutableData(eid, ntabid, itabid)
        });
    }
}

module.exports = {
    initBlogStatusTabDatas,
    handleChangeTab,
};
