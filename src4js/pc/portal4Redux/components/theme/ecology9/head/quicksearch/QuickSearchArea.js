import {connect} from 'react-redux'
import {
	Popover,
	Input
} from 'antd';

import QuickSearchMenu from './QuickSearchMenu'

import {selectQuickSearchItem,changeQuickSearchPop} from '../../../../../actions/head'

class QuickSearchArea extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
		return canUpdateComponent(nextState, nextProps, this.state, this.props)
	}
	hideCallBackFunc(event) {
		const {dispatch} = this.props	
		let param = {
			selquicksearchname: $(event.currentTarget).find("span").text(),
			quickSearchForm: $(event.currentTarget).attr("data-form"),
			quickSearchType: $(event.currentTarget).attr("data-searchtype"),
		}
		dispatch(selectQuickSearchItem(param))
		this.expandCallBackFunc(false)
	}
	expandCallBackFunc(visible) {
		const {dispatch} = this.props
		dispatch(changeQuickSearchPop(visible))
	}
	changeSearchBlockStyle(type) {
		if (type == 'in') {
			$(".css-topmenu-searchblock").addClass("css-topmenu-searchblock-over");
		}else{
			$(".css-topmenu-searchblock").removeClass("css-topmenu-searchblock-over");
		}
	}
	submitQuickSearch() {
		const {quickSearchForm,quickSearchType} = this.props;
		let searchvalue = $("#portal-search-input").val();
		var url = quickSearchForm + "?searchtype=" + quickSearchType + "&searchvalue=" + searchvalue;
		if (quickSearchType == '5') {
			url = '#/workflow/queryFlow?requestname='+searchvalue;
		}
		this.props.showMenuData(2, url)
	}
	render() {
		const {quickSearchMenuList,selquicksearchname,quicksclass,quicksvisible} = this.props	
		return <div className="css-topmenu-btnblock css-topmenu-searchblock"
		onMouseEnter={this.changeSearchBlockStyle.bind(this,'in')} onMouseLeave={this.changeSearchBlockStyle.bind(this,'out')}>
			<div>
				<Popover visible={quicksvisible} onVisibleChange={this.expandCallBackFunc.bind(this)} 
					content={<QuickSearchMenu onClick={this.hideCallBackFunc.bind(this)} quickSearchMenuList={quickSearchMenuList.toJSON()}/>}
					placement="bottomLeft"  trigger="click" overlayClassName="css-topmenu-popover-newtop" >
					<span className={quicksclass}>
						{selquicksearchname}
						<i className="wevicon wevicon-topmenu-Arrow" />
					</span>
				</Popover>
				<span>
					<Input id="portal-search-input" placeholder="搜索内容…" _noMultiLang="true" onPressEnter={this.submitQuickSearch.bind(this)}/>
				</span>
				<i className="wevicon wevicon-topmenu-search" onClick={this.submitQuickSearch.bind(this)}/>
			</div>
		</div>
	}
}

const mapStateToProps = state => {
    const {PortalHeadStates,PortalHeadQuickSearchStates,PortalHeadPopOverStates}=state
    return {
    	quickSearchMenuList:PortalHeadStates.get("quickSearchMenuList"),
    	quicksvisible:PortalHeadPopOverStates.get("quicksvisible"),
    	quicksclass:PortalHeadPopOverStates.get("quicksclass"),
    	selquicksearchname:PortalHeadQuickSearchStates.get("selquicksearchname"),
	    quickSearchForm:PortalHeadQuickSearchStates.get("quickSearchForm"),
	    quickSearchType:PortalHeadQuickSearchStates.get("quickSearchType")
    }
}
module.exports = connect(mapStateToProps)(QuickSearchArea)