import React from 'react';
import {Spin, Form, Tabs, Button} from 'antd';
const TabPane = Tabs.TabPane;

import Tab4Content from './Tab4Content';
import Tab4Style from './Tab4Style';
import Tab4Share from './Tab4Share';
import './esetting.css';

import {WeaTools} from 'ecCom';

class ESetting extends React.Component {
    state = {loading: false};

    onSave(e) {
        const {hpid, subCompanyId, eid, ebaseid} = this.props.data;

        e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            values.hpid = hpid;
            values.subCompanyId = subCompanyId;
            values.eid = eid;
            values.ebaseid = ebaseid;

            if (window.showPortalLog) {
                console.log('element setting save values:\n', values);
            }

            this.setState({loading: true});
            WeaTools.callApi('/api/portal/setting/saveSetting', 'POST', {jsonStr: JSON.stringify(values)}).then(function (result) {
                // 刷新元素标题
                jQuery('#element_title_name_' + eid).text(values.eContentTitle);
                // 刷新元素内容
                onRefresh(eid, ebaseid);
                // 卸载设置界面
                React.render(<div></div>, document.getElementById(`setting_${eid}`));
            });
        });
    }

    onCancel() {
        const {eid} = this.props.data;
        React.render(<div></div>, document.getElementById(`setting_${eid}`));
    }

    render() {
        return (
            <Spin spinning={this.state.loading}>
                <div className="esetting-container">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="内容" key="1"><Tab4Content {...this.props}/></TabPane>
                        <TabPane tab="样式" key="2"><Tab4Style {...this.props}/></TabPane>
                        <TabPane tab="共享" key="3"><Tab4Share {...this.props}/></TabPane>
                    </Tabs>
                    <div className="esetting-confirm">
                        <Button type="primary" onClick={this.onSave.bind(this)}>保存</Button>
                        <span>&nbsp;&nbsp;&nbsp;</span>
                        <Button type="ghost" onClick={this.onCancel.bind(this)}>取消</Button>
                    </div>
                </div>
            </Spin>
        );
    }
}

ESetting = Form.create()(ESetting);

export default ESetting;