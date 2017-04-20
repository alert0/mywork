import { Checkbox, Icon } from 'antd'

export default class NodeItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(this.props.selectAll !== nextProps.selectAll) {
			this.setState({ checked: nextProps.selectAll });
		}

		if(this.props.selecttab !== nextProps.selecttab) {
			this.setState({ checked: false });
		}
		
		if(this.props.selecttab == nextProps.selecttab && this.props.selectnodes !== nextProps.selectnodes){
			this.setState({ checked: nextProps.selectnodes.contains(this.props.item.nodeid)  });
		}
		
		return this.state.checked !== nextState.checked;
	}
	
	showAllOperator(operatornames){
		const {showNodeAllOperatorName} = this.props;
		showNodeAllOperatorName(operatornames);
	}

	render() {
		const { item, updateSelectIds, isselecttab } = this.props;
		const { checked } = this.state;
		const isviewmore = item.names.length > 64;

		return(
			<div className="node-item">
				<div className="checkbox"><Checkbox checked={checked} onChange={this.selectOne.bind(this,updateSelectIds,item.nodeid)}/></div>
				<div className="nodename"><span>{item && item.nodename}</span></div>
				<div className="operatos">
					<span style={{'padding-top' : isviewmore ? '0px' : '10px'}}>{item && item.names}</span>
				</div>
				<div className="viewmore">
					{isviewmore && <Icon type="double-right" onClick={this.showAllOperator.bind(this,item.names)}/>}
				</div>
			</div>
		)
	}

	selectOne(updateSelectIds, users, e) {
		this.setState({ checked: e.target.checked });
		updateSelectIds(e.target.checked, users);
	}
}