import * as types from '../constants/ActionTypes'
import objectAssign from 'object-assign'

import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	//性能测试
	reqLoadDuration: 0,
	jsLoadDuration: 0,
	apiDuration: 0,
	dispatchDuration: 0,
	loading: false,
	params: {},
	submitParams:{},
	markInfo: {},
	wfStatus: {},
	reqTabKey: '1',
	resourcesKey: '',
	resourcesTabKey: '0',
	rightMenu: {},
	reqIsSubmit: false,
	showBackToE8: false,
	shareList: [],
	rightMenuStatus: { 'showForward': false }
});

export default function req(state = initialState, action) {
	switch(action.type) {
		case types.REQ_INIT_PARAMS:
			return state.merge({ loading: false, params: action.params, submitParams: action.submitParams });
		case types.REQ_CLEAR_INFO:
			return state.merge({ logList: [], logParams: {}, markInfo: {}, logCount: 0, wfStatus: {} });
		case types.SET_SHOWBACK_TO_E8:
			return state.merge({ showBackToE8: action.bool });
		case types.SET_RESOURCES_KEY:
			return state.merge({ resourcesKey: action.key, resourcesTabKey: action.tabindex });
		case types.FORM_LOADING:
			return state.merge({ loading: action.loading });
		case 'TEST_PAGE_LOAD_DURATION':
			return state.merge({
				reqLoadDuration: action.reqLoadDuration,
				jsLoadDuration: action.jsLoadDuration,
				apiDuration: action.apiDuration,
				dispatchDuration: action.dispatchDuration,
			});
		case types.SET_MARK_INPUT_INFO:
			return state.update("params", val=>{
				return val && val.merge({ markInfo: action.markInfo });
			});
		case types.SET_RIGHT_MENU_INFO:
			return state.merge({ rightMenu: action.rightMenu });
		case types.SET_WORKFLOW_STATUS:
			return function() {
				let wfStatus = Immutable.fromJS(action.wfStatus);
				const cardid = wfStatus.get("cardid");
				if(cardid && wfStatus.hasIn([cardid, "datas"]) && state.hasIn(["wfStatus", cardid, "datas"])) { //追加数据
					let part1 = state.getIn(["wfStatus", cardid, "datas"]);
					let part2 = wfStatus.getIn([cardid, "datas"]);
					part2.map((v, k) => {
						if(part1.hasIn([k, "list"])) {
							part1 = part1.updateIn([k, "list"], list => list.concat(v.get("list")))
							part2 = part2.delete(k);
						}
					});
					wfStatus = wfStatus.setIn([cardid, "datas"], part1.mergeDeep(part2));
					state = state.deleteIn(["wfStatus", cardid]);
				}
				if(wfStatus.has("hideRowKeys"))
					state = state.deleteIn(["wfStatus", "hideRowKeys"]);
				return state.mergeDeep({ wfStatus: wfStatus, loading: false });
			}()
		case types.SET_REQ_TABKEY:
			return state.merge({ reqTabKey: action.reqTabKey });
		case types.REQ_IS_SUBMIT:
			return state.merge({ reqIsSubmit: action.bool });
		case types.REQ_IS_RELOAD:
			return state.merge({ reqIsReload: action.bool });
		case types.CONTROLL_SIGN_INPUT:
			return state.merge({ isShowSignInput: action.bool });
		case types.SET_REQ_SUBMIT_ERROR_MSG_HTML:
			return state.merge({ dangerouslyhtml: { reqsubmiterrormsghtml: action.msghtml } });
		case types.SET_SHOW_FORWARD:
			return state.merge({ rightMenuStatus: action.forwardParams });
		case types.REQ_UPDATE_SUBMIT_PARAMS:
			return state.update("submitParams", val=>{
				return val.merge(action.updateinfo);
			});
		case types.CLEAR_ALL:
			return initialState;
		default:
			return state
	}
}