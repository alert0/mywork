import {PORTAL_BE_LIST_FILTER } from '../constants/ActionTypes';
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    value: ''
});
export default function belist(state = initialState, action) {
    switch (action.type) {
        case PORTAL_BE_LIST_FILTER:
            return state.merge({
                value: action.value
            })
        default:
            return state
    }
}