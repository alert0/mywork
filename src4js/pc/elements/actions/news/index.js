import { ELEMENT_STATE_TYPES } from '../../constants/ActionTypes';
const { ELEMENT_DATA, ELEMENT_REFRESH, ELEMENT_CONFIG } = ELEMENT_STATE_TYPES;
import { reqNewsDatas } from '../../apis/news';
import Immutable from 'immutable';
import ecLocalStorage from '../../util/ecLocalStorage';

import { initNewsTabDatas } from './tab';
import { initTitleData } from './title';
const initNewsConfig = (config) => {
    return (dispatch, getState) => {
        const { params } = config;
        const { eid } = params;
        const iconfig = getState().elements.get("config");
        dispatch({
            type: ELEMENT_CONFIG,
            config: getImmutableData(eid, config, iconfig)
        });
        dispatch(getNewsDatas(params));
    }
}
const getNewsDatas = (params) => {
    return (dispatch, getState) => {
        const { eid } = params;
        reqNewsDatas(params).then((data) => {
            let iolddata = getState().elements.get("data");
            let idata = Immutable.fromJS(data);
            ecLocalStorage.set("portal-" + window.global_hpid, "news-" + eid, data, true);
            dispatch(handleImmutableData(eid, false, data));
            dispatch(initTitleData(eid,data.currenttab));
            dispatch(initNewsTabDatas(eid, data.currenttab, data.data));
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
        dispatch(getNewsDatas(params));
    }
}

module.exports = {
    initNewsConfig,
    getNewsDatas,
    handleRefresh
};
