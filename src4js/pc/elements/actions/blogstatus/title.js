import { BLOGSTATUS_STATE_TYPES } from '../../constants/ActionTypes';
const { CHANGE_BLOGSTATUS_TABID } = BLOGSTATUS_STATE_TYPES;
import Immutable from 'immutable';
import { handleChangeTab } from './tab';
const initTitleData = (eid, tabid) =>{
    return (dispatch, getState) => {
        const itabid = getState().eblogstatustitle.get("tabid");
        dispatch({
            type: CHANGE_BLOGSTATUS_TABID,
            tabid: getImmutableData(eid, tabid, itabid)
        });
    }
}
const onChangeTab = (eid, tabid) => {
    return (dispatch, getState) => {
    	const itabid = getState().eblogstatustitle.get("tabid");
        dispatch({
            type: CHANGE_BLOGSTATUS_TABID,
            tabid: getImmutableData(eid, tabid, itabid)
        });
        dispatch(handleChangeTab(eid,tabid));
    }
}

const getImmutableData = (eid, old, im) => {
    var ndata = {};
    ndata[eid] = old;
    var nresult = im.merge(Immutable.fromJS(ndata));
    return nresult;
}

module.exports = {
    initTitleData,
    onChangeTab
};
