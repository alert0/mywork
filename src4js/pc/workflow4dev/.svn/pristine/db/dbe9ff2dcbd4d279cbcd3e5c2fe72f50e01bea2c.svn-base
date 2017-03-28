import * as types from '../constants/ActionTypes'
import * as API_LIST from '../apis/list'
import * as API_TABLE from '../apis/table'

import {Modal} from 'antd'
import objectAssign from 'object-assign'

import cloneDeep from 'lodash/cloneDeep'

import {WeaTools} from 'ecCom'
import Immutable from 'immutable'

//记录当前流程页
export const setNowRouterWfpath = value => {
	return {type: types.SET_NOW_ROUTER_PATH,path:value}
}


//初始化流程首页待办流程
export const initDatas = params => {
	return(dispatch, getState) => {
		const { ls } = WeaTools;
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		const { paramsBase,searchParams} = getState()['workflow' + viewScope].toJS();
		API_LIST.getWfRequestList({ ...paramsBase, ...{ actiontype: "baseinfo" } }).then((data) => {
			const { countcfg, groupinfo, pagetitle, treedata, conditioninfo } = data;
			ls.set(viewScope + "leftTree", treedata);
			dispatch({
				type: `${viewScope}_` + types.INIT_BASE,
				topTab: groupinfo,
				leftTree: treedata,
				leftTreeCountType: countcfg,
				title: pagetitle,
				conditioninfo: conditioninfo
			});
		});
		const newParams = {...paramsBase, ...searchParams, ...params};
		const key = newParams.method==="reqeustbytype" ? `type_${newParams.wftype}` : (newParams.method==="reqeustbywfid" ? `wf_${newParams.workflowid}` : '');
		API_LIST.getWfRequestList({ ...paramsBase, ...{ actiontype: "countinfo" } }).then((data) => {
			dispatch({
				type: `${viewScope}_` + types.INIT_COUNT,
				leftTreeCount: data.treecount,
				topTabCount: key ? data.treecount[key] : data.totalcount
			});
		});
	}
}

//搜索
export const doSearch = (params = {}) => {
	return(dispatch, getState) => {
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		const {paramsBase, searchParams, searchParamsAd, leftTreeCount } = getState()['workflow' + viewScope].toJS();

		const newParams = {...paramsBase, ...searchParams, ...searchParamsAd, ...params, ...{ actiontype: "splitpage" } };
		const key = newParams.method==="reqeustbytype" ? `type_${newParams.wftype}` : (newParams.method==="reqeustbywfid" ? `wf_${newParams.workflowid}` : '');
		key && dispatch({
			type: `${viewScope}_` + types.INIT_TOPTABCOUNT,
			topTabCount: leftTreeCount[key]
		});

		API_LIST.getWfRequestList(newParams).then((data) => {
			dispatch({
				type: `${viewScope}_` + types.INIT_DATAKEY,
				searchParams: {...paramsBase, ...searchParams, ...params },
				dataKey: data.sessionkey,
				sharearg: data.sharearg
			});
			dispatch(getDatas(data.sessionkey, params.current || 1));
		});
	}
}

//获取table数据
export const getDatas = (dataKeyNow,currentNow,pageSizeNow,sorter) => {
    return (dispatch, getState) => {
    	const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
        dispatch({type: viewScope + '_' + types.LOADING,loading:true});
		dispatch(setSelectedRowKeys([]));
        const {dataKey,pageSize,current,sortParams} = getState()['workflow' + viewScope].toJS();

        const newDataKey = dataKeyNow===""?dataKey:dataKeyNow;
        const pageSizeChange = pageSizeNow && pageSizeNow !== pageSize;
        const newPageSize = pageSizeNow ? pageSizeNow : pageSize;
        const newCurrent = pageSizeChange ? 1 : (currentNow ? currentNow : current);
        const newSortParams = sorter && sorter.column ? [{orderkey:sorter.column.orderkey,sortOrder:sorter.order}] : [];


        const doGetAPI = () => {
	        Promise.all([
	            API_TABLE.getTableDatas({dataKey:dataKey,current: newCurrent,sortParams:JSON.stringify(newSortParams)}).then((data)=>{
	                dispatch({type: viewScope + '_' + types.INIT_DATAS,datas:data.datas,columns:data.columns,pageSize:data.pageSize,current:newCurrent,sortParams:newSortParams,operates:data.ops,tableCheck:data.haveCheck,pageAutoWrap:data.pageAutoWrap});
	                return data;
	            }),
	            API_TABLE.getTableCounts({dataKey:newDataKey}).then((data)=>{
	                dispatch({type: viewScope + '_' + types.INIT_SET,count:data.count});
	                return data;
	            })
	        ]).then(result =>{
	        	const {ops} = result[0];
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
		                dispatch({type: viewScope + '_' + types.RESET_DATAS, newDatas:data.datas});
		            });
	        	}
	        });
        }
        pageSizeChange ? API_TABLE.setTablePageSize({dataKey,pageSize:newPageSize}).then(data =>{
        	doGetAPI();
        }) : doGetAPI();

    }
}

//选中row
export const setSelectedRowKeys = value => {
	return (dispatch, getState) => {
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		dispatch({type: viewScope + '_' + types.SET_SELECTED_ROWKEYS,selectedRowKeys:value})
	}
}

//树选中
export const setSelectedTreeKeys = value => {
	return (dispatch, getState) => {
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		dispatch({type: viewScope + '_' + types.SET_SELECTED_TREEKEYS,selectedTreeKeys:value})
	}
}


//左侧树搜索
export const setLeftTreeShow = value => {
	return (dispatch, getState) => {
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		dispatch({type: viewScope + '_' + types.SET_LEFT_TREE_SHOW,value:value})
	}
}

//高级搜索表单内容
export const saveOrderFields = (value = {}) => {
	return (dispatch, getState) => {
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		dispatch({type: viewScope + '_' + types.SAVE_ORDER_FIELDS,value:value})
	}
}

//清除左侧树
export const clearLeftTree = () => {
	return (dispatch, getState) => {
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		dispatch({type: viewScope + '_' + types.CLEAR_LEFTTREE})
	}
}

//组件卸载时是否需要清除的数据
export const isClearNowPageStatus = bool => {
	return (dispatch, getState) => {
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		dispatch({type: viewScope + '_' + types.CLEAR_PAGE_STATUS,isToReq:bool})
	}
}

//组件卸载时需要清除的数据
export const unmountClear = bool => {
	return (dispatch, getState) => {
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		dispatch({type: viewScope + '_' + types.UNMOUNT_CLEAR,isToReq:bool})
	}
}

//高级搜索受控
export const setShowSearchAd = bool =>{
	return (dispatch, getState) => {
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		dispatch({type: viewScope + '_' + types.SET_SHOW_SEARCHAD,value:bool})
	}
}

//待办-点击批量提交
export const batchSubmitClick = params =>{
	return (dispatch, getState) => {
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		const {sharearg,datas} = getState()['workflow' + viewScope].toJS();
		if (sharearg.multisubmitnotinputsign == "0")		//弹窗输入签字意见
			dispatch(setShowBatchSubmit(true));
		else
			dispatch(batchSubmitWf("", params.checkedKeys));
	}
}

//待办-弹出批量提交
export const setShowBatchSubmit = bool =>{
	return (dispatch, getState) =>{
		dispatch({type: types.LISTDOING_SET_SHOW_BATCHSUBMIT, value: bool});
		dispatch(initPhrasesDatas());
	}
}

//待办-批量提交流程
export const batchSubmitWf = (remark,checkedKeys) =>{
	return (dispatch, getState) =>{
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
		const {datas} = getState()['workflow' + viewScope].toJS();
		dispatch({type: viewScope + '_' + types.LOADING,loading:true});
		API_LIST.OnMultiSubmitNew2(remark, checkedKeys, datas).then(data => {
			dispatch(initDatas());
			dispatch(doSearch());
		})
	}
}

//待办-批量提交-新增保存流程短语
export const savePhrasesText = (text) =>{
	return (dispatch, getState) =>{
		API_LIST.savePhrasesText(text).then(data => {
			dispatch(initPhrasesDatas({}));
		})
	}
}

//待办--加载流程短语数据
export const initPhrasesDatas = () =>{
	return (dispatch, getState) =>{
		API_LIST.loadPhrasesDatas({}).then(data =>{
			dispatch(operPhrases({phrasesDatas: data.phrasesDatas}));
		});
	}
}

//待办-显示流程短语
export const operPhrases = phrasesObj =>{
	return (dispatch, getState) =>{
		dispatch({type: types.LISTDOING_OPER_PHRASES, value: phrasesObj});
	}
}

export const setSpaForm = isSpaForm => {
	return (dispatch, getState) => {
		const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
	    const {ls} = WeaTools;
	    ls.set("isSpaForm",isSpaForm?"true":"false");
		dispatch({type: viewScope + '_' + types.SET_SPAFORM,isSpaForm:isSpaForm})
	}
}


//table自定义列接口数据
export const tableColSet = isInit => {
    return (dispatch, getState) => {
    	const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
        const {dataKey,colSetKeys} = getState()['workflow' + viewScope].toJS();
        const method= isInit ? 'GET' :'POST';
        dispatch({type: viewScope + '_' + types.LOADING,loading:true});
        API_TABLE.tableColSet(isInit ? {dataKey:dataKey} : {dataKey:dataKey,systemIds:`${colSetKeys}`},method).then(data=>{
        	if(data.status){
	        	if(data.destdatas){
	        		let keys = [];
	        		data.destdatas.map(d => {keys.push(d.id)});
	        		datas = [].concat(data.destdatas).concat(data.srcdatas);
	        		newDatas = [];
	        		datas.map(d => newDatas.push({key:d.id, name:d.name, description: d.name}))
		            dispatch({type: viewScope + '_' + types.TABLE_COL_SET,colSetKeys:keys,colSetdatas:newDatas});
        			dispatch({type: viewScope + '_' + types.LOADING,loading:false});
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
    	const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
    	const {colSetdatas} = getState()['workflow' + viewScope].toJS();
	    dispatch({type: viewScope + '_' + types.TABLE_COL_SET,colSetKeys:keyArr,colSetdatas:colSetdatas});
    }
}

//table自定义列visible
export const setColSetVisible = bool => {
    return (dispatch, getState) => {
    	const viewScope = getState().workflowlistDoing.get('nowRouterWfpath');
	    dispatch({type: viewScope + '_' + types.TABLE_COL_SET_VISIBLE,value:bool});
    }
}
