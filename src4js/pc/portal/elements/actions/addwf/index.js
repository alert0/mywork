import { ELEMENT_STATE_TYPES } from '../../constants/ActionTypes';
const { ELEMENT_DATA, ELEMENT_REFRESH, ELEMENT_CONFIG } = ELEMENT_STATE_TYPES;
import { reqAddWfDatas } from '../../apis/addwf';
import Immutable from 'immutable';
import ecLocalStorage from '../../util/ecLocalStorage';

import { initAddWfTabDatas } from './tab';
import { initTitleData } from './title';
const initAddWfConfig = (config) => {
    return (dispatch, getState) => {
        const { params } = config;
        const { eid } = params;
        const iconfig = getState().elements.get("config");
        dispatch({
            type: ELEMENT_CONFIG,
            config: getImmutableData(eid, config, iconfig)
        });
        dispatch(getAddWfDatas(params));
    }
}
const getAddWfDatas = (params) => {
    return (dispatch, getState) => {
        const { eid } = params;
        reqAddWfDatas(params).then((data) => {
            let iolddata = getState().elements.get("data");
            let idata = Immutable.fromJS(data);
            ecLocalStorage.set("portal-" + window.global_hpid, "addwf-" + eid, data, true);
            dispatch(handleImmutableData(eid, false, data));
            dispatch(initTitleData(eid,data.currenttab));
            dispatch(initAddWfTabDatas(eid, data.currenttab, data.data));
        });
    }
}
const getImmutableData = (eid, old, im) => {
    var ndata = {};
    ndata[eid] = old;
    var nresult = im.merge(Immutable.fromJS(ndata));
    return nresult;
}

const handleImmutableData = (eid, refresh, data) => {
    return (dispatch, getState) => {
        const idata = getState().elements.get("data");
        const irefresh = getState().elements.get("refresh");
        dispatch({
            type: ELEMENT_DATA,
            data: getImmutableData(eid, data, idata),
            refresh: getImmutableData(eid, refresh, irefresh)
        });
    }
}

const handleRefresh = (params) => {
    return (dispatch, getState) => {
        const { eid } = params;
        const irefresh = getState().elements.get("refresh");
        dispatch({
            type: ELEMENT_REFRESH,
            refresh: getImmutableData(eid, true, irefresh)
        });
        dispatch(getAddWfDatas(params));
    }
}

module.exports = {
    initAddWfConfig,
    getAddWfDatas,
    handleRefresh
};
