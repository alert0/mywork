import {
    LoginActions
} from '../constants/ActionTypes'

import Immutable from 'immutable'

import ecLocalStorage from '../util/ecLocalStorage.js';

let currentbgsrc = "";
let logoSrc = "";
if (ecLocalStorage.getStr('e9login', 'currentbgsrc', false)){
	currentbgsrc = ecLocalStorage.getStr('e9login', 'currentbgsrc', false)
}
if (ecLocalStorage.getStr('e9login', 'logoSrc', false)) {
	logoSrc = ecLocalStorage.getStr('e9login', 'logoSrc', false)
}

export function loginPageSetting (state = Immutable.fromJS({
    formLeft: "40%",
    formTop: "20%",
    logoLeft: "10%",
    logoTop: "40%",
    isCombine: false,
    bgsrc: [],
    logoSrc: logoSrc,
    initVisible: 0,
    currentbgsrc: currentbgsrc,
    hasMultiLang: false,
    dsypwdvisible: false,
    valicodevisible: false,
    valwrongtimes: -1
}), action) {
	switch (action.type) {
		case LoginActions.LOGIN_PRELOAD:
			return state.merge(action.result)
		case LoginActions.LOGIN_SETBGSRC:
			return state.merge({
				currentbgsrc: action.bgsrc
			})
		case LoginActions.LOGIN_HRMSETTING:
			return state.merge(action.result)
		default:
			return state
	}
}

let usernameChecked = false;
let pwdChecked = false;
if (ecLocalStorage.getStr('e9login', 'isRemindAccount', false)) {
    usernameChecked = eval(ecLocalStorage.getStr('e9login', 'isRemindAccount', false))
}
if (ecLocalStorage.getStr('e9login', 'isRemindPwd', false)) {
    pwdChecked = eval(ecLocalStorage.getStr('e9login', 'isRemindPwd', false))
}
export function loginFormAreaState (state = Immutable.fromJS({
    formvisible: true,
    usernameChecked: usernameChecked,
    pwdChecked: pwdChecked,
    valcodesrc: "",
    wrongtimes: 0,
    userDsypwdvisible: false,
    isloginning: false,
}), action){
    switch (action.type) {
        case LoginActions.LOGIN_FORM_VISIBLE:
            return state.merge({
                formvisible: action.value
            })
        case LoginActions.LOGIN_USER_CHECKED:
            return state.merge({
                usernameChecked: action.value
            })
        case LoginActions.LOGIN_PWD_CHECKED:
            return state.merge({
                pwdChecked: action.value
            })
        case LoginActions.LOGIN_CHECK_DYNPWD:
            return state.merge({
                userDsypwdvisible: action.userDsypwdvisible,
            })
        case LoginActions.LOGIN_CHANGEVALCODE:
            return state.merge({
                valcodesrc: action.value,
            })
        case LoginActions.LOGIN_SETBTNSTATE:
            return state.merge({
                isloginning: action.value,
            })
        case LoginActions.LOGIN_SETWRONGTIMES:
            return state.merge({
                wrongtimes: eval(action.wrongtimes),
            })    
        default:
            return state
    }
}

export function loginBgSelecter (state = Immutable.fromJS({
    visible: false,
    scrollLeft: 0,
}), action){
    switch (action.type) {
        case LoginActions.LOGIN_BGSELECTER_VISIBLE:
            return state.merge({
                visible: action.value
            })
        case LoginActions.LOGIN_BGSELECTER_LEFT:
            return state.merge({
                scrollLeft: action.value
            })
        default:
            return state
    }
}
export function loginMLState (state = Immutable.fromJS({
    visible: false,
    selLang: "7",
    selText: "简体中文",
}), action){
    switch (action.type) {
        case LoginActions.LOGIN_MLSELECTVISIBLE:
            return state.merge({
                visible: action.value
            })
        case LoginActions.LOGIN_MLSELECTDATA:
            return state.merge(action.param)
        default:
            return state
    }
}