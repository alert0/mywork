import {
    PortalHrmCardActions
} from '../constants/ActionTypes'

import Immutable from 'immutable'

let initState = Immutable.fromJS({
    messageshow: true,
    emailshow: true,
    workplanshow: true,
    coworkshow: true,
    curuserid:"",
    visible:false,
    left:0,
    top:0,
    imgloaded:false,
    userinfo : {
        userimg: "",
        name: "",
        sex: "",
        code: "",
        qrcode: "",
        dept: "",
        sub: "",
        job: "",
        manager: "",
        status: "",
        mobile: "",
        tel: "",
        email: "",
        location: ""
    }
})
export default function PortalHrmCardStates (state = initState, action){
    switch (action.type) {
        case PortalHrmCardActions.HRMCARDA_LOAD_SETTING:
            return state.merge(action.param);
        case PortalHrmCardActions.HRMCARDA_LOAD_USERINFO:
            return state.merge({
                userinfo: action.value,
            }); 
        case PortalHrmCardActions.HRMCARDA_SET_CURRENTDATA:
            return state.merge({
                curuserid: action.curuserid,
                left:action.left,
                top:action.top,
                visible:action.visible,
            });
        case PortalHrmCardActions.HRMCARDA_CHANGE_VISIBLE:
            return state.merge({
                visible: action.value
            })
        case PortalHrmCardActions.HRMCARDA_USERIMG_LOADED:
            return state.merge({
                imgloaded: action.value
            })
        
        default:
            return state
    }
}