import React from 'react';
import {Form} from 'antd';

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';
import FormItem4Field from './base/FormItem4Field';
import FormGroup4DataSource from './base/FormGroup4DataSource';

// RSS阅读器
export default class Content_1 extends React.Component {
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
                        <FormItem4ShowNum {...this.props}/>
                        <FormItem4LinkMode {...this.props}/>
                        <FormItem4Field {...this.props}/>
                    </FormGroup>
                </Form>
                {formGroup4DataSource}
            </div>
        );
    }
}