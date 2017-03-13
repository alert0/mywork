import {
	CHANGE_E_TABID
} from '../../constants/ActionTypes';
export const onChangeTab = (tabid) => {
	return (dispatch, getState) => {
		dispatch({
			type: CHANGE_E_TABID,
			currtab: tabid
		});
	}
}