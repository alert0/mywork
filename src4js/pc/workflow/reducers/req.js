import * as types from '../constants/ActionTypes'
import objectAssign from 'object-assign'

import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	//性能测试
	reqLoadDuration: 0,
	jsLoadDuration: 0,
	apiDuration: 0,
	dispatchDuration: 0,
	
	loading:false,
    params:{},
    markInfo:{},
    logList:[],
    logListTabKey:'1',
    logParams:{},
    logCount:0,
    wfStatus:{},
    reqTabKey:'1',
    resourcesKey: '',
    resourcesTabKey:'0',
    rightMenu:{},
    reqIsSubmit:false,
    signFields:{},
    logSearchParams:{},
    showSearchDrop:false,
    showBackToE8: false,
    relLogParams:{},
    shareList: [],
    isLoadingLog:false,
    rightMenuStatus:{'showForward':false}
});

export default function req(state = initialState, action) {
    switch (action.type) {
        case types.REQ_INIT_PARAMS:
            return state.merge({loading:false,params:action.params,});
        case types.REQ_CLEAR_INFO:
            return state.merge({logList:[],logParams:{},markInfo:{},logCount:0,wfStatus:{}});
    	case types.SET_SHOWBACK_TO_E8:
          	return state.merge({showBackToE8:action.bool});
    	case types.SET_SHOW_SEARCHDROP:
          	return state.merge({showSearchDrop:action.value});
    	case types.SAVE_SIGN_FIELDS:
          	return state.merge({signFields: action.value,logSearchParams:function(){
            	let params = {};
                if(action.value){
			    	for (let key in action.value) {
				    	params[action.value[key].name] = action.value[key].value
			    		if(key == 'createrid'){
			    			params.creatertype = '0';
			    		}
			    	}
		    	}
                return params
            }()});
    	case types.SET_HIDDEN_AREA:
    		return state.merge({params:state.get('params').merge({hiddenarea:state.getIn(['params','hiddenarea']).merge(action.hiddenarea)})});
    	case types.SET_RESOURCES_KEY:
    		return state.merge({resourcesKey:action.key,resourcesTabKey:action.tabindex});
        case types.FORM_LOADING:
            return state.merge({loading:action.loading});
        case 'TEST_PAGE_LOAD_DURATION':
            return state.merge({
            	reqLoadDuration: action.reqLoadDuration,
            	jsLoadDuration: action.jsLoadDuration,
				apiDuration: action.apiDuration,
				dispatchDuration: action.dispatchDuration,
            });
       	case types.SET_LOG_PARAMS:
            return state.merge({logParams:state.get('logParams').merge(action.logParams)});
        case types.SET_MARK_INFO:
            return state.merge({logList:action.logList,logParams:state.get('logParams').merge(action.logParams),logCount:action.logCount});
        case types.SET_MARK_INPUT_INFO:
            return state.merge({markInfo:action.markInfo});
        case types.SET_RIGHT_MENU_INFO:
            return state.merge({rightMenu:action.rightMenu});
        case types.SET_WORKFLOW_STATUS:
            return function(){
                let wfStatus = Immutable.fromJS(action.wfStatus);
                const cardid = wfStatus.get("cardid");
                if(cardid && wfStatus.hasIn([cardid,"datas"]) && state.hasIn(["wfStatus",cardid,"datas"])){     //追加数据
                    let part1 = state.getIn(["wfStatus",cardid,"datas"]);
					let part2 = wfStatus.getIn([cardid,"datas"]);
					part2.map((v,k)=>{
						if(part1.hasIn([k,"list"])){
							part1 = part1.updateIn([k,"list"], list => list.concat(v.get("list")))
							part2 = part2.delete(k);
						}
					});
                    wfStatus = wfStatus.setIn([cardid,"datas"], part1.mergeDeep(part2));
                    state = state.deleteIn(["wfStatus",cardid]);
                }
                if(wfStatus.has("hideRowKeys"))
                    state = state.deleteIn(["wfStatus","hideRowKeys"]);
                return state.mergeDeep({wfStatus:wfStatus,loading:false});
            }()
        case types.SET_REQ_TABKEY:
            return state.merge({reqTabKey:action.reqTabKey});
        case types.SET_LOGLIST_TABKEY:
            return state.merge({logListTabKey:action.logListTabKey,reqRequestId:action.reqRequestId,logCount:0,logList:[]});
        case types.REQ_IS_SUBMIT:
            return state.merge({reqIsSubmit:action.bool});
        case types.REQ_IS_RELOAD:
        	return state.merge({reqIsReload:action.bool});
    	case types.CONTROLL_SIGN_INPUT:
    		return state.merge({isShowSignInput:action.bool});
    	case types.IS_SHOW_USER_HEAD_IMG:
    		return state.merge({isShowUserheadimg:action.bool});
    	case types.SET_REQ_SUBMIT_ERROR_MSG_HTML:
    		return state.merge({dangerouslyhtml:{reqsubmiterrormsghtml:action.msghtml}});
    	case types.SET_SHOW_FORWARD:
    		return state.merge({rightMenuStatus:action.forwardParams});
    	case types.SET_OPERATE_INFO:
    		return state.mergeDeep({params:{hiddenarea:action.updateinfo}});
    	case types.UPDATE_SHOW_USER_LOGID:
    		return state.merge({showuserlogids:action.showuserlogids});
    	case types.SET_REL_REQ_LOG_PARAMS:
    		return state.merge({relLogParams:state.get('relLogParams').merge(action.relLogParams)});
    	case types.SET_SCROLL_MARK_INFO:
    		return state.merge({logList:action.logList});
    	case types.IS_LOADING_LOG:
    		return state.merge({isLoadingLog:action.bool});
        case types.CLEAR_ALL:
            return initialState;
        case types.CLEAR_LOG_DATA:
        	return state.merge({logCount:0,logList:[]});
        default:
            return state
    }
}