 // homepage.jsp页面组件
 import React, {
 	Component
 } from 'react';
 import {
 	bindActionCreators
 } from 'redux'
 import {
 	connect
 } from 'react-redux'
 import * as HomepageAction from '../../actions/homepage/';

 import {
 	WeaPopoverHrm
 } from 'weaCom';

 //引入元素组件
 import LayoutFlags from './LayoutFlags';

 //门户组件
 class Homepage extends Component {
 	render() {
 		let hpdata = this.props.hpdata;
 		if (hpdata) hpdata = hpdata.toJSON();
 		let hpHtml = null;
 		let styleStr = "";
 		if (!_isEmptyObject(hpdata)) {
 			const layoutObj = {
 				layoutFlags: hpdata.hpinfo.layoutFlags,
 				bLayoutid: hpdata.hpinfo.bLayoutid,
 				layoutHtml: hpdata.hpinfo.html
 			};
 			//将style标签转成字符串，解决ie8下出错的问题
 			styleStr = "<style type='text/css'>" + hpdata.hpCss.replace(/\"/g, "") + "</style>";
 			hpHtml = hpdata.hasRight === 'true' ? <LayoutFlags layoutObj={layoutObj}/> : <NoRightPage/ >
 		}
 		return <div className='homepage'>
			<WeaPopoverHrm/>
			<div dangerouslySetInnerHTML={{__html: styleStr}}></div>
	        <input type="hidden" value="btnWfCenterReload" id="btnWfCenterReload" name="btnWfCenterReload"/>
	        {hpHtml}
     </div>;
 	}
 }
 const mapStateToProps = state => {
 	const {
 		homepage
 	} = state;
 	return ({
 		hpdata: homepage.get("hpdata")
 	})
 }

 const mapDispatchToProps = dispatch => {
 	return {
 		actions: bindActionCreators(HomepageAction, dispatch)
 	}
 }
 export default connect(mapStateToProps, mapDispatchToProps)(Homepage);


 //无权限门户
 const NoRightPage = () =>
 	<div className="page-noright">
  <img src="/images/ecology8/noright_wev8.png" width="162px" height="162px"/>
  <div style={{color:'rgb(255,187,14)'}}>对不起，您暂时没有权限！</div>
</div>