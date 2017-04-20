import { Modal,message} from 'antd';
const confirm = Modal.confirm;
const success = Modal.success;
const warning = Modal.warning;

import {WeaTable} from '../../coms/index'

const WeaTableAction = WeaTable.action;

import * as types from '../constants/ActionTypes'
import * as API_REQ from '../apis/req'
import * as API_TABLE from '../apis/table'
import * as ReqFormAction from './reqForm'
import * as ReqLogListAction from './reqLogList'
import objectAssign from 'object-assign'
import Immutable from 'immutable'



//初始化表单
export const initFormLayout = (queryParams) => {
	return (dispatch, getState) => {
		dispatch({type:types.FORM_LOADING,loading:true});
		const apiLoadStart = new Date().getTime();
		const reqId = queryParams.requestid;
		API_REQ.loadForm(queryParams).then((data)=>{
			const params = data.params;
			const dispatchStart = new Date().getTime();
			const apiDuration = dispatchStart - apiLoadStart;
			//布局、表单内容
			dispatch({type: types.REQ_INIT_PARAMS, params:params});
			dispatch(ReqFormAction.initFormInfo(data));
			//性能测试
			dispatch({type: 'TEST_PAGE_LOAD_DURATION',
				reqLoadDuration:(new Date().getTime() - (window.REQ_PAGE_LOAD_START ? window.REQ_PAGE_LOAD_START : 0)),
				jsLoadDuration: window.JS_LOAD_DURATION ? window.JS_LOAD_DURATION : 0,
				apiDuration: apiDuration,
				dispatchDuration: new Date().getTime() - dispatchStart
			})
			//图片懒加载
			formImgLazyLoad(jQuery('.wea-new-top-req-content'));
			//明细数据加载
			dispatch(ReqFormAction.loadDetailValue());
			
			//获取右键菜单
			API_REQ.getRightMenu(params).then(data=>{
				dispatch(setRightMenuInfo(data));
			});
			
			//其它处理，前端不用处理
			if(queryParams.iscreate != '1'){
				API_REQ.updateReqInfo({
					requestid:reqId,
					currentnodetype:params.currentnodetype,
					wfmonitor:params.wfmonitor,
					isurger:params.isurger
				}).then(data=>{});
			
				dispatch(ReqLogListAction.initLogParams(params));
			}
			
			//刷待办
			try{
	 			window.opener._table.reLoad();
	 		}catch(e){}
	 		try{
	 			//刷新门户流程列表
	 			jQuery(window.opener.document).find('#btnWfCenterReload').click();
	 		}catch(e){}
		});
	}
}


export const clearForm = () => {
	return (dispatch, getState) => {
		dispatch({type:types.REQ_CLEAR_INFO});
		dispatch({type:types.REQFORM_CLEAR_INFO});
		dispatch({type:types.LOGLIST_CLEAR_INFO})
	}
}

export const setCustompageHtml = (custompagehtml) => {
	return {type:types.SET_CUSTOMPAGE_HTML,custompagehtml:custompagehtml}
}

//设置表单tabkey
export const setReqTabKey = key => {
	return {type:types.SET_REQ_TABKEY,reqTabKey:key}
}

//设置签字意见输入框信息
export const setMarkInputInfo = value => {
	return {type:types.SET_MARK_INPUT_INFO,markInfo:value};
}

//设置右键菜单信息
export const setRightMenuInfo = value => {
	return {type:types.SET_RIGHT_MENU_INFO,rightMenu:value};
}

//加载流程状态数据
export const loadWfStatusData = (params, cardid, isfirst) => {
	return (dispatch, getState) => {
		dispatch({type:types.FORM_LOADING,loading:true});
		const statusState = getState().workflowReq.get('wfStatus');
		let newParams = {...params, ...{desremark:cardid, isfirst:isfirst, pageSize:50}};
		if(!isfirst)
			newParams["parameter"] = JSON.stringify(statusState.getIn([cardid,"parameter"]));
		API_REQ.getWfStatus(newParams).then(data => {
			let statusDatas = {cardid:cardid};
			statusDatas[cardid] = data;
			dispatch({type:types.SET_WORKFLOW_STATUS, wfStatus:statusDatas});
		});
		if(cardid === "all" && isfirst){
			API_REQ.getWfStatusCount(params).then(data => {
				dispatch({type:types.SET_WORKFLOW_STATUS, wfStatus:{counts:data}});
			});
		}
	}
}

//流程状态-切换Card
export const switchWfStatusCard = cardid => {
	return (dispatch, getState) => {
		dispatch({type:types.SET_WORKFLOW_STATUS, wfStatus:{cardid:cardid}});
	}
}

//流程状态-全部Card控制节点行隐藏显示
export const controlWfStatusHideRow = hideRowKeys =>{
	return (dispatch, getState) =>{
		dispatch({type:types.SET_WORKFLOW_STATUS, wfStatus:{hideRowKeys:hideRowKeys}});
	}
}

//相关资源
export const getResourcesKey = (requestid, tabindex) => {
	return (dispatch, getState) => {
		API_REQ.getResourcesKey({requestid,tabindex}).then((data)=>{
            dispatch({type: types.SET_RESOURCES_KEY,key:data.sessionkey,tabindex});
            dispatch(WeaTableAction.getDatas(data.sessionkey, 1));
        });
	}
}

//设置隐藏域参数
export const setHiddenArea = value => {
	return {type:types.SET_HIDDEN_AREA,hiddenarea:value};
}

export const getformdatas = () =>{
	return (dispatch, getState) => {
		const mainData = getState().workflowReqForm.get('mainData');
		const detailData = getState().workflowReqForm.get('detailData');
		let formarea = {};
        mainData.mapEntries && mainData.mapEntries(f => {
        	f[1].mapEntries(o =>{
        		if(o[0] == 'value') {
        			const fieldname = updateHiddenSysFieldname(f[0]);
        			formarea[fieldname] = o[1];
        		}
			});
        });
        
        detailData && detailData.map((v,k) => {
            const detailIndex = parseInt(k.substring(7))-1;
            let submitdtlid = "";
            v && v.map((datas, rowKey) => {
				const rowIndex = parseInt(rowKey.substring(4));
                submitdtlid += rowIndex+",";
                datas.mapEntries && datas.mapEntries(f => {
					if(f[0] === "keyid"){
						formarea[`dtl_id_${detailIndex}_${rowIndex}`] = f[1];
					}else if(f[0].indexOf("field") > -1){
						const domfieldvalue = f[1] && f[1].get("value");
						const domfieldid = f[0]+"_"+rowIndex;
						formarea[domfieldid] = domfieldvalue;
					}
                })
            })
            formarea['nodesnum'+detailIndex] = v.size;
            formarea['indexnum'+detailIndex] = v.size;
            formarea['submitdtlid'+detailIndex] = submitdtlid;
            formarea['deldtlid'+detailIndex] = '';
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
			const signinputinfo = setSignInputInfo(params.requestid);
			//暂时屏蔽接口
			dispatch({type:types.FORM_LOADING,loading:true});
			API_REQ.getRequestSubmit(objectAssign({},params,formdatas,signinputinfo,{
				actiontype:actiontype,
				remark:remark,
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
			message.warning('"签字意见"未填写',2);
			signmustinputtips();
		}
	}
}

export const setSignInputInfo = (requestid) =>{
	const remarkDiv = jQuery('#remark_div');
	return {
		signworkflowids:remarkDiv.find('#signworkflowids').val(),
		signdocids:remarkDiv.find('#signdocids').val(),
		remarkLocation:remarkDiv.find('#remarkLocation').val(),
		'field-annexupload':remarkDiv.find('#field-annexupload').val(),
		'field_annexupload_del_id':remarkDiv.find('#field_annexupload_del_id').val(),
		'field-annexupload-name':remarkDiv.find('#field-annexupload-name').val(),
		'field-annexupload-count':remarkDiv.find('#field-annexupload-count').val(),
		'field-annexupload-request':requestid
	};
}

export const signmustinputtips = () =>{
	let  remarktop = parseInt(jQuery("#remark").offset().top);
	if(remarktop == 0){
		remarktop = parseInt(jQuery("#remarkShadowDiv").offset().top);
	}
	let scrolltop = 0;
	//判断意见框是否在可视区域
	
	const isVisual = remarktop > 0 && (remarktop - jQuery('.wea-new-top-req').height() + 200 <  jQuery('.wea-new-top-req-content').height());
	if(!isVisual) {
		if(remarktop - jQuery('.wea-new-top-req').height() + 200 > jQuery('.wea-new-top-req-content').height()){
			scrolltop = remarktop + jQuery('.wea-new-top-req-content').scrollTop() - 185;
		}
		if(remarktop <  (jQuery('.wea-new-top-req').height())){
			if(remarktop < 0) remarktop = remarktop * -1;	
			scrolltop = jQuery('.wea-new-top-req-content').scrollTop() - remarktop - jQuery('.wea-new-top-req').height() -100;
		}
		jQuery('.wea-new-top-req-content').animate({ scrollTop: scrolltop + "px" }, 0);
	}
	
	UE.getEditor('remark').focus(true);
}

export const setOperateInfo = (updateinfo) =>{
	return {type:types.SET_OPERATE_INFO,updateinfo:updateinfo};
}

//设置表单tabkey
export const reqIsSubmit = bool => {
	return (dispatch, getState) => {
		dispatch({type:types.REQ_IS_SUBMIT,bool:bool});
		if(bool){
	 		try{
	 			window.opener._table.reLoad();
	 		}catch(e){}
	 		try{
	 			//刷新门户流程列表
	 			jQuery(window.opener.document).find('#btnWfCenterReload').click();
	 		}catch(e){}
	 		window.close();
		}
	}
}

//重新加载
export const reqIsReload = bool => {
	return (dispatch, getState) => {
		dispatch({type:types.REQ_IS_RELOAD,bool:bool});
		if(bool) {
			//window.location.reload();
			const {routing,workflowReq} = getState();
			const {search} = routing.locationBeforeTransitions;
			const params = workflowReq.get("params");
			if(UE.editors.contains('remark')){
				UE.getEditor('remark').destroy();
			}
			if(UE.editors.contains('forwardremark')){
				UE.getEditor('forwardremark').destroy();
			}
			dispatch({type:types.CLEAR_ALL});
			weaWfHistory && weaWfHistory.push("/main/workflow/ReqReload"+search);
			//console.log("weaWfHistory:",weaWfHistory," pathname:",pathname," search:",search);
		}
	}
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
			//页面重新加载
			//dispatch(reqIsReload(true));
			if(data.reqRoute){
				//页面重新加载
				dispatch(reqIsReload(true));
			}else{
				window.location.href = "/workflow/request/ViewRequest.jsp?requestid="+requestid +"&f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype=0";
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
			const signinputinfo = setSignInputInfo(getState().workflowReq.getIn(['params','requestid']));

			let params = objectAssign({},hiddenparams,formValue,signinputinfo,{
				actiontype:'functionLink',
				flag:'ov',fromflow:1,
				remark:remark
			});

			API_REQ.getRequestSubmit(params).then(data => {
				//重新加载列表
				dispatch(reqIsSubmit(true));
			});
		}else{
			dispatch({type:types.CONTROLL_SIGN_INPUT,bool:true});
			message.warning('"签字意见"未填写',2);
			signmustinputtips();
		}
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
		
		API_REQ.getRejectInfo({
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
//转发 意见征询 转办 控制
export const setShowForward = (bool, forwarduserid, forwardflag, needwfback) => {
	return(dispatch, getState) => {
		let forwardParams = {
			showForward: bool,
			forwarduserid: forwarduserid ? forwarduserid : '',
			forwardflag: forwardflag ? forwardflag : '',
			needwfback: needwfback ? needwfback : ''			
		};
		dispatch({
			type: types.SET_SHOW_FORWARD,
			forwardParams : forwardParams
		});
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

export const aboutVersion  = (versionid) =>{
	warning({
	    title: "当前是V" + versionid + "版本",
	    okText: '确定',
	    onOk() {
	    	return;
	    }
	});
}

