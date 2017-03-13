import React from 'react';
import {Popover} from 'antd';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as themeActions from '../../../actions/theme';
import * as THEME_API from '../../../apis/theme';
import {onLoadMain} from '../../../actions/theme';
import {showDialog} from '../../../util/themeUtils';

class E9Account extends React.Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.loadAccount();
    }

    onAccountClick(item) {
        let title = item.name;
        let url = item.url;
        let linkmode = item.linkmode;

        if (linkmode == '1') {
            showDialog(title, url, 700, 600, () => {
            });
        } else {
            onLoadMain({url: url, routeurl: '', target: linkmode == '0' ? '_blank' : 'mainFrame'});
        }

        this.onVisibleChange(false);
    }

    onLogout() {
        top.Dialog.confirm("确定要退出系统吗？", () => {
            THEME_API.logout().then(() => weaHistory.push({pathname: '/'}));
        });

        this.onVisibleChange(false);
    }

    onVisibleChange(visible) {
        const {actions} = this.props;
        actions.changeAccountVisible(visible);
    }

    render() {
        const {account, accountVisible} = this.props;
        const account4JSON = account.toJSON();

        const accountContent = <AccountContent account={account4JSON} onAccountClick={this.onAccountClick.bind(this)} onLogout={this.onLogout.bind(this)} />;

        let icon = account4JSON.icon;
        let username = account4JSON.username;
        if (icon == null || icon == undefined) {
            icon = "/messager/images/icon_m_wev8.jpg";
        }

        return (
            <div className="e9header-account">
                <Popover visible={accountVisible} onVisibleChange={this.onVisibleChange.bind(this)} placement="bottomLeft" content={accountContent} trigger="click" overlayClassName="e9header-account-popover">
                    <div>
                        <div className="e9header-account-head"><img src={icon} alt="" /></div>
                        <span className="e9header-account-name">{username}</span>
                        <span className="e9header-account-icon"><i className="wevicon wevicon-e9header-account-arrow" /></span>
                    </div>
                </Popover>
            </div>
        )
    }
}


class AccountContent extends React.Component {
    onAccountChange(userId) {
        window.location.href = "/login/IdentityShift.jsp?shiftid=" + userId;
    }

    render() {
        const {account} = this.props;
        const curUserId = account.userid;
        const accountList = account.accountlist;
        const accountSize = accountList && accountList.length;

        let items = accountList.map((item, index) => {
            let userId = item.userid;
            let userName = item.username;
            let jobs = item.jobs;
            let subCompanyName = item.subcompanyname;
            let departName = item.deptname;
            let subAndDepartName = `${subCompanyName}/${departName}`;
            if (subAndDepartName == '/') {
                subAndDepartName = '';
            }

            return (
                <div>
                    <div key={index} className="e9header-account-list-item" onClick={accountSize > 1 ? this.onAccountChange.bind(this, userId) : this.props.onAccountClick.bind(this, {name: '', linkmode: '2', url: `/hrm/HrmTab.jsp?_fromURL=HrmResource&id=${userId}`})}>
                        <div className="e9header-account-list-item-icon">
                            <img src={item.icon} alt="" />
                        </div>
                        <div className="e9header-account-list-item-info">
                            <span title={userName} className="e9header-account-list-item-username">{userName}</span>
                            <span title={jobs} className="e9header-account-list-item-jobs">{jobs}</span>
                            <br />
                            <span title={subAndDepartName} className="e9header-account-list-item-dept">{subAndDepartName}</span>
                        </div>
                        { accountSize > 1 && userId == curUserId ? <img className="e9header-account-checked" src="/images/check.png" alt="" /> : ''}
                    </div>
                    <div className="e9header-account-separate"></div>
                </div>
            )
        });
        return (
            <div className="e9header-account-content">
                <div className="e9header-account-list">
                    {
                        accountSize > 1 ? (
                                <div>
                                    <div className="e9header-account-list-title">账号切换</div>
                                    <div className="e9header-account-separate"></div>
                                </div>
                            ) : ''
                    }
                    {items}
                </div>
                <div className="e9header-account-setting">
                    <div className="e9header-account-setting-item" onClick={this.props.onAccountClick.bind(this, {name: '个性化设置', linkmode: '2', url: '/systeminfo/menuconfig/CustomSetting.jsp'})}>
                        <i className="wevicon wevicon-e9header-account-setting" />
                        <span>个性化设置</span>
                    </div>
                    <div className="e9header-account-setting-item" onClick={this.props.onAccountClick.bind(this, {name: '修改密码', linkmode: '1', url: '/hrm/HrmTab.jsp?_fromURL=HrmResourcePassword'})}>
                        <i className="wevicon wevicon-e9header-account-password" />
                        <span>修改密码</span>
                    </div>
                    <div className="e9header-account-setting-item" onClick={this.props.onAccountClick.bind(this, {name: '主题中心', linkmode: '1', url: '/wui/theme/ecology8/page/skinTabs.jsp'})}>
                        <i className="wevicon wevicon-e9header-account-skin" />
                        <span>主题中心</span>
                    </div>
                    <div className="e9header-account-setting-item" onClick={this.props.onLogout.bind(this)}>
                        <i className="wevicon wevicon-e9header-account-quit" />
                        <span>退出</span>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {theme} = state;

    return {
        account: theme.get('account'),
        accountVisible: theme.get('accountVisible')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9Account);