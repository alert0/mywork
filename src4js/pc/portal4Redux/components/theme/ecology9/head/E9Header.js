import {connect} from 'react-redux'

import '../../../../css/e9header.css';

import FreqUseMenuArea from './freqmenu/FreqUseMenuArea';
import HrmInfoArea from './hrminfo/HrmInfoArea';
import QuickSearchArea from './quicksearch/QuickSearchArea';
import RemindInfoArea from './remindinfo/RemindInfoArea';
import ToolBarBtns from './toolbarbtns/ToolBarBtns';
import ToolBarMoreBtnArea from './toolbarmore/ToolBarMoreBtnArea';
import TopMenuArea from './topmenu/TopMenuArea';
import BirthModal from '../../../BirthModal';
import ecLocalStorage from '../../../../util/ecLocalStorage.js';
import {loadToolbarItems,loadAccountInfo,loadQuickSearchMenu,loadLogoSetting
	,loadTopMenu,loadFreqUseMenu,loadToolBarMoreMenu,synRemindInfo,loadBirthInfo} from '../../../../actions/head'

class E9Header extends React.Component {
	componentWillMount() {
		const {dispatch} = this.props

		dispatch(loadToolbarItems())
		
		dispatch(loadAccountInfo())
		
		dispatch(loadLogoSetting())
		
		dispatch(loadQuickSearchMenu())
	}

	componentDidMount() {
		const {dispatch} = this.props
		dispatch(loadTopMenu())
		
		dispatch(loadFreqUseMenu())
		dispatch(loadToolBarMoreMenu())

		this.getRemindInfo();

		this.remindInterval = setInterval(this.getRemindInfo.bind(this), 3 * 60 * 1000)

		this.showBirthInfo()

		//window.hrmcardutil = this.refs.hrmcard
	}

    componentWillUnmount() {
        // 卸载组件，清除消息提醒定时器
        window.clearInterval(this.remindInterval);
    }

	showBirthInfo() {
		if (ecLocalStorage.getStr('e9head', 'showedbirth', true)!= 1) {
			const {dispatch} = this.props
			dispatch(loadBirthInfo('e9head'))
		}
	}
	getRemindInfo() {
		const {dispatch} = this.props
		dispatch(synRemindInfo())
	}
	commonShowDataFunc(event) {
		var type = $(event.currentTarget).attr("data-type")
		var url = $(event.currentTarget).attr("data-url")
		var title = $(event.currentTarget).attr("title")
		this.showMenuData(type, url, title)
	}

	showInLeftFunc(type, id) {
		this.props.onLoadLeftMenu(type, id)
	}
	showMenuData(type, url, title, width, height) {
		if (type == 0) {
			window.open(url)
		} else if (type == 1) {
			if ('/favourite/MyFavourite.jsp' == url) {
				width = 657;
				height = 565;
			} else if ('/weaverplugin/PluginMaintenance.jsp' == url || '/hrm/HrmTab.jsp?_fromURL=licenseInfo' == url) {
				width = 700;
				height = 600;
			} else if ('/systeminfo/version.jsp' == url || '/hrm/HrmTab.jsp?_fromURL=HrmResourcePassword' == url) {
				width = 630;
				height = 400;
			}
			showDialog(url, title, width, height)
		} else if (type == 2 && url != null) {
			if (url.indexOf("#") == 0) {
				this.props.onLoadMain(url.substring(1), "")
			} else {
				this.props.onLoadMain("", url)
			}
		}
	}
	render() {
		const {headlogo,pathname} = this.props
		return <div className="css-portal-headblock">
			<LogoArea iconurl={headlogo}/>
			<TopMenuArea pathname={pathname} clickCallBack={this.showInLeftFunc.bind(this)} />
			<div>	
				<FreqUseMenuArea clickCallBack={this.commonShowDataFunc.bind(this)} />
				
				<QuickSearchArea showMenuData={this.showMenuData.bind(this)}/>
			</div>	
			<div style={{"float":"right"}} className="css-topmenu-rightblock">
				<div id="pluginTd" className="css-topmenu-plugindiv"></div>

				<div className="css-topmenu-splitdiv css-topmenu-splitdiv-margin5"></div>

				<RemindInfoArea clickCallBack={this.commonShowDataFunc.bind(this)} />

				<ToolBarBtns clickCallBack={this.showMenuData.bind(this)}/>

				<ToolBarMoreBtnArea clickCallBack={this.commonShowDataFunc.bind(this)} />
	
 				<div className="css-topmenu-splitdiv css-topmenu-splitdiv-margin5"></div>
 				<HrmInfoArea clickCallBack={this.commonShowDataFunc.bind(this)} />
			</div>	
			<BirthModal/>
		</div>
	}
}

const LogoArea=({iconurl})=>(
	<div className="css-portal-logo">
		{iconurl != null && iconurl!= "" ? <img src={iconurl}/> : "e-cology  | 前端用户中心"}
	</div>
)
const mapStateToProps = state => {
	const {PortalHeadStates}=state
    return {
    	headlogo:PortalHeadStates.get("headlogo")
    }
}
module.exports = connect(mapStateToProps)(E9Header)