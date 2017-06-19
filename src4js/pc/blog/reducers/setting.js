import * as types from '../constants/ActionTypes'

let initialState = {
	title: "微博设置",
	loading: false
};

export default function setting(state = initialState, action) {
	switch(action.type) {
		case types.SETTING_LOADING:
			return {...state, loading: action.loading};
		default:
			return state
	}
}