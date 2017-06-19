import React from 'react';
import {Form, Icon} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4LinkMode from './base/FormItem4LinkMode';

// 自定义菜单
export default class Content_menu extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {} = eContent;
        const {formItemLayout} = this.props;

        let eFormItem4MenuFrom = <div></div>;
        let eFormItem4MenuStyle = <div></div>;
        if (eShareLevel == '2') {
            eFormItem4MenuFrom = (
                <FormItem label="自定义菜单" {...formItemLayout}>
                    <Icon type="exclamation-circle" style={{marginRight: '8px', color: '#fa0'}}/><span>暂时无法设置！</span>
                </FormItem>
            );

            eFormItem4MenuStyle = (
                <FormItem label="菜单样式" {...formItemLayout}>
                    <Icon type="exclamation-circle" style={{marginRight: '8px', color: '#fa0'}}/><span>暂时无法设置！</span>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    {eFormItem4MenuFrom}
                    {eFormItem4MenuStyle}
                </FormGroup>
            </Form>
        );
    }
}