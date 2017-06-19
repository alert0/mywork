import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ReqAction from '../actions/req'
import * as ReqFormAction from '../actions/reqForm'
import * as ReqLogListAction from '../actions/reqLogList'
import * as DocUtil from '../util/docUtil'

import {Button,Table,Spin,Popover } from 'antd'
import MainLayout from './form/layout/MainLayout'
import Sign from './form/sign/Sign'
import FormSign from './form/sign/FormSign'
import ImgZoom from './form/sign/ImgZoom'
import WfStatus from './form/WfStatus'
import Resources from './form/Resources'
import Share from './form/Share'
import Forward from './form/forward/Forward'
import ReqErrorMsg from './form/ReqErrorMsg'


import {WeaReqTop,WeaRightMenu} from 'ecCom'
import {Synergy} from 'weaPortal';
import objectAssign from 'object-assign'
import PropTypes from 'react-router/lib/PropTypes'
import Immutable from 'immutable'
const is = Immutable.is;

import {WeaErrorPage,WeaTools,WeaPopoverHrm} from 'ecCom'

class Req extends React.Component {
    static contextTypes = {
        router: PropTypes.routerShape
    }
    constructor(props) {
        super(props);
        const {actions} = props;
        actions.initFormLayout(props.location.query);
    }
    resetHeight(){
        let height = jQuery(".wea-new-top-req-content").height() ? jQuery(".wea-new-top-req-content").height() : 500;
        jQuery(".req-workflow-map").height(height-5);
    }
    componentWillReceiveProps(nextProps,nextState){
        if(window.location.pathname.indexOf('/spa/workflow/index') >= 0 && nextProps.mainData && nextProps.mainData.getIn(['field-1','value']) && document.title !== nextProps.mainData.getIn(['field-1','value']))
            document.title = nextProps.mainData.getIn(['field-1','value'])
    }
    componentDidMount() {
        const {actions,isShowSignInput,reqIsReload,params} = this.props;
        this.resetHeight()
        actions.reqIsSubmit(false);
        actions.reqIsReload(false);
        actions.setShowUserlogid('');
        const that = this;

        //滚动加载
        jQuery('.wea-new-top-req-content').scroll(function(){
            formImgLazyLoad(jQuery('.wea-new-top-req-content'));        //图片懒加载
            const {logParams,isLoadingLog,logCount,logList,params} = that.props;
            const signListType = params.get('signListType');
            const top =jQuery(this).scrollTop();
            if(signListType){
                const windowheight = jQuery('.wea-new-top-req-content').height();
                const bodyheight = jQuery('.wea-popover-hrm-relative-parent').height();
                const pgnumber = logParams.get('pgnumber');
                //无限滚动加载
                //console.log("bodyheight",bodyheight,"top",top,"windowheight",windowheight);
                const canLoad = (bodyheight - (top + windowheight)) < 200;
                if(canLoad && !isLoadingLog && logList.size < logCount){
                    actions.scrollLoadSign({pgnumber:parseInt(pgnumber)+1,firstload:false,maxrequestlogid:logParams.get('maxrequestlogid')});
                }
            }
            //滚动时隐藏签字意见的下拉列
            jQuery('#edui_fixedlayer>div').css('display','none');
            jQuery('#remark_div').find('#_signinputphraseblock').css('display','none');
            jQuery('#remark_div').find('.filtercontainer').css('display','none');
        });
    }
    // componentDidUpdate(){
    //  const {reqIsSubmit,reqIsReload,actions,requestid,pathBack} = this.props;
    //  const {router} = this.context;
    //  this.resetHeight()
    //  if(reqIsSubmit){
    //      //window.opener.reLoad();
    //      try{
    //          window.opener._table.reLoad();
    //      }catch(e){}
    //      try{
    //          //刷新门户流程列表
    //          jQuery(window.opener.document).find('#btnWfCenterReload').click();
    //      }catch(e){}

    //      window.close();
    //      //router.push(`/main/workflow/${pathBack}`);
    //  }

    //  if(reqIsReload){
    //      actions.initFormLayout(requestid);
    //      actions.reqIsReload(false);
    //  }
    // }
    shouldComponentUpdate(nextProps,nextState) {
        return this.props.loading!==nextProps.loading||
        !is(this.props.comsWeaTable,nextProps.comsWeaTable)||
        !is(this.props.params,nextProps.params)||
        !is(this.props.submitParams, nextProps.submitParams)||
        !is(this.props.reqTabKey,nextProps.reqTabKey)||
        !is(this.props.wfStatus,nextProps.wfStatus)||
        !is(this.props.logList,nextProps.logList)||
        !is(this.props.logListTabKey,nextProps.logListTabKey)||
        !is(this.props.logCount,nextProps.logCount)||
        !is(this.props.resourcesTabKey,nextProps.resourcesTabKey)||
        !is(this.props.resourcesKey,nextProps.resourcesKey)||
        !is(this.props.rightMenu,nextProps.rightMenu)||
        !is(this.props.reqIsSubmit,nextProps.reqIsSubmit)||
        !is(this.props.reqIsReload,nextProps.reqIsReload)||
        !is(this.props.isShowSignInput,nextProps.isShowSignInput)||
        this.props.reqsubmiterrormsghtml !== nextProps.reqsubmiterrormsghtml||
        !is(this.props.rightMenuStatus,nextProps.rightMenuStatus)||
        this.props.signFields !== nextProps.signFields||
        this.props.showBackToE8 !== nextProps.showBackToE8||
        this.props.showSearchDrop !== nextProps.showSearchDrop||
        !is(this.props.isShowUserheadimg,nextProps.isShowUserheadimg)||
        //表单内容相关
        !is(this.props.mainData,nextProps.mainData)||
        !is(this.props.detailData,nextProps.detailData)||
        !is(this.props.variableArea,nextProps.variableArea)||
        this.props.conf.size !== nextProps.conf.size||      //conf判断size即可，同时layout布局判断放在conf后面，基本上conf存在变化直接返回true
        !is(this.props.layout, nextProps.layout)||
        //性能测试
        this.props.reqLoadDuration !== nextProps.reqLoadDuration ||
        this.props.jsLoadDuration !== nextProps.jsLoadDuration ||
        this.props.apiDuration !== nextProps.apiDuration ||
        this.props.dispatchDuration !== nextProps.dispatchDuration ||

        this.props.showuserlogids !== nextProps.showuserlogids||
        this.props.reqRequestId !== nextProps.reqRequestId||
        this.props.isLoadingLog !== nextProps.isLoadingLog;
    }

    componentWillUnmount() {
        const {actions} = this.props;
        actions.clearForm();
        actions.setReqTabKey('1');
    }
    render() {
        const {comsWeaTable,reqLoadDuration,jsLoadDuration,apiDuration,dispatchDuration,
            signFields,showSearchDrop,params,submitParams,layout,loading,logList,location,logCount,wfStatus,actions,logParams,
            resourcesTabKey,resourcesKey,reqTabKey,logListTabKey,isShowSignInput,initSignInput,
            isShowUserheadimg,reqsubmiterrormsghtml,rightMenu,rightMenuStatus,showBackToE8,showuserlogids,reqRequestId,relLogParams,isLoadingLog} = this.props;
        const {requestid} = location.query;
        const hasInitLayout = layout.size > 0;
        const titleName = params?params.get("titlename"):"";
        const isshared = params?params.get("isshared"):"";
        const userId = params?params.get("f_weaver_belongto_userid"):"";
        const requestType = params?params.get('requestType'):'';
        const markInfo = params.get("markInfo");
        const workflowid = params?params.get("workflowid"):"";
        const isHideArea = params?params.get("isHideArea"):"";
        const isWorkflowDoc = params?params.get("isWorkflowDoc"):false;
        const signatureAttributesStr = params?params.get("signatureAttributesStr"):"";
        const signatureSecretKey = params?params.get("signatureSecretKey"):"";
        
        const requestLogParams = Immutable.fromJS(logParams.get('requestLogParams') ? JSON.parse(logParams.get('requestLogParams')) : {});
        const forward = rightMenu?rightMenu.get('forward'):'';
        const current = logListTabKey > 2 ? (relLogParams.get('pgnumber') ? relLogParams.get('pgnumber') :1):(logParams.get('pgnumber') ? logParams.get('pgnumber') : 1 );
        const conf = this.props.conf;
        const signInputInForm = conf && conf.hasIn(["cellInfo", "fieldCellInfo", "-4"]) && conf.getIn(["tableInfo", "main", "fieldinfomap", "-4", "viewattr"]) >=1 ;
        let tabDatas = [
            {title:'流程表单',key:"1"},
            {title:'流程图',key:"2"},
            {title:'流程状态',key:"3"},
            {title:'相关资源',key:"4"}
        ];
        if(requestid > 0 && isshared && isshared == '1' && false){
            tabDatas.push({title:'流程共享',key:"5"})
        }
        isWorkflowDoc && tabDatas.push({title:"正文",key:"6"});
        //新分页需要key
        const tablekey = resourcesKey ? resourcesKey.split('_')[0] : 'init';
		const tableNow = comsWeaTable.get(tablekey);
		const loadingTable = tableNow.get('loading');
		
		const forwarParams = objectAssign({},{
        	signatureAttributesStr:signatureAttributesStr,
        	signatureSecretKey:signatureSecretKey,
        	requestType:requestType,
        	fromform:true,
        	requestid:requestid,
        },rightMenuStatus.toJS());
        return (
            <div>
                <WeaRightMenu datas={this.getRightMenu()} onClick={this.onRightMenuClick.bind(this)}>
                <WeaReqTop
                    title={<div dangerouslySetInnerHTML={{__html: titleName}} />}
                    loading={loading || loadingTable}
                    icon={<i className='icon-portal-workflow' />}
                    iconBgcolor='#55D2D4'
                    buttons={this.getButtons()}
                    tabDatas={tabDatas}
                    selectedKey={reqTabKey}
                    onChange={this.changeData.bind(this)}
                    showDropIcon={true}
                    dropMenuDatas={this.getRightMenu()}
                    onDropMenuClick={this.onRightMenuClick.bind(this)}
                >
                    <WeaPopoverHrm>
                        <div className='wea-req-workflow-wrapper'>
                            {reqTabKey == '1' && reqsubmiterrormsghtml &&
                                <ReqErrorMsg reqsubmiterrormsghtml={reqsubmiterrormsghtml}/>
                            }
                            <div className='wea-req-workflow-form' style={{display:reqTabKey == '1' ? 'block' : 'none',margin:"0 auto",marginBottom:'20px'}}>
                                {hasInitLayout && <MainLayout
                                    actions={actions}
                                    params={params}
                                    submitParams={submitParams}
                                    symbol="main"
                                    layout={layout}
                                    conf={this.props.conf}
                                    mainData={this.props.mainData}
                                    detailData={this.props.detailData}  
                                    variableArea={this.props.variableArea} />
                                }
                            </div>
                            <input type="hidden" id="e9form_review" value='1'/>
                            {!signInputInForm && 
	                            <div style={{display:reqTabKey == '1' ? 'block' : 'none'}}>
	                            	{requestType > 0 && markInfo && markInfo.get('hasLoadMarkInfo') && <FormSign requestType = {requestType} isShowSignInput={isShowSignInput} actions ={actions} markInfo={markInfo} requestType={requestType} />}
	                            </div>
                            }
                            <div className='wea-req-workflow-loglist' style={{display:reqTabKey == '1' ? 'block' : 'none'}}>
                                {hasInitLayout && requestType != 2 && isHideArea != "1" && <Sign
                                    logList={logList}
                                    actions={actions}
                                    logListTabKey={logListTabKey}
                                    isShowUserheadimg={isShowUserheadimg}
                                    userId={userId}
                                    requestLogParams = {requestLogParams}
                                    onChange={n=>actions.setlogParams({pgnumber:n,firstload:false})}
                                    current={current}
                                    pagesize={logParams.get('logpagesize') ? logParams.get('logpagesize') : 10}
                                    total={logCount ? logCount : 0}
                                    onPageSizeChange={n=>actions.setLogPagesize({logpagesize:n})}
                                    signFields={signFields}
                                    showSearchDrop={showSearchDrop}
                                    forward={forward}
                                    params={params}
                                    showuserlogids={showuserlogids}
                                    reqRequestId={reqRequestId}
                                    isLoadingLog={isLoadingLog} />
                                }
                            </div>
                        {
                            <div className='wea-req-workflow-picture' style={{display:reqTabKey == '2' ? 'block' : 'none'}}>
                                <iframe className='req-workflow-map' src='' style={{border:0,width:'100%'}}></iframe>
                            </div>
                        }
                        {
                            <div className='wea-req-workflow-status' style={{display:reqTabKey == '3' ? 'block' : 'none'}}>
                                <WfStatus actions={actions} datas={wfStatus} reqParams={{requestid:requestid}} />
                            </div>
                        }
                        {
                            reqTabKey == '4' &&
                                <Resources
                                	dataKey={resourcesKey}
                               		requestid={requestid}
                                    actions={actions}
                                    tabKey={resourcesTabKey}
                                    />
                        }
                        {
                            reqTabKey == '5' && false &&
                                <Share />
                        }
                        {
                        	reqTabKey == "6" && 
                        	<div id="docContent"></div>
                        }
                        { reqTabKey == '1' && hasInitLayout && window.location.pathname.indexOf('/spa/workflow/index') >= 0 &&
                            <Popover trigger="click" content={
                                <div>
                                    <p>js加载耗时: {jsLoadDuration} 毫秒</p>
                                    <p>接口耗时: {apiDuration} 毫秒</p>
                                    <p>渲染耗时: {dispatchDuration} 毫秒</p>
                                </div>
                            }>
                                <div style={{width:'100%',textAlign:'center',color:'#d4d4d4'}}>
                                    页面加载耗时: <span style={{fontWeight:800}}>{reqLoadDuration / 1000}</span> 秒
                                </div>
                            </Popover>
                        }
                        </div>
                    </WeaPopoverHrm>
                </WeaReqTop>
                </WeaRightMenu>
				<Forward {...forwarParams} actions={actions} controllShowForward={this.controllShowForward.bind(this)}/>
                <div className='back_to_old_req'
                    onMouseEnter={()=>actions.setShowBackToE8(true)}
                    onMouseLeave={()=>actions.setShowBackToE8(false)}
                    onClick={()=>{openFullWindowHaveBarForWFList(this.getE8Url(), 848)}}>
                    <div style={{display: showBackToE8 ? 'block' : 'none'}}>
                        <p>E8</p>
                        <p>模式</p>
                    </div>
                </div>
                <ImgZoom />
                <Synergy pathname='/workflow/req' workflowid={workflowid} requestid={requestid?requestid:-1} />
            </div>
        )
    }
    getE8Url(){
        const {params} = this.props;
        if(params && params.get("iscreate") == "1"){
            return `/workflow/request/AddRequest.jsp?workflowid=${params.get("workflowid")}&isagent=0&beagenter=0`;
        }else{
            return `/workflow/request/ViewRequest.jsp?requestid=${params.get("requestid")}&isovertime=0`;
        }
    }
    onRightMenuClick(key){
        const {rightMenu} = this.props;
        rightMenu && !is(rightMenu,Immutable.fromJS({})) && rightMenu.get('rightMenus').map((m,i)=>{
        	if(Number(key) == i){
        		let fn = m.get('menuFun').indexOf('this') >= 0 ? `${m.get('menuFun').split('this')[0]})` : m.get('menuFun');
        		eval(fn);
        	}
        });
    }
    getRightMenu(){
        const {rightMenu,loading} = this.props;
        let btnArr = [];
        rightMenu && !is(rightMenu,Immutable.fromJS({})) && rightMenu.get('rightMenus').map(m=>{
            let fn = m.get('menuFun').indexOf('this') >= 0 ? `${m.get('menuFun').split('this')[0]})` : m.get('menuFun');
            btnArr.push({
                icon: <i className={m.get('menuIcon')} />,
                content: m.get('menuName'),
                disabled:loading
            })
        });
        return btnArr
    }
    changeData(key){
        const {actions,location,wfStatus,resourcesTabKey,params} = this.props
        const {requestid} = location.query;
        const workflowid = params?params.get("workflowid"):"";
        const nodeid = params?params.get("nodeid"):"";
        const modeid = params?params.get("modeid"):"";
        const formid = params?params.get("formid"):"";
        const isbill = params?params.get("isbill"):"";

        key == '2' && !jQuery('.req-workflow-map').attr('src') && jQuery('.req-workflow-map').attr('src',
        `/workflow/request/WorkflowRequestPictureInner.jsp?f_weaver_belongto_userid=&f_weaver_belongto_usertype=&fromFlowDoc=&modeid=${modeid}&requestid=${requestid}&workflowid=${workflowid}&nodeid=${nodeid}&isbill=${isbill}&formid=${formid}&showE9Pic=1`);
        key == "3" && is(wfStatus,Immutable.fromJS({})) && actions.loadWfStatusData({requestid:requestid},"all",true);
        key == "4" && actions.getResourcesKey(requestid, resourcesTabKey);
        if(key == "6"){
			 //调用外部    
			DocUtil.showDoc({"workflowid":workflowid,"requestid":requestid});
        }else{
        	actions.setReqTabKey(key);
        }
    }
    getButtons() {
        const {rightMenu,pathBack,loading,actions,params} = this.props;
        const {router} = this.context;
        const requestType = params?params.get('requestType'):'';
        let btnArr = [];
        rightMenu && !is(rightMenu,Immutable.fromJS({})) && rightMenu.get('rightMenus').map(m=>{
            let fn = m.get('menuFun').indexOf('this') >= 0 ? `${m.get('menuFun').split('this')[0]})` : m.get('menuFun');
            m.get('isTop') == '1' && btnArr.length < 4 && btnArr.push(<Button type="primary" disabled={loading} onClick={()=>{eval(fn)}}>{m.get('menuName')}</Button>)
        });
        window.location.pathname.indexOf('/spa/workflow/index') < 0 && btnArr.push(<Button type="ghost" onClick={this.gobackpage.bind(this,router,requestType)}>返回</Button>)
//      btnArr.push(<Button type="ghost" onClick={()=>{router.push(`/main/workflow/${pathBack}`)}}>返回</Button>)

        return btnArr
    }
    getHideButtons() {
        const {rightMenu} = this.props;
        let btnArr = [];
        rightMenu && !is(rightMenu,Immutable.fromJS({})) && rightMenu.get('rightMenus').map(m=>{
            let fn = m.get('menuFun').indexOf('this') >= 0 ? `${m.get('menuFun').split('this')[0]})` : m.get('menuFun');
            btnArr.push(<a href="javascript:void(0)" onClick={()=>{eval(fn)}}><i className={m.get('menuIcon') || 'icon-top-search'} style={{marginRight:10,verticalAlign:'middle'}} />{m.get('menuName')}</a>)
        });
        return btnArr
    }


    gobackpage(router,requestType){
        if(requestType == 1){
            UEUtil.getUEInstance('remark').destroy();
        }
        router.goBack();
    }
    
    controllShowForward(bool){
    	const {actions} = this.props;
    	actions.setShowForward({showForward:bool});
    }
}

const fliterNull = (obj,param)=>{
    if(!obj) return null;
    if(!obj[param]) return null;
    return obj[param];
}

class MyErrorHandler extends React.Component {
    render(){
        const hasErrorMsg = this.props.error && this.props.error!=="";
        return (
            <WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
        );
    }
}

Req = WeaTools.tryCatch(React, MyErrorHandler, {error: ""})(Req);

function mapStateToProps(state) {
    const {workflowReq,workflowReqForm,workflowReqLogList,workflowlistDoing,comsWeaTable} = state;
    return {
        params:workflowReq.get("params"),   //基础参数
        submitParams:workflowReq.get("submitParams"),   //提交所需隐藏域信息
        loading:workflowReq.get("loading"),
        wfStatus:workflowReq.get("wfStatus"),       //流程状态
        resourcesTabKey:workflowReq.get("resourcesTabKey"),     //相关资源tab
        resourcesKey:workflowReq.get("resourcesKey"),     //相关资源table sessionkey
        rightMenu:workflowReq.get("rightMenu"),//右键按钮
        reqTabKey:workflowReq.get("reqTabKey"), //表单tab标识
        reqIsSubmit:workflowReq.get("reqIsSubmit"),//流程提交关闭
        pathBack:workflowlistDoing.get("nowRouterWfpath"),
        reqIsReload:workflowReq.get("reqIsReload"), //是否需要reload表单
        isShowSignInput:workflowReq.get('isShowSignInput')?workflowReq.get('isShowSignInput'):false,//是否显示签字意见输入框
        reqsubmiterrormsghtml:workflowReq.getIn(['dangerouslyhtml','reqsubmiterrormsghtml']), //流程提交错误信息
        rightMenuStatus:workflowReq.get('rightMenuStatus'), //按钮状态相关
        showBackToE8:workflowReq.get('showBackToE8'),
        reqLoadDuration:workflowReq.get('reqLoadDuration'), //
        jsLoadDuration: workflowReq.get('jsLoadDuration'),
        apiDuration: workflowReq.get('apiDuration'),
        dispatchDuration: workflowReq.get('dispatchDuration'),
        
        //签字意见列表相关
        logList:workflowReqLogList.get("logList"),//签字意见列表
        logParams:workflowReqLogList.get("logParams"), //签字意见查询参数
        logCount:workflowReqLogList.get("logCount"), //签字意见总数
        logListTabKey:workflowReqLogList.get("logListTabKey"),//签字意见tabkey
        isShowUserheadimg:workflowReqLogList.get('isShowUserheadimg'),//是否显示签字意见操作人头像
        signFields:workflowReqLogList.get('signFields'), //签字意见查询相关
        showSearchDrop:workflowReqLogList.get('showSearchDrop'), //签字意见搜索按钮点击控制
        showuserlogids:workflowReqLogList.get('showuserlogids'), //签字意见显示所有人控制
        reqRequestId:workflowReqLogList.get('reqRequestId'),  //主子流程请求ID
        relLogParams:workflowReqLogList.get('relLogParams'), //主子流程签字意见查询参数
        isLoadingLog:workflowReqLogList.get('isLoadingLog'), //签字意见加载是否中
        
        //表单内容相关
        layout: workflowReqForm.get("layout"),   //布局
        conf: workflowReqForm.get("conf"),     //Req相关不变配置信息
        mainData: workflowReqForm.get("mainData"),     //主表数据
        detailData: workflowReqForm.get("detailData"),   //明细数据
        variableArea: workflowReqForm.get("variableArea"),    //字段相关可变值
        //table
        comsWeaTable, //绑定整个table
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...ReqAction,...ReqFormAction,...ReqLogListAction}, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Req);