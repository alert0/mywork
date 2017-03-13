import React from 'react';

export default class LeftMenuTop4Email extends React.Component {
    constructor(props) {
        super(props);

        // index: 0写信, 1收信
        this.state = {
            index: -1,
            isShow: false,
            itemList: []
        }
    }

    componentDidUpdate() {
        this.refs['itemList'].style.display = this.state.isShow ? 'block' : 'none';
        this.refs['itemList'].style.background = this.state.index ? '#f6f6f6' : '#ececec';
    }

    onSelectDropdown(index) {
        let emailMenu = this.props.emailMenu;
        let emailTopMenu = emailMenu.slice(0, 2);
        let itemList = emailTopMenu[index].child;
        let isShow = index == this.state.index ? !this.state.isShow : true;

        this.setState({
            index: index,
            isShow: isShow,
            itemList: itemList
        });
    }

    onSelect(key, data, type) {
        this.setState({
            index: this.state.index,
            isShow: false,
            itemList: this.state.itemList
        });

        this.props.onSelect(key, data, type);
    }

    render() {
        let emailMenu = this.props.emailMenu;
        let writeEmail = emailMenu[0];
        let receiveEmail = emailMenu[1];
        let itemList = this.state.itemList;
        return (
            <div className="e9-lmt-email">
                <div className="e9-lmt-email-item" onClick={() => this.onSelect(0, writeEmail, 0)}>
                    <i className="wevicon wevicon-menu-default wevicon-menu-536-53601"
                       style={{fontSize: '18px', paddingLeft: '10px', verticalAlign: 'middle'}}
                    />
                    <span className="e9-lmt-email-title">{writeEmail.name}</span>
                    <i className="anticon anticon-caret-down e9-lmt-email-dropdown"
                       onClick={(e) => {
                           e.stopPropagation();
                           this.onSelectDropdown(0);
                       }}
                    />
                </div>
                <div className="e9-lmt-email-item" onClick={() => this.onSelect(1, receiveEmail, 0)}
                >
                    <i className="wevicon wevicon-menu-default wevicon-menu-536-53602"
                       style={{fontSize: '18px', paddingLeft: '10px', verticalAlign: 'middle'}}
                    />
                    <span className="e9-lmt-email-title">{receiveEmail.name}</span>
                    <i className="anticon anticon-caret-down e9-lmt-email-dropdown"
                       onClick={(e) => {
                           e.stopPropagation();
                           this.onSelectDropdown(1);
                       }}
                    />
                </div>
                {
                    <ul ref="itemList" className="e9-lmt-email-clear e9-lmt-email-item-ul">
                        {
                            itemList.map((item, index) => {
                                return <li key={index} onClick={() => this.onSelect(index, item, 0)}>{item.name}</li>
                            })
                        }
                    </ul>
                }
            </div>
        )
    }
}