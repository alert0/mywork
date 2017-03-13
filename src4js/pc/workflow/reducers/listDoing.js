import Immutable from 'immutable'
import * as types from '../constants/ActionTypes'
import objectAssign from 'object-assign'
import cloneDeep from 'lodash/cloneDeep'

import {WeaTools} from 'weaCom'

const {ls} = WeaTools;

const initState = {
    title:"待办事宜",
    loading:false,
	leftTree:ls.getJSONObj("listDoingleftTree") || [],
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
    datas:[],
    operates:[],
    dataKey:"",
    current:1,
    count:0,
    pageSize:10,
    columns:[],
    sharearg:{},
    paramsBase:{
        viewScope: "doing",
    	offical:"",
        officalType:-1,
        method:"all",
        complete:0,
    },
    searchParams:{
    	viewcondition:0
    },
    selectedRowKeys:[],
    selectedTreeKeys:[],
    orderFields:{},
    searchParamsAd:{},
    showSearchAd:false,
    tableCheck:false,
    isSpaForm:ls.getStr("isSpaForm")==="true",
    isClearNowPageStatus:false,
    nowRouterWfpath:'listDoing',
    sortParams:[],
    colSetdatas:[],
    colSetKeys:[],
    colSetVisible:false,
    conditioninfo:[],
    showBatchSubmit: false,
    phrasesObj:{},
    pageAutoWrap:false
};

let initialState = Immutable.fromJS(initState);

export default function list(state = initialState, action) {
    switch (action.type) {
    	case types.SET_NOW_ROUTER_PATH:
      		return state.merge({nowRouterWfpath: action.path});
      	case types.LISTDOING_TABLE_COL_SET_VISIBLE:
      		return state.merge({colSetVisible: action.value});
    	case types.LISTDOING_TABLE_COL_SET:
      		return state.merge({colSetKeys: action.colSetKeys,colSetdatas: (action.colSetdatas ? action.colSetdatas : [] )});
    	case types.LISTDOING_CLEAR_PAGE_STATUS:
      		return state.merge({isClearNowPageStatus:action.isToReq});
    	case types.LISTDOING_UNMOUNT_CLEAR:
      		return state.merge({searchParamsAd:{},selectedRowKeys:[],showSearchAd:false}).merge(
      			action.isToReq ? {} : {selectedTreeKeys:[],searchParams: initState.searchParams,orderFields:{},selectedRowKeys:[]});
        case types.LISTDOING_LOADING:
          	return state.merge({loading:action.loading});
        case types.LISTDOING_INIT_DATAKEY:
          	return state.merge({dataKey:action.dataKey,searchParams:action.searchParams,sharearg:action.sharearg,isInit:true,loading:true});
        case types.LISTDOING_INIT_DATAS:
          	return state.merge({datas:action.datas,loading:false,columns:action.columns,operates:action.operates,tableCheck:action.tableCheck,current:action.current,pageSize:action.pageSize,sortParams:action.sortParams,pageAutoWrap:action.pageAutoWrap});
        case types.LISTDOING_RESET_DATAS:
          	return state.merge(function(){
                let resetDatas = state.get('datas').toJS();
                const newDatas = action.newDatas;
                for(let i=0;i<resetDatas.length;i++) {
                    let find = false;
                    let resetData = resetDatas[i];
                    for(let j=0;j<newDatas.length&&!find;j++) {
                        let newData = newDatas[j];
                        if(newData.randomFieldId===resetData.randomFieldId) {
                            for(let p in newData) {
                                resetData[p] = newData[p];
                            }
                            find = true;
                        }
                    }
                }
                return {datas:resetDatas};
            }());
        case types.LISTDOING_INIT_SET:
          	return state.merge({count:action.count});
        case types.LISTDOING_INIT_BASE:
          	return state.merge({leftTree:action.leftTree,topTab:action.topTab,leftTreeCountType:action.leftTreeCountType,title:action.title,conditioninfo:action.conditioninfo});
        case types.LISTDOING_INIT_COUNT:
          	return state.merge({leftTreeCount:action.leftTreeCount,topTabCount:action.topTabCount});
        case types.LISTDOING_INIT_TOPTABCOUNT:
          	return state.merge({topTabCount:action.topTabCount});
        case types.LISTDOING_SET_SELECTED_ROWKEYS:
          	return state.merge({selectedRowKeys:action.selectedRowKeys});
        case types.LISTDOING_SET_SELECTED_TREEKEYS:
          	return state.merge({selectedTreeKeys:action.selectedTreeKeys});
        case types.LISTDOING_SAVE_ORDER_FIELDS:
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
        case types.LISTDOING_CLEAR_LEFTTREE:
          	return state.merge({leftTree:[],leftTreeCount:{},leftTreeCountType:[],selectedTreeKeys:[],showSearchAd:false});
        case types.LISTDOING_SET_SHOW_SEARCHAD:
          	return state.merge({showSearchAd:action.value});
        case types.LISTDOING_SET_SHOW_BATCHSUBMIT:
            return state.merge({showBatchSubmit: action.value});
        case types.LISTDOING_OPER_PHRASES:
            return state.mergeDeep({phrasesObj: action.value});
        case types.LISTDOING_SET_SPAFORM:
          	return state.setIn(['searchParams','isSPA'],ls.getStr("isSpaForm")==="true"?"1":"0").merge({isSpaForm:action.isSpaForm});
        default:
            return state
    }
}