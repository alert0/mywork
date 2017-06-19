import React from 'react';
import {Form, Checkbox} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4Field from './base/FormItem4Field';

// 通讯录
export default class Content_contacts extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eShowSubordinates} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4ShowSubordinates = <div></div>;
        if (eShareLevel == '2') {
            const eShowSubordinatesProps = getFieldProps('eContentShowSubordinates', {initialValue: eShowSubordinates, valuePropName: 'checked'});

            eFormItem4ShowSubordinates = (
                <FormItem label="显示下级下属" {...formItemLayout}>
                    <Checkbox size="default" {...eShowSubordinatesProps} />
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4Field {...this.props}/>
                    {eFormItem4ShowSubordinates}
                </FormGroup>
            </Form>
        );
    }
}