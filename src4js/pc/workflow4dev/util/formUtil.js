import Immutable from 'immutable'

//获取字段对象
export const getFieldInfoObj = (formState, fieldid, tableMark) =>{
    if(!!!tableMark)    tableMark = getBelTableMark(formState, fieldid);
    if(tableMark === "" || !formState.hasIn(["conf", "tableInfo", tableMark, "fieldinfomap", fieldid.toString()]))
        return null;
    return formState.getIn(["conf", "tableInfo", tableMark, "fieldinfomap", fieldid.toString()]);
}

//获取字段value值
export const getFieldValue = (formState, fieldid, rowIndex, tableMark, needDefNull) =>{
    const obj = getFieldValueObj(formState, fieldid, rowIndex, tableMark);
    let fieldval;
    if(obj && obj.has("value"))
        fieldval = obj.get("value").toString();
    else
        fieldval = needDefNull === true ? null : "";    //不存在值
    if(fieldval === ""){    //空值处理
        const fieldObj = getFieldInfoObj(formState, fieldid, tableMark);
        if(fieldObj && fieldObj.get("htmltype") === 4)      //check框空值置0
            fieldval = "0";
    }
    return fieldval;
}

//获取数值类型字段value值
export const getNumFieldValue = (formState, fieldid, rowIndex, tableMark) =>{
    const obj = getFieldValueObj(formState, fieldid, rowIndex, tableMark);
    const val = obj ? obj.get("value").toString().replace(/,/g, "") : "";
    return isNum(val) ? parseFloat(val) : 0;
}

//获取字段值对象
const getFieldValueObj = (formState, fieldid, rowIndex, tableMark) =>{
    let obj = null;
    if(!!!tableMark)    tableMark = getBelTableMark(formState, fieldid);
    if(tableMark === "main"){
        obj = formState.getIn(["mainData", `field${fieldid}`]);
    }else if(tableMark.indexOf("detail_") > -1){
        obj = formState.getIn(["detailData", tableMark, "rowDatas", `row_${rowIndex}`, `field${fieldid}`]);
    }
    return obj;
}

//获取明细字段合计值
export const getDetailFieldSumValue = (formState, fieldid, tableMark) =>{
    let sum = 0;
    formState && formState.getIn(["detailData", tableMark, "rowDatas"]).map(rowData=>{
        let obj = rowData.get(`field${fieldid}`);
        let val = obj ? obj.get("value").toString().replace(/,/g, "") : "";
        val = isNum(val) ? parseFloat(val) : 0;
        sum += val;
    });
    return sum;
}

//获取明细所有行标示，以逗号分隔
export const getDetailAllRowIndexStr = (formState, detailMark) =>{
    if(detailMark.indexOf("detail_") === -1)
        return "";
    let str = "";
    formState && formState.getIn(["detailData", detailMark, "rowDatas"]).map((v,k) =>{
        str += k.substring(4)+",";
    });
    if(str !== "")
        str = str.substring(0, str.length-1);
    return str;
}

//根据字段ID获取所属具体所属主表/明细表
export const getBelTableMark = (formState, fieldid) =>{
    let tableMark = "";
    fieldid = fieldid.toString();
    formState && formState.getIn(["conf", "tableInfo"]).map((v,k) =>{
        if(v.hasIn(["fieldinfomap", fieldid]))
            tableMark = k;
    });
    return tableMark;
}

//判断字段是否属于指定标示(主表/明细表)
export const judgeFieldBelTable = (formState, tableMark, fieldid) =>{
    if(formState && formState.hasIn(["conf", "tableInfo", tableMark, "fieldinfomap", fieldid.toString()]))
        return true;
    else
        return false;
}

//判断明细表是否存在模板上
export const judgeDetailUnExistTemplate = (formState, detailMark) =>{
    if(formState && formState.hasIn(["conf", "cellInfo", `${detailMark}_exist`]))
        return false;
    else
        return true;
}

//判断字段是否再模板上
export const judgeFieldUnExistTemplate = (formState, tableMark, fieldid) =>{
    fieldid = fieldid.toString();
    if(formState && formState.hasIn(["conf", "cellInfo", "fieldCellInfo", fieldid]) 
        && formState.getIn(["conf", "tableInfo", tableMark, "fieldinfomap", fieldid, "viewattr"]) > 0)
        return false;
    else
        return true;
}

//提交校验字段必填范围
export const verifyRequiredEmptyField = (formState) =>{
    let emptyField = "";
    const variableArea = formState.get("variableArea");
    let ignoreVerifyRange = Immutable.fromJS([]);
    //计算联动隐藏行中的其它字段，不校验必填
    variableArea && variableArea.map((v,k) =>{
        if(k.indexOf("field") > -1 && v && v.get("viewAttr") === 5){
            const rowMark = formState.getIn(["conf", "cellInfo", "fieldCellInfo", k.substring(5), "rowMark"]);
            const rowFields = formState.getIn(["conf", "cellInfo", "mainRowFields", rowMark]);
            ignoreVerifyRange = ignoreVerifyRange.concat(rowFields);
        }
    });
    const verifyOrder = ["main"];   //先主字段后明细字段
    formState.getIn(["conf", "tableInfo"]).map((v,k) =>{
        if(k.indexOf("detail_") > -1)
            verifyOrder.push(k);
    });
    for(let i=0; i<verifyOrder.length; i++){
        if(emptyField !== "")
            break;
        const tableMark = verifyOrder[i];
        const isDetail = tableMark.indexOf("detail_") > -1;
        const rowIndexStr = isDetail ? getDetailAllRowIndexStr(formState,tableMark) : "-1";
        const fieldInfo = formState.getIn(["conf", "tableInfo", tableMark, "fieldinfomap"]);
        const forbitEditDetailExistRow = isDetail && formState.getIn(["conf","tableInfo",tableMark,"detailtableattr","isedit"]) !== 1;
        if(!rowIndexStr)
            continue;
        const rowIndexArr = rowIndexStr.split(",");
        for(let ii=0; i<rowIndexArr.length; i++){   //循环行
            if(emptyField !== "")
                break;
            const rowIndex = rowIndexArr[ii];
            if(forbitEditDetailExistRow && parseInt(formState.getIn(["detailData", tableMark,"rowDatas", `row_${rowIndex}`, "keyid"])||0) > 0)
                continue;    //禁止修改已有明细行不校验必填
            fieldInfo && fieldInfo.map((fieldObj,fieldid) =>{
                if(emptyField !== "" || ignoreVerifyRange.includes(fieldid) || fieldObj.get("htmltype") === 4)      //联动隐藏行、check框不校验
                    return "";
                const fieldMark = isDetail ? `field${fieldid}_${rowIndex}` : `field${fieldid}`;
                let needVerify = fieldObj.get("viewattr") === 3;
                if(variableArea.hasIn([fieldMark, "viewAttr"]) && variableArea.getIn([fieldMark, "viewAttr"]) > 0)     //显示属性控制必填
                    needVerify = variableArea.getIn([fieldMark, "viewAttr"]) === 2;
                if(needVerify){
                    let fieldValue = getFieldValue(formState, fieldid, rowIndex, tableMark);
                    if(fieldid === "-1")    
                        fieldValue = jQuery.trim(fieldValue);
                    if(fieldValue === "")
                        emptyField = fieldMark;
                }
            });
        }
    }
    return emptyField;
}

//验证流程标题必填
export const saveJudgeRequestNameEmpty = (formState) =>{
    let isEmpty = false;
    const fieldValue = getFieldValue(formState, "-1", 0, "main");
    if(jQuery.trim(fieldValue) === "")
        isEmpty = true;
    return isEmpty;
}

//提交校验明细必须添加是否满足
export const verifyMustAddDetail = (formState) =>{
    let needAddDetailMark = 0;
    formState.getIn(["conf", "tableInfo"]).map((v,k) =>{
        if(needAddDetailMark > 0 || k.indexOf("detail_") === -1)
            return "";  //map循环return代表返回值，无法阻断循环
        if(v.getIn(["detailtableattr", "isneed"]) === 1){
            const rowDatas = formState.getIn(["detailData", k, "rowDatas"]);
            if(!rowDatas || rowDatas.size === 0)
                needAddDetailMark = parseInt(k.substring(7));
        }
    });
    return needAddDetailMark;
}

//计算表达式结果
export const calExpressionResult = (expression) =>{
    let result = "";
    try{
        result = eval(expression);
    }catch(e){
        if(window.console)  console.log("Eval Appear Exception:"+expression);
    }
    return result.toString();
}

//修改Redux字段值前统一对数值字段做次格式化
export const formatDatasBeforeChangeRedux = (formState, changeFieldDatas, tableMark) =>{
    for(const key in changeFieldDatas){
        const fieldid = key.substring(5);
        const fieldObj = getFieldInfoObj(formState, fieldid, tableMark);
        if(!fieldObj)
            continue;
        const htmltype = fieldObj.get("htmltype");
        const detailtype = fieldObj.get("detailtype");
        let fieldValue = changeFieldDatas[key].value;
        if(htmltype === 1 && detailtype !== 1){         //数值字段格式化
            fieldValue = formatNumFieldValue(fieldValue, fieldObj);
        }else if(htmltype === 3 && detailtype === 2){   //日期字段格式化
            const reg = /^\d{4}-\d{1,2}-\d{1,2}$/;
            if(!!fieldValue && !reg.test(fieldValue))
                fieldValue = "";
        }else if(htmltype === 3 && detailtype === 19){  //时间字段格式化
            const reg = /^\d{1,2}:\d{1,2}$/;
            if(!!fieldValue && !reg.test(fieldValue))
                fieldValue = "";
        }
        changeFieldDatas[key].value = fieldValue;
    }
    return changeFieldDatas;
}

//根据字段信息格式化字段值(浮点数位数、转千分位等)
export const formatNumFieldValue = (realval, fieldObj) =>{
	if(realval === null || typeof realval === "undefined")
        return "";
    if(fieldObj && fieldObj.get("htmltype") === 1){
        const detailtype = fieldObj.get("detailtype");
        if(detailtype === 2 || detailtype === 3 || detailtype === 4 || detailtype === 5){
        	const isqfw = detailtype === 5;
        	if(isqfw)
        	    realval = realval.toString().replace(/,/g, "");
            if(!isNum(realval))
                return "";
			return formatFloatValue(realval, fieldObj.get("qfws"), isqfw);
        }
    }
    return realval;
}

/**
 * 数值转换(精度、千分位)等
 * @param {String} realval   真实值
 * @param {int} decimals  精度
 * @param {Boolean} transQfw  是否千分位
 * @param {Boolean} transAbs  是否绝对值
 */
export const formatFloatValue = (realval, decimals, transQfw, transAbs) =>{
	if(!isNum(realval))     //非数值直接返回原始值
		return realval;
    realval = realval.toString();
	var formatval = "";
	if(decimals === 0){		//需取整
		formatval = Math.round(parseFloat(realval)).toString();
	}else{
        var n = Math.pow(10, decimals);
        formatval = (Math.round(parseFloat(realval)*n)/n).toString();
		var pindex = formatval.indexOf(".");
		var pointLength = pindex>-1 ? formatval.substr(pindex+1).length : 0;	//当前小数位数
		if(decimals > pointLength){		//需补零
            if(pindex == -1)
			    formatval += ".";
			for(var i=0; i<decimals-pointLength; i++){
				formatval += "0";
			}
		}
	}
	var index = formatval.indexOf(".");
	var intPar = index>-1 ? formatval.substring(0,index) : formatval;
	var pointPar = index>-1 ? formatval.substring(index) : "";
	//取绝对值
	if(transAbs === true){		//取绝对值
		intPar = Math.abs(intPar).toString();
	}
	if(transQfw === true){				//整数位format成千分位
   		var reg1 = /(-?\d+)(\d{3})/;
        while(reg1.test(intPar)) {   
        	intPar = intPar.replace(reg1, "$1,$2");   
        } 
	}
	formatval = intPar + pointPar;
	return formatval;
}

window.formatFloatValue = formatFloatValue;

export const isNum = (val) =>{
    if(val === null || typeof val === "undefined")
        return false;
    const reg = /^(-?\d+)(\.\d+)?$/;
    return reg.test(val.toString());
}

window.isNum = isNum;