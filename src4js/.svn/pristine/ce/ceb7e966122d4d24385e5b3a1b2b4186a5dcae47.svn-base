//公告栏元素
class Notice extends React.Component {
	componentDidMount() {
		const { eid, data } = this.props;
		const { direction, scrollDelay } = data;
		$("#notice_marq" + eid).attr({
			direction: direction,
			onmouseout: 'this.start()',
			onmouseover: 'this.stop()',
			scrollAmount: '1',
			align: 'bottom',
			scrollDelay: scrollDelay,
			scrollleft: '0',
			scrolltop: '0'
		});
	}
	render() {
		const { eid, data } = this.props;
		const { content, onlytext, title, img } = data;
		let chtml = onlytext === 'yes' ? <span>{content}</span> : <span dangerouslySetInnerHTML={{__html: content}}></span>
		let width = '95%';
		let thtml = null;
		if (title) {
			width = '75%';
			thtml = <div style={{float:'left',marginLeft:'5px',width:'20%'}}>{title}</div>;
		}
		return <div>
				<div style={{float:'left',marginLeft:'5px'}}><img src={img}/></div>
				{thtml}
				<div style={{float:'right',marginLeft:'10px',width:width}}>
				<marquee id={`notice_marq${eid}`} >
				{chtml}
			</marquee></div>
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
Notice = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Notice);
export default Notice;