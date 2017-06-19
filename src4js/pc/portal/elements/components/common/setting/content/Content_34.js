import React from 'react';
import {Form, Input, DatePicker} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';
import FormItem4Field from './base/FormItem4Field';

// 知识订阅
export default class Content_34 extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eSubscribeDocDirectory, eSubscribeTheme, eSubscribeStartDate, eSubscribeEndDate} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4DocDirectory = <div></div>;
        let eFormItem4SubscribeTheme = <div></div>;
        let eFormItem4SubscribeStartDate = <div></div>;
        let eFormItem4SubscribeEndDate = <div></div>;
        if (eShareLevel == '2') {
            const eSubscribeDocDirectoryProps = getFieldProps('eContentSubscribeDocDirectory', {initialValue: eSubscribeDocDirectory});
            eFormItem4DocDirectory = (
                <FormItem label="文档目录" {...formItemLayout}>
                    <Input type="text" size="default" style={{width: '80%'}} {...eSubscribeDocDirectoryProps}/>
                </FormItem>
            );

            const eSubscribeThemeProps = getFieldProps('eContentSubscribeTheme', {initialValue: eSubscribeTheme});
            eFormItem4SubscribeTheme = (
                <FormItem label="订阅主题" {...formItemLayout}>
                    <Input size="default" style={{width: '80%'}} {...eSubscribeThemeProps}/>
                </FormItem>
            );

            const eSubscribeStartDateProps = getFieldProps('eContentSubscribeStartDate', {initialValue: eSubscribeStartDate});
            eFormItem4SubscribeStartDate = (
                <FormItem label="订阅起始日期" {...formItemLayout}>
                    <DatePicker size="default" format="yyyy-MM-dd" {...eSubscribeStartDateProps}/>
                </FormItem>
            );

            const eSubscribeEndDateProps = getFieldProps('eContentSubscribeEndDate', {initialValue: eSubscribeEndDate});
            eFormItem4SubscribeEndDate = (
                <FormItem label="订阅最终日期" {...formItemLayout}>
                    <DatePicker size="default" format="yyyy-MM-dd" {...eSubscribeEndDateProps}/>
                </FormItem>
            );
        }
        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4ShowNum {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    <FormItem4Field {...this.props}/>
                    {eFormItem4DocDirectory}
                    {eFormItem4SubscribeTheme}
                    {eFormItem4SubscribeStartDate}
                    {eFormItem4SubscribeEndDate}
                </FormGroup>
            </Form>
        );

    }
}