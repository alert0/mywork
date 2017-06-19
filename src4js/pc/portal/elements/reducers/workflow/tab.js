import { WORKFLOW_STATE_TYPES } from '../../constants/ActionTypes';
const { WORKFLOW_TAB_DATA, WORKFLOW_TAB_REFRESH, WORKFLOW_TAB_TABID } = WORKFLOW_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    refresh:{},
    tabid: {}
});
export default function eworkflowtab(state = initialState, action) {
    switch (action.type) {
        case WORKFLOW_TAB_DATA:
            return state.merge({
                data: action.data,
                refresh: action.refresh,
                tabid: action.tabid
            })
        case WORKFLOW_TAB_TABID:
            return state.merge({
                tabid: action.tabid
            })
        case WORKFLOW_TAB_REFRESH:
            return state.merge({
                tabid: action.tabid,
                refresh: action.refresh
            })
        default:
            return state
    }
}