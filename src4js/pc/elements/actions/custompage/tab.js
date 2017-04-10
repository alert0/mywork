import { CUSTOMPAGE_STATE_TYPES } from '../../constants/ActionTypes';
const { CUSTOMPAGE_TAB_DATA, CUSTOMPAGE_TAB_REFRESH } = CUSTOMPAGE_STATE_TYPES
import { reqCustomPageTabDatas } from '../../apis/custompage';
import Immutable from 'immutable';
import { setFrameData, setLoadingVisible } from './iframe';
const initCustomPageTabDatas = (eid,tabid,data) => {
    return (dispatch, getState) => {
        const idata = getState().ecustompagetab.get("data");
        const itabid = getState().ecustompagetab.get("tabid");
        const irefresh = getState().ecustompagetab.get("refresh");
        const key = eid + "-" + tabid;
        dispatch({
            type: CUSTOMPAGE_TAB_DATA,
            data: getImmutableData(key, data, idata),
            tabid: getImmutableData(eid, tabid, itabid),
            refresh: getImmutableData(key, false, irefresh)
        });
    }
}

const getCustomPageTabDatas = (params,refresh) => {
    return (dispatch, getState) => {
        const { eid, tabid } = params;
        reqCustomPageTabDatas(params).then((data) => {
            const tabidObj = getState().ecustompagetab.get("tabid").toJSON();
            if(tabidObj[eid] === tabid){
                dispatch(handleImmutableData(params, false, data));
            }
            if(refresh){
                dispatch(setLoadingVisible(false, eid, tabid));
                var obj = {
                    eid,
                    data,
                    tabid
                }
                dispatch(setFrameData(obj));
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
        const idata = getState().ecustompagetab.get("data");
        const itabid = getState().ecustompagetab.get("tabid");
        const irefresh = getState().ecustompagetab.get("refresh");
        const key = eid + "-" + tabid;
        dispatch({
            type: CUSTOMPAGE_TAB_DATA,
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
        const irefresh = getState().ecustompagetab.get("refresh");
        const itabid = getState().ecustompagetab.get("tabid");
        const key = eid + "-" + ntabid;
        dispatch({
            type: CUSTOMPAGE_TAB_REFRESH,
            tabid: getImmutableData(eid, ntabid, itabid),
            refresh: getImmutableData(key, refresh, irefresh)
        });
        params['tabid'] = ntabid;
        dispatch(getCustomPageTabDatas(params,true));
    }
}

module.exports = {
    initCustomPageTabDatas,
    getCustomPageTabDatas,
    handleChangeTab,
};
