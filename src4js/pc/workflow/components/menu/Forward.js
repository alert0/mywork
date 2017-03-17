import { Modal, Row, Col, Button } from 'antd'

class Forward extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const titlename = '主流程-xf06-2017-03-09';
		const {showForward} = this.props;
		return(
			<Modal title={this.getTopTitle(titlename)} 
				visible ={true}	
				wrapClassName = "wea-req-forward-modal"
				style={{'min-width':'800px'}}
				maskClosable={false}
				onCancel={this.cancelEvent.bind(this)}
				footer={[
				    <Button type="primary" size="large" onClick={this.submitEvent.bind(this)}>提交</Button>,
	                <Button type="ghost" size="large" onClick={this.cancelEvent.bind(this)}>关闭</Button>
				]}
			>
				<div className="wea-req-forward-content">
					<div className="wea-req-forward-content-receive">
						<div>
							<span style={{'color':'red'}}>*</span>
							<span>转发接收人</span>
						</div>
						<div></div>
						<div></div>
					</div>
					<div className="wea-req-forward-content-remark">
						<div>
							<span>*</span>
							<span>签字意见</span>
						</div>
					</div>
				</div>
			</Modal>
		)
	}
	getTopTitle(titlename) {
		console.log("titlename",titlename);
		return(
			<Row>
                <Col span="8" style={{paddingLeft:20, lineHeight:"45px"}}>
                    <div className="wea-workflow-icon">
                        <i className='icon-portal-workflow' />
                    </div>
                    <span>{titlename}</span>
                </Col>
            </Row>
		)
	}

	submitEvent() {

	}

	cancelEvent() {
		const { actions } = this.props;
		console.log("actions",actions);
		actions.setShowForward(false);
	}
}

export default Forward