import React from 'react';
import {Form, Checkbox, Input} from 'antd';
const FormItem = Form.Item;

// 显示字段
export default class FormItem4Field extends React.Component {
    onSelectAll(e) {
        const {getFieldValue, setFieldsValue} = this.props.form;

        let eField = getFieldValue('eContentField');

        const checked = e.target.checked;
        for (let key in eField) {
            if (eField.hasOwnProperty(key)) {
                eField[key].checked = checked;
            }
        }

        setFieldsValue({'eContentField': eField});
    }

    onSelect(key, type, e) {
        const {getFieldValue, setFieldsValue} = this.props.form;

        let eField = getFieldValue('eContentField');

        if (type == 'field') {
            eField[key].checked = e.target.checked;
        } else if (type == 'imgWidth') {
            eField[key].width = e.target.value;
        } else if (type == 'imgHeight') {
            eField[key].height = e.target.value;
        } else if (type == 'imgAutoHeight') {
            eField[key].autoHeight = e.target.checked;
        }

        setFieldsValue({'eContentField': eField});
    }

    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eField} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        // 检测是否所以字段都选中
        let selectedAllChecked = true;
        for (let key in eField) {
            if (eField.hasOwnProperty(key)) {
                if (!eField[key].checked) {
                    // 只要判断出其中有一个没有选中，则没有全选
                    selectedAllChecked = false;
                    break;
                }
            }
        }
        const eFieldSelectedAllProps = getFieldProps(`__eContentField_selectedAll`, {initialValue: selectedAllChecked, valuePropName: 'checked'});

        getFieldProps('eContentField', {initialValue: eField});

        const fieldItemStyle = {display: 'inline-block'};
        const imageSizeStyle = {width: '40px', marginRight: '8px'};

        let eFieldList = [];
        for (let key in eField) {
            if (eField.hasOwnProperty(key)) {
                const eFieldItemProps = getFieldProps(`__eContentField_${key}`, {initialValue: eField[key].checked, valuePropName: 'checked'});
                eFieldList.push(
                    <li style={fieldItemStyle}>
                        <Checkbox size="default" {...eFieldItemProps} onChange={this.onSelect.bind(this, key, 'field')}>{eField[key].label}</Checkbox>
                        {eShareLevel == '2' && eField[key].type == 'image' ?
                            <span>
                                <span>宽度：</span>
                                <Input type="text" size="default" {...getFieldProps(`__eContentField_imgWidth`, {initialValue: eField[key].width})} style={imageSizeStyle} onChange={this.onSelect.bind(this, key, 'imgWidth')}/>
                                <span>高度：</span>
                                <Input type="text" size="default" {...getFieldProps(`__eContentField_imgHeight`, {initialValue: eField[key].height})} style={imageSizeStyle} onChange={this.onSelect.bind(this, key, 'imgHeight')}/>
                                <Checkbox size="default" {...getFieldProps(`__eContentField_imgAutoHeight`, {initialValue: eField[key].autoHeight, valuePropName: 'checked'})} onChange={this.onSelect.bind(this, key, 'imgAutoHeight')}>自适应高度</Checkbox>
                            </span> : ''
                        }
                    </li>
                );
            }
        }

        return (
            <FormItem label="显示字段" {...formItemLayout}>
                <Checkbox size="default" {...eFieldSelectedAllProps} onChange={this.onSelectAll.bind(this)}>全选</Checkbox><br/>
                <ul>{eFieldList}</ul>
            </FormItem>
        );
    }
}