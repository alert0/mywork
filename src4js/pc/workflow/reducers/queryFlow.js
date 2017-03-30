import Immutable from 'immutable'
import * as types from '../constants/ActionTypes'
// import cloneDeep from 'lodash/cloneDeep'
import {WeaTools} from 'ecCom'

const {ls} = WeaTools;

const initState = {
    title: '查询流程',
    loading: false,
    condition: ls.getJSONObj('queryFlowFieldsList') || [],
    btninfo: [],
    fields: {},
    searchParamsAd: {},
    operates: [],
    dataKey: '',
    current: 1,
    count: 0,
    pageSize: 10,
    columns: [],
    sortParams: [],
    datas: [],
    tableCheck: false,
    showTable: false,
    showTabletest: false,
    showSearchAd: false,
    colSetdatas:[],
    selectedRowKeys:[],
    colSetKeys:[],
    colSetVisible:false,
    leftTree: ls.getJSONObj('queryFlowleftTree') || [],
    searchParams: {},
    selectedTreeKeys: [],
    pageAutoWrap:false
};

let initialState = Immutable.fromJS(initState);

export default function list(state = initialState, action) {
    switch (action.type) {
        case types.QUERY_FLOW_SET_SELECTED_ROWKEYS:
      		return state.merge({selectedRowKeys: action.selectedRowKeys});
    	case types.QUERY_FLOW_SET_SELECTED_TREEKEYS:
      		return state.merge({selectedTreeKeys: action.value});
    	case types.QUERY_FLOW_SET_SEARCH_PARAMS:
      		return state.merge({searchParams:action.value});
    	case types.QUERY_FLOW_INIT_TREE:
      		return state.merge({leftTree: action.value});
    	case types.QUERY_FLOW_TABLE_COL_SET_VISIBLE:
      		return state.merge({colSetVisible: action.value});
    	case types.QUERY_FLOW_TABLE_COL_SET:
      		return state.merge({colSetKeys: action.colSetKeys,colSetdatas: (action.colSetdatas ? action.colSetdatas : [] )});
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
        case types.QUERY_FLOW_LOADING:
            return state.merge({loading: action.loading});
        case types.QUERY_FLOW_INIT_DATAS:
          	return state.merge({datas:action.datas,loading:false,columns:action.columns,operates:action.operates,tableCheck:action.tableCheck,current:action.current,pageSize:action.pageSize,sortParams:action.sortParams,pageAutoWrap:action.pageAutoWrap});
        case types.QUERY_FLOW_INIT_SET:
            return state.merge({count:action.count});
        case types.QUERY_FLOW_RESET_DATAS:
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