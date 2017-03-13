import {Popover} from 'antd';
import {connect} from 'react-redux'

import FreqUseMenu from './FreqUseMenu'

import {changeFreqUsePop} from '../../../../../actions/head'

class FreqUseMenuArea extends React.Component {
	hideCallBackFunc(event) {
		this.props.clickCallBack(event)
		this.expandCallBackFunc(false)
	}
	expandCallBackFunc(visible) {
		const {dispatch} = this.props
		dispatch(changeFreqUsePop(visible))
		if (visible) {
            $(".css-topmenu-frequse").addClass("css-topmenu-frequse-expand");
        }else{
            $(".css-topmenu-frequse").removeClass("css-topmenu-frequse-expand");
        }
	}
	render() {
		const {frequvisible} = this.props
		return <div className="css-topmenu-btnblock css-topmenu-frequse">
			<Popover visible={frequvisible} onVisibleChange={this.expandCallBackFunc.bind(this)} 
				content={<FreqUseMenu onClick={this.hideCallBackFunc.bind(this)}/>}
				placement="bottomLeft" trigger="click" overlayClassName="css-topmenu-popover-newtop">
				<div>
					<i className="wevicon wevicon-topmenu-Common css-topmenu-toolbar" />
				</div>
			</Popover>
		</div>
	}
}
const mapStateToProps = state => {
    const {PortalHeadPopOverStates}=state 
    return {frequvisible:PortalHeadPopOverStates.get("frequvisible")}
}
module.exports = connect(mapStateToProps)(FreqUseMenuArea)