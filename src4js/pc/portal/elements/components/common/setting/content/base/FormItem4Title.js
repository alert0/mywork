import React from 'react';
import {Form, Input} from 'antd';
const FormItem = Form.Item;

// 元素标题
export default class FormItem4Title extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eTitle} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let FormItem4Title = <div></div>;
        if (eShareLevel == '2') {
            const eTitleProps = getFieldProps('eContentTitle', {
                initialValue: eTitle,
                rules: [
                    {required: true, message: '请填写标题'},
                ]
            });

            FormItem4Title = (
                <FormItem label="元素标题" {...formItemLayout}>
                    <Input type="text" size="default" style={{width: '90%'}} {...eTitleProps}/>
                </FormItem>
            );
        }

        return FormItem4Title;
    }
}