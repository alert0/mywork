import PropTyps from 'react-router/lib/PropTypes';
import Immutable from 'immutable'
import {connect} from 'react-redux'

import {
    Checkbox,
    message,
    Button
} from 'antd';

import ecLocalStorage from '../../util/ecLocalStorage.js';

import {changeUserNameVisible,changeUserPwdVisible,changeValCodeSrc,dynamicPwdCheck,loginCheck} from '../../actions/login'

class FormArea extends React.Component {
    static contextTypes = {
        router: PropTyps.routerShape
    };

    componentDidMount() {
        const {dispatch} = this.props
        var loginid = $(".login-form-username input").val()
        dispatch(dynamicPwdCheck(loginid))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dsypwdvisible != this.props.dsypwdvisible || nextProps.valicodevisible != this.props.valicodevisible) {
            var valcodesrc = '';
            if (nextProps.valicodevisible) {
                valcodesrc = '/weaver/weaver.file.MakeValidateCode';
            }
            const {dispatch} = this.props
            dispatch(changeValCodeSrc(valcodesrc))
            if (nextProps.dsypwdvisible) {
                this.useridBlur(nextProps.dsypwdvisible)
            }
        }
    }
    chagneValiCode() {
        const {dispatch} = this.props
        seriesnum_++;
        setTimeout(() => {
            let valcodesrc = "/weaver/weaver.file.MakeValidateCode?seriesnum_=" + seriesnum_
            dispatch(changeValCodeSrc(valcodesrc))
        }, 50);
    }
    checkLogin() {
        var loginId = $(".login-form-username input").val()
        var pwd = $(".login-form-pwd input").val();
        var dynpwd = $(".login-form-dynpwd input").val();
        var valcode = $(".login-form-valcode input").val();
        if (loginId == '' || pwd == '') {
            message.error('请输入用户名、密码', 10);
            return;
        }
        if ((!$(".login-form-valcode").is(":hidden") && valcode == '') || (!$(".login-form-dynpwd").is(":hidden") && dynpwd == '')) {
            message.error('必填信息不完整', 10);
            return;
        }
        const {dispatch} = this.props
        const {router} = this.context;
        let param = {loginId,pwd,dynpwd,valcode,router,chagneValiCode:this.chagneValiCode.bind(this)}
        dispatch(loginCheck(param))
    }
    checkRemind(type, event) {
        var checked = event.target.checked

        const {dispatch} = this.props
        if (type == 'id') {
            dispatch(changeUserNameVisible(checked))
        } else if (type == 'pwd') {
            dispatch(changeUserPwdVisible(checked))
        }
    }
    keyDownEvent(type, e) {
        if (e.keyCode == 13) {
            if ('val' == type) {
                $(".login-form-submit").focus()
                return;
            } else if ('dyn' == type) {
                if ($(".login-form-valcode").is(":hidden")) {
                    $(".login-form-submit").focus()
                } else {
                    $(".login-form-valcode input").focus()
                }
            } else if ('pwd' == type) {
                if ($(".login-form-dynpwd").is(":hidden") && $(".login-form-valcode").is(":hidden")) {
                    $(".login-form-submit").focus()
                } else if (!$(".login-form-dynpwd").is(":hidden")) {
                    $(".login-form-dynpwd input").focus()
                } else {
                    $(".login-form-valcode input").focus()
                }
            } else if ('id' == type) {
                $(e.target).parent().next().find("input").focus()
            }
        }
    }
    useridBlur(obj) {
        if (!obj && !this.props.dsypwdvisible) {
            return;
        }
        const {dispatch} = this.props

        var loginid = $(".login-form-username input").val()
        dispatch(dynamicPwdCheck(loginid))
    }
    render() {  
        this.defaultUsername = "";
        this.defaultPwd = "";

        if (ecLocalStorage.getStr('e9login', 'username', false)) {
            this.defaultUsername = ecLocalStorage.getStr('e9login', 'username', false)
        }
        if (ecLocalStorage.getStr('e9login', 'pwd', false)) {
            this.defaultPwd = ecLocalStorage.getStr('e9login', 'pwd', false)
        }
        const {valicodevisible,valwrongtimes} = this.props
        const {formvisible,userDsypwdvisible,wrongtimes
            ,valcodesrc,isloginning,usernameChecked,pwdChecked} = this.props
        let contentAreaStyle = {
            "display": "block"
        }
        let dsypwdStyle = {
            "display": "none"
        }
        let valicodeStyle = {
            "display": "none"
        }
        let valCodeSrc = ""
        if (!formvisible) {
           contentAreaStyle.display= "none"
        }
        if (userDsypwdvisible) { //this.props.dsypwdvisible && 
            dsypwdStyle.display= "block"
        }
        if (valicodevisible && wrongtimes >= valwrongtimes) {
            valicodeStyle.display= "block"
            valCodeSrc = valcodesrc
        }

        return <div className ="login-contentarea" style={contentAreaStyle}>
            <div className="login-form-username">   
                <i className="wevicon wevicon-login-user"/>
                <input type="text" defaultValue={this.defaultUsername} placeholder="账号" className="login-input" onKeyDown={this.keyDownEvent.bind(this,'id')} onBlur={this.useridBlur.bind(this)}/>
            </div>
            <div className="login-form-pwd">    
                <i className="wevicon wevicon-login-pwd"/><input type="password" defaultValue={this.defaultPwd} placeholder="密码" className="login-input" onKeyDown={this.keyDownEvent.bind(this,'pwd')}/>
            </div>
            <div className="login-form-dynpwd" style={dsypwdStyle}> 
                <i className="wevicon wevicon-login-dynpwd"/><input type="text" placeholder="动态密码" className="login-input" onKeyDown={this.keyDownEvent.bind(this,'dyn')}/>
            </div>
            <div className="login-form-remind">
                <div>   
                    <span className="login-form-remind-account"><Checkbox checked={usernameChecked} onChange={this.checkRemind.bind(this,'id')}>记住账号</Checkbox></span>
                    <span className="login-form-remind-pwd"><Checkbox checked={pwdChecked} onChange={this.checkRemind.bind(this,'pwd')}>记住密码</Checkbox></span>
                </div>
                <div className="login-clear-float"></div>
            </div>
            <div className="login-form-valcode" style={valicodeStyle}>  
                <input type="text" id="valcode" placeholder="输入验证码" className="login-input" onKeyDown={this.keyDownEvent.bind(this,'val')}/>
                <div className="login-form-valcode-img">
                    <img onClick={this.chagneValiCode.bind(this)} src={valCodeSrc}/>
                </div>
                <div className="login-clear-float"></div>
            </div> 
            <div className="login-form-btn">    
                <Button className="login-form-submit" type="primary" loading={isloginning} onClick={this.checkLogin.bind(this)}>
                  登 录
                </Button>
                
            </div>
        </div>
    }
}
const mapStateToProps = state => {
    const { loginPageSetting,loginFormAreaState}=state
    let newSate = loginFormAreaState.merge(
        {valicodevisible:loginPageSetting.get("valicodevisible"),
        valwrongtimes:loginPageSetting.get("valwrongtimes")})
    return newSate.toJSON()
}
module.exports = connect(mapStateToProps)(FormArea)