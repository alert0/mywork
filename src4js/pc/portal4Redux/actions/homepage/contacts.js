import {
	INIT_CONTACTS_DATA
} from '../../constants/ActionTypes';
import * as API_CONTACTS from '../../apis/homepage/contacts';

export const getContactsData = (key, url, tabid) => {
		return (dispatch, getState) => {
			API_CONTACTS.getContactsData(tabid, key, url).then((data) => {
				dispatch({
					type: INIT_CONTACTS_DATA,
					cdata: data,
					currtab: tabid,
				});
			});
		}
	}
	/*export const initContactsData = (data, tabid) => {
		return (dispatch, getState) => {
			dispatch({
				type: INIT_CONTACTS_DATA,
				cdata: data,
				currtab: tabid,
			});
		}
	}*/