import React from 'react';
import {Form, Input, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';
import FormItem4Field from './base/FormItem4Field';
import FormItem4RemindMode from './base/FormItem4RemindMode';

// 多新闻中心
export default class Content_17 extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eNewsMould, eNewsPageId, eNewsMoreAddress} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4NewsModule = <div></div>;
        let eFormItem4NewsPageId = <div></div>;
        let eFormItem4NewsMoreAddress = <div></div>;
        if (eShareLevel == '2') {
            const eNewsMouldProps = getFieldProps('eContentNewsMould', {initialValue: eNewsMould.selected});
            const eNewsModuleOptions = eNewsMould.options.map((item, index) => {
                return <Option key={index} value={item.key}>{item.value}</Option>;
            });
            eFormItem4NewsModule = (
                <FormItem label="新闻模板" {...formItemLayout}>
                    <Select size="default" style={{width: '200px'}} {...eNewsMouldProps}>
                        {eNewsModuleOptions}
                    </Select>
                </FormItem>
            );

            const eNewsPageIdProps = getFieldProps('eContentNewsPageId', {initialValue: eNewsPageId});
            eFormItem4NewsPageId = (
                <FormItem label="新闻页ID" {...formItemLayout}>
                    <Input type="text" size="default" style={{width: '80%'}} {...eNewsPageIdProps}/>
                    <div>多新闻页请用半角分号分开。如（1;2）</div>
                </FormItem>
            );

            const eNewsMoreAddressProps = getFieldProps('eContentNewsMoreAddress', {initialValue: eNewsMoreAddress});
            eFormItem4NewsMoreAddress = (
                <FormItem label="More地址" {...formItemLayout}>
                    <Input type="text" size="default" style={{width: '80%'}} {...eNewsMoreAddressProps}/>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4ShowNum {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    <FormItem4Field {...this.props}/>
                    {eFormItem4NewsModule}
                    {eFormItem4NewsPageId}
                    {eFormItem4NewsMoreAddress}
                    <FormItem4RemindMode {...this.props}/>
                </FormGroup>
            </Form>
        );
    }
}