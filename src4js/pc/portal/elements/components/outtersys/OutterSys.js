import { Row, Col } from 'antd';
//集成登录元素
class OutterSysCom extends React.Component {
	render() {
		const { data, esetting } = this.props;
		const { disouttyName, disouttyimag, displaytype, linkmode, displayLayout } = esetting;
		const num = parseInt(displayLayout); //显示布局 几列
		const { imgs } = data;
		const list = data.data;
		const colArr = new Array;
		for (var i = 0; i < num; i++) {
			colArr.push(i);
		}
		let html = colArr.map((i) => {
			if ('1' === displaytype) { //左图式
				let dhtml = '1' === disouttyName ? list.map((obj, j) => {
					const n = i + j;
					const item = list[n];
					if (!_isEmpty(item)) {
						return <div style={{height:'36px',paddingTop:'6px'}}><a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl,linkmode)}>{item.name}</a></div>
					}
				}, num) : null;
				let ihtml = '1' === disouttyimag ? imgs.map((obj, j) => {
					const n = i + j;
					const item = list[n];
					const img = imgs[n];
					if (!_isEmpty(item)) {
						return <div><a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl,linkmode)}><img src={img.url}/></a></div>
					}
				}, num) : null;
				return <div>
				<Col span={1}>{ihtml}</Col>
          		<Col span={24/num - 1}>{dhtml}</Col>
      		</div>
			} else { //上图式
				let ohtml = list.map((obj, j) => {
					const n = i + j;
					const item = list[n];
					const img = imgs[n];
					let dHtml = !_isEmpty(item) && '1' === disouttyName ? <div style={{height:'36px',paddingTop:'6px'}}><a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl,linkmode)}>{item.name}</a></div> : null;
					let iHtml = !_isEmpty(img) && '1' === disouttyimag ? <div><a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl,linkmode)}><img src={img.url}/></a></div> : null;
					return <div>
						{iHtml}{dHtml}
					</div>
				}, num);
				return <div style={{textAlign:'center'}}>
          		<Col span={24/num}>{ohtml}</Col>
      		</div>
			}
		});
		return <Row>{html}</Row>
	}
}


import { WeaErrorPage, WeaTools } from 'ecCom';
class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return (
			<WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
		);
	}
}
OutterSysCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(OutterSysCom);
export default OutterSysCom;