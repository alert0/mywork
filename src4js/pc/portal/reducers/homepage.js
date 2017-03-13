import { INIT_HP_DATA } from '../constants/ActionTypes';
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    hpdata: {}
});
export default function homepage(state = initialState, action) {
    switch (action.type) {
        case INIT_HP_DATA:
            return state.merge({
                hpdata: action.hpdata
            })
        default:
            return state
    }
}