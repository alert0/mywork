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
			hrmgroups: [],
			alldatas: [],
			allitems: [],
			operatorids:''
		};
	}

	//控制常用组显示、及数据
	handleVisibleChange(bool) {
		this.setState({
			isshowoperategroup: bool,
			isshownodeoperators: false
		});

		const { hrmgroups } = this.state;
		if(hrmgroups.length == 0) {
			const _this = this;
			WeaTools.callApi('/api/workflow/hrmgroup/datas', 'GET', {}).then(data => {
				_this.setState({ hrmgroups: data.datas });
			});
		}
	}

	//控制
	handleShowNodeOperator(bool) {
		this.setState({
			isshowoperategroup: false,
			isshownodeoperators: bool
		});

		const { alldatas } = this.state;
		if(alldatas.length == 0) {
			const { requestid } = this.props;
			const _this = this;
			WeaTools.callApi('/api/workflow/reqforward/' + requestid, 'GET', {}).then(data => {
				let allitems = [];
				_this.setState({ alldatas: data, allitems: allitems });
			});
		}
	}
	
	setOperatorIds(ids){
		this.setState({operatorids:ids});
	}

	render() {
		const { showForward, titleName } = this.props;
		const { hrmgroups, isshownodeoperators, isshowoperategroup, allitems, submitItems, unSubmitItems, alldatas } = this.state;

		return(
			<Modal title={this.getTopTitle(titleName)} 
				visible ={showForward}	
				wrapClassName = "wea-req-forward-modal"
				style={{'min-width':'1000px'}}
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
							<Popover placement="bottomLeft" title="" content={<OGroup hrmgroups={hrmgroups} handleVisibleChange={this.handleVisibleChange.bind(this)} setOperatorIds={this.setOperatorIds.bind(this)}/>} 
									 trigger="click"
									 onVisibleChange={this.handleVisibleChange.bind(this)}
									 visible={isshowoperategroup}
									 overlayClassName="wea-req-forward-customer-me">
								<div className='wea-workflow-icon'>
									<i className='icon-customer-me'/>
								</div>
							</Popover>
							<Popover placement="bottomLeft" title="" content={<NodeOperator datas={alldatas} setOperatorIds={this.setOperatorIds.bind(this)} handleShowNodeOperator={this.handleShowNodeOperator.bind(this)}/>} 
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