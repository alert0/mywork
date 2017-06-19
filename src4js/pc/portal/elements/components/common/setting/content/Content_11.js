import React from 'react';
import {Form} from 'antd';

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';
import FormItem4Field from './base/FormItem4Field';

// 最新客户
export default class Content_11 extends React.Component {
    render() {
        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4ShowNum {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    <FormItem4Field {...this.props}/>
                </FormGroup>
            </Form>
        );
    }
}