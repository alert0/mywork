import { INIT_SPECIAL_E_DATA } from '../constants/ActionTypes';
import Immutable from 'immutable';
import ecLocalStorage from '../util/ecLocalStorage.js'
const handleChangeSETab = (eid, tabid, data) => {
    return (dispatch, getState) => {
        dispatch(handleImmutableData(eid, tabid, data.data[tabid]));
    }
}
const initSEDatas = (eid, currenttab, data) => {
    return (dispatch, getState) => {
        let initcurrenttab = ecLocalStorage.getStr("currenttab", "tabid-" + eid, true);
        if (initcurrenttab) currenttab = initcurrenttab;
        dispatch(handleImmutableData(eid, currenttab, data[currenttab]));
    }
}


const getImmutableData = (eid, old, im) => {
    var ndata = {};
    ndata[eid] = old;
    var nresult = im.merge(Immutable.fromJS(ndata));
    return nresult;
}

const handleImmutableData = (eid, currenttab, list) => {
    return (dispatch, getState) => {
        const icurrenttab = getState().specialelement.get("currenttab");
        const ilist = getState().specialelement.get("list");
        dispatch({
            type: INIT_SPECIAL_E_DATA,
            currenttab: getImmutableData(eid, currenttab, icurrenttab),
            list: getImmutableData(eid, list, ilist)
        });
    }
}

module.exports = {
    handleChangeSETab,
    initSEDatas
};
