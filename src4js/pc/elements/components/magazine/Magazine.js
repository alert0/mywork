import { Select } from 'antd';
const Option = Select.Option;
//期刊中心
class MagazineCom extends React.Component {
	render() {
		const { eid, data, esetting } = this.props;
		return <table id={`_contenttable_${eid}`} className="Econtent"  width="100%" cellPadding='0' cellSpacing='0'>
			   <tr>	
				<td width="1px"></td>
				 <td width='*' className="valign">
					<table width="100%"  cellPadding='0' cellSpacing='0'>
					{data.map(item => <MagazineItem item={item} esetting={esetting}/>)}
					</table>
				</td>    
				<td width="1px"></td>
			  </tr>
			</table>
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
		const style = {tableLayout:'fixed'};
		const tstyle = {tableLayout:'fixed',paddingBottom:'15px'};
		return <tr>
				<td>
				<table width="100%" className="valign" style={style} >
				<tr>
					<td className="valign" width={parseInt(width)+5}>
					 {strImg === '' ? null :<img style={{width:width,height:height}} src={strImg}/>}
					</td>
					<td  width="*" className="valign">
						<table width="100%" className="magzine" style={tstyle}>
						<tr>
							<td><a href="javascript:void(0);" style={{color:'#666'}} onClick={openLinkUrl.bind(this,linkUrl+isselect,linkmode)}>{title}</a></td>
						</tr>
						<tr className='sparator' style={{height:'1px'}}><td style={{padding:'0px'}}></td></tr>
						<tr>
							<td>{strBrief}</td>
						</tr>						
						</table>						
						<table  width="100%" cellPadding='0' cellSpacing='0' style={tstyle}>
						<tr>
							<td><Select defaultValue={isselect} style={{width:400}} onChange={this.handleChange.bind(this)}>
			        		{selHtml}
			        	</Select>&nbsp;
			        		<a href="javascript:void(0);" onClick={openLinkUrl.bind(this,linkUrl+this.state.id,linkmode)}>
				        		<img style={{marginBottom:'-5px'}} src={img}/>
				        	</a>
			        	</td>
						</tr>
						</table>					
					</td>
				</tr>				
				</table>
			</td>
		</tr>
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
MagazineCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(MagazineCom);
export default MagazineCom;