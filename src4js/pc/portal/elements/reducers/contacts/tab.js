import { CONTACTS_STATE_TYPES } from '../../constants/ActionTypes';
const { CONTACTS_TAB_DATA, CONTACTS_TAB_REFRESH, CONTACTS_TAB_TABID } = CONTACTS_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    refresh:{},
    tabid: {}
});
export default function ersstab(state = initialState, action) {
    switch (action.type) {
        case CONTACTS_TAB_DATA:
            return state.merge({
                data: action.data,
                refresh: action.refresh,
                tabid: action.tabid
            })
        case CONTACTS_TAB_TABID:
            return state.merge({
                tabid: action.tabid
            })
        case CONTACTS_TAB_REFRESH:
            return state.merge({
                tabid: action.tabid,
                refresh: action.refresh
            })
        default:
            return state
    }
}