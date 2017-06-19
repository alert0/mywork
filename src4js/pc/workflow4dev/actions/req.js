import { Modal,message} from 'antd';
import {verifyMustAddDetail,verifyRequiredEmptyField,saveJudgeRequestNameEmpty} from '../util/formUtil'
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
import * as reqUtil from '../util/reqUtil'

import cloneDeep from 'lodash/cloneDeep'

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
			dispatch({type: types.REQ_INIT_PARAMS, params:params, submitParams:data.submitParams});
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
			dispatch(ReqFormAction.loadDetailValue(queryParams));
			
			//加载签字意见输入框
			if(params.isHideInput != "1"){
				const signParams  = {requestid:reqId,workflowid:params.workflowid,nodeid:params.nodeid};
				API_REQ.getSignInput(signParams).then((data)=>{
					data.hasLoadMarkInfo = true;
					dispatch(setMarkInputInfo(data));
				});
			}
			
			//获取右键菜单
			params.isaffirmance = queryParams.isaffirmance || '';
			params.reEdit = queryParams.reEdit || '';
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
				
				//显示签字意见区域
				if(params.isHideArea != "1"){
					dispatch(ReqLogListAction.initLogParams(params));
				}
			}
			reqUtil.listDoingRefresh();
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
			dispatch(WeaTableAction.getDatas(data.sessionkey, 1));
            dispatch({type: types.SET_RESOURCES_KEY,key:data.sessionkey,tabindex});
        });
	}
}

//表单提交
//actiontype,src,needwfback
export const doSubmitE9 = (para) => {
	return (dispatch, getState) => {
		const {actiontype,src,needwfback,isaffirmance} = para;
		const formState = getState().workflowReqForm;
		const submitParams = getState().workflowReq.get('submitParams');
		const isSubmitDirectNode = submitParams.get('isSubmitDirectNode');
		const lastnodeid  = submitParams.get('lastnodeid');
		const needconfirm = submitParams.get('needconfirm');
		const tnodetype  = submitParams.get('nodetype');
		const fromFlowDoc  = submitParams.get('fromFlowDoc');
		const isworkflowdoc  = submitParams.get('isworkflowdoc');
		const isuseTemplate  = submitParams.get('isuseTemplate');
		const isFormSignature = submitParams.get('isFormSignature');
		const isHideInput = submitParams.get('isHideInput');
		const iscreate  = submitParams.get("iscreate");
		const isFirstSubmit = iscreate == "1"?"":'0';
		const formParams = {
			"src": src,
			"needwfback":needwfback,
			"isaffirmance":isaffirmance,
			"RejectToNodeid":'',
			"isFirstSubmit":isFirstSubmit,
			"actiontype":actiontype
		};
		
		if(src == 'submit' || isaffirmance == '1'){
			//校验必须新增明细
			const needAddDetailMark = verifyMustAddDetail(formState);
			if(needAddDetailMark > 0){
				message.warning(`必须填写第${needAddDetailMark}个明细表数据！`);
				return false;
			}
			//校验必填空值范围
			dispatch(ReqFormAction.controlVariableArea({promptRequiredField: ""}));	//需先清空上一次范围
			const emptyField = verifyRequiredEmptyField(formState);
			if(emptyField !== ""){
				dispatch(ReqFormAction.controlVariableArea({promptRequiredField: emptyField}));
				message.warning('存在必填字段未填值！');
				return false;
			}
			if(isSubmitDirectNode == "1"){
				formParams.SubmitToNodeid = lastnodeid;
			} 
			if(needconfirm == "1" && tnodetype != "0"){
				confirm({
				    title: '确认提交流程吗？',
				    onOk() {
				    	saveSignature_of_doSubmit();
				    	dispatch(doSubmitE9Api(formParams));
				    },
				    onCancel(){},
				});
			}else{
				saveSignature_of_doSubmit();
				dispatch(doSubmitE9Api(formParams));
			}
		}else{
			isFormSignature == "1" && isHideInput != "1" && typeof SaveSignature_save == "function" && SaveSignature_save();
			//src == 'save'
			if(src == 'save'){
				if(saveJudgeRequestNameEmpty(formState)){
					dispatch(ReqFormAction.controlVariableArea({promptRequiredField: "field-1"}));
					message.warning('请求标题字段未填值！');
					return false;
				}
			}
			dispatch(doSubmitE9Api(formParams));
		}
	}
}

//保存签章
const saveSignature_of_doSubmit = () => {
	if(typeof SaveSignature == "function") {
		if(!SaveSignature()) {
		}
	}
}

export const afterSubmitValidRemark = (isCheckRemark,src) =>{
	return (dispatch, getState) => {
		const isSignMustInput = getState().workflowReq.getIn(['params','markInfo','isSignMustInput']);
		const isHideInput = getState().workflowReq.getIn(['params','isHideInput']);
		let ischeckok  = true;
		if(isHideInput != "1"){
			//验证签字意见必填
			if((isSignMustInput == "1" && isCheckRemark) || (src && src == "reject" && isSignMustInput == "2")){
				let remarkcontent  = FCKEditorExt.getText("remark");
				ischeckok = chekcremark(remarkcontent);
			}
			const signinputinfo = isHideInput != "1" ? reqUtil.getSignInputInfo() : {};
			signinputinfo.remark = FCKEditorExt.getHtml('remark');
			dispatch(updateSubmitParams(signinputinfo));
		}
		return ischeckok;
	}
}

//表单提交接口
export const doSubmitE9Api = (formParams) => {
	return (dispatch, getState) => {
		const {src,actiontype,needwfback} = formParams;
		const tempParams  = getState().workflowReq.get('params').toJS();
		if(!reqUtil.doAftareSubmit(src,tempParams)){
			return;
		}
		const isCheckRemark  = !(src == 'save' && actiontype == 'requestOperation');
		const ischeckok = dispatch(afterSubmitValidRemark(isCheckRemark,src));
		if(ischeckok){
			//签字意见相关流程，相关文档
			//暂时屏蔽接口
			dispatch({type:types.FORM_LOADING,loading:true});
			try{
				startUploadAll();
			}catch(e){}
			let allUploaded  = false;
    		let timer = setInterval(()=>{
    			//检测附件是否上传完成
    			const variableArea = getState().workflowReqForm.get("variableArea");
    			let arr = [];
				variableArea && variableArea.map((fieldValObj,k)=>{
					if(k.indexOf("field") > -1 && k.indexOf("_") == -1 && fieldValObj && fieldValObj.has("fileUploadStatus")){
						arr.push(fieldValObj.get("fileUploadStatus"));
					}
				});
				let newArr = arr.filter(o=> o !== "uploaded");
				allUploaded = newArr.length === 0;
    			if(allUploaded){
    				dispatch(doSubmitE9Post(formParams));
    				clearInterval(timer);
    			}
    		},500);
		}else{
			dispatch({type:types.CONTROLL_SIGN_INPUT,bool:true});
			message.warning('"签字意见"未填写',2);
			reqUtil.signMustInputTips();
		}
	}
}

//表单提交
export const doSubmitE9Post = (formParams) =>{
	return (dispatch, getState) => {
		const {src,actiontype} = formParams;
		const submitParams = getState().workflowReq.get('submitParams').toJS();
		const formDatas = reqUtil.getformdatas(getState().workflowReqForm);
		const signatureAttributesStr = getState().workflowReq.getIn(["params","signatureAttributesStr"])||"";
		const signatureSecretKey = getState().workflowReq.getIn(["params","signatureSecretKey"])||"";
		
		API_REQ.reqOperate(actiontype,objectAssign({},submitParams,formParams,formDatas,{src:src,signatureAttributesStr:signatureAttributesStr,signatureSecretKey:signatureSecretKey})).then(data=>{
			const type =  data.type;
			//更新操作信息
			const {lastOperator,lastOperateDate,lastOperateTime} = data;
	    	let updateinfo = {
	    		lastOperator:data.lastOperator,
	    		lastOperateDate:lastOperateDate,
	    		lastOperateTime:lastOperateTime,
	    	};
	    	dispatch(updateSubmitParams(updateinfo));
	    	
			if(type == 'FAILD'){
				dispatch(reqIsReload(true,data));
				dispatch(updateSubmitParams({eh_setoperator:''}));
				dispatch(setReqSubmitErrorMsgHtml(data.messagehtml));
			}else if(type == 'SUCCESS'){
				if(actiontype == 'requestOperation' && 'save' == src){
					dispatch(reqIsReload(true,data));
				}else{
					if(data.isNextNodeOperator){
						dispatch(reqIsReload(true,data));
					}else if(data.isShowChart == '1'){
						//刷新流程图
						dispatch(setReqTabKey('2'));
						let {requestid,workflowid,isbill,formid,isfromtab,f_weaver_belongto_userid,f_weaver_belongto_usertype} = submitParams;
						requestid = (requestid && -1 === parseInt(requestid)) ? data.requestid : requestid;
						//jQuery('.req-workflow-map').attr('src',
						//`/workflow/request/WorkflowDirection.jsp?requestid=${requestid}&workflowid=${workflowid}&isbill=${isbill}&formid=${formid}&isfromtab=${isfromtab}&f_weaver_belongto_userid=${f_weaver_belongto_userid}&f_weaver_belongto_usertype&showE9Pic=1`);
						window.location.href = `/workflow/request/WorkflowDirection.jsp?requestid=${requestid}&workflowid=${workflowid}&isbill=${isbill}&formid=${formid}&isfromtab=${isfromtab}&f_weaver_belongto_userid=${f_weaver_belongto_userid}&f_weaver_belongto_usertype&showE9Pic=1`;
						reqUtil.listDoingRefresh();
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
						dispatch(updateSubmitParams({isFirstSubmit:1,requestid:data.requestid}));
						dispatch(doSubmitE9Api({"src":"submit","actiontype":"requestOperation"}));
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
						dispatch(updateSubmitParams(chrostoperatorinfo));
						dispatch(doSubmitE9Api({"src":"submit","actiontype":"requestOperation"}));
					};
					eh_dialog.closeHandle = function(paramobj, datas){
						const eh_setoperator = getState().workflowReq.get('submitParams').get('eh_setoperator');
						if(eh_setoperator != 'y'){
							dispatch(updateSubmitParams({eh_setoperator:'n'}));
							dispatch(doSubmitE9Api({"src":"submit","actiontype":"requestOperation"}));
						}
					};
					eh_dialog.show();
				}
			} else if(type == "DELETE"){
				warning({
				    title: data.label,
				    okText: '确定',
				    onOk() {
				    	dispatch(reqIsSubmit(true));
				    }
				});
			}
			dispatch({type:types.FORM_LOADING,loading:false});
		});
	}		
}

export const updateSubmitParams = (updateinfo) =>{
	return {type:types.REQ_UPDATE_SUBMIT_PARAMS,updateinfo:updateinfo};
}

//设置表单tabkey
export const reqIsSubmit = bool => {
	return (dispatch, getState) => {
		dispatch({type:types.REQ_IS_SUBMIT,bool:bool});
		if(bool){
			reqUtil.listDoingRefresh();
	 		window.close();
		}
	}
}

//重新加载
export const reqIsReload = (bool,data) => {
	return (dispatch, getState) => {
		dispatch({type:types.REQ_IS_RELOAD,bool:bool});
		if(bool) {
			const {routing,workflowReq} = getState();
			//let {search} = routing.locationBeforeTransitions;
			const params = workflowReq.get("params");
			
			let editorArr = cloneDeep(UE.editors);
			editorArr.map(editorid=>{
				UE.getEditor(editorid).destroy();
			});
			let search = "";
			if(params.get('requestid') == '-1'){
				search += "?requestid="+data.requestid;
			}else{
				search += "?requestid="+params.get("requestid");
			}
			if((data && data.isaffirmance === "1") || params.get("isaffirmance") === "1"){
				search += "&isaffirmance=1"
			}
			if(data && data.reEdit){
				search += "&reEdit="+data.reEdit;
			}
			dispatch({type:types.CLEAR_ALL});
			weaWfHistory && weaWfHistory.push("/main/workflow/ReqReload"+search);
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
				API_REQ.functionLink({
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
				API_REQ.functionLink({
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
				API_REQ.functionLink({
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
		
		API_REQ.functionLink({
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
		const needconfirm = getState().workflowReq.getIn(["submitParams","needconfirm"])
		if(needconfirm == '1'){
			confirm({
			    title: '您确定将该流程强制归档吗？',
			    onOk() {
			    	dispatch(doingDrawBack());
			    },
			    onCancel(){
			    	return;
			    }
			});
		}else{
			dispatch(doingDrawBack());
		}
	}
}

export const doingDrawBack = (hiddenparams) => {
	return(dispatch, getState) => {
		const ischeckok = dispatch(afterSubmitValidRemark(true));
		if(ischeckok){
			const hiddenparams = getState().workflowReq.get("submitParams").toJS();
			const formValue = reqUtil.getformdatas(getState().workflowReqForm);
			let params = objectAssign({},hiddenparams,formValue,{
				flag:'ov',
				fromflow:1
			});

			API_REQ.functionLink(params).then(data => {
				//重新加载列表
				dispatch(reqIsSubmit(true));
			});
		}else{
			dispatch({type:types.CONTROLL_SIGN_INPUT,bool:true});
			message.warning('"签字意见"未填写',2);
			reqUtil.signMustInputTips();
		}
	}
}


//退回
export const doReject = () => {
	return(dispatch, getState) => {
		const needconfirm = getState().workflowReq.getIn(['submitParams','needconfirm']);
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
        let params = objectAssign({},{"RejectNodes":RejectNodes,"RejectToNodeid":RejectToNodeid,"RejectToType":RejectToType,"src":"reject","actiontype":"requestOperation"});
		dispatch(doSubmitE9Api(params));
	}	
}

//转发 意见征询 转办 控制
export const setShowForward = (forwardParams) => {
	return(dispatch, getState) => {
		dispatch({type: types.SET_SHOW_FORWARD,forwardParams : forwardParams});
	}
}


//流程删除
export const doDeleteE9 = () => {
	return (dispatch, getState) => {
		confirm({
			title:' 你确定删除该工作流吗？ ',
			onOk(){
				dispatch({type:types.FORM_LOADING,loading:true});
				const params  = {src: "delete",actiontype:"requestOperation"};
				dispatch(doSubmitE9Post(params));
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

export const doEdit = () => {
	return (dispatch, getState) => {
		dispatch(reqIsReload(true,{reEdit:"1"}));
	}
}

export const updateSubmitToNodeId = () =>{
	return (dispatch, getState) => {
		const isSubmitDirectNode = getState().workflowReq.getIn(['rightMenu','isSubmitDirectNode']) || '';
		if("1" == isSubmitDirectNode){
			const lastnodeid = getState().workflowReq.getIn(['rightMenu','lastnodeid']) || ''; 
			dispatch(updateSubmitParams({SubmitToNodeid:lastnodeid}));
		}
	}
}


export const getAllFileUploadField = () =>{
	return (dispatch, getState) => {
		const fieldinfomap = getState().workflowReqForm.getIn(["conf","tableInfo","main","fieldinfomap"]);
		let allUploaded  = "uploaded";
		fieldinfomap.map((o)=>{
			if(o.get('htmltype') === 6){
				const type  = getState().workflowReqForm.getIn(["mainData","field"+o.get("fieldid"),"type"]); 
				if(type === "error"){
					allUploaded = "error";
				}else if(type === "uploading"){
					allUploaded = "uploading"
				}
			}
		});
		return allUploaded;
	}
}

//触发子流程
export const triggerSubWf =(subwfid,workflowNames) =>{
	return (dispatch, getState) => {
		workflowNames = workflowNames.replace(new RegExp(',',"gm"),'\n');
		confirm({
			title:"确定触发:"+workflowNames+"流程吗?",
			onOk(){
				dispatch({type:types.FORM_LOADING,loading:true});
				const formParams = getState().workflowReq.get("params");
				const params  = {
					"f_weaver_belongto_userid":formParams.get("f_weaver_belongto_userid"),
					"f_weaver_belongto_usertype":formParams.get("f_weaver_belongto_usertype"),
					requestId:formParams.get("requestid"),
					nodeId:formParams.get("nodeid"),
					paramSubwfSetId:subwfid
				};
				API_REQ.triggerSubWf(params).then(data => {
					dispatch({type:types.FORM_LOADING,loading:false});
					dispatch(reqIsReload(true,{}));
				});
			}
		});
	}
}

//获取明细实时上传的附件信息
export const getUploadFileInfo =(fieldvalue,detailtype,fieldMark) =>{
	return (dispatch, getState) => {
		const params = getState().workflowReq.get("params").toJS();
		const reqParams = {
		    workflowid: params.workflowid,
		    f_weaver_belongto_userid: params.f_weaver_belongto_userid,
		    f_weaver_belongto_usertype: params.f_weaver_belongto_usertype,
		    isprint: params.isprint,
		    requestid:params.requestid
		};
      	const reqDetailParams = {"fieldvalue":fieldvalue,"detailtype":detailtype,"reqParams":JSON.stringify(reqParams)};
        API_REQ.getUploadFileInfo(reqDetailParams).then(data=>{
        	dispatch(ReqFormAction.changeSingleFieldValue(fieldMark,{value:fieldvalue,specialobj:data.specilObj}));
        });
	}
}

//流程导入
export const requestImport =(imprequestid) =>{
	return (dispatch, getState) => {
		const params = getState().workflowReq.get("params");
		const importParams = {
			src:"import",
			imprequestid:imprequestid,
			workflowid:params.get("workflowid")||"",
			formid:params.get("formid")||"",
			isbill:params.get("isbill")||"",
			nodeid:params.get("nodeid")||"",
			nodetype:params.get("nodetype")||""
		};
		
		API_REQ.requestImport(importParams).then(data=>{
			dispatch(reqIsReload(true,{requestid:data.requestid}));
		});
	}
}


export const doImportDetail =() =>{
	return (dispatch, getState) => {
		const params = window.store_e9_workflow.getState().workflowReq.get('submitParams');
		const userid = params.get('f_weaver_belongto_userid');
		const usertype  = params.get("f_weaver_belongto_usertype");
		const requestid  = params.get("requestid");
		const workflowid = params.get("workflowid");
		const nodeid = params.get("nodeid");
		
		if(requestid  == "-1"){
			confirm({
				title:"流程数据还未保存，现在保存吗? ",
				onOk(){
					const para = {actiontype:"requestOperation",src:"save"};
					dispatch(doSubmitE9(para));
				}
			});
		}else{
		    var dialog = new window.top.Dialog();
			dialog.currentWindow = window;
			var url = "/workflow/workflow/BrowserMain.jsp?url=/workflow/request/RequestDetailImport.jsp?f_weaver_belongto_userid="+userid+"&f_weaver_belongto_usertype="+usertype+"&requestid="+requestid+"&workflowid="+workflowid+"&nodeid="+nodeid;
			console.log("url",url);
			var title = "明细导入";
			dialog.Width = 550;
			dialog.Height = 550;
			dialog.Title=title;
			dialog.Drag = true;
			dialog.maxiumnable = true;
			dialog.URL = url;
			dialog.show();
		}
	}
}
