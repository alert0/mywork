import * as types from '../constants/ActionTypes'
import * as API_ADD from '../apis/add'
import Immutable from 'immutable'
import {message} from 'antd';

//初始化
export const initDatas = params => {
	return dispatch => {
		dispatch({type:types.SET_ADD_LOADING,data:true});
		API_ADD.doWfInfoGet(params).then((datas)=>{
			dispatch({type:types.SET_WFTYPES,data:datas})
			//dispatch({type:types.SET_ADD_LOADING,data:false});
			dispatch(setUpdate());
		});
	}
}

//搜索
export const setSearchValue = value =>{
	return dispatch => {
		dispatch({type:types.SET_SEARCH_VALUE,data:value});
		dispatch(setUpdate());
	}
}

//tab切换key
export const changeTab = value =>{
	return dispatch => {
		dispatch({type:types.SET_TABKEY,data:value});
		dispatch(setAbcSelected(''));
		dispatch(setUpdate());
	}
}

//切换列数
export const setMulitcol = value =>{
	return dispatch => {
		dispatch({type:types.SET_MULITCOL,data:value});
		dispatch(setUpdate());
	}
}

//是否abc
export const setIsAbc = value =>{
	return dispatch => {
		dispatch({type:types.SET_ISABC,data:value});
		dispatch(setUpdate());
	}
}

//设置选中按钮
export const setAbcSelected = value =>{
	return dispatch => {
		dispatch({type:types.SET_ABC_SELECTED,data:value});
		dispatch(setUpdate());
	}
}

//设置展示单列表
export const setTypesShow = () =>{
	return {type:types.SET_TYPES_SHOW}
}

//设置展示四列
export const setTypesCols = () =>{
	return {type:types.SET_TYPES_COLS}
}

//设置常用列表
export const setUsedBens= () =>{
	return {type:types.SET_USED_BEANS}
}

//刷新数据
export const setUpdate= () =>{
	return dispatch => {
		dispatch(setTypesShow());
		dispatch(setTypesCols());
		dispatch(setUsedBens());
	}
}

//收藏
export const doAddWfToColl = (wfbean,colected) => {
	return (dispatch,getState) => {
		const curwfid = wfbean.get("id");
		const curtypeid = wfbean.get("typeId");
		const wftypes = getState().workflowAdd.get("wftypes");
		API_ADD.doAddWfToColl({'workflowid':"W"+curwfid,"worktypeid":"T"+curtypeid,"needall":colected}).then(datas=>{
			let wftypesObj = [].concat(wftypes.toJS());
			wftypesObj.map(t=>{
				if(t.id == curtypeid){
					t.wfbeans.map(w=>{
						if(w.id == curwfid){
							w.wfColl = colected;
							t.wftypeColl = colected;
						}
					})
				}
			});
			dispatch({type:types.SET_WFTYPES,data:wftypesObj});
			message.info(colected == '0' ? '取消收藏成功' : '加入收藏成功');
			dispatch(setUpdate());
		});
	}
}

//获取流程导入数据
export const getImportData = params => {
	return dispatch => {
		API_ADD.getRequestImportData(params).then(datas=>{
			dispatch({type:types.SET_IMPORT_DATA,data:datas});
			dispatch(setShowImportWf(params.workflowid, true));
			dispatch({type:types.SET_IMPORT_DATA_SHOW});
		})
	}
}

//搜索导入流程
export const setImportSearchValue = value =>{
	return dispatch => {
		dispatch({type:types.SET_IMPORT_SEARCH_VALUE,data:value});
		dispatch({type:types.SET_IMPORT_DATA_SHOW});
	}
}

//设置展示代理身份创建区域
export const setShowBeagenters = (wfid, status) =>{
	return dispatch => {
		dispatch({type:types.SET_SHOW_BEAGENTERS, wfid:wfid, status:status});
	}
}

//设置展示流程导入区域
export const setShowImportWf = (wfid, status) =>{
	return dispatch => {
		dispatch({type:types.SET_SHOW_IMPORTWF, wfid:wfid, status:status});
		if(!status)		//隐藏时清除可导入流程数据
			dispatch({type:types.SET_IMPORT_DATA, data:[]});
	}
}