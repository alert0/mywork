import React from 'react';
import {Form} from 'antd';

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4Field from './base/FormItem4Field';

// 微博动态
export default class Content_blogStatus extends React.Component {
    render() {
        const {eShareLevel} = this.props.data;

        let eFormItem4ShowNum = <div></div>;
        let eFormItem4ShowField = <div></div>;
        if (eShareLevel == '2') {
            eFormItem4ShowNum = <FormItem4ShowNum {...this.props} />;
            eFormItem4ShowField = <FormItem4Field {...this.props} />;
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    {eFormItem4ShowNum}
                    {eFormItem4ShowField}
                </FormGroup>
            </Form>
        );
    }
}