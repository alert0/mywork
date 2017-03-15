//股票元素
class Stock extends React.Component {
	render() {
		const { data, esetting } = this.props;
		const { linkmode, width, height } = esetting;
		let html = data.map(item => <div>
		      <a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl,linkmode)}>
		        <img style={{ width: width, height: height }} src={item.imgUrl} border='0'/>
		      </a>
	      </div>);
		return <div style={{textAlign:'center'}}>{html}</div>
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
Stock = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Stock);
export default Stock;