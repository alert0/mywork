import React from 'react';
import {Form, Checkbox} from 'antd';
const FormItem = Form.Item;

import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';

// 提醒方式（文档中心、流程中心、多新闻中心）
export default class FormItem4RemindMode extends React.Component {
    onSelect(key, type, e) {
        const {getFieldValue, setFieldsValue} = this.props.form;

        let eRemindMode = getFieldValue('eContentRemindMode');

        if (type == 'field') {
            eRemindMode[key].checked = e.target.checked;
        } else if (type == 'color') {
            eRemindMode[key].color = e.color;
        }

        setFieldsValue({'eContentRemindMode': eRemindMode});
    }

    render() {
        const {eContent} = this.props.data;
        const {eRemindMode} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        getFieldProps('eContentRemindMode', {initialValue: eRemindMode});
        getFieldProps(`__eContentRemindMode_colorValue`, {initialValue: eRemindMode['color'].color});

        const remindModeItemStyle = {display: 'inline-block'};

        let eRemindModeList = [];
        for (let key in eRemindMode) {
            if (eRemindMode.hasOwnProperty(key)) {
                const eRemindModeItemProps = getFieldProps(`__eContentRemindMode_${key}`, {initialValue: eRemindMode[key].checked, valuePropName: 'checked'});
                eRemindModeList.push(
                    <li style={remindModeItemStyle}>
                        <Checkbox size="default" {...eRemindModeItemProps} onChange={this.onSelect.bind(this, key, 'field')}>{eRemindMode[key].label}</Checkbox>
                        {key == 'color' ?
                            <div style={{display: 'inline-block', position: 'relative', top: '5px'}}>
                                <ColorPicker animation="slide-up" defaultColor={eRemindMode[key].color} onChange={this.onSelect.bind(this, key, 'color')}/>
                            </div> : ''
                        }
                    </li>
                );
            }
        }

        return (
            <FormItem label="提醒方式" {...formItemLayout}>
                <ul>{eRemindModeList}</ul>
            </FormItem>
        );
    }
}