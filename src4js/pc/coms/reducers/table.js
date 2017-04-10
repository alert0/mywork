import Immutable from 'immutable'

import * as types from '../constants/ActionTypes'

const table = Immutable.fromJS({
	loading: false,
	dataKey: '',
	datas: [],
	columns: [],
	operates: [],
	sortParams: [],
	selectedRowKeys: [],
	showCheck: false,
	pageAutoWrap: false,
	//pagination
	count: 0,
	current: 1,
	pageSize: 10,
	//自定义列
	colSetVisible: false,
	colSetdatas: [],
	colSetKeys: []
});
const tables = Immutable.fromJS({ tableNow: 'init' }).merge({ init: table });

export default comsWeaTable = (state = tables, action) => {
	switch(action.type) {
		case types.TABLE_INIT:
			return state.merge({tableNow: action.name,[action.name]: table.merge(state.get(action.name) || {}).merge(action.value)});
		case types.TABLE_UPDATE:
			return state.merge({[action.name]: table.merge(state.get(action.name) || {}).merge(action.value)});
		default:
			return state
	}
}