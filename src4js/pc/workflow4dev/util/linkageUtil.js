import Immutable from 'immutable'
import * as formUtil from '../util/formUtil'
import * as formulaUtil from '../util/formulaUtil'

export const calDetailRowRule = (formState, triType, tableMark, triFieldid, rowIndex) =>{
    const triInfo = {};
    const rowCalCfg = formState.getIn(["conf", "linkageCfg", "rowCalCfg"]);
    if(triType === 1){
        rowCalCfg.has(triFieldid) && rowCalCfg.get(triFieldid).map(cfg =>{
            triInfo[cfg.get("assignField")] = {expression:cfg.get("config"), tableMark:tableMark, rowIndexStr:rowIndex};
        });
    }else if(triType === 2){
        rowCalCfg && rowCalCfg.map((v,k) =>{
            v && v.map(cfg =>{
                const assignField = cfg.get("assignField");
                if(assignField in triInfo)
                    return true;    //不需要重复添加
                const detailMark = formUtil.getBelTableMark(formState, assignField);
                const rowIndexStr = formUtil.getDetailAllRowIndexStr(formState, detailMark);
                triInfo[assignField] = {expression:cfg.get("config"), tableMark:detailMark, rowIndexStr:rowIndexStr};
            });
        });
    }else if(triType === 3){
        rowCalCfg && rowCalCfg.map((v,k) =>{
            v && v.map(cfg =>{
                const assignField = cfg.get("assignField");
                const detailMark = formUtil.getBelTableMark(formState, assignField);
                if(assignField in triInfo || tableMark !== detailMark)
                    return true;    //不需要重复添加，只触发当前明细涉及的行规则
                triInfo[assignField] = {expression:cfg.get("config"), tableMark:tableMark, rowIndexStr:rowIndex};
            });
        });
    }
    if(jQuery.isEmptyObject(triInfo))   return;
    const changeDatas = {};
    for(const key in triInfo){     //循环配置
        const tableMark = triInfo[key].tableMark;
        const expression = triInfo[key].expression;
        if(formUtil.judgeFieldUnExistTemplate(formState, tableMark, key))   //赋值字段不在模板不计算行规则
            continue;
        let needCal = true;
        expression.match(/detailfield_\d+/g).map(fieldstr =>{
            if(formUtil.judgeFieldUnExistTemplate(formState, tableMark, fieldstr.substring(12)))      //任一取值字段不在模板的不计算行规则
                needCal = false;
        });
        const rowIndexStr = triInfo[key].rowIndexStr.toString();
        needCal && !!rowIndexStr && rowIndexStr.split(",").map(rowIndex =>{    //循环行
            let curExpression = expression;
            const reg = new RegExp("detailfield_\\d+", "g");
            curExpression.match(reg).map(fieldstr =>{
                let fieldval = formUtil.getNumFieldValue(formState, fieldstr.substring(12), rowIndex, tableMark);
                if(fieldval < 0)
                    fieldval = `(${fieldval})`;     //负数相减加括号
                const reg1 = new RegExp(fieldstr+"(?!\d)", "g");		//正向否定预查，后面跟的不是数字才匹配
                curExpression = curExpression.replace(reg1, fieldval);
            });
            const result = formUtil.calExpressionResult(curExpression);
            changeDatas[`field${key}_${rowIndex}`] = {value:result};
        });
    }
    return changeDatas;
}

export const calDetailColRule = (formState, triType, tableMark, triFieldid) =>{
    const triInfo = {};
    const colCalCfg = formState.getIn(["conf", "linkageCfg", "colCalCfg"]);
    const mainCalCfg = formState.getIn(["conf", "linkageCfg", "mainCalCfg"]); 
    if(triType === 1){
        const needSum = colCalCfg.has(triFieldid);
        const sumMainFieldid = mainCalCfg.get(triFieldid);
        if(needSum || !!sumMainFieldid){
            triInfo[triFieldid] = {tableMark, needSum, sumMainFieldid};
        }
    }else if(triType === 2 || triType === 3 || triType === 4){
        formState && formState.getIn(["conf", "tableInfo"]).map((v,k) =>{
            if(k.indexOf("detail_") === -1)
                return true;
            if(triType === 2 || ((triType === 3 || triType === 4) && k === tableMark)){
                v && v.get("fieldinfomap").map((fieldObj, fieldid)=>{
                    if(fieldObj.get("htmltype") === 1 && fieldObj.get("detailtype") !== 1){
                        const needSum = colCalCfg.has(fieldid);
                        const sumMainFieldid = mainCalCfg.get(fieldid);
                        triInfo[fieldid] = {tableMark:k, needSum, sumMainFieldid}
                    }
                });
            }
        });
    }
    if(jQuery.isEmptyObject(triInfo))   return;
    let changeDatas = {};
    let changeVariable = {};
    for(const fieldid in triInfo){
        const tableMark = triInfo[fieldid].tableMark;
        if(formUtil.judgeDetailUnExistTemplate(formState, tableMark))           //明细表不存在模板上不计算列规则
            continue;
        if(formUtil.judgeFieldUnExistTemplate(formState, tableMark, fieldid))   //字段不在模板不计算列规则
            continue;
        const needSum = triInfo[fieldid].needSum;
        const sumMainFieldid = triInfo[fieldid].sumMainFieldid;
        let sum = formUtil.getDetailFieldSumValue(formState, fieldid, tableMark);
        //合计
        if(needSum){
            const fieldInfoObj = formUtil.getFieldInfoObj(formState, fieldid, tableMark);
            const formatSumValue = formUtil.formatNumFieldValue(sum, fieldInfoObj);
            changeVariable[`sum${fieldid}`] = formatSumValue;
        }
        //合计赋值主字段
        if(!!sumMainFieldid){
            //if(sum === 0 && formState.getIn(["detailData", tableMark, "rowDatas"]).size === 0)   //明细不存在行时置空，提示必填用
            //    sum = "";
            changeDatas[`field${sumMainFieldid}`] = {value:sum};
        }
    }
    return {changeDatas, changeVariable};
}

export const calFieldMath = (formState, triType, triFieldid) =>{
    let triInfo = {};
    const fieldMathCfg = formState.getIn(["conf","linkageCfg","fieldMathCfg"]);
    if(triType === 1){
        fieldMathCfg.has(triFieldid) && fieldMathCfg.get(triFieldid).map(cfg =>{
            triInfo[cfg.get("assignField")] = {expression:cfg.get("config"), relateFields:cfg.get("relateFields")};
        });
    }else if(triType === 2){
        fieldMathCfg && fieldMathCfg.map(v =>{
            v && v.map(cfg =>{
                triInfo[cfg.get("assignField")] = {expression:cfg.get("config"), relateFields:cfg.get("relateFields")};
            });
        });
    }
    if(jQuery.isEmptyObject(triInfo))   return;

    const changeDatas = {};
    const changeVariable = {};
    for(const assignField in triInfo){
        let expression = triInfo[assignField].expression;
        const relateFields = triInfo[assignField].relateFields;
        relateFields && relateFields.map(fieldid =>{
            const fieldval = formUtil.getNumFieldValue(formState, fieldid, -1, "main");
            const reg = new RegExp("\\$"+fieldid+"\\$", "g");
            expression = expression.replace(reg, fieldval);
        });
        let result = formUtil.calExpressionResult(expression);
        changeDatas[`field${assignField}`] = {value:result};
    }
    return {changeDatas, changeVariable};
}

export const calFormula = (formState, triType, tableMark, triFieldid, rowIndex) =>{
    if(!formState.hasIn(["layout", "formula"]))
        return;
    const triInfo = [];
    if(triType === 1){
        const relateFormula = formState.getIn(["conf", "cellInfo", "fieldCellInfo", triFieldid, "relateFormula"]);
        relateFormula && relateFormula.map(formulaKey =>{
            const formula = formState.getIn(["layout", "formula", formulaKey]);
            if(!formula)    return true;
            //触发字段为主表，赋值字段为明细需计算明细所有行公式
            const triRowMark = (rowIndex === -1 && formula.get("destcell").indexOf("DETAIL_") > -1) ? "all" : rowIndex;
            triInfo.push({formulaKey, triRowMark});
        });
    }else if(triType === 2){
        const triCfg = formState.getIn(["conf", "pageLoadTriCfg", "formula_all"]);
        if(!triCfg)     return;
        formState.getIn(["layout", "formula"]).map((v,formulaKey) =>{
            const triRowMark = formulaKey.indexOf("DETAIL_") > -1 ? "all" : -1;
            triInfo.push({formulaKey, triRowMark});
        });
    }else if(triType === 3){    //新增明细触发
        formState.getIn(["layout", "formula"]).map((v,formulaKey) =>{
            if(formulaKey.indexOf(tableMark.toUpperCase()) > -1){
                triInfo.push({formulaKey, triRowMark:rowIndex});
            }else if(formulaKey.indexOf("DETAIL_") === -1 && v.get("formulatxt").indexOf(tableMark.toUpperCase()) > -1){    //当前明细字段参与公式计算同时赋值给主字段  
                triInfo.push({formulaKey, triRowMark:-1});
            }
        });
    }else if(triType === 4){    //删除明细触发
        formState.getIn(["layout", "formula"]).map((v,formulaKey) =>{
            if(formulaKey.indexOf("DETAIL_") === -1 && v.get("formulatxt").indexOf(tableMark.toUpperCase()) > -1){    //当前明细字段参与公式计算同时赋值给主字段  
                triInfo.push({formulaKey, triRowMark:-1});
            }
        });
    }
    if(triInfo.length === 0)   return;
    if(window.console)  console.log("triFormula", triInfo, "triType--", triType);
    //公式具体运算
    const changeDatas = formulaUtil.calculateFormula(formState, triInfo);
    return changeDatas;
}

export const controlSelectChange = (formState, triType, tableMark, triFieldid, rowIndex) =>{
    const triInfo = {};
    if(triType === 1){
        const triFieldObj = formUtil.getFieldInfoObj(formState, triFieldid, tableMark);
        if(!triFieldObj || triFieldObj.get("htmltype") !== 5)
            return;
        const childFieldid = triFieldObj.getIn(["selectattr", "childfieldid"]) || 0;
        if(childFieldid === 0)
            return;
        triInfo[triFieldid] = {triFieldObj:triFieldObj, tableMark:tableMark, rowIndexStr:rowIndex};
    }else if(triType === 2){
        formState && formState.getIn(["conf", "tableInfo"]).map((v,tableMark) =>{
            const rowIndexStr = tableMark === "main" ? -1 : formUtil.getDetailAllRowIndexStr(formState, tableMark);
            v && v.get("fieldinfomap").map((fieldObj,fieldid) =>{
                if(fieldObj.get("htmltype") !== 5)
                    return true;
                const childFieldid = fieldObj && fieldObj.getIn(["selectattr", "childfieldid"]) || 0;
                if(childFieldid === 0)
                    return true;
                triInfo[fieldid] = {triFieldObj:fieldObj, tableMark:tableMark, rowIndexStr:rowIndexStr};
            });
        });
    }else if(triType === 3){
        if(!tableMark || tableMark.indexOf("detail_") === -1)   return;
        formState && formState.getIn(["conf", "tableInfo", tableMark, "fieldinfomap"]).map((fieldObj,fieldid) =>{
            if(fieldObj.get("htmltype") !== 5)
                return true;
            const childFieldid = fieldObj && fieldObj.getIn(["selectattr", "childfieldid"]) || 0;
            if(childFieldid === 0)
                return true;
            triInfo[fieldid] = {triFieldObj:fieldObj, tableMark:tableMark, rowIndexStr:rowIndex};
        });
    }
    if(jQuery.isEmptyObject(triInfo))   return;
    if(window.console)  console.log("triSelectChanged", triInfo, "triType--", triType);

    const changeDatas = {};
    const changeVariable = {};
    for(const triFieldid in triInfo){
        const rowIndexStr = triInfo[triFieldid].rowIndexStr.toString();
        if(rowIndexStr === "")
            continue;
        const tableMark = triInfo[triFieldid].tableMark;
        const triFieldObj = triInfo[triFieldid].triFieldObj;
        const childFieldid = triFieldObj.getIn(["selectattr", "childfieldid"]);
        const childFieldObj = formUtil.getFieldInfoObj(formState, childFieldid, tableMark);
        const childFieldItemList = childFieldObj && childFieldObj.getIn(["selectattr", "selectitemlist"]);
        if(!childFieldItemList)
            continue;
        rowIndexStr.split(",").map(rowIndex =>{
            let childitemid = "";
            const triFieldValue = formUtil.getFieldValue(formState, triFieldid, rowIndex, tableMark);
            triFieldValue !== "" && triFieldObj.getIn(["selectattr", "selectitemlist"]).map(item =>{
                if(childitemid !== "")      return "";
                if(item.get("selectvalue") === parseInt(triFieldValue))
                    childitemid = item.get("childitemid");
            });
            const optionRange = Immutable.fromJS(childitemid.split(","));   //IE下可变数组不支持includes方法
            //计算联动子字段选中值，逻辑：有效值且在range范围内直接选中，无有效值则找range范围内的选择框默认值，无默认值则置空
            let childFieldValue = formUtil.getFieldValue(formState, childFieldid, rowIndex, tableMark).toString();     //联动前子字段选中的值
            if(!optionRange.includes(childFieldValue))
                childFieldValue = "";
            if(childFieldValue !== ""){    //判断选中的值是否有效(封存等)
                let isValid = false;
                childFieldItemList.map(item =>{
                    if(item.get("selectvalue").toString() === childFieldValue && item.get("cancel") !== 1)
                        isValid = true;
                });
                if(!isValid)
                    childFieldValue = "";
            }
            childFieldValue === "" && childFieldItemList.map(item =>{   //空值取range范围内选择框默认值
                if(childFieldValue !== "")      return "";
                const selectvalue = item.get("selectvalue").toString();
                if(item.get("isdefault") === 1 && optionRange.includes(selectvalue) && item.get("cancel") !== 1)
                    childFieldValue = selectvalue;
            });
            const fieldMark = tableMark.indexOf("detail_") > -1 ? `field${childFieldid}_${rowIndex}` : `field${childFieldid}`;
            changeDatas[fieldMark] = {value: childFieldValue};
            changeVariable[fieldMark] = {optionRange: optionRange};
        });
    }
    return {changeDatas, changeVariable};
}

export const controlViewAttr = (formState, triType, tableMark, triFieldid, rowIndex) =>{
    const viewAttrCfg = formState.getIn(["conf","linkageCfg","viewAttrCfg"]);
    const triInfo = {};
    if(triType === 1){
        const fieldMark = `${triFieldid}_${tableMark.indexOf("detail_")>-1 ? 1 : 0}`;
        if(viewAttrCfg && viewAttrCfg.has(fieldMark)){
            triInfo[triFieldid] = {cfg:viewAttrCfg.get(fieldMark), tableMark:tableMark, rowIndexStr:rowIndex};
        }
    }else if(triType === 2){
        viewAttrCfg && viewAttrCfg.map((v,k) =>{
            const fieldid = k.split("_")[0];
            const isdetail = k.split("_")[1] === "1";
            const tableMark = isdetail ? formUtil.getBelTableMark(formState, fieldid) : "main";
            const rowIndexStr = isdetail ? formUtil.getDetailAllRowIndexStr(formState, tableMark) : -1;
            triInfo[fieldid] = {cfg:v, tableMark:tableMark, rowIndexStr:rowIndexStr};
        });
    }else if(triType === 3){
        if(!tableMark || tableMark.indexOf("detail_") === -1)   return;
        viewAttrCfg && viewAttrCfg.map((v,k) =>{
            const fieldid = k.split("_")[0];
            const ismain = k.split("_")[1] === "0";
            if(ismain || !formUtil.judgeFieldBelTable(formState, tableMark, fieldid))
                return true;
            triInfo[fieldid] = {cfg:v, tableMark:tableMark, rowIndexStr:rowIndex};
        });
    }
    if(jQuery.isEmptyObject(triInfo))   return;
    if(window.console)  console.log("triViewAttrLinkage", triInfo, "triType--", triType);
    
    const changeVariable = {};
    for(const triFieldid in triInfo){
        const cfg = triInfo[triFieldid].cfg;
        const tableMark = triInfo[triFieldid].tableMark;
        const rowIndexStr = triInfo[triFieldid].rowIndexStr.toString();
        !!rowIndexStr && rowIndexStr.split(",").map(rowIndex =>{
            const triFieldValue = formUtil.getFieldValue(formState, triFieldid, rowIndex, tableMark);
            cfg.get("relateFields").map(field=>{
                const fieldid = field.split("_")[0];
                const isDetail = field.split("_")[1] == "1";
                const fieldMark = isDetail ? `field${fieldid}_${rowIndex}` : `field${fieldid}`;
                let changeViewAttr = -1;
                if(triFieldValue !== "" && cfg.hasIn([triFieldValue, field])){      //更改字段属性
                    changeViewAttr = parseInt(cfg.getIn([triFieldValue, field]) || -1);
                }
                changeVariable[fieldMark] = {viewAttr: changeViewAttr};
            });
        });
    }
    return changeVariable;
}

export const generateFieldSqlTriInfo = (formState, triType, tableMark, triFieldid, rowIndex) =>{
    const triInfo = {};
    const fieldSqlCfg = formState.getIn(["conf","linkageCfg","fieldSqlCfg"]);
    if(triType === 1){
        if(!fieldSqlCfg || !fieldSqlCfg.has(triFieldid))
            return;
        fieldSqlCfg.get(triFieldid).map(cfg =>{
            let rowIndexStr = rowIndex;
            if(tableMark === "main"){
                const assignFieldBelMark = formUtil.getBelTableMark(formState, cfg.get("assignField"));
                if(assignFieldBelMark.indexOf("detail_")>-1)        //明细SQL取主表字段需联动所有明细行
                    rowIndexStr = formUtil.getDetailAllRowIndexStr(formState, assignFieldBelMark);
            }
            triInfo[cfg.get("config")] = {triFieldid:triFieldid, relateFields:cfg.get("relateFields").toJS(), rowIndexStr:rowIndexStr, triTableMark:tableMark};
        });
    }else if(triType === 2){
        const triCfg = formState.getIn(["conf", "pageLoadTriCfg"]);
        fieldSqlCfg && fieldSqlCfg.map((v,k) =>{
            v && v.map(cfg =>{
                const assignField = cfg.get("assignField");
                const belTableMark = formUtil.getBelTableMark(formState, assignField);
                if(belTableMark === "main" || triCfg.get("fieldSql_detail")){
                    const rowIndexStr = belTableMark.indexOf("detail_") > -1 ? formUtil.getDetailAllRowIndexStr(formState, belTableMark) : -1;
                    triInfo[cfg.get("config")] = {triFieldid:"", relateFields:cfg.get("relateFields").toJS(), rowIndexStr:rowIndexStr, triTableMark:belTableMark};
                }
            });
        });
    }else if(triType === 3){
        if(!tableMark || tableMark.indexOf("detail_") === -1)   return;
        fieldSqlCfg && fieldSqlCfg.map((v,k) =>{
            v && v.map(cfg =>{
                const assignField = cfg.get("assignField");
                if(formUtil.judgeFieldBelTable(formState, tableMark, assignField)){
                    triInfo[cfg.get("config")] = {triFieldid:"", relateFields:cfg.get("relateFields").toJS(), rowIndexStr:rowIndex, triTableMark:tableMark};
                }
            });
        });
    }
    return triInfo;
}

export const generateDateTimeTriInfo = (formState, triType, tableMark, triFieldid, rowIndex) =>{
    const triInfo = {};
    const fieldDateCfg = formState.getIn(["conf","linkageCfg","fieldDateCfg"]);
    if(triType === 1){
        if(!fieldDateCfg || !fieldDateCfg.has(triFieldid))
            return;
        fieldDateCfg.get(triFieldid).map(cfg =>{
            triInfo[cfg.get("config")] = {triFieldid:triFieldid, relateFields:cfg.get("relateFields").toJS(), rowIndexStr:rowIndex, triTableMark:tableMark};
        });
    }else if(triType === 2){
        const triCfg = formState.getIn(["conf", "pageLoadTriCfg"]);
        fieldDateCfg && fieldDateCfg.map((v,k) =>{
            v && v.map(cfg =>{
                const assignField = cfg.get("assignField");
                const belTableMark = formUtil.getBelTableMark(formState, assignField);
                if(belTableMark === "main" || triCfg.get("dateTime_detail")){
                    const rowIndexStr = belTableMark.indexOf("detail_") > -1 ? formUtil.getDetailAllRowIndexStr(formState, belTableMark) : -1;
                    triInfo[cfg.get("config")] = {triFieldid:"", relateFields:cfg.get("relateFields").toJS(), rowIndexStr:rowIndexStr, triTableMark:belTableMark};
                }
            });
        });
    }else if(triType === 3){
        if(!tableMark || tableMark.indexOf("detail_") === -1)   return;
        fieldDateCfg && fieldDateCfg.map((v,k) =>{
            v && v.map(cfg =>{
                const assignField = cfg.get("assignField");
                if(formUtil.judgeFieldBelTable(formState, tableMark, assignField)){
                    triInfo[cfg.get("config")] = {triFieldid:"", relateFields:cfg.get("relateFields").toJS(), rowIndexStr:rowIndex, triTableMark:tableMark};
                }
            });
        });
    }
    return triInfo;
}

export const generateDataInputTriInfo = (formState, triType, tableMark, triFieldid, rowIndex, iscreate) =>{
    const triInfo = {};
    const dataInputCfg = formState.getIn(["conf","linkageCfg","dataInputCfg"]);
    if(triType === 1){
        if(!dataInputCfg || !dataInputCfg.has(triFieldid))
            return;
        dataInputCfg.get(triFieldid).map(cfg =>{
            triInfo[cfg.get("config")] = {triFieldid:triFieldid, relateFields:cfg.get("relateFields").toJS(), rowIndexStr:rowIndex, triTableMark:tableMark};
        });
    }else if(triType === 2){
        const triCfg = formState.getIn(["conf", "pageLoadTriCfg"]);
        dataInputCfg && dataInputCfg.map((v,triFieldid) =>{
            const belTableMark = formUtil.getBelTableMark(formState, triFieldid);
            if(iscreate === 1 || (belTableMark === "main" && triCfg.get("dataInput_main")) || (belTableMark.indexOf("detail_") > -1 && triCfg.get("dataInput_detail"))){
                const rowIndexStr = belTableMark.indexOf("detail_") > -1 ? formUtil.getDetailAllRowIndexStr(formState, belTableMark) : -1;
                v && v.map(cfg =>{
                    triInfo[cfg.get("config")] = {triFieldid:triFieldid, relateFields:cfg.get("relateFields").toJS(), rowIndexStr:rowIndexStr, triTableMark:belTableMark};
                });
            }
        });
    }else if(triType === 3){
        if(!tableMark || tableMark.indexOf("detail_") === -1)   return;
        dataInputCfg && dataInputCfg.map((v,triFieldid) =>{
            if(!formUtil.judgeFieldBelTable(formState, tableMark, triFieldid))
                return true;
            v && v.map(cfg =>{
                triInfo[cfg.get("config")] = {triFieldid:triFieldid, relateFields:cfg.get("relateFields").toJS(), rowIndexStr:rowIndex, triTableMark:tableMark};
            });
        });
    }
    return triInfo;
}

//生成联动后台请求参数
export const generateReqLinkageParams = (formState, paramsObj, triInfo, type) =>{
    const params = {};
    params["workflowid"] = paramsObj.get("workflowid");
    params["nodeid"] = paramsObj.get("nodeid");
    params["formid"] = paramsObj.get("formid");
    params["isbill"] = paramsObj.get("isbill");
    params["requestid"] = paramsObj.get("requestid");
    let linkageid = "";
    for(const key in triInfo){
        const rowIndexStr = triInfo[key].rowIndexStr.toString();
        if(rowIndexStr === "")
            continue;
        const triFieldid = triInfo[key].triFieldid;
        const relateFields = triInfo[key].relateFields;
        const triTableMark = triInfo[key].triTableMark;
        linkageid += key+","
        params[`triFieldid_${key}`] = triFieldid;
        //params[`relateField_${key}`] = relateFields.toString();
        params[`rowIndexStr_${key}`] = rowIndexStr;
        params[`triTableMark_${key}`] = triTableMark;
        rowIndexStr.split(",").map(rowIndex =>{     //可能计算明细所有行
            //字段联动,需要触发字段值
            if(type === "datainput"){
                const triFieldMark = triTableMark.indexOf("detail_")>-1 ? `field${triFieldid}_${rowIndex}` : `field${triFieldid}`;
                params[triFieldMark] = formUtil.getFieldValue(formState, triFieldid, rowIndex, triTableMark);
            }
            relateFields.map(fieldid =>{
                let tableMark = triTableMark;
                if(!tableMark || type === "fieldsql")       //SQL赋值存在主、子联动混合取值
                    tableMark = formUtil.getBelTableMark(formState, fieldid);
                const fieldMark = tableMark.indexOf("detail_")>-1 ? `field${fieldid}_${rowIndex}` : `field${fieldid}`;
                if(fieldMark in params)     //已取值不重复获取
                    return true;
                params[fieldMark] = formUtil.getFieldValue(formState, fieldid, rowIndex, tableMark);
            });
        });
    }
    params["linkageid"] = linkageid !== "" ? linkageid.substring(0, linkageid.length-1) : "";
    return params;
}