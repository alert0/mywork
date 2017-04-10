import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loginActions from '../../actions/login';

import E9Login from './ecology9/E9Login';
import E81Login from './ecology81/E81Login';

class Login extends React.Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.loadLoginTheme();
    }

    render() {
        const {loginTheme} = this.props;

        switch (loginTheme) {
            case 'ecology9':
                return <E9Login {...this.props} />;
            case 'ecology81':
                return <E81Login {...this.props} />;
            default:
                return <div></div>;
        }
    }
}

const mapStateToProps = (state) => {
    const {login} = state;
    return {
        loginTheme: login.get('loginTheme')
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(loginActions, dispatch)
    }
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Login);