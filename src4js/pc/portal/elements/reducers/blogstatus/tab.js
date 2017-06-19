import { BLOGSTATUS_STATE_TYPES } from '../../constants/ActionTypes';
const { BLOGSTATUS_TAB_DATA, BLOGSTATUS_TAB_TABID } = BLOGSTATUS_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    tabid: {}
});
export default function emailtab(state = initialState, action) {
    switch (action.type) {
        case BLOGSTATUS_TAB_DATA:
            return state.merge({
                data: action.data,
                tabid: action.tabid
            })
        case BLOGSTATUS_TAB_TABID:
            return state.merge({
                tabid: action.tabid
            })
        default:
            return state
    }
}