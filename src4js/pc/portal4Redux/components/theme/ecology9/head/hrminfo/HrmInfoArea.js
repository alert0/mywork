import {connect} from 'react-redux'
import {Popover} from 'antd';
import TopHrmInfo from './TopHrmInfo'

import {changeHrmInfoPop} from '../../../../../actions/head'

class HrmInfoArea extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
		return canUpdateComponent(nextState, nextProps, this.state, this.props)
	}
	hideCallBackFunc(event) {
		this.props.clickCallBack(event)
		this.expandCallBackFunc(false)
	}
	expandCallBackFunc(visible) {
		const {dispatch} = this.props
		dispatch(changeHrmInfoPop(visible))
	}
	render() {
		const {usermap,onlyUser,hrmivisible,hrmiclass}= this.props;
		const {icon,userid,username,accountlist} = usermap.toJSON();
		let onlyUserBool = onlyUser == 'true'
		return <span>
			<Popover visible={hrmivisible} onVisibleChange={this.expandCallBackFunc.bind(this)} 
				content={<TopHrmInfo onClick={this.hideCallBackFunc.bind(this)} datalist={accountlist} onlyUser={onlyUserBool}/>}
				title={(accountlist && accountlist.length > 1) ? "账号切换" : ""}
				placement = "bottomRight" overlayClassName = "css-topmenu-popover-newtop" trigger = "click">
				<div className={hrmiclass}>
					{onlyUserBool ? "" : <div className="css-topmenu-hrminfo-icon">
						<img src={icon}/>
					</div>}
					
					<span title={username}>{username}</span>
					<i className="wevicon wevicon-topmenu-Arrow" />
				</div> 
			</Popover>
		</span>
	}
}
const mapStateToProps = state => {
    const {PortalHeadStates,PortalHeadPopOverStates}=state
    return {
    	usermap:PortalHeadStates.get("usermap"),
    	hrmivisible:PortalHeadPopOverStates.get("hrmivisible"),
    	hrmiclass:PortalHeadPopOverStates.get("hrmiclass")
    }
}
module.exports = connect(mapStateToProps)(HrmInfoArea)