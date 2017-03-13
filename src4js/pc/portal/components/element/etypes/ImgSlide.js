import { Carousel } from 'antd';
//多图元素
class ImgSlide extends React.Component {
	componentDidMount() {
		const { eid } = this.props;
		let stdom = $("#imgslide_" + eid + " .setting");
		$("#imgslide_" + eid).hover(
			() => $(stdom).css("display", "block"),
			() => $(stdom).css("display", "none")
		);
	}
	render() {
		const { eid, data } = this.props;
		const imgsrclist = data.imgsrclist;
		return <div className={'imgslide'} id={`imgslide_${eid}`}>
					<div className="carousel">
						<Carousel>
							{imgsrclist.map(src=> <div style={{height:'260px',overflow:'hidden'}}><img style={{textAlign:'center'}} src={src}/></div>)}
						</Carousel>
					</div>
					<div className="setting">
						<img src="/page/element/imgSlide/resource/image/ssetting.png" height="28px" width="28px" onClick={openImgSlideSettingWin.bind(this,eid)} title="设置"/>
					</div>
				</div>
	}
}
const openImgSlideSettingWin = eid => {
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	dialog.URL = "/page/element/imgSlide/detailsetting.jsp?eid=" + eid;
	dialog.Title = "详细设置";
	dialog.Width = 680;
	dialog.Height = 768;
	dialog.normalDialog = false;
	dialog.callbackfun = function(paramobj, id1) {};
	dialog.show();
}

import { WeaErrorPage, WeaTools } from 'weaCom';
class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return (
			<WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
		);
	}
}
ImgSlide = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(ImgSlide);
export default ImgSlide