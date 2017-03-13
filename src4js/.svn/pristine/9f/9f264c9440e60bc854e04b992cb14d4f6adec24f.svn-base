import { GET_E_TAB_DATA } from '../constants/ActionTypes';
import Immutable from 'immutable';
import ecLocalStorage from '../util/ecLocalStorage.js';
import { reqTabDatas } from '../apis/req';
const getETabDatas = (eid, params, tabid, ifClickCurrTab) => {
    return (dispatch, getState) => {
        const olddata = ecLocalStorage.getObj("homepage-" + window.global_hpid, 'tabdata-' + eid + '-' + tabid, true);
        dispatch(handleImmutableData(eid, tabid, ifClickCurrTab, olddata));
        reqTabDatas(params).then((data) => {
            let iolddata = Immutable.fromJS(olddata);
            let idata = Immutable.fromJS(data);
            if (!Immutable.is(iolddata, idata) || ifClickCurrTab) {
                ecLocalStorage.set("homepage-" + window.global_hpid, "tabdata-" + eid + "-" + tabid, data, true);
                //获取最新的tabid
                const _tabid = ecLocalStorage.getStr("currenttab", "tabid-" + eid, true);
                //判断当前元素的tabid是否以改变，快速切换tab时，前一个的tab数据还未返回，tabid已改变
                if (tabid === _tabid) {
                    dispatch(handleImmutableData(eid, tabid, false, data));
                }
            }
        });
    }
}

const getImmutableData = (eid, old, im) => {
    var ndata = {};
    ndata[eid] = old;
    var nresult = im.merge(Immutable.fromJS(ndata));
    return nresult;
}

const handleImmutableData = (eid, tabid, ifClickCurrTab, tabdata) => {
    return (dispatch, getState) => {
        const idata = getState().econtent.get("tabdata");
        const icurrtab = getState().econtent.get("currtab");
        const iclickCurrTab = getState().econtent.get("ifClickCurrTab");
        dispatch({
            type: GET_E_TAB_DATA,
            currtab: getImmutableData(eid, tabid, icurrtab),
            tabdata: getImmutableData(eid, tabdata, idata),
            ifClickCurrTab: getImmutableData(eid, ifClickCurrTab, iclickCurrTab)
        });
    }
}

const handleChangeTab = (eid, params, oldcurrtab, tabid) => {
    return (dispatch, getState) => {
        var ifClickCurrTab = tabid === oldcurrtab ? true : false;
        params['tabId'] = tabid;
        dispatch(getETabDatas(eid, params, tabid, ifClickCurrTab));
    }
}

const initETabDatas = (eid, currenttab, tabdata) => {
    return (dispatch, getState) => {
        let currtab = ecLocalStorage.getStr("currenttab", "tabid-" + eid, true);
        if (currtab) currenttab = currtab;
        const initdata = ecLocalStorage.getObj("homepage-" + window.global_hpid, 'tabdata-' + eid + '-' + currtab, true);
        if (initdata) tabdata = initdata;
        dispatch(handleImmutableData(eid, currenttab, false, tabdata));
    }
}


module.exports = {
    getETabDatas,
    handleChangeTab,
    initETabDatas
};
