import React from 'react';
import {Form, Checkbox} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4LinkMode from './base/FormItem4LinkMode';

// 多岗位办理事项
export default class Content_jobsinfo extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eShowClassify} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4ShowClassify = <div></div>;
        if (eShareLevel == '2') {
            const eShowClassifyOptions = eShowClassify.options;
            const eShowClassifyProps = getFieldProps('eContentShowClassify', {initialValue: eShowClassify.checked});
            eFormItem4ShowClassify = (
                <FormItem label="显示类别" {...formItemLayout}>
                    <CheckboxGroup size="default" options={eShowClassifyOptions} {...eShowClassifyProps}/>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    {eFormItem4ShowClassify}
                </FormGroup>
            </Form>
        );
    }
}