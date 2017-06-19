import React from 'react';
import {Form, Input, Radio, Tooltip, Icon} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import FormGroup from './base/FormGroup';
import FormItem4Title from './base/FormItem4Title';

// 天气元素
export default class Content_weather extends React.Component {
    render() {
        const {eShareLevel, eContent} = this.props.data;
        const {eCityName, eAutoScroll, eShowWidth} = eContent;
        const {getFieldProps} = this.props.form;
        const {formItemLayout} = this.props;

        let eFormItem4CityName = <div></div>;
        let eFormItem4AutoScroll = <div></div>;
        let eFormItem4ShowWidth = <div></div>;
        if (eShareLevel == '2') {
            const eCityNameProps = getFieldProps('eContentCityName', {initialValue: eCityName});
            const eAutoScrollOptions = eAutoScroll.options.map((item, index) => {
                return <Radio key={index} value={item.value}>{item.label}</Radio>
            });
            eFormItem4CityName = (
                <FormItem label="城市名称" {...formItemLayout}>
                    <Input type="text" size="default" style={{width: '50%'}} {...eCityNameProps}/>
                    <Tooltip placement="right" title="请确认服务器可以访问www.weather.com.cn">
                        <Icon type="question-circle" style={{marginLeft: '10px'}}/>
                    </Tooltip>
                    <div>多城市名称请用半角逗号分隔（上海,北京）</div>
                </FormItem>
            );

            const eAutoScrollProps = getFieldProps('eContentAutoScroll', {initialValue: eAutoScroll.selected});
            eFormItem4AutoScroll = (
                <FormItem label="自动滚动" {...formItemLayout}>
                    <RadioGroup size="default" {...eAutoScrollProps}>
                        {eAutoScrollOptions}
                    </RadioGroup>
                </FormItem>
            );

            const eShowWidthProps = getFieldProps('eContentShowWidth', {initialValue: eShowWidth});
            eFormItem4ShowWidth = (
                <FormItem label="显示宽度" {...formItemLayout}>
                    <Input type="text" size="default" style={{width: '80px'}} {...eShowWidthProps}/>
                </FormItem>
            );
        }

        return (
            <Form horizontal className="esetting-form">
                <FormGroup title="基本信息">
                    <FormItem4Title {...this.props}/>
                    {eFormItem4CityName}
                    {eFormItem4AutoScroll}
                    {eFormItem4ShowWidth}
                </FormGroup>
            </Form>
        );
    }
}