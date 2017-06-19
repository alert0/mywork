import * as types from '../constants/ActionTypes'

let initialState = {
	title: "查询会议",
	loading: false
};

export default function search(state = initialState, action) {
	switch(action.type) {
		case types.SEARCH_LOADING:
			return {...state, loading: action.loading};
		default:
			return state
	}
}