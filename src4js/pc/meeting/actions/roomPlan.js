import * as types from '../constants/ActionTypes'

export const doLoading = loading => {
	return (dispatch, getState) => {
		dispatch({
			type: types.ROOMPLAN_LOADING,
			loading
		});
	}
}