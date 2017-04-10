import { ADDWF_STATE_TYPES } from '../../constants/ActionTypes';
const { ADDWF_TAB_DATA, ADDWF_TAB_REFRESH, ADDWF_TAB_TABID } = ADDWF_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    refresh:{},
    tabid: {}
});
export default function ersstab(state = initialState, action) {
    switch (action.type) {
        case ADDWF_TAB_DATA:
            return state.merge({
                data: action.data,
                refresh: action.refresh,
                tabid: action.tabid
            })
        case ADDWF_TAB_TABID:
            return state.merge({
                tabid: action.tabid
            })
        case ADDWF_TAB_REFRESH:
            return state.merge({
                tabid: action.tabid,
                refresh: action.refresh
            })
        default:
            return state
    }
}