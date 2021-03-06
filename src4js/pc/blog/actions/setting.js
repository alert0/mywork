import * as types from '../constants/ActionTypes'

export const doLoading = loading => {
	return (dispatch, getState) => {
		dispatch({
			type: types.SETTING_LOADING,
			loading
		});
	}
}