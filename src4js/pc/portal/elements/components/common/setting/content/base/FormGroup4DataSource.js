import React from 'react';
import {Form, Modal, Button, Table, message} from 'antd';

import FormGroup from '../base/FormGroup';

// RSS阅读器，数据来源
import Content_1_DataSource from '../Content_1_DataSource';
// 文档中心，数据来源
import Content_7_DataSource from '../Content_7_DataSource';
// 流程中心，数据来源
import Content_8_DataSource from '../Content_8_DataSource';
// 自定义页面，数据来源
import Content_29_DataSource from '../Content_29_DataSource';
// 图表元素，数据来源
import Content_reportForm_DataSource from '../Content_reportForm_DataSource';

class FormGroup4DataSource extends React.Component {
    state = {
        tabNew: this.props.eTabs.tabNew,
        tabCount: this.props.eTabs.tabCount,
        tabList: this.props.eTabs.tabList,
        tabData: {},
        dsModalVisible: false
    };

    componentWillMount() {
        const {eTabs, baseForm} = this.props;

        // 初始化tab数据
        baseForm.getFieldProps('eTabs', {initialValue: {tabIds: eTabs.tabIds, tabList: eTabs.tabList}});
    }

    componentDidMount() {
        const fixHelper = function (e, ui) {
            // 在拖动时，拖动行的宽度会发生改变，在这里做了处理就没问题了。
            ui.children().each(function () {
                jQuery(this).width(jQuery(this).width());
            });

            return ui;
        };

        jQuery('.ant-table-tbody', this.refs['dataSource']).sortable({
            helper: fixHelper,
            cursor: 'move',
            axis: 'y',
            start: (e, ui) => {
                return ui;
            },
            stop: (e, ui) => {
                const items = jQuery('input[name=tabId]', this.refs['dataSource']);
                const tabList = this.state.tabList;
                const itemLength = items.length;
                const tabLength = tabList.length;
                let newTabList = [];
                for (let i = 0; i < itemLength; i++) {
                    for (let j = 0; j < tabLength; j++) {
                        if (tabList[j].tabId == items[i].value) {
                            newTabList.push(tabList[j]);
                        }
                    }
                }

                this.props.baseForm.setFieldsValue({'eTabs': {tabIds: this.props.eTabs.tabIds, tabList: newTabList}});

                return ui;
            }
        }).disableSelection();
    }

    addTab() {
        this.setState({
            tabData: {},
            dsModalVisible: true
        });
    }

    editTab(tabId) {
        let tabData = {};
        const tabList = this.state.tabList;
        const tabLength = tabList.length;
        for (let i = 0; i < tabLength; i++) {
            if (tabList[i].tabId == tabId) {
                tabData = tabList[i].data;
                break;
            }
        }

        this.setState({
            tabData: tabData,
            dsModalVisible: true
        });
    }

    deleteTabs() {
        if (this.selectedTabIds && this.selectedTabIds.length) {
            const selectedTabIds = this.selectedTabIds.slice();
            const selectedTabLength = selectedTabIds.length;
            for (let i = 0; i < selectedTabLength; i++) {
                this.selectedTabIds.splice(i, 1);
                this.deleteTab(selectedTabIds[i]);
            }
        } else {
            message.warn('请选择需要删除的内容！', 3);
        }
    }

    deleteTab(tabId) {
        const tabList = this.state.tabList;
        const tabLength = tabList.length;
        for (let i = 0; i < tabLength; i++) {
            if (tabList[i].tabId == tabId) {
                tabList.splice(i, 1);
                break;
            }
        }

        this.setState({
            tabList: tabList
        });
    }

    onOk(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            const id = values.id;
            const tabList = this.state.tabList;
            let tabCount = this.state.tabCount;

            // 根据id是否存在判断是新增还是编辑
            if (!!id) { // 编辑保存
                const tabLength = tabList.length;
                for (let i = 0; i < tabLength; i++) {
                    if (tabList[i].tabId == id) {
                        tabList[i].tabTitle = values.title;
                        tabList[i].data = values;
                    }
                }
            } else { // 新建保存
                tabCount++;
                tabCount = tabCount.toString();
                values.id = tabCount;
                tabList.push({
                    "key": tabCount,
                    "tabId": tabCount,
                    "tabTitle": values.title,
                    "data": values
                });
            }

            this.setState({
                tabCount: tabCount,
                tabList: tabList,
                dsModalVisible: false
            });

            this.props.baseForm.setFieldsValue({'eTabs': {tabIds: this.props.eTabs.tabIds, tabList: tabList}});
        });
    }

    onCancel() {
        this.setState({
            dsModalVisible: false
        });
    }

    render() {
        const thisProps = this.props;
        const thisState = this.state;
        const ebaseid = thisProps.ebaseid;
        const dsModalVisible = thisState.dsModalVisible;

        // 表格数据源
        const dataSource = thisState.tabList;

        // 记录选中的tab数据行
        const _self = this;
        const rowSelection = {
            onChange(selectedRowKeys) {
                _self.selectedTabIds = selectedRowKeys;
            }
        };

        // 表格列
        const columns = [{
            title: '标题',
            dataIndex: 'tabTitle',
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span>
                    <input type="hidden" name="tabId" value={record.tabId}/>
                    <span className="esetting-dso-delete" onClick={this.deleteTab.bind(this, record.tabId)}>删除</span>
                    <span className="esetting-dso-setting" onClick={this.editTab.bind(this, record.tabId)}>设置</span>
                </span>
            )
        }];

        const props = {
            ...thisProps,
            ...thisState
        };
        let modal = <div></div>;
        let modal2DataSource = <div></div>;
        switch (ebaseid) {
            // RSS阅读器
            case '1':
                modal2DataSource = <Content_1_DataSource {...props} />;
                break;
            // 文档中心
            case '7':
                modal2DataSource = <Content_7_DataSource {...props} />;
                break;
            // 流程中心
            case '8':
                modal2DataSource = <Content_8_DataSource {...props} />;
                break;
            // 自定义页面
            case '29':
                modal2DataSource = <Content_29_DataSource {...props} />;
                break;
            // 图片元素
            case 'reportForm':
                modal2DataSource = <Content_reportForm_DataSource {...props} />;
                break;
            default:
                modal2DataSource = <div></div>;
        }

        if (dsModalVisible) {
            const modalFooter = (
                <div className="esetting-confirm">
                    <Button type="primary" onClick={this.onOk.bind(this)}>确定</Button>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <Button type="ghost" onClick={this.onCancel.bind(this)}>取消</Button>
                </div>
            );

            modal = (
                <Modal
                    title="内容设置"
                    width="660"
                    wrapClassName="esetting-modal"
                    visible={dsModalVisible}
                    footer={modalFooter}
                    onOk={this.onOk.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                >
                    {modal2DataSource}
                </Modal>
            );
        }

        const formGroupButtons = (
            <div className="esetting-dso">
                <div className="esetting-dso-add" title="添加" onClick={this.addTab.bind(this)}></div>
                <div className="esetting-dso-deletes" title="删除" onClick={this.deleteTabs.bind(this)}></div>
            </div>
        );

        return (
            <FormGroup title="内容来源" buttons={formGroupButtons}>
                <div ref="dataSource">
                    {modal}
                    <Table className="esetting-table" rowSelection={rowSelection} columns={columns} dataSource={dataSource} pagination={false}/>
                </div>
            </FormGroup>
        );
    }
}

FormGroup4DataSource = Form.create()(FormGroup4DataSource);

export default FormGroup4DataSource;