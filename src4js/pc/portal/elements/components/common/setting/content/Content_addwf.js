import React from 'react';
import {Form, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';

// 新建流程
export default class Content_addwf extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eShowLayout4AddWf} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4ShowLayout4AddWf = <div></div>;
        if (eShareLevel == '2') {
            const eShowLayout4AddWfProps = getFieldProps('eContentShowLayout', {initialValue: eShowLayout4AddWf.selected});
            const eShowLayout4AddWfOptions = eShowLayout4AddWf.options.map((item, index) => {
                return <Option key={index} value={item.key}>{item.value}</Option>;
            });

            eFormItem4ShowLayout4AddWf = (
                <FormItem label="显示布局" {...formItemLayout}>
                    <Select size="default" style={{width: '80px'}} {...eShowLayout4AddWfProps}>
                        {eShowLayout4AddWfOptions}
                    </Select>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    {eFormItem4ShowLayout4AddWf}
                </FormGroup>
            </Form>
        );
    }
}