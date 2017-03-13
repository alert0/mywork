import { Table } from 'antd';
import { formatData } from '../../../util/formatdata';
//多新闻中心元素
class MoreNews extends React.Component {
	render() {
		const { data, esetting } = this.props;
		let html = data.map(item => {
			return <div style={{marginBottom:'8px'}}>
				{item.img !== '' ? <div style={{border:'1px solid #000000',float:'left'}}><img height="142" width="142" src={item.img}/></div>:null}
				<Table columns={formatData(item.data[0], esetting)} showHeader={false} pagination={false} dataSource={item.data} size="small"/>
			</div>
		});
		return <div>{html}</div>
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
MoreNews = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(MoreNews);
export default MoreNews;