import React from 'react';
import {Form, Input} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';

// 便签元素
export default class Content_scratchpad extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eNoteSetting} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4NoteSetting = <div></div>;
        if (eShareLevel == '2') {
            const eNoteHeightProps = getFieldProps('eContentNoteHeight', {initialValue: eNoteSetting.height});
            eFormItem4NoteSetting = (
                <FormItem label="显示设置" {...formItemLayout}>
                    <span>高度：</span>
                    <Input type="text" size="default" style={{width: '40px'}} {...eNoteHeightProps}/>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    {eFormItem4NoteSetting}
                </FormGroup>
            </Form>
        );
    }
}