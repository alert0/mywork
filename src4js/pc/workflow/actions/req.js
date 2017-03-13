import { Modal,message} from 'antd';
const confirm = Modal.confirm;
const success = Modal.success;
const warning = Modal.warning;

import * as types from '../constants/ActionTypes'
import * as API_REQ from '../apis/req'
import * as API_TABLE from '../apis/table'
import objectAssign from 'object-assign'
import Immutable from 'immutable'

const List = Immutable.List;

//初始化表单
export const initFormLayout = (reqId,preloadkey,comemessage) => {
	return (dispatch, getState) => {
		dispatch({type: types.SET_RESOURCES_KEY,key:{'key0':''}});
		dispatch({type:types.SET_RESOURCES_DATAS,pageSize:10,current:1,tabKey:'0',datas:{'key0':[],'key1':[],'key2':[],'key3':[]}});
		dispatch({type: types.SET_RESOURCES_SET,count:{'key0':0,'key1':0,'key2':0,'key3':0}});
		dispatch({type:types.FORM_LOADING,loading:true});
		const apiLoadStart = new Date().getTime();
		API_REQ.getFormReqInfo({
			actiontype:"loadRight",
			requestid: reqId,
			preloadkey: preloadkey,
			comemessage:comemessage
		}).then((data)=>{
			const params = data;
			const dispatchStart = new Date().getTime();
			const apiDuration = dispatchStart - apiLoadStart;
//			dispatch({type: types.INIT_FORMLAYOUT,});
			dispatch({type: types.INIT_FORMVALUE,params:params,formLayout:data.datajson,formValue:data.maindata,cellInfo:data.cellinfo,tableInfo:data.tableinfo,linkageCfg:data.linkageCfg});
			
			//性能测试
			dispatch({type: 'TEST_PAGE_LOAD_DURATION',
				reqLoadDuration:(new Date().getTime() - (window.REQ_PAGE_LOAD_START ? window.REQ_PAGE_LOAD_START : 0)),
				jsLoadDuration: window.JS_LOAD_DURATION ? window.JS_LOAD_DURATION : 0,
				apiDuration: apiDuration,
				dispatchDuration: new Date().getTime() - dispatchStart
			})
			
			formImgLazyLoad(jQuery('.wea-new-top-req-content'));        //图片懒加载
			const tableinfo = data.tableinfo;
			let details = "";
			for(p in tableinfo) {
				if(p!=="main") {
					details += p+",";
				}
			}
			if(details!="") {
				details = details.substring(0,details.length-1);
			}
			if(details!=="") {
				//console.log("details:",details);
				API_REQ.getFormReqInfo({
					actiontype:"detaildata",
					requestid:reqId,
					workflowid:params.workflowid,
					nodeid:params.nodeid,
					formid:params.formid,
					isbill:params.isbill,
					ismode:params.ismode,
					modeid:params.modeid,
					detailmark:details
				}).then((data)=>{
					//console.log("getFormLayout detail:",data);
					dispatch({type: types.INIT_FORMVALUE4DETAIL,formValue4Detail:data});
					//typeof window.FormReady === "function" && window.FormReady();
					dispatch(loadScript(params));
				});
			}
			else {
				dispatch(loadScript(params));
				//typeof window.FormReady === "function" && window.FormReady();
			}
			
			//获取右键菜单
			API_REQ.getFormReqInfo({
				actiontype:"rightMenu",
				requestid:reqId,
				isviewonly:1,
				ismanagePage:params.ismanagePage
			}).then(data=>{
				dispatch(setRightMenuInfo(data));
			});
			
			//其它处理，前端不用处理
			API_REQ.getFormReqInfo({
				actiontype:"updatereqinfo",
				requestid:reqId,
				ismanagePage:params.ismanagePage,
				currentnodetype:params.currentnodetype,
				wfmonitor:params.wfmonitor,
				isurger:params.isurger
			}).then(data=>{});
			
			let logParamsInit = {
				actiontype:"requestLog",
				requestid:reqId,
				pgnumber:1,
				firstload:true,
				maxrequestlogid:0,
				loadmethod:'split',
				submit:params.ismanagePage,
				workflowid:params.workflowid,
				nodeid:params.nodeid
			};
			dispatch(setlogParams(logParamsInit));

			// //加载代码块
			// API_REQ.loadScriptContent({
			// 	layoutid:params.modeid,
			// 	usebak:1
			// }).then(scriptcontent =>{
			// 	dispatch({type:types.SET_LAYOUT_SCRIPTS,scriptcontent:scriptcontent});
			// });
			
			// //加载custompage
			// const custompage = params.custompage;
			// {custompage && 
			// 	API_REQ.getFormReqInfo({
			// 		actiontype:"copycustompagefile",
			// 		custompage:custompage,
			// 		workflowid:params.workflowid
			// 	}).then(data=>{
			// 		const custompagee9  = data.custompagee9;
			// 		{custompagee9 &&
			// 			API_REQ.loadCustompage({
			// 				custompage:custompagee9,
			// 				custompageparam:params.hiddenarea
			// 			}).then(custompagehtml=>{
			// 				dispatch(setCustompageHtml(custompagehtml));
			// 			});
			// 		}
			// 	});
			// }
		});
	}
}

export const loadScript = (params)=> {
	//console.log("loadScript!");
	return (dispatch, getState) => {
		Promise.all([
			API_REQ.loadScriptContent({
				layoutid:params.modeid,
				usebak:1
			}),
			API_REQ.getFormReqInfo({
				actiontype:"copycustompagefile",
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
			// dispatch({type:types.SET_LAYOUT_SCRIPTS,scriptcontent:result[0]});
			// dispatch(setCustompageHtml(result[1]));
			typeof window.formReady === "function" && window.formReady();
		});
	};
}

export const doLoading = () => {
	return {type:types.LOADING,loading:true}
}

export const clearForm = () => {
	return {type:types.CLEAR_FORM}
}

export const setCustompageHtml = (custompagehtml) => {
	return {type:types.SET_CUSTOMPAGE_HTML,custompagehtml:custompagehtml}
}

//设置表单tabkey
export const setReqTabKey = key => {
	return {type:types.SET_REQ_TABKEY,reqTabKey:key}
}
//设置签字意见信息
export const setMarkInfo = () => {
	return (dispatch, getState) => {
		let logParams = getState().workflowReq.get('logParams').merge(getState().workflowReq.get('logSearchParams')).toJS();
		let logCount = getState().workflowReq.get('logCount');
		API_REQ.getFormReqInfo(logParams).then(data=>{
			let value = data;
			dispatch({type:types.SET_MARK_INFO,logList:value.log_loglist,logCount:value.totalCount ? value.totalCount : logCount,logParams: value.requestLogParams ? {requestLogParams: JSON.stringify(value.requestLogParams),logpagesize: value.requestLogParams.wfsignlddtcnt} : {}});
			{!logParams.requestLogParams &&
				dispatch(setIsShowUserheadimg(value.requestLogParams.txStatus == '1'));
			}
		});
	}
}

//设置签字意见页码
export const setLogPagesize = params => {
	return (dispatch, getState) => {
		let paramsNew = {actiontype:'updateRequestLogPageSize'};
		paramsNew.logpagesize = params.logpagesize;
		dispatch({type:types.FORM_LOADING,loading:true});
		API_REQ.getFormReqInfo(paramsNew).then(data=>{
			let logParamsInit = {
				pgnumber:1,
				firstload:true,
				maxrequestlogid:0,
				loadmethod:'split'
			};
			logParamsInit.logpagesize = params.logpagesize;
			dispatch(setlogParams(logParamsInit));
			dispatch({type:types.FORM_LOADING,loading:false});
		});
	}
}

//设置签字意见分页信息
export const setlogParams = params => {
	return (dispatch, getState) => {
		dispatch({type:types.SET_LOG_PARAMS,logParams:params});
		dispatch(setMarkInfo());
	}
}

//设置签字意见tabkey
export const setLoglistTabKey = (key,reqRequestId) => {
	return {type:types.SET_LOGLIST_TABKEY,logListTabKey:key,reqRequestId:reqRequestId}
}

//设置签字意见输入框信息
export const setMarkInputInfo = value => {
	return {type:types.SET_MARK_INPUT_INFO,markInfo:value};
}

//设置右键菜单信息
export const setRightMenuInfo = value => {
	return {type:types.SET_RIGHT_MENU_INFO,rightMenu:value};
}

//流程状态
export const getWorkflowStatus= (reqId,isurger) => {
	return (dispatch, getState) => {
		//获取流程状态
		dispatch({type:types.FORM_LOADING,loading:true});
		API_REQ.getWorkflowStatus({
			requestid:reqId
//			isurger:isurger
		}).then(data=>{
			dispatch({type:types.SET_WORKFLOW_STATUS,workflowStatus:data});
		});
	}
}

//相关资源
export const getResourcesKey = requestid => {
	return (dispatch, getState) => {
    	dispatch({type:types.FORM_LOADING,loading:true});
		for(let i = 0;i < 4;i++){
			API_REQ.getResourcesKey({requestid:requestid,tabindex:i}).then((data)=>{
				let keyObj = {};
        		keyObj['key' + i] = data.sessionkey;
	            dispatch({type: types.SET_RESOURCES_KEY,key:keyObj});
	            i == 0 && dispatch(getResourcesDatas(i.toString(),1,10,true))
	        });
		}
	}
}
//获取相关资源table数据
export const getResourcesDatas = (tabindex, current, pageSizeNow, isInit) => {
    return (dispatch, getState) => {
        const {resourcesKey,resourcesPageSize,resourcesColumns,resourcesOperates,resourcesCount,resourcesTabKey} = getState().workflowReq.toJS();
        const newDataKey = resourcesKey['key' + tabindex];
        const newPageSize = pageSizeNow ? pageSizeNow : resourcesPageSize;
        
        const min = newPageSize*(current-1)+1;
        const max = newPageSize*current;
        dispatch({type:types.FORM_LOADING,loading:true});
	    dispatch({type: types.SET_RESOURCES_DATAS,pageSize:newPageSize,current:current,tabKey:(isInit ? resourcesTabKey: tabindex)});
        Promise.all([
	        API_TABLE.getTableDatas({dataKey:newDataKey,min:min,max:max}).then((data)=>{
	        	let dataObj = {};
	        	let columns = {};
	        	let ops = {};
	        	dataObj['key' + tabindex] = data.datas;
	        	columns['key' + tabindex] = data.columns;
	        	ops['key' + tabindex] = data.ops;
	            dispatch({type:types.SET_RESOURCES_DATAS,datas:dataObj,columns:columns,pageSize:newPageSize,ops:ops,current:current,tabKey:(isInit ? resourcesTabKey: tabindex)});
	            return data;
	        }),
	        API_TABLE.getTableCounts({dataKey:newDataKey}).then((data)=>{
	        	let count = {};
	        	count['key' + tabindex] = data.count;
	            dispatch({type: types.SET_RESOURCES_SET,count:count});
	        	tabindex == 0 && dispatch({type:types.FORM_LOADING,loading:false});
	        	return data;
	        })
        ]).then((result)=>{
	        const {columns,datas,ops} = result[0];
        	dispatch({type:types.FORM_LOADING,loading:false});
            if(result[0].haveCheck || (ops && ops.length>0)){
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
	            API_TABLE.getTableChecks({randomDatas:JSON.stringify(newDatas),dataKey:newDataKey}).then((data)=>{
	            	let dataObj = {};
	            	const {resourcesDatas} = getState().workflowReq.toJS();
	            	let resetDatas = resourcesDatas['key' + tabindex];
	            	const newRsDatas = data.datas;
	                for(let i=0;i<resetDatas.length;i++) {
	                    let find = false;
	                    let resetData = resetDatas[i];
	                    for(let j=0;j<newRsDatas.length&&!find;j++) {
	                        let newRsData = newRsDatas[j];
	                        if(newRsData.randomFieldId===resetData.randomFieldId) {
	                            for(let p in newRsData) {
	                                resetData[p] = newRsData[p];
	                            }
	                            find = true;
	                        }
	                    }
	                }
		        	dataObj['key' + tabindex] = resetDatas;
	                dispatch({type:types.SET_RESOURCES_DATAS,datas:dataObj,pageSize:newPageSize,current:current,tabKey:(isInit ? resourcesTabKey: tabindex)});
	            });
            }
        });
      
    }
}

//表单提交

//设置隐藏域参数
export const setHiddenArea = value => {
	return {type:types.SET_HIDDEN_AREA,hiddenarea:value};
}

export const getformdatas = () =>{
	return (dispatch, getState) => {
		const formValue = getState().workflowReq.get('formValue');
		let formarea = {};
        formValue.mapEntries && formValue.mapEntries(f => {
        	f[1].mapEntries(o =>{
        		if(o[0] == 'value') {
        			const fieldname = updateHiddenSysFieldname(f[0]);
        			formarea[fieldname] = o[1];
        		}
			});
        });
        return formarea;
	}
}

//表单提交
export const doSubmitE9 = (actiontype,src,needwfback) => {
	return (dispatch, getState) => {
		const formstate = getState().workflowReq.getIn(['params','hiddenarea']);
		const isSubmitDirectNode = formstate.get('isSubmitDirectNode');
		const lastnodeid  = formstate.get('lastnodeid');
		const needconfirm = formstate.get('needconfirm');
		const tnodetype  = formstate.get('nodetype');
		const fromFlowDoc  = formstate.get('fromFlowDoc');
		const isworkflowdoc  = formstate.get('isworkflowdoc');
		const isuseTemplate  = formstate.get('isuseTemplate');
		
		const isFormSignature = formstate.get('isFormSignature');
		const isHideInput = formstate.get('isHideInput');
		
		
		const formarea = dispatch(getformdatas());
		let params = objectAssign({},formarea,{src: src,needwfback:needwfback,RejectToNodeid:'',isFirstSubmit:'0'});
		if(src == 'submit'){
			params = objectAssign({},params,isSubmitDirectNode == "1" ? {SubmitToNodeid:lastnodeid} : {});
			
			if(needconfirm == "1" && tnodetype != "0"){
				confirm({
				    title: '确认提交流程吗？',
				    onOk() {
				    	dispatch(setHiddenArea(params));
				    	saveSignature_of_doSubmit();
				    	dispatch(doSubmitE9Api(actiontype,src,needwfback,params));
				    },
				    onCancel(){},
				});
			}else{
				dispatch(setHiddenArea(params));
				saveSignature_of_doSubmit();
				dispatch(doSubmitE9Api(actiontype,src,needwfback,params));
			}
		}else{
			dispatch(setHiddenArea(params));
			isFormSignature == "1" && isHideInput != "1" && typeof SaveSignature_save == "function" && SaveSignature_save();
			dispatch(doSubmitE9Api(actiontype,src,needwfback,params));
		}
	}
}

//签章
const saveSignature_of_doSubmit = () => {
	if(typeof SaveSignature == "function") {
		if(!SaveSignature()) {
		}
	}
}

//表单提交接口
export const doSubmitE9Api = (actiontype,src,needwfback,formdatas) => {
	return (dispatch, getState) => {
		const {isSignMustInput,isFormSignature} = getState().workflowReq.getIn(['params','signinputinfo']).toJS();
		let ischeckok = true;
		let remark  = '';
		
		//old
		if('submit' == src){
			try{
				if(!checkCustomize()){
					return false;
				}
			}catch(e){
			}
			try{
				if(!checkCarSubmit()){ // add by QC209437 2016-08-18
					return false;
				}
			}catch(e){
			}
		}
		
		const issubmit  = !(src == 'save' && actiontype == 'requestOperation');
		if(isSignMustInput == '1' && issubmit){
			let remarkcontent  = FCKEditorExt.getText("remark");
			//验证签字意见必填
			ischeckok = chekcremark(remarkcontent);
		}
		remark = FCKEditorExt.getHtml('remark');
		
		if(ischeckok){
			const params = getState().workflowReq.getIn(['params','hiddenarea']).toJS();
			//签字意见相关流程，相关文档
			const signworkflowids = jQuery('#signworkflowids').val();
			const signdocids = jQuery('#signdocids').val();
			const remarkLocation =jQuery('#remarkLocation').val();
			
			//暂时屏蔽接口
			dispatch({type:types.FORM_LOADING,loading:true});
			API_REQ.getRequestSubmit(objectAssign({},params,formdatas,{
				actiontype:actiontype,
				remark:remark,
				signdocids:signdocids,
				signworkflowids:signworkflowids,
				remarkLocation:remarkLocation,
				src:src
			})).then(data=>{
				const type =  data.type;
				//更新操作信息
				const {lastOperator,lastOperateDate,lastOperateTime} = data;
		    	let updateinfo = {
		    		lastOperator:data.lastOperator,
		    		lastOperateDate:lastOperateDate,
		    		lastOperateTime:lastOperateTime,
		    	};
		    	dispatch(setOperateInfo(updateinfo));
		    	
				if(type == 'FAILD'){
					dispatch(setOperateInfo({eh_setoperator:''}));
					dispatch(setReqSubmitErrorMsgHtml(data.messagehtml));
				}else if(type == 'SUCCESS'){
					if(actiontype == 'requestOperation' && 'save' == src){
						dispatch(reqIsReload(true));
					}else{
						if(data.isShowChart == '1'){
							//刷新流程图
							dispatch(setReqTabKey('2'));
							const {requestid,workflowid,isbill,formid,isfromtab,f_weaver_belongto_userid,f_weaver_belongto_usertype} = params;
							jQuery('.req-workflow-map').attr('src',
							`/workflow/request/WorkflowDirection.jsp?requestid=${requestid}&workflowid=${workflowid}&isbill=${isbill}&formid=${formid}&isfromtab=${isfromtab}&f_weaver_belongto_userid=${f_weaver_belongto_userid}&f_weaver_belongto_usertype`);
							try{
								window.opener._table.reLoad();
							}catch(e){}
							try{
								//刷新门户流程列表
								jQuery(window.opener.document).find('#btnWfCenterReload').click();
							}catch(e){}
						}else{
							dispatch(reqIsSubmit(true));
						}
					}
				} else if(type == "SEND_PAGE"){ //无权限
					window.location.href = data.sendPage;
				} else if(type == "WF_LINK_TIP"){ //出口提示
					confirm({
					    title: data.msgcontent,
					    onOk() {
							//更新isFirstSubmit
							dispatch(setOperateInfo({isFirstSubmit:1}));
							dispatch(doSubmitE9Api('requestOperation','submit',"",dispatch(getformdatas())));
					    },
					    onCancel(){}
					});
				} else if(type == "R_CHROSE_OPERATOR"){ //
					const needChooseOperator = data.needChooseOperator;
					//暂时用老的方式处理
					if(needChooseOperator == 'y'){
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
						eh_dialog.Title = "请选择";
						eh_dialog.URL = "/workflow/request/requestChooseOperator.jsp";
						eh_dialog.callbackfun = function(paramobj, datas) {
							let chrostoperatorinfo = {
								eh_setoperator:'y',
								eh_relationship:datas.relationship,
								eh_operators:datas.operators
							};
							dispatch(setOperateInfo(chrostoperatorinfo));
							dispatch(doSubmitE9Api('requestOperation','submit',"",dispatch(getformdatas())));
						};
						eh_dialog.closeHandle = function(paramobj, datas){
							const eh_setoperator = getState().workflowReq.getIn(['params','hiddenarea']).get('eh_setoperator');
							if(eh_setoperator != 'y'){
								dispatch(setOperateInfo({eh_setoperator:'n'}));
								dispatch(doSubmitE9Api('requestOperation','submit',"",dispatch(getformdatas())));
							}
						};
						eh_dialog.show();
					}
				} else if(type == "DELETE"){
					warning({
					    title: '删除成功 ',
					    okText: '确定',
					    onOk() {
					    	dispatch(reqIsSubmit(true));
					    }
					});
				}
				dispatch({type:types.FORM_LOADING,loading:false});
			});
		}else{
			dispatch({type:types.CONTROLL_SIGN_INPUT,bool:true});
			signmustinputtips();
		}
	}
}

export const signmustinputtips = () =>{
	message.warning('"签字意见"未填写',2);
	let  scrollTop = parseInt(jQuery("#remark").offset().top);
	if(scrollTop == 0){
		scrollTop = parseInt(jQuery("#remarkShadowDiv").offset().top);
	}
	
	if(scrollTop <  (jQuery('.wea-new-top-req').height() + 185 ) || 
		(scrollTop - jQuery('.wea-new-top-req').height() +185) > jQuery('.wea-new-top-req-content').height()){
		jQuery('.wea-new-top-req-content').animate({ scrollTop: scrollTop - 185 + "px" }, 500)
	}
	UE.getEditor('remark').focus(true);
}

export const setOperateInfo = (updateinfo) =>{
	return {type:types.SET_OPERATE_INFO,updateinfo:updateinfo};
}

//设置表单tabkey
export const reqIsSubmit = bool => {
	return {type:types.REQ_IS_SUBMIT,bool:bool}
}

//重新加载
export const reqIsReload = bool => {
	return {type:types.REQ_IS_RELOAD,bool:bool}
}

export const controlSignInput = bool =>{
	return(dispatch, getState) => {
		dispatch({type:types.CONTROLL_SIGN_INPUT,bool:bool});
	}
}

export const setReqSubmitErrorMsgHtml = msghtml =>{
	return {type:types.SET_REQ_SUBMIT_ERROR_MSG_HTML,msghtml:msghtml}
}

//流程暂停
export const doStop = () => {
	return(dispatch, getState) => {
		const params = getState().workflowReq.get('params');
		const requestid = params.get('requestid');
		const userid = params.get('f_weaver_belongto_userid');
		
		confirm({
			title: '您确定要暂停当前流程吗？',
			onOk() {
				API_REQ.getRequestSubmit({
					actiontype: 'functionLink',
					requestid: requestid,
					f_weaver_belongto_userid: userid,
					f_weaver_belongto_usertype: 0,
					flag: 'stop'
				}).then(data => {
					dispatch(reqIsSubmit(true));
				});
			}
		});
	}
}

//流程撤销
export const doCancel = () => {
	return(dispatch, getState) => {
		const params = getState().workflowReq.get('params');
		const requestid = params.get('requestid');
		const userid = params.get('f_weaver_belongto_userid');
		
		confirm({
			title: '您确定要撤销当前流程吗 ？',
			onOk() {
				API_REQ.getRequestSubmit({
					actiontype: 'functionLink',
					requestid: requestid,
					f_weaver_belongto_userid: userid,
					f_weaver_belongto_usertype: 0,
					flag: 'cancel'
				}).then(data => {
					dispatch(reqIsSubmit(true));
				});
			}
		});
	}	
}

//流程启用
export const doRestart = () => {
	return(dispatch, getState) => {
		const params = getState().workflowReq.get('params');
		const requestid = params.get('requestid');
		const userid = params.get('f_weaver_belongto_userid');
		
		confirm({
			title: '您确定要启用当前流程吗？',
			onOk() {
				API_REQ.getRequestSubmit({
					actiontype: 'functionLink',
					requestid: requestid,
					f_weaver_belongto_userid: userid,
					f_weaver_belongto_usertype: 0,
					flag: 'restart'
				}).then(data => {
					dispatch(reqIsReload(true));
				});
			}
		});
	}		
}

//强制收回
export const doRetract = () => {
	return(dispatch, getState) => {
		const params = getState().workflowReq.get('params');
		const requestid = params.get('requestid');
		const userid = params.get('f_weaver_belongto_userid');
		const workflowid = params.get('workflowid');
		
		API_REQ.getRequestSubmit({
			actiontype: 'functionLink',
			requestid: requestid,
			f_weaver_belongto_userid: userid,
			f_weaver_belongto_usertype: 0,
			workflowid:workflowid,
			flag: 'rb'
		}).then(data => {
			if(data.reqRoute){
				//页面重新加载
				dispatch(reqIsReload(true));
			}else{
				window.location.href = "/workflow/request/ViewRequest.jsp?requestid="+requestid;
			}
		});
	}
}


//强制归档
export const doDrawBack = () =>{
	return(dispatch, getState) => {
		const hiddenparams = getState().workflowReq.getIn(['params','hiddenarea']).toJS();
		if(hiddenparams.needconfirm == '1'){
			confirm({
			    title: '您确定将该流程强制归档吗？',
			    onOk() {
			    	dispatch(doingDrawBack(hiddenparams));
			    },
			    onCancel(){
			    	return;
			    }
			});
		}else{
			dispatch(doingDrawBack(hiddenparams));
		}
	}
}

export const doingDrawBack = (hiddenparams) => {
	return(dispatch, getState) => {
		const signinputinfo = getState().workflowReq.getIn(['params','signinputinfo']);
		const isSignMustInput = signinputinfo.get('isSignMustInput');
		let ischeckok = true;
		if(isSignMustInput == '1'){
			let remarkcontent  = FCKEditorExt.getText("remark");
			//验证签字意见必填
			ischeckok = chekcremark(remarkcontent);
		}
		remark = FCKEditorExt.getHtml('remark');
		if(ischeckok){
			const formValue = dispatch(getformdatas());
			const signworkflowids = jQuery('#signworkflowids').val();
			const signdocids = jQuery('#signdocids').val();
			const remarkLocation =jQuery('#remarkLocation').val();

			let params = objectAssign({},hiddenparams,formValue,{
				actiontype:'functionLink',
				flag:'ov',fromflow:1,
				remark:remark,
				signworkflowids:signworkflowids,
				signdocids:signdocids,
				remarkLocation:remarkLocation
			});

			API_REQ.getRequestSubmit(params).then(data => {
				//重新加载列表
				dispatch(reqIsSubmit(true));
			});
		}else{
			dispatch({type:types.CONTROLL_SIGN_INPUT,bool:true});
			signmustinputtips();
		}
	}
}

//修改是否显示签字意见操作者头像
export const setIsShowUserheadimg = bool =>{
	return {type:types.IS_SHOW_USER_HEAD_IMG,bool:bool};
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

//退回
export const doReject = () => {
	return(dispatch, getState) => {
		const formstate = getState().workflowReq.getIn(['params', 'hiddenarea']);
		const needconfirm = formstate.get('needconfirm');
		if(needconfirm == '1'){
			confirm({
			    title: '确认是否退回？',
			    onOk() {
	    			dispatch(loadRejectNodeInfo());
			    },
			    onCancel(){
			    	return;
			    },
			});
		}else{
			dispatch(loadRejectNodeInfo());
		}
	}
}

export const loadRejectNodeInfo = () => {
	return(dispatch, getState) => {
		const params = getState().workflowReq.get('params').toJS();
		const {nodeid,workflowid,requestid,currentnodeid,f_weaver_belongto_userid} = params;
		
		API_REQ.getFormReqInfo({
			actiontype:'rejectinfo',
			nodeid:nodeid,
			workflowid:workflowid,
			requestid:requestid,
			currentnodeid:currentnodeid,
			f_weaver_belongto_userid:f_weaver_belongto_userid,
			f_weaver_belongto_usertype:'0'
		}).then(data=>{
			const type = data.type;
			if(type == '0'){
				dispatch(sureReject());
			} else if(type =='1'){
				const {RejectNodes,RejectToNodeid} = data;
				dispatch(sureReject(RejectNodes,RejectToNodeid));
			} else if(type =='2'){
				const {paramurl,dialogurl} = data;
				var dialog = new window.top.Dialog();
			    dialog.currentWindow = window;
			    dialog.callbackfunParam = null;
			    dialog.URL = dialogurl + escape(paramurl);
			    dialog.callbackfun = function (paramobj, id1) {
			    	if(id1){
				    	var array1  = id1.name.split('|');
				    	dispatch(sureReject(array1[0],array1[1],array1[2]));
			    	}
			    }
			    dialog.Title = "请选择 ";
			    dialog.Height = 400 ;
			    dialog.Drag = true;
			    dialog.show();
			}
		});
	}
}


export const sureReject = (RejectNodes,RejectToNodeid,RejectToType) => {
	return(dispatch, getState) => {
		const formValue = dispatch(getformdatas());
        let params = objectAssign({},formValue,{"RejectNodes":RejectNodes,"RejectToNodeid":RejectToNodeid,"RejectToType":RejectToType});
		dispatch(doSubmitE9Api('requestOperation','reject',"",params));
	}	
}

//处理系统字段名称 
export const updateHiddenSysFieldname = (fieldname) => {
	switch(fieldname){
		case 'field-1':
			return 'requestname';
		case 'field-2':
			return 'requestlevel';
		case 'field-3':
			return 'messageType';
		case 'field-5':
			return 'chatsType';
		default:
			return fieldname;
	}
}

export const isClickBtnReview = bool =>{
	return(dispatch, getState) => {
		dispatch({type:types.IS_CLICK_BTN_REVIEW,bool:bool});
	}
}

//签字意见搜索表单内容
export const saveSignFields = value => {
	return (dispatch, getState) => {
		dispatch({type: types.SAVE_SIGN_FIELDS,value:value})
	}
}

//签字意见搜索表单内容显示
export const setShowSearchDrop = value => {
	return (dispatch, getState) => {
		dispatch({type: types.SET_SHOW_SEARCHDROP,value:value})
	}
}

//流程删除
export const doDeleteE9 = () => {
	return (dispatch, getState) => {
		const hiddenparams = getState().workflowReq.getIn(['params','hiddenarea']).toJS();
		confirm({
			title:' 你确定删除该工作流吗？ ',
			onOk(){
				API_REQ.getRequestSubmit(objectAssign({},hiddenparams,{
					actiontype: 'functionLink',
					src: 'delete'
				})).then(data => {
					//重新加载列表
					dispatch(reqIsSubmit(true));
				});
			}
		});
	}
}


export const setShowBackToE8 = bool =>{
	return {type:types.SET_SHOWBACK_TO_E8,bool:bool};
}

//控制签字意见是否显示所有操作者
export const setShowUserlogid = logid =>{
	return (dispatch, getState) => { 
		if(logid == ''){
			dispatch({type:types.UPDATE_SHOW_USER_LOGID,showuserlogids:[]});
		}else{
			let showuserlogids = getState().workflowReq.get('showuserlogids').toJS();
			const index = showuserlogids.indexOf(logid);
			if(index > -1){
				showuserlogids = List(showuserlogids).delete(index).toJS();
			}else{
				showuserlogids.push(logid);
			}
			dispatch({type:types.UPDATE_SHOW_USER_LOGID,showuserlogids:showuserlogids});
		}
	}
}

//加载签字意见主子流程签字意见
export const loadRefReqSignInfo = (params) =>{
	return (dispatch, getState) => { 
		dispatch({type:types.SET_REL_REQ_LOG_PARAMS,relLogParams:params});
		let logParams = getState().workflowReq.get('relLogParams').merge(getState().workflowReq.get('logSearchParams')).toJS();
		API_REQ.getFormReqInfo(logParams).then(data=>{
			let value = data;
			dispatch({type:types.SET_MARK_INFO,logList:value.log_loglist,logCount:value.totalCount ? value.totalCount : 0});
		});
	}
}

//滚动加载签字意见
export const scrollLoadSign = (params) => {
	return (dispatch, getState) => {
		const logListTabKey = getState().workflowReq.get('logListTabKey');
		let logParams = {};
		if(logListTabKey > 2 ) {
			dispatch({type:types.SET_REL_REQ_LOG_PARAMS,relLogParams:params});
			logParams = getState().workflowReq.get('relLogParams').merge(getState().workflowReq.get('logSearchParams')).toJS();
		}else{
			dispatch({type:types.SET_LOG_PARAMS,logParams:params});		
			logParams = getState().workflowReq.get('logParams').merge(getState().workflowReq.get('logSearchParams')).toJS();
		}
		API_REQ.getFormReqInfo(logParams).then(data=>{
			let value = data;
			let logList = getState().workflowReq.get('logList').toJS();
			logList = logList.concat(value.log_loglist);
			dispatch({type:types.SET_SCROLL_MARK_INFO,logList:logList});
			dispatch(setIsLoadingLog(false));
		});
	}
}

export const setIsLoadingLog = bool =>{
	return (dispatch, getState) => {
		dispatch({type:types.IS_LOADING_LOG,bool:bool});
	}
}

export const aboutVersion  = (versionid) =>{
	warning({
	    title: "当前是V" + versionid + "版本",
	    okText: '确定',
	    onOk() {
	    	return;
	    }
	});
}
