import {connect} from 'react-redux'
import {Popover} from 'antd';
import ToolBarMoreMenu from './ToolBarMoreMenu'

import {changeToolbarMorePop} from '../../../../../actions/head'

class ToolBarMoreBtnArea extends React.Component {
	hideCallBackFunc(event) {
		this.props.clickCallBack(event)
		this.expandCallBackFunc(false)
	}
	expandCallBackFunc(visible) {
		const {dispatch} = this.props
		dispatch(changeToolbarMorePop(visible))
		if (visible) {
            $(".css-topmenu-morebtn").addClass("css-topmenu-morebtn-expand");
        }else{
            $(".css-topmenu-morebtn").removeClass("css-topmenu-morebtn-expand");
        }
	}
	render() { 
		const {toolbarMoreList,toolbarmvisible} = this.props

		return <div className="css-topmenu-btnblock css-topmenu-morebtn">
			<Popover visible={toolbarmvisible} onVisibleChange={this.expandCallBackFunc.bind(this)} 
				content={<ToolBarMoreMenu onClick={this.hideCallBackFunc.bind(this)} toolbarMoreList={toolbarMoreList.toJSON()}/>}
				transitionName="" placement="bottomRight" trigger="click" overlayClassName="css-topmenu-toolmore-popover">
				<div>
					<i className="wevicon wevicon-topmenu-more" />
				</div>
			</Popover>
		</div>
	}
}
const mapStateToProps = state => {
    const {PortalHeadStates,PortalHeadPopOverStates}=state
    return {
    	toolbarMoreList:PortalHeadStates.get("toolbarMoreList"),
    	toolbarmvisible:PortalHeadPopOverStates.get("toolbarmvisible")
    }
}
module.exports = connect(mapStateToProps)(ToolBarMoreBtnArea)