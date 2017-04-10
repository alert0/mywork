import { REPORTFORM_STATE_TYPES } from '../../constants/ActionTypes';
const { REPORTFORM_TAB_DATA, REPORTFORM_TAB_REFRESH, REPORTFORM_TAB_TABID } = REPORTFORM_STATE_TYPES;
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    refresh:{},
    tabid: {}
});
export default function ereportformtab(state = initialState, action) {
    switch (action.type) {
        case REPORTFORM_TAB_DATA:
            return state.merge({
                data: action.data,
                refresh: action.refresh,
                tabid: action.tabid
            })
        case REPORTFORM_TAB_TABID:
            return state.merge({
                tabid: action.tabid
            })
        case REPORTFORM_TAB_REFRESH:
            return state.merge({
                tabid: action.tabid,
                refresh: action.refresh
            })
        default:
            return state
    }
}