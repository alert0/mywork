import {connect} from 'react-redux'

import '../../../../css/e8header.css';

import FreqUseMenuArea from './freqmenu/FreqUseMenuArea';
import QuickSearchArea from './quicksearch/QuickSearchArea';
import ToolBarBtns from './toolbarbtns/ToolBarBtns';
import ToolBarMoreBtnArea from './toolbarmore/ToolBarMoreBtnArea';
import TopMenuArea from './topmenu/TopMenuArea';
import BirthModal from '../../../BirthModal';

import {loadToolbarItems,loadAccountInfo,loadQuickSearchMenu,loadLogoSetting
	,loadTopMenu,loadFreqUseMenu,loadToolBarMoreMenu,loadBirthInfo} from '../../../../actions/head'
import ecLocalStorage from '../../../../util/ecLocalStorage.js';
class E8Header extends React.Component {
	componentWillMount() {
		const {dispatch} = this.props

		dispatch(loadToolbarItems())
		
		dispatch(loadAccountInfo())
		
		dispatch(loadQuickSearchMenu())

		dispatch(loadLogoSetting())
	
		dispatch(loadTopMenu())
	}

	componentDidMount() {
		const {dispatch} = this.props
		dispatch(loadFreqUseMenu())
		dispatch(loadToolBarMoreMenu())
		this.showBirthInfo()
	}
	showBirthInfo() {
		if (ecLocalStorage.getStr('e8head', 'showedbirth', true)!= 1) {
			const {dispatch} = this.props
			dispatch(loadBirthInfo('e8head'))
		}
	}
	commonShowDataFunc(event) {
		var type = $(event.currentTarget).attr("data-type")
		var url = $(event.currentTarget).attr("data-url")
		var title = $(event.currentTarget).attr("title")
		this.showMenuData(type, url, title)
	}

	showInLeftFunc(type, id, name) {
		this.props.onLoadLeftMenu(type, id, name)
	}
	showMenuData(type, url, title, width, height) {
		if (type == 0) {
			window.open(url)
		} else if (type == 1) {
			showDialog(url, title, width, height)
		} else if (type == 2 && url != null) {
			if (url.indexOf("#/") == 0) {
				this.props.onLoadMain(url, "")
			} else {
				this.props.onLoadMain("", url)
			}
		}
	}
	render() {
		const {headlogo} = this.props
		return <div className="css-portal-headblock">
			<LogoArea iconurl={headlogo}/>
			<TopMenuArea clickCallBack={this.showInLeftFunc.bind(this)} />
			<FreqUseMenuArea clickCallBack={this.commonShowDataFunc.bind(this)} />
			
			<QuickSearchArea showMenuData={this.showMenuData.bind(this)}/>
			
			<div style={{"float":"right"}} className="css-topmenu-rightblock">
				<div id="pluginTd" className="css-topmenu-plugindiv"></div>
			
				<div className="css-topmenu-splitdiv"></div>
				<ToolBarBtns clickCallBack={this.showMenuData.bind(this)}/>

				<ToolBarMoreBtnArea clickCallBack={this.commonShowDataFunc.bind(this)} />
	
				<div className="css-topmenu-btnblock" title="退出" onClick={quitSystem}>
					<i className="wevicon wevicon-accounts-quit" />
				</div>
			</div>
			<BirthModal/>
		</div>
	}
}
const LogoArea=({iconurl})=>(
	<div className="css-portal-logo">
		{iconurl != null && iconurl!= "" ? <img src={iconurl}/> : <span>e-cology  | 前端用户中心</span>}
	</div>
)
const mapStateToProps = state => {
	const {PortalHeadStates}=state
    return {
    	headlogo:PortalHeadStates.get("headlogo")
    }
}
module.exports = connect(mapStateToProps)(E8Header)