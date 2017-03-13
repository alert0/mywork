import React from 'react';
import {Popover} from 'antd';
import {WeaScroll} from 'weaCom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as themeActions from '../../../actions/theme';
import {onLoadMain} from '../../../actions/theme';
import {showDialog} from '../../../util/themeUtils';

class E9FreqUseMenu extends React.Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.loadFreqUseMenu();
    }

    onFreqUseMenuClick(url) {
        onLoadMain({routeurl: '', url: url});
        this.onVisibleChange(false);
    }

    onFreqUseMenuSetting() {
        const {actions, account} = this.props;
        const account4JSON = account.toJSON();

        let resourceId = account4JSON.userid;
        let title = '常用菜单设置';
        let url = `/wui/theme/ecology8/page/commonmenuSetting.jsp?type=left&isCustom=true&resourceType=3&resourceId=${resourceId}`;
        // 常用菜单设置保存回调中调用了该函数，定义一个空函数，防止报错
        window.loadCommonMenu = () => {
        };
        showDialog(title, url, 700, 600, () => actions.loadFreqUseMenu());

        this.onVisibleChange(false);
    }

    onVisibleChange(visible) {
        const {actions} = this.props;
        actions.changeFreqUseMenuVisible(visible);
    }

    render() {
        const {freqUseMenu, freqUseMenuVisible} = this.props;
        const freqUseMenu4JSON = freqUseMenu.toJSON();

        const freqUseMenuContent = <FreqUseMenuContent freqUseMenu={freqUseMenu4JSON} onFreqUseMenuClick={this.onFreqUseMenuClick.bind(this)} onFreqUseMenuSetting={this.onFreqUseMenuSetting.bind(this)} />;

        return (
            <div className="e9header-freq-use-menu" title="常用菜单">
                <Popover visible={freqUseMenuVisible} onVisibleChange={this.onVisibleChange.bind(this)} placement="bottomLeft" content={freqUseMenuContent} trigger="click" overlayClassName="e9header-freq-use-menu-popover">
                    <div className="e9header-freq-use-menu-icon">
                        <i className="wevicon wevicon-e9header-freq-use-menu" />
                    </div>
                </Popover>
            </div>
        )
    }
}

class FreqUseMenuContent extends React.Component {
    render() {
        const {freqUseMenu} = this.props;
        let items = freqUseMenu.map((item, index) => {
            let menuId = item.infoid;
            let menuName = item.menuname;
            let menuUrl = item.url;

            return (
                <div key={index} className="e9header-freq-use-menu-item" title={menuName} data-freq-use-menu-id={menuId} onClick={this.props.onFreqUseMenuClick.bind(this, menuUrl)}>
                    {menuName}
                </div>
            )
        });

        return (
            <div>
                <WeaScroll typeClass="scrollbar-macosx" className="e9header-freq-use-menu-scroll" conClass="e9header-freq-use-menu-scroll" conHeightNum={0}>
                    <div className="e9header-freq-use-menu-content">
                        {items}
                    </div>
                </WeaScroll>
                <div className="e9header-freq-use-menu-setting" title="设置" onClick={this.props.onFreqUseMenuSetting.bind(this)}>
                    <i className="wevicon wevicon-e9header-freq-use-menu-setting" />
                    <span>设置</span>
                </div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    const {theme} = state;

    return {
        freqUseMenu: theme.get('freqUseMenu'),
        freqUseMenuVisible: theme.get('freqUseMenuVisible'),
        account: theme.get('account')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9FreqUseMenu);