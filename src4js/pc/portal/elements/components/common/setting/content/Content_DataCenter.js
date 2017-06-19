import React from 'react';
import {Form, Checkbox, Switch} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4LinkMode from './base/FormItem4LinkMode';

import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';

// 个人数据
export default class Content_DataCenter extends React.Component {
    eShowContent4PersonChange(key, type, e) {
        const {form} = this.props;
        let eShowContent4Person = form.getFieldValue('eContentShow');

        if (type == 'option') {
            eShowContent4Person[key].checked = e.target.checked;
        } else if (type == 'color') {
            eShowContent4Person[key].color = e;
        }

        form.setFieldsValue({
            'eContentShow': eShowContent4Person
        });
    }

    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eSyncContent, eShowContent4Person} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4SyncContent = <div></div>;
        if (eShareLevel == '2') {
            const eSyncContentProps = getFieldProps('eContentSync', {initialValue: eSyncContent, valuePropName: 'checked'});
            eFormItem4SyncContent = (
                <FormItem label="同步内容" {...formItemLayout}>
                    <Switch size="small" {...eSyncContentProps} />
                </FormItem>
            );
        }

        getFieldProps('eContentShow', {initialValue: eShowContent4Person});
        let eShowContent4PersonLis = [];
        for (let key in eShowContent4Person) {
            if (eShowContent4Person.hasOwnProperty(key)) {
                eShowContent4PersonLis.push(
                    <li>
                        <Checkbox size="default" defaultChecked={eShowContent4Person[key].checked} onChange={this.eShowContent4PersonChange.bind(this, key, 'option')}>{eShowContent4Person[key].label}</Checkbox>
                        <div style={{display: 'inline-block', position: 'relative', top: '5px'}}>
                            <ColorPicker animation="slide-up" defaultColor={eShowContent4Person[key].color} onChange={this.eShowContent4PersonChange.bind(this, key, 'color')}/>
                        </div>
                    </li>
                );
            }
        }

        let eFormItem4ShowContent4Person = (
            <FormItem label="显示内容" {...formItemLayout}>
                <ul className="esetting-show-content-ul">
                    {eShowContent4PersonLis}
                </ul>
            </FormItem>
        );

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    {eFormItem4SyncContent}
                    {eFormItem4ShowContent4Person}
                </FormGroup>
            </Form>
        );
    }
}