import React from 'react';
import {Modal} from 'antd';

import ECLocalStorage from '../../util/ecLocalStorage';
import * as PLUGIN_API from '../../apis/plugin';

class Birthday extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            birthdayInfo: {
                bgimg: '',
                curdate: '',
                congratulation: '',
                textcolor: '',
                usercolor: '',
                userlist: []
            }
        }
    }

    componentWillMount() {
        let date = new Date();
        let today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        let cacheDate = ECLocalStorage.getStr('birthday', 'date', true);
        if (today != cacheDate) {
            PLUGIN_API.getBirthdayInfo().then((result) => {
                if (result.userlist.length > 0) {
                    this.setState({
                        visible: true,
                        birthdayInfo: result
                    });

                    ECLocalStorage.set('birthday', 'date', today, true);
                    setTimeout(() => this.onVisibleChange(), 14 * 1000);
                }
            });
        }
    }

    onVisibleChange() {
        this.setState({
            visible: false
        });
    }

    render() {
        let visible = this.state.visible;
        let {bgimg, curdate, congratulation, textcolor, usercolor, userlist} = this.state.birthdayInfo;

        let items = userlist.map(function (item, index) {
            return (
                <div key={index} className="birthday-users-item">
                    <div className="birthday-user-name">{item.lastname}</div>
                    <div className="birthday-user-depart">{item.detialInfo}</div>
                </div>
            );
        });

        return (
            <Modal title="生日提醒" visible={visible} width="499px" footer="" wrapClassName="birthday-modal" onCancel={this.onVisibleChange.bind(this)} onOk={this.onVisibleChange.bind(this)}>
                <div className="birthday-content" style={{background: `url(${bgimg}) center center`}}>
                    <div className="birthday-congratulation" style={{color: `#${textcolor}`}}>
                        <div className="birthday-congratulation-content" dangerouslySetInnerHTML={{__html: congratulation}}></div>
                        <div className="birthday-congratulation-date" style={{color: `${usercolor}`}}>{curdate}</div>
                    </div>
                    <div className="birthday-users" style={{color: `#${textcolor}`}}>
                        {items}
                    </div>
                </div>
            </Modal>
        )
    }
}

module.exports = Birthday;
