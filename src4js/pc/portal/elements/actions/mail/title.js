import { MAIL_STATE_TYPES } from '../../constants/ActionTypes';
const { CHANGE_MAIL_TABID } = MAIL_STATE_TYPES;
import Immutable from 'immutable';
import { handleChangeTab } from './tab';
const initTitleData = (eid, tabid) =>{
    return (dispatch, getState) => {
        const itabid = getState().emailtitle.get("tabid");
        dispatch({
            type: CHANGE_MAIL_TABID,
            tabid: getImmutableData(eid, tabid, itabid)
        });
    }
}
const onChangeTab = (eid, tabid) => {
    return (dispatch, getState) => {
    	const itabid = getState().emailtitle.get("tabid");
        dispatch({
            type: CHANGE_MAIL_TABID,
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
