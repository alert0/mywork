import React from 'react';
import {Form, Checkbox} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';
import FormItem4Field from './base/FormItem4Field';

// 计划任务
export default class Content_32 extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {ePlanCreator, eUserRole, ePlanState, ePlanType} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4PlanCreator = <div></div>;
        let eFormItem4UserRole = <div></div>;
        let eFormItem4PlanState = <div></div>;
        let eFormItem4PlanType = <div></div>;
        if (eShareLevel == '2') {
            const ePlanCreatorOptions = ePlanCreator.options;
            const ePlanCreatorProps = getFieldProps('eContentPlanCreator', {initialValue: ePlanCreator.checked});
            eFormItem4PlanCreator = (
                <FormItem label="计划任务创建人" {...formItemLayout}>
                    <CheckboxGroup size="default" options={ePlanCreatorOptions} {...ePlanCreatorProps}/>
                </FormItem>
            );

            const eUserRoleOptions = eUserRole.options;
            const eUserRoleProps = getFieldProps('eContentUserRole', {initialValue: eUserRole.checked});
            eFormItem4UserRole = (
                <FormItem label="用户扮演角色" {...formItemLayout}>
                    <CheckboxGroup size="default" options={eUserRoleOptions} {...eUserRoleProps}/>
                </FormItem>
            );

            const ePlanStateOptions = ePlanState.options;
            const ePlanStateProps = getFieldProps('eContentPlanState', {initialValue: ePlanState.checked});
            eFormItem4PlanState = (
                <FormItem label="计划任务状态" {...formItemLayout}>
                    <CheckboxGroup size="default" options={ePlanStateOptions} {...ePlanStateProps}/>
                </FormItem>
            );

            const ePlanTypeOptions = ePlanType.options;
            const ePlanTypeProps = getFieldProps('eContentPlanType', {initialValue: ePlanType.checked});
            eFormItem4PlanType = (
                <FormItem label="计划任务类型" {...formItemLayout}>
                    <div className="esetting-checkbox-group">
                        <CheckboxGroup size="default" options={ePlanTypeOptions} {...ePlanTypeProps}/>
                    </div>
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
                    {eFormItem4PlanCreator}
                    {eFormItem4UserRole}
                    {eFormItem4PlanState}
                    {eFormItem4PlanType}
                </FormGroup>
            </Form>
        );
    }
}