import {connect} from 'react-redux'

class ToolBarBtns extends React.Component {
	render() {
		const {toolbaritems,clickCallBack}=this.props
		var items = [];

		toolbaritems.toJSON().forEach((item) => {
			items.push(<ToolbarItem key={item.key} data={item} clickCallBack={clickCallBack}/>)
		});
		return <span>
			{items}
		</span>
	}
}
const ToolbarItem=({data,clickCallBack})=>(
	<div className={"css-topmenu-btnblock  css-topmenu-toolbar css-topmenu-"+data.key} 
		title={data.name} onClick={()=>clickCallBack(data.opentype,data.url,data.name)}>
		<i className={"wevicon wevicon-topmenu-"+data.key} />
		{data.isShowName=='1' ? <span>{data.name}</span>:""}
	</div>
)
const mapStateToProps = state => {
    const {PortalHeadStates}=state
    return {toolbaritems:PortalHeadStates.get("toolbaritems")}
}
module.exports = connect(mapStateToProps)(ToolBarBtns)