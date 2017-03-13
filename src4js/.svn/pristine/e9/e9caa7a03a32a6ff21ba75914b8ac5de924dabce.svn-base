import { INIT_HP_DATA } from '../constants/ActionTypes';
import ecLocalStorage from '../util/ecLocalStorage.js';
import { reqHpDatas } from '../apis/req';
import Immutable from 'immutable';
const getHpData = (params) => {
    return (dispatch, getState) => {
        var olddata = ecLocalStorage.getObj("homepage-" + params.hpid, "hpdata-" + params.hpid + "-" + params.subCompanyId, true);
        dispatch({
            type: INIT_HP_DATA,
            hpdata: olddata
        });
        reqHpDatas(params).then((data) => {
            let iolddata = Immutable.fromJS(olddata);
            let idata = Immutable.fromJS(data);
            if (!Immutable.is(iolddata, idata)) {
                ecLocalStorage.set("homepage-" + params.hpid, "hpdata-" + params.hpid + "-" + params.subCompanyId, data, true);
                dispatch({
                    type: INIT_HP_DATA,
                    hpdata: data
                });
            }
        });
    }
}

module.exports = {
    getHpData
};
