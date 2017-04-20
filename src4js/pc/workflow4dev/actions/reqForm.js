import * as types from '../constants/ActionTypes'
import * as API_REQ from '../apis/req'
import Immutable from 'immutable'

export const initFormInfo = (data) =>{
    return (dispatch, getState) => {
        dispatch({
            type: types.REQFORM_INIT_INFO,
            layout: data.datajson.eformdesign,
            conf: {tableInfo: data.tableinfo, cellInfo: data.cellinfo, linkageCfg: data.linkageCfg},
            mainData: data.maindata
        });
    }
}

export const loadDetailValue = () =>{
    return (dispatch, getState) => {
        const params = getState().workflowReq.get("params").toJS();
        const tableInfo = getState().workflowReqForm.getIn(["conf","tableInfo"]);
        let detailmark = "";
        tableInfo.map((v,k) => {
            if(k !== "main")
                detailmark += k+",";
        });
        if(detailmark !== "") {
            API_REQ.loadDetailData({
                requestid: params.requestid,
                workflowid: params.workflowid,
                nodeid: params.nodeid,
                formid: params.formid,
                isbill: params.isbill,
                ismode: params.ismode,
                modeid: params.modeid,
                detailmark: detailmark.substring(0,detailmark.length-1)
            }).then((data)=>{
                dispatch({type: types.REQFORM_SET_DETAILVALUE, detailData:data});
                //DOM都渲染后加载代码块
                dispatch(loadScript(params));
            });
        }else {
            dispatch(loadScript(params));
        }
    }
}

export const loadScript = (params)=> {
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
				}
				else {
					return API_REQ.loadCustompage({
						custompage:data.custompagee9,
						custompageparam:params.hiddenarea
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

//修改字段值
export const changeFieldValue = (fieldInfo, valueInfo) =>{
    return (dispatch, getState) => {
        const tableMark = fieldInfo.tableMark;
        const fieldid = fieldInfo.fieldid;
        if(tableMark === "main"){
            dispatch(changeMainFieldsValue({[`field${fieldid}`]: valueInfo}));
        }else{
            dispatch(changeDetailFieldsValue({[`field${fieldid}`]: valueInfo}, tableMark, fieldInfo.rowIndex));
        }
    }
}

//修改Redux主表字段值，可多个同时修改
export const changeMainFieldsValue = fieldsValue =>{
    return (dispatch, getState) => {
        dispatch({type:types.REQFORM_CHANGE_MAIN_VALUE, fieldsValue});
    }
}

//修改Redux某个明细表某行字段值，可多个同时修改
export const changeDetailFieldsValue = (fieldsValue, detailMark, rowIndex) =>{
    return (dispatch, getState) => {
        dispatch({type:types.REQFORM_CHANGE_DETAIL_VALUE, fieldsValue, detailMark, rowIndex});
    }
}

const getFieldValue = (fieldid, tableMark, rowIndex) =>{
    if(tableMark === "main"){

    }
}

//页面加载初始化时触发联动
export const initTriLinkage = (fieldInfo) =>{
    return (dispatch, getState) => {

    }
}

//触发联动
export const triggerAllLinkage = (fieldInfo) =>{
    return (dispatch, getState) => {
        console.log("triggerAllLinkage",fieldInfo);
        dispatch(triViewAttrLinkage(fieldInfo));    //显示属性联动
    }
}

//显示属性联动
export const triViewAttrLinkage = (fieldInfo) =>{
    return (dispatch, getState) => {
        const tableMark = fieldInfo.tableMark;
        const triFieldid = fieldInfo.fieldid;
        const isdetail = tableMark.indexOf("detail")>-1 ? 1 : 0;
        const viewAttrCfg = getState().workflowReqForm.getIn(["conf","linkageCfg","viewAttrCfg"]);
        if(!viewAttrCfg || !viewAttrCfg.has(`${triFieldid}_${isdetail}`))
            return;

        const cfg = viewAttrCfg.get(`${triFieldid}_${isdetail}`);
        const relatedFields = cfg.get("related");
        console.log("cfg-",cfg.toJS());
    }
}
