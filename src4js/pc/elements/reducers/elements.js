import { ELEMENT_STATE_TYPES } from '../constants/ActionTypes';
const { ELEMENT_DATA, ELEMENT_REFRESH, ELEMENT_CONFIG } = ELEMENT_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    refresh: {},
    config:{}
});
export default function elements(state = initialState, action) {
    switch (action.type) {
        case ELEMENT_DATA:
            return state.merge({
                data: action.data,
                refresh: action.refresh
            })
        case ELEMENT_CONFIG:
            return state.merge({
                config: action.config
            })
        case ELEMENT_REFRESH:
            return state.merge({
                refresh: action.refresh
            })
        default:
            return state
    }
}