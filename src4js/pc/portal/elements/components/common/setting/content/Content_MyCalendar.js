import React from 'react';
import {Form} from 'antd';

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';

// 日历日程
export default class Content_MyCalendar extends React.Component {
    render() {
        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                </FormGroup>
            </Form>
        );
    }
}