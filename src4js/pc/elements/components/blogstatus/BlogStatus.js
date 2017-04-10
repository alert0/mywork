import { Table } from 'antd';
import { formatData } from '../../util/formatdata';
//微博动态元素
class BlogStatusCom extends React.Component {
	render() {
		const { list, esetting } = this.props;
		return <div>{list.length !== 0 ? <Table columns={formatData(list[0], esetting)} showHeader={false} pagination={false} dataSource={list} size="small"/> : null}</div>
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
BlogStatusCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(BlogStatusCom);
export default BlogStatusCom;
