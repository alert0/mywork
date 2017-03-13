import {connect} from 'react-redux'
import {Popover} from 'antd';

import TopMenu from './TopMenu'

import {changeTopMenuPop} from '../../../../../actions/head'
import ecLocalStorage from '../../../../../util/ecLocalStorage.js';
class TopMenuArea extends React.Component {
	constructor(props) {
		super(props);
		this.topdatalist = [{
			"name": "门户",
			"customTopName": "门户",
			"type": "portal",
			"infoId": "0",
			"iconurl": ""
		}];
		this.popdatalist = []

		if (ecLocalStorage.getObj("e8head", 'topmenudata', true)) {
			this.topdatalist = ecLocalStorage.getObj("e8head", 'topmenudata', true)
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.topMenuList.size != this.props.topMenuList.size) {
			let data = nextProps.topMenuList.toJSON()
			var count = 0
			this.topdatalist = [{
				"name": "门户",
				"customTopName": "门户",
				"type": "portal",
				"infoId": "0",
				"iconurl": ""
			}];
			this.popdatalist = []
			data.forEach((item) => {
				if (count < 4) {
					this.topdatalist.push(item)
				} else {
					this.popdatalist.push(item)
				}
				count++;
			})
			ecLocalStorage.set("e8head", 'topmenudata', this.topdatalist, true);
		}
	}
	componentDidMount() {
		$($('.css-topmenu-portal')[0]).addClass('css-topmenu-item-selected')
	}
	hideCallBackFunc(event) {
		this.topMenuClickFunc("common", event)
	}
	topMenuClickFunc(type, event) {
		let menuid = $(event.currentTarget).attr("data-menuid")
		let name = $(event.currentTarget).attr("title")
		this.props.clickCallBack(type, menuid, name)

		$('.css-topmenu-item-selected').removeClass('css-topmenu-item-selected')
		$(event.currentTarget).addClass('css-topmenu-item-selected')

		this.expandCallBackFunc(false);
	}
	expandCallBackFunc(visible) {
		if (visible) {
			$('.css-topmenu-topmenu-normal').addClass('css-topmenu-topmenu-expand')
		} else {
			$('.css-topmenu-topmenu-normal').removeClass('css-topmenu-topmenu-expand')
		}
		const {dispatch} = this.props
		dispatch(changeTopMenuPop(visible))
	}
	render() {
		const {topmvisible} = this.props
		var topItems = [];
		this.topdatalist.forEach((item) => {
			topItems.push(<TopMenuIcon data={item} clickCallBack={this.topMenuClickFunc.bind(this)}/>)
		})
		return <div className="css-topmenu-topmenu-normal ">
			<div style={{"width":"300px","display":" inline-block"}}>
			{topItems}
			</div>
			<div className="css-topmenu-btnblock css-topmenu-topmenu">
				<Popover visible={topmvisible} onVisibleChange={this.expandCallBackFunc.bind(this)} 
					content={<TopMenu onClick={this.hideCallBackFunc.bind(this)} topMenuList={this.popdatalist}/>}
					transitionName="" placement="bottomRight" overlayClassName = "css-topmenu-popover" trigger = "click">
					<div className="css-topmenu-icon">	
						<i className="wevicon wevicon-topmenu-menu" />
						<div className="css-topmenu-menuname ≡"></div>
					</div>	
				</Popover>
			</div>		
		</div>
	}
}
const TopMenuIcon = ({data,clickCallBack}) =>{
	let type = "common"
	const {infoId,customTopName} = data
	let name = convertNameToTwo(customTopName)
	if (data.type == 'portal') {
		type = "portal"
	}
	return <div className="css-topmenu-btnblock css-topmenu-portal" title={name} data-menuid={infoId}
	onClick={(event)=>{clickCallBack(type,event)}}>
		{name}
	</div>
}
const mapStateToProps = state => {
    const {PortalHeadStates,PortalHeadPopOverStates}=state
    return {
    	topMenuList:PortalHeadStates.get("topMenuList"),
    	topmvisible:PortalHeadPopOverStates.get("topmvisible"),
    }
}
module.exports = connect(mapStateToProps)(TopMenuArea)