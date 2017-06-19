import * as types from '../constants/ActionTypes'
import {getBelTableMark,formatDatasBeforeChangeRedux} from '../util/formUtil'
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
    variableArea:{}
});

export default function reqForm(state = initialState, action) {
    switch (action.type) {
        case types.REQFORM_INIT_INFO:
            return state.merge({layout:action.layout, conf:action.conf, mainData:action.mainData});
        case types.REQFORM_SET_DETAILVALUE:
            return state.merge({detailData:action.detailData});
        case types.REQFORM_SET_DETAIL_ROW_CHECKED:
            return state.updateIn(["detailData", action.detailMark, "rowDatas", `row_${action.rowIndex}`], val=>{
                return val.set("checked", action.isChecked);
            });
        case types.REQFORM_SET_DETAIL_ALLROW_CHECKED:
            return function(){
                const forbidCheckedExistRow = state.getIn(["conf","tableInfo",action.detailMark,"detailtableattr","isdelete"]) !== 1;
                state = state.updateIn(["detailData", action.detailMark, "rowDatas"], val=>{
                    return val.map(rowData=>{
                        let checked = action.isChecked;
                        if(forbidCheckedExistRow && parseInt(rowData.get("keyid")||0) > 0)  //已有明细禁止选中删除
                            checked = false;
                        return rowData.set("checked", checked);
                    });
                });
                return state;
            }();
        case types.REQFORM_ADD_DETAIL_ROW:
            return state.updateIn(["detailData", action.detailMark], val=>{
                return val.mergeDeep(action.datas);
            });
        case types.REQFORM_DEL_DETAIL_ROW:
            return function(){
                const delArr = [];
                let delRowKeys = "";
                state = state.updateIn(["detailData", action.detailMark, "rowDatas"], val=>{
                    val && val.map((rowData,key)=>{
                        if(rowData.get("checked")){     //选中状态
                            val = val.delete(key);
                            const rowid = key.substring(4);
                            delArr.push(rowid);
                            if(rowData.has("keyid") && parseInt(rowData.get("keyid")) > 0)  //已有数据行
                                delRowKeys += ","+rowData.get("keyid");
                        }
                    });
                    return val;
                });
                if(delRowKeys !== "")    delRowKeys = delRowKeys.substring(1);
                state = state.updateIn(["detailData", action.detailMark, "deldtlid"], val=>{
                    return !val ? delRowKeys : `${val},${delRowKeys}`;
                });
                //必须要清除掉已删除行变量信息
                delArr.map(rowIndex =>{
                    state.getIn(["conf", "tableInfo", action.detailMark, "fieldinfomap"]).map((v,fieldid) =>{
                        state = state.deleteIn(["variableArea", `field${fieldid}_${rowIndex}`]);
                    });
                });
                return state;
            }();
        /************************* 字段值变更 begin(修改时覆盖字段值所有属性，而不仅修改value属性)(数值类型修改Redux前统一做格式化)****************/
        case types.REQFORM_CHANGE_MORE_FIELD_DATA:
            return function(){
                const changeDatas = action.changeDatas || {};
                const changeVariable = action.changeVariable || {};
                //修改字段值
                const changeValues = {};
                for(const key in changeDatas){
                    const isDetail = key.indexOf("_") > -1;
                    const fieldid = isDetail ? key.substring(5, key.indexOf("_")) : key.substring(5);
                    const rowIndex = isDetail ? key.substring(key.indexOf("_")+1) : "-1";
                    const tableMark =  isDetail ? getBelTableMark(state, fieldid) : "main";
                    const keyNew = `${tableMark}|${rowIndex}`;
                    changeValues[keyNew] = objectAssign(changeValues[keyNew]||{}, {[`field${fieldid}`]:changeDatas[key]});
                }
                for(const key in changeValues){
                    const tableMark = key.split("|")[0];
                    let datas = changeValues[key];
                    datas = formatDatasBeforeChangeRedux(state, datas, tableMark);      //数值格式化
                    if(tableMark === "main"){
                        state = state.update("mainData", val=>{
                            const valNew = val.filterNot((v,k) => k in datas);
                            return valNew.mergeDeep(datas);
                        });
                    }else if(tableMark.indexOf("detail_") > -1){
                        const rowIndex = key.split("|")[1];
                        state = state.updateIn(["detailData", tableMark, "rowDatas", `row_${rowIndex}`], val=>{
                            let valNew = val && val.filterNot((v,k) => k in datas);
                            if(!valNew)
                                valNew = Immutable.Map({});
                            return valNew.mergeDeep(datas);
                        });
                    }
                }
                //修改字段变量
                if(!jQuery.isEmptyObject(changeVariable)){
                    state = state.update("variableArea", val=>{
                        for(const key in changeVariable){
                            if(key.indexOf("field") > -1){
                                const fieldVar = changeVariable[key] || {};
                                if("optionRange" in fieldVar)       //选项范围需先清空再覆盖
                                    val = val.deleteIn([key, "optionRange"]);
                            }
                        }
                        return val.mergeDeep(changeVariable);
                    });
                }
                return state;
            }();
        /************************* 字段值变更 end ****************/
        case types.REQFORM_CONTROL_VARIABLE_AREA:
            return state.update("variableArea", val =>{
                for(let key in action.changeInfo){
                    val = val.set(key, action.changeInfo[key]);     //覆盖值而不是merge
                }
                return val;
            });
        case types.REQFORM_CLEAR_INFO:
            return initialState;
        default:
            return state;
    }
}