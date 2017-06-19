import React from 'react';
import {Form} from 'antd';

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';
import FormItem4Field from './base/FormItem4Field';

// 收藏元素
export default class Content_favourite extends React.Component {
    render() {
        const {eShareLevel} = this.props.data;

        let eFormItem4ShowField = <div></div>;
        if (eShareLevel == '2') {
            eFormItem4ShowField = <FormItem4Field {...this.props} />;
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4ShowNum {...this.props} />
                    <FormItem4LinkMode {...this.props}/>
                    {eFormItem4ShowField}
                </FormGroup>
            </Form>
        );
    }
}