import { INIT_SCRATCHPAD_TEXT } from '../constants/ActionTypes';
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    text: ''
});
export default function scratchpad(state = initialState, action) {
    switch (action.type) {
        case INIT_SCRATCHPAD_TEXT:
            return state.merge({
                text: action.text,
            })
        default:
            return state
    }
}