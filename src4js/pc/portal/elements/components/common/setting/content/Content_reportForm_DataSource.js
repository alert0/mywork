import React from 'react';
import {Form, Input, Select, Button, Modal, Table} from 'antd';
const FormItem = Form.Item;

import FormGroup from './base/FormGroup';

// 图表元素，数据来源
export default class Content_reportForm_DataSource extends React.Component {
    state = {
        paramModalVisible: false
    };

    onChangeParamModalVisible(visible) {
        this.setState({
            paramModalVisible: visible
        });
    }

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

        const reportFormTypeProps = getFieldProps('reportFormType', {initialValue: tabData.reportFormType || tabNew.reportFormType.selected});
        const reportFormTypeOptions = tabNew.reportFormType.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });

        const decimalDigitsProps = getFieldProps('decimalDigits', {initialValue: tabData.decimalDigits || tabNew.decimalDigits});

        const reportFormWidthProps = getFieldProps('reportFormWidth', {initialValue: tabData.reportFormWidth || tabNew.reportFormWidth});
        const reportFormHeightProps = getFieldProps('reportFormHeight', {initialValue: tabData.reportFormHeight || tabNew.reportFormHeight});

        const dataSourceProps = getFieldProps('dataSource', {initialValue: tabData.dataSource || tabNew.dataSource.selected});
        const dataSourceOptions = tabNew.dataSource.options.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>;
        });

        const reportFormSqlProps = getFieldProps('reportFormSql', {initialValue: tabData.reportFormSql});

        const columns = [{
            title: '参数名',
            dataIndex: 'paramName'
        }, {
            title: '参数显示名',
            dataIndex: 'paramShowName'
        }, {
            title: '参数类型',
            dataIndex: 'paramType'
        }];

        const dataSource = [
            {
                "key": "1",
                "paramName": "$P_sys.userself",
                "paramShowName": "当前登录用户",
                "paramType": "系统变量",
            }, {
                "key": "2",
                "paramName": "$P_sys.usersuperior",
                "paramShowName": "直属上级",
                "paramType": "系统变量",
            }, {
                "key": "3",
                "paramName": "$P_sys.usersubordinate",
                "paramShowName": "直接下级",
                "paramType": "系统变量",
            }, {
                "key": "4",
                "paramName": "$P_sys.currentyear",
                "paramShowName": "本年",
                "paramType": "系统变量",
            }, {
                "key": "5",
                "paramName": "$P_sys.currentmonth",
                "paramShowName": "本月",
                "paramType": "系统变量",
            }, {
                "key": "6",
                "paramName": "$P_sys.currentday",
                "paramShowName": "今天",
                "paramType": "系统变量",
            }, {
                "key": "7",
                "paramName": "$P_sys.currentdepart",
                "paramShowName": "本部门",
                "paramType": "系统变量",
            }, {
                "key": "8",
                "paramName": "$P_sys.currentsubcompany",
                "paramShowName": "本分部",
                "paramType": "系统变量",
            }
        ];

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="设置项">
                    <FormItem label="标题" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '80%'}} {...titleProps}/>
                    </FormItem>
                    <FormItem label="图表类型" {...formItemLayout}>
                        <Select size="default" style={{width: '200px'}} {...reportFormTypeProps}>
                            {reportFormTypeOptions}
                        </Select>
                    </FormItem>
                    <FormItem label="小数位数" {...formItemLayout}>
                        <Input type="text" size="default" style={{width: '200px'}} {...decimalDigitsProps}/>
                    </FormItem>
                    <FormItem label="图表大小" {...formItemLayout}>
                        <span>宽度：</span>
                        <Input type="text" size="default" style={{width: '60px', marginRight: '8px'}} {...reportFormWidthProps}/>
                        <span>高度：</span>
                        <Input type="text" size="default" style={{width: '60px', marginRight: '8px'}} {...reportFormHeightProps}/>
                    </FormItem>
                    <FormItem label="数据来源" {...formItemLayout}>
                        <Select size="default" style={{width: '200px'}} {...dataSourceProps}>
                            {dataSourceOptions}
                        </Select>
                    </FormItem>
                    <FormItem label="图表来源" {...formItemLayout}>
                        <Input type="textarea" size="default" rows={6} style={{width: '90%'}} {...reportFormSqlProps}/>
                        <Button type="primary" size="small" onClick={() => this.onChangeParamModalVisible(true)}>参数信息</Button>
                        <Modal
                            title="图表参数信息"
                            width="600px"
                            wrapClassName="esetting-modal"
                            visible={this.state.paramModalVisible}
                            footer={
                                <div className="esetting-confirm">
                                    <Button type="ghost" onClick={() => this.onChangeParamModalVisible(false)}>关闭</Button>
                                </div>
                            }
                            onCancel={() => this.onChangeParamModalVisible(false)}
                        >
                            <Table className="esetting-table esetting-table-rf-param" columns={columns} dataSource={dataSource} pagination={false}/>
                        </Modal>
                    </FormItem>
                </FormGroup>
            </Form>
        );
    }
}