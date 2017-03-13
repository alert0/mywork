import React from 'react';
import {Icon} from 'antd';

export default class E9LeftMenuTop4Email extends React.Component {
    constructor(props) {
        super(props);

        // type: 写信(0), 收信(1)
        this.state = {
            type: 0,
            visible: false,
            data: this.props.emailMenu,
            dataItems: []
        }
    }

    onSelectDropdown(type) {
        let data = this.state.data;
        let writeEmail = data[0];
        let receiveEmail = data[1];

        let dataItems = [];
        if (type == 0) {
            dataItems = writeEmail.child;
        } else if (type == 1) {
            dataItems = receiveEmail.child;
        }

        this.setState({
            type: type,
            visible: type != this.state.type || !this.state.visible,
            dataItems: dataItems
        });
    }

    onSelect(key, data, type) {
        this.setState({
            visible: false
        });

        this.props.onSelect(key, data, type);
    }

    render() {
        let type = this.state.type;
        let visible = this.state.visible;
        let data = this.state.data;
        let writeEmail = data[0];
        let receiveEmail = data[1];
        // 写信/收信的类型列表
        let dataItems = this.state.dataItems;

        let background = type == 0 ? '#ececec' : '#f6f6f6';

        return (
            <div className="e9left-menu-email">
                <div className="e9left-menu-email-item" onClick={() => this.onSelect(0, writeEmail, 0)}>
                    <i className="wevicon wevicon-menu-default wevicon-menu-536-53601" />
                    <span className="e9left-menu-email-title">{writeEmail.name}</span>
                    <Icon type="caret-down"
                          onClick={(e) => {
                              e.stopPropagation();
                              this.onSelectDropdown(0);
                          }}
                    />
                </div>
                <div className="e9left-menu-email-item" onClick={() => this.onSelect(1, receiveEmail, 0)}>
                    <i className="wevicon wevicon-menu-default wevicon-menu-536-53602" />
                    <span className="e9left-menu-email-title">{receiveEmail.name}</span>
                    <Icon type="caret-down"
                          onClick={(e) => {
                              e.stopPropagation();
                              this.onSelectDropdown(1);
                          }}
                    />
                </div>
                {
                    visible ? (
                            <ul className="e9left-menu-email-clear e9left-menu-email-item-ul" style={{background: background}}>
                                {
                                    dataItems.map((item, index) => {
                                        return <li key={index} onClick={() => this.onSelect(index, item, 0)}>{item.name}</li>
                                    })
                                }
                            </ul>
                        ) : ''
                }
            </div>
        )
    }
}