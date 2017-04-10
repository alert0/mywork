import { CONTACTS_STATE_TYPES } from '../../constants/ActionTypes';
const { CONTACTS_TAB_DATA, CONTACTS_TAB_REFRESH } = CONTACTS_STATE_TYPES
import { reqContactsTabDatas } from '../../apis/contacts';
import ecLocalStorage from '../../util/ecLocalStorage';
import Immutable from 'immutable';

const initContactsTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().econtactstab.get("data");
        const itabid = getState().econtactstab.get("tabid");
        const irefresh = getState().econtactstab.get("refresh");
        const key = eid + "-" + tabid;
        ecLocalStorage.set("portal-" + window.global_hpid, "contacts-tab-" + key, data, true);
        dispatch({
            type: CONTACTS_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid),
            refresh: getImmutableData(key, false, irefresh)
        });
    }
}

const getContactsTabDatas = (params) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        reqContactsTabDatas(params).then((data) => {
            ecLocalStorage.set("portal-" + window.global_hpid, "contacts-tab-" + eid + "-" + tabid, data, true);
            if(window.global_isremembertab){
                let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "contacts-" + eid, true);
                if(edata){
                    edata['data'] = data;
                    edata['currenttab'] = tabid;
                    const nedata = Immutable.fromJS(edata).toJSON();
                    ecLocalStorage.set("portal-" + window.global_hpid, "contacts-" + eid, nedata, true);
                }
            }
            const tabidObj = getState().econtactstab.get("tabid").toJSON();
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
        const idata = getState().econtactstab.get("data");
        const itabid = getState().econtactstab.get("tabid");
        const irefresh = getState().econtactstab.get("refresh");
        const key = eid + "-" + tabid;
        dispatch({
            type: CONTACTS_TAB_DATA,
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
        const irefresh = getState().econtactstab.get("refresh");
        const itabid = getState().econtactstab.get("tabid");
        const key = eid + "-" + ntabid;
        if(window.global_isremembertab){
            let tabdata = ecLocalStorage.getObj("portal-" + window.global_hpid, "contacts-tab-" + key, true);
            let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "contacts-" + eid, true);
            if(edata){
                edata['data'] = tabdata;
                edata['currenttab'] = ntabid;
                const nedata = Immutable.fromJS(edata).toJSON();
                ecLocalStorage.set("portal-" + window.global_hpid, "contacts-" + eid, nedata, true); 
            }
        }
        dispatch({
            type: CONTACTS_TAB_REFRESH,
            tabid: getImmutableData(eid, ntabid, itabid),
            refresh: getImmutableData(key, refresh, irefresh)
        });
        params['tabid'] = ntabid;
        dispatch(getContactsTabDatas(params));
    }
}

module.exports = {
    initContactsTabDatas,
    getContactsTabDatas,
    handleChangeTab,
};
