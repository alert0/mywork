import React from 'react';
import {Form, Select, Input} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';

// 搜索元素
export default class Content_searchengine extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eNewsFrom, eNewsMould} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4NewsFrom = <div></div>;
        let eFormItem4NewsMould = <div></div>;
        if (eShareLevel == '2') {
            const eNewsFromProps = getFieldProps('eContentNewsFrom', {initialValue: eNewsFrom});
            eFormItem4NewsFrom = (
                <FormItem label="新闻来源" {...formItemLayout}>
                    <Input type="text" size="default" style={{width: '350px'}} {...eNewsFromProps}/>
                </FormItem>
            );

            const eNewsMouldProps = getFieldProps('eContentNewsMould', {initialValue: eNewsMould.selected});
            const eNewsModuleOptions = eNewsMould.options.map((item, index) => {
                return <Option key={index} value={item.key}>{item.value}</Option>;
            });
            eFormItem4NewsMould = (
                <FormItem label="新闻模板" {...formItemLayout}>
                    <Select size="default" style={{width: '200px'}} {...eNewsMouldProps}>
                        {eNewsModuleOptions}
                    </Select>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    {eFormItem4NewsFrom}
                    {eFormItem4NewsMould}
                </FormGroup>
            </Form>
        );
    }
}