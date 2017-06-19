import React from 'react';
import {Form, Input, Select, Checkbox} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';

// 流程中心，数据来源
export default class Content_8_DataSource extends React.Component {
    state = {
        viewType: this.props.tabData.viewType || this.props.tabNew.viewType.selected
    };

    onViewTypeChange(value) {
        this.setState({
            viewType: value
        });
    }

    render() {
        const {getFieldProps} = this.props.form;
        const formItemLayout = this.props.formItemLayout;
        const tabNew = this.props.tabNew;
        const tabData = this.props.tabData;
        const viewType = this.state.viewType;

        getFieldProps('id', {initialValue: tabData.id});

        const titleProps = getFieldProps('title', {
            initialValue: tabData.title,
            rules: [
                {required: true, message: '请填写标题'},
            ]
        });

        const viewTypeProps = getFieldProps('viewType', {initialValue: viewType});
        const viewTypeOptions = tabNew.viewType.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });

        let isComplete = <span></span>;
        if (viewType == '4') {
            const isCompleteProps = getFieldProps('isComplete', {initialValue: tabData.isComplete || tabNew.isComplete.selected});
            const isCompleteOptions = tabNew.isComplete.options.map((item, index) => {
                return <Option key={index} value={item.key}>{item.value}</Option>;
            });

            isComplete = (
                <Select size="default" style={{width: '100px', marginLeft: '10px'}} {...isCompleteProps}>
                    {isCompleteOptions}
                </Select>
            );
        }

        let showCopy = <span></span>;
        if (viewType == '1') {
            const showCopyProps = getFieldProps('showCopy', {initialValue: tabData.showCopy, valuePropName: 'checked'});

            showCopy = (
                <Checkbox size="default" style={{marginLeft: '10px'}} {...showCopyProps}>显示抄送事宜</Checkbox>
            );
        }

        let showCount = <span></span>;
        if (viewType == '1' || viewType == '2' || viewType == '3' || viewType == '4' || viewType == '5' || viewType == '10') {
            const showCountProps = getFieldProps('showCount', {initialValue: tabData.showCount, valuePropName: 'checked'});

            showCount = (
                <Checkbox size="default" style={{marginLeft: '10px'}} {...showCountProps}>显示未读数</Checkbox>
            );
        }

        const isExcludeProps = getFieldProps('isExclude', {initialValue: tabData.isExclude || tabNew.isExclude.selected});
        const isExcludeOptions = tabNew.isExclude.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="设置项">
                    <FormItem label="标题" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '80%'}} {...titleProps}/>
                    </FormItem>
                    <FormItem label="查看类型" {...formItemLayout}>
                        <Select size="default" style={{width: '100px'}} {...viewTypeProps} onChange={this.onViewTypeChange.bind(this)}>
                            {viewTypeOptions}
                        </Select>
                        {isComplete}
                        {showCopy}
                        {showCount}
                    </FormItem>
                    <FormItem label="流程来源" {...formItemLayout}>
                        <Select size="default" style={{width: '80%'}} {...isExcludeProps}>
                            {isExcludeOptions}
                        </Select>
                        <div style={{width: '80%', height: '300px'}}>

                        </div>
                    </FormItem>
                </FormGroup>
            </Form>
        );
    }
}