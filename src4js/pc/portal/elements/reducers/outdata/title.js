import { OUTDATA_STATE_TYPES } from '../../constants/ActionTypes';
const { CHANGE_OUTDATA_TABID } = OUTDATA_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    tabid:{}
});
export default function eoutdatatitle(state = initialState, action) {
    switch (action.type) {
        case CHANGE_OUTDATA_TABID:
            return state.merge({
                tabid: action.tabid
            })
        default:
            return state
    }
}
