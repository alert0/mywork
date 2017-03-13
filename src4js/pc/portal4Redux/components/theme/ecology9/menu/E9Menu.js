import React from 'react';
import PropTyps from 'react-router/lib/PropTypes';

import {WeaTools,WeaMenu} from 'weaCom';
import LeftMenuTop from './LeftMenuTop';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as portalMenuActions from '../../../../actions/menu';
import {loadMain} from '../../../../actions/menu';

class E9Menu extends React.Component {
    static contextTypes = {
        router: PropTyps.routerShape
    };

    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onModeChange = this.onModeChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {actions, pathname} = this.props;
        const {router} = this.context;
        let nextPathname = nextProps.pathname;
        if (pathname != nextPathname) {
            //console.log(`E9Menu componentWillReceiveProps... pathname:${pathname}, nextPathname:${nextPathname}`);
            actions.loadLeftMenu(router, nextPathname, false);
        }
    }

    onSelect(key, selectedMenu, type) {
        const {actions} = this.props;
        const {router} = this.context;

        // type=0 表示正常点击菜单，type=1 表示点击菜单后面的图标
        if (1 == type && '536-53606' == selectedMenu.id) {
            // 清空垃圾箱
            window.top.Dialog.confirm('确定要清空该文件夹下的邮件吗？', function () {
                WeaTools.callApi('/email/new/MailManageOperation.jsp?operation=deleteAll&folderid=-3', 'GET', {}, 'text').then(function () {
                    // 垃圾箱清空后，打开垃圾箱
                    loadMain(router, selectedMenu);
                    actions.changeSelectedMenu(selectedMenu);
                }, function (result) {
                    console.log(result);
                });
            });

        } else {
            if (1 == type) {
                selectedMenu.url = selectedMenu.titleUrl;
            }
            loadMain(router, selectedMenu);
            actions.changeSelectedMenu(selectedMenu);
        }
    }

    onModeChange(leftMenuMode) {
        const {actions} = this.props;
        actions.changeLeftMenuMode(leftMenuMode);
    }

    render() {
        //console.log('E9Menu render...');
        const {leftMenuMode, leftMenu, selectedMenu, leftMenuType} = this.props;
        let origLeftMenu = null;
        let curLeftMenu = null;
        let selectedKey = null;

        if (leftMenu && selectedMenu) {
            curLeftMenu = origLeftMenu = leftMenu.toJSON();
            // 邮件菜单特殊处理，邮件菜单的展现会随着左侧菜单的模式改变而改变
            if ('email' == leftMenuType) {
                curLeftMenu = 'inline' == leftMenuMode ? curLeftMenu.slice(2) : curLeftMenu;
            }
            selectedKey = selectedMenu.toJSON().id;
        }

        return (
            <WeaMenu
                mode={leftMenuMode}
                needSwitch={true}
                inlineWidth={197}
                verticalWidth={61}
                datas={curLeftMenu}
                defaultSelectedKey={selectedKey}
                onSelect={this.onSelect}
                onModeChange={this.onModeChange}
                addonBefore={
                    <LeftMenuTop
                        leftMenu={origLeftMenu}
                        leftMenuType={leftMenuType}
                        onSelect={this.onSelect}
                    />
                }
                addonBeforeHeight={'email' == leftMenuType ? 40 : 0}
            />
        );
    }
}

function mapStateToProps(state) {
    const {portalLeftMenu} = state;

    return {
        leftMenuMode: portalLeftMenu.get('leftMenuMode'),
        leftMenu: portalLeftMenu.get('leftMenu'),
        selectedMenu: portalLeftMenu.get('selectedMenu'),
        leftMenuType: portalLeftMenu.get('leftMenuType')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(portalMenuActions, dispatch)
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9Menu);