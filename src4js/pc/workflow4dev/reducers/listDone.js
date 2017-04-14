import Immutable from 'immutable'
import * as types from '../constants/ActionTypes'
import objectAssign from 'object-assign'
import cloneDeep from 'lodash/cloneDeep'

import {WeaTools} from 'ecCom'

const {ls} = WeaTools;

const initState = {
    title:"已办事宜",
    loading:false,
	leftTree:ls.getJSONObj("listDoneleftTree") || [],
    leftTreeCount:{},
    leftTreeCountType:[
        {
            name:"flowAll",
            color:""
        },
        {
            name:"flowNew",
            color:""
        },
        {
            name:"flowOver",
            color:""
        },
        {
            name:"flowRes",
            color:""
        },
        {
            name:"flowSup",
            color:""
        }
    ],
    topTab:[],
    topTabCount:{},
    dataKey:"",
    sharearg:{},
    paramsBase:{
        viewScope: "done",
    	offical:"",
        officalType:-1,
        method:"all",
        complete:2,
        date2during:0,
    },
    searchParams:{
    	viewcondition:0
    },
    selectedTreeKeys:[],
    orderFields:{},
    searchParamsAd:{},
    showSearchAd:false,
    isClearNowPageStatus:false,
    conditioninfo:[],
};

let initialState = Immutable.fromJS(initState);

export default function list(state = initialState, action) {
    switch (action.type) {
    	case types.LISTDONE_CLEAR_PAGE_STATUS:
      		return state.merge({isClearNowPageStatus:action.isToReq});
      	case types.LISTDONE_UNMOUNT_CLEAR:
      		return state.merge({searchParamsAd:{},selectedRowKeys:[],showSearchAd:false}).merge(
      			action.isToReq ? {} : {selectedTreeKeys:[],searchParams: initState.searchParams,orderFields:{},selectedRowKeys:[]});
        case types.LISTDONE_INIT_DATAKEY:
          	return state.merge({dataKey:action.dataKey,searchParams:action.searchParams,sharearg:action.sharearg,isInit:true,loading:true});
        case types.LISTDONE_INIT_BASE:
          	return state.merge({leftTree:action.leftTree,topTab:action.topTab,leftTreeCountType:action.leftTreeCountType,title:action.title,conditioninfo:action.conditioninfo});
        case types.LISTDONE_INIT_COUNT:
          	return state.merge({leftTreeCount:action.leftTreeCount,topTabCount:action.topTabCount});
        case types.LISTDONE_INIT_TOPTABCOUNT:
          	return state.merge({topTabCount:action.topTabCount});
        case types.LISTDONE_SET_SELECTED_TREEKEYS:
          	return state.merge({selectedTreeKeys:action.selectedTreeKeys});
        case types.LISTDONE_SAVE_ORDER_FIELDS:
          	return state.merge({orderFields: action.value,searchParamsAd:function(){
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
        case types.LISTDONE_CLEAR_LEFTTREE:
          	return state.merge({leftTree:[],leftTreeCount:{},leftTreeCountType:[],selectedTreeKeys:[],showSearchAd:false});
        case types.LISTDONE_SET_SHOW_SEARCHAD:
          	return state.merge({showSearchAd:action.value});
        default:
            return state
    }
}