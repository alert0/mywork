import PropTyps from 'react-router/lib/PropTypes';
import Immutable from 'immutable'
import {connect} from 'react-redux'

import BgImgContainner from './BgImgContainner'
import FormArea from './FormArea'
import MultiLang from './MultiLang'

import ecLocalStorage from '../../util/ecLocalStorage.js';

import '../../css/e9login.css';

import {loginPreLoadData,loginHrmSetting,loginSetBgSrc,changeFormVisible} from '../../actions/login'

var loginInterval = null;
var formheight = "auto";
var qrcode =""
class E9Login extends React.Component {
    static contextTypes = {
        router: PropTyps.routerShape
    };
    componentWillMount() {
        const {dispatch} = this.props
        dispatch(loginPreLoadData())
    
        dispatch(loginHrmSetting())
    }
    componentDidMount() {
        const {formvisible} = this.props
        if (qrcode && !formvisible) {
            window.promiseFetch("/page/interfaces/loginInfoToJson.jsp?method=loaded",{},"get")
                .then((result)=>{
                    qrcode = result.qrcode
                    $('.login-form-qrcode-img').qrcode({
                        render: "div",
                        text: "ecologylogin:" + qrcode,
                        size: 175,
                        background: "none",
                        fill: "#424345"
                    });

                    loginInterval = window.setInterval(this.scanQRCode.bind(this), 1000);
                })
        } else {
            window.promiseFetch("/page/interfaces/loginInfoToJson.jsp?method=loaded",{},"get")
                .then((result)=>{
                    qrcode = result.qrcode
                    $('.login-form-qrcode-img').qrcode({
                        render: "div",
                        text: "ecologylogin:" + qrcode,
                        size: 175,
                        background: "none",
                        fill: "#424345"
                    });
                })
        }

    }
    componentWillUnmount() {
        // 卸载组件，清除二维码扫描定时器
        window.clearInterval(loginInterval);
    }
    scanQRCode() {
        var loginId = $("#islangid").val();
        const {formvisible} = this.props
        if (!formvisible) {
            let url = "/mobile/plugin/login/QCLoginStatus.jsp?langid=" + loginId + "&loginkey=" + qrcode + "&rdm=" + new Date().getTime()
            window.promiseFetch(url,{},"get")
                .then((content) => {
                    if (jQuery.trim(content) != '0' && jQuery.trim(content) != '9') {
                        if (jQuery.trim(content) == "") {
                            content = "/wui/main.jsp";
                        }
                        window.clearInterval(loginInterval);

                        ecLocalStorage.storageInit();
                        let pathname = ecLocalStorage.getDefaultRoute();
                        const {
                            router
                        } = this.context;
                        router.push({
                            pathname: pathname
                        });
                    }
                })
        }
    }
    switchQRNormal() {
        const {dispatch,formvisible} = this.props
        if (formvisible) {
            formheight = $(".login-form").height() + "px";
            loginInterval = window.setInterval(this.scanQRCode.bind(this), 1000);
        } else {
            formheight = "auto";
            window.clearInterval(loginInterval);
        }
        dispatch(changeFormVisible(!formvisible))
    }

    setBgSrc(currentbgsrc) {
        const {dispatch} = this.props
        dispatch(loginSetBgSrc(currentbgsrc))
    }
    render() {
        const {logoLeft,logoTop,formLeft,formTop,isCombine,logoSrc,initVisible,currentbgsrc,
            hasMultiLang,formvisible} = this.props

        let logoStyle = {
            "left": logoLeft,
            "top": logoTop,
            "display": "none",
        }
        let formStyle = {
            "left": formLeft,
            "top": formTop,
            height: formheight,
            "display": "none"
        }
        let qrcodeStyle = {
            "display": "none",
        }
        
        if (initVisible>0 && initVisible%2 == 0) {
            formStyle.display="block"
            logoStyle.display="block"
        }
        if (!formvisible) {
            qrcodeStyle.display = "block"
        }
        return <div className="login-bg">
            <img className="login-bg-img" src={currentbgsrc}/>
            {!isCombine ? <LogoArea logoSrc={logoSrc} logoStyle ={logoStyle}/> :""}
            <div className="login-form" style={formStyle}>
                <div className="login-form-shadow"></div>
                <div className="login-form-realcontent">
                    {isCombine ? <LogoArea logoSrc={logoSrc}/> :""}
                    <div className="login-form-qrbtn" onClick={this.switchQRNormal.bind(this)}>
                        {formvisible ? <i className="wevicon wevicon-login-scan"/> : <i className="wevicon wevicon-login-return"/>}
                    </div>
                    {hasMultiLang ? <MultiLang/> :<input id="islangid" name="islangid" type="hidden" value="7"/>}
                    <FormArea/>
                    <QRCodeArea qrcodeStyle={qrcodeStyle}/>
                </div>
            </div>
            <BgImgContainner/>
        </div>
    }
}
const LogoArea =({logoStyle,logoSrc})=>(
    <div className="login-logo" style={logoStyle} >
        <img src={logoSrc}/>
    </div>
)
const QRCodeArea = ({qrcodeStyle})=>(
    <div className="login-form-qrcode" style={qrcodeStyle}>  
        <div className="login-form-qrcode-img"></div>
        <div className="login-form-qrcode-text">请使用e-mobile扫描以登录</div>
    </div>
)
const mapStateToProps = state => {
    const { loginPageSetting,loginFormAreaState}=state
    const formvisible = loginFormAreaState.get("formvisible")
    let newSate = loginPageSetting.merge({formvisible})
    return newSate.delete("bgsrc").toJSON()
}
module.exports = connect(mapStateToProps)(E9Login)