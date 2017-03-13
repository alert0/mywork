import React from 'react';
import {Popover, Badge, Icon} from 'antd';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as themeActions from '../../../actions/theme';
import {onLoadMain} from '../../../actions/theme';

class E9Remind extends React.Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.loadRemindInfo();

        // 三分钟刷新一次提醒消息
        this.remindInterval = window.setInterval(() => actions.loadRemindInfo(), 3 * 60 * 1000);
    }

    componentWillUnmount() {
        // 卸载组件，清除消息提醒定时器
        window.clearInterval(this.remindInterval);
    }

    onRemindListClick(item) {
        onLoadMain({url: item.url, routeurl: ''});
        this.onVisibleChange(false);
    }

    onVisibleChange(visible) {
        const {actions} = this.props;
        actions.changeRemindListVisible(visible);
    }

    render() {
        const {hasRemind, remindList, remindListVisible} = this.props;
        const remindList4JSON = remindList.toJSON();

        const remindTitle = <div className="e9header-remind-title"><i className="wevicon wevicon-e9header-remind-title" /><span>新到达消息</span></div>;
        const remindContent = <RemindContent hasRemind={hasRemind} remindList={remindList4JSON} onRemindListClick={this.onRemindListClick.bind(this)} />;

        return (
            <div className="e9header-remind">
                <Popover visible={remindListVisible} onVisibleChange={this.onVisibleChange.bind(this)} placement="bottomLeft" title={remindTitle} content={remindContent} trigger="click" overlayClassName="e9header-remind-popover">
                    <div className="e9header-remind-icon">
                        <Badge dot={hasRemind} style={{top: '16px', left: '14px'}}>
                            <i className="wevicon wevicon-e9header-remind" />
                        </Badge>
                    </div>
                </Popover>
            </div>
        )
    }
}


class RemindContent extends React.Component {
    render() {
        const {hasRemind, remindList} = this.props;

        let items = remindList.map((item, index) => {
            return (
                <div key={index} className="e9header-remind-item" onClick={this.props.onRemindListClick.bind(this, item)}>
                    <span className="e9header-remind-item-title">
                        {
                            !hasRemind ? <Icon type="exclamation-circle-o" style={{marginRight: '5px'}} /> : ''
                        }
                        {item.name}
                    </span>
                    <span className="e9header-remind-item-count">{item.count}</span>
                </div>
            )
        });
        return (
            <div className="e9header-remind-content">
                {items}
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {theme} = state;

    return {
        hasRemind: theme.get('hasRemind'),
        remindList: theme.get('remindList'),
        remindListVisible: theme.get('remindListVisible')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9Remind);