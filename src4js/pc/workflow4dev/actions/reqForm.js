import * as types from '../constants/ActionTypes'
import * as API_REQ from '../apis/req'
import * as formUtil from '../util/formUtil'
import * as formulaUtil from '../util/formulaUtil'
import * as linkageUtil from '../util/linkageUtil'
import Immutable from 'immutable'
import * as lodash from 'lodash'

export const initFormInfo = (data) =>{
    return (dispatch, getState) => {
        dispatch({
            type: types.REQFORM_INIT_INFO,
            layout: data.datajson.eformdesign,
            conf: {
                tableInfo: data.tableInfo,
                cellInfo: data.cellInfo,
                browserInfo: data.browserInfo,
                fieldDependShip: data.fieldDependShip,
                linkageCfg: data.linkageCfg,
                pageLoadTriCfg: data.pageLoadTriCfg,
                codeInfo:data.codeInfo
            },
            mainData: data.maindata
        });
    }
}

export const loadDetailValue = (queryParams) =>{
    return (dispatch, getState) => {
        const params = getState().workflowReq.get("params").toJS();
        const submitParams = getState().workflowReq.get("submitParams").toJS();
        const formState = getState().workflowReqForm;
        let detailmark = "";
        formState.getIn(["conf","tableInfo"]).map((v,k) => {
            if(k !== "main")
                detailmark += k+",";
        });
        if(detailmark !== "") {
            const reqParams = {
                workflowid: params.workflowid,
                nodeid: params.nodeid,
                formid: params.formid,
                isbill: params.isbill,
                isagent: params.isagent,
                beagenter: params.beagenter,
                f_weaver_belongto_userid: params.f_weaver_belongto_userid,
                f_weaver_belongto_usertype: params.f_weaver_belongto_usertype,
                ismode: params.ismode,
                modeid: params.modeid,
                iscreate: params.iscreate,
                isprint: params.isprint,
                isviewonly: params.isviewonly
            };
            const reqDetailParams = {...queryParams};
            reqDetailParams["reqParams"] = JSON.stringify(reqParams);
            reqDetailParams["detailmark"] = detailmark.substring(0,detailmark.length-1);
            API_REQ.loadDetailData(reqDetailParams).then((data)=>{
                dispatch({type: types.REQFORM_SET_DETAILVALUE, detailData:data});
                dispatch(triAllLinkage(2));     //页面加载触发联动应在默认新增明细前，新增加的行联动在添加时会自动触发
                //节点操作者-默认新增空明细
                if(parseInt(params.isviewonly || 0) !== 1){
                    detailmark.split(",").map(detailMark =>{
                        const rowDatas = getState().workflowReqForm.getIn(["detailData",detailMark,"rowDatas"]);
                        if(!rowDatas || rowDatas.size === 0){
                            const detailtableattr = formState.getIn(["conf","tableInfo",detailMark,"detailtableattr"]);
                            if(detailtableattr && detailtableattr.get("isdefault") === 1 && detailtableattr.get("isadd") === 1){
                                const defaultrows = detailtableattr.get("defaultrows")||0;
                                for(let i=0; i<defaultrows; i++){
                                    dispatch(addDetailRow(detailMark));
                                }
                            }
                        }
                    });
                }
                dispatch(loadScript(params,submitParams));  //DOM都渲染后加载代码块
            });
        }else {
            dispatch(triAllLinkage(2));
            dispatch(loadScript(params,submitParams));
        }
    }
}

export const loadScript = (params,submitParams)=> {
	return (dispatch, getState) => {
		Promise.all([
			API_REQ.loadScriptContent({
				layoutid:params.modeid
			}),
			API_REQ.copyCustomPageFile({
				custompage:params.custompage,
				workflowid:params.workflowid
			}).then(data=>{
				if(data.custompagee9=="") {
					return new Promise((resolve)=>{
						resolve("");
					});
				}else {
					return API_REQ.loadCustompage({
						custompage:data.custompagee9,
						custompageparam:submitParams      //需按照E8参数生成
					});
				}
			})
		]).then((result)=>{
			jQuery("#scriptcontent").html("").append(result[0]);
			jQuery("#custompage").html("").append(result[1]);
			typeof window.formReady === "function" && window.formReady();
		});
	};
}

//明细行选中
export const setDetailRowChecked = (detailMark, rowIndex, isChecked) =>{
    return (dispatch, getState) => {
        dispatch({type:types.REQFORM_SET_DETAIL_ROW_CHECKED, detailMark, rowIndex, isChecked});
    }
}

//明细行全选
export const setDetailAllRowChecked = (detailMark, isChecked) =>{
    return (dispatch, getState) => {
        dispatch({type:types.REQFORM_SET_DETAIL_ALLROW_CHECKED, detailMark, isChecked});
    }
}

//添加明细
export const addDetailRow = (detailMark, initRowData={}) =>{
    return (dispatch, getState) => {
        const curDetailInfo = getState().workflowReqForm.getIn(["detailData",detailMark]);
        const indexnum = parseInt(curDetailInfo.get("indexnum")||0);
        let addRowObj = curDetailInfo.has("addRowDefValue") ? lodash.assign({}, curDetailInfo.get("addRowDefValue").toJS()) : {};    //新增行字段默认值
        //暂时明细插入都在最后行后插入，如果是指定行插入，则下方行是更新组件，最后行是初始加载组件,值变化联动触发判断加上行标示解决，同时明细字段不能依赖componentWillMount事件
        addRowObj["orderid"] = indexnum+1;
        //新增行字段赋值
        for(const key in initRowData){
            if(key.indexOf("field")>-1)
                addRowObj[key] = initRowData[key];
        }
        const datas = {indexnum:(indexnum+1), rowDatas:{[`row_${indexnum}`]:addRowObj}};
        dispatch({type:types.REQFORM_ADD_DETAIL_ROW, detailMark, datas});
        //触发新增行的联动
        dispatch(triAllLinkage(3, detailMark, "", indexnum));
    }
}

//删除明细
export const delDetailRow = (detailMark) =>{
    return (dispatch, getState) => {
        dispatch({type:types.REQFORM_DEL_DETAIL_ROW, detailMark});
        dispatch(triAllLinkage(4, detailMark));
    }
}

//修改单个字段值
export const changeSingleFieldValue = (fieldMark, valueInfo, variableInfo) =>{
    return (dispatch, getState) => {
        const changeDatas = {};
        if(!!valueInfo)     changeDatas[fieldMark] = valueInfo;
        const changeVariable = {};
        if(!!variableInfo)  changeVariable[fieldMark] = variableInfo;
        dispatch(changeMoreFieldData(changeDatas, changeVariable));
    }
}

//修改Redux字段值/字段变量的唯一入口，修改字段值同时需触发联动事件
//修改多个字段(主字段/明细字段)值信息,只做一次dispatch渲染
export const changeMoreFieldData = (changeDatas, changeVariable={}) =>{
    return (dispatch, getState) => {
        if(jQuery.isEmptyObject(changeDatas) && jQuery.isEmptyObject(changeVariable))
            return;
        if(window.console)  console.log("changeMoreFieldData--", changeDatas, changeVariable);
        const formStateBeforeChange = getState().workflowReqForm;
        //修改Redux字段值
        dispatch({type:types.REQFORM_CHANGE_MORE_FIELD_DATA, changeDatas, changeVariable});
        //值变化触发联动事件
        for(const key in changeDatas){
            const isDetail = key.indexOf("_") > -1;
            const fieldid = isDetail ? key.substring(5, key.indexOf("_")) : key.substring(5);
            const rowIndex = isDetail ? key.substring(key.indexOf("_")+1) : "-1";
            const tableMark =  isDetail ? formUtil.getBelTableMark(formStateBeforeChange, fieldid) : "main";
            const fieldObj = formUtil.getFieldInfoObj(formStateBeforeChange, fieldid, tableMark);
            if(!fieldObj)
                continue;
            let oldValue = formUtil.getFieldValue(formStateBeforeChange, fieldid, rowIndex, tableMark);
            let newValue = changeDatas[key].value;
            if(fieldObj.get("htmltype") === 1 && fieldObj.get("detailtype") !== 1){     //数值类型
                if(oldValue !== "")     oldValue = parseFloat(oldValue);
                if(newValue !== "")     newValue = parseFloat(newValue);
            }
            if(oldValue !== newValue)   //必须三个等号判断类型，值变化触发联动
                dispatch(triAllLinkage(1, tableMark, fieldid, rowIndex));
        }
    }
}


/***************** 触发联动事件，triType含义（1：字段值变化触发  2：页面加载触发  3：新增行触发  4、删除行触发） ****************/
/***************** 页面加载触发联动每个类型只发一次请求，值变化触发联动非请求后台的联动只最终做一次dispatch *****************/
/***************** 联动dispatch次数要尽量降到最低，考虑计算所有行情况 ****************/
export const triAllLinkage = (triType, tableMark, triFieldid, rowIndex) =>{
    return (dispatch, getState) => {
        const formState = getState().workflowReqForm;
        const params = getState().workflowReq.get("params");
        const isviewonly = parseInt(params.get("isviewonly")||0);
        const iscreate = parseInt(params.get("iscreate")||0);
        const triCfg = formState.getIn(["conf", "pageLoadTriCfg"]);
        let changeDatas = {};
        let changeVariable = {};
        //是否触发联动判断
        let needTriRowRule = true;
        let needTriColRule = true;
        let needTriFieldMath = true;
        let needTriFormula = true;
        let needTriSelectChange = true;
        let needTriViewAttr = true;
        let needTriFieldSql = true;
        let needTriDateTime = true;
        let needTriDataInput = true;
        if(triType === 1){
            if(tableMark === "main"){
                needTriRowRule = false;
                needTriColRule = false;
            }else if(tableMark.indexOf("detail_") > -1){
                const triFieldObj = formUtil.getFieldInfoObj(formState, triFieldid, tableMark);
                if(triFieldObj.get("htmltype") !== 1 || triFieldObj.get("detailtype") === 1){   //非数值字段不触发
                    needTriRowRule = false;
                    needTriColRule = false;
                }
                needTriFieldMath = false;
            }
        }else if(triType === 2){
            //触发所有行的行规则
            if((isviewonly === 0 && triCfg.get("rowRule_edit")) || (isviewonly === 1 && triCfg.get("rowRule_view")))
                needTriRowRule = true;
            else
                needTriRowRule = false;
            if(isviewonly === 1){
                needTriFieldMath = false;
                needTriFormula = false;
                needTriSelectChange = false;
                needTriViewAttr = false;
                needTriFieldSql = false;
                needTriDateTime = false;
                needTriDataInput = false;
            }
        }else if(triType === 3){
            needTriFieldMath = false;
        }else if(triType === 4){
            needTriRowRule = false;
            needTriFieldMath = false;
            needTriSelectChange = false;
            needTriViewAttr = false;
            needTriFieldSql = false;
            needTriDateTime = false;
            needTriDataInput = false;
        }
        if(needTriRowRule){     //行规则
            const rowRule_result = linkageUtil.calDetailRowRule(formState, triType, tableMark, triFieldid, rowIndex);
            if(!!rowRule_result)
                changeDatas = lodash.assign(changeDatas, rowRule_result);
        }
        if(needTriColRule){     //列规则
            const colRult_result = linkageUtil.calDetailColRule(formState, triType, tableMark, triFieldid);
            if(!!colRult_result){
                changeDatas = lodash.assign(changeDatas, colRult_result["changeDatas"]||{});
                changeVariable = lodash.merge(changeVariable, colRult_result["changeVariable"]||{});
            }
        }
        if(needTriFieldMath){   //字段赋值
            const fieldMath_result = linkageUtil.calFieldMath(formState, triType, triFieldid);
            if(!!fieldMath_result){
                changeDatas = lodash.assign(changeDatas, fieldMath_result["changeDatas"]||{});
                changeVariable = lodash.merge(changeVariable, fieldMath_result["changeVariable"]||{});
            }
        }
        if(needTriFormula){     //公式
            const formula_result = linkageUtil.calFormula(formState, triType, tableMark, triFieldid, rowIndex);
            if(!!formula_result)
                changeDatas = lodash.assign(changeDatas, formula_result);
        }
        if(needTriSelectChange){    //选择框联动
            const selectChange_result = linkageUtil.controlSelectChange(formState, triType, tableMark, triFieldid, rowIndex);
            if(!!selectChange_result){
                changeDatas = lodash.assign(changeDatas, selectChange_result["changeDatas"]||{});
                changeVariable = lodash.merge(changeVariable, selectChange_result["changeVariable"]||{});
            }
        }
        if(needTriViewAttr){    //显示属性联动
            const viewAttr_result = linkageUtil.controlViewAttr(formState, triType, tableMark, triFieldid, rowIndex);
            if(!!viewAttr_result)
                changeVariable = lodash.merge(changeVariable, viewAttr_result);     //需使用lodash.merge深度合并，避免覆盖optionRange等
        }
        //非请求后台联动结果统一修改Redux
        dispatch(changeMoreFieldData(changeDatas, changeVariable));
        /************** 以下为需要发请求的联动 **************/
        if(needTriFieldSql){    //SQL联动
            const fieldSql_triInfo = linkageUtil.generateFieldSqlTriInfo(formState, triType, tableMark, triFieldid, rowIndex);
            dispatch(reqLinkageResult(fieldSql_triInfo, "fieldsql"));
        }
        if(needTriDateTime){    //日期时间计算
            const dateTime_triInfo = linkageUtil.generateDateTimeTriInfo(formState, triType, tableMark, triFieldid, rowIndex);
            dispatch(reqLinkageResult(dateTime_triInfo, "datetime"));
        }
        if(needTriDataInput){   //字段联动
            const dataInput_triInfo = linkageUtil.generateDataInputTriInfo(formState, triType, tableMark, triFieldid, rowIndex, iscreate);
            dispatch(reqLinkageResult(dataInput_triInfo, "datainput"));
        }
        //触发bindPropertyChange函数体
        if(triType === 1){
            const triFieldMark = tableMark.indexOf("detail_")>-1 ? `field${triFieldid}_${rowIndex}` : `field${triFieldid}`;
            if(triFieldMark in __propertyChangeFnArray){
                __propertyChangeFnArray[triFieldMark].map(fn =>{
                    try{
                        fn(jQuery("#"+triFieldMark)[0]);
                    }catch(e){}
                });
            }
        }
    }
}

//请求后台获取字段联动结果
const reqLinkageResult = (triInfo, type) =>{
    return (dispatch, getState) => {
        if(jQuery.isEmptyObject(triInfo))   return;
        if(window.console)  console.log("reqLinkageResult----"+type, triInfo);
        const formState = getState().workflowReqForm;
        const paramsObj = getState().workflowReq.get("params");
        const params = linkageUtil.generateReqLinkageParams(formState, paramsObj, triInfo, type);
        if(!params.linkageid)
            return;
        let API_FUNCTION = null;
        if(type === "datainput")
            API_FUNCTION = API_REQ.reqDataInputResult(params);
        else if(type === "fieldsql")
            API_FUNCTION = API_REQ.reqFieldSqlResult(params);
        else if(type === "datetime")
            API_FUNCTION = API_REQ.reqDateTimeResult(params);
        API_FUNCTION.then(data => {
            try{
                const dataMap = Immutable.fromJS(data);
                const changeDatas = {};
                dataMap.map((v,k) =>{
                    const triTableMark = params[`triTableMark_${k.substring(11)}`];
                    let changeValue;
                    if(type === "datainput"){
                        changeValue = v && v.get("changeValue");
                        const addRows = v && v.get("addDetailRow");
                        addRows && addRows.map((rowDatas,detailMark) =>{
                            rowDatas && rowDatas.map(rowData =>{
                                dispatch(addDetailRow(detailMark, rowData.toJS()));
                            });
                        });
                    }else{
                        changeValue = v;
                    }
                    //联动赋值
                    changeValue && changeValue.map((valueInfo, key) =>{
                        const fieldArr = key.split("_");
                        const fieldid = fieldArr[0].substring(5);
                        const rowIndex = fieldArr.length>1 ? fieldArr[1] : -1;
                        let tableMark = triTableMark;
                        if(!tableMark || type === "fieldsql")      //SQL联动主字段触发可赋值明细字段
                            tableMark = formUtil.getBelTableMark(formState, fieldid);
                        const fieldMark = tableMark.indexOf("detail_") > -1 ? `field${fieldid}_${rowIndex}` : `field${fieldid}`;
                        changeDatas[fieldMark] = valueInfo.toJS();
                    });
                });
                dispatch(changeMoreFieldData(changeDatas));
            }catch(e){
                if(window.console)  console.log("reqLinkageResult "+type+" Exception:", params, data, e);
            }
        });
    }
}


//修改其它变量属性
export const controlVariableArea = (changeInfo) =>{
    return (dispatch, getState) =>{
        if(!jQuery.isEmptyObject(changeInfo))
            dispatch({type:types.REQFORM_CONTROL_VARIABLE_AREA, changeInfo});
    }
}

//表单触发生成流程编号
export const setWfCode = (params) => {
	return (dispatch, getState) => {
		const fieldCode = getState().workflowReqForm.getIn(['conf','codeInfo','fieldCode']);
		const reqParams = getState().workflowReq.get('params');
		
		params.requestid = reqParams.get('requestid');
		params.workflowid = reqParams.get('workflowid');
		params.formid = reqParams.get('formid');
		params.isbill = reqParams.get('isbill');
		params.creater = reqParams.get('creater');
		params.creatertype = reqParams.get('creatertype');
		
		API_REQ.createWfCode(params).then(data=>{
			dispatch(changeSingleFieldValue(`field${fieldCode}`,{value:data.wfcode}));	
		});
	}
}

//选择预留编号
export const chooseReservedCode = (params) => {
	return (dispatch, getState) => {
		const fieldCode = getState().workflowReqForm.getIn(['conf','codeInfo','fieldCode']);
		const reqParams = getState().workflowReq.get('params');
		
		params.requestid = reqParams.get('requestid');
		params.workflowid = reqParams.get('workflowid');
		params.formid = reqParams.get('formid');
		params.isbill = reqParams.get('isbill');
		params.creater = reqParams.get('creater');
		params.creatertype = reqParams.get('creatertype');

		let tempurl = "/workflow/workflow/showChooseReservedCodeOperate.jsp?workflowId="+reqParams.get('workflowid')+"&formId="+reqParams.get('formid')+"&isBill="+reqParams.get('isbill');
		API_REQ.loadWfCodeFieldValueInfo(params).then(data=>{
			const mapdata = Immutable.Map(data);
			mapdata.map((val,key) => tempurl = tempurl + "&"+key+"="+val);
		
			var dialognew = new window.top.Dialog();
			dialognew.currentWindow = window;
			dialognew.URL = "/systeminfo/BrowserMain.jsp?url="+escape(tempurl);
			dialognew.callbackfun = function (paramobj, con) {
				params.codeSeqReservedIdAndCode = con.id+"~~wfcodecon~~"+con.name;
				params.operation = "chooseReservedCode";
				API_REQ.createWfCode(params).then(data=>{
					dispatch(changeSingleFieldValue(`field${fieldCode}`,{value:data.wfcode}));	
				});
			};
			dialognew.Title = "选择预留号";
			dialognew.Modal = true;
			dialognew.Width = 550 ;
			dialognew.Height = 500 ;
			dialognew.isIframe=false;
			dialognew.show();
		});
	}
}

//新建预留编号
export const newReservedCode =(params)=>{
	return (dispatch, getState) => {
		const fieldCode = getState().workflowReqForm.getIn(['conf','codeInfo','fieldCode']);
		const reqParams = getState().workflowReq.get('params');
		
		params.requestid = reqParams.get('requestid');
		params.workflowid = reqParams.get('workflowid');
		params.formid = reqParams.get('formid');
		params.isbill = reqParams.get('isbill');
		params.creater = reqParams.get('creater');
		params.creatertype = reqParams.get('creatertype');
		
		let tempurl = "/workflow/workflow/showNewReservedCodeOperate.jsp?workflowId="+reqParams.get('workflowid')+"&formId="+reqParams.get('formid')+"&isBill="+reqParams.get('isbill');
		API_REQ.loadWfCodeFieldValueInfo(params).then(data=>{
			const mapdata = Immutable.Map(data);
			mapdata.map((val,key) => tempurl = tempurl + "&"+key+"="+val);
			
			var dialognew = new window.top.Dialog();
			dialognew.currentWindow = window;
			dialognew.URL = "/systeminfo/BrowserMain.jsp?url="+escape(tempurl);
			dialognew.Title = "新建预留号";
			dialognew.Modal = true;
			dialognew.Width = 550 ;
			dialognew.Height = 500 ;
			dialognew.isIframe=false;
			dialognew.show();
		});
	}
}
