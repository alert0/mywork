import { CUSTOMPAGE_STATE_TYPES } from '../../constants/ActionTypes';
const { CHANGE_CUSTOMPAGE_TABID } = CUSTOMPAGE_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    tabid:{}
});
export default function ecustompagetitle(state = initialState, action) {
    switch (action.type) {
        case CHANGE_CUSTOMPAGE_TABID:
            return state.merge({
                tabid: action.tabid
            })
        default:
            return state
    }
}
