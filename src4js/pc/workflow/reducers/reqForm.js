import * as types from '../constants/ActionTypes'
import objectAssign from 'object-assign'

import Immutable from 'immutable'

/**
 * 表单内容相关单独reducer
 */
const initialState = Immutable.fromJS({
    formLayout:{},
    tableInfo:{},
    cellInfo:{},
    linkageCfg:{},
    formValue:{},
    formValue4Detail:{},
});

export default function reqForm(state = initialState, action) {
    switch (action.type) {
        case types.REQFORM_INIT_INFO:
            return state.merge({formLayout:action.formLayout,formValue:action.formValue,cellInfo:action.cellInfo,tableInfo:action.tableInfo,linkageCfg:action.linkageCfg});
        case types.REQFORM_SET_DETAILVALUE:
            return state.merge({formValue4Detail:action.formValue4Detail});
        case types.REQFORM_CLEAR_INFO:
            return state.merge({formValue:{},formLayout:{},formValue4Detail:{}});
        default:
            return state;
    }
}