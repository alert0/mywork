import {connect} from 'react-redux'
import {Popover} from 'antd';

import TopMenu from './TopMenu'

import {selectTopMenuName,changeTopMenuPop} from '../../../../../actions/head'

import {MODULE_ROUTE_MAP} from '../../../../../constants/ModuleRouteMap';

class TopMenuArea extends React.Component {
	hideCallBackFunc(event) {
		const {dispatch} = this.props

		$(".css-topmenu-show .css-topmenu-item-selected").removeClass("css-topmenu-item-selected");
		$(event.currentTarget).addClass("css-topmenu-item-selected");

		this.props.clickCallBack("common", $(event.currentTarget).attr("data-menuid"))
		
		this.expandCallBackFunc(false)
		
		dispatch(selectTopMenuName($(event.currentTarget).find("span").text()))
	}
	portalBtnFunc() {
		const {dispatch} = this.props
		$(".css-topmenu-show .css-topmenu-item-selected").removeClass("css-topmenu-item-selected");
		
		dispatch(selectTopMenuName('我的门户'))

		this.props.clickCallBack("portal", 0)
	}
	expandCallBackFunc(visible) {
		const {dispatch} = this.props
		dispatch(changeTopMenuPop(visible))
	}
	render() {
		const {selmenuname,topMenuList,topmvisible,topmclass,pathname} = this.props;

		// 根据路由地址解析出模块名和模块菜单名
		let routers = pathname.split('/');
		let moduleName = '';
		let selectedId = 0;
		let selectedName = '';
		if (routers && routers.length == 3) {
			moduleName = routers[1];
			selectedId = MODULE_ROUTE_MAP[moduleName].id;
			selectedName = MODULE_ROUTE_MAP[moduleName].name;
		}

		if ('我的门户' != selmenuname) {
			selectedName = selmenuname;
		}

		let topMenu = <TopMenu selectedId={selectedId} onClick={this.hideCallBackFunc.bind(this)} topMenuList={topMenuList.toJSON()}/>
		return <div>
				<div className="css-topmenu-btnblock css-topmenu-portal" onClick={this.portalBtnFunc.bind(this)}>
					<i className="wevicon wevicon-topmenu-home" />
				</div>
				<Popover visible={topmvisible} onVisibleChange={this.expandCallBackFunc.bind(this)} 
					content={topMenu}
					placement = "bottomLeft" overlayClassName = "css-topmenu-popover" trigger = "click"> 
					<div className={topmclass}>
						<div className="css-topmenu-icon">
							<i className="wevicon wevicon-topmenu-menu" />
						</div>
						<div className="css-topmenu-menuname">{selectedName}</div>
					</div> 
				</Popover>
		</div>
	}
}
const mapStateToProps = state => {
    const {PortalHeadTopMenuStates,PortalHeadStates,PortalHeadPopOverStates}=state
    return {
    	selmenuname:PortalHeadTopMenuStates.get("selmenuname"),
    	topMenuList:PortalHeadStates.get("topMenuList"),
    	topmvisible:PortalHeadPopOverStates.get("topmvisible"),
    	topmclass:PortalHeadPopOverStates.get("topmclass")
    }
}
module.exports = connect(mapStateToProps)(TopMenuArea)