import React from 'react';
import {Form, Input} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4LinkMode from './base/FormItem4LinkMode';

// 股票元素
export default class Content_19 extends React.Component {
    onStockImageSizeChange(type, e) {
        const {form} = this.props;
        let eStockImageSize = form.getFieldValue('eContentStockImageSize');

        if (type == 'imageWidth') {
            eStockImageSize.width = e.target.value;
        } else if (type == 'imageHeight') {
            eStockImageSize.height = e.target.value;
        }

        form.setFieldsValue({
            'eContentStockImageSize': eStockImageSize
        });
    }

    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eStockImageSize, eStockCode} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4StockImageSize = '';
        let eFormItem4StockCode = '';
        if (eShareLevel == '2') {
            getFieldProps('eContentStockImageSize', {initialValue: eStockImageSize});
            eFormItem4StockImageSize = (
                <FormItem label="图片大小" {...formItemLayout}>
                    <span>宽度：</span>
                    <Input type="text" size="default" defaultValue={eStockImageSize.width} style={{width: '40px', marginRight: '8px'}} onChange={this.onStockImageSizeChange.bind(this, 'imageWidth')}/>
                    <span>高度：</span>
                    <Input type="text" size="default" defaultValue={eStockImageSize.height} style={{width: '40px', marginRight: '8px'}} onChange={this.onStockImageSizeChange.bind(this, 'imageHeight')}/>
                </FormItem>
            );

            const eStockCodeProps = getFieldProps('eContentStockCode', {initialValue: eStockCode});
            eFormItem4StockCode = (
                <FormItem label="股票代码" {...formItemLayout}>
                    <Input type="text" size="default" style={{width: '80%'}} {...eStockCodeProps}/>
                    <div>多股票请用半角分号分隔（SHA:000001;SHE:399001）</div>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    {eFormItem4StockImageSize}
                    {eFormItem4StockCode}
                </FormGroup>
            </Form>
        );
    }
}