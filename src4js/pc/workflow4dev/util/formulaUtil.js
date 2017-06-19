/**  设计器公式相关方法  */
import * as formUtil from '../util/formUtil'

//公式运算入口
export const calculateFormula = (formState, triInfo) =>{
    const changeDatas = {};
    triInfo.map(info =>{
        try{
            const formula = formState.getIn(["layout", "formula", info.formulaKey]);
            if(!formula || !formula.has("destfield") || !formula.has("formulatxt") || !formula.has("cellrange"))
                return true;
            const destCell = formula.get("destcell");
            const destField = formula.get("destfield");
            const formulaTxt = jQuery.trim(formula.get("formulatxt")).substring(1);
            //公式解析分如下几种情况
            if(destCell.indexOf("DETAIL_") === -1){		//赋值给主表字段
                let result = '';
                if((/DETAIL_\d+\./).test(formulaTxt)){	//取值字段包含明细表字段
                    const reg = /^(EXCEL_AVERAGE|EXCEL_MIN|EXCEL_MAX)\((\s*(MAIN|TAB_\d+|DETAIL_\d+)\.[A-Z]+\d+\s*(\,)?)+\)$/;
                    if(reg.test(formulaTxt)){			//求平均、最大、最小特殊处理(例：AVG(明细字段或主字段))
                        result = calculate_detail_special(formState, formulaTxt);
                    }else{
                        result = calculate_detail_sum(formState, formulaTxt);
                    }
                }else{									//取值字段全部为主表字段
                    result = calculate_single(formState, formulaTxt, -1);
                }
				changeDatas[`field${destField}`] = {value:result};
            }else{										//赋值给明细字段
                const destTableMark = formUtil.getBelTableMark(formState, destField);
				const rowIndexStr = info.triRowMark==="all" ? formUtil.getDetailAllRowIndexStr(formState, destTableMark) : info.triRowMark.toString();
				!!rowIndexStr && rowIndexStr.split(",").map(rowIndex =>{
					const result = calculate_single(formState, formulaTxt, rowIndex);
					changeDatas[`field${destField}_${rowIndex}`] = {value:result};
				});
            }
        }catch(ex){
            if(window.console)	console.log("Formula calculate error: "+ex);
        }
    });
    return changeDatas;
}

//单条/单行公式计算
const calculate_single = (formState, formulaTxt, rowMark) =>{
    return eval(replaceFormula(formState, formulaTxt, rowMark));
}

//明细列求平均/最大赋值主字段，特殊公式处理
const calculate_detail_special = (formState, formulaTxt) =>{
    return eval(replaceFormula(formState, formulaTxt, "all"));
}

//明细作为取值字段的公式，计算明细每一行公式结果，再合计赋值主字段
const calculate_detail_sum = (formState, formulaTxt) =>{
	let sumResult = 0;
	const detailMark = formulaTxt.match(/(DETAIL_\d+)/g)[0].toLowerCase();
	const allRowIndex = formUtil.getDetailAllRowIndexStr(formState, detailMark);
	!!allRowIndex && allRowIndex.split(",").map(rowIndex =>{
		try{
			const singleRowResult = eval(replaceFormula(formState, formulaTxt, rowIndex));
			if(!isNaN(parseFloat(singleRowResult))){	//非法数值结果
				sumResult = rewrite_add(sumResult, singleRowResult);
			}
		}catch(ev){}
	});
	return sumResult;
}

//替换公式，单元格标示替换成对应字段值
const replaceFormula = (formState, formulaTxt, rowMark) =>{
    if(rowMark !== "all" && isNaN(rowMark))
        throw new Error("RowMark Parameter Illegal");
	const fieldCellInfo = formState.getIn(["conf", "cellInfo", "fieldCellInfo"]);
    const reg = /(MAIN|TAB_\d+|DETAIL_\d+)\.[A-Z]+\d+/g;
    formulaTxt.match(reg).map(cellAttr =>{
        let fieldValue = "";
        const fieldid = convertCellAttrToFieldid(fieldCellInfo, cellAttr);
        if(!!fieldid){      //单元格非字段情况作为空值处理
			const isDetail = cellAttr.indexOf("DETAIL_") > -1;
            const tableMark = isDetail ? cellAttr.split(".")[0].toLowerCase() : "main";
            if(isDetail && rowMark === "all"){      //求明细列最大等情况，需取明细所有行值参与计算
                const allRowIndex = formUtil.getDetailAllRowIndexStr(formState, tableMark);
				!!allRowIndex && allRowIndex.split(",").map((rowIndex,index) =>{
					if(index > 0)
						fieldValue += ",";
					fieldValue += getSingleFieldValue(formState, fieldid, rowIndex, tableMark);
				});
            }else{
                fieldValue = getSingleFieldValue(formState, fieldid, rowMark, tableMark);
            }
        }
        //表达式替换
        const reg1 = new RegExp(cellAttr+"(?!\d)", "g");
        formulaTxt = formulaTxt.replace(reg1, fieldValue);
    });
    //console.log("afterReplaceformulaTxt----", formulaTxt, "rowMark---",rowMark);
    return formulaTxt;
}

//获取单个字段值
const getSingleFieldValue = (formState, fieldid, rowIndex, tableMark) =>{
    let fieldValue = formUtil.getFieldValue(formState, fieldid, rowIndex, tableMark);
    const fieldObj = formUtil.getFieldInfoObj(formState, fieldid, tableMark);
    if(fieldObj.get("htmltype") === 1 && fieldObj.get("detailtype") === 5)
        fieldValue = fieldValue.toString().replace(/,/g, "");
    //空值处理、非数值处理
    if(fieldValue === "")
        fieldValue = "emptyval";
    if(isNaN(fieldValue))
        fieldValue = "\""+fieldValue+"\"";
    return fieldValue;
}

//公式标示转换成单元格标示(例：DETAIL_1.C4------>detail_1_4_3)
const convertCellAttrToFieldid = (fieldCellInfo, cellAttr) =>{
    const symbol = cellAttr.split(".")[0].toLowerCase();
    const letter = cellAttr.split(".")[1];
    const rowid = parseInt(letter.match(/\d+$/)[0]) - 1;
    const colid = convertCharToInt(letter.match(/^[a-zA-Z]+/)[0]) -1;
	let fieldid = "";
	fieldCellInfo && fieldCellInfo.map((v,k) =>{
		if(v.get("rowid") === rowid && v.get("colid") === colid && v.get("symbol") === symbol){
			fieldid = k;
		}
	});
    return fieldid;
}

//字母转数字(例：AB---->27)
const convertCharToInt = (value) =>{
    let rtn = 0;
    let powIndex = 0;
    for (let i = value.length - 1; i >= 0; i--){
        let tmpInt = value[i].charCodeAt() - 64;
        rtn += Math.pow(26, powIndex) * tmpInt;
        powIndex++;           
    }
    return rtn;
}


//是否是纯数字、整数
function isInt(str){
	var reg = /^[0-9]+$/;
	return reg.test(str);
}

//JS parseFloat求和精度不一致问题解决
function rewrite_add(arg1,arg2){
	var r1=0,r2=0; 
	try{
		r1=arg1.toString().split(".")[1].length;
	}catch(e){}
	try{
		r2=arg2.toString().split(".")[1].length;
	}catch(e){}
	var m=Math.pow(10,Math.max(r1,r2)); 
	return (arg1*m+arg2*m)/m; 
}

//求和
function EXCEL_SUM(){
	var result = 0;
	for(var i=0;i<arguments.length;i++){
		var par = arguments[i];
		if(!isNaN(parseFloat(par))){
			result = rewrite_add(result,par);
		}
	}
	return result;
}

//求平均数
function EXCEL_AVERAGE(){
	var count = 0;
	var sumVal = 0;
	for(var i=0;i<arguments.length;i++){
		var par = arguments[i];
		if(!isNaN(parseFloat(par))){
			//sumVal += parseFloat(par);
			sumVal = rewrite_add(sumVal,par);
			count++;
		}
	}
	if(count>0){
		return parseFloat(sumVal/count);
	}else{
		throw new Error("EXCEL_AVERAGE divisor is zero");
	}
}
//求绝对值
function EXCEL_ABS(){
	if(arguments.length==1){
		var par = arguments[0];
		if(!isNaN(parseFloat(par))){
			var result = Math.abs(parseFloat(par));
			return result;
		}else{
			throw new Error("EXCEL_ABS arguments value is not a number");
		}
	}else{
		throw new Error("EXCEL_ABS arguments number must equal one");
	}
}
//精度计算
function EXCEL_ROUND(){
	if(arguments.length==2){
		var result = 0;
		var par1 = arguments[0];
		var par2 = arguments[1];
		if(!isNaN(parseFloat(par1))){
			par1 = parseFloat(par1);
		}else{
			throw new Error("EXCEL_ROUND first argument value is not a number");
		}
		if(isInt(par2)){
			par2 = parseInt(par2);
		}else{
			throw new Error("EXCEL_ROUND second argument value is not a int");
		}
		result = par1.toFixed(par2);
		return result;
	}else{
		throw new Error("EXCEL_ROUND arguments number must equal two");
	}
}
//条件判断
function EXCEL_IF(){
	if(arguments.length==3){
		if(eval(arguments[0])){
			return arguments[1];
		}else{
			return arguments[2];
		}
	}else{
		throw new Error("EXCEL_IF arguments number must equal three");
	}
}
//求最大值
function EXCEL_MAX(){
	var result;
	for(var i=0;i<arguments.length;i++){
		var par = arguments[i];
		if(!isNaN(parseFloat(par))){
			if(result==null){
				result = parseFloat(par);
			}else{
				if(parseFloat(par)>result)	
					result = parseFloat(par);
			}
		}
	}
	if(result!=null){
		return result;
	}else{
		throw new Error("EXCEL_MAX arguments value must contain a number");
	}
}
//求最小值
function EXCEL_MIN(){
	var result;
	for(var i=0;i<arguments.length;i++){
		var par = arguments[i];
		if(!isNaN(parseFloat(par))){
			if(result==null){
				result = parseFloat(par);
			}else{
				if(parseFloat(par)<result)	
					result = parseFloat(par);
			}
		}
	}
	if(result!=null){
		return result;
	}else{
		throw new Error("EXCEL_MIN arguments value must contain a number");
	}
}