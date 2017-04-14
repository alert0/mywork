import * as types from '../constants/ActionTypes'
import objectAssign from 'object-assign'

import Immutable from 'immutable'

/**
 * 表单内容相关单独reducer
 */
const initialState = Immutable.fromJS({
    layout:{hasInit:false},
    conf:{hasChange:false},
    mainData:{},
    detailData:{},
    fieldVariable:{}
});

export default function reqForm(state = initialState, action) {
    switch (action.type) {
        case types.REQFORM_INIT_INFO:
            return state.merge({
                    layout:action.layout, 
                    conf:{cellInfo:action.cellInfo, tableInfo:action.tableInfo, linkageCfg:action.linkageCfg, hasChange:true},
                    mainData:action.mainData
            });
        case types.REQFORM_SET_DETAILVALUE:
            return state.merge({detailData:action.detailData});
        case types.REQFORM_CLEAR_INFO:
            return initialState;
        default:
            return state;
    }
}