import { INIT_CONTACTS_DATA } from '../constants/ActionTypes';
import { reqContactsDatas } from '../apis/req';
const getContactsData = (key, params, tabid) => {
    return (dispatch, getState) => {
        params['tabId'] = tabid;
        params['key'] = key;
        reqContactsDatas(params).then((data) => {
            dispatch({
                type: INIT_CONTACTS_DATA,
                cdata: data,
                currtab: tabid,
            });
        });
    }
}

module.exports = {
    getContactsData
};
