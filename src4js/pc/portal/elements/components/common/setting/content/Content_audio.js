import React from 'react';
import {Form, Input, Checkbox, Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';

// 音频元素
export default class Content_audio extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eAudioShow, eAudioForm} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4ShowSetting = <div></div>;
        let eFormItem4AudioFrom = <div></div>;
        if (eShareLevel == '2') {
            const eAudioShow_height = getFieldProps('eContentAudioShow_height', {initialValue: eAudioShow.height});
            const eAudioShow_autoPlay = getFieldProps('eContentAudioShow_autoPlay', {initialValue: eAudioShow.autoPlay, valuePropName: 'checked'});
            eFormItem4ShowSetting = (
                <FormItem label="显示设置" {...formItemLayout}>
                    <span>高度：</span>
                    <Input size="default" style={{width: '60px'}} {...eAudioShow_height}/>
                    <Checkbox size="default" style={{marginLeft: '10px'}} {...eAudioShow_autoPlay}>自动播放</Checkbox>
                </FormItem>
            );

            const eAudioForm_type = getFieldProps('eContentAudioForm_type', {initialValue: eAudioForm.type});
            const eAudioForm_src = getFieldProps('eContentAudioForm_src', {initialValue: eAudioForm.src});
            const eAudioForm_url = getFieldProps('eContentAudioForm_url', {initialValue: eAudioForm.url});
            const radioStyle = {
                display: 'block',
                height: '30px',
                marginRight: '0'
            };
            eFormItem4AudioFrom = (
                <FormItem label="音频来源" {...formItemLayout}>
                    <RadioGroup style={{width: '100%'}} {...eAudioForm_type}>
                        <Radio style={radioStyle} value="1"><span style={{display: 'inline-block', width: '60px'}}>选择文件</span><Input size="default" style={{width: '350px'}} {...eAudioForm_src}/></Radio>
                        <Radio style={radioStyle} value="2"><span style={{display: 'inline-block', width: '60px'}}>URL路径</span><Input size="default" style={{width: '350px'}} {...eAudioForm_url}/></Radio>
                    </RadioGroup>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    {eFormItem4ShowSetting}
                    {eFormItem4AudioFrom}
                </FormGroup>
            </Form>
        );
    }
}