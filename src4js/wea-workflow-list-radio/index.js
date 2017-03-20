import Tree from '../_antd1.11.2/Tree';
import Row from '../_antd1.11.2/Row';
import Col from '../_antd1.11.2/Col';
import Modal from '../_antd1.11.2/Modal';
import Tooltip from '../_antd1.11.2/Tooltip';
import Tabs from '../_antd1.11.2/Tabs';
import Table from '../_antd1.11.2/Table';
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
import Spin from '../_antd1.11.2/Spin';
import Select from '../_antd1.11.2/Select';
const Option = Select.Option;
import Form from '../_antd1.11.2/Form'
const FormItem = Form.Item;
import Menu from '../_antd1.11.2/menu';
import Button from '../_antd1.11.2/Button';
import Input from '../_antd1.11.2/Input';
import cloneDeep from 'lodash/cloneDeep';
const  _  =  require('lodash');
import objectAssign from 'object-assign'

import WeaInputFocus from '../wea-input-focus';
import WeaInput from '../wea-input';
import WeaSearchBrowserBox from '../wea-search-browser-box';
import WeaScroll from '../wea-scroll';
import * as util from './util';
import WeaNewTable from '../wea-new-table';
import WeaNewSelect from '../wea-new-select';
import {WeaInput4CustomNewType,WeaInput4CustomNewStatus,WeaInput4CustomNewCountry,WeaInput4CustomNewCity,
        WeaInput4CustomNewDescription,WeaInput4CustomNewScale,WeaInput4CustomNewIndustry} from  '../wea-input4-custom-new-plus';
import WeaInput4HrmNew from '../wea-input4-hrm-new';
import WeaInput4DepNew from '../wea-input4-dep-new';
import WeaInput4CustomNew from '../wea-input4-custom-new'
import {WeaInput4DocsNewCategory} from  '../wea-input4-docs-new-plus';
import WeaNewDate from '../wea-new-date';
import WeaRightMenu from '../wea-right-menu';

import WeaDropMenu from '../wea-drop-menu';

let workflowDatas;
class WeaWorkflowListRadio extends React.Component {
    static defaultProps = {
    };
    static propTypes = {
    };
    constructor(props) {
        super(props);
        const {dataUrl,otherPara} = props;
        // console.log(this.props);
        let url = dataUrl;//+"?"+otherPara[0]+"="+otherPara[1];
        for(let i=0;i<otherPara.length;i+=2) {
            if(i==0) url += "?";
            else url += "&";
            url += otherPara[i]+"="+otherPara[i+1];
        }
        this.state = {
            visible:false,
            loading: true,
            showDrop: false,
            activeKey: "1",
            url:url,
            listDatas:[],
            record:{},
            showSearchAd:false,
            rowIndex:'',
            id:"",
            name:'',
            refreshTableDatas:false,
            dataKey:'',
            seacrhPara:'',
            hasSearchValue:false,
            fields:'',
            pagination: {}
        }
    }
    componentDidMount() {
        const {url,refreshTableDatas} = this.state;
        util.getDatas(url,'GET').then((data)=> {
            if(this.state.dataKey !== data.result){
                this.setState({dataKey:data.result});
            }else{
                this.setState({refreshTableDatas:!refreshTableDatas});
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        // console.log('===================',this.props.resetValue,nextProps.resetValue);
        const {url,refreshTableDatas} = this.state;
        if(this.props.resetValue !== nextProps.resetValue){
            // console.log('refreshTableDatas',refreshTableDatas);
            this.setState({hasSearchValue:false});//搜索框置空
            //重刷数据
            util.getDatas(url,'GET').then((data)=> {
                if(this.state.dataKey !== data.result){
                    this.setState({dataKey:data.result});
                }else{
                    this.setState({refreshTableDatas:!refreshTableDatas});
                }
            });
        }
    }
    componentDidUpdate(){
       /* const {rowIndex}=this.state;
        const{otherPara}=this.props;
        if(rowIndex || rowIndex === 0){
            jQuery(".wea-workflow-radio .ant-table-tbody").each(function(){
                jQuery(this).find("tr").css({"background-color":"#fff"}).find("td").css("color","#666");
            });
            jQuery(".wea-workflow-radio .ant-table-tbody").each(function(){
                jQuery(this).find("tr").eq(rowIndex).css({"background-color":"#0D93F6"}).find("td").css("color","#fff");
            });
        }*/
    }
    handleChange(selectedRowKeys, selectedRows) {

    }
    onChange(activeKey) {
        this.setState({
            activeKey
        });
    }
    onRowClick(record, index){
        // console.log("record",record,"index",index);
        const{id,name,rowIndex} = this.state;
        if (typeof this.props.setData === "function") {
            this.props.setData(
                record.id,
                record.name?record.name : record.typename?record.typename : record.workflowname?record.workflowname : record.docsubjectspan?
                record.docsubjectspan:record.rolesname?record.rolesname:record.countryname ? record.countryname:record.fullname);
        }
        this.setState({
            id:record.id,
            name:record.name?record.name : record.typename?record.typename : record.workflowname?record.workflowname : record.docsubjectspan?
                 record.docsubjectspan : record.rolesname?record.rolesname : record.countryname?record.countryname:record.fullname,
            rowIndex:index
        })
    }
    setShowSearchAd(bool){
        const {showSearchAd}=this.state;
        this.setState({showSearchAd:bool})
    }
    formatSelectOptions(option){
    // let results = [];
    // forEach(options, (option) => {
    //     if (option.key) {
    //         results.push({
    //             value: option.key,
    //             name: option.showname
    //         })
    //     }
    // })
    // console.log('results',results)
    // return results;
    }

    render() {
        let  _this = this;
        // console.log('render=====refreshTableDatas',this.state.refreshTableDatas);
        // console.log("seacrhPara",seacrhPara);
        // console.log("this.state.visible2",this.state.visible);
        // console.log("this.state.record",this.state.record);
        const {icon,iconBgcolor,title,allWf,bookMarkWf, browerType,listUrl,countUrl,otherPara} = this.props;
        const {showDrop,activeKey,listDatas,id,name,visible,showSearchAd,dataKey,refreshTableDatas,seacrhPara,hasSearchValue} = this.state;

        // const searchsBox = <Form horizontal>{this.getSearchs()}</Form>;
        // const buttonsAd = this.getTabButtonsAd();
        const searchsBox = this.getSearchs();
        const buttonsAd = this.getTabButtonsAd();
        // console.log('hasSearchValue',hasSearchValue);
        let resetValue = {value:null};
        resetValue.value = hasSearchValue ? 'undefined' : '';//搜索值置空
        // console.log('resetValue',resetValue);
        const operations = <WeaDropMenu dropMenuDatas={this.getRightMenuNew()} onDropMenuClick={this.onRightMenuClick.bind(this)} />
        return (
            <div>
                <WeaRightMenu datas={this.getRightMenuNew()} onClick={this.onRightMenuClick.bind(this)}>
                <Tabs
                    tabBarExtraContent={operations}
                    onChange={this.onChange.bind(this)}
                    activeKey={this.state.activeKey}
                    >
                    <TabPane tab="全部" key="1"></TabPane>
                    {/*<TabPane tab="我的收藏" key="2"></TabPane>*/}
                </Tabs>
                <Row style={{height:"35px"}}>
                    <Col span="21">
                        <WeaInputFocus onSearchChange={_.debounce(this.onSearchChange,200).bind(this)} {...resetValue} />
                    </Col>
                    <Col span="3">
                        <Button  className="wea-workflow-serch-condition"  onClick={this.setShowSearchAd.bind(this,true)} type="ghost">搜索条件</Button>
                    </Col>
                </Row>
                {showSearchAd &&
                    (<div className="wea-search-conditon-wraper">
                        <Button type='ghost' className="wea-advanced-search" onClick={this.setShowSearchAd.bind(this,false)}>搜索条件</Button>
                        <div className='wea-advanced-searchs' >
                         <Form horizontal>
                            {searchsBox}
                             <div className="wea-search-buttons">
                                <div style={{"textAlign":"center"}}>
                                {buttonsAd && buttonsAd.map((data) => <span style={{marginLeft:15}}>{data}</span>)}
                                </div>
                             </div>
                            </Form>
                         </div>
                    </div>)
                }
                <WeaScroll className="wea-scroll" typeClass="scrollbar-macosx" style={{"height":"300px",width:"100%"}}>
                    <div  style={activeKey==="1"?{display:'block'}:{display:'none'}}>
                        <WeaNewTable
                            ref="tableList"
                            onChange={(p)=>{this.setState({pagination: p});}}
                            pageinationSize="small"
                            noOperate={true}
                            dataKey={dataKey}
                            refreshDatas={refreshTableDatas}
                            onRowClick={(record,index)=> _this.onRowClick(record, index)}
                            getTableLoading={loading => _this.setState({loading:loading})}
                        />
                    </div>
                    <div className="wea-workflow-dataList"  style={activeKey==="2"?{display:'block'}:{display:'none'}}></div>
                </WeaScroll>
                </WeaRightMenu>
            </div>
        )
    }
    getRightMenuNew(){
        let btns = [{
            icon: <i className='icon-form-delete'/>,
            content:'清除'
        }, {
            icon: <i className='icon-Right-menu--go-back'/>,
            content:'取消'
        }, {
            icon: <i className='icon-form-left'/>,
            content:'上一页',
            disabled: this.isPreviousDisabled()
        }, {
            icon: <i className='icon-form-right'/>,
            content:'下一页',
            disabled: this.isNextDisabled()
        }];
        return btns;
    }
    onRightMenuClick(key){
        if(key == '0'){
            this.props.handleClear && this.props.handleClear();
            this.setShowSearchAd.bind(this,false);
        }
        if(key == '1'){
            this.props.handleCancel && this.props.handleCancel();
            this.setShowSearchAd.bind(this,false);
        }
        if(key == '2'){
            this.previous();
        }
        if(key == '3'){
            this.next();
        }
    }
    isPreviousDisabled() {
        return this.state.pagination.current === 1;
    }
    isNextDisabled() {
        const {pagination} = this.state;
        return pagination.current === Math.ceil(pagination.count/pagination.pageSize)
    }
    previous() {
        const {pagination} = this.state;
        const current = pagination.current - 1;
        if (current === 0) return;
        this.refs.tableList.getTableDatas('', false, current, pagination.pageSize);
    }
    next() {
        const {pagination} = this.state;
        if (pagination.current === Math.ceil(pagination.count/pagination.pageSize)) return;
        this.refs.tableList.getTableDatas('', false, pagination.current + 1, pagination.pageSize);
    }
    onSearchChange(v){//按照名称搜索
        // console.log("v",v);
        let _this = this;
        const {url,refreshTableDatas,seacrhPara} = this.state;
        if (v) {
            this.setState({hasSearchValue:true});
            v = encodeURI(v);
        }
        //`${url}&${new Date().getTime()}=`;
        let newUrl = url + `&name=${v}&${new Date().getTime()}=`;
        util.getDatas(newUrl,"GET").then((data)=> {
            _this.setState({dataKey:data.result});
            _this.state.dataKey !== data.result && _this.setState({refreshTableDatas:!refreshTableDatas});
        });
    }
     getTabButtonsAd() {
        let _this = this;
        const {resetFields,validateFields} = this.props.form;
        const {url,refreshTableDatas,seacrhPara} = this.state;
        let queryParams = new Array();
        return [
            <Button type="primary" onClick={(e)=>{
                    e.preventDefault();
                    validateFields((errors, object) => {
                        if (!!errors) {
                            // console.log('Errors in form!!!');
                            return;
                        }
                        // console.log("object",object);
                        let newObject = cloneDeep(object);
                        let newKeys;
                        newKeys = _.keys(newObject).map((key,index)=>{return key});
                        _.values(newObject).map((v,index)=>{
                            if(!!v){
                                queryParams.push(`&${newKeys[index]}=${v}`);
                            }
                        })
                        // console.log("newKeys",newKeys);
                    });
                    const query = queryParams.join('');
                    // console.log("query",query);
                    let newUrl = url + query;
                    util.getDatas(newUrl,'GET').then((data)=> {
                        if(_this.state.dataKey !== data.result){
		                    _this.setState({dataKey:data.result});
                        }else{
		                    _this.setState({refreshTableDatas:!refreshTableDatas});
                        }
                    });

                    _this.setState({
                        showSearchAd:false,
                        // hasSearchValue:true,
                        seacrhPara:queryParams.join(''),
                    });


                }
            }>搜索</Button>,
            <Button type="ghost" onClick={(e)=>{e.preventDefault();resetFields()}}>重置</Button>,
            <Button type="ghost" onClick={()=>{_this.setState({showSearchAd:false})}}>取消</Button>
        ]
    }

    getSearchs(){
        // console.log("this.props.form",this.props.form);
        let _this = this;
        const {title} = this.props;
        const {getFieldProps,getFieldsValue} = this.props.form;
        let items = new Array();
        if(title.indexOf("相关项目")===0){
             items.push({
                com:(<FormItem
                label="名称"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput {...getFieldProps("name")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem
                label="项目状态"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaNewSelect
                    datas={[
                        {value:"",name:""},
                        {value:"0",name:"草稿"},
                        {value:"1",name:"正常"},
                        {value:"2",name:"延期"},
                        {value:"3",name:"完成"},
                        {value:"4",name:"冻结"},
                        {value:"5",name:"立项批准"},
                        {value:"6",name:"待审批"},
                        {value:"7",name:"审批退回"}]}
                    {...getFieldProps("status")} />
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem
                label="项目阶段"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaNewSelect
                    datas={[
                        {value:"",name:""},
                        {value:"立项",name:"立项"},
                        {value:"调研",name:"调研"},
                        {value:"搭建",name:"搭建"},
                        {value:"测试",name:"测试"},
                        {value:"培训",name:"培训"},
                        {value:"上线",name:"上线"},
                        {value:"验收",name:"验收"},
                        {value:"结案",name:"结案"},
                        {value:"维保",name:"维保"}]}
                    {...getFieldProps("prjtype")} />
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem
                label="项目经理"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4HrmNew {...getFieldProps("manager")}/>
                </FormItem>),
                colSpan:2
            });
        }
        else if(title.indexOf("相关客户")===0){
            items.push({
                com:(<FormItem label="客户名称"
                        labelCol={{ span: 8}} wrapperCol={{ span: 16 }}> <WeaInput {...getFieldProps("name")}/></FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem label="客户编码"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput {...getFieldProps("crmcode")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem label="类型"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4CustomNewType {...getFieldProps("type")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem label="状态"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4CustomNewStatus {...getFieldProps("customerStatus")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem label="国家"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4CustomNewCountry {...getFieldProps("country1")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem label="城市"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4CustomNewCity {...getFieldProps("City")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem label="客户经理"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4HrmNew {...getFieldProps("crmManager")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem label="客户经理部门"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4DepNew {...getFieldProps("departmentid")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem label="描述"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4CustomNewDescription {...getFieldProps("customerDesc")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem label="规模"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4CustomNewScale {...getFieldProps("customerSize")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem label="行业"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4CustomNewIndustry {...getFieldProps("sectorInfo")}/>
                </FormItem>),
                colSpan:2
            });
        }
        else if(title.indexOf("相关文档")===0){
            items.push({
                com:(<FormItem label="标题"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput  {...getFieldProps("name")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem
                label="文档目录"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4DocsNewCategory {...getFieldProps("secCategory")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem
                label="日期"
                labelCol={{ span: 4}}
                wrapperCol={{ span: 20 }}>
                <WeaNewDate {...getFieldProps("searchdate")}
                    datas={[{value:'0',name:'全部'},
                            {value:'1',name:'今天'},
                            {value:'2',name:'本周'},
                            {value:'3',name:'本月'},
                            {value:'4',name:'本季'},
                            {value:'5',name:'本年'},
                            {value:'6',name:'指定日期范围'}]}
                    form={this.props.form}
                    domkey={['searchdate','searchdatefrom','searchdateto']} />
                </FormItem>),
                colSpan:1
            });
            items.push({
                com:(<FormItem
                label="员工"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4HrmNew {...getFieldProps("searchcreater")}/>
                </FormItem>),
                colSpan:2
            });
              items.push({
                com:(<FormItem
                label="客户"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput4CustomNew {...getFieldProps("txtCrmId")}/>
                </FormItem>),
                colSpan:2
           });
            items.push({
                com:(<FormItem
                label="修改期间"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaNewSelect
                    datas={[
                        {value:"",name:""},
                        {value:"6",name:"最近6个月"},
                        {value:"12",name:"最近12个月"},
                        {value:"18",name:"最近18个月"},
                        {value:"38",name:"全部"}]}
                    {...getFieldProps("date2during")} />
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem
                label="标识"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput {...getFieldProps("searchid")}/>
                </FormItem>),
                colSpan:2
           });
        }
        else{//所属路径，路径类型
            items.push({
                com:(<FormItem
                label="简称"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput {...getFieldProps("name")}/>
                </FormItem>),
                colSpan:2
            });
            items.push({
                com:(<FormItem
                label="描述"
                labelCol={{ span: 8}}
                wrapperCol={{ span: 16 }}>
                    <WeaInput {...getFieldProps("description")}/>
                </FormItem>),
                colSpan:2
            });
        }

        return <WeaSearchBrowserBox  items={items} />
    }

}
let saveOrderFields = {};
WeaWorkflowListRadio = Form.create({
    onFieldsChange(props, fields){
        // console.log('onFieldsChange',props,fields);
        saveOrderFields = objectAssign({},saveOrderFields,fields);
    },
    mapPropsToFields(props) {
        // console.log('mapPropsToFields',props);
        return saveOrderFields;
}})(WeaWorkflowListRadio);

export default WeaWorkflowListRadio;