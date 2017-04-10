import { ELEMENT_STATE_TYPES } from '../../constants/ActionTypes';
const { ELEMENT_DATA, ELEMENT_REFRESH, ELEMENT_CONFIG } = ELEMENT_STATE_TYPES;
import { reqFavouriteDatas } from '../../apis/favourite';
import Immutable from 'immutable';
import ecLocalStorage from '../../util/ecLocalStorage';
const initFavouriteConfig = (config) => {
    return (dispatch, getState) => {
        const { params } = config;
        const { eid } = params;
        const iconfig = getState().elements.get("config");
        dispatch({
            type: ELEMENT_CONFIG,
            config: getImmutableData(eid, config, iconfig)
        });
        dispatch(getFavouriteDatas(params));
    }
}
const getFavouriteDatas = (params) => {
    return (dispatch, getState) => {
        const { eid } = params;
        reqFavouriteDatas(params).then((data) => {
            let iolddata = getState().elements.get("data");
            let idata = Immutable.fromJS(data);
            ecLocalStorage.set("portal-" + window.global_hpid, "favourite-" + eid, data, true);
            dispatch(handleImmutableData(eid, false, data));
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
        dispatch(getFavouriteDatas(params));
    }
}

module.exports = {
    initFavouriteConfig,
    getFavouriteDatas,
    handleRefresh
};
