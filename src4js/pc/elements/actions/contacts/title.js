import { CONTACTS_STATE_TYPES } from '../../constants/ActionTypes';
const { CHANGE_CONTACTS_TABID } = CONTACTS_STATE_TYPES;
import Immutable from 'immutable';
import { handleChangeTab } from './tab';
const initTitleData = (eid, tabid) =>{
    return (dispatch, getState) => {
        const itabid = getState().econtactstitle.get("tabid");
        dispatch({
            type: CHANGE_CONTACTS_TABID,
            tabid: getImmutableData(eid, tabid, itabid)
        });
    }
}
const onChangeTab = (tabid, params) => {
    return (dispatch, getState) => {
    	const { eid } = params;
    	const itabid = getState().econtactstitle.get("tabid");
        dispatch({
            type: CHANGE_CONTACTS_TABID,
            tabid: getImmutableData(eid, tabid, itabid)
        });
        dispatch(handleChangeTab(params,tabid));
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
