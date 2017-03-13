import { Select } from 'antd';
const Option = Select.Option;
//期刊中心
class Magazine extends React.Component {
	render() {
		return <div>{props.data.map(item => <MagazineItem item={item} esetting={props.esetting}/>)}</div>
	}
}
class MagazineItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			id: props.item.isselect,
		}
	}
	handleChange(id) {
		this.setState({
			id: id,
		});
	}
	render() {
		const { item, esetting } = this.props;
		const { width, height, linkmode } = esetting; 
		const { selList, linkUrl, isselect, img, strBrief, strImg, title } = item;
		let selHtml = selList.map(sel => <Option value={sel.id}>{sel.label}</Option>);
		return <div>
			      {strImg === '' ? null : <div style={{float:'left',width:parseInt(width)+2,height:parseInt(height)+2,border:'1px solid #000000'}}>
			        <img style={{width:width,height:height}} src={strImg}/>
			      </div>}
			      <div style={{float:'left'}}>
			        <div style={{margin:'5px 0 0 10px'}}>
			          <span><a href="javascript:void(0);" onClick={openLinkUrl.bind(this,linkUrl+isselect,linkmode)}>{title}</a></span>
			        </div>
			        <div style={{margin:'5px 0 0 10px'}}>
			          <span>{strBrief}</span>
			        </div>
			        <div style={{margin:'5px 0 0 10px'}}>
			        	<Select id="bbbbbbbbb" defaultValue={isselect} style={{width:400}} onChange={this.handleChange.bind(this)}>
			        		{selHtml}
			        	</Select>&nbsp;
			        	<a href="javascript:void(0);" onClick={openLinkUrl.bind(this,linkUrl+this.state.id,linkmode)}>
			        		<img style={{marginBottom:'-5px'}} src={img}/>
			        	</a>
			        </div>
			      </div>
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
Magazine = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Magazine);
export default Magazine;