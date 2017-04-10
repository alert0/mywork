import { CUSTOMPAGE_STATE_TYPES } from '../../constants/ActionTypes';
const { CUSTOMPAGE_IFRAME_REFRESH } = CUSTOMPAGE_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    loaded: {}
});
export default function ecustompageiframe(state = initialState, action) {
    switch (action.type) {
        case CUSTOMPAGE_IFRAME_REFRESH:
            return state.merge({
                loaded: action.loaded
            })
        default:
            return state
    }
}
