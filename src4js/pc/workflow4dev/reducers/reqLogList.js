import * as types from '../constants/ActionTypes'
import objectAssign from 'object-assign'

import Immutable from 'immutable'

/**
 * 签字意见列表相关单独reducer
 */
const initialState = Immutable.fromJS({
	logParams: {},
	logCount: 0,
	logList: [],
	logListTabKey: '1',
	logSearchParams: {},
	showSearchDrop: false,
	relLogParams: {},
	isLoadingLog: false,
	signFields: {},
	isShowUserheadimg: true,
	showuserlogids: []
});

export default function reqLogList(state = initialState, action) {
	switch(action.type) {
		case types.LOGLIST_SET_LOG_PARAMS:
			return state.merge({ logParams: state.get('logParams').merge(action.logParams) });
		case types.LOGLIST_SET_SHOW_SEARCHDROP:
			return state.merge({ showSearchDrop: action.value });
		case types.LOGLIST_SAVE_SIGN_FIELDS:
			return state.merge({
				signFields: action.value,
				logSearchParams: function() {
					let params = {};
					if(action.value) {
						for(let key in action.value) {
							params[action.value[key].name] = action.value[key].value
							if(key == 'createrid') {
								params.creatertype = '0';
							}
						}
					}
					return params
				}()
			});
		case types.LOGLIST_SET_MARK_INFO:
			return state.merge({ logList: action.logList, logParams: state.get('logParams').merge(action.logParams), logCount: action.logCount });
		case types.LOGLIST_SET_LOGLIST_TABKEY:
			return state.merge({ logListTabKey: action.logListTabKey, reqRequestId: action.reqRequestId, logCount: 0, logList: [] });
		case types.LOGLIST_IS_SHOW_USER_HEAD_IMG:
			return state.merge({ isShowUserheadimg: action.bool });
		case types.LOGLIST_UPDATE_SHOW_USER_LOGID:
			return state.merge({ showuserlogids: action.showuserlogids });
		case types.LOGLIST_SET_REL_REQ_LOG_PARAMS:
			return state.merge({ relLogParams: state.get('relLogParams').merge(action.relLogParams) });
		case types.LOGLIST_SET_SCROLL_MARK_INFO:
			return state.merge({ logList: action.logList });
		case types.LOGLIST_IS_LOADING_LOG:
			return state.merge({ isLoadingLog: action.bool });
		case types.LOGLIST_CLEAR_LOG_DATA:
			return state.merge({ logCount: 0, logList: [] });
		case types.LOGLIST_LOGLIST_CLEAR_INFO:
			return state.merge({ logList: [], logParams: {}, logCount: 0 })
		default:
			return state;
	}
}