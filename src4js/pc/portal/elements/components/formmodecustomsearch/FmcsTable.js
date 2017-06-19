import { Table } from 'antd';
import { formatData } from '../../util/formatdata';

//建模查询中心元素
class FmcsTable extends React.Component {
	componentDidMount() {
		const { eid, data } = this.props;
		const { rolltype, height } = data.tabsetting
		let attrs = {
			direction: rolltype,
			onmouseover: 'this.stop()',
			onmouseout: 'this.start()',
			scrolldelay: '200'
		};
		if (rolltype === 'up' || rolltype === 'down') {
			attrs['width'] = '100%';
			attrs['height'] = height;
		}
		$("#MARQUEE_" + eid).attr(attrs);
	}
	render() {
		const { eid, data, esetting } = this.props;
		if (data.isRight === "false") {
			return <div style={{height:'40px',lineHeight:'40px',textAlign:'center'}}>{data.data}</div>
		}
		const { tabsetting } = data;
		const list = data.data;
		const { widths, titles, rolltype } = tabsetting;
		esetting['widths'] = widths;
		esetting['titles'] = titles;
		let html = null;
		let showHeader = true;
		var index = 0;
		for (var k in list[0]) {
			index += 1;
		}
		if (index === 1) {
			showHeader = false;
		}
		if (list.length > 0) {
			if (rolltype) {
				html = <marquee id={`MARQUEE_${eid}`}>
	              <Table columns={formatData(list[0], esetting)} showHeader={showHeader} pagination={false} dataSource={list} size="small"/>
	          </marquee>
			} else {
				html = <Table columns={formatData(list[0], esetting)} showHeader={showHeader} pagination={false} dataSource={list} size="small"/>
			}
		}
		return <div>{html}</div>;
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
FmcsTable = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(FmcsTable);
export default FmcsTable