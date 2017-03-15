import {WeaNewTop,WeaTab,WeaNewTableOld,WeaNewTree,WeaLayoutR11,WeaSearchGroup,WeaRightMenu} from 'weaCom'
import {WeaInput,WeaInput4ProjectNew,WeaInput4DocsNew,WeaInput4CustomNew,WeaInput4WfNew,WeaInput4WtNew,WeaNewDate,WeaInput4Hrm,WeaInput4HrmNew,WeaInput4DepNew,WeaInput4ComNew,WeaNewSelect} from 'weaCom'
import {Row, Col, Icon, Pagination, Menu, Form, Button,Spin} from 'antd';

import objectAssign from 'object-assign'

import Immutable from 'immutable'

import SignListItem from './SignListItem'
const is = Immutable.is;

const createForm = Form.create;
const FormItem = Form.Item;

let sb = ''
class Sign extends React.Component {
	constructor(props) {
		super(props);
        sb = this;
    }
	shouldComponentUpdate(nextProps,nextState) {
        return  !is(this.props.markInfo,nextProps.markInfo)||
	        !is(this.props.logList,nextProps.logList)||
	        !is(this.props.isShowSignInput,nextProps.isShowSignInput)||
	        !is(this.props.logListTabKey,nextProps.logListTabKey)||
	        !is(this.props.signFields,nextProps.signFields)||
	        !is(this.props.showSearchDrop,nextProps.showSearchDrop)||
	        !is(this.props.isShowUserheadimg,nextProps.isShowUserheadimg)||
	        this.props.showuserlogids !== nextProps.showuserlogids||
	        this.props.reqRequestId !== nextProps.reqRequestId||
	        this.props.pagesize !== nextProps.pagesize||
	        this.props.isLoadingLog !== nextProps.isLoadingLog;
    }
	componentDidMount() {
		const {actions,ismanagePage} = this.props;
    	actions.setLoglistTabKey('1');
    	if(ismanagePage == '1'){
			var _ue = UEUtil.initRemark('remark', false);
			bindRemark(_ue);	
    	}
    }
	componentWillUnmount(){
		const {actions} = this.props;
		actions.saveSignFields({});
		actions.setShowSearchDrop(false);
	}
	renderTitle(text,arr){
		return 
	}
    render() {
    	const {actions,params,signinputinfo,logList,current,total,pagesize,forward,showuserlogids,
    		logListTabKey,requestLogParams,ismanagePage,isShowSignInput,isShowUserheadimg,signFields,showSearchDrop,reqRequestId,isLoadingLog} = this.props;
    	const markInfo = ismanagePage == '1' ? signinputinfo.toJS():'';
    	let tabDatas = [{title:'流转意见',key:"1"}];
    	const isRelatedTome = requestLogParams.get('isRelatedTome');
    	const hasMainWfRight = requestLogParams.get('hasMainWfRight');
    	const hasChildWfRight = requestLogParams.get('hasChildWfRight');
    	const hasParallelWfRight = requestLogParams.get('hasParallelWfRight');
    	const isReadParallel  = requestLogParams.get('isReadParallel');
    	const isHideInput = markInfo.isHideInput;
    	const isSignMustInput = markInfo.isSignMustInput;
    	const requestid = params.get('requestid');
    	const workflowid = params.get('workflowid');
    	const signListType = params.get('signListType');
    	
    	//设置主子流程名称连接信息
    	let signshowname = '';
	  	logListTabKey > 2 && requestLogParams.get('allrequestInfos').filter(reqinfo => {
			if(reqinfo.get('requestid') == reqRequestId){
				signshowname = reqinfo.get('signshowname');
			}
		});
		
		let mainWf = hasMainWfRight ? requestLogParams.get('allrequestInfos').filter(w=>w.get('type') == 'main') : '';
		let childWf = hasChildWfRight ? requestLogParams.get('allrequestInfos').filter(w=>w.get('type') == 'sub') : '';
		let parallelWf = hasParallelWfRight ?　requestLogParams.get('allrequestInfos').filter(w=>w.get('type') == 'parallel') : '';
		
		isRelatedTome && tabDatas.push({title:'与我相关',key:"2"});
		mainWf && tabDatas.push({title:<span>主流程意见 <i className='icon-top-Arrow' /></span>,dropMenu:mainWf.toJS(),key:"3",});
		childWf && tabDatas.push({title:<span>子流程意见 <i className='icon-top-Arrow' /></span>,dropMenu:childWf.toJS(),key:"4"});
		parallelWf && '1' == isReadParallel && tabDatas.push({title:<span>平行流程意见 <i className='icon-top-Arrow' /></span>,dropMenu:parallelWf.toJS(),key:"5"});
		
		const isshowsigninputdiv = ismanagePage == '1' && isHideInput == '0';
		const defaultshowsigninput = isshowsigninputdiv && markInfo.remark != '' && markInfo.remark != null;
		let listShow = [];
		logList && logList.forEach(obj=>{
			listShow.push(<SignListItem data={obj} isShowUserheadimg={isShowUserheadimg} actions={actions} forward={forward} requestid={requestid} workflowid={workflowid} showuserlogids={showuserlogids}/>);
		});
        return (
            <div className='wea-workflow-req-sign'>
            	<div>
        			<div style={{'height':'100%','display':isshowsigninputdiv?'block':'none','margin-right':(defaultshowsigninput || isShowSignInput )?'0px':'-1px'}} >
	            		<div id="remarkShadowDiv" className='wea-workflow-req-sign-input' style={{"display":(defaultshowsigninput || isShowSignInput )?"none":"block","border-left":isSignMustInput == '1'?"2px solid #fe4e4c":'1px solid #d0d0d0'}} onClick={this.initremark.bind(this)}>
		            		<i className="icon-xxx-form-Opinion" style={{marginRight:10}}/>{'签字意见' + (markInfo.tempbeagenter != markInfo.fileuserid ? `（您正在代理${markInfo.tempbeagentername}处理）` : '')}
		            	</div>
		            	<div style={{"display":(defaultshowsigninput || isShowSignInput)?"block":"none"}} className='remarkDiv'>
	 	            		<textarea name="remark" id="remark" style={{"width":"100%","height":"140px","margin":"0","resize": "none","color":"#a2a2a2","overflow":"hidden","color":"#c7c7c7"}}>
	 	            			{markInfo.remark}
	 	            		</textarea>
		            	</div>
		            	<div id="signrighttool" style={{"display":"none"}}>
		            		 <input type="hidden" id="signdocids" name="signdocids" value={markInfo.signdocids}/>
		            		 <input type="hidden" id="signworkflowids"name="signworkflowids" value={markInfo.signworkflowids}/>
		            		 <input type="hidden" name="remarkLocation" id="remarkLocation" value={markInfo.remarkLocation}></input>
		            		 <div class="signDoc_span" id="signDocCount" ></div> 
        		             <input className="InputStyle" type="hidden" id="field-annexupload" name="field-annexupload" value={markInfo.annexdocids}/>
                             <input type="hidden" id="field_annexupload_del_id" value=""/>
                             <input type="hidden" name="field-annexupload-name" id="field-annexupload-name" value={markInfo.fieldannexuploadname}/>
                             <input type="hidden" name="field-annexupload-count" id="field-annexupload-count" value=""/>
                             <input type="hidden" name="field-annexupload-request" id="field-annexupload-request" value={markInfo.requestid}/>
                             <input type="hidden" name="field-cancle" id="field-cancle" value=" 删除 "/>
                             <input type="hidden" name="field-add-name" id="field-add-name" value="点击添加附件 "/>
                             <input type="hidden" name='annexmainId' id='annexmainId' value={markInfo.annexmainId}/>
                             <input type="hidden" name='annexsubId' id='annexsubId' value={markInfo.annexsubId}/>
                             <input type="hidden" name='annexsecId' id='annexsecId' value={markInfo.annexsecId}/>
                             <input type="hidden" name='fileuserid' id='fileuserid' value={markInfo.fileuserid}/>
                             <input type="hidden" name='fileloginyype' id='fileloginyype' value={markInfo.fileloginyype}/>
                             <input type="hidden" name='annexmaxUploadImageSize' id='annexmaxUploadImageSize' value={markInfo.annexmaxUploadImageSize}/>
                             <span id="remarkSpan"></span>
		            	</div>
	            	</div>

	            	<WeaTab 
	                    buttons={this.getTabButtons()}
	                    datas={tabDatas} 
	                    selectedKey={logListTabKey}
	                    keyParam="key"  //主键
	                    searchType={['drop']}
	                    countParam='count'
	                    hasDropMenu={true}
	                    showSearchDrop={showSearchDrop}
	                    dropIcon={<i className='icon-search-search' style={{color:'#77da88'}} onClick={()=>actions.setShowSearchDrop(true)}/>}
	                    searchsDrop={<Form horizontal>{this.getSearchs()}</Form>}
	                    buttonsDrop={this.getTabButtonsDrop()}
	                    setShowSearchDrop={bool => actions.setShowSearchDrop(bool)}
	                    onChange={this.changeData.bind(this)} />
	                {logListTabKey > 2 &&  logListTabKey != reqRequestId  &&
		                <div className='wea-workflow-main-sub-req'>
		                	<span dangerouslySetInnerHTML={{__html:signshowname}}></span>
		                </div>
	                }
	            	<div className='wea-workflow-req-sign-list'>
		            	{listShow}
		            	{listShow && !signListType && listShow.length > 0 && <Pagination defaultCurrent={1} showQuickJumper 
		            		pageSize={pagesize}
		            		onChange={this.onPageChange.bind(this)}
		            		current={current}
		            		total={total}
		            		showSizeChanger
		            		pageSizeOptions={['10', '20', '50', '100']}
		            		onShowSizeChange={this.onPageSizeChange.bind(this)}
		            		showTotal={total => `共 ${total} 条`}
		            	/>}
		            	{listShow && !isLoadingLog && listShow.length == 0 &&
		            		<div className='ant-table-placeholder' style={{borderBottom:0}}>暂时没有数据</div>
		            	}
		            	{isLoadingLog && 
		            		<div className='ant-table-placeholder' style={{borderBottom:0}}>
		            			<Spin tip="正在读取数据..."></Spin>
		            		</div>
		            	}
		            </div>
            	</div>
            </div>
        )
    }
    onPageChange(n){
    	const {actions,logListTabKey} = this.props;
    	if(logListTabKey < 3){
	    	if(typeof this.props.onChange == 'function') {
	    		this.props.onChange(n);
	    	}
    	}else{
    		actions.loadRefReqSignInfo({pgnumber:n});
    	}
    }
    onPageSizeChange(current, pageSize){
    	if(typeof this.props.onPageSizeChange == 'function') 
    		this.props.onPageSizeChange(pageSize);
    }
    getTabButtons(){
    	const {isShowUserheadimg,actions} = this.props;
    	return [(
    		<i className='icon-search-Customer' style={{color:isShowUserheadimg?'#7287f2':''}} onClick={()=>actions.updateUserTxStatus(!isShowUserheadimg)}/>
    	),(<span style={{fontSize:16,color:'#d6d6d6'}}>|</span>)]
    }
    changeData(key,selecttabkey){
    	const {actions,userId,requestLogParams,pagesize} = this.props;
    	//计算tabkey
    	let tmpkey = key;
    	requestLogParams.get('allrequestInfos').filter(reqinfo =>{
    		if(reqinfo.get('requestid') == key){
    			if('main' == reqinfo.get('type')) tmpkey = 3;
    			if('sub'  == reqinfo.get('type')) tmpkey = 4;
    			if('parallel' ==reqinfo.get('type')) tmpkey = 5;
    		}   		
    	});
    	actions.setLoglistTabKey(tmpkey,key);
    	let params = {pgnumber:1,maxrequestlogid:0};
    	if(key == '2') params.atmet = userId;
    	if(key == '1') params.atmet = '';
    	if(key == '1' || key == '2'){
    		actions.setlogParams(params);
    	}else{
    		requestLogParams.get('allrequestInfos').filter(reqinfo => {
    			if(reqinfo.get('requestid') == key){
    				params.requestid  = reqinfo.get('requestid');
    				params.workflowid = reqinfo.get('relwfid');
    				params.requestLogParams = JSON.stringify({
    					viewLogIds:reqinfo.get('relviewlogs'),
    					wfsignlddtcnt:requestLogParams.get('wfsignlddtcnt')
    				});
    				params.pgnumber = 1;
    				params.actiontype = 'requestLog';
    				params.firstload = false;
    				params.maxrequestlogid = 0;
    				params.loadmethod = 'split';
    				params.logpagesize = pagesize;
    				actions.loadRefReqSignInfo(params);
    			}
    		});
    	}
    }
    
    initremark(){
    	const {actions} = this.props;
    	actions.controlSignInput(true);
    	var _ue = UE.getEditor('remark');
        _ue.focus(true);
    }
    getTabButtonsDrop(){
    	const {actions} = this.props;
        return [
            (<Button type="primary" onClick={()=>{actions.clearLogData();actions.setMarkInfo();actions.setShowSearchDrop(false)}}>搜索</Button>),
            (<Button type="ghost" onClick={()=>{actions.saveSignFields({})}}>重置</Button>),
            (<Button type="ghost" onClick={()=>{actions.setShowSearchDrop(false)}}>取消</Button>)
        ]
    }
    getSearchs() {
    	const {form, requestLogParams} = this.props;
        const {getFieldProps} = this.props.form;
        const nodes = [{value:'',name:''}];
        requestLogParams && requestLogParams.get('viewnodes') && requestLogParams.get('viewnodes').map(n => {
        	nodes.push({value:n.get('id'),name:n.get('name')});
        });
        let items = new Array();
        items.push({
            com:(<FormItem
            label="操作者"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
                <WeaInput4HrmNew {...getFieldProps("operatorid")} />
            </FormItem>),
            colSpan:1
        });
        items.push({
            com:(<FormItem
            label="部门"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
                <WeaInput4DepNew {...getFieldProps("deptid")} />
            </FormItem>),
            colSpan:1
        });
        items.push({
            com:(<FormItem
            label="分部"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
                <WeaInput4ComNew {...getFieldProps("subcomid")} />
            </FormItem>),
            colSpan:1
        });
       	items.push({
            com:(<FormItem
            label="意见"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
                <WeaInput {...getFieldProps("content")} />
            </FormItem>),
            colSpan:1
        });
        items.push({
            com:(<FormItem
            label="节点"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
                <WeaNewSelect 
                    datas={nodes} 
                    {...getFieldProps("nodename")} />
            </FormItem>),
            colSpan:1
        });
        items.push({
            com:(<FormItem
            label="操作日期"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
            	<WeaNewDate {...getFieldProps("createdateselect",{
                	initialValue: '0'
                })} datas={ [
		            {value: '0',selected: true,name: '全部'},
		            {value: '1',selected: false,name: '今天'},
		            {value: '2',selected: false,name: '本周'},
		            {value: '3',selected: false,name: '本月'},
		            {value: '4',selected: false,name: '本季'},
		            {value: '5',selected: false,name: '本年'},
		            {value: '6',selected: false,name: '指定日期范围'}
		        ]} form={this.props.form} domkey={["createdateselect","createdatefrom","createdateto"]} />
            </FormItem>), //创建日期    createdateselect    ==6范围   createdatefrom---createdateto
            colSpan:1
        });
        return [<WeaSearchGroup title="查询条件" showGroup={true} items={items}/>]
    }
}

Sign = createForm({
	onFieldsChange(props, fields){
		const orderFields = objectAssign({},props.signFields.toJS(),fields);
		props.actions.saveSignFields(orderFields);
	},
	mapPropsToFields(props) {
		return props.signFields.toJS();
  	}
})(Sign);

export default Sign