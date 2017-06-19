import React from 'react';
import {Form, Checkbox} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';

// 计划报告元素
export default class Content_plan extends React.Component {
    render() {
        const {eContent} = this.props.data;
        const {eClassify, ePlanStartDate, ePlanEndDate, ePlanDays, eWeekly, eMonthly} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        const eClassifyProps = getFieldProps('eContentClassify', {initialValue: eClassify, valuePropName: 'checked'});
        let eFormItem4eClassify = (
            <FormItem label="分类" {...formItemLayout}>
                <Checkbox size="default" {...eClassifyProps} />
            </FormItem>
        );

        const ePlanStartDateProps = getFieldProps('eContentPlanStartDate', {initialValue: ePlanStartDate, valuePropName: 'checked'});
        let eFormItem4PlanStartDate = (
            <FormItem label="计划开始日期" {...formItemLayout}>
                <Checkbox size="default" {...ePlanStartDateProps} />
            </FormItem>
        );

        const ePlanEndDateProps = getFieldProps('eContentPlanEndDate', {initialValue: ePlanEndDate, valuePropName: 'checked'});
        let eFormItem4PlanEndDate = (
            <FormItem label="计划结束日期" {...formItemLayout}>
                <Checkbox size="default" {...ePlanEndDateProps} />
            </FormItem>
        );

        const ePlanDaysProps = getFieldProps('eContentPlanDays', {initialValue: ePlanDays, valuePropName: 'checked'});
        let eFormItem4PlanDays = (
            <FormItem label="计划天数" {...formItemLayout}>
                <Checkbox size="default" {...ePlanDaysProps} />
            </FormItem>
        );

        const eWeeklyProps = getFieldProps('eContentWeekly', {initialValue: eWeekly, valuePropName: 'checked'});
        let eFormItem4Weekly = (
            <FormItem label="周报" {...formItemLayout}>
                <Checkbox size="default" {...eWeeklyProps} />
            </FormItem>
        );

        const eMonthlyProps = getFieldProps('eContentMonthly', {initialValue: eMonthly, valuePropName: 'checked'});
        let eFormItem4Monthly = (
            <FormItem label="月报" {...formItemLayout}>
                <Checkbox size="default" {...eMonthlyProps} />
            </FormItem>
        );

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4ShowNum {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    {eFormItem4eClassify}
                    {eFormItem4PlanStartDate}
                    {eFormItem4PlanEndDate}
                    {eFormItem4PlanDays}
                    {eFormItem4Weekly}
                    {eFormItem4Monthly}
                </FormGroup>
            </Form>
        );
    }
}