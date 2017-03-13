import {
    INIT_E_DATA
} from '../../constants/ActionTypes';
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    edata: {},
    isEReFresh: {}
});
export default function element(state = initialState, action) {
    switch (action.type) {
        case INIT_E_DATA:
            return state.merge({
                edata: action.edata,
                isEReFresh: action.isEReFresh
            })
        default:
            return state
    }
}