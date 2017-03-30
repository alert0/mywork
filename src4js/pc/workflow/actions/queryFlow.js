import * as types from '../constants/ActionTypes'
import * as QUERY_FLOW from '../apis/queryFlow'
import * as API_TABLE from '../apis/table'

import {WeaTools} from 'ecCom'
import {Modal} from 'antd'

//初始化查询流程
export const initDatas = (params) => {
    return (dispatch, getState) => {
        const {ls} = WeaTools;
        QUERY_FLOW.getQueryFieldsList().then((data)=>{
            ls.set("queryFlowFieldsList", data.condition);
            dispatch({type: types.QUERY_FLOW_INIT_BASE, value: data.condition});
        });
    }
}

//初始化查询结果树
export const initTree = (params = {}) => {
    return (dispatch, getState) => {
    	const {ls} = WeaTools;
        QUERY_FLOW.queryFieldsTree(params).then((data)=>{
            ls.set("queryFlowleftTree", data.treedata);
            dispatch({type: types.QUERY_FLOW_INIT_TREE, value: data.treedata});
        })
	}
}

//树选中
export const setSelectedTreeKeys = (value = []) => {
	return (dispatch, getState) => {
		dispatch({type: types.QUERY_FLOW_SET_SELECTED_TREEKEYS,value:value})
	}
}


//查询参数
export const setSearchParams = (params = {}) => {
    return (dispatch, getState) => {
          dispatch({type: types.QUERY_FLOW_SET_SEARCH_PARAMS, value: params});
	}
}

// 查询流程表单内容
export const saveFields = (value = {}) => {
    return (dispatch, getState) => {
        dispatch({type: types.QUERY_FLOW_SAVE_FIELDS, value: value})
    }
}

export const updateDisplayTable = (value) => {
    return (dispatch, getState) => {
        dispatch({type: types.QUERY_FLOW_UPDATE_DISPLAY_TABLE, value: value})
    }
}

export const doSearch = (params = {}) => {
    return (dispatch, getState) => {
    	const {searchParamsAd,searchParams} = getState()['workflowqueryFlow'].toJS();
        QUERY_FLOW.queryFieldsSearch(params.jsonstr ? params : {...searchParams,...searchParamsAd}).then((data)=>{
            dispatch({type: types.QUERY_FLOW_SEARCH_RESULT, value: data.sessionkey});
            dispatch(getDatas(data.sessionkey, params.current || 1));
        })
    }
}

export const setShowSearchAd = (value) => {
    return (dispatch, getState) => {
        dispatch({type: types.QUERY_FLOW_SET_SHOW_SEARCHAD, value: value})
    }
}

//选中row
export const setSelectedRowKeys = (value = []) => {
	return (dispatch, getState) => {
		dispatch({type: types.QUERY_FLOW_SET_SELECTED_ROWKEYS,selectedRowKeys:value})
	}
}

//查询-批量共享
export const batchShareWf = (ids = '') => {
    return (dispatch, getState) =>{
        let eh_dialog = null;
        if(window.top.Dialog)
            eh_dialog = new window.top.Dialog();
        else
            eh_dialog = new Dialog();
        eh_dialog.currentWindow = window;
        eh_dialog.Width = 650;
        eh_dialog.Height = 500;
        eh_dialog.Modal = true;
        eh_dialog.maxiumnable = false;
        eh_dialog.Title = "批量共享";
        eh_dialog.URL = "/workflow/request/AddWorkflowBatchShared.jsp?ids="+ids;
        eh_dialog.show();
    }
}

//获取查询流程table数据
export const getDatas = (dataKeyNow,currentNow,pageSizeNow,sorter) => {
    return (dispatch, getState) => {
        dispatch({type: types.QUERY_FLOW_LOADING, loading: true});
        const {dataKey,pageSize,current,sortParams} = getState()['workflowqueryFlow'].toJS();
		dispatch(setSelectedRowKeys([]));

        const newDataKey = dataKeyNow===""?dataKey:dataKeyNow;
        const pageSizeChange = pageSizeNow && pageSizeNow !== pageSize;
        const newPageSize = pageSizeNow ? pageSizeNow : pageSize;
        const newCurrent = pageSizeChange ? 1 : (currentNow ? currentNow : current);
        const newSortParams = sorter && sorter.column ? [{orderkey:sorter.column.orderkey,sortOrder:sorter.order}] : [];

        const doGetAPI = () => {
		    Promise.all([
		        API_TABLE.getTableDatas({dataKey:dataKey,current: newCurrent,sortParams:JSON.stringify(newSortParams)}).then((data)=>{
		            dispatch({type: types.QUERY_FLOW_INIT_DATAS, datas:data.datas,columns:data.columns,pageSize:data.pageSize,current:newCurrent,sortParams:newSortParams,operates:data.ops,tableCheck:data.haveCheck,pageAutoWrap:data.pageAutoWrap});
		            return data;
		        }),
		        API_TABLE.getTableCounts({dataKey:newDataKey}).then((data)=>{
		            dispatch({type: types.QUERY_FLOW_INIT_SET,count:data.count});
		            return data;
		        })
		    ]).then((result)=>{
		        if(result[0].haveCheck || (ops && ops.length>0)){
		            const {columns,datas} = result[0];
		            let newDatas = new Array();
		            for(let i=0;i<datas.length;i++) {
		                const data = datas[i];
		                let newData = {};
		                for(let j=0;j<columns.length;j++) {
		                    let column = columns[j];
		                    if((column.from&&column.from==="set")||column.dataIndex==="randomFieldId") {
		                        newData[column.dataIndex] = data[column.dataIndex];
		                    }
		                }
		                newDatas.push(newData);
		            }
		            API_TABLE.getTableChecks({randomDatas:JSON.stringify(newDatas),dataKey:dataKey}).then((data)=>{
		                dispatch({type: types.QUERY_FLOW_RESET_DATAS, newDatas:data.datas});
		            });
		        }
		    });
		}
        pageSizeChange ? API_TABLE.setTablePageSize({dataKey,pageSize:newPageSize}).then(data =>{
        	doGetAPI();
        }) : doGetAPI();
    }
}


//table自定义列接口数据
export const tableColSet = isInit => {
    return (dispatch, getState) => {
        const {dataKey,colSetKeys} = getState()['workflowqueryFlow'].toJS();
        const method= isInit ? 'GET' :'POST';
        dispatch({type: types.QUERY_FLOW_LOADING,loading:true});
        API_TABLE.tableColSet({dataKey:dataKey,systemIds:`${colSetKeys}`},method).then(data=>{
        	if(data.status){
	        	if(data.destdatas){
	        		let keys = [];
	        		data.destdatas.map(d => {keys.push(d.id)});
	        		datas = [].concat(data.destdatas).concat(data.srcdatas);
	        		newDatas = [];
	        		datas.map(d => newDatas.push({key:d.id, name:d.name, description: d.name}))
		            dispatch({type: types.QUERY_FLOW_TABLE_COL_SET,colSetKeys:keys,colSetdatas:newDatas});
        			dispatch({type: types.QUERY_FLOW_LOADING,loading:false});
	        	}else{
			        dispatch(setColSetVisible(false));
			        dispatch(setTableColSetkeys([]));
	        		dispatch(doSearch());
	        	}
        	}else{
        		Modal.error({
        			title: '接口错误，请重新提交',
        		});
        	}
        });
    }
}

//table自定义列显示项
export const setTableColSetkeys = keyArr => {
    return (dispatch, getState) => {
    	const {colSetdatas} = getState()['workflowqueryFlow'].toJS();
	    dispatch({type: types.QUERY_FLOW_TABLE_COL_SET,colSetKeys:keyArr,colSetdatas:colSetdatas});
    }
}

//table自定义列visible
export const setColSetVisible = bool => {
    return (dispatch, getState) => {
	    dispatch({type: types.QUERY_FLOW_TABLE_COL_SET_VISIBLE,value:bool});
    }
}
