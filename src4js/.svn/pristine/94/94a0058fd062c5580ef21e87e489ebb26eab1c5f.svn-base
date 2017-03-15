import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as QueryFlowAction from '../actions/queryFlow'
import {setNowRouterWfpath} from '../actions/list'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import {Synergy} from 'weaPortal';

import {WeaErrorPage,WeaTools} from 'weaCom'
import {switchComponent} from '../util/switchComponent'

import {
    WeaTab,
    WeaNewTop,
    WeaNewTableOld,
    WeaSearchGroup,
    WeaInput,
    WeaInput4ProjectNew,
    WeaInput4DocsNew,
    WeaInput4CustomNew,
    WeaInput4WfNew,
    WeaInput4WtNew,
    WeaNewDate,
    WeaInput4Hrm,
    WeaInput4HrmNew,
    WeaInput4DepNew,
    WeaInput4ComNew,
    WeaNewSelect,
    WeaRightMenu,
    WeaPopoverHrm,
    WeaLayoutR11,
    WeaNewTree
} from 'weaCom'

import {Button, Form, Modal,message} from 'antd'
const createForm = Form.create;
const FormItem = Form.Item;

import cloneDeep from 'lodash/cloneDeep'
import objectAssign from 'object-assign'

import Immutable from 'immutable'
const is = Immutable.is;
const fromJS = Immutable.fromJS;
const Map = Immutable.Map;

let _this = null;

class QueryFlow extends React.Component {
    constructor(props) {
        super(props);
        _this = this;
        const {query} = props.location;
        this.doInit(query)
    }
    doInit(obj){
    	//hasQuery 是否有url搜索参数
    	//newFieds 是否是高级查询条件
    	//isJSONStr 是否仅有 jsonstr
    	const {actions, location, fields} = this.props;
    	actions.setNowRouterWfpath('queryFlow');
    	let newFields = {};
    	let isJSONStr = false;
    	let hasQuery = !isEmpty(obj);
    	for(let k in obj){
    		newFields[k] = {name:k,value:`${obj[k]}`,dirty:false}
    		newFields[`_${k}`] = {name:`_${k}`,value:`${obj[k]}`,dirty:false}
    		if(k === 'jsonstr') {
    			isJSONStr = true
    		}
    	}
        actions.initDatas();
		actions.updateDisplayTable(hasQuery);
		actions.initTree(isJSONStr ? obj : {});
    	actions.saveFields(isJSONStr ? {} : newFields);
    	actions.setSearchParams(isJSONStr ? obj : {});
    	hasQuery && actions.doSearch(isJSONStr ? obj : {});
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        const keyOld = this.props.location.key;
        const keyNew = nextProps.location.key;
    	if(window.location.pathname.indexOf('/spa/workflow/index') >= 0 && nextProps.title && document.title !== nextProps.title)
    		document.title = nextProps.title
        if(keyOld!==keyNew) {
            const {actions} = this.props;
            const {query} = nextProps.location;
        	this.doInit(query);
            actions.setSelectedTreeKeys();
            actions.setSelectedRowKeys();
        }

    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(this.props.title, nextProps.title) ||
            !is(this.props.condition, nextProps.condition) ||
            !is(this.props.searchParamsAd, nextProps.searchParamsAd)||
            !is(this.props.fields, nextProps.fields)||
            !is(this.props.current,nextProps.current)||
            !is(this.props.tableCheck,nextProps.tableCheck)||
            !is(this.props.operates,nextProps.operates)||
            !is(this.props.loading,nextProps.loading)||
            !is(this.props.datas,nextProps.datas)||
            !is(this.props.sortParams,nextProps.sortParams)||
            !is(this.props.count,nextProps.count)||
            !is(this.props.showTable,nextProps.showTable)||
            !is(this.props.selectedRowKeys,nextProps.selectedRowKeys)||
            !is(this.props.showSearchAd,nextProps.showSearchAd)||
            !is(this.props.colSetVisible,nextProps.colSetVisible)||
            !is(this.props.colSetdatas,nextProps.colSetdatas)||
            !is(this.props.colSetKeys,nextProps.colSetKeys)||
            !is(this.props.pageAutoWrap,nextProps.pageAutoWrap)||
        	!is(this.props.pageSize,nextProps.pageSize)||
            !is(this.props.btninfo, nextProps.btninfo);
    }
    componentWillUnmount() {
        const {actions} = this.props;
        actions.saveFields();
        actions.setSelectedTreeKeys();
        actions.updateDisplayTable(false);
        actions.setSearchParams();
        actions.setSelectedRowKeys();
        actions.setShowSearchAd(false)
    }
    render() {
        const isSingle = window.location.pathname == '/spa/workflow/index.jsp';
        const {
        	pageSize,
        	pageAutoWrap,
            title,
            loading,
            dataKey,
            current,
            tableCheck,
            operates,
            datas,
            sortParams,
            columns,
            count,
            showTable,
            actions,
            searchParamsAd,
            showSearchAd,
            colSetVisible,
            colSetdatas,
            colSetKeys,
            fields
        } = this.props;
        return (
            <div className='wea-workflow-query'>
            	{isSingle && <WeaPopoverHrm />}
            	<WeaRightMenu datas={this.getRightMenu()} onClick={this.onRightMenuClick.bind(this)}>
                <WeaNewTop 
                	title={title} 
                	loading={loading} 
                	icon={<i className='icon-portal-workflow' />} 
                	iconBgcolor='#55D2D4' 
                	buttons={this.getButtons()} 
                	buttonSpace={10}
                	showDropIcon={true} 
                	dropMenuDatas={this.getRightMenu()} 
                	onDropMenuClick={this.onRightMenuClick.bind(this)}
                >
                   {showTable ? <div style={{height: '100%'}}>
                    	<WeaLayoutR11 leftCom={this.getTree()} leftWidth={25} >
	                        <WeaTab
	                            onlyShowRight={true}
	                            buttonsAd={this.getTabButtonsAd()}
	                            searchType={['base','advanced']}
	                            searchsBaseValue={searchParamsAd.get('requestname')}
	                            setShowSearchAd={bool=>{actions.setShowSearchAd(bool)}}
                                hideSearchAd={()=> actions.setShowSearchAd(false)}
	                            searchsAd={<Form horizontal>{this.getSearchs(true)}</Form>}
	                            showSearchAd={showSearchAd}
	                            onSearch={v=>{actions.doSearch()}}
	                        	onSearchChange={v=>{actions.saveFields({...fields.toJS(),requestname:{name:'requestname',value:v},_requestname:{name:'_requestname',value:v}})}}
	                            />
	                        <WeaNewTableOld
	                            current={current}
	                        	pageSize={pageSize}
	                        	pageAutoWrap={pageAutoWrap}
	                            tableCheck={tableCheck}
	                            operates={operates && operates.toJS()}
	                            hasOrder={true}
	                            onChange={(p,f,s)=>actions.getDatas("",p.current,p.pageSize,s)}
	                            rowSel={this.getRowSel()}
	                            columns={this.getColumns(columns.toJS())}
	                            datas={datas && datas.toJS()}
	                            needScroll={true}
	                            sortParams={sortParams && sortParams.toJS()}
		                        colSetVisible={colSetVisible}
		                        colSetdatas={colSetdatas && colSetdatas.toJS()}
		                        colSetKeys={colSetKeys && colSetKeys.toJS()}
		                        showColumnsSet={bool => {actions.setColSetVisible(bool)}}
		                        onTransferChange={keys=>{actions.setTableColSetkeys(keys)}}
		                        saveColumnsSet={() => actions.tableColSet()}
		                        loading={loading}
	                            count={count}/>
	                	</WeaLayoutR11>
                    </div> :
                    <div className='wea-workflow-query-search'>
                        <Form horizontal>{this.getSearchs()}</Form>
                        <div className='wea-workflow-query-btns'>
                            {this.getSearchButtons()}
                        </div>
                    </div>
                    }
                </WeaNewTop>
                </WeaRightMenu>
                <Synergy pathname='/workflow/queryFlow' requestid="-1" />
            </div>
        )
    }
    onRightMenuClick(key){
    	const {actions,selectedRowKeys} = this.props;
    	if(key == '0'){
    		actions.doSearch();
    		actions.setShowSearchAd(false);
    		actions.updateDisplayTable(true);
    	}
    	if(key == '1'){
    		actions.batchShareWf(`${selectedRowKeys.toJS()}`)
    	}
    	if(key == '2'){
    		actions.setColSetVisible(true);
    		actions.tableColSet(true)
    	}
    }
    getRightMenu(){
    	const {selectedRowKeys,actions,showTable} = this.props;
    	let btns = [];
    	btns.push({
    		icon: <i className='icon-Right-menu--search'/>,
    		content:'搜索'
    	});
        showTable && btns.push({
         	icon: <i className='icon-Right-menu-batch'/>,
			content:'批量共享',
			disabled: !selectedRowKeys || !`${selectedRowKeys.toJS()}`
        })
    	showTable && btns.push({
    		icon: <i className='icon-Right-menu-Custom'/>,
    		content:'显示定制列'
    	})
    	return btns
    }
    getSearchs(bool) {
    	const {showTable} = this.props;
        return [
            (<WeaSearchGroup needTigger={showTable} title={this.getTitle()} showGroup={this.isShowFields()} items={this.getFields(0,bool)}/>),
            (<WeaSearchGroup needTigger={showTable} title={this.getTitle(1)} showGroup={this.isShowFields(1)} items={this.getFields(1,bool)}/>)
        ]
    }
    getTitle(index = 0) {
        const {condition} = this.props;
        return !isEmpty(condition.toJS()) && condition.toJS()[index].title
    }
    isShowFields(index = 0) {
        const {condition} = this.props;
        return !isEmpty(condition.toJS()) && condition.toJS()[index].defaultshow
    }
    // 0 常用条件，1 其他条件
    getFields(index = 0,bool = false) {
        const {condition, showTable, fields} = this.props;
        const fieldsData = !isEmpty(condition.toJS()) && condition.toJS()[index].items;
        let items = [];
        forEach(fieldsData, (field) => {
	        const domkeys = field.domkey.map(k =>{return (bool ? k : `_${k}`)})
            items.push({
                com:(<FormItem
                    label={`${field.label}`}
                    labelCol={{span: `${field.labelcol}`}}
                    wrapperCol={{span: `${field.fieldcol}`}}>
                        {switchComponent(this.props, field.key, domkeys, field, fields.toJS()[domkeys[0]] && fields.toJS()[domkeys[0]].showName)}
                    </FormItem>),
                colSpan:1
            })
        })
        return items;
    }
    getTree() {
        const {leftTree,actions,searchParams,selectedTreeKeys,loading} = this.props;
        return (
            <WeaNewTree
                datas={leftTree && leftTree.toJS()}
                selectedKeys={selectedTreeKeys && selectedTreeKeys.toJS()}
                loading={loading}
                onFliterAll={()=>{
                	actions.setShowSearchAd(false);
                	actions.setSelectedTreeKeys();
                	actions.saveFields();
                    actions.doSearch();
                }}
                onSelect={(key)=>{
                	actions.setShowSearchAd(false);
                	actions.setSelectedTreeKeys([key]);

                	const workflowid = key.indexOf("wf_")===0 ? key.substring(3) : '';
                	const typeid = key.indexOf("type_")===0 ? key.substring(5) : '';
                	let workflowidShowName = '';
                	let typeidShowName = '';
                	leftTree && leftTree.map(l=>{
                		if(l.get('domid') == key) typeidShowName = l.get('name');
                		l.get('childs') && l.get('childs').map(c=>{
                			if(c.get('domid') == key) workflowidShowName = c.get('name');
                		})
                	})
                	const fieldsObj = {
                		workflowid:{name:'workflowid',value:workflowid,showName:workflowidShowName},
                		_workflowid:{name:'_workflowid',value:workflowid,showName:workflowidShowName},
                		typeid:{name:'typeid',value:typeid,showName:typeidShowName},
                		_typeid:{name:'_typeid',value:typeid,showName:typeidShowName}
                	};
                	actions.saveFields(fieldsObj);
                    actions.doSearch();
                }} />
        )
    }
    getTabButtonsAd() {
        const {actions,searchParamsAd} = this.props;
        return [
            (<Button type="primary" onClick={()=>{actions.doSearch();actions.setShowSearchAd(false)}}>搜索</Button>),
            (<Button type="ghost" onClick={()=>{actions.saveFields();actions.setSelectedTreeKeys();}}>重置</Button>),
            (<Button type="ghost" onClick={()=>{actions.setShowSearchAd(false)}}>取消</Button>)
        ]
    }
    getSearchButtons() {
        const { actions,searchParamsAd} = this.props;
        const btnStyle={
        	borderRadius: 3,
			height: 28,
			width: 80
        }
        return [
            (<Button type="primary" style={btnStyle} onClick={()=>{actions.doSearch(); actions.updateDisplayTable(true);actions.setShowSearchAd(false)}}>搜索</Button>),
            (<span style={{width:'15px', display:'inline-block'}}></span>),
            (<Button type="ghost" style={btnStyle} onClick={()=>{actions.saveFields();actions.setShowSearchAd(false)}}>重置</Button>)
        ]
    }
    getButtons() {
        const {actions,showTable,selectedRowKeys} = this.props;
        let btns =[];
        showTable && btns.push(<Button type="primary" disabled={!(selectedRowKeys && `${selectedRowKeys.toJS()}`)} onClick={()=>{actions.batchShareWf(`${selectedRowKeys.toJS()}`)}}  >批量共享</Button>);
        return btns
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
    getColumns(columns) {
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

class MyErrorHandler extends React.Component {
    render(){
        const hasErrorMsg = this.props.error && this.props.error!=="";
        return (
            <WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
        );
    }
}

QueryFlow = WeaTools.tryCatch(React, MyErrorHandler, {error: ""})(QueryFlow);

QueryFlow = createForm({
    onFieldsChange(props, fields) {
    	let _fields = {...fields};
    	let __fields = {};
    	for(let k in fields){
    		let __obj = {...fields[k]};
    		if(fields[k].value.indexOf('_@_') >= 0){
    			let newValue =  fields[k].value.split('_@_');
	    		_fields[k].value = newValue[0];
	    		_fields[k].showName = newValue[1];
    		}
    		__obj.name = _fields[k].name.indexOf('_') < 0 ? `_${_fields[k].name}` : _fields[k].name.substring(1);
    		__obj.value = _fields[k].value;
    		__obj.showName = _fields[k].showName;
    		__fields[k.indexOf('_') < 0 ? `_${k}` : k.substring(1)] = {...__obj};
    	}
        props.actions.saveFields({...props.fields.toJS(), ...fields,..._fields, ...__fields});
    },
    mapPropsToFields(props) {
        return props.fields.toJS();
    }
})(QueryFlow);

function mapStateToProps(state) {
    const {
        workflowqueryFlow
    } = state;
    return {
        title: workflowqueryFlow.get('title'),
        condition: workflowqueryFlow.get('condition'),
        fields: workflowqueryFlow.get('fields'),
        searchParamsAd: workflowqueryFlow.get('searchParamsAd'),
        dataKey: workflowqueryFlow.get('dataKey'),
        loading: workflowqueryFlow.get('loading'),
        current: workflowqueryFlow.get('current'),
        tableCheck: workflowqueryFlow.get('tableCheck'),
        datas: workflowqueryFlow.get('datas'),
        sortParams: workflowqueryFlow.get('sortParams'),
        count: workflowqueryFlow.get('count'),
        columns: workflowqueryFlow.get('columns'),
        pageSize: workflowqueryFlow.get('pageSize'),
        operates: workflowqueryFlow.get('operates'),
        showTable: workflowqueryFlow.get('showTable'),
        showSearchAd: workflowqueryFlow.get('showSearchAd'),
        colSetVisible: workflowqueryFlow.get('colSetVisible'),
        colSetdatas: workflowqueryFlow.get('colSetdatas'),
        colSetKeys: workflowqueryFlow.get('colSetKeys'),
        leftTree: workflowqueryFlow.get('leftTree'),
        searchParams:workflowqueryFlow.get('searchParams'),
        selectedRowKeys: workflowqueryFlow.get('selectedRowKeys'),
        selectedTreeKeys:workflowqueryFlow.get('selectedTreeKeys'),
        pageAutoWrap:workflowqueryFlow.get('pageAutoWrap'),
        pageSize:workflowqueryFlow.get('pageSize'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...QueryFlowAction,setNowRouterWfpath}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryFlow);