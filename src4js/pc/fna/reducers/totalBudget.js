import * as types from '../constants/ActionTypes'

let initialState = {
	title: "预算总额表",
	loading: false
};

export default function totalBudget(state = initialState, action) {
	switch(action.type) {
		case types.TOTALBUDGET_LOADING:
			return {...state, loading: action.loading};
		default:
			return state
	}
}