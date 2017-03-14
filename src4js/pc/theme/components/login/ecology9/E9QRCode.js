import React from 'react';
import PropTyps from 'react-router/lib/PropTypes';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loginActions from '../../../actions/login';

import {WeaTools} from 'weaCom';

import ecLocalStorage from '../../../util/ecLocalStorage';

class E9QRCode extends React.Component {
    static contextTypes = {
        router: PropTyps.routerShape
    };

    componentDidMount() {
        this.getQRCode();
    }

    componentDidUpdate() {
        this.getQRCode();
    }

    componentWillUnmount() {
        // 卸载组件，清除二维码扫描定时器
        window.clearInterval(this.scanInterval);
    }

    getQRCode() {
        const {loginQRCode} = this.props;

        if (loginQRCode != '') {
            jQuery('#QRCodeArea').html('');
            jQuery('#QRCodeArea').qrcode({
                render: 'div',
                text: 'ecologylogin:' + loginQRCode,
                size: 175,
                background: 'none',
                fill: '#424345'
            });
            window.clearInterval(this.scanInterval);
            this.scanInterval = window.setInterval(this.scanQRCode.bind(this), 1000);
        }
    }

    scanQRCode() {
        const {loginQRCode} = this.props;
        let langId = document.getElementById('langId');

        WeaTools.callApi('/mobile/plugin/login/QCLoginStatus.jsp', 'POST', {langid: langId, loginkey: loginQRCode}, 'text').then((result) => {
            if (jQuery.trim(result) != '0' && jQuery.trim(result) != '9') {
                const {router} = this.context;
                ecLocalStorage.storageInit();
                let pathname = ecLocalStorage.getDefaultRoute();
                router.push({pathname: pathname});
            }
        });
    }

    render() {
        return (
            <div className="e9login-QRCode">
                <div className="e9login-QRCode-area" id="QRCodeArea"></div>
                <div className="e9login-QRCode-describe">请使用e-mobile扫描二维码以登录</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {login} = state;
    return {
        loginQRCode: login.get('loginQRCode')
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(loginActions, dispatch)
    }
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9QRCode);