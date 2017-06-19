import * as types from '../constants/ActionTypes'

let initialState = {
	title: "周期会议",
	loading: false
};

export default function repeat(state = initialState, action) {
	switch(action.type) {
		case types.REPEAT_LOADING:
			return {...state, loading: action.loading};
		default:
			return state
	}
}