import Row from '../_antd1.11.2/Row';
import Col from '../_antd1.11.2/Col';
import Modal from '../_antd1.11.2/Modal';
import Tooltip from '../_antd1.11.2/Tooltip';
import Tabs from '../_antd1.11.2/Tabs';
const TabPane = Tabs.TabPane;
import Select from '../_antd1.11.2/Select';
const Option = Select.Option;
import Menu from '../_antd1.11.2/menu';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import Button from '../_antd1.11.2/Button';
import Dropdown from '../_antd1.11.2/Dropdown';
import Icon from '../_antd1.11.2/Icon';
import Form from '../_antd1.11.2/Form'
const FormItem = Form.Item;
import cloneDeep from 'lodash/cloneDeep';
const _ = require('lodash');

import WeaInput from '../wea-input';
import WeaSearchBrowserBox from '../wea-search-browser-box';
import WeaInputFocus from '../wea-input-focus';
import WeaTreeWorkflow from '../wea-tree-workflow';
import WeaScroll from '../wea-scroll';
import * as util from './util';
import WeaRightMenu from '../wea-right-menu';

function getTreeDatas(url,params) {
    // console.log("url",url,"params",params);
    return new Promise(function(resolve) {
        fetch(url,{
            method:'get',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
            credentials: 'include',
            body:params
        }).then(function(response) {
            resolve(response.json());
            // console.log("response.json",response.json())
        }).catch(function(ex) {
            resolve([]);
            console.log('parsing failed', ex);
        });
    });
}

class WeaWorkflowTreeRadio extends React.Component {
    constructor(props) {
        super(props);
        const {dataUrl,otherPara,dataKey,isMult} = props;
        let url = dataUrl;
        for(let i=0;i<otherPara.length;i+=2) {
            if(i==0) url += "?";
            else url += "&";
            url += otherPara[i]+"="+otherPara[i+1];
        }
        this.state = {
            visible: true,
            url:url,
            loading: false,
            showDrop: false,
            activeKey: "1",
            listDatas:[],
            companysDefault:'',
            componyParam:'',
            showSearchAd:false,
            treeData:{},
            defaultExpandedKeys:[],
            hasSelected:false,
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.dataUrl != nextProps.dataUrl){
            // console.log("dataUrl不同");
        }
    }
    componentDidMount(){
        const {url} = this.state;
        let  _this = this;
        !this.props.notShowDropMenu && util.getDatas(url,'GET').then((data)=>{
            // console.log("data:",data);
            _this.setState({
                companysDefault:data.companys[0].name,
                listDatas:_this.getWfList(data.companys),
            });
        });

        const {topPrefix} = this.props;
        let keysArr = [];
        getTreeDatas(url).then(datas => {
            // console.log("componentDidMount:",datas);
            if(!!datas.result.rootCompany){//（部门、分部）浏览按钮
                // console.log('部门分部树',datas);
                keysArr.push(`${topPrefix}0-${datas.result.rootCompany.id}`);//默认展开一级树节点
                // console.log('keysArr',keysArr);
                _this.setState({
                    treeData:datas.result.rootCompany,
                    defaultExpandedKeys:keysArr,
                });
            }else{//（城市、行业、文档目录）浏览按钮
                // console.log('城市行业文档树',datas);
                _this.setState({
                    treeData:datas.result,
                    defaultExpandedKeys:[''],
                });
            }
        });
    }

    tableChange(activeKey) {
        // console.log("activeKey:", activeKey);
        // this.setState({
        //     activeKey
        // });
    }
    handleClick(e) {
        // console.log('click ', e);
    }
    onSelect(e){
        // console.log("onSelect",e);
        const {url} = this.state;
        let  _this = this;
        this.state.listDatas.forEach((item)=>{
            if(e.key == item.companyid){
                this.setState({
                    companysDefault:item.name,
                    componyParam:e.key=="1" ? "" : "virtualCompanyid="+e.key,//是虚拟维度才传参
                })
            }
        })
        let param = e.key=="1" ? "" : "&virtualCompanyid="+e.key;//是虚拟维度才传参
        getTreeDatas(url+param).then(datas => {
            // console.log("onSelect==datas:",datas);
            let keysArr = [];
            // datas.result.rootCompany.subOrgs.map(data=>{
            //     data.id && keysArr.push(data.id);
            // });
            _this.setState({
                treeData:datas.result.rootCompany,
                // defaultExpandedKeys:keysArr,
            });
         });
    }
    setShowSearchAd(bool){
        const {showSearchAd}=this.state;
        this.setState({showSearchAd:bool})
    }
    onSearchChange(v){//按照名称搜索
        console.log("v",v);
    }
    render() {
        let _this = this;
        // console.log("this.props",this.props);
        // console.log("this.state.listDatas",this.state.listDatas);
        // console.log("this.state.companysDefault",this.state.companysDefault);
        const {icon,style,topPrefix,topIconUrl,otherPara,dataKey,isMult,ifCheck,disabled,prefix,ifAsync,
            iconBgcolor,title,browerType,dataUrl,asyncUrl,listUrl,countUrl,showSearchArea,notShowDropMenu,singleTabName} = this.props;
        const {showDrop,activeKey,datas,url,componyParam,showSearchAd,defaultExpandedKeys,treeData} = this.state;
        let titleEle = (
            <Row>
                <Col span="8" style={{paddingLeft:20,lineHeight:'50px'}}>
                    <div className="wea-workflow-tree-radio-title">
                        {iconBgcolor ? 
                        <div className="icon-circle-base" style={{background:iconBgcolor ? iconBgcolor : ""}}>
                            {icon}
                        </div>
                        : <span style={{verticalAlign:'middle',marginRight:10}}>
                            {icon}
                        </span>}
                        <span style={{verticalAlign:'middle'}}>{title}</span>
                    </div>
                </Col> 
            </Row>
        );
         const menu = (
            <Menu>
             {this.getRightMenu().map((item,index)=>{return <Menu.Item>{item}</Menu.Item>})}
            </Menu>
        );
        const operations = (
            <div  onMouseLeave={()=>_this.setState({showDrop:false})}> 
                {/*<Select defaultValue="allData" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                  <Option value="allData">全部数据</Option>
                </Select>*/}
                <span className='wea-workflow-radio-drop-btn' onClick={()=>_this.setState({showDrop:!showDrop})}>
                    <i className="icon-button icon-New-Flow-menu" />
                </span>
                <div className='wea-workflow-radio-drop-menu' style={{display:showDrop ? 'block' : 'none'}}>
                    <span className='wea-workflow-radio-drop-btn' onClick={()=>_this.setState({showDrop:!showDrop})}>
                        <i className="icon-button icon-New-Flow-menu" />
                    </span>
                    {menu}
                </div>
            </div>
        );
        let menuItem = [];
        this.state.listDatas.map((item)=>{
            menuItem.push(<Menu.Item key={item.companyid}>{item.name}</Menu.Item>);
            menuItem.push(<Menu.Divider />)
        });
        let typeMenu = (
            <Menu className="wea-workflow-tree-radio-drop-menu" onSelect={this.onSelect.bind(this)} onClick={this.handleClick.bind(this)}>
            {menuItem}
            </Menu>
        );
        const searchsBox = this.getSearchs();
        const buttonsAd = this.getTabButtonsAd();
        return (
            <div> 
                <WeaRightMenu datas={this.getRightMenuNew()} onClick={this.onRightMenuClick.bind(this)}>
                 <Tabs 
                    tabBarExtraContent={operations}
                    onChange={this.tableChange.bind(this)}
                    activeKey={this.state.activeKey}
                   >
                    <TabPane tab={singleTabName} key="1"></TabPane>
                </Tabs>
                {!notShowDropMenu && <Row>
                    <Col span={24}>
                        <Dropdown overlay={typeMenu} trigger={['click']}>
                            <a className="ant-dropdown-link" href="javascript:;">
                              {icon}{this.state.companysDefault} <Icon type="down" style={{float:"right"}}/>
                            </a>
                        </Dropdown>
                    </Col>
                </Row>}
                {showSearchArea && 
                <Row style={{height:"35px"}}>
                    <Col span="21">
                        <WeaInputFocus onSearchChange={this.onSearchChange.bind(this)} />
                    </Col>
                    <Col span="3">
                        <Button  className="wea-workflow-serch-condition"  onClick={this.setShowSearchAd.bind(this,true)} type="ghost">搜索条件</Button>
                    </Col>
                </Row>}
                {showSearchAd && 
                <div className="wea-search-conditon-wraper">
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
                </div>}
                <WeaScroll className="wea-scroll" typeClass="scrollbar-macosx" style={{height:"300px",overflowX:"hidden!important"}}>
                   {defaultExpandedKeys.length>0 && 
                    <WeaTreeWorkflow 
                        title={title}
                        browserTree={false}
                        checkable={true}
                        topPrefix={topPrefix}
                        prefix={prefix}
                        topIconUrl={topIconUrl}
                        dataUrl={url}
                        componyParam={componyParam}
                        asyncUrl={asyncUrl}
                        dataKey={dataKey}
                        otherPara={otherPara}
                        setData={this.setData.bind(this)}
                        isMult={isMult}
                        ifAsync={ifAsync}
                        ifCheck={ifCheck}
                        icon={icon}
                        treeData={treeData}
                        defaultExpandedKeys={defaultExpandedKeys}
                        />}
                </WeaScroll>
               </WeaRightMenu>
            </div>
        )
    }
    getRightMenu(){
        let btns = [];
        btns.push(<a onClick={()=>{!this.state.hasSelected?Modal.warning({title:'请至少选择一项'}):this.props.handleOk && this.props.handleOk();}}><i className='icon-Right-menu-edit' style={{marginRight:10,verticalAlign:'middle'}} />确定</a>);
        btns.push(<a onClick={()=>{this.props.handleClear && this.props.handleClear(); }}><i className='icon-Right-menu-delete' style={{marginRight:10,verticalAlign:'middle'}} />清除</a>);
        btns.push(<a onClick={()=>{this.props.handleCancel && this.props.handleCancel(); }}><i className='icon-Right-menu-Return' style={{marginRight:10,verticalAlign:'middle'}} />取消</a>);
        return btns;
    }
    getRightMenuNew(){
        let btns = [{
            icon: <i className='icon-Right-menu-edit'/>,
            content:'确定'
        },{
            icon: <i className='icon-form-delete'/>,
            content:'清除'
        }, {
            icon: <i className='icon-Right-menu--go-back'/>,
            content:'取消'
        }]
        return btns;
    }
    onRightMenuClick(key){
        if(key == '0'){
            !this.state.hasSelected ? Modal.warning({title:'请至少选择一项'}) : this.props.handleOk && this.props.handleOk();
        }
        if(key == '1'){
           this.props.handleClear && this.props.handleClear();
        }
        if(key == '2'){
            this.props.handleCancel && this.props.handleCancel();
        }
    }
    setData(ids,names){
        let  _this = this;
        if(ids && ids !== '')this.setState({hasSelected:true});
        if(typeof _this.props.setData === "function"){
            // console.log('WeaWorkflowTreeRadio');
            _this.props.setData(ids,names);
        }
    }
    getWfList(datas){
        // console.log("datas",datas);
        let arr = new Array();
        for (let i=0;i<datas.length;i++) {
            const data = datas[i];
                arr.push({ 
                    companyid:data.companyid,
                    name: data.name, 
                    isVirtual:data.isVirtual,
                });
            }
        return arr;
    }
    getSearchs(){
        // console.log("this.props.form",this.props.form);
        const {title} = this.props;
        const {getFieldProps} = this.props.form;
        let items = new Array();
        items.push({
            com:(<FormItem
            label="简称"
            labelCol={{ span: 8}}
            wrapperCol={{ span: 16 }}>
                <WeaInput {...getFieldProps("name")}/>
            </FormItem>),
            colSpan:2
         });
        return <WeaSearchBrowserBox  items={items} />
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
                        _this.setState({dataKey:data.result});
                        _this.setState({refreshTableDatas:!refreshTableDatas});
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
}
export default Form.create()(WeaWorkflowTreeRadio);
 