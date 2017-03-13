import {
    CHANGE_E_TABID
} from '../../constants/ActionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
    currtab: '',
});
export default function titlecontainer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_E_TABID:
            return state.merge({
                currtab: action.currtab
            })
        default:
            return state
    }
}