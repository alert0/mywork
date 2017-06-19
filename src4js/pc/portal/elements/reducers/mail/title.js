import { MAIL_STATE_TYPES } from '../../constants/ActionTypes';
const { CHANGE_MAIL_TABID } = MAIL_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    tabid:{}
});
export default function emailtitle(state = initialState, action) {
    switch (action.type) {
        case CHANGE_MAIL_TABID:
            return state.merge({
                tabid: action.tabid
            })
        default:
            return state
    }
}
