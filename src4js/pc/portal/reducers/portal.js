import { PORTAL_HPDATA, PORTAL_PARAMS } from '../constants/ActionTypes';
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    hpdata: {},
    params:{}
});
export default function portal(state = initialState, action) {
    switch (action.type) {
        case PORTAL_HPDATA:
            return state.merge({
                hpdata: action.hpdata
            })
        case PORTAL_PARAMS:
            return state.merge({
                params: action.params
            })
        default:
            return state
    }
}