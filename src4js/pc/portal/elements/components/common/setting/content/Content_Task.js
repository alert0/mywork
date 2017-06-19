import React from 'react';
import {Form, Checkbox} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';

// 任务元素
export default class Content_Task extends React.Component {
    render() {
        const {eContent} = this.props.data;
        const {eCreator, eUser, eStartDate, eEndDate} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        const eCreatorProps = getFieldProps('eContentCreator', {initialValue: eCreator, valuePropName: 'checked'});
        let eFormItem4Creator = (
            <FormItem label="创建人" {...formItemLayout}>
                <Checkbox size="default" {...eCreatorProps} />
            </FormItem>
        );

        const eUserProps = getFieldProps('eContentUser', {initialValue: eUser, valuePropName: 'checked'});
        let eFormItem4User = (
            <FormItem label="责任人" {...formItemLayout}>
                <Checkbox size="default" {...eUserProps} />
            </FormItem>
        );


        const eStartDateProps = getFieldProps('eContentStartDate', {initialValue: eStartDate, valuePropName: 'checked'});
        let eFormItem4StartDate = (
            <FormItem label="开始日期" {...formItemLayout}>
                <Checkbox size="default" {...eStartDateProps} />
            </FormItem>
        );

        const eEndDateProps = getFieldProps('eContentEndDate', {initialValue: eEndDate, valuePropName: 'checked'});
        let eFormItem4EndDate = (
            <FormItem label="结束日期" {...formItemLayout}>
                <Checkbox size="default" {...eEndDateProps} />
            </FormItem>
        );

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4ShowNum {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    {eFormItem4Creator}
                    {eFormItem4User}
                    {eFormItem4StartDate}
                    {eFormItem4EndDate}
                </FormGroup>
            </Form>
        );
    }
}