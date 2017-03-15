import { INIT_E_DATA,INIT_E_ElECONF } from '../constants/ActionTypes';
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    edata: {},
    isEReFresh: {},
    eleconf:{}
});
export default function element(state = initialState, action) {
    switch (action.type) {
        case INIT_E_DATA:
            return state.merge({
                edata: action.edata,
                isEReFresh: action.isEReFresh
            })
        case INIT_E_ElECONF:
            return state.merge({
                eleconf: action.eleconf
            })
        default:
            return state
    }
}