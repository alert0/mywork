import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loginActions from '../../../actions/login';

import E9MultiLang from './E9MultiLang';
import E9Form from './E9Form';
import E9QRCode from './E9QRCode';
import E9BgImages from './E9BgImages';

class E9Login extends React.Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.loadLoginImages();
        actions.loadLoginBgImages();
        actions.loadLoginFormSetting();
        actions.loadLoginQRCode();
    }

    onChangeLoginType() {
        const {actions, loginType} = this.props;
        actions.changeLoginType(loginType);
    }

    render() {
        const {loginBgImage, loginLogoImage, loginType} = this.props;
        let isForm = loginType == 'form';

        return (
            <div className="e9login-container">
                <img className="e9login-bg-img" src={loginBgImage} alt="" />
                <div className="e9login-area">
                    <div className="e9login-area-shadow"></div>
                    <div className="e9login-area-content">
                        <div className="e9login-logo">
                            <img className="e9login-logo-img" src={loginLogoImage} alt="" />
                        </div>
                        <div className="e9login-toggle" onClick={this.onChangeLoginType.bind(this)}>
                            {isForm ? <i className="wevicon wevicon-e9login-scan" /> : <i className="wevicon wevicon-e9login-back" />}
                        </div>
                        <E9MultiLang />
                        {isForm ? <E9Form /> : <E9QRCode />}
                    </div>
                </div>
                <E9BgImages />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {login} = state;
    return {
        loginBgImage: login.get('loginBgImage'),
        loginLogoImage: login.get('loginLogoImage'),
        loginType: login.get('loginType')
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(loginActions, dispatch)
    }
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9Login);