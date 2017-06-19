import React from 'react';
import {Form, Input, Select, Tooltip, Icon} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';

// RSS阅读器，数据来源
export default class Content_1_DataSource extends React.Component {
    render() {
        const {getFieldProps} = this.props.form;
        const formItemLayout = this.props.formItemLayout;
        const tabNew = this.props.tabNew;
        const tabData = this.props.tabData;

        getFieldProps('id', {initialValue: tabData.id});

        const titleProps = getFieldProps('title', {
            initialValue: tabData.title,
            rules: [
                {required: true, message: '请填写标题'},
            ]
        });

        const showContentProps = getFieldProps('showContent', {initialValue: tabData.showContent});

        const positionProps = getFieldProps('position', {initialValue: tabData.position || tabNew.position.selected});
        const positionOptions = tabNew.position.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });

        const searchGroupProps = getFieldProps('searchGroup', {initialValue: tabData.searchGroup || tabNew.searchGroup.selected});
        const searchGroupOptions = tabNew.searchGroup.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });

        const readTypeProps = getFieldProps('readType', {initialValue: tabData.readType || tabNew.readType.selected});
        const readTypeOptions = tabNew.readType.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="设置项">
                    <FormItem label="标题" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '80%'}} {...titleProps}/>
                    </FormItem>
                    <FormItem label="显示内容" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '80%'}} {...showContentProps}/>
                    </FormItem>
                    <FormItem label="所在位置" {...formItemLayout}>
                        <Select size="default" style={{width: '100px'}} {...positionProps}>
                            {positionOptions}
                        </Select>
                        <span style={{marginLeft: '10px'}}>（显示内容为关键字时此选项才起作用）</span>
                    </FormItem>
                    <FormItem label="查询组合" {...formItemLayout}>
                        <Select size="default" style={{width: '100px'}} {...searchGroupProps}>
                            {searchGroupOptions}
                        </Select>
                        <Tooltip placement="right" title="关键字之间以空格分隔，选择 and 搜索包含全部关键词的信息；选择 or 搜索包含任意一个关键词的信息。">
                            <Icon type="question-circle" style={{marginLeft: '10px'}}/>
                        </Tooltip>
                    </FormItem>
                    <FormItem label="读取方式" {...formItemLayout}>
                        <Select size="default" style={{width: '100px'}} {...readTypeProps}>
                            {readTypeOptions}
                        </Select>
                    </FormItem>
                </FormGroup>
            </Form>
        );
    }
}