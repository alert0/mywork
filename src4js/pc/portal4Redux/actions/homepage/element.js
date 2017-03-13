import {
	INIT_E_DATA,
	ELEMENT_TYPES
} from '../../constants/ActionTypes';
import ecLocalStorage from '../../util/ecLocalStorage.js';
import * as API_ELEMENT from '../../apis/homepage/element';
import Immutable from 'immutable';

const {
	CUSTOMPAGE
} = ELEMENT_TYPES;
export const getEDatas = (ele, isEReFresh) => {
	if (!isEReFresh) isEReFresh = false;
	return (dispatch, getState) => {
		let url = ele.url;
		const eid = ele.item.eid;
		const ebaseid = ele.item.ebaseid;
		let olddata = ecLocalStorage.getObj("homepage-" + window.global_hpid, "edata-" + eid, true);
		const isRE = _isReactElement(ebaseid);
		if (!isRE) {
			url = ele.item.contentview.url;
			olddata = ecLocalStorage.getStr("homepage-" + window.global_hpid, "edata-" + eid, true);
		}
		dispatch(handleImmutableData(eid, isEReFresh, olddata));
		if (url && url.indexOf(".jsp") !== -1) {
			API_ELEMENT.getEDatas(url).then((data) => {
				if (isRE) {
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
				} else {
					if (ecLocalStorage.getStr("homepage-" + window.global_hpid, "edata-" + eid, true) !== data || isEReFresh) {
						ecLocalStorage.set("homepage-" + window.global_hpid, "edata-" + eid, data, true);
						dispatch(handleImmutableData(eid, false, data));
					}
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

export const handleRefresh = ele => {
	return (dispatch, getState) => {
		if (ele.item.ebaseid === CUSTOMPAGE) {
			window.ifCustomPageRefresh = true;
		} else {
			window.ifCustomPageRefresh = false;
		}
		dispatch(getEDatas(ele, true));
	}
}