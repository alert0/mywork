import React from 'react';
import {Form, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

// 链接方式
export default class FormItem4LinkMode extends React.Component {
    render() {
        const {eContent} = this.props.data;
        const {eLinkMode} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        const eLinkModeProps = getFieldProps('eContentLinkMode', {initialValue: eLinkMode.selected});
        const eLinkModeOptions = eLinkMode.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });

        return (
            <FormItem label="链接方式" {...formItemLayout}>
                <Select size="default" style={{width: '80px'}} {...eLinkModeProps}>
                    {eLinkModeOptions}
                </Select>
            </FormItem>
        );
    }
}