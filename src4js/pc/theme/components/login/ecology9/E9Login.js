import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loginActions from '../../../actions/login';
import * as login4e9Actions from '../../../actions/login4e9';

import E9MultiLang from './E9MultiLang';
import E9Form from './E9Form';
import E9QRCode from './E9QRCode';
import E9BgImages from './E9BgImages';

class E9Login extends React.Component {
    componentWillMount() {
        const {loginActions, login4e9Actions} = this.props;
        loginActions.loadLoginFormSetting();
        loginActions.loadLoginQRCode();
        login4e9Actions.loadLoginImages();
    }

    onChangeLoginType() {
        const {loginActions, loginType} = this.props;
        loginActions.changeLoginType(loginType);
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
    const {login, login4e9} = state;
    return {
        loginType: login.get('loginType'),
        loginBgImage: login4e9.get('loginBgImage'),
        loginLogoImage: login4e9.get('loginLogoImage')
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginActions: bindActionCreators(loginActions, dispatch),
        login4e9Actions: bindActionCreators(login4e9Actions, dispatch),
        dispatch: dispatch
    }
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9Login);