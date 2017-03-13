import {
    GET_E_TAB_DATA,
    INIT_E_CURR_TAB
} from '../../constants/ActionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
    tabdata: {},
    currtab: {},
    ifClickCurrTab: {}
});
export default function econtent(state = initialState, action) {
    switch (action.type) {
        case GET_E_TAB_DATA:
            return state.merge({
                tabdata: action.tabdata,
                currtab: action.currtab,
                ifClickCurrTab: action.ifClickCurrTab
            })
        default:
            return state
    }
}