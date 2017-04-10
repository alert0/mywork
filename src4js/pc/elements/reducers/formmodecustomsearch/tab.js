import { FORMMODECUSTOMSEARCH_STATE_TYPES } from '../../constants/ActionTypes';
const { FORMMODECUSTOMSEARCH_TAB_DATA, FORMMODECUSTOMSEARCH_TAB_REFRESH, FORMMODECUSTOMSEARCH_TAB_TABID } = FORMMODECUSTOMSEARCH_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    refresh:{},
    tabid: {}
});
export default function eformmodecustomsearchtab(state = initialState, action) {
    switch (action.type) {
        case FORMMODECUSTOMSEARCH_TAB_DATA:
            return state.merge({
                data: action.data,
                refresh: action.refresh,
                tabid: action.tabid
            })
        case FORMMODECUSTOMSEARCH_TAB_TABID:
            return state.merge({
                tabid: action.tabid
            })
        case FORMMODECUSTOMSEARCH_TAB_REFRESH:
            return state.merge({
                tabid: action.tabid,
                refresh: action.refresh
            })
        default:
            return state
    }
}