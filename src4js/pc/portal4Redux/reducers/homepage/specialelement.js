import {
    INIT_SPECIAL_E_DATA
} from '../../constants/ActionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
    list: {},
    currenttab: {},
});
export default function specialelement(state = initialState, action) {
    switch (action.type) {
        case INIT_SPECIAL_E_DATA:
            return state.merge({
                list: action.list,
                currenttab: action.currenttab
            })
        default:
            return state
    }
}