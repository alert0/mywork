import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ListAction from '../actions/list'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import {switchComponent} from '../util/switchComponent'
import {Synergy} from 'weaPortal';

import {WeaNewTop,WeaTab,WeaNewTableOld,WeaNewTree,WeaLayoutR11,WeaSearchGroup,WeaRightMenu,WeaPopoverHrm} from 'weaCom'

import {WeaErrorPage,WeaTools} from 'weaCom'

import {WeaInput,WeaInput4ProjectNew,WeaInput4DocsNew,WeaInput4CustomNew,WeaInput4WfNew,WeaInput4WtNew,WeaNewDate,WeaInput4Hrm,WeaInput4HrmNew,WeaInput4DepNew,WeaInput4ComNew,WeaNewSelect} from 'weaCom'

import {Button,Form} from 'antd'
const createForm = Form.create;
const FormItem = Form.Item;

import cloneDeep from 'lodash/cloneDeep'
import objectAssign from 'object-assign'

import PropTypes from 'react-router/lib/PropTypes'
import Immutable from 'immutable'
const is = Immutable.is;

let _this = null;

class ListDone extends React.Component {
//	static contextTypes = {
//      router: PropTypes.routerShape
//  }
    constructor(props) {
		super(props);
		_this = this;
    }
    componentDidMount() {
    	const {actions} = this.props;
    	actions.setNowRouterWfpath('listDone');
        actions.initDatas({method:"all"});
        actions.doSearch();
    }
    componentWillReceiveProps(nextProps) {
        const keyOld = this.props.location.key;
        const keyNew = nextProps.location.key;
        if(keyOld!==keyNew) {
            const {actions,isClearNowPageStatus} = this.props;
            actions.unmountClear(isClearNowPageStatus);
            actions.isClearNowPageStatus(false);

            actions.setNowRouterWfpath('listDone');
            actions.initDatas({method:"all"});
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
        	showSearchAd,tableCheck,searchParamsAd,sortParams,current,colSetVisible,colSetdatas,colSetKeys} = this.props;
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
                        hideSearchAd={()=> actions.setShowSearchAd(false)}
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
                        operates={operates && operates.toJS()}
                        pageSize={pageSize}
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
                </WeaNewTop>
                </WeaRightMenu>
                <Synergy pathname='/workflow/listDone' requestid="-1" />
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
        //const keyArr = theKey?theKey.split("_"):[];
        actions.setShowSearchAd(false);
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
                    actions.initDatas({method:"all"});
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
    	const {selectedRowKeys,actions} = this.props;
    	let btns = [];
        return btns
    }
    getRightMenu(){
    	const {selectedRowKeys,actions} = this.props;
    	let btns = [];
    	btns.push(<a onClick={()=>{actions.doSearch();actions.setShowSearchAd(false)}}><i className='icon-Right-menu--search' style={{marginRight:10,verticalAlign:'middle'}} />搜索</a>)
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

class MyErrorHandler extends React.Component {
    render(){
        const hasErrorMsg = this.props.error && this.props.error!=="";
        return (
            <WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
        );
    }
}

ListDone = WeaTools.tryCatch(React, MyErrorHandler, {error: ""})(ListDone);

ListDone = createForm({
	onFieldsChange(props, fields) {
    	let _fields = {...fields};
    	for(let k in fields){
    		if(fields[k].value.indexOf('_@_') >= 0){
    			let newValue =  fields[k].value.split('_@_');
	    		_fields[k].value = newValue[0];
    		}
    	}
        props.actions.saveOrderFields({...props.orderFields.toJS(), ...fields,..._fields});
    },
	mapPropsToFields(props) {
		return props.orderFields.toJS();
  	}
})(ListDone);

function mapStateToProps(state) {
	const {workflowlistDone} = state;
    return {
        title:workflowlistDone.get('title'),
        leftTree:workflowlistDone.get('leftTree'),
        leftTreeCount:workflowlistDone.get('leftTreeCount'),
        leftTreeCountType:workflowlistDone.get('leftTreeCountType'),
        topTab:workflowlistDone.get('topTab'),
        topTabCount:workflowlistDone.get('topTabCount'),
        datas:workflowlistDone.get('datas'),
        columns:workflowlistDone.get('columns'),
        count:workflowlistDone.get('count'),
        loading:workflowlistDone.get('loading'),
        operates:workflowlistDone.get('operates'),
        searchParams:workflowlistDone.get('searchParams'),
        searchParamsAd:workflowlistDone.get('searchParamsAd'),
        selectedRowKeys: workflowlistDone.get('selectedRowKeys'),
        orderFields:workflowlistDone.get('orderFields'),
        showSearchAd:workflowlistDone.get('showSearchAd'),
        selectedTreeKeys:workflowlistDone.get('selectedTreeKeys'),
        tableCheck:workflowlistDone.get('tableCheck'),
        isSpaForm:workflowlistDone.get('isSpaForm'),
        isClearNowPageStatus:workflowlistDone.get('isClearNowPageStatus'),
        sortParams:workflowlistDone.get('sortParams'),
        current:workflowlistDone.get('current'),
        colSetVisible:workflowlistDone.get('colSetVisible'),
        colSetdatas:workflowlistDone.get('colSetdatas'),
        colSetKeys:workflowlistDone.get('colSetKeys'),
        conditioninfo:workflowlistDone.get('conditioninfo'),
        pageAutoWrap:workflowlistDone.get('pageAutoWrap'),
        pageSize:workflowlistDone.get('pageSize'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ListAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDone);
