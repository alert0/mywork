import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as themeActions from '../../../actions/theme';
import {onLoadMain} from '../../../actions/theme';
import * as THEME_API from '../../../apis/theme';

import {WeaMenu} from 'weaCom';
import E9LeftMenuTop4Email from './E9LeftMenuTop4Email';

class E9LeftMenu extends React.Component {
    componentWillReceiveProps(nextProps) {
        const {actions} = this.props;
        let pathname = this.props.location.pathname;
        let nextPathname = nextProps.location.pathname;
        let from = nextProps.location.query.from;
        if (nextPathname && !from && nextPathname != pathname) {
            actions.loadLeftMenu(nextPathname, false);
        }
    }

    onSelect(key, leftMenuSelected, type) {
        const {actions} = this.props;
        // type=0 表示正常点击菜单，type=1 表示点击菜单后面的图标
        if (type == 1 && leftMenuSelected.id == '536-53606') {
            // 清空垃圾箱
            window.top.Dialog.confirm('确定要清空该文件夹下的邮件吗？', function () {
                THEME_API.clearEmail().then(function () {
                    // 垃圾箱清空后，打开垃圾箱
                    onLoadMain(leftMenuSelected);
                    actions.changeLeftMenuSelected(leftMenuSelected);
                });
            });

        } else {
            if (1 == type) {
                leftMenuSelected.url = leftMenuSelected.titleUrl;
            }
            onLoadMain(leftMenuSelected);
            actions.changeLeftMenuSelected(leftMenuSelected);
        }
    }

    onModeChange(leftMenuMode) {
        const {actions} = this.props;
        actions.changeLeftMenuMode(leftMenuMode);
    }

    render() {
        const {leftMenuMode, leftMenu, leftMenuSelected, leftMenuType} = this.props;
        const leftMenu4JSON = leftMenu.toJSON();
        const leftMenuSelected4JSON = leftMenuSelected.toJSON();

        let showLeftMenu = leftMenu4JSON;
        let selectedKey = leftMenuSelected4JSON.id;
        let emailMenu = [];

        // 邮件菜单特殊处理，邮件菜单的展现会随着左侧菜单的模式改变而改变
        if (leftMenuType == 'email') {
            emailMenu = leftMenu4JSON;
            if (leftMenuMode == 'inline') {
                showLeftMenu = leftMenu4JSON.slice(2);
            }
        }

        return (
            <WeaMenu
                mode={leftMenuMode}
                needSwitch={true}
                inlineWidth={197}
                verticalWidth={61}
                datas={showLeftMenu}
                defaultSelectedKey={selectedKey}
                onSelect={this.onSelect.bind(this)}
                onModeChange={this.onModeChange.bind(this)}
                addonBefore={leftMenuType == 'email' ? <E9LeftMenuTop4Email emailMenu={emailMenu} onSelect={this.onSelect.bind(this)} /> : ''}
                addonBeforeHeight={leftMenuType == 'email' ? 40 : 0}
            />
        );
    }
}

function mapStateToProps(state) {
    const {theme} = state;

    return {
        leftMenuMode: theme.get('leftMenuMode'),
        leftMenu: theme.get('leftMenu'),
        leftMenuSelected: theme.get('leftMenuSelected'),
        leftMenuType: theme.get('leftMenuType')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9LeftMenu);