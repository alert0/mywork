import React from 'react';
import PropTyps from 'react-router/lib/PropTypes';

import {WeaPopoverHrm, WeaTools} from 'weaCom';
import E9Header from './head/E9Header';
import E9Menu from './menu/E9Menu';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as portalMenuActions from '../../../actions/menu';
import {loadMain} from '../../../actions/menu';

class E9Theme extends React.Component {
    static contextTypes = {
        router: PropTyps.routerShape
    };

    constructor(props) {
        super(props);

        this.onLoadLeftMenu = this.onLoadLeftMenu.bind(this);
        this.onLoadMain = this.onLoadMain.bind(this);
    }

    componentDidMount() {
        // 左侧菜单加载
        const {actions} = this.props;
        const {router} = this.context;
        let pathname = this.props.location.pathname;
        actions.loadLeftMenu(router, pathname, true);

        // 插件加载
        setTimeout(function () {
            WeaTools.callApi('/wui/common/page/pluginManage.jsp', 'GET', {}, 'text').then(function (result) {
                jQuery('head').append(result);
            }, function (result) {
                console.log(result);
            });
        }, 500);

        // 设置主题 session
        WeaTools.callApi('/wui/theme/ecology9/page/themeSessionManage.jsp', 'POST', {method: 'add', theme: 'ecology9'}, 'json').then(function (result) {
        });
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.location.key != nextProps.location.key) {
            return true;
        }
    }

    onLoadLeftMenu(type, topMenuId, topMenuName) {
        const {actions} = this.props;
        const {router} = this.context;
        actions.changeLeftMenu(type, topMenuId, topMenuName, router);
    }

    onLoadMain(routeurl, url, selectedMenu) {
        const {router} = this.context;
        if (!selectedMenu) {
            selectedMenu = {
                routeurl: routeurl,
                url: url,
                target: 'mainFrame'
            };
        }

        loadMain(router, selectedMenu);
    }

    render() {
        //console.log('E9Theme render...');
        let pathname = this.props.location.pathname;

        return (
            <div className="e9-layout-container">
                <WeaPopoverHrm />
                <div className="e9-layout-header">
                    <E9Header pathname={pathname} onLoadLeftMenu={this.onLoadLeftMenu} onLoadMain={this.onLoadMain} />
                </div>
                <div className="e9-layout-content">
                    <div className="e9-layout-aside">
                        <E9Menu pathname={pathname} onLoadMain={this.onLoadMain} />
                    </div>
                    <div className="e9-layout-main">
                        <div id="e9routeMain" className="e9-layout-main-route">
                            {this.props.children}
                        </div>

                        <div id="e9frameMain" className="e9-layout-main-frame">
                            <iframe
                                id="mainFrame"
                                name="mainFrame"
                                frameBorder="no"
                                width="100%"
                                height="100%"
                                scrolling="auto"
                                src="about:blank">
                            </iframe>
                        </div>
                    </div>
                    <div className="e9-layout-clear"></div>
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
        actions: bindActionCreators(portalMenuActions, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9Theme);