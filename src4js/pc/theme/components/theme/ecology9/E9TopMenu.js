import React from 'react';
import {Popover} from 'antd';
import {WeaScroll} from 'ecCom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as themeActions from '../../../actions/theme';
import {MODULE_ROUTE_MAP} from '../../../constants/ModuleRouteMap';

class E9TopMenu extends React.Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.loadTopMenu();

        let pathname = this.props.location.pathname;
        this.onChangeSelected(pathname);
    }

    componentWillReceiveProps(nextProps) {
        let pathname = this.props.location.pathname;
        let nextPathname = nextProps.location.pathname;
        let from = nextProps.location.query.from;
        if (nextPathname && !from && nextPathname != pathname) {
            this.onChangeSelected(nextPathname);
        }
    }

    onChangeSelected(pathname) {
        const {actions} = this.props;
        let routes = pathname.split('/');
        let moduleRoute = '';
        let menuId = 0;
        let menuName = '';
        if (routes && routes.length == 3) {
            moduleRoute = routes[1];
            menuId = MODULE_ROUTE_MAP[moduleRoute].id;
            menuName = MODULE_ROUTE_MAP[moduleRoute].name;
            actions.changeTopMenuSelected({menuId: menuId, menuName: menuName});
        }
    }

    onHomeClick() {
        const {actions} = this.props;
        const menuId = 0;
        const menuName = '我的门户';
        actions.changeLeftMenu('portal', menuId, menuName);
        actions.changeTopMenuSelected({menuId: menuId, menuName: menuName});
    }

    onTopMenuClick(menuId, menuName) {
        const {actions} = this.props;
        actions.changeLeftMenu('common', menuId, menuName);
        actions.changeTopMenuSelected({menuId: menuId, menuName: menuName});

        this.onVisibleChange(false);
    }

    onVisibleChange(visible) {
        const {actions} = this.props;

        let e9shadowMain = document.getElementById('e9shadowMain');
        if (visible) {
            e9shadowMain.style.display = 'block';

            actions.changeFreqUseMenuVisible(false);
            actions.changeQuickSearchTypesVisible(false);
            actions.changeToolbarMoreMenuVisible(false);
            actions.changeAccountVisible(false);
        } else {
            e9shadowMain.style.display = 'none';
        }

        actions.changeTopMenuVisible(visible);
    }

    render() {
        const {topMenu, topMenuVisible, topMenuSelected} = this.props;
        const topMenu4JSON = topMenu.toJSON();
        const topMenuSelected4JSON = topMenuSelected.toJSON();

        const topMenuContent = <E9TopMenuContent topMenu={topMenu4JSON} topMenuSelected={topMenuSelected4JSON} onTopMenuClick={this.onTopMenuClick.bind(this)} />;
        const topMenuName = topMenuSelected4JSON.menuName;

        return (
            <div className="e9header-top-menu">
                <div className="e9header-top-menu-home" title="首页" onClick={this.onHomeClick.bind(this)}>
                    <i className="wevicon wevicon-e9header-top-menu-home" />
                </div>
                <Popover visible={topMenuVisible} onVisibleChange={this.onVisibleChange.bind(this)} placement="bottomLeft" content={topMenuContent} trigger="hover" overlayClassName="e9header-top-menu-popover">
                    <div className="e9header-top-menu-module">
                        <div className="e9header-top-menu-common">
                            <i className="wevicon wevicon-e9header-top-menu-common" />
                        </div>
                        <div className="e9header-top-menu-name" title={topMenuName}>{topMenuName}</div>
                    </div>
                </Popover>
            </div>
        )
    }
}

class E9TopMenuContent extends React.Component {
    render() {
        const {topMenu, topMenuSelected} = this.props;

        let items = topMenu.map((item, index) => {
            let menuId = item.infoId;
            let menuName = item.name;
            let class4selected = menuId == topMenuSelected.menuId ? 'e9header-top-menu-item-selected' : '';

            return (
                <div key={index} className={`e9header-top-menu-item ${class4selected} e9header-top-menu-color${(Math.abs(parseInt(menuId, 10)) & 7)}`}
                     title={menuName} data-top-menu-id={menuId} onClick={this.props.onTopMenuClick.bind(this, menuId, menuName)}>
                    <div className="e9header-top-menu-item-cover">
                        <div className="e9header-top-menu-item-icon">
                            <i className={`wevicon wevicon-e9header-top-menu-default wevicon-e9header-top-menu-${menuId}`} />
                        </div>
                        <div className="e9header-top-menu-item-text">{menuName}</div>
                    </div>
                </div>
            )
        });

        return (
            <WeaScroll typeClass="scrollbar-macosx" className="e9header-top-menu-scroll" conClass="e9header-top-menu-scroll" conHeightNum={0}>
                <div className="e9header-top-menu-content">
                    {items}
                </div>
            </WeaScroll>
        )
    }
}

function mapStateToProps(state) {
    const {theme} = state;

    return {
        topMenu: theme.get('topMenu'),
        topMenuVisible: theme.get('topMenuVisible'),
        topMenuSelected: theme.get('topMenuSelected')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9TopMenu);