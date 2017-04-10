import { MAIL_STATE_TYPES } from '../../constants/ActionTypes';
const { MAIL_TAB_DATA, MAIL_TAB_TABID } = MAIL_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    tabid: {}
});
export default function emailtab(state = initialState, action) {
    switch (action.type) {
        case MAIL_TAB_DATA:
            return state.merge({
                data: action.data,
                tabid: action.tabid
            })
        case MAIL_TAB_TABID:
            return state.merge({
                tabid: action.tabid
            })
        default:
            return state
    }
}