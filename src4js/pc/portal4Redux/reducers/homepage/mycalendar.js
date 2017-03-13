import {
    GET_MYCALENDAR_DATA
} from '../../constants/ActionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
    caldata: {}
});
export default function mycalendar(state = initialState, action) {
    switch (action.type) {
        case GET_MYCALENDAR_DATA:
            return state.merge({
                caldata: action.caldata
            })
        default:
            return state
    }
}