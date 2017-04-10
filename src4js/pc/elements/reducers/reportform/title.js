import { REPORTFORM_STATE_TYPES } from '../../constants/ActionTypes';
const { CHANGE_REPORTFORM_TABID } = REPORTFORM_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    tabid:{}
});
export default function ereportformtitle(state = initialState, action) {
    switch (action.type) {
        case CHANGE_REPORTFORM_TABID:
            return state.merge({
                tabid: action.tabid
            })
        default:
            return state
    }
}
