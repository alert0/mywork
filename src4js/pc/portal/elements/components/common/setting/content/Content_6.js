import React from 'react';
import {Form, Input, Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';
import FormItem4ShowNum from './base/FormItem4ShowNum';
import FormItem4LinkMode from './base/FormItem4LinkMode';
import FormItem4Field from './base/FormItem4Field';

// 未读文档
export default class Content_6 extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        //const {eDocSourceType, eDocSourceValue} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4DocFrom = <div></div>;
        if (eShareLevel == '2') {
            const radioStyle = {
                display: 'block',
                height: '30px',
                marginRight: '0'
            };
            const eDocSourceType = {
                "selected": "1",
                "options": [
                    {
                        "value": "2",
                        "label": "文档目录"
                    },
                    {
                        "value": "3",
                        "label": "虚拟目录"
                    },
                    {
                        "value": "7",
                        "label": "所有文档"
                    }
                ]
            };
            const eDocSourceValue = "";

            const eDocSourceTypeSelected = eDocSourceType.selected;
            const eDocSourceTypeProps = getFieldProps('eContentDocSourceType', {initialValue: eDocSourceTypeSelected});
            const eDocSourceTypeOptions = eDocSourceType.options.map((item, index) => {
                const eDocSourceValueProps = getFieldProps('eContentDocSourceValue_' + item.value, {initialValue: (item.value == eDocSourceTypeSelected ? eDocSourceValue : '')});

                return (
                    <Radio key={index} style={radioStyle} value={item.value}>
                        {item.label}
                        {item.value == 7 ? '' : <Input type="text" size="default" style={{width: '100px', marginLeft: '10px'}} {...eDocSourceValueProps}/>}
                    </Radio>
                );
            });

            eFormItem4DocFrom = (
                <FormItem label="文档来源" {...formItemLayout}>
                    <RadioGroup style={{width: '100%'}} {...eDocSourceTypeProps}>
                        {eDocSourceTypeOptions}
                    </RadioGroup>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    <FormItem4ShowNum {...this.props}/>
                    <FormItem4LinkMode {...this.props}/>
                    <FormItem4Field {...this.props}/>
                    {eFormItem4DocFrom}
                </FormGroup>
            </Form>
        );
    }
}