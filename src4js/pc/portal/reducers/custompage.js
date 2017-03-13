import { INIT_CUSTOMPAGE_VISIBLE } from '../constants/ActionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
    loaded: {}
});
export default function custompage(state = initialState, action) {
    switch (action.type) {
        case INIT_CUSTOMPAGE_VISIBLE:
            return state.merge({
                loaded: action.loaded
            })
        default:
            return state
    }
}
