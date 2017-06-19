import { RSS_STATE_TYPES } from '../../constants/ActionTypes';
const { RSS_TAB_DATA, RSS_TAB_REFRESH } = RSS_STATE_TYPES
import { reqRssTabDatas } from '../../apis/rss';
import ecLocalStorage from '../../util/ecLocalStorage';
import Immutable from 'immutable';

const initRssTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().ersstab.get("data");
        const itabid = getState().ersstab.get("tabid");
        const irefresh = getState().ersstab.get("refresh");
        const key = eid + "-" + tabid;
        ecLocalStorage.set("portal-" + window.global_hpid, "rss-tab-" + key, data, true);
        dispatch({
            type: RSS_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid),
            refresh: getImmutableData(key, false, irefresh)
        });
    }
}

const getRssTabDatas = (params) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        reqRssTabDatas(params).then((data) => {
            ecLocalStorage.set("portal-" + window.global_hpid, "rss-tab-" + eid + "-" + tabid, data, true);
            if(window.global_isremembertab){
                let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "rss-" + eid, true);
                if(edata){
                    edata['data'] = data;
                    edata['currenttab'] = tabid;
                    const nedata = Immutable.fromJS(edata).toJSON();
                    ecLocalStorage.set("portal-" + window.global_hpid, "rss-" + eid, nedata, true);
                }
            }
            const tabidObj = getState().ersstab.get("tabid").toJSON();
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
        const idata = getState().ersstab.get("data");
        const itabid = getState().ersstab.get("tabid");
        const irefresh = getState().ersstab.get("refresh");
        const key = eid + "-" + tabid;
        dispatch({
            type: RSS_TAB_DATA,
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
        const irefresh = getState().ersstab.get("refresh");
        const itabid = getState().ersstab.get("tabid");
        const key = eid + "-" + ntabid;
        if(window.global_isremembertab){
            let tabdata = ecLocalStorage.getObj("portal-" + window.global_hpid, "rss-tab-" + key, true);
            let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "rss-" + eid, true);
            if(edata){
                edata['data'] = tabdata;
                edata['currenttab'] = ntabid;
                const nedata = Immutable.fromJS(edata).toJSON();
                ecLocalStorage.set("portal-" + window.global_hpid, "rss-" + eid, nedata, true); 
            }
        }
        dispatch({
            type: RSS_TAB_REFRESH,
            tabid: getImmutableData(eid, ntabid, itabid),
            refresh: getImmutableData(key, refresh, irefresh)
        });
        params['tabid'] = ntabid;
        dispatch(getRssTabDatas(params));
    }
}

module.exports = {
    initRssTabDatas,
    getRssTabDatas,
    handleChangeTab,
};
