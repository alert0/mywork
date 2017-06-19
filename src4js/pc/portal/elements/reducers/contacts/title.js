import { CONTACTS_STATE_TYPES } from '../../constants/ActionTypes';
const { CHANGE_CONTACTS_TABID } = CONTACTS_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    tabid:{}
});
export default function ersstitle(state = initialState, action) {
    switch (action.type) {
        case CHANGE_CONTACTS_TABID:
            return state.merge({
                tabid: action.tabid
            })
        default:
            return state
    }
}
