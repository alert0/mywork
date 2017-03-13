//Flash元素
class Flash extends React.Component {
	render() {
		const { eid, data } = this.props;
		return <div id={`flash_play_${eid}`} style={{width:'100%',height:data.height +'px',overflowY:'hidden'}}>
			<embed width="100%" height={data.height +'px'} wmode="opaque" name="plugin" src={data.url} type="application/x-shockwave-flash"/>
		</div>
	}
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
Flash = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Flash);

export default Flash;