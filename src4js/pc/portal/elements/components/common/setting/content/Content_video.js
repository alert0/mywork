import React from 'react';
import {Form, Input, Checkbox, Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';

// 视频元素
export default class Content_video extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eVideoShow, eVideoForm} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4ShowSetting = <div></div>;
        let eFormItem4VideoFrom = <div></div>;
        if (eShareLevel == '2') {

            const eVideoShow_height = getFieldProps('eContentVideoShow_height', {initialValue: eVideoShow.height});
            const eVideoShow_showFullScreen = getFieldProps('eContentVideoShow_showFullScreen', {initialValue: eVideoShow.showFullScreen, valuePropName: 'checked'});
            const eVideoShow_autoPlay = getFieldProps('eContentVideoShow_autoPlay', {initialValue: eVideoShow.autoPlay, valuePropName: 'checked'});
            eFormItem4ShowSetting = (
                <FormItem label="显示设置" {...formItemLayout}>
                    <span>高度：</span>
                    <Input size="default" style={{width: '60px'}} {...eVideoShow_height}/>
                    <Checkbox size="default" style={{marginLeft: '10px'}} {...eVideoShow_showFullScreen}>是否可全屏显示</Checkbox>
                    <Checkbox size="default" style={{marginLeft: '10px'}} {...eVideoShow_autoPlay}>自动播放</Checkbox>
                </FormItem>
            );

            const eVideoForm_type = getFieldProps('eContentVideoForm_type', {initialValue: eVideoForm.type});
            const eVideoForm_src = getFieldProps('eContentVideoForm_src', {initialValue: eVideoForm.src});
            const eVideoForm_url = getFieldProps('eContentVideoForm_url', {initialValue: eVideoForm.url});
            const radioStyle = {
                display: 'block',
                height: '30px',
                marginRight: '0'
            };
            eFormItem4VideoFrom = (
                <FormItem label="视频来源" {...formItemLayout}>
                    <RadioGroup style={{width: '100%'}} {...eVideoForm_type}>
                        <Radio style={radioStyle} value="1"><span style={{display: 'inline-block', width: '60px'}}>选择文件</span><Input size="default" style={{width: '350px'}} {...eVideoForm_src}/></Radio>
                        <Radio style={radioStyle} value="2"><span style={{display: 'inline-block', width: '60px'}}>URL路径</span><Input size="default" style={{width: '350px'}} {...eVideoForm_url}/></Radio>
                    </RadioGroup>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    {eFormItem4ShowSetting}
                    {eFormItem4VideoFrom}
                </FormGroup>
            </Form>
        );
    }
}