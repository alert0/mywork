import {WeaTools} from 'weaCom';
import {
    PortalHrmCardActions
} from '../constants/ActionTypes'

import {defaultIcon,splitUserInfo,createQRCode} from  '../util/hrmcardutils'

export function loadHrmCarSetting() {
	return (dispatch) => {
        WeaTools.callApi('/page/interfaces/hrmcardInfoToJson.jsp', 'GET', {}, 'json').then((param) => {
                dispatch({
                    type:PortalHrmCardActions.HRMCARDA_LOAD_SETTING,
                    param
                })
        })
    }
}
export function loadUserInfo(param) {
    return (dispatch) => {
        const {userid,curPos} = param
        dispatch({
            type:PortalHrmCardActions.HRMCARDA_SET_CURRENTDATA,
            curuserid:userid,
            top:curPos.top,
            left:curPos.left,
            visible:true
        })
        dispatch(setUerImgLoadState(false))

        WeaTools.callApi('/hrm/resource/simpleHrmResourceTemp.jsp', 'POST', {userid: userid}, 'json').then((result)=> {
            let userinfo = splitUserInfo(result)
            dispatch({
                type: PortalHrmCardActions.HRMCARDA_LOAD_USERINFO,
                value: userinfo,
            })
            $.get(userinfo.userimg, (data)=> {
                if (data.trim() == '') {
                    userinfo.userimg = defaultIcon[userinfo.sex]
                    dispatch({
                        type: PortalHrmCardActions.HRMCARDA_LOAD_USERINFO,
                        value: userinfo,
                    })
                }
                dispatch(setUerImgLoadState(true))
            })
            createQRCode(userinfo)
        })
    }
}
export function changeHrmCardVisible(visible) {
    return {
        type:PortalHrmCardActions.HRMCARDA_CHANGE_VISIBLE,
        value:visible
    }
}
export function setUerImgLoadState(loaded) {
    return {
        type:PortalHrmCardActions.HRMCARDA_USERIMG_LOADED,
        value:loaded
    }
}