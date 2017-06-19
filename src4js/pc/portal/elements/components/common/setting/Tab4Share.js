import React from 'react';
import {Icon, Form} from 'antd';

import FormGroup from './content/base/FormGroup';

export default class Tab4Share extends React.Component {
    render() {
        const {eShare} = this.props.data;
        const {hasRight} = eShare;

        if (hasRight) {
            return (
                <Form horizontal className="esetting-form">
                    <FormGroup title="基本信息">

                    </FormGroup>
                </Form>
            );
        } else {
            return (
                <div className="esetting-share-no-right"><Icon type="exclamation-circle" style={{marginRight: '8px', color: '#fa0'}}/><span>对不起，您暂时没有权限！</span></div>
            );
        }
    }
}