import React from 'react';
import {Form, Input} from 'antd';
const FormItem = Form.Item;

// 显示条数
export default class FormItem4ShowNum extends React.Component {
    render() {
        const {eContent} = this.props.data;
        const {eShowNum = -1} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        const eShowNumProps = getFieldProps('eContentShowNum', {initialValue: eShowNum});

        return (
            <FormItem label="显示条数" {...formItemLayout}>
                <Input type="text" size="default" style={{width: '80px'}} {...eShowNumProps}/>
            </FormItem>
        );
    }
}