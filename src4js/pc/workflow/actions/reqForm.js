import * as types from '../constants/ActionTypes'
import * as API_REQ from '../apis/req'
import Immutable from 'immutable'

export const initFormInfo = (data) =>{
    return (dispatch, getState) => {
        dispatch({
            type: types.REQFORM_INIT_INFO,
            formLayout: data.datajson,
            tableInfo: data.tableinfo,
            cellInfo: data.cellinfo,
            linkageCfg: data.linkageCfg,
            formValue: data.maindata
        });
    }
}

export const loadDetailValue = () =>{
    return (dispatch, getState) => {
        const params = getState().workflowReq.get("params").toJS();
        const tableInfo = getState().workflowReqForm.get("tableInfo");
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
                dispatch({type: types.REQFORM_SET_DETAILVALUE,formValue4Detail:data});
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