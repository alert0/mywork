import React from 'react';
import {Form, Icon} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';

// 图片元素
export default class Content_picture extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {} = eContent;
        const {formItemLayout} = this.props;

        let eFormItem4PopSetting = <div></div>;
        let eFormItem4DisplayMode = <div></div>;
        let eFormItem4ImageSize = <div></div>;
        let eFormItem4PictureFrom = <div></div>;
        if (eShareLevel == '2') {
            eFormItem4PopSetting = (
                <FormItem label="弹出设置" {...formItemLayout}>
                    <Icon type="exclamation-circle" style={{marginRight: '8px', color: '#fa0'}}/><span>暂时无法设置！</span>
                </FormItem>
            );

            eFormItem4DisplayMode = (
                <FormItem label="显示方式" {...formItemLayout}>
                    <Icon type="exclamation-circle" style={{marginRight: '8px', color: '#fa0'}}/><span>暂时无法设置！</span>
                </FormItem>
            );

            eFormItem4ImageSize = (
                <FormItem label="图片大小" {...formItemLayout}>
                    <Icon type="exclamation-circle" style={{marginRight: '8px', color: '#fa0'}}/><span>暂时无法设置！</span>
                </FormItem>
            );

            eFormItem4PictureFrom = (
                <FormItem label="图片来源" {...formItemLayout}>
                    <Icon type="exclamation-circle" style={{marginRight: '8px', color: '#fa0'}}/><span>暂时无法设置！</span>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    {eFormItem4PopSetting}
                    {eFormItem4DisplayMode}
                    {eFormItem4ImageSize}
                    {eFormItem4PictureFrom}
                </FormGroup>
            </Form>
        );
    }
}