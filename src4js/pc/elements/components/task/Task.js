import { Table } from 'antd';
import { formatData } from '../../util/formatdata';
//任务元素
class TaskCom extends React.Component {
	render() {
		const { data, esetting } = this.props;
		const display = esetting.display;
		const list = data.data;
		const nlist = new Array;
		list.map(function(item) {
			let i = 0;
			var obj = new Object;
			for (var k in item) {
				if (display[i] === '1') {
					obj[k] = item[k];
				}
				i += 1;
			}
			nlist.push(obj);
		});
		return <Table columns={formatData(nlist[0], esetting)} pagination={false} dataSource={nlist} size="small"/>
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
TaskCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(TaskCom);
export default TaskCom;
