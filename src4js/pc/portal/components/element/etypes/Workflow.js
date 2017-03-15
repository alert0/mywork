import { Table } from 'antd';
import { formatData } from '../../../util/formatdata';
class WorkFlow extends React.Component {
	render() {
		let html = null;
		const { eid, data, esetting } = this.props;
		const list = data.data;
		if (!_isEmpty(list)) {
			html = <Table columns={formatData(list[0], esetting)} showHeader={false} pagination={false} dataSource={list} size="small" />
		}
		return <div>{html}</div>;
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
WorkFlow = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(WorkFlow);
export default WorkFlow;
