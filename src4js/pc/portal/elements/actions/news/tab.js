import { NEWS_STATE_TYPES } from '../../constants/ActionTypes';
const { NEWS_TAB_DATA, NEWS_TAB_REFRESH } = NEWS_STATE_TYPES
import { reqNewsTabDatas } from '../../apis/news';
import ecLocalStorage from '../../util/ecLocalStorage';
import Immutable from 'immutable';

const initNewsTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().enewstab.get("data");
        const itabid = getState().enewstab.get("tabid");
        const irefresh = getState().enewstab.get("refresh");
        const key = eid + "-" + tabid;
        ecLocalStorage.set("portal-" + window.global_hpid, "news-tab-" + key, data, true);
        dispatch({
            type: NEWS_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid),
            refresh: getImmutableData(key, false, irefresh)
        });
    }
}

const getNewsTabDatas = (params) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        reqNewsTabDatas(params).then((data) => {
            ecLocalStorage.set("portal-" + window.global_hpid, "news-tab-" + eid + "-" + tabid, data, true);
            if(window.global_isremembertab){
                let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "news-" + eid, true);
                if(edata){
                    edata['data'] = data;
                    edata['currenttab'] = tabid;
                    const nedata = Immutable.fromJS(edata).toJSON();
                    ecLocalStorage.set("portal-" + window.global_hpid, "news-" + eid, nedata, true);
                }
            }
            const tabidObj = getState().enewstab.get("tabid").toJSON();
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
        const idata = getState().enewstab.get("data");
        const itabid = getState().enewstab.get("tabid");
        const irefresh = getState().enewstab.get("refresh");
        const key = eid + "-" + tabid;
        dispatch({
            type: NEWS_TAB_DATA,
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
        const irefresh = getState().enewstab.get("refresh");
        const itabid = getState().enewstab.get("tabid");
        const key = eid + "-" + ntabid;
        if(window.global_isremembertab){
            let tabdata = ecLocalStorage.getObj("portal-" + window.global_hpid, "news-tab-" + key, true);
            let edata = ecLocalStorage.getObj("portal-" + window.global_hpid, "news-" + eid, true);
            if(edata){
                edata['data'] = tabdata;
                edata['currenttab'] = ntabid;
                const nedata = Immutable.fromJS(edata).toJSON();
                ecLocalStorage.set("portal-" + window.global_hpid, "news-" + eid, nedata, true); 
            }
        }
        dispatch({
            type: NEWS_TAB_REFRESH,
            tabid: getImmutableData(eid, ntabid, itabid),
            refresh: getImmutableData(key, refresh, irefresh)
        });
        params['tabid'] = ntabid;
        dispatch(getNewsTabDatas(params));
    }
}

module.exports = {
    initNewsTabDatas,
    getNewsTabDatas,
    handleChangeTab,
};
