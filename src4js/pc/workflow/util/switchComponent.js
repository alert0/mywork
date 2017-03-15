// 定义组件的key（server端生成）
const KEY_1 = 'd51f298d-5f51-4a4b-b25a-0a0e0e978c1d'; // 普通input
const KEY_2 = 'c1f5bfcf-d6dd-4b20-b461-55ba4bcfc831'; // 类型
const KEY_3 = '169b6798-a098-408b-a685-b79a64d5804a'; // 工作流
const KEY_4 = 'c3b220db-0926-4a28-88ab-56545e4c9770'; // 紧急程度,处理状态,流程状态,节点类型  单选组件
const KEY_5 = '575e1d52-d6e2-41d6-b2fd-18f8390dbc49'; // 创建人   creatertype   0为员工传参createrid，1为客户传参createrid2
const KEY_6 = '76370661-6d2e-415b-afb3-0fa419d4e12c'; // 创建人部门
const KEY_7 = '0eaf61b7-9f96-4bf7-960d-ea89997e2d82';  // 创建人分部
const KEY_8 = 'e0ea2e01-6d46-4b74-bb5b-6a386e072c44'; // 创建日期,接收日期
const KEY_9 = '04dda747-af1a-446b-99ad-90ead5eb357e'; // 未操作者, 人力资源
const KEY_10 = 'd71cbaa2-50ef-4c01-b0c6-76abf468058b'; // 相关文档
const KEY_11 = '094035a2-e0d5-434f-a40d-ce7dd2261eba'; // 相关客户
const KEY_12 = 'cafcd71c-43e1-4f6c-a9b0-77a37c62720c'; // 相关项目

import forEach from 'lodash/forEach';

import {
    WeaInput,
    WeaInput4ProjectNew,
    WeaInput4DocsNew,
    WeaInput4CustomNew,
    WeaInput4WfNew,
    WeaInput4WtNew,
    WeaNewDate,
    WeaInput4HrmNew,
    WeaInput4DepNew,
    WeaInput4ComNew,
    WeaNewSelect
} from 'weaCom';

export const switchComponent = (props, key, FieldProps, field = {},showName='') => {
    const {getFieldProps} = props.form;
    //  根据key类型返回相对应的组件
    switch (key) {
        case KEY_1:
            return (<WeaInput {...getFieldProps(FieldProps[0])}/>)
        case KEY_2:
            return (<WeaInput4WtNew {...getFieldProps(FieldProps[0])} showName={showName}/>)
        case KEY_3:
            return (<WeaInput4WfNew {...getFieldProps(FieldProps[0])} showName={showName}/>)
        case KEY_4:
            return (<WeaNewSelect datas={formatSelectOptions(field.options)}
                {...getFieldProps(FieldProps[0],{
                	initialValue: getSelectDefaultValue(field.options)
                })} />)
        case KEY_5:
            return (<WeaInput4HrmNew {...getFieldProps('createrid')} getShowName={name => {console.log('--------createrid',name)} }/>)
        case KEY_6:
            return (<WeaInput4DepNew {...getFieldProps(FieldProps[0])} showName={showName}/>)
        case KEY_7:
            return (<WeaInput4ComNew {...getFieldProps(FieldProps[0])} showName={showName}/>)
        case KEY_8:
            return (<WeaNewDate {...getFieldProps(FieldProps[0],{
                	initialValue: getSelectDefaultValue(field.options)
                })} datas={formatSelectOptions(field.options)} form={props.form} domkey={FieldProps} />)
        case KEY_9:
            return (<WeaInput4HrmNew {...getFieldProps(FieldProps[0])} getShowName={name => {console.log('-------',name)} }/>)
        case KEY_10:
            return (<WeaInput4DocsNew {...getFieldProps(FieldProps[0])} showName={showName}/>)
        case KEY_11:
            return (<WeaInput4CustomNew {...getFieldProps(FieldProps[0])} showName={showName}/>)
        case KEY_12:
            return (<WeaInput4ProjectNew {...getFieldProps(FieldProps[0])} showName={showName}/>)
        default:
            return (<WeaInput {...getFieldProps(FieldProps[0])}/>);
    }
}

const formatSelectOptions = (options) => {
    let results = [];
    forEach(options, (option) => {
        results.push({
            value: option.key,
            name: option.showname
        })
    })
    return results;
}

const getSelectDefaultValue = (options) => {
    let value = '';
    forEach(options, (option) => {
        if(option.selected){
            value = option.key;
        }
    })
    return value;
}