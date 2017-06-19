import * as types from '../constants/ActionTypes'
import * as QUERY_FLOW from '../apis/queryFlow'
import * as API_TABLE from '../apis/table'

import {WeaTable} from '../../coms/index'

const WeaTableAction = WeaTable.action;

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
        	dispatch(WeaTableAction.getDatas(data.sessionkey, params.current || 1));
            dispatch({type: types.QUERY_FLOW_SEARCH_RESULT, value: data.sessionkey});
            //dispatch(getDatas(data.sessionkey, params.current || 1));
        })
    }
}

export const setShowSearchAd = (value) => {
    return (dispatch, getState) => {
        dispatch({type: types.QUERY_FLOW_SET_SHOW_SEARCHAD, value: value})
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

