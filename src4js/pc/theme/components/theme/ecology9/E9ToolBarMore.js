import React from 'react';
import {Popover} from 'antd';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as themeActions from '../../../actions/theme';

import {onLoadMain} from '../../../actions/theme';
import {showDialog} from '../../../util/themeUtil';

class E9ToolBarMore extends React.Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.loadToolbarMoreMenu();
    }

    onToolbarMoreMenuClick(item) {
        let title = item.name;
        let url = item.url;
        let linkmode = item.linkmode;

        if (linkmode == '1') {
            let width = 700;
            let height = 600;
            let opacity = 0.4;
            if (url == '/systeminfo/version.jsp') {
                width = 630;
                height = 400;
            }
            showDialog({
                title: title,
                url: url,
                width: width,
                height: height,
                opacity: opacity,
                callbackfunc: () => {
                }
            });
        } else {
            onLoadMain({url: url, routeurl: '', target: linkmode == '0' ? '_blank' : 'mainFrame'});
        }

        this.onVisibleChange(false);
    }

    onVisibleChange(visible) {
        let e9shadowMain = document.getElementById('e9shadowMain');
        if (visible) {
            e9shadowMain.style.display = 'block';
        } else {
            e9shadowMain.style.display = 'none';
        }

        const {actions} = this.props;
        actions.changeToolbarMoreMenuVisible(visible);
    }

    render() {
        const {toolbarMoreMenu, toolbarMoreMenuVisible} = this.props;
        const toolbarMoreMenu4JSON = toolbarMoreMenu.toJSON();

        const toolbarMoreMenuContent = <ToolbarMoreMenuContent toolbarMoreMenu={toolbarMoreMenu4JSON} onToolbarMoreMenuClick={this.onToolbarMoreMenuClick.bind(this)} />;

        return (
            <div className="e9header-toolbar-more">
                <Popover visible={toolbarMoreMenuVisible} onVisibleChange={this.onVisibleChange.bind(this)} placement="bottomLeft" content={toolbarMoreMenuContent} trigger="click" overlayClassName="e9header-toolbar-more-popover">
                    <div className="e9header-toolbar-more-icon" title="更多">
                        <i className="wevicon wevicon-e9header-toolbar-more" />
                    </div>
                </Popover>
            </div>
        )
    }
}

class ToolbarMoreMenuContent extends React.Component {
    render() {
        const {toolbarMoreMenu} = this.props;
        let items = toolbarMoreMenu.map((item, index) => {
            return (
                <div key={index} className="e9header-toolbar-more-item" title={item.name} onClick={this.props.onToolbarMoreMenuClick.bind(this, item)}>
                    <i className={`wevicon wevicon-e9header-toolbar-more-${item.id}`} />
                    <span>{item.name}</span>
                </div>
            )
        });
        return (
            <div className="e9header-toolbar-more-content">
                {items}
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {theme} = state;

    return {
        toolbarMoreMenu: theme.get('toolbarMoreMenu'),
        toolbarMoreMenuVisible: theme.get('toolbarMoreMenuVisible')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9ToolBarMore);