import React from 'react';
import {Form, Input} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';

// 文档内容
export default class Content_25 extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {DocContentFrom} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4DocContentFrom = <div></div>;
        if (eShareLevel == '2') {
            const eDocContentFromProps = getFieldProps('eContentDocContentFrom', {initialValue: DocContentFrom});
            eFormItem4DocContentFrom = (
                <FormItem label="内容来源" {...formItemLayout}>
                    <Input type="text" size="default" style={{width: '350px'}} {...eDocContentFromProps}/>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    {eFormItem4DocContentFrom}
                </FormGroup>
            </Form>
        );
    }
}