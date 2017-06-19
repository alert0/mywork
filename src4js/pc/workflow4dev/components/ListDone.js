import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ListAction from '../actions/list'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import {Synergy} from 'weaPortal';

import {WeaTable} from '../../coms/index'

const WeaTableAction = WeaTable.action;

import {
    WeaTop,
    WeaTab,
    WeaLeftTree,
    WeaLeftRightLayout,
    WeaSearchGroup,
    WeaRightMenu,
    WeaPopoverHrm
} from 'ecCom'


import {WeaErrorPage,WeaTools} from 'ecCom'

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
        if(window.location.pathname.indexOf('/spa/workflow/index') >= 0 && nextProps.title && document.title !== nextProps.title)
            document.title = nextProps.title;
    }
    shouldComponentUpdate(nextProps,nextState) {
        return !is(this.props.title,nextProps.title)||
        !is(this.props.leftTree,nextProps.leftTree)||
        !is(this.props.leftTreeCount,nextProps.leftTreeCount)||
        !is(this.props.leftTreeCountType,nextProps.leftTreeCountType)||
        !is(this.props.topTab,nextProps.topTab)||
        !is(this.props.topTabCount,nextProps.topTabCount)||
        !is(this.props.loading,nextProps.loading)||
        !is(this.props.operates,nextProps.operates)||
        !is(this.props.searchParams,nextProps.searchParams)||
        !is(this.props.searchParamsAd,nextProps.searchParamsAd)||
        !is(this.props.selectedTreeKeys,nextProps.selectedTreeKeys)||
        !is(this.props.orderFields,nextProps.orderFields)||
        !is(this.props.showSearchAd,nextProps.showSearchAd)||
        !is(this.props.comsWeaTable,nextProps.comsWeaTable)||
        !is(this.props.conditioninfo,nextProps.conditioninfo)||
        !is(this.props.isClearNowPageStatus,nextProps.isClearNowPageStatus);
    }
    componentWillUnmount(){
    	const {actions,isClearNowPageStatus} = this.props;
        actions.unmountClear(isClearNowPageStatus);
        actions.isClearNowPageStatus(false);
    }
    render() {
        let that = this;
        const isSingle = window.location.pathname.indexOf('/spa/workflow/index') >= 0;
        const {dataKey,loading,comsWeaTable,topTab,topTabCount,actions,title,searchParams,showSearchAd,searchParamsAd,showBatchSubmit,phrasesObj} = this.props;
        const tablekey = dataKey ? dataKey.split('_')[0] : 'init';
		const tableNow = comsWeaTable.get(tablekey);
		const loadingTable = tableNow.get('loading');
        return (
            <div>
            	{isSingle && <WeaPopoverHrm />}
            	<WeaRightMenu datas={this.getRightMenu()} onClick={this.onRightMenuClick.bind(this)}>
            	<WeaTop
                	title={title}
                	loading={loading || loadingTable}
                	icon={<i className='icon-portal-workflow' />}
                	iconBgcolor='#55D2D4'
                	buttons={this.getButtons()}
                	buttonSpace={10}
                	showDropIcon={true}
                	dropMenuDatas={this.getRightMenu()}
                	onDropMenuClick={this.onRightMenuClick.bind(this)}
                >
                <WeaLeftRightLayout defaultShowLeft={true} leftCom={this.getTree()} leftWidth={25}>
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
                    <WeaTable 
                    	sessionkey={dataKey}
                    	hasOrder={true}
                    	needScroll={true}
                    	/>
                </WeaLeftRightLayout>
                </WeaTop>
                </WeaRightMenu>
                <Synergy pathname='/workflow/listDone' requestid="-1" />
            </div>
        )
    }
    onRightMenuClick(key){
    	const { actions, dataKey } = this.props;
    	if(key == '0'){
    		actions.doSearch();
    		actions.setShowSearchAd(false)
    	}
    	if(key == '1'){
    		actions.setColSetVisible(dataKey,true);
    		actions.tableColSet(dataKey,true)
    	}
    }
    getRightMenu(){
    	let btns = [];
    	btns.push({
    		icon: <i className='icon-Right-menu--search'/>,
    		content:'搜索'
    	});
    	btns.push({
    		icon: <i className='icon-Right-menu-Custom'/>,
    		content:'显示定制列'
    	})
    	return btns
    }
    getSearchs() {
        const { conditioninfo } = this.props;
		let group = [];
		conditioninfo.toJS().map(c =>{
			let items = [];
			c.items.map(fields => {
				items.push({
	                com:(<FormItem
	                    label={`${fields.label}`}
	                    labelCol={{span: `${fields.labelcol}`}}
	                    wrapperCol={{span: `${fields.fieldcol}`}}>
	                        { WeaTools.switchComponent(this.props, fields.key, fields.domkey, fields )}
	                    </FormItem>),
	                colSpan:1
	            })
			});
			group.push(<WeaSearchGroup needTigger={true} title={c.title} showGroup={c.defaultshow} items={items}/>)
		});
		return group
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
        const {leftTree,leftTreeCount,leftTreeCountType,actions,topTab,searchParams,selectedTreeKeys} = this.props;
        return (
            <WeaLeftTree
                datas={leftTree && leftTree.toJS()}
                counts={leftTreeCount && leftTreeCount.toJS()}
                countsType={leftTreeCountType && leftTreeCountType.toJS()}
                selectedKeys={selectedTreeKeys && selectedTreeKeys.toJS()}
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
                	let workflowidShowName = '';
                	let workflowtypeShowName = '';
                	leftTree && leftTree.map(l=>{
                		if(l.get('domid') == key) workflowtypeShowName = l.get('name');
                		l.get('childs') && l.get('childs').map(c=>{
                			if(c.get('domid') == key) workflowidShowName = c.get('name');
                		})
                	})
                	const fieldsObj = {
                		workflowid:{name:'workflowid',value:workflowid,valueSpan:workflowidShowName},
                		workflowtype:{name:'workflowtype',value:workflowtype,valueSpan:workflowtypeShowName},
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
        props.actions.saveOrderFields({...props.orderFields.toJS(), ...fields});
    },
	mapPropsToFields(props) {
		return props.orderFields.toJS();
  	}
})(ListDone);

function mapStateToProps(state) {
	const {workflowlistDone,comsWeaTable} = state;
    return {
    	dataKey: workflowlistDone.get('dataKey'),
    	loading: workflowlistDone.get('loading'),
        title: workflowlistDone.get('title'),
		leftTree: workflowlistDone.get('leftTree'),
		leftTreeCount: workflowlistDone.get('leftTreeCount'),
		leftTreeCountType: workflowlistDone.get('leftTreeCountType'),
		topTab: workflowlistDone.get('topTab'),
		topTabCount: workflowlistDone.get('topTabCount'),
		searchParams: workflowlistDone.get('searchParams'),
		searchParamsAd: workflowlistDone.get('searchParamsAd'),
		orderFields: workflowlistDone.get('orderFields'),
		showSearchAd: workflowlistDone.get('showSearchAd'),
		selectedTreeKeys: workflowlistDone.get('selectedTreeKeys'),
		isClearNowPageStatus: workflowlistDone.get('isClearNowPageStatus'),
		sortParams: workflowlistDone.get('sortParams'),
		conditioninfo: workflowlistDone.get('conditioninfo'),
		showBatchSubmit: workflowlistDone.get('showBatchSubmit'),
		phrasesObj: workflowlistDone.get('phrasesObj'),
		sharearg: workflowlistDone.get('sharearg'),
        //table
        comsWeaTable, //绑定整个table
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...ListAction,...WeaTableAction}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDone);
