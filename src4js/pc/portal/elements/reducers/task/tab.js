import { TASK_STATE_TYPES } from '../../constants/ActionTypes';
const { TASK_TAB_DATA, TASK_TAB_REFRESH, TASK_TAB_TABID } = TASK_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    refresh:{},
    tabid: {}
});
export default function ersstab(state = initialState, action) {
    switch (action.type) {
        case TASK_TAB_DATA:
            return state.merge({
                data: action.data,
                refresh: action.refresh,
                tabid: action.tabid
            })
        case TASK_TAB_TABID:
            return state.merge({
                tabid: action.tabid
            })
        case TASK_TAB_REFRESH:
            return state.merge({
                tabid: action.tabid,
                refresh: action.refresh
            })
        default:
            return state
    }
}