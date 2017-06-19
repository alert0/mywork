import React from 'react';
import {Form, Input, Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';

// Flash元素
export default class Content_Flash extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eFlashShow, eFlashForm} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4ShowSetting = <div></div>;
        let eFormItem4FlashFrom = <div></div>;
        if (eShareLevel == '2') {
            const eFlashShow_height = getFieldProps('eContentFlashShow_height', {initialValue: eFlashShow.height});
            eFormItem4ShowSetting = (
                <FormItem label="显示设置" {...formItemLayout}>
                    <span>高度：</span>
                    <Input size="default" style={{width: '60px'}} {...eFlashShow_height}/>
                </FormItem>
            );

            const eFlashForm_type = getFieldProps('eContentFlashForm_type', {initialValue: eFlashForm.type});
            const eFlashForm_src = getFieldProps('eContentFlashForm_src', {initialValue: eFlashForm.src});
            const eFlashForm_url = getFieldProps('eContentFlashForm_url', {initialValue: eFlashForm.url});
            const radioStyle = {
                display: 'block',
                height: '30px',
                marginRight: '0'
            };
            eFormItem4FlashFrom = (
                <FormItem label="Flash来源" {...formItemLayout}>
                    <RadioGroup style={{width: '100%'}} {...eFlashForm_type}>
                        <Radio style={radioStyle} value="1"><span style={{display: 'inline-block', width: '60px'}}>选择文件</span><Input size="default" style={{width: '350px'}} {...eFlashForm_src}/></Radio>
                        <Radio style={radioStyle} value="2"><span style={{display: 'inline-block', width: '60px'}}>URL路径</span><Input size="default" style={{width: '350px'}} {...eFlashForm_url}/></Radio>
                    </RadioGroup>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    {eFormItem4ShowSetting}
                    {eFormItem4FlashFrom}
                </FormGroup>
            </Form>
        );
    }
}