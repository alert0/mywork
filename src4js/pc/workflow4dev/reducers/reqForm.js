import * as types from '../constants/ActionTypes'
import objectAssign from 'object-assign'

import Immutable from 'immutable'

/**
 * 表单内容相关单独reducer
 */
const initialState = Immutable.fromJS({
    layout:{},
    conf:{},
    mainData:{},
    detailData:{},
    fieldVariable:{}
});

export default function reqForm(state = initialState, action) {
    switch (action.type) {
        case types.REQFORM_INIT_INFO:
            return state.merge({layout:action.layout, conf:action.conf, mainData:action.mainData});
        case types.REQFORM_SET_DETAILVALUE:
            return state.merge({detailData:action.detailData});
        case types.REQFORM_CHANGE_MAIN_VALUE:
            return function(){
                let changeData = Immutable.Map({}).set("mainData", Immutable.fromJS(action.fieldsValue));
                //console.log("changeMainData--",changeData.toJS());
                return state.mergeDeep(changeData);
            }();
        case types.REQFORM_CHANGE_DETAIL_VALUE:
            return function(){
                let changeData = Immutable.Map({}).setIn(["detailData",action.detailMark,`row_${action.rowIndex}`], Immutable.fromJS(action.fieldsValue));
                //console.log("changeDetailData--",changeData.toJS());
                return state.mergeDeep(changeData);
            }();
        case types.REQFORM_SET_FIELD_VARIABLE:
            return state.setIn(["fieldVariable", action.fieldid, action.symbol], action.value);
        case types.REQFORM_CLEAR_FIELD_VARIABLE:
            return state.deleteIn(["fieldVariable", action.fieldid, action.symbol]);
        case types.REQFORM_CLEAR_INFO:
            return initialState;
        default:
            return state;
    }
}