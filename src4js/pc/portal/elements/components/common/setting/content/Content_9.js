import React from 'react';
import {Form, Checkbox} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';
import FormItem4Field from './base/FormItem4Field';

// 消息提醒
export default class Content_9 extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eMessageRemind} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4MessageRemind = <div></div>;
        if (eShareLevel == 2) {
            const eMessageRemindOptions = eMessageRemind.options;
            const eMessageRemindProps = getFieldProps('eContentMessageRemind', {initialValue: eMessageRemind.checked});

            eFormItem4MessageRemind = (
                <FormItem label="消息提醒" {...formItemLayout}>
                    <div className="esetting-checkbox-group">
                        <CheckboxGroup size="default" options={eMessageRemindOptions} {...eMessageRemindProps}/>
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
                    {eFormItem4MessageRemind}
                </FormGroup>
            </Form>
        );
    }
}