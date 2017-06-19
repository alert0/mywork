import * as types from '../constants/ActionTypes'

let initialState = {
	title: "我的关注",
	loading: false
};

export default function myAttention(state = initialState, action) {
	switch(action.type) {
		case types.MYATTENTION_LOADING:
			return {...state, loading: action.loading};
		default:
			return state
	}
}