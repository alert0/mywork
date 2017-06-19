import React from 'react';
import {Form, Input, Select, Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import FormGroup from './base/FormGroup';

// 文档中心，数据来源
export default class Content_7_DataSource extends React.Component {
    render() {
        const {getFieldProps} = this.props.form;
        const formItemLayout = this.props.formItemLayout;
        const tabNew = this.props.tabNew;
        const tabData = this.props.tabData;

        getFieldProps('id', {initialValue: tabData.id});

        const titleProps = getFieldProps('title', {
            initialValue: tabData.title,
            rules: [
                {required: true, message: '请填写标题'},
            ]
        });

        const topDocsProps = getFieldProps('topDocs', {initialValue: tabData.topDocs});

        const radioStyle = {
            display: 'block',
            height: '30px',
            marginRight: '0'
        };
        const docSourceType = tabData.docSourceType || tabNew.docSourceType.selected;
        const docSourceTypeProps = getFieldProps('docSourceType', {initialValue: docSourceType});
        const docSourceTypeOptions = tabNew.docSourceType.options.map((item, index) => {
            const docSourceValue = item.value == docSourceType ? tabData.docSourceValue : '';
            const docSourceValueProps = getFieldProps('docSourceValue_' + item.value, {initialValue: docSourceValue});

            return (
                <Radio key={index} style={radioStyle} value={item.value}>
                    {item.label}
                    <Input type="text" size="default" style={{width: '350px', marginLeft: '10px'}} {...docSourceValueProps}/>
                </Radio>
            );
        });

        const showModeProps = getFieldProps('showMode', {initialValue: tabData.showMode || tabNew.showMode.selected});
        const showModeOptions = tabNew.showMode.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });

        const scrollDirectionProps = getFieldProps('scrollDirection', {initialValue: tabData.scrollDirection || tabNew.scrollDirection.selected});
        const scrollDirectionOptions = tabNew.scrollDirection.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });

        const isOpenAttachmentProps = getFieldProps('isOpenAttachment', {initialValue: tabData.isOpenAttachment || tabNew.isOpenAttachment.selected});
        const isOpenAttachmentOptions = tabNew.isOpenAttachment.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });
        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="设置项">
                    <FormItem label="标题" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '80%'}} {...titleProps}/>
                    </FormItem>
                    <FormItem label="文档置顶" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '80%'}} {...topDocsProps}/>
                    </FormItem>
                    <FormItem label="文档来源" {...formItemLayout}>
                        <RadioGroup style={{width: '100%'}} {...docSourceTypeProps}>
                            {docSourceTypeOptions}
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="显示方式" {...formItemLayout}>
                        <Select size="default" style={{width: '100px'}} {...showModeProps}>
                            {showModeOptions}
                        </Select>
                    </FormItem>
                    <FormItem label="滚动方向" {...formItemLayout}>
                        <Select size="default" style={{width: '100px'}} {...scrollDirectionProps}>
                            {scrollDirectionOptions}
                        </Select>
                    </FormItem>
                    <FormItem label="直接打开附件" {...formItemLayout}>
                        <Select size="default" style={{width: '100px'}} {...isOpenAttachmentProps}>
                            {isOpenAttachmentOptions}
                        </Select>
                        <span style={{marginLeft: '10px'}}>（当文档内容为空，且此文档仅有一个附件时）</span>
                    </FormItem>
                </FormGroup>
            </Form>
        );
    }
}