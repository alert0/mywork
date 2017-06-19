import { NEWS_STATE_TYPES } from '../../constants/ActionTypes';
const { CHANGE_NEWS_TABID } = NEWS_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    tabid:{}
});
export default function ersstitle(state = initialState, action) {
    switch (action.type) {
        case CHANGE_NEWS_TABID:
            return state.merge({
                tabid: action.tabid
            })
        default:
            return state
    }
}
