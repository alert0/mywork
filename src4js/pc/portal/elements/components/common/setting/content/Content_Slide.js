import React from 'react';
import {Form, Input, Select, Radio, Button, Modal, Table} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';

// 幻灯片
export default class Content_Slide extends React.Component {
    state = {
        visible: false
    };

    onChangeVisible(visible) {
        this.setState({
            visible: visible
        });
    }

    onOk() {
        let jsonData = $('#slideDetail').serializeArray();
        let slideDetail = [];
        let item = {};
        for (let i = 0, len = jsonData.length; i < len; i++) {
            item[jsonData[i].name] = jsonData[i].value;

            if (i == 5 || i == 11 || i == 17 || i == 23) {
                slideDetail.push(item);
                item = {};
            }
        }

        const {getFieldProps} = this.props.form;
        getFieldProps('eContentSlideDetail', {initialValue: slideDetail});

        this.onChangeVisible(false);
    }

    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eAutoScrollTime, eChangeEffect, eSmoothMoveTime, eNavDisplayPosition, eSlideDetail} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4AutoScrollTime = <div></div>;
        let eFormItem4ChangeEffect = <div></div>;
        let eFormItem4SmoothMoveTime = <div></div>;
        let eFormItem4NavDisplayPosition = <div></div>;
        if (eShareLevel == '2') {
            const eAutoScrollTimeProps = getFieldProps('eContentAutoScrollTime', {initialValue: eAutoScrollTime});
            eFormItem4AutoScrollTime = (
                <FormItem label="自动滚动时间" {...formItemLayout}>
                    <Input size="default" style={{width: '150px'}} {...eAutoScrollTimeProps}/><span>&nbsp;毫秒</span>
                </FormItem>
            );

            const eChangeEffectProps = getFieldProps('eContentChangeEffect', {initialValue: eChangeEffect.selected});
            const eChangeEffectOptions = eChangeEffect.options.map((item, index) => {
                return <Option key={index} value={item.key}>{item.value}</Option>;
            });
            eFormItem4ChangeEffect = (
                <FormItem label="切换效果" {...formItemLayout}>
                    <Select size="default" style={{width: '150px'}} {...eChangeEffectProps}>
                        {eChangeEffectOptions}
                    </Select>
                </FormItem>
            );

            const eSmoothMoveTimeProps = getFieldProps('eContentSmoothMoveTime', {initialValue: eSmoothMoveTime});
            eFormItem4SmoothMoveTime = (
                <FormItem label="平滑移动时间" {...formItemLayout}>
                    <Input size="default" style={{width: '150px'}} {...eSmoothMoveTimeProps}/><span>&nbsp;毫秒</span>
                </FormItem>
            );

            const eNavDisplayPositionProps = getFieldProps('eContentNavDisplayPosition', {initialValue: eNavDisplayPosition});

            const columns = [{
                title: '主图片',
                dataIndex: 'mainImage',
                render: (text, record) => (
                    <Input size="default" name="mainImage" defaultValue={text}/>
                )
            }, {
                title: '导航样式背景图',
                dataIndex: 'bgImage',
                render: (text, record) => (
                    <Input size="default" name="bgImage" defaultValue={text}/>
                )
            }, {
                title: '导航样式前景图',
                dataIndex: 'fgImage',
                render: (text, record) => (
                    <Input size="default" name="fgImage" defaultValue={text}/>
                )
            }, {
                title: '标题',
                dataIndex: 'title',
                render: (text, record) => (
                    <Input size="default" name="title" defaultValue={text}/>
                )
            }, {
                title: '描述',
                dataIndex: 'desc',
                render: (text, record) => (
                    <Input size="default" name="desc" defaultValue={text}/>
                )
            }, {
                title: '图片链接',
                dataIndex: 'link',
                render: (text, record) => (
                    <Input size="default" name="link" defaultValue={text}/>
                )
            }];

            let dataSource = eSlideDetail;
            if (dataSource == '') {
                dataSource = [{
                    "key": "1",
                    "mainImage": "",
                    "bgImage": "",
                    "fgImage": "",
                    "title": "",
                    "desc": "",
                    "link": ""
                }, {
                    "key": "2",
                    "mainImage": "",
                    "bgImage": "",
                    "fgImage": "",
                    "title": "",
                    "desc": "",
                    "link": ""
                }, {
                    "key": "3",
                    "mainImage": "",
                    "bgImage": "",
                    "fgImage": "",
                    "title": "",
                    "desc": "",
                    "link": ""
                }, {
                    "key": "4",
                    "mainImage": "",
                    "bgImage": "",
                    "fgImage": "",
                    "title": "",
                    "desc": "",
                    "link": ""
                }];
            }

            const modalFooter = (
                <div className="esetting-confirm">
                    <Button type="primary" onClick={this.onOk.bind(this)}>确定</Button>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <Button type="ghost" onClick={this.onChangeVisible.bind(this, false)}>取消</Button>
                </div>
            );

            eFormItem4NavDisplayPosition = (
                <FormItem label="导航显示位置" {...formItemLayout}>
                    <RadioGroup style={{width: '100%'}} {...eNavDisplayPositionProps}>
                        <Radio value="1">左</Radio>
                        <Radio value="2">右</Radio>
                        <Radio value="3">下</Radio>
                    </RadioGroup>
                    <Button type="primary" size="small" onClick={() => this.onChangeVisible(true)}>详细设置</Button>
                    <Modal
                        title="详细设置"
                        width="80%"
                        wrapClassName="esetting-modal"
                        visible={this.state.visible}
                        footer={modalFooter}
                        onOk={() => this.onOk(false)}
                        onCancel={() => this.onChangeVisible(false)}
                    >
                        <form id="slideDetail" name="slideDetail" action="">
                            <Table className="esetting-table" columns={columns} dataSource={dataSource} size="middle" pagination={false}/>
                        </form>
                    </Modal>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    {eFormItem4AutoScrollTime}
                    {eFormItem4ChangeEffect}
                    {eFormItem4SmoothMoveTime}
                    {eFormItem4NavDisplayPosition}
                </FormGroup>
            </Form>
        );
    }
}