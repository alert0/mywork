//自定义菜单元素
class CustomMenu extends React.Component {
	render() {
		const { eid, data, esetting } = this.props;
		let style = {};
		if (esetting.menuType === 'menuh') {
			style = {
				float: 'left',
				listStyle: 'none'
			};
		}
		return <div>{handleCustomMenuData(data, esetting.linkmode, style)}</div>
	}
}
const handleCustomMenuData = (data, linkmode, style) => <ul>{data.map(item => <li style={style}><a href={openLinkUrl.bind(this,item.linkUrl,linkmode)}>{item.name}</a>{handleCustomMenuData(item.children)}</li>)}</ul>

import { WeaErrorPage, WeaTools } from 'weaCom';
class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return (
			<WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
		);
	}
}
CustomMenu = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(CustomMenu);
export default CustomMenu;