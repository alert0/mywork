import React from 'react';
import {WeaPopoverHrm, WeaTools, WeaErrorPage} from 'ecCom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as themeActions from '../../../actions/theme';

import ECLocalStorage from '../../../util/ecLocalStorage';

import E9Header from './E9Header';
import E9LeftMenu from './E9LeftMenu';
import Birthday from '../../plugin/Birthday';

class E9Theme extends React.Component {
    componentWillMount() {
        let pathname = this.props.location.pathname;
        if (pathname == 'main') {
            ECLocalStorage.storageInit();
        }
    }

    componentDidMount() {
        const {actions} = this.props;
        let pathname = this.props.location.pathname;
        actions.loadLeftMenu(pathname, true);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.location.key != nextProps.location.key || this.props.themeColorType != nextProps.themeColorType) {
            return true;
        }
    }

    render() {
        const {themeColorType} = this.props;
        return (
            <div className={`e9theme-layout-container e9theme-color-${themeColorType}`}>
                <iframe id="hiddenPreLoader" name="hiddenPreLoader" style={{display: "none"}} frameBorder="0" width="0" height="0" src="/spa/workflow/index.html"></iframe>
                <WeaPopoverHrm />
                <Birthday />
                <div className="e9theme-layout-header">
                    <E9Header {...this.props} />
                </div>
                <div className="e9theme-layout-content">
                    <div className="e9theme-layout-aside">
                        <E9LeftMenu {...this.props} />
                    </div>
                    <div className="e9theme-layout-main">
                        <div id="e9shadowMain" className="e9theme-layout-main-shadow"></div>
                        <div id="e9routeMain" className="e9theme-layout-main-route">
                            {this.props.children}
                        </div>

                        <div id="e9frameMain" className="e9theme-layout-main-frame">
                            <iframe id="mainFrame" name="mainFrame" frameBorder="no" width="100%" height="100%" scrolling="auto" src="about:blank"></iframe>
                        </div>
                    </div>
                    <div className="e9theme-layout-clear"></div>
                </div>
            </div>
        )
    }
}

class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== '';
        return (
            <WeaErrorPage msg={hasErrorMsg ? this.props.error : '对不起，该页面异常，请联系管理员！'} />
        );
    }
}

E9Theme = WeaTools.tryCatch(React, MyErrorHandler, {error: ''})(E9Theme);

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9Theme);