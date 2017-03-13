import {WeaTools} from 'weaCom';
import {
    PortalHeadActions,PortalHeadTopMenuActions,PortalHeadQuickSearchActions,PortalHeadPopOverActions
} from '../constants/ActionTypes'
import ecLocalStorage from '../util/ecLocalStorage.js';

export function loadToolbarItems() {
	return (dispatch) => {

        WeaTools.callApi('/page/interfaces/toolbarIconToJson.jsp', 'GET', {}, 'json').then((result) => {
                dispatch({
                    type:PortalHeadActions.HEAD_TOOLBAR_ITEM,
                    value:result
                })
        })
    }
}
export function loadAccountInfo() {
    return (dispatch) => {

        WeaTools.callApi('/page/interfaces/accountListJson.jsp', 'GET', {}, 'json').then((result) => {
                dispatch({
                    type:PortalHeadActions.HEAD_ACCOUNTINFO,
                    value:result
                })
        })
    }
}
export function loadLogoSetting() {
    return (dispatch) => {

        WeaTools.callApi('/page/interfaces/themeColorListJson.jsp', 'GET', {}, 'json').then((result) => {
                dispatch({
                    type:PortalHeadActions.HEAD_GET_LOGO_SRC,
                    value:result.logo
                })
        })
    }
}

export function loadQuickSearchMenu() {
    return (dispatch) => {

        WeaTools.callApi('/page/interfaces/quickSearchItemsToJson.jsp', 'GET', {}, 'json').then((result) => {
                dispatch({
                    type:PortalHeadActions.HEAD_QUICKSEARCH_MENU,
                    value:result
                })
                let param = {
                    selquicksearchname: result[0].name,
                    quickSearchForm: result[0].form,
                    quickSearchType: result[0].searchType,
                }
                dispatch(selectQuickSearchItem(param))
        })
    }
}
export function loadTopMenu() {
    return (dispatch) => {

        WeaTools.callApi('/page/interfaces/leftMenuToJson.jsp?parentid=0&needchild=0&withportal=0', 'GET', {}, 'json').then((result) => {
                dispatch({
                    type:PortalHeadActions.HEAD_TOP_MENU,
                    value:result
                })
        })
    }
}
export function loadFreqUseMenu() {
    return (dispatch) => {

        WeaTools.callApi('/page/interfaces/commonMenuToJson.jsp?shownourlmenu=n', 'GET', {}, 'json').then((result) => {
                dispatch({
                    type:PortalHeadActions.HEAD_FREQUSE_MENU,
                    value:result
                })
        })
    }
}
export function clearFreqUseMenu() {
    return (dispatch) => {

        WeaTools.callApi('/wui/theme/ecology8/page/commonmenuoperation.jsp', 'POST', {method: 'clear'}, 'json').then((result) => {
                dispatch({
                    type:PortalHeadActions.HEAD_FREQUSE_MENU,
                    value:[]
                })
        })
    }
}
export function loadToolBarMoreMenu() {
    return (dispatch) => {

        WeaTools.callApi('/page/interfaces/toolbarMoreMenuToJson.jsp?menutype=front', 'GET', {}, 'json').then((result) => {
                dispatch({
                    type:PortalHeadActions.HEAD_TOOLBAR_MORE,
                    value:result
                })
        })
    }
}
export function synRemindInfo() {
    return (dispatch) => {

        WeaTools.callApi('/wui/theme/ecology9/page/getRemindInfo.jsp', 'GET', {}, 'json').then((result) => {
                var hasInfo = true;

                if (result[0].key == "nodata") {
                    hasInfo = false;
                }
                dispatch({
                    type:PortalHeadActions.HEAD_SYN_REMINDINFO,
                    remindInfoList:result,
                    hasremindinfo:hasInfo
                })
        })
    }
}
export function loadBirthInfo(cacheKey) {
    return (dispatch) => {

        WeaTools.callApi('/hrm/resource/getBirthdayInfo.jsp', 'GET', {}, 'json').then((result) => {
                if (result.userlist.length > 0) {
                    dispatch({
                        type:PortalHeadActions.HEAD_BIRTHINFO,
                        value:result,
                        visible:true
                    })

                    ecLocalStorage.set(cacheKey, 'showedbirth', 1, true);

                    setTimeout(() => dispatch(changeBirthVisible(false))
                    , 14 * 1000)
                }
        })
    }
}
export function changeBirthVisible(visible) {
	return {
		type: PortalHeadActions.HEAD_BIRTH_VISIBLE,
		value:visible
	}
}


export function selectTopMenuName(name) {
	return {
		type: PortalHeadTopMenuActions.HEAD_TOPMENU_SELNAME,
		value:name
	}
}


export function selectQuickSearchItem(param) {
    return {
        type: PortalHeadQuickSearchActions.HEAD_QUICKSEARCH_SETSELITEM,
        param
    }
}

export function changeTopMenuPop(visible) {
	let classname = "css-topmenu-btnblock css-topmenu-topmenu"
	if (visible) {
		classname+= " css-topmenu-topmenu-expand"
	}
	return {
		type: PortalHeadPopOverActions.HEAD_TOPMENU_VISIBLE,
		visible,
		classname
	}
}
export function changeFreqUsePop(visible) {
	return {
		type: PortalHeadPopOverActions.HEAD_FREQUSE_VISIBLE,
		value:visible
	}
}
export function changeQuickSearchPop(visible) {
	let classname = "css-topmenu-searchblock-text"
	if (visible) {
		classname+= " css-topmenu-searchblock-expand"
	}
	return {
		type: PortalHeadPopOverActions.HEAD_QUICKSEARCH_VISIBLE,
		visible,
		classname
	}
}
export function changeToolbarMorePop(visible) {
	return {
		type: PortalHeadPopOverActions.HEAD_TOOLBARMORE_VISIBLE,
		value:visible
	}
}
export function changeHrmInfoPop(visible) {
	let classname = "css-topmenu-btnblock css-topmenu-hrminfo"
	if (visible) {
		classname+= " css-topmenu-hrminfo-expand"
	}
	return {
		type: PortalHeadPopOverActions.HEAD_HRMINFO_VISIBLE,
		visible,
		classname
	}
}
export function changeRemindInfoPop(visible) {
	return {
		type: PortalHeadPopOverActions.HEAD_REMINDINFO_VISIBLE,
		value:visible
	}
}