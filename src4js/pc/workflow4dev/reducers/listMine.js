import Immutable from 'immutable'
import * as types from '../constants/ActionTypes'
import objectAssign from 'object-assign'
import cloneDeep from 'lodash/cloneDeep'

import {WeaTools} from 'ecCom'

const {ls} = WeaTools;

const initState = {
    title:"我的请求",
    loading:false,
	leftTree:ls.getJSONObj("listMineleftTree") || [],
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
        viewScope: "mine",
    	offical:"",
        officalType:-1,
        method:"all",
        complete:2,
        date2during:0,
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
    sortParams:[],
    colSetdatas:[],
    colSetKeys:[],
    colSetVisible:false,
    conditioninfo:[],
    pageAutoWrap:false
};

let initialState = Immutable.fromJS(initState);

export default function list(state = initialState, action) {
    switch (action.type) {
    	case types.LISTMINE_TABLE_COL_SET_VISIBLE:
      		return state.merge({colSetVisible: action.value});
    	case types.LISTMINE_TABLE_COL_SET:
      		return state.merge({colSetKeys: action.colSetKeys,colSetdatas: (action.colSetdatas ? action.colSetdatas : [] )});
    	case types.LISTMINE_CLEAR_PAGE_STATUS:
      		return state.merge({isClearNowPageStatus:action.isToReq});
      	case types.LISTMINE_UNMOUNT_CLEAR:
      		return state.merge({searchParamsAd:{},selectedRowKeys:[],showSearchAd:false}).merge(
      			action.isToReq ? {} : {selectedTreeKeys:[],searchParams: initState.searchParams,orderFields:{},selectedRowKeys:[]});
        case types.LISTMINE_LOADING:
          	return state.merge({loading:action.loading});
        case types.LISTMINE_INIT_DATAKEY:
          	return state.merge({dataKey:action.dataKey,searchParams:action.searchParams,sharearg:action.sharearg,isInit:true,loading:true});
        case types.LISTMINE_INIT_DATAS:
          	return state.merge({datas:action.datas,loading:false,columns:action.columns,operates:action.operates,tableCheck:action.tableCheck,current:action.current,pageSize:action.pageSize,sortParams:action.sortParams,pageAutoWrap:action.pageAutoWrap});
        case types.LISTMINE_RESET_DATAS:
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
        case types.LISTMINE_INIT_SET:
          	return state.merge({count:action.count});
        case types.LISTMINE_INIT_BASE:
          	return state.merge({leftTree:action.leftTree,topTab:action.topTab,leftTreeCountType:action.leftTreeCountType,title:action.title,conditioninfo:action.conditioninfo});
        case types.LISTMINE_INIT_COUNT:
          	return state.merge({leftTreeCount:action.leftTreeCount,topTabCount:action.topTabCount});
        case types.LISTMINE_INIT_TOPTABCOUNT:
          	return state.merge({topTabCount:action.topTabCount});
        case types.LISTMINE_SET_SELECTED_ROWKEYS:
          	return state.merge({selectedRowKeys:action.selectedRowKeys});
        case types.LISTMINE_SET_SELECTED_TREEKEYS:
          	return state.merge({selectedTreeKeys:action.selectedTreeKeys});
        case types.LISTMINE_SAVE_ORDER_FIELDS:
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
        case types.LISTMINE_CLEAR_LEFTTREE:
          	return state.merge({leftTree:[],leftTreeCount:{},leftTreeCountType:[],selectedTreeKeys:[],showSearchAd:false});
        case types.LISTMINE_SET_SHOW_SEARCHAD:
          	return state.merge({showSearchAd:action.value});
        case types.LISTMINE_SET_SPAFORM:
          	return state.setIn(['searchParams','isSPA'],ls.getStr("isSpaForm")==="true"?"1":"0").merge({isSpaForm:action.isSpaForm});
        default:
            return state
    }
}