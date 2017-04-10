import { formatData } from '../../util/formatdata';
import { Table } from 'antd';
//我的邮件
class MailCom extends React.Component {
	render() {
		const { currTab, list, esetting, olist } = this.props;
		let operHtml = null;
		if (esetting.opershow === "true" && currTab === 'unread') {
			operHtml = <div className="mail-sparator"><font className="mail-sparator-font">邮件服务器上的新邮件:&nbsp;{olist.map(item=> <span>{item.name}({item.number})</span>)}&nbsp;<a href="javascript:void(0);" onClick={openLinkUrl.bind(this,"/email/new/MailFrame.jsp?" + new Date().getTime())}>进入我的邮件收取</a></font></div>;
		}
		return <div>
			{list.length !== 0 ? <Table columns={formatData(list[0], esetting)} showHeader={false} pagination={false} dataSource={list} size="small"/> : null}
			{operHtml}
          </div>
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
MailCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(MailCom);
export default MailCom;