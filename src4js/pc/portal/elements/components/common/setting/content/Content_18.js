import React from 'react';
import {Form, Checkbox} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4LinkMode from './base/FormItem4LinkMode';
import FormItem4Field from './base/FormItem4Field';

// 期刊中心
export default class Content_18 extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eMagazine} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4Magazine = <div></div>;
        if (eShareLevel == '2') {
            const eMagazineOptions = eMagazine.options;
            const eMagazineProps = getFieldProps('eContentMagazine', {initialValue: eMagazine.checked});

            eFormItem4Magazine = (
                <FormItem label="期刊列表" {...formItemLayout}>
                    <div className="esetting-checkbox-group">
                        <CheckboxGroup size="default" options={eMagazineOptions} {...eMagazineProps}/>
                    </div>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    <FormItem4Field {...this.props}/>
                    {eFormItem4Magazine}
                </FormGroup>
            </Form>
        );
    }
}