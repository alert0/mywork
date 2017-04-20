import * as types from '../constants/ActionTypes'
import * as API_REQ from '../apis/req'
import Immutable from 'immutable'

const List = Immutable.List;

//初始化签字意见查询参数
export const initLogParams = (formParams) => {
	return (dispatch, getState) => {
		const loadmethod = formParams.signListType ? 'scroll' : 'split';
		let logParamsInit = {
			requestid:formParams.requestid,
			pgnumber:1,
			firstload:true,
			maxrequestlogid:0,
			loadmethod:loadmethod,
			submit:formParams.requestType,
			workflowid:formParams.workflowid,
			nodeid:formParams.nodeid
		};
		dispatch(setlogParams(logParamsInit));
	}
}

//设置签字意见分页信息
export const setlogParams = params => {
	return (dispatch, getState) => {
		dispatch({type:types.LOGLIST_SET_LOG_PARAMS,logParams:params});
		dispatch(setMarkInfo());
	}
}

//设置签字意见信息
export const setMarkInfo = () => {
	return (dispatch, getState) => {
		let logParams = getState().workflowReqLogList.get('logParams').merge(getState().workflowReqLogList.get('logSearchParams')).toJS();
		
		//第二次加载签字意见时会导致参数过长报错问题
		let requestLogParams = logParams.requestLogParams;
		if(requestLogParams){
			requestLogParams = JSON.parse(requestLogParams);
			requestLogParams.allrequestInfos = [];
			requestLogParams.viewnodes = [];
			logParams.requestLogParams = JSON.stringify(requestLogParams);
		}
		let logCount = getState().workflowReqLogList.get('logCount');
		dispatch(setIsLoadingLog(true));
		API_REQ.loadRequestLog(logParams).then(data=>{
			let value = data;
			let templogparams  = value.requestLogParams ? {requestLogParams: JSON.stringify(value.requestLogParams),logpagesize: value.requestLogParams.wfsignlddtcnt} : {};
			templogparams.maxrequestlogid = value.maxrequestlogid;
			dispatch({type:types.LOGLIST_SET_MARK_INFO,logList:value.log_loglist,logCount:value.totalCount ? value.totalCount : logCount,logParams:templogparams});
			{!logParams.requestLogParams &&
				dispatch(setIsShowUserheadimg(value.requestLogParams.txStatus == '1'));
			}
			dispatch(setIsLoadingLog(false));
		});
	}
}


//设置签字意见页码
export const setLogPagesize = params => {
	return (dispatch, getState) => {
		let paramsNew = {logpagesize:params.logpagesize};
		dispatch({type:types.LOGLIST_FORM_LOADING,loading:true});
		API_REQ.updateRequestLogPageSize(paramsNew).then(data=>{
			let logParamsInit = {
				pgnumber:1,
				firstload:true,
				maxrequestlogid:0,
				loadmethod:'split'
			};
			logParamsInit.logpagesize = params.logpagesize;
			dispatch(setlogParams(logParamsInit));
			dispatch({type:types.LOGLIST_FORM_LOADING,loading:false});
		});
	}
}


//设置签字意见tabkey
export const setLoglistTabKey = (key,reqRequestId) => {
	return {type:types.LOGLIST_SET_LOGLIST_TABKEY,logListTabKey:key,reqRequestId:reqRequestId}
	
}


//修改是否显示签字意见操作者头像
export const setIsShowUserheadimg = bool =>{
	return {type:types.LOGLIST_IS_SHOW_USER_HEAD_IMG,bool:bool};
}

export const updateUserTxStatus = bool =>{
	return(dispatch, getState) => {
		API_REQ.updateUserTxStatus({
			txstatus:bool?'1':'0'
		}).then(data=>{
			dispatch(setIsShowUserheadimg(bool));
		});
	}
}



//签字意见搜索表单内容
export const saveSignFields = value => {
	return (dispatch, getState) => {
		dispatch({type: types.LOGLIST_SAVE_SIGN_FIELDS,value:value})
	}
}


//签字意见搜索表单内容显示
export const setShowSearchDrop = value => {
	return (dispatch, getState) => {
		dispatch({type: types.LOGLIST_SET_SHOW_SEARCHDROP,value:value})
	}
}

//控制签字意见是否显示所有操作者
export const setShowUserlogid = logid =>{
	return (dispatch, getState) => { 
		if(logid == ''){
			dispatch({type:types.LOGLIST_UPDATE_SHOW_USER_LOGID,showuserlogids:[]});
		}else{
			let showuserlogids = getState().workflowReqLogList.get('showuserlogids').toJS();
			const index = showuserlogids.indexOf(logid);
			if(index > -1){
				showuserlogids = List(showuserlogids).delete(index).toJS();
			}else{
				showuserlogids.push(logid);
			}
			dispatch({type:types.LOGLIST_UPDATE_SHOW_USER_LOGID,showuserlogids:showuserlogids});
		}
	}
}

//加载签字意见主子流程签字意见
export const loadRefReqSignInfo = (params) =>{
	return (dispatch, getState) => { 
		dispatch({type:types.LOGLIST_SET_REL_REQ_LOG_PARAMS,relLogParams:params});
		let logParams = getState().workflowReqLogList.get('relLogParams').merge(getState().workflowReqLogList.get('logSearchParams')).toJS();
		API_REQ.loadRequestLog(logParams).then(data=>{
			let value = data;
			dispatch({type:types.LOGLIST_SET_MARK_INFO,logList:value.log_loglist,logCount:value.totalCount ? value.totalCount : 0});
			dispatch(setmaxrequestlogid(value.maxrequestlogid,true));
		});
	}
}

export const setmaxrequestlogid = (maxrequestlogid,isrefreqtab) =>{
	if(isrefreqtab){
		return {type:types.LOGLIST_SET_REL_REQ_LOG_PARAMS,relLogParams:{maxrequestlogid:maxrequestlogid}};
	}else{
		return {type:types.LOGLIST_SET_LOG_PARAMS,logParams:{maxrequestlogid:maxrequestlogid}};
	}
}


//滚动加载签字意见
export const scrollLoadSign = (params) => {
	return (dispatch, getState) => {
		dispatch(setIsLoadingLog(true));
		const logListTabKey = getState().workflowReqLogList.get('logListTabKey');
		let logParams = {};
		if(logListTabKey > 2 ) {
			dispatch({type:types.LOGLIST_SET_REL_REQ_LOG_PARAMS,relLogParams:params});
			logParams = getState().workflowReqLogList.get('relLogParams').merge(getState().workflowReqLogList.get('logSearchParams')).toJS();
		}else{
			dispatch({type:types.LOGLIST_SET_LOG_PARAMS,logParams:params});		
			logParams = getState().workflowReqLogList.get('logParams').merge(getState().workflowReqLogList.get('logSearchParams')).toJS();
			let requestLogParams = logParams.requestLogParams;
			if(requestLogParams){
				requestLogParams = JSON.parse(requestLogParams);
				requestLogParams.allrequestInfos = [];
				requestLogParams.viewnodes = [];
				logParams.requestLogParams = JSON.stringify(requestLogParams);
			}
		}
		API_REQ.loadRequestLog(logParams).then(data=>{
			const logList = getState().workflowReqLogList.get('logList');
			let logListnew = logList.concat(Immutable.fromJS(data.log_loglist));
			dispatch({type:types.LOGLIST_SET_SCROLL_MARK_INFO,logList:logListnew});
			dispatch(setmaxrequestlogid( data.maxrequestlogid,logListTabKey > 2));
			dispatch(setIsLoadingLog(false));
		});
	}
}

export const setIsLoadingLog = bool =>{
	return (dispatch, getState) => {
		dispatch({type:types.LOGLIST_IS_LOADING_LOG,bool:bool});
	}
}

export const clearLogData = () => {
	return (dispatch, getState) => {
		const logListTabKey = getState().workflowReqLogList.get('logListTabKey');
		dispatch(setmaxrequestlogid(0,logListTabKey > 2));
		dispatch({type:types.LOGLIST_CLEAR_LOG_DATA});
	}
}