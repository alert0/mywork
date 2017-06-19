import React from 'react';
import {Form, Input} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';
import FormItem4Field from './base/FormItem4Field';

// 当日计划
export default class Content_15 extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eShowDays} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4ShowDays = <div></div>;
        if (eShareLevel == '2') {
            const eShowDaysProps = getFieldProps('eContentShowDays', {initialValue: eShowDays});

            eFormItem4ShowDays = (
                <FormItem label="显示天数" {...formItemLayout}>
                    <Input type="text" size="default" style={{width: '80px'}} {...eShowDaysProps}/>
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
                    {eFormItem4ShowDays}
                </FormGroup>
            </Form>
        );
    }
}