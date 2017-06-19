import { ELEMENT_STATE_TYPES } from '../../constants/ActionTypes';
const { ELEMENT_DATA, ELEMENT_REFRESH, ELEMENT_CONFIG } = ELEMENT_STATE_TYPES;
import { reqNoReactEHtml } from '../../apis/noreact';
import Immutable from 'immutable';
import ecLocalStorage from '../../util/ecLocalStorage';
const initNoReactConfig = (config) => {
    return (dispatch, getState) => {
        const { params, item } = config;
        const { eid } = params;
        const iconfig = getState().elements.get("config");
        const { url } = item.contentview;
        dispatch({
            type: ELEMENT_CONFIG,
            config: getImmutableData(eid, config, iconfig)
        });
        dispatch(getNoReactDatas(eid, url));
    }
}
const getNoReactDatas = (eid, url) => {
    return (dispatch, getState) => {
        reqNoReactEHtml(url).then((data) => {
            let iolddata = getState().elements.get("data");
            let idata = Immutable.fromJS(data);
            dispatch(handleImmutableData(eid, false, data));
            jQuery("#no_react_element_"+eid).html(data);
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
        const { eid, url } = params;

        const irefresh = getState().elements.get("refresh");
        dispatch({
            type: ELEMENT_REFRESH,
            refresh: getImmutableData(eid, true, irefresh)
        });
        dispatch(getNoReactDatas(eid, url));
    }
}

module.exports = {
    initNoReactConfig,
    getNoReactDatas,
    handleRefresh
};
