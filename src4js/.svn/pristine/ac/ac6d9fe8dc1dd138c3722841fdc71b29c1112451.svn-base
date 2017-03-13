import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as themeActions from '../../../actions/theme';

import E9TopLogo from './E9TopLogo';
import E9TopMenu from './E9TopMenu';
import E9FreqUseMenu from './E9FreqUseMenu';
import E9QuickSearch from './E9QuickSearch';
import E9Remind from './E9Remind';
import E9ToolBar from './E9ToolBar';
import E9ToolBarMore from './E9ToolBarMore';
import E9Account from './E9Account';

class E9Header extends React.Component {
    render() {
        return (
            <div className="e9header-container">
                <div className="e9header-left">
                    <E9TopLogo />
                    <E9TopMenu {...this.props} />
                    <E9FreqUseMenu />
                    <E9QuickSearch />
                </div>
                <div className="e9header-right">
                    <div className="e9header-sign" id="e9header-sign"></div>
                    <div className="e9header-toolbar-separate"></div>
                    <E9Remind />
                    <E9ToolBar />
                    <E9ToolBarMore />
                    <div className="e9header-toolbar-separate"></div>
                    <E9Account />
                </div>
            </div>
        )
    }
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9Header);