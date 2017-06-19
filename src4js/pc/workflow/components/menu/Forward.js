import { Modal, Row, Col, Button, Popover, message, Spin, Checkbox } from 'antd'
import { WeaHrmInput, WeaTools, WeaRightMenu } from 'ecCom'
import OGroup from './OGroup'
import NodeOperator from './NodeOperator'
import Immutable from 'immutable'
import objectAssign from 'object-assign'
import cloneDeep from 'lodash/cloneDeep'

class Forward extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isshowoperategroup: false,
			isshownodeoperators: false,
			signinput: {},
			hasinitremark: false,
			reload: false,
			signdocids: '',
			signworkflowids: '',
			remarkLocation: '',
			fieldannexupload: '',
			fieldannexuploadname: '',
			fieldannexuploadcount: '',
			fieldannexuploadrequest: '',
			forwardremark: '',
			operatorDatas: [],
			loading: false,
			field5: '',
			selectOperatorsMax: undefined, //转发人数最大限制，默认100
			IsSubmitedOpinion: '1',
			IsBeForwardTodo: '1',
			isdisabledbtns: false
		};
		this.setForwardOperatorMax();
		window.FORWARD_OBJ = this;
		this.initData();
	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {
		const { showForward, fromform, actions, requestid, forwardOperators } = nextProps;
		if(showForward && !this.props.showForward) {
			if(fromform) {
				const remarkDiv = jQuery('#remark_div');
				this.setState({
					signdocids: remarkDiv.find('#signdocids').val(),
					signworkflowids: remarkDiv.find('#signworkflowids').val(),
					remarkLocation: remarkDiv.find('#remarkLocation').val(),
					fieldannexupload: remarkDiv.find('#field-annexupload').val(),
					fieldannexuploadname: remarkDiv.find('#field-annexupload-name').val(),
				});
			}
			const { ismanagePage } = this.props;
			const _that = this;
			if(ismanagePage == '1') {
				setTimeout(function() {
					try {
						_that.setRedPoint();
						UE.getEditor('forwardremark').setContent(FCKEditorExt.getHtml('remark'), false);
					} catch(e) {console.log(e)}
				}, 1000);
			}
			
			if(forwardOperators && forwardOperators != '') {
				this.setOperatorIds({ ids: forwardOperators, isAllUser: false, isLoad: true });
			}
		}
	}

	clearState() {
		this.setState({
			operatorDatas: [],
			forwardremark: '',
			signdocids: '',
			signworkflowids: '',
			remarkLocation: '',
			fieldannexupload: '',
			fieldannexuploadname: '',
			fieldannexuploadcount: '',
			fieldannexuploadrequest: '',
			field5: undefined,
			IsSubmitedOpinion: '1',
			IsBeForwardTodo: '1',
			isdisabledbtns: false
		});
	}

	componentDidUpdate() {
		const { hasinitremark, reload, signinput } = this.state;
		if(jQuery('#forwardremark').length > 0 && !hasinitremark && reload && signinput.isHideInput != '1') {
			var _ue = UEUtil.initRemark('forwardremark', false);
			bindRemark(_ue);
			this.setState({ hasinitremark: true });
			jQuery('.wea-req-forward-modal').parent().find('.ant-modal-mask').css('z-index', '105');
			jQuery('.wea-req-forward-modal').css('z-index', '105');
		}
	}

	//控制常用组显示、及数据
	handleVisibleChange(bool) {
		this.setState({
			isshowoperategroup: bool,
			isshownodeoperators: false
		});
	}

	//控制
	handleShowNodeOperator(bool) {
		this.setState({
			isshowoperategroup: false,
			isshownodeoperators: bool
		});
	}
	//更新操作者
	setOperatorIds(params) {
		if(params.isAllUser) {
			let selectOperatorsMax = this.state.selectOperatorsMax;
			if(selectOperatorsMax) {
				if(params.count < selectOperatorsMax) {
					this.setState({ isdisabledbtns: true });
				}
			} else {
				this.setState({ isdisabledbtns: true });
			}
			const allUser = [{ type: 'all', lastname: '所有人', ids: params.ids, count: params.count, id: 'all_users' }];
			this.setState({ operatorDatas: allUser });
		} else {
			if(params.isLoad) {
				WeaTools.callApi('/api/workflow/org/resource', 'GET', { types: params.ids }).then(data => {
					this.setState({ operatorDatas: data });
				});
			} else {
				this.setState({ operatorDatas: params.datas });
			}
		}
	}

	updateState(paramName, e) {
		let params = {};
		params[paramName] = e.target.checked ? 1 : 0;
		this.setState(params);
	}

	dropAllUserGroup() {
		this.setState({ isdisabledbtns: false });
	}

	render() {
		const { showForward, requestid, forwardflag } = this.props;
		const { isshownodeoperators, isshowoperategroup, signinput, operatorDatas, loading, field5, selectOperatorsMax, IsSubmitedOpinion, IsBeForwardTodo, isdisabledbtns } = this.state;
		const titleName = this.state.signinput.requestname;
		
		let _forwardheight = signinput.isforwardrights == '1' ? 479 : 439;
		const ishideinput = signinput.isHideInput == '1';
		if(ishideinput){
			_forwardheight = _forwardheight - 175;
		}
		return(
			<div>
				<Modal title={this.getTopTitle(titleName,forwardflag)} 
					visible ={showForward}	
					wrapClassName = "wea-req-forward-modal"
					style={{'min-width':ishideinput ? '800px' :'1100px','margin-top':(jQuery(window).height()-_forwardheight)/2}}
					maskClosable={false}
					onCancel={this.cancelEvent.bind(this)}
					footer={[
					    <Button type="primary" size="large" disabled={loading} onClick={this.submitEvent.bind(this)}>提交</Button>,
		                <Button type="ghost" size="large" disabled={loading} onClick={this.cancelEvent.bind(this)}>关闭</Button>
					]} 
				>
					<Spin spinning={loading} tip="正在提交，请稍等..." style={{'color':'#484848'}}>
						<div className="wea-req-forward-content">
							<div className="wea-req-forward-content-receive clearfix">
								<div className='label'>
									<span>*</span>
									<span>转发接收人</span>
								</div>
								<div className='input'>
									<WeaHrmInput mult onChange={(o)=>{this.setState({field5:o,operatorDatas:[]})}} dropAllUserGroup={this.dropAllUserGroup.bind(this)} value={field5} opsDatas={operatorDatas} maxLength={selectOperatorsMax}/>
								</div>
								<div className='btns'>
									<Popover placement="bottomLeft" title="" content={<OGroup isshowoperategroup={isshowoperategroup} handleVisibleChange={this.handleVisibleChange.bind(this)} setOperatorIds={this.setOperatorIds.bind(this)}/>} 
											 trigger="click"
											 onVisibleChange={this.handleVisibleChange.bind(this)}
											 visible={isshowoperategroup}
											 overlayClassName="wea-req-forward-customer-me">
										<Button type="large" disabled={isdisabledbtns} title="快捷选择人员"><i className='icon-customer-me'/></Button>
									</Popover>
									<Popover placement="bottomLeft" title="" content={<NodeOperator requestid={requestid} setOperatorIds={this.setOperatorIds.bind(this)} handleShowNodeOperator={this.handleShowNodeOperator.bind(this)}/>} 
											 trigger="click"
											 onVisibleChange={this.handleShowNodeOperator.bind(this)}
											 visible={isshownodeoperators}
											 overlayClassName="wea-req-forward-node-operator">
										 <Button type="large" style={{'margin-left':'5px'}} disabled={isdisabledbtns} title="选择节点参与人作为转发对象">
										 	<img src="/images/forward_btn_operator.png"/>
										 </Button>
									</Popover>
								</div>
							</div>
							{signinput.isforwardrights =='1' && 
								<div className="wea-req-forward-content-right">
									<div>
										<span className="label">接收人权限</span>
										<Checkbox checked={IsSubmitedOpinion == '1'} onChange={this.updateState.bind(this,'IsSubmitedOpinion')}>可提交意见</Checkbox>
										<Checkbox checked={IsBeForwardTodo == '1'} onChange={this.updateState.bind(this,'IsBeForwardTodo')}>可转发</Checkbox>
									</div>
								</div>
							}
							<div className="wea-req-forward-content-remark" style={{'display':ishideinput ? 'none':'block'}}>
								<div className='label'>
									<span>{signinput.isSignMustInput == '1' && '*'}</span>
									<span style={{'margin-left': (signinput.isSignMustInput == '1') ? '0px':'5px'}}>签字意见</span>
									<span style={{'color':'#d5d5d5','margin-left':'10px','font-weight':'normal'}}>{signinput.tempbeagenter != signinput.fileuserid ? `（您当前正代理${signinput.tempbeagentername}进行操作）` : ''}</span>
								</div>
								<div className='remark' id="forwardremark_div">
									 <textarea name='forwardremark' id="forwardremark" style={{'width':'100%','height':'167px'}} >
									 </textarea>
									 <input type="hidden" id="signdocids" name="signdocids" value={this.state.signdocids}/>
									 <input type="hidden" id="signworkflowids"name="signworkflowids" value={this.state.signworkflowids}/>
									 <input type="hidden" name="remarkLocation" id="remarkLocation" value={this.state.remarkLocation}></input>
									 <input type="hidden" id="field-annexupload" name="field-annexupload" value={this.state.fieldannexupload}/>
									 <input type="hidden" id="field_annexupload_del_id" value=''/>
									 <input type="hidden" name="field-annexupload-name" id="field-annexupload-name" value={this.state.fieldannexuploadname}/>
									 <input type="hidden" name="field-annexupload-count" id="field-annexupload-count" value={this.state.fieldannexuploadcount}/>
									 <input type="hidden" name="field-annexupload-request" id="field-annexupload-request" value={requestid}/>
									 <input type="hidden" name="field-cancle" id="field-cancle" value=" 删除 "/>
									 <input type="hidden" name="field-add-name" id="field-add-name" value="点击添加附件 "/>
								</div>
							</div>
							{ishideinput && <div style={{'width':'100%','height':'60px'}}></div>}
						</div>
					</Spin>
				</Modal>	
				<div id="forwardremark_hidden_area">
					<input type="hidden" name='annexmainId' id='annexmainId' value={signinput.annexmainId}/>
					<input type="hidden" name='annexsubId' id='annexsubId' value={signinput.annexsubId}/>
					<input type="hidden" name='annexsecId' id='annexsecId' value={signinput.annexsecId}/>
					<input type="hidden" name='fileuserid' id='fileuserid' value={signinput.fileuserid}/>
					<input type="hidden" name='fileloginyype' id='fileloginyype' value={signinput.fileloginyype}/>
					<input type="hidden" name='annexmaxUploadImageSize' id='annexmaxUploadImageSize' value={signinput.annexmaxUploadImageSize}/>
					<input type="hidden" name='isSignDoc_edit' id='isSignDoc_edit' value={signinput.isSignDoc_edit}/>
					<input type="hidden" name='isannexupload_edit' id='isannexupload_edit' value={signinput.isannexupload_edit}/>
					<input type="hidden" name='isSignWorkflow_edit' id='isSignWorkflow_edit' value={signinput.isSignWorkflow_edit}/>
					<input type="hidden" name='workflowid' id='workflowid' value={signinput.workflowid}/>
					<input type="hidden" name='requestid' id='requestid' value={requestid}/>
					<input type="hidden" name='nodeid' id='nodeid' value={signinput.nodeid}/>
					<input type="hidden" name='isbill' id='isbill' value={signinput.isbill}/>
					<input type="hidden" name='formid' id='formid' value={signinput.formid}/>
					<input type="hidden" name='hasAddWfPhraseRight' id='hasAddWfPhraseRight' value={signinput.hasAddWfPhraseRight}/>
					<input type="hidden" name='phraseInfo' id='phraseInfo' value={signinput.phraseInfo && JSON.stringify(signinput.phraseInfo)}/>
				</div>
			</div>
		)
	}

	onRightMenuClick(key) {
		const { rightMenu } = this.props;
		rightMenu && !is(rightMenu, Immutable.fromJS({})) && rightMenu.get('rightMenus').map((m, i) => {
			let fn = m.get('menuFun').indexOf('this') >= 0 ? `${m.get('menuFun').split('this')[0]})` : m.get('menuFun');
			Number(key) == i && eval(fn)
		});
	}

	getTopTitle(titlename,forwardflag) {
		let titlenameprefix = "流程转发："
		if(forwardflag == '2'){
			titlenameprefix = "意见征询：";
		}
		if(forwardflag == '3'){
			titlenameprefix = "流程转办：";
		}
		
		return(
			<Row>
                <Col span="16" style={{paddingLeft:20, lineHeight:"45px"}}>
                    <div className="wea-workflow-icon">
                        <i className='icon-portal-workflow' />
                    </div>
                    <span dangerouslySetInnerHTML={{__html:titlenameprefix+titlename}}></span>
                </Col>
            </Row>
		)
	}

	//提交
	submitEvent() {
		const { operatorDatas , field5, signinput, IsSubmitedOpinion, IsBeForwardTodo } = this.state;
		const { fromform, controllShowForward ,forwardflag,needwfback} = this.props;
		//验证签字意见必填
		let flag = true;
		if(signinput.isSignMustInput == '1') {
			let forwardremarkcontent = FCKEditorExt.getText("forwardremark");
			flag = chekcremark(forwardremarkcontent);
		}
		if(!flag || field5 == '') {
			message.warning('必要信息不完整，红色*号为必填项！', 2);
			return;
		}
		let forwardremarkInfo = this.getSignInputInfo();
		this.setState({ loading: true });

		let params = objectAssign({}, forwardremarkInfo, {
			operate: 'save',
			field5: field5,
			requestid: this.props.requestid,
			forwardflag: forwardflag,
			needwfback:needwfback,
			IsSubmitedOpinion: IsSubmitedOpinion,
			IsBeForwardTodo: IsBeForwardTodo
		});
		const _this = this;
		WeaTools.callApi('/api/workflow/request/remarkOperate', 'POST', params).then(data => {
			_this.clearSignInput();
			const forwardflag = data.forwardflag;
			const { actions } = this.props;
			this.setState({ loading: false });
			if(fromform) {
				if(forwardflag == '1') {
					e9signReload();
				} else {
					try {
						window.opener._table.reLoad();
					} catch(e) {}
					try {
						//刷新门户流程列表
						jQuery(window.opener.document).find('#btnWfCenterReload').click();
					} catch(e) {}
					try {
						actions.reqIsSubmit(true);
					} catch(e) {}
				}
			}
			controllShowForward(false);
		});
	}

	getSignInputInfo() {
		const paramDiv = jQuery('#forwardremark_div');
		const { requestid } = this.props;
		return {
			signworkflowids: paramDiv.find('#signworkflowids').val(),
			signdocids: paramDiv.find('#signdocids').val(),
			remarkLocation: paramDiv.find('#remarkLocation').val(),
			'field-annexupload': paramDiv.find('#field-annexupload').val(),
			'field-annexupload-name': paramDiv.find('#field-annexupload-name').val(),
			'field-annexupload-count': paramDiv.find('#field-annexupload-count').val(),
			'field-annexupload-request': requestid,
			remark: FCKEditorExt.getHtml('forwardremark')
		};
	}

	cancelEvent() {
		const { controllShowForward } = this.props;
		controllShowForward(false);
		this.clearSignInput();
	}

	//清空签字意见内容
	clearSignInput() {
		let ue = UE.getEditor('forwardremark');
		ue.setContent('');

		const paramDiv = jQuery('#forwardremark_div');
		const ids = paramDiv.find("#field-annexupload").val();
		if(ids) {
			let idArr = ids.split(',');
			idArr.map(o => {
				paramDiv.find('#li_' + o).remove();
			});

			const _targetobj = jQuery('#forwardremark').find(".edui-for-wfannexbutton").children("div").children("div").children("div").children(".edui-metro");
			_targetobj.addClass("wfres_1");
			_targetobj.removeClass("wfres_1_slt");
		}

		const signdocids = paramDiv.find("#signdocids").val();
		if(signdocids) {
			const _targetobj = jQuery('#forwardremark').find(".edui-for-wfdocbutton").children("div").children("div").children("div").children(".edui-metro");
			_targetobj.addClass("wfres_2");
			_targetobj.removeClass("wfres_2_slt");
		}

		const signworkflowids = paramDiv.find("#signworkflowids").val();
		if(signworkflowids) {
			_targetobj = jQuery('#forwardremark').find(".edui-for-wfwfbutton").children("div").children("div").children("div").children(".edui-metro");
			_targetobj.addClass("wfres_3");
			_targetobj.removeClass("wfres_3_slt");
		}

		this.clearState();
	}

	setRedPoint() {
		const paramDiv = jQuery('#forwardremark_div');
		const ids = paramDiv.find("#field-annexupload").val();
		if(ids) {
			const _targetobj = jQuery('#forwardremark').find(".edui-for-wfannexbutton").children("div").children("div").children("div").children(".edui-metro");
			_targetobj.addClass("wfres_1_slt");
			_targetobj.removeClass("wfres_1");
		}

		const signdocids = paramDiv.find("#signdocids").val();
		if(signdocids) {
			const _targetobj = jQuery('#forwardremark').find(".edui-for-wfdocbutton").children("div").children("div").children("div").children(".edui-metro");
			_targetobj.addClass("wfres_2_slt");
			_targetobj.removeClass("wfres_2");
		}

		const signworkflowids = paramDiv.find("#signworkflowids").val();
		if(signworkflowids) {
			_targetobj = jQuery('#forwardremark').find(".edui-for-wfwfbutton").children("div").children("div").children("div").children(".edui-metro");
			_targetobj.addClass("wfres_3_slt");
			_targetobj.removeClass("wfres_3");
		}
	}

	initData() {
		const { requestid } = this.props;
		const _this = this;
		WeaTools.callApi('/api/workflow/request/signInput', 'GET', { requestid: requestid }).then(data => {
			const { hasinitremark } = _this.state;
			if(hasinitremark) {
				UE.getEditor('forwardremark').destroy();
				jQuery('#forwardremark_div').find('#_fileuploadphraseblock').remove();
				jQuery('#forwardremark_div').find('#fsUploadProgressfileuploaddiv').remove();
				jQuery('#forwardremark_div').find('#_signinputphraseblock').remove();
			}
			_this.setState({ signinput: data, reload: true, hasinitremark: false });
		});
	}
	//选择人数控制
	setForwardOperatorMax() {
		WeaTools.callApi('/api/workflow/org/selectMaxRight', 'GET', {}).then(data => {
			this.setState({ selectOperatorsMax: data.right ? undefined : 10000 });
		});
	}
}

export default Forward