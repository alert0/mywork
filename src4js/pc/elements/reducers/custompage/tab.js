import { CUSTOMPAGE_STATE_TYPES } from '../../constants/ActionTypes';
const { CUSTOMPAGE_TAB_DATA, CUSTOMPAGE_TAB_REFRESH, CUSTOMPAGE_TAB_TABID } = CUSTOMPAGE_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    refresh:{},
    tabid: {}
});
export default function ecustompagetab(state = initialState, action) {
    switch (action.type) {
        case CUSTOMPAGE_TAB_DATA:
            return state.merge({
                data: action.data,
                refresh: action.refresh,
                tabid: action.tabid
            })
        case CUSTOMPAGE_TAB_TABID:
            return state.merge({
                tabid: action.tabid
            })
        case CUSTOMPAGE_TAB_REFRESH:
            return state.merge({
                tabid: action.tabid,
                refresh: action.refresh
            })
        default:
            return state
    }
}