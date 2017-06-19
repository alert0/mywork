import React from 'react';
import {Form, Input, Select} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';

// 自定义页面，数据来源
export default class Content_29_DataSource extends React.Component {
    render() {
        const {getFieldProps} = this.props.form;
        const formItemLayout = this.props.formItemLayout;
        const tabData = this.props.tabData;

        getFieldProps('id', {initialValue: tabData.id});

        const titleProps = getFieldProps('title', {
            initialValue: tabData.title,
            rules: [
                {required: true, message: '请填写标题'},
            ]
        });

        const hrefProps = getFieldProps('href', {initialValue: tabData.href});

        const moreHrefProps = getFieldProps('moreHref', {initialValue: tabData.moreHref});

        const pageHeightProps = getFieldProps('pageHeight', {initialValue: tabData.pageHeight});

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="设置项">
                    <FormItem label="标题" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '80%'}} {...titleProps}/>
                    </FormItem>
                    <FormItem label="引用地址" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '80%'}} {...hrefProps}/>
                        <div>外部地址请加上http://</div>
                    </FormItem>
                    <FormItem label="More地址" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '80%'}} {...moreHrefProps}/>
                        <div>外部地址请加上http://</div>
                    </FormItem>
                    <FormItem label="页面高度" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '100px'}} {...pageHeightProps}/> px
                    </FormItem>
                </FormGroup>
            </Form>
        );
    }
}