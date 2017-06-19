import { ELEMENT_STATE_TYPES } from '../../constants/ActionTypes';
const { ELEMENT_DATA, ELEMENT_REFRESH, ELEMENT_CONFIG } = ELEMENT_STATE_TYPES;
import { reqCustomPageDatas } from '../../apis/custompage';
import Immutable from 'immutable';
import { initCustomPageTabDatas } from './tab';
import { initTitleData } from './title';
import { setFrameData, setLoadingVisible } from './iframe';
const initCustomPageConfig = (config) => {
    return (dispatch, getState) => {
        const { params } = config;
        const { eid } = params;
        const iconfig = getState().elements.get("config");
        dispatch({
            type: ELEMENT_CONFIG,
            config: getImmutableData(eid, config, iconfig)
        });
        dispatch(getCustomPageDatas(params));
    }
}
const getCustomPageDatas = (params,refresh) => {
    return (dispatch, getState) => {
        const { eid } = params;
        reqCustomPageDatas(params).then((data) => {
            let iolddata = getState().elements.get("data");
            let idata = Immutable.fromJS(data);
            dispatch(handleImmutableData(eid, false, data));
            if(!window.global_isremembertab){
               dispatch(initTitleData(eid,data.currenttab));
               dispatch(initCustomPageTabDatas(eid, data.currenttab, data.data));
            }
            if(refresh){
                dispatch(setLoadingVisible(false, eid, data.currenttab));
                var obj = {
                    eid,
                    data:data.data || {},
                    tabid:data.currenttab
                }
                dispatch(setFrameData(obj));
            }
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
        dispatch(getCustomPageDatas(params,true));
    }
}
module.exports = {
    initCustomPageConfig,
    getCustomPageDatas,
    handleRefresh
};
