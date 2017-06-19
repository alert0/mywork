import * as types from '../constants/ActionTypes'

let initialState = {
	title: "会议日历",
	loading: false
};

export default function calView(state = initialState, action) {
	switch(action.type) {
		case types.CALVIEW_LOADING:
			return {...state, loading: action.loading};
		default:
			return state
	}
}