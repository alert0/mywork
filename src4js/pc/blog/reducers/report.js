import * as types from '../constants/ActionTypes'

let initialState = {
	title: "微博报表",
	loading: false
};

export default function report(state = initialState, action) {
	switch(action.type) {
		case types.REPORT_LOADING:
			return {...state, loading: action.loading};
		default:
			return state
	}
}