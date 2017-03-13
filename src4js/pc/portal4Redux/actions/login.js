import {
    LoginActions
} from '../constants/ActionTypes';
import {message} from 'antd';
import ecLocalStorage from '../util/ecLocalStorage.js';
import {ErrorInfo} from '../util/utils';

export function loginPreLoadData() {
	return (dispatch, getState) => {
		window.promiseFetch("/page/interfaces/loginInfoToJson.jsp?method=preload", {}, "GET")
			.then((result) => {
				let curbgSrc = getState().loginPageSetting.get("currentbgsrc");
				let bgExists = false;

				result.isCombine = ("1" == result.isCombine)

				result.initVisible = getState().loginPageSetting.get("initVisible") + 1

				result.bgsrc.forEach((itembg) => {
					if (curbgSrc == itembg) {
						bgExists = true;
					}
				})
				if (!bgExists) {
					dispatch(loginSetBgSrc(result.bgsrc[0]))
				}
				ecLocalStorage.set('e9login', 'logoSrc', result.logoSrc, false);
				dispatch({
					type: LoginActions.LOGIN_PRELOAD,
					result
				})
			})

	}
}
export function loginHrmSetting() {
	return (dispatch, getState) => {
		window.promiseFetch("/login/LoginUtil.jsp", {type: "hrmsetting"})
			.then((result) => {
				let data = {}
				data.dsypwdvisible = ("1" == result.showDynamicPwd);
				data.valicodevisible = ("1" == result.needvalidate);
				data.hasMultiLang = ("1" == result.multilang);

				data.initVisible = getState().loginPageSetting.get("initVisible") + 1

				data.valwrongtimes = result.numvalidatewrong;
				dispatch({
					type: LoginActions.LOGIN_HRMSETTING,
					result: data
				})
			})
	}
}
export function loginSetBgSrc(bgsrc) {
	ecLocalStorage.set('e9login', 'currentbgsrc', bgsrc, false);
	return {
		type: LoginActions.LOGIN_SETBGSRC,
		bgsrc
	}
}

export function changeFormVisible(formvisible) {
	return {
		type: LoginActions.LOGIN_FORM_VISIBLE,
		value:formvisible
	}
}
export function changeUserNameVisible(usernameChecked) {
	return {
		type: LoginActions.LOGIN_USER_CHECKED,
		value:usernameChecked
	}
}
export function changeUserPwdVisible(pwdChecked) {
	return {
		type: LoginActions.LOGIN_PWD_CHECKED,
		value:pwdChecked
	}
}
export function setDynPwdState(userDsypwdvisible) {
	return {
		type: LoginActions.LOGIN_CHECK_DYNPWD,
		userDsypwdvisible
	}
}
export function changeValCodeSrc(valcodesrc) {	
	return {
		type: LoginActions.LOGIN_CHANGEVALCODE,
		value:valcodesrc
	}
}
export function changeSubmitBtnState(isloginning) {
	return {
		type: LoginActions.LOGIN_SETBTNSTATE,
		value:isloginning
	}
}
export function setWrongTimes(wrongtimes) {
	return {
		type: LoginActions.LOGIN_SETWRONGTIMES,
		wrongtimes
	}
}
export function dynamicPwdCheck(loginid) {
	return (dispatch) => {
		window.promiseFetch("/login/LoginUtil.jsp", {
                type: "checkTokenKey",
                loginid: loginid
            })
			.then((result) => {
				let userDsypwdvisible = true
                if (result.status != 3) {
                    userDsypwdvisible = false
                }
                dispatch(setDynPwdState(userDsypwdvisible))
                dispatch(setWrongTimes(result.sumpasswordwrong))
		})
	}
}
export function loginCheck(param) {
	return (dispatch, getState) => {
		const {loginId,pwd,dynpwd,valcode,router,chagneValiCode} = param
		dispatch(changeSubmitBtnState(true))
		window.promiseFetch("/login/LoginUtil.jsp", {
                type: "checklogin",
                loginid: loginId,
                userpassword: pwd,
                tokenAuthKey: dynpwd,
                validatecode: valcode,
            })
			.then((result) => {
				dispatch(changeSubmitBtnState(false))
				const usernameChecked= getState().loginFormAreaState.get("usernameChecked")
				const pwdChecked= getState().loginFormAreaState.get("pwdChecked")
                if (result.loginstatus == "true") {
                    if (usernameChecked) {
                    	ecLocalStorage.set('e9login', 'username', loginId, false);
                    } else {
                    	ecLocalStorage.set('e9login', 'username', '', false);
                    }
                    ecLocalStorage.set('e9login', 'isRemindAccount', usernameChecked, false);
                    if (pwdChecked) {
                    	ecLocalStorage.set('e9login', 'pwd', pwd, false);
                    } else {
                    	ecLocalStorage.set('e9login', 'pwd', '', false);
                    }
                    ecLocalStorage.set('e9login', 'isRemindPwd', pwdChecked, false);

                    message.destroy()

					ecLocalStorage.storageInit();
					let pathname = ecLocalStorage.getDefaultRoute();

                    router.push({
                        pathname: pathname
                    });
                } else {
                    let errormsg = result.msg
                    let errorUrl = "";
                    let errorBtnText = "";
                    if (errormsg == '') {
                        errormsg = "登录失败"
                    }
                    if (result.msgcode == '120') {
                        errorUrl = "/login/bindTokenKey.jsp"
                        errorBtnText = "绑定令牌"
                    } else if (result.msgcode == '122') {
                        errorUrl = "/login/syncTokenKey.jsp"
                        errorBtnText = "同步令牌"
                    }
                    if (result.msgcode == '52') {
                        chagneValiCode();
                    }
                    message.error(<ErrorInfo msg={errormsg} url={errorUrl} btntext={errorBtnText}/>, 10);
                    if(result.sumpasswordwrong == ""){
                        result.sumpasswordwrong = "0"
                    }
                    dispatch(setWrongTimes(result.sumpasswordwrong))
                }
		})
	}
}

export function changeMLDropDown(visible) {
	return {
		type: LoginActions.LOGIN_MLSELECTVISIBLE,
		value:visible
	}
}
export function selectMLItem(param) {
	return {
		type: LoginActions.LOGIN_MLSELECTDATA,
		param:param
	}
}

export function changeVisible(visible) {
	return {
		type: LoginActions.LOGIN_BGSELECTER_VISIBLE,
		value:visible
	}
}
export function scrollToLeft(scrollLeft) {
	return {
		type: LoginActions.LOGIN_BGSELECTER_LEFT,
		value:scrollLeft
	}
}