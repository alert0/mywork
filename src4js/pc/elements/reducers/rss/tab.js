import { RSS_STATE_TYPES } from '../../constants/ActionTypes';
const { RSS_TAB_DATA, RSS_TAB_REFRESH, RSS_TAB_TABID } = RSS_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    refresh:{},
    tabid: {}
});
export default function ersstab(state = initialState, action) {
    switch (action.type) {
        case RSS_TAB_DATA:
            return state.merge({
                data: action.data,
                refresh: action.refresh,
                tabid: action.tabid
            })
        case RSS_TAB_TABID:
            return state.merge({
                tabid: action.tabid
            })
        case RSS_TAB_REFRESH:
            return state.merge({
                tabid: action.tabid,
                refresh: action.refresh
            })
        default:
            return state
    }
}