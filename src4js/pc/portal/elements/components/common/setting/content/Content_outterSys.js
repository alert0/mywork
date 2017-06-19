import React from 'react';
import {Form, Input, Select, Checkbox} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';

// 集成登录
export default class Content_outterSys extends React.Component {
    onEShowFieldChange(key, type, e) {
        const {form} = this.props;
        let eShowField = form.getFieldValue('eContentShowField');

        if (type == 'field') {
            eShowField[key].checked = e.target.checked;
        } else if (type == 'wordNumber') {
            eShowField[key].wordNumber = e.target.value;
        }

        form.setFieldsValue({
            'eContentShowField': eShowField
        });
    }

    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eShowField, eShowMode, eShowLayout} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4ShowField = <div></div>;
        let eFormItem4ShowMode = <div></div>;
        let eFormItem4ShowLayout = <div></div>;
        if (eShareLevel == '2') {
            getFieldProps('eContentShowField', {initialValue: eShowField});
            let eShowFieldLis = [];
            for (let key in eShowField) {
                if (eShowField.hasOwnProperty(key)) {
                    eShowFieldLis.push(
                        <li>
                            <Checkbox size="default" defaultChecked={eShowField[key].checked} onChange={this.onEShowFieldChange.bind(this, key, 'field')}>{eShowField[key].label}</Checkbox>
                            {key == 'title' ?
                                <span>
                                    <span>字数：</span>
                                    <Input type="text" size="default" defaultValue={eShowField[key].wordNumber} style={{width: '40px'}} onChange={this.onEShowFieldChange.bind(this, key, 'wordNumber')}/>
                                </span> : ''
                            }
                        </li>
                    )
                }
            }
            eFormItem4ShowField = (
                <FormItem label="显示字段" {...formItemLayout}>
                    <ul className="esetting-show-field-ul">
                        {eShowFieldLis}
                    </ul>
                </FormItem>
            );

            const eShowModeProps = getFieldProps('eContentShowMode', {initialValue: eShowMode.selected});
            const eShowModeOptions = eShowMode.options.map((item, index) => {
                return <Option key={index} value={item.key}>{item.value}</Option>;
            });
            eFormItem4ShowMode = (
                <FormItem label="显示方式" {...formItemLayout}>
                    <Select size="default" style={{width: '80px'}} {...eShowModeProps}>
                        {eShowModeOptions}
                    </Select>
                </FormItem>
            );

            const eShowLayoutProps = getFieldProps('eContentShowLayout', {initialValue: eShowLayout.selected});
            const eShowLayoutOptions = eShowLayout.options.map((item, index) => {
                return <Option key={index} value={item.key}>{item.value}</Option>;
            });
            eFormItem4ShowLayout = (
                <FormItem label="显示布局" {...formItemLayout}>
                    <Select size="default" style={{width: '80px'}} {...eShowLayoutProps}>
                        {eShowLayoutOptions}
                    </Select>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4ShowNum {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    {eFormItem4ShowField}
                    {eFormItem4ShowMode}
                    {eFormItem4ShowLayout}
                </FormGroup>
            </Form>
        );
    }
}