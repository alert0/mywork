import Immutable from 'immutable'
import * as types from '../constants/ActionTypes'
// import cloneDeep from 'lodash/cloneDeep'
import {WeaTools} from 'ecCom'

const {ls} = WeaTools;

const initState = {
    title: '查询流程',
    condition: ls.getJSONObj('queryFlowFieldsList') || [],
    btninfo: [],
    fields: {},
    searchParamsAd: {},
    dataKey: '',
    showTable: false,
    showTabletest: false,
    showSearchAd: false,
    leftTree: ls.getJSONObj('queryFlowleftTree') || [],
    searchParams: {},
    selectedTreeKeys: [],
};

let initialState = Immutable.fromJS(initState);

export default function list(state = initialState, action) {
    switch (action.type) {
    	case types.QUERY_FLOW_SET_SELECTED_TREEKEYS:
      		return state.merge({selectedTreeKeys: action.value});
    	case types.QUERY_FLOW_SET_SEARCH_PARAMS:
      		return state.merge({searchParams:action.value});
    	case types.QUERY_FLOW_INIT_TREE:
      		return state.merge({leftTree: action.value});
        case types.QUERY_FLOW_INIT_BASE:
            return state.merge({condition:action.value});
        case types.QUERY_FLOW_SAVE_FIELDS:
            return state.merge({fields: action.value, searchParamsAd:function(){
                let params = {};
                if(action.value){
                    for (let key in action.value) {
                    	if(key.indexOf('_') < 0){
	                        params[action.value[key].name] = action.value[key].value
	                        if(key == 'createrid'){params['creatertype'] = 0}
                    	}
                    }
                }
                return params
            }()});
        case types.QUERY_FLOW_SEARCH_RESULT:
            return state.merge({dataKey: action.value});
        case types.QUERY_FLOW_UPDATE_DISPLAY_TABLE:
            return state.merge({showTable: action.value});
            case types.QUERY_FLOW_UPDATE_DISPLAY_TABLE_TEST:
            return state.merge({showTabletest: action.value});
        case types.QUERY_FLOW_SET_SHOW_SEARCHAD:
            return state.merge({showSearchAd: action.value});
        default:
            return state;
    }
}