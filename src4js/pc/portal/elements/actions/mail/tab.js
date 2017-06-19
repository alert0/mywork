import { MAIL_STATE_TYPES } from '../../constants/ActionTypes';
const { MAIL_TAB_DATA, MAIL_TAB_REFRESH, MAIL_TAB_TABID } = MAIL_STATE_TYPES
import ecLocalStorage from '../../util/ecLocalStorage';
import Immutable from 'immutable';

const initMailTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().emailtab.get("data");
        const itabid = getState().emailtab.get("tabid");
        const key = eid + "-" + tabid;
        ecLocalStorage.set("portal-" + window.global_hpid, "mail-tab-" + key, data, true);
        dispatch({
            type: MAIL_TAB_DATA,
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
        const idata = getState().emailtab.get("data");
        const itabid = getState().emailtab.get("tabid");
        const key = eid + "-" + tabid;
        dispatch({
            type: MAIL_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid)
        });
    }
}

const handleChangeTab = (eid, ntabid) => {
    return (dispatch, getState) => {
        const itabid = getState().emailtab.get("tabid");
        dispatch({
            type: MAIL_TAB_TABID,
            tabid: getImmutableData(eid, ntabid, itabid)
        });
    }
}

module.exports = {
    initMailTabDatas,
    handleChangeTab,
};
