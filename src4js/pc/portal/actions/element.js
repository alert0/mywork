import { INIT_E_DATA, ELEMENT_TYPES } from '../constants/ActionTypes';
import ecLocalStorage from '../util/ecLocalStorage.js';
import { reqEDatas, reqEHtml } from '../apis/req';
import Immutable from 'immutable';
const { CUSTOMPAGE } = ELEMENT_TYPES;
const getEDatas = (ele, isEReFresh) => {
    if (!isEReFresh) isEReFresh = false;
    return (dispatch, getState) => {
        const params = ele.params;
        let url = "";
        const {eid,ebaseid} = ele.item;
        let olddata = ecLocalStorage.getObj("homepage-" + window.global_hpid, "edata-" + eid, true);
        const isRE = _isRE(ebaseid);
        if (!isRE) {
            url = ele.item.contentview.url;
            olddata = ecLocalStorage.getStr("homepage-" + window.global_hpid, "edata-" + eid, true);
        }
        dispatch(handleImmutableData(eid, isEReFresh, olddata));
        if (isRE) {
            reqEDatas(params).then((data) => {
                let iolddata = Immutable.fromJS(olddata);
                let idata = Immutable.fromJS(data);
                //存储元素数据
                if (!Immutable.is(iolddata, idata) || isEReFresh) {
                    ecLocalStorage.set("homepage-" + window.global_hpid, "edata-" + eid, data, true);
                    if (data.tabids) {
                        let currenttab = data.currenttab ? data.currenttab : data.tabids[0];
                        //存储元素当前tab数据
                        ecLocalStorage.set("homepage-" + window.global_hpid, "tabdata-" + eid + "-" + currenttab, data.data, true);
                        ecLocalStorage.set("currenttab", "tabid-" + eid, currenttab, true);
                    }
                    dispatch(handleImmutableData(eid, false, data));
                }

            });
        } else {
            reqEHtml(url).then((data) => {
                if (ecLocalStorage.getStr("homepage-" + window.global_hpid, "edata-" + eid, true) !== data || isEReFresh) {
                    ecLocalStorage.set("homepage-" + window.global_hpid, "edata-" + eid, data, true);
                    dispatch(handleImmutableData(eid, false, data));
                }
            });
        }
    }
}
const getImmutableData = (eid, old, im) => {
    var ndata = {};
    ndata[eid] = old;
    var nresult = im.merge(Immutable.fromJS(ndata));
    return nresult;
}

const handleImmutableData = (eid, isEReFresh, edata) => {
    return (dispatch, getState) => {
        const iedata = getState().element.get("edata");
        const iIsEReFresh = getState().element.get("isEReFresh");
        dispatch({
            type: INIT_E_DATA,
            edata: getImmutableData(eid, edata, iedata),
            isEReFresh: getImmutableData(eid, isEReFresh, iIsEReFresh)
        });
    }
}

const handleRefresh = ele => {
    return (dispatch, getState) => {
        if (ele.item.ebaseid === CUSTOMPAGE) {
            window.ifCustomPageRefresh = true;
        } else {
            window.ifCustomPageRefresh = false;
        }
        dispatch(getEDatas(ele, true));
    }
}


module.exports = {
    getEDatas,
    handleRefresh
};
