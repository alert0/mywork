import * as types from '../constants/ActionTypes'

let initialState = {
	title: "会议任务",
	loading: false
};

export default function decision(state = initialState, action) {
	switch(action.type) {
		case types.DECISION_LOADING:
			return {...state, loading: action.loading};
		default:
			return state
	}
}