import React from 'react';
import {Form, Input, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import FormGroup from './content/base/FormGroup';
import MaterialLibrary from './content/base/MaterialLibrary';

export default class Tab4Style extends React.Component {
    onESpacingChange(type, e) {
        const {getFieldValue, setFieldsValue} = this.props.form;

        let eStyleSpacing = getFieldValue('eStyleSpacing');

        eStyleSpacing[type] = e.target.value;

        setFieldsValue({'eStyleSpacing': eStyleSpacing});
    }

    render() {
        const {eShareLevel, eStyle} = this.props.data;
        const {eStyleList, eIcon, eHeight, eSpacing} = eStyle;
        const {getFieldProps} = this.props.form;

        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20},
        };

        // 元素样式
        const eStyleListProps = getFieldProps('eStyleList', {initialValue: eStyleList.selected});
        const eStyleListOptions = eStyleList.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });

        // 元素图标
        const eIconProps = getFieldProps('eStyleIcon', {initialValue: eIcon});

        // 元素高度
        const eHeightProps = getFieldProps('eStyleHeight', {initialValue: eHeight});

        // 元素间距
        getFieldProps('eStyleSpacing', {initialValue: eSpacing});

        let disabled = true;
        if (eShareLevel == '2') {
            disabled = false;
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem label="元素样式" {...formItemLayout}>
                        <Select size="default" style={{width: '200px'}} disabled={disabled} {...eStyleListProps}>
                            {eStyleListOptions}
                        </Select>
                    </FormItem>
                    <FormItem label="元素图标" {...formItemLayout}>
                        <MaterialLibrary disabled={disabled} form={this.props.form} eProps={eIconProps}/>
                    </FormItem>
                    <FormItem label="高度" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '40px'}} disabled={disabled} {...eHeightProps}/>
                        <span style={{marginLeft: '8px'}}>0：自适应高度</span>
                    </FormItem>
                    <FormItem label="间距" {...formItemLayout}>
                        <span style={{marginLeft: '0'}}>上间距：</span>
                        <Input type="text" size="default" style={{width: '40px'}} defaultValue={eSpacing.top} disabled={disabled} onChange={this.onESpacingChange.bind(this, 'top')}/>
                        <span style={{marginLeft: '8px'}}>右间距：</span>
                        <Input type="text" size="default" style={{width: '40px'}} defaultValue={eSpacing.right} disabled={disabled} onChange={this.onESpacingChange.bind(this, 'right')}/>
                        <span style={{marginLeft: '8px'}}>下间距：</span>
                        <Input type="text" size="default" style={{width: '40px'}} defaultValue={eSpacing.bottom} disabled={disabled} onChange={this.onESpacingChange.bind(this, 'bottom')}/>
                        <span style={{marginLeft: '8px'}}>左间距：</span>
                        <Input type="text" size="default" style={{width: '40px'}} defaultValue={eSpacing.left} disabled={disabled} onChange={this.onESpacingChange.bind(this, 'left')}/>
                    </FormItem>
                </FormGroup>
            </Form>
        );
    }
}