import React from 'react';
import {Form} from 'antd';

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormGroup4DataSource from './base/FormGroup4DataSource';

// 图表元素
export default class Content_reportForm extends React.Component {
    render() {
        const {eid, ebaseid, eShareLevel, eContent} = this.props.data;
        const {eTabs} = eContent;
        const {formItemLayout} = this.props;

        let formGroup4DataSource = <div></div>;
        if (eShareLevel == '2') {
            const props = {
                eid: eid,
                ebaseid: ebaseid,
                eTabs: eTabs,
                baseForm: this.props.form,
                formItemLayout: formItemLayout
            };
            formGroup4DataSource = <FormGroup4DataSource {...props}/>;
        }

        return (
            <div>
                <Form horizontal className="esetting-form">
                    <FormGroup title="基本信息">
                        <FormItem4Title {...this.props}/>
                    </FormGroup>
                </Form>
                {formGroup4DataSource}
            </div>
        );
    }
}