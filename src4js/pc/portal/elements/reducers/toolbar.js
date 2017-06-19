import { ELEMENT_TOOLBAR } from '../constants/ActionTypes';
const { ELEMENT_TOOLBAR_ISLOCK } = ELEMENT_TOOLBAR;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    islock: {},
    icon: {}
});
export default function toolbar(state = initialState, action) {
    switch (action.type) {
        case ELEMENT_TOOLBAR_ISLOCK:
            return state.merge({
                islock: action.islock,
                icon: action.icon
            })
        default:
            return state
    }
}