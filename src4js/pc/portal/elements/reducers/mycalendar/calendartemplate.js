import { MYCALENDAR_STATE_TYPES } from '../../constants/ActionTypes';
const { MYCALENDAR_DATA}  = MYCALENDAR_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {}
});
export default function calendartemplate(state = initialState, action) {
    switch (action.type) {
        case MYCALENDAR_DATA:
            return state.merge({
                data: action.data
            })
        default:
            return state
    }
}