import {
    PortalHeadActions,PortalHeadTopMenuActions,PortalHeadQuickSearchActions,PortalHeadPopOverActions
} from '../constants/ActionTypes'
import Immutable from 'immutable'

export function PortalHeadStates (state = Immutable.fromJS({
    userid:"",
    usermap: {},

    toolbaritems: [],
    topMenuList: [],
    freqUseMenuList: [],
    quickSearchMenuList: [],
    toolbarMoreList: [],
    remindInfoList: [],
    hasremindinfo: false,
    birthdata: {},
    birthvisible: false,

    headlogo:''
}), action){
    switch (action.type) {
        case PortalHeadActions.HEAD_TOOLBAR_ITEM:
            return state.merge({
                toolbaritems: action.value,
            })
        case PortalHeadActions.HEAD_ACCOUNTINFO:
            return state.merge({
                usermap: action.value,
                userid:action.value.userid
            })  
        case PortalHeadActions.HEAD_QUICKSEARCH_MENU:
            return state.merge({
                quickSearchMenuList: action.value
            })
        case PortalHeadActions.HEAD_TOP_MENU:
            return state.merge({
                topMenuList: action.value,
            })    
        case PortalHeadActions.HEAD_FREQUSE_MENU:
            return state.merge({
                freqUseMenuList: action.value
            })
        case PortalHeadActions.HEAD_TOOLBAR_MORE:
            return state.merge({
                toolbarMoreList: action.value,
            })
        case PortalHeadActions.HEAD_SYN_REMINDINFO:
            return state.merge({
                remindInfoList: action.remindInfoList,
                hasremindinfo: action.hasremindinfo,
            }) 
        case PortalHeadActions.HEAD_BIRTHINFO:
            return state.merge({
                birthdata: action.value,
                birthvisible: action.visible,
            })        
        case PortalHeadActions.HEAD_BIRTH_VISIBLE:
            return state.merge({
                birthvisible: action.value,
            })  
        case PortalHeadActions.HEAD_GET_LOGO_SRC:
            return state.merge({
                headlogo: action.value,
            })    
        default:
            return state
    }
}

export function PortalHeadTopMenuStates (state = Immutable.fromJS({
    selmenuname: '我的门户',
}), action){
    switch (action.type) {
        case PortalHeadTopMenuActions.HEAD_TOPMENU_SELNAME:
            return state.merge({
                selmenuname: action.value,
            })
        default:
            return state
    }
}

export function PortalHeadQuickSearchStates (state = Immutable.fromJS({
    selquicksearchname: '----',
    quickSearchForm: '',
    quickSearchType: '',
}), action){
    switch (action.type) {
        case PortalHeadQuickSearchActions.HEAD_QUICKSEARCH_SETSELITEM:
            return state.merge(action.param) 
        default:
            return state
    }
}

export function PortalHeadPopOverStates (state = Immutable.fromJS({
    topmvisible: false,
    topmclass: "css-topmenu-btnblock css-topmenu-topmenu",

    frequvisible: false,

    quicksvisible: false,
    quicksclass: "css-topmenu-searchblock-text",

    toolbarmvisible: false,

    hrmivisible: false,
    hrmiclass: "css-topmenu-btnblock css-topmenu-hrminfo",

    remindivisible: false,
}), action){
    switch (action.type) {
        case PortalHeadPopOverActions.HEAD_TOPMENU_VISIBLE:
            return state.merge({
                topmvisible: action.visible,
                topmclass: action.classname,
            })
        case PortalHeadPopOverActions.HEAD_FREQUSE_VISIBLE:
            return state.merge({
                frequvisible: action.value,
            })
        case PortalHeadPopOverActions.HEAD_QUICKSEARCH_VISIBLE:
            return state.merge({
                quicksvisible: action.visible,
                quicksclass: action.classname,
            })
        case PortalHeadPopOverActions.HEAD_TOOLBARMORE_VISIBLE:
            return state.merge({
                toolbarmvisible: action.value,
            })
        case PortalHeadPopOverActions.HEAD_HRMINFO_VISIBLE:
            return state.merge({
                hrmivisible: action.visible,
                hrmiclass: action.classname,
            })
        case PortalHeadPopOverActions.HEAD_REMINDINFO_VISIBLE:
            return state.merge({
                remindivisible: action.value,
            })
        default:
            return state
    }
}