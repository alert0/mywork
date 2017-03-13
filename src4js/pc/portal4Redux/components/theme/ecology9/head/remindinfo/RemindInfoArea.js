import {connect} from 'react-redux'
import {
	Popover,
	Badge
} from 'antd';
import RemindInfo from './RemindInfo'

import {changeRemindInfoPop} from '../../../../../actions/head'

class RemindInfoArea extends React.Component {
	hideCallBackFunc(event) {
		this.props.clickCallBack(event)
		this.expandCallBackFunc(false)
	}
	expandCallBackFunc(visible) {
		const {dispatch} = this.props
		dispatch(changeRemindInfoPop(visible))
		if (visible) {
            $(".css-topmenu-notice").addClass("css-topmenu-notice-expand");
        }else{
            $(".css-topmenu-notice").removeClass("css-topmenu-notice-expand");
        }
	}
	render() {
		const {hasremindinfo,remindInfoList,remindivisible} = this.props
		return <div className="css-topmenu-btnblock css-topmenu-toolbar css-topmenu-notice">
			<Popover visible={remindivisible} onVisibleChange={this.expandCallBackFunc.bind(this)} 
				content={<RemindInfo onClick={this.hideCallBackFunc.bind(this)} remindInfoList={remindInfoList.toJSON()}/>}
				title={<span className="css-topmenu-remindinfo"><i className="wevicon wevicon-remindinfo-news" />新到达消息</span>}
				placement="bottomLeft"   trigger="click" overlayClassName="css-topmenu-popover-newtop">
				<div>
					<Badge dot={hasremindinfo}>
					    <i className="wevicon wevicon-topmenu-news" />
					</Badge>
				</div>
			</Popover>
		</div>
	}
}
const mapStateToProps = state => {
    const {PortalHeadStates,PortalHeadPopOverStates}=state
    return {
    	hasremindinfo:PortalHeadStates.get("hasremindinfo"),
	    remindInfoList:PortalHeadStates.get("remindInfoList"),
	    remindivisible:PortalHeadPopOverStates.get("remindivisible")
	}
}
module.exports = connect(mapStateToProps)(RemindInfoArea)