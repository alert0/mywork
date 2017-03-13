import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ListAction from '../actions/list'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import BatchSubmit from './list/BatchSubmit'
import {switchComponent} from '../util/switchComponent'
import {Synergy} from 'weaPortal';


import {WeaNewTop,WeaTab,WeaNewTableOld,WeaNewTree,WeaLayoutR11,WeaSearchGroup,WeaRightMenu,WeaPopoverHrm} from 'weaCom'

import {WeaInput,WeaInput4ProjectNew,WeaInput4DocsNew,WeaInput4CustomNew,WeaInput4WfNew,WeaInput4WtNew,WeaNewDate,WeaInput4Hrm,WeaInput4HrmNew,WeaInput4DepNew,WeaInput4ComNew,WeaNewSelect} from 'weaCom'

import {WeaErrorPage,WeaTools} from 'weaCom'

import {Button,Form,Modal} from 'antd'
const createForm = Form.create;
const FormItem = Form.Item;

import cloneDeep from 'lodash/cloneDeep'
import objectAssign from 'object-assign'

import PropTypes from 'react-router/lib/PropTypes'
import Immutable from 'immutable'
const is = Immutable.is;

let _this = null;

class ListDoing extends React.Component {
//	static contextTypes = {
//      router: PropTypes.routerShape
//  }
    constructor(props) {
		super(props);
		_this = this;
    }
    componentDidMount() {
    	const {actions} = this.props;
        actions.setNowRouterWfpath('listDoing');
        actions.initDatas();
        actions.doSearch();
    }
    componentWillReceiveProps(nextProps) {
        const keyOld = this.props.location.key;
        const keyNew = nextProps.location.key;
        if(keyOld!==keyNew) {
            const {actions,isClearNowPageStatus} = this.props;
            actions.unmountClear(isClearNowPageStatus);
            actions.isClearNowPageStatus(false);
            
            actions.setNowRouterWfpath('listDoing');
            actions.initDatas();
            actions.doSearch();
        }

    }
    shouldComponentUpdate(nextProps,nextState) {
        return !is(this.props.title,nextProps.title)||
        !is(this.props.leftTree,nextProps.leftTree)||
        !is(this.props.leftTreeCount,nextProps.leftTreeCount)||
        !is(this.props.leftTreeCountType,nextProps.leftTreeCountType)||
        !is(this.props.topTab,nextProps.topTab)||
        !is(this.props.topTabCount,nextProps.topTabCount)||
        !is(this.props.datas,nextProps.datas)||
        !is(this.props.columns,nextProps.columns)||
        !is(this.props.count,nextProps.count)||
        !is(this.props.loading,nextProps.loading)||
        !is(this.props.operates,nextProps.operates)||
        !is(this.props.searchParams,nextProps.searchParams)||
        !is(this.props.searchParamsAd,nextProps.searchParamsAd)||
        !is(this.props.selectedRowKeys,nextProps.selectedRowKeys)||
        !is(this.props.orderFields,nextProps.orderFields)||
        !is(this.props.showSearchAd,nextProps.showSearchAd)||
        !is(this.props.showBatchSubmit,nextProps.showBatchSubmit) ||
        !is(this.props.phrasesObj,nextProps.phrasesObj) ||
        !is(this.props.sharearg,nextProps.sharearg) ||
        !is(this.props.selectedTreeKeys,nextProps.selectedTreeKeys)||
        !is(this.props.tableCheck,nextProps.tableCheck)||
        !is(this.props.isSpaForm,nextProps.isSpaForm)||
        !is(this.props.current,nextProps.current)||
        !is(this.props.colSetVisible,nextProps.colSetVisible)||
        !is(this.props.colSetdatas,nextProps.colSetdatas)||
        !is(this.props.colSetKeys,nextProps.colSetKeys)||
        !is(this.props.conditioninfo,nextProps.conditioninfo)||
        !is(this.props.pageAutoWrap,nextProps.pageAutoWrap)||
        !is(this.props.pageSize,nextProps.pageSize)||
        !is(this.props.isClearNowPageStatus,nextProps.isClearNowPageStatus);
    }
    componentWillUnmount(){
    	const {actions,isClearNowPageStatus} = this.props;
        actions.unmountClear(isClearNowPageStatus);
        actions.isClearNowPageStatus(false);
    }
    render() {
        let that = this;
        const isSingle = window.location.pathname == '/spa/workflow/index.jsp';
        const {pageSize,pageAutoWrap,topTab,topTabCount,columns,datas,actions,title,count,loading,operates,searchParams,
        	showSearchAd,tableCheck,searchParamsAd,showBatchSubmit,phrasesObj,selectedRowKeys,sortParams,current,colSetVisible,colSetdatas,colSetKeys} = this.props;
        return (
            <div>
            	{isSingle && <WeaPopoverHrm />}
            	<WeaRightMenu btns={this.getRightMenu()} >
                <WeaNewTop showDropIcon={true} title={title} loading={loading} icon={<i className='icon-portal-workflow' />} iconBgcolor='#55D2D4' buttons={this.getButtons()} buttonSpace={10} hideButtons={this.getRightMenu()} >
                <WeaLayoutR11 defaultShowLeft={true} leftCom={this.getTree()} leftWidth={25}>
                    <WeaTab 
                        buttonsAd={this.getTabButtonsAd()}
                    	searchType={['base','advanced']}
                    	searchsBaseValue={searchParamsAd.get('requestname')}
                        setShowSearchAd={bool=>{actions.setShowSearchAd(bool)}}
                        searchsAd={<Form horizontal>{this.getSearchs()}</Form>}
                        showSearchAd={showSearchAd}
                        datas={topTab && topTab.toJS()} 
                        selectedKey={searchParams.get('viewcondition')}
                        counts={topTabCount && topTabCount.toJS()}
                        onSearch={v=>{actions.doSearch()}}
                        onSearchChange={v=>{actions.saveOrderFields({requestname:{name:'requestname',value:v}})}}
                        keyParam="viewcondition"  //主键
                        countParam="groupid" //数量
                        onChange={this.changeData.bind(this)} />
                    <WeaNewTableOld 
                    	current={current}
                        tableCheck={tableCheck}
                        pageSize={pageSize}
                        operates={operates && operates.toJS()}
                        hasOrder={true}
                        onChange={(p,f,s)=>actions.getDatas("",p.current,p.pageSize,s)}
                        rowSel={this.getRowSel()} 
                        columns={this.getColumns(columns && columns.toJS())} 
                        datas={datas && datas.toJS()} 
                        needScroll={true}
                        sortParams={sortParams && sortParams.toJS()}
                        colSetVisible={colSetVisible}
                        colSetdatas={colSetdatas && colSetdatas.toJS()}
                        colSetKeys={colSetKeys && colSetKeys.toJS()}
                        showColumnsSet={bool => {actions.setColSetVisible(bool)}}
                        onTransferChange={keys=>{actions.setTableColSetkeys(keys)}}
                        saveColumnsSet={() => actions.tableColSet()}
                        pageAutoWrap={pageAutoWrap}
                        loading={loading}
                        count={count} />
                </WeaLayoutR11>
                {
                    showBatchSubmit && 
                        <BatchSubmit actions={actions} showBatchSubmit={showBatchSubmit} phrasesObj={phrasesObj} selectedRowKeys={`${selectedRowKeys && selectedRowKeys.toJS()}`} />
                }
                </WeaNewTop>
                </WeaRightMenu>
                <Synergy pathname='/workflow/listDoing' requestid="-1" />
            </div>
        )
    }
    getSearchs() {
        return [
            (<WeaSearchGroup needTigger={true} title={this.getTitle()} showGroup={this.isShowFields()} items={this.getFields()}/>),
            (<WeaSearchGroup needTigger={true} title={this.getTitle(1)} showGroup={this.isShowFields(1)} items={this.getFields(1)}/>)
        ]
    }
    getTitle(index = 0) {
        const {conditioninfo} = this.props;
        return !isEmpty(conditioninfo.toJS()) && conditioninfo.toJS()[index].title
    }
    isShowFields(index = 0) {
        const {conditioninfo} = this.props;
        return !isEmpty(conditioninfo.toJS()) && conditioninfo.toJS()[index].defaultshow
    }
    // 0 常用条件，1 其他条件
    getFields(index = 0) {
        const {conditioninfo} = this.props;
        const fieldsData = !isEmpty(conditioninfo.toJS()) && conditioninfo.toJS()[index].items;
        let items = [];
        forEach(fieldsData, (field) => {
            items.push({
                com:(<FormItem
                    label={`${field.label}`}
                    labelCol={{span: `${field.labelcol}`}}
                    wrapperCol={{span: `${field.fieldcol}`}}>
                        {switchComponent(this.props, field.key, field.domkey, field)}
                    </FormItem>),
                colSpan:1
            })
        })
        return items;
    }
    changeData(theKey) {
        const {actions} = this.props;
        actions.setShowSearchAd(false);
        //const keyArr = theKey?theKey.split("_"):[];
        actions.doSearch({
            viewcondition:theKey //keyArr.length>1?keyArr[1]:""
        },{});
    }
    getTree() {
        const {leftTree,leftTreeCount,leftTreeCountType,actions,topTab,searchParams,selectedTreeKeys,loading} = this.props;
        return (
            <WeaNewTree 
                datas={leftTree && leftTree.toJS()} 
                counts={leftTreeCount && leftTreeCount.toJS()} 
                countsType={leftTreeCountType && leftTreeCountType.toJS()}
                selectedKeys={selectedTreeKeys && selectedTreeKeys.toJS()}
                loading={loading}
                onFliterAll={()=>{
                	actions.setShowSearchAd(false);
                	actions.setSelectedTreeKeys([]);
                    actions.saveOrderFields();
                    actions.initDatas();
                    actions.doSearch({
                    	method:'all',
                        viewcondition:0,
                    	workflowid:"",
                        wftype:""
                    });
                }}
                onSelect={(key,topTabCount,countsType)=>{
                	actions.setShowSearchAd(false);
                	let viewc = '0';
                	actions.setSelectedTreeKeys([key]);
                	topTab.map(t=>{
                        if(countsType && countsType.name && t.get('groupid') == countsType.name) viewc = t.get('viewcondition')
                	})
                    const workflowid = key.indexOf("wf_")===0 ? key.substring(3) : '';
                	const workflowtype = key.indexOf("type_")===0 ? key.substring(5) : '';
                	const fieldsObj = {
                		workflowid:{name:'workflowid',value:workflowid},
                		workflowtype:{name:'workflowtype',value:workflowtype}
                	};
                	actions.saveOrderFields(fieldsObj);
                    actions.doSearch({
                        method:key.indexOf("type_")===0 ? "reqeustbytype" : "reqeustbywfid",
                        wftype: workflowtype,
                        workflowid: workflowid,
                        viewcondition: viewc,
                    });
                }} />
        )
    }
    getRowSel() {
    	const {actions,selectedRowKeys} = this.props;
        return {
            selectedRowKeys: selectedRowKeys && selectedRowKeys.toJS(),
            onChange(sRowKeys, selectedRows) {
                actions.setSelectedRowKeys(sRowKeys);
            },
            onSelect(record, selected, selectedRows) {
                //console.log(record, selected, selectedRows);
            },
            onSelectAll(selected, selectedRows, changeRows) {
                //console.log(selected, selectedRows, changeRows);
            }
        };
    }
    getTabButtonsAd() {
    	const {actions} = this.props;
        return [
            (<Button type="primary" onClick={()=>{actions.doSearch();actions.setShowSearchAd(false)}}>搜索</Button>),
            (<Button type="ghost" onClick={()=>{actions.saveOrderFields({})}}>重置</Button>),
            (<Button type="ghost" onClick={()=>{actions.setShowSearchAd(false)}}>取消</Button>)
        ]
    }
    getButtons() {
    	const {selectedRowKeys,sharearg,actions} = this.props;
        const hasBatchBtn = sharearg && sharearg.get("hasBatchBtn");
    	let btns = [];
        if(hasBatchBtn == "true"){
            btns.push(<Button type="primary" disabled={!(selectedRowKeys && `${selectedRowKeys.toJS()}`)} 
                onClick={()=>{actions.batchSubmitClick({checkedKeys:`${selectedRowKeys.toJS()}`})}}>批量提交</Button>)
        }
        return btns;
    }
    getRightMenu(){
    	const {selectedRowKeys,sharearg,actions} = this.props;
        const hasBatchBtn = sharearg && sharearg.get("hasBatchBtn");
    	let btns = [];
    	btns.push(<a onClick={()=>{actions.doSearch();actions.setShowSearchAd(false)}}><i className='' style={{marginRight:10,verticalAlign:'middle'}} />搜索</a>)
        if(hasBatchBtn == "true"){
            btns.push(<a onClick={()=>{selectedRowKeys && `${selectedRowKeys.toJS()}` ? actions.batchSubmitClick({checkedKeys:`${selectedRowKeys.toJS()}`}) : Modal.warning({
                title: '请至少选择一项'
            })}}><i className='icon-Right-menu-batch' style={{marginRight:10,verticalAlign:'middle'}} />批量提交</a>)
        }
    	btns.push(<a onClick={()=>{actions.setColSetVisible(true);actions.tableColSet(true)}}><i className='icon-Right-menu-Custom' style={{marginRight:10,verticalAlign:'middle'}} />显示定制列</a>)
    	return btns
    }
    getColumns(columns) {
        const {isSpaForm} = this.props;
        let newColumns = cloneDeep(columns);
        return newColumns.map((column)=>{
            let newColumn = column;
            newColumn.render = (text,record,index)=>{ //前端元素转义
                let valueSpan = record[newColumn.dataIndex+"span"];
//              if(!valueSpan || valueSpan==="") {
//                  return text;
//              }
                function createMarkup() { return {__html: valueSpan}; };
                return (
                    <div className="wea-url" dangerouslySetInnerHTML={createMarkup()} />
                )
            }
            return newColumn;
        });
    }
}

window.openSPA = function(routeUrl,id) {
    //console.log("routeUrl :",routeUrl," id:",id);
    //const {router} = _this.context;
    const {actions,history} = _this.props;
    actions.isClearNowPageStatus(true);
    history.push(routeUrl);
    // history.push({
    //     pathname:routeUrl.split("?")[0],
    //     query:{
    //         requestid:id
    //     }
    // });
}

let Sys = {};
let ua = navigator.userAgent.toLowerCase();
let s;
(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

//以下进行测试
// if(Sys.ie) document.write('IE: '+Sys.ie);
// if(Sys.firefox) document.write('Firefox: '+Sys.firefox);
// if(Sys.chrome) document.write('Chrome: '+Sys.chrome);
// if(Sys.opera) document.write('Opera: '+Sys.opera);
// if(Sys.safari) document.write('Safari: '+Sys.safari);

window.openSPA4Single = function(routeUrl,id) {
    const preLoadReqInfo = routeUrl =>{
        let url = "/api/workflow/request/reqinfo?actiontype=loadRight&ispreload=1&";
        url += routeUrl.split("?")[1];
        jQuery.ajax({
            type : "GET",
            url : url
        });
    }
    
    if(Sys.chrome) {
        $(window).mousedown(function(){});
        jQuery("#hiddenPreLoader").attr("src","/spa/workflow/index.jsp");
    }
    //document.getElementById('hiddenWfPreLoader').contentWindow.location.reload(true);

    const _timekey = new Date().getTime();
    routeUrl += "&preloadkey=" + _timekey;
    preLoadReqInfo(routeUrl);

    const width = screen.availWidth - 10;
	const height = screen.availHeight - 50;
	let szFeatures = "top=0,";
	szFeatures += "left=0,";
	szFeatures += "width=" + width + ",";
	szFeatures += "height=" + height + ",";
	szFeatures += "directories=no,";
	szFeatures += "status=yes,toolbar=no,location=no,";
	szFeatures += "menubar=no,";
	szFeatures += "scrollbars=yes,";
	szFeatures += "resizable=yes";
    // var d1 = new Date(),
    // d2 = new Date(),
    // timer = 250; //Milliseconds
    // while (d2.valueOf() < d1.valueOf() + timer) {
    //     d2 = new Date();
    // }
    if(Sys.chrome) {
        let isOpen = false;
        jQuery("#hiddenPreLoader").on("load",function(){
            if(!isOpen) {
                window.open("/spa/workflow/index.jsp#"+routeUrl, "", szFeatures);
                isOpen = true;
                jQuery("#hiddenPreLoader").attr("src","");
                $(window).unbind("mousedown");
            }
        });
    }
    else {
        window.open("/spa/workflow/index.jsp#"+routeUrl, "", szFeatures);
    }

    // setTimeout(function() {
    //     window.open("/spa/workflow/index.jsp#"+routeUrl, "", szFeatures);
    // }, 200);
    
    //window.open("/spa/workflow/index.jsp#"+routeUrl);
}

class MyErrorHandler extends React.Component {
    render(){
        const hasErrorMsg = this.props.error && this.props.error!=="";
        return (
            <WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
        );
    }
}

ListDoing = WeaTools.tryCatch(React, MyErrorHandler, {error: ""})(ListDoing);

ListDoing = createForm({
	onFieldsChange(props, fields){
		const orderFields = objectAssign({},props.orderFields.toJS(),fields);
		props.actions.saveOrderFields(orderFields);
	},
	mapPropsToFields(props) {
		return props.orderFields.toJS();
  	}
})(ListDoing);

function mapStateToProps(state) {
	const {workflowlistDoing} = state;
    return {
        title:workflowlistDoing.get('title'),
        leftTree:workflowlistDoing.get('leftTree'),
        leftTreeCount:workflowlistDoing.get('leftTreeCount'),
        leftTreeCountType:workflowlistDoing.get('leftTreeCountType'),
        topTab:workflowlistDoing.get('topTab'),
        topTabCount:workflowlistDoing.get('topTabCount'),
        datas:workflowlistDoing.get('datas'),
        columns:workflowlistDoing.get('columns'),
        count:workflowlistDoing.get('count'),
        loading:workflowlistDoing.get('loading'),
        operates:workflowlistDoing.get('operates'),
        searchParams:workflowlistDoing.get('searchParams'),
        searchParamsAd:workflowlistDoing.get('searchParamsAd'),
        selectedRowKeys: workflowlistDoing.get('selectedRowKeys'),
        orderFields:workflowlistDoing.get('orderFields'),
        showSearchAd:workflowlistDoing.get('showSearchAd'),
        selectedTreeKeys:workflowlistDoing.get('selectedTreeKeys'),
        tableCheck:workflowlistDoing.get('tableCheck'),
        isSpaForm:workflowlistDoing.get('isSpaForm'),
        isClearNowPageStatus:workflowlistDoing.get('isClearNowPageStatus'),
        sortParams:workflowlistDoing.get('sortParams'),
        current:workflowlistDoing.get('current'),
        colSetVisible:workflowlistDoing.get('colSetVisible'),
        colSetdatas:workflowlistDoing.get('colSetdatas'),
        colSetKeys:workflowlistDoing.get('colSetKeys'),
        conditioninfo:workflowlistDoing.get('conditioninfo'),
        showBatchSubmit:workflowlistDoing.get('showBatchSubmit'),
        phrasesObj:workflowlistDoing.get('phrasesObj'),
        sharearg:workflowlistDoing.get('sharearg'),
        pageAutoWrap:workflowlistDoing.get('pageAutoWrap'),
        pageSize:workflowlistDoing.get('pageSize'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ListAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDoing);
