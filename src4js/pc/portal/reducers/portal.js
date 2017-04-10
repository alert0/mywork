import { PORTAL_HPDATA } from '../constants/ActionTypes';
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    hpdata: {}
});
export default function portal(state = initialState, action) {
    switch (action.type) {
        case PORTAL_HPDATA:
            return state.merge({
                hpdata: action.hpdata
            })
        default:
            return state
    }
}