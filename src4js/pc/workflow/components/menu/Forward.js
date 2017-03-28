import { Modal, Row, Col, Button, Popover } from 'antd'
import { WeaInput4HrmNew, WeaTools } from 'weaCom'
import OGroup from './OGroup'
import NodeOperator from './NodeOperator'

class Forward extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isshowoperategroup: false,
			isshownodeoperators: false,
			showForward: false,
			operatorids: '',
			signinput:{},
			hasinitremark:false
	
		};

		const { requestid } = this.props;
		let params = { actiontype: 'signInput', requestid: requestid }
		const _this = this;
		WeaTools.callApi('/api/workflow/request/reqinfo', 'GET', params).then(data => {
			_this.setState({ signinput: data });
		});
	}
	
	componentDidUpdate(){
		const {hasinitremark} = this.state;
		if(jQuery('#forwardremark').length > 0 && !hasinitremark){
			var _ue = UEUtil.initRemark('forwardremark', false);
			bindRemark(_ue);
			this.setState({hasinitremark:true});
			jQuery('.wea-req-forward-modal').parent().find('.ant-modal-mask').css('z-index','105');
			jQuery('.wea-req-forward-modal').css('z-index','105');
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

	setOperatorIds(ids) {
		const { operatorids } = this.state;
		let operatoridarr = operatorids.split(',').concat(ids.split(','));
		let result = [];
		operatoridarr.filter(o => {
			if(o == '')
				return false;
			if(result.contains(o))
				return false;
			result.push(o);
			return true;
		});
		this.setState({ operatorids: result.join(',') });
	}

	render() {
		const { showForward, titleName, requestid } = this.props;
		const { isshownodeoperators, isshowoperategroup, signinput } = this.state;
		
		return(
			<Modal title={this.getTopTitle(titleName)} 
				visible ={showForward}	
				wrapClassName = "wea-req-forward-modal"
				style={{'min-width':'1100px'}}
				maskClosable={false}
				onCancel={this.cancelEvent.bind(this)}
				footer={[
				    <Button type="primary" size="large" onClick={this.submitEvent.bind(this)}>提交</Button>,
	                <Button type="ghost" size="large" onClick={this.cancelEvent.bind(this)}>关闭</Button>
				]}
			>
				<div className="wea-req-forward-content">
					<div className="wea-req-forward-content-receive">
						<div className='label'>
							<span>*</span>
							<span>转发接收人</span>
						</div>
						<div className='input'>
							<WeaInput4HrmNew />
						</div>
						<div className='btns'>
							<Popover placement="bottomLeft" title="" content={<OGroup handleVisibleChange={this.handleVisibleChange.bind(this)} setOperatorIds={this.setOperatorIds.bind(this)}/>} 
									 trigger="click"
									 onVisibleChange={this.handleVisibleChange.bind(this)}
									 visible={isshowoperategroup}
									 overlayClassName="wea-req-forward-customer-me">
								<div className='wea-workflow-icon'>
									<i className='icon-customer-me'/>
								</div>
							</Popover>
							<Popover placement="bottomLeft" title="" content={<NodeOperator requestid={requestid} setOperatorIds={this.setOperatorIds.bind(this)} handleShowNodeOperator={this.handleShowNodeOperator.bind(this)}/>} 
									 trigger="click"
									 onVisibleChange={this.handleShowNodeOperator.bind(this)}
									 visible={isshownodeoperators}
									 overlayClassName="wea-req-forward-node-operator">
								<div className='wea-workflow-icon'>
									<i className='icon-New-Flow-channel'/>
								</div>
							</Popover>
						</div>
					</div>
					<div className="wea-req-forward-content-remark">
						<div className='label'>
							<span>*</span>
							<span>签字意见</span>
						</div>
						<div className='remark'>
							<textarea name='forwardremark' id="forwardremark"/>
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
				</div>
			</Modal>
		)
	}
	getTopTitle(titlename) {
		return(
			<Row>
                <Col span="8" style={{paddingLeft:20, lineHeight:"45px"}}>
                    <div className="wea-workflow-icon">
                        <i className='icon-portal-workflow' />
                    </div>
                    <span dangerouslySetInnerHTML={{__html:titlename}}></span>
                </Col>
            </Row>
		)
	}

	submitEvent() {

	}

	cancelEvent() {
		this.setState({
			showForward: false
		});

		const { actions } = this.props;
		actions.setShowForward(false);
	}
}

export default Forward