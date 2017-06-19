import React from 'react';
import {Form, Checkbox} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';
import FormItem4Field from './base/FormItem4Field';

// 未读协作
export default class Content_13 extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eShowContent} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4ShowContent = <div></div>;
        if (eShareLevel == '2') {
            const eShowContentOptions = eShowContent.options;
            const eShowContentProps = getFieldProps('eContentShowContent', {initialValue: eShowContent.checked});

            eFormItem4ShowContent = (
                <FormItem label="显示内容" {...formItemLayout}>
                    <CheckboxGroup size="default" options={eShowContentOptions} {...eShowContentProps}/>
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
                    {eFormItem4ShowContent}
                </FormGroup>
            </Form>
        );
    }
}