import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AddAction from '../actions/add'


import {Row,Col,Input,Tabs,Button,Alert,Spin,Icon} from 'antd'

import {WeaTop, WeaTab, WeaTools} from 'ecCom'
import {Synergy} from 'weaPortal';

const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

import MLinkCard from './add/MLinkCard';
import OLinkCard from './add/OLinkCard';
import UsedToDoList from './add/UsedToDoList';
import Immutable from 'immutable';
const is = Immutable.is;

let sb = '';
class Add extends React.Component {
	constructor(props) {
		super(props);
		sb = this;
	}
	componentDidMount() {
		const {add,actions} = this.props;
		actions.initDatas({"needall":"1","tabkey":add.get("tabkey")});
		this.scrollheigth();
	}
	componentWillReceiveProps(nextProps) {
        const keyOld = this.props.location.key;
        const keyNew = nextProps.location.key;
        if(keyOld!==keyNew) {
			const {add,actions} = this.props;
			const {mulitcol,isAbc} = add;
			const {ls} = WeaTools;
			ls.set('wf-add-mulitcol',mulitcol);
			ls.set('wf-add-isAbc',isAbc);
			actions.setSearchValue("");

			actions.initDatas({"needall":"1","tabkey":add.get("tabkey")});
			this.scrollheigth();
        }
		if(window.location.pathname.indexOf('/spa/workflow/index') >= 0 && nextProps.add.has("wftypes") && document.title !== "新建流程")
            document.title = "新建流程";
    }
	shouldComponentUpdate(nextProps,nextState) {
        return !is(this.props.add,nextProps.add);
    }
	componentDidUpdate(){
		this.scrollheigth();
	}
	componentWillUnmount(){
		//记录上次打开的模式
		const {add,actions} = this.props;
		const {mulitcol,isAbc} = add;
		const {ls} = WeaTools;
		ls.set('wf-add-mulitcol',mulitcol);
		ls.set('wf-add-isAbc',isAbc);
		actions.setSearchValue("");
	}
	scrollheigth(){
    	let top = jQuery(".wea-wf-add-content").offset() ? (jQuery(".wea-wf-add-content").offset().top ? jQuery(".wea-wf-add-content").offset().top : 0) : 0;
        let scrollheigth = document.documentElement.clientHeight - top;
        jQuery(".wea-wf-add-content").height(scrollheigth-30);
    }
	goABC(letter){
		const {actions} = this.props;
		actions.setAbcSelected(letter);
	  	let topheight = jQuery('#'+letter).position().top;
	  	jQuery(".wea-wf-add-content").scrollTop(topheight);
	}
	render() {
		const {add,actions} = this.props;
		const wftypes = add.get("wftypes");
		const typesShow = add.get("typesShow");
		const typesCols = add.get("typesCols");
		const usedBeans = add.get("usedBeans");
		const value = add.get("value");
		const tabkey = add.get("tabkey");
		const mulitcol = add.get("mulitcol");
		const isAbc = add.get("isAbc");
		const loading = add.get("loading");
		const importDataShow = add.get("importDataShow");
		const abcBtns = add.get("abcBtns");
		const curOperWfid = add.get("curOperWfid");
		const showBeagenters = add.get("showBeagenters");
		const showImportWf = add.get("showImportWf");
		const commonuse = add.get('commonuse');
		const user = add.get('user');
		const tabDatas = [
			{title:'全部流程',key:"1"},
           	{title:'我的收藏',key:"2"}
		];
		
		if(commonuse == '1') tabDatas.push({title:'常用流程',key:"3"});
		return (
		   	<div className="wf-create-main">
			   	<WeaTop loading={loading} icon={<i className='icon-portal-workflow' />} iconBgcolor='#55D2D4' title='新建流程' buttons={this.getButtons()} hideButtons={this.getHideButtons()} showDropIcon={false}/>
				<WeaTab
		            onSearchChange={this.doSearch.bind(this)}
		            selectedKey={tabkey}
		            datas={tabDatas}
                    searchType={['base']}
		            keyParam='key'
		            onChange={this.changeTab.bind(this)} >
				</WeaTab>
				<div className='wea-wf-add-content'>
					{isAbc && tabkey !== "3" && (
						<div className="abcbtn-group">
						{
							abcBtns.map(abcBtn => <Button className={abcBtn.get("selected") ? 'btn-selected' : ''} type='ghost' key={abcBtn.get("letter")}
								disabled={abcBtn.get("disabled")} onClick={this.goABC.bind(this,abcBtn.get("letter"))}>{abcBtn.get("letter")}</Button>)
						}
						</div>)
					}
	           		{tabkey == "3" ? (
	           			usedBeans.size == 0 && !loading ? <Alert message="提示" description="数据为空" type="info" showIcon /> :
						   <UsedToDoList user={user} wfbeans={usedBeans} importDataShow={importDataShow} curOperWfid={curOperWfid} showBeagenters={showBeagenters} showImportWf={showImportWf} actions={actions} />
	           			):(
	           			typesShow.size == 0 && !loading ? <Alert message="提示" description="数据为空" type="info" showIcon /> :(
			           		mulitcol ?
		           			<Row>
		           				{typesCols.map(c=>{
		           					return <Col span={24 / typesCols.size} style={{padding:'0 10px'}}>
										<MLinkCard user={user} types={c} mulitcol={mulitcol} importDataShow={importDataShow} isAbc={isAbc} wftypes={wftypes} curOperWfid={curOperWfid} showBeagenters={showBeagenters} showImportWf={showImportWf} actions={actions}/>
									</Col>
		           				})}
		           			</Row>
							:
							<Row>
								<Col span="24" style={{paddingLeft:10,paddingRight:10}}>
									<OLinkCard user={user} types={typesShow} mulitcol={mulitcol} importDataShow={importDataShow} isAbc={isAbc} wftypes={wftypes} curOperWfid={curOperWfid} showBeagenters={showBeagenters} showImportWf={showImportWf} actions={actions}/>
								</Col>
							</Row>)
	           			)
	           		}
				</div>
		       	<form id="subform" name="subform" method="get" action="RequestType.jsp" target="_blank">
		       		<input type="hidden" id="workflowid" name="workflowid" />
					<input type="hidden" id="isagent" name="isagent"/>
					<input type="hidden" id="beagenter" name="beagenter"/>
					<input type="hidden" id="f_weaver_belongto_userid" name="f_weaver_belongto_userid"/>
		    	</form>
		    	<Synergy pathname='/workflow/add' requestid="-1" />
            </div>
		)
	}
	getButtons(){
		const {add} = this.props;
		const isAbc = add.get("isAbc");
		const mulitcol = add.get("mulitcol");
		const tabkey = add.get("tabkey");
		return [
		 	(tabkey != '3' && <i className={"icon-button icon-New-Flow-Letter" + (isAbc ? ' wea-new-top-btn-clicked' : '')} onClick={this.showABC.bind(this)}/>),
		 	(tabkey != '3' && <i className={"icon-button icon-New-Flow-1" + (mulitcol ? ' wea-new-top-btn-clicked' : '')} onClick={this.showMulitcol.bind(this)}/>)
		]
	}
	getHideButtons() {
        return [
            (<a href="javascript:void(0)" onClick={()=>{}}>第一个菜单项</a>),
            (<a href="javascript:void(0)" onClick={()=>{}}>第二个菜单项</a>)
        ]
    }
	showMulitcol(){
		const {add,actions} = this.props;
		const mulitcol = add.get("mulitcol");
		actions.setMulitcol(!mulitcol);
		jQuery(".wea-wf-add-content").scrollTop(0);
	}
	showABC(){
		const {add,actions} = this.props;
		const isAbc = add.get("isAbc");
		actions.setIsAbc(!isAbc);
		jQuery(".wea-wf-add-content").scrollTop(0);
	}
	changeTab(k){
		const {actions} = this.props;
		actions.changeTab(k);
		jQuery(".wea-wf-add-content").scrollTop(0);
	}
	doSearch(v) {
		const {actions} = this.props;
		actions.setSearchValue(v);
		jQuery(".wea-wf-add-content").scrollTop(0);
	}
}
jQuery(window).resize(function() {
    sb && sb.props && sb.props.actions && sb.props.actions.setUpdate();
});

function mapStateToProps(state) {
    return {
        add: state.workflowAdd
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AddAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Add);