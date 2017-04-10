import React from 'react';
import {Checkbox, message, Button} from 'antd';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loginActions from '../../../actions/login';

class E9Form extends React.Component {
    componentWillMount() {
        // 刷新验证码需要的参数，每刷新一次加1
        this.seriesnum_ = 0;
    }

    componentDidMount() {
        const {actions} = this.props;
        let account = this.refs['account'].value;
        if (account != '') {
            actions.checkHasDynamicPassword(account);
        }
    }

    onKeyDownEvent(type, e) {
        const {hasDynamicPassword, hasValidateCode, maxWrongTimes, wrongTimes} = this.props;

        // 在输入框中按下“回车”键时，将焦点定位到下一个输入框中
        if (e.keyCode == 13) {
            if ('account' == type) {
                this.refs['password'].focus();
            } else if ('password' == type) {
                if (!hasDynamicPassword && !(hasValidateCode && wrongTimes >= maxWrongTimes)) {
                    document.getElementById('submit').focus();
                } else if (hasDynamicPassword) {
                    this.refs['dynamicPassword'].focus();
                } else if (hasValidateCode) {
                    this.refs['validateCode'].focus();
                }
            } else if ('dynamicPassword' == type) {
                if (!(hasValidateCode && wrongTimes >= maxWrongTimes)) {
                    document.getElementById('submit').focus();
                } else {
                    this.refs['validateCode'].focus();
                }
            } else if ('validateCode' == type) {
                document.getElementById('submit').focus();
            }
        }
    }

    onAccountBlurEvent() {
        // 校验帐号是否开启动态密码
        const {actions} = this.props;
        let account = this.refs['account'].value;
        if (account) {
            actions.checkHasDynamicPassword(account);
        }
    }

    onChangeRemember(type, event) {
        let checked = event.target.checked;

        const {actions} = this.props;
        if ('account' == type) {
            actions.changeRememberAccount(checked);
        } else if ('password' == type) {
            actions.changeRememberPassword(checked);
        }
    }

    onChangeValidateCode() {
        this.seriesnum_++;

        const {actions} = this.props;
        setTimeout(() => {
            let validateCode = '/weaver/weaver.file.MakeValidateCode?seriesnum_=' + this.seriesnum_;
            actions.changeValidateCode(validateCode);
        }, 50);
    }

    loginCheck() {
        const {hasDynamicPassword, hasValidateCode, maxWrongTimes, wrongTimes, isRememberAccount, isRememberPassword} = this.props;

        let account = this.refs['account'].value;
        let password = this.refs['password'].value;
        let dynamicPassword = '';
        let validateCode = '';

        if (account == '' || password == '') {
            message.error('请输入用户名、密码', 5);
            return;
        }

        if (hasDynamicPassword) {
            dynamicPassword = this.refs['dynamicPassword'].value;
            if (dynamicPassword == '') {
                message.error('请输入动态密码', 5);
                return;
            }
        }

        if (hasValidateCode && wrongTimes >= maxWrongTimes) {
            validateCode = this.refs['validateCode'].value;
            if (validateCode == '') {
                message.error('请输入验证码', 5);
                return;
            }
        }

        const {actions} = this.props;
        let params = {
            account, password, dynamicPassword, validateCode,
            isRememberAccount, isRememberPassword,
            onChangeValidateCode: this.onChangeValidateCode.bind(this)
        };
        actions.onLogin(params);
    }

    render() {
        const {
            hasDynamicPassword, isRememberAccount, isRememberPassword, cacheAccount, cachePassword,
            hasValidateCode, maxWrongTimes, wrongTimes, validateCode, isLogging
        } = this.props;

        return (
            <div className="e9login-form">
                <div className="e9login-form-account">
                    <i className="wevicon wevicon-e9login-account" />
                    <input style={{display: 'none'}} />
                    <input ref="account" type="text" className="e9login-form-input"
                           autoComplete="off"
                           defaultValue={cacheAccount}
                           placeholder="账号"
                           onKeyDown={this.onKeyDownEvent.bind(this, 'account')}
                           onBlur={this.onAccountBlurEvent.bind(this)}
                    />
                </div>
                <div className="e9login-form-password">
                    <i className="wevicon wevicon-e9login-password" />
                    <input style={{display: 'none'}} />
                    <input ref="password" type="password" className="e9login-form-input"
                           autoComplete="off"
                           defaultValue={cachePassword}
                           placeholder="密码"
                           onKeyDown={this.onKeyDownEvent.bind(this, 'password')}
                    />
                </div>
                {
                    hasDynamicPassword ? (
                            <div className="e9login-form-dynamic-password">
                                <i className="wevicon wevicon-e9login-dynamic-password" />
                                <input ref="dynamicPassword" type="text" className="e9login-form-input"
                                       placeholder="动态密码"
                                       onKeyDown={this.onKeyDownEvent.bind(this, 'dynamicPassword')}
                                />
                            </div>
                        ) : ''
                }
                <div className="e9login-form-remember">
                    <div className="e9login-form-remember-content">
                        <div className="e9login-form-remember-account">
                            <Checkbox checked={isRememberAccount} onChange={this.onChangeRemember.bind(this, 'account')}>记住账号</Checkbox>
                        </div>
                        <div className="e9login-form-remember-password">
                            <Checkbox checked={isRememberPassword} onChange={this.onChangeRemember.bind(this, 'password')}>记住密码</Checkbox>
                        </div>
                    </div>
                    <div className="e9login-form-clear"></div>
                </div>
                {
                    hasValidateCode && wrongTimes >= maxWrongTimes ? (
                            <div className="e9login-form-validate-code">
                                <input ref="validateCode" type="text" className="e9login-form-validate-code-input"
                                       placeholder="请输入验证码"
                                       onKeyDown={this.onKeyDownEvent.bind(this, 'validateCode')}
                                />
                                <div className="e9login-form-validate-code-content">
                                    <img className="e9login-form-validate-code-img" onClick={this.onChangeValidateCode.bind(this)} src={validateCode} alt="" />
                                </div>
                                <div className="e9login-form-clear"></div>
                            </div>
                        ) : ''
                }
                <div className="e9login-form-submit">
                    <Button type="primary" className="e9login-form-submit-btn" id="submit" name="submit"
                            loading={isLogging}
                            onClick={this.loginCheck.bind(this)}
                    >
                        登 录
                    </Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {login} = state;
    return {
        hasDynamicPassword: login.get('hasDynamicPassword'),
        isRememberAccount: login.get('isRememberAccount'),
        isRememberPassword: login.get('isRememberPassword'),
        cacheAccount: login.get('cacheAccount'),
        cachePassword: login.get('cachePassword'),
        hasValidateCode: login.get('hasValidateCode'),
        maxWrongTimes: login.get('maxWrongTimes'),
        wrongTimes: login.get('wrongTimes'),
        validateCode: login.get('validateCode'),
        isLogging: login.get('isLogging')
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(loginActions, dispatch)
    }
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9Form);