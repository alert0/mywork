import { Checkbox } from 'antd'

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
		
		if(!nextProps.isselecttab){
			this.setState({ checked: false });
		}
		
		return this.state.checked !== nextState.checked;
	}

	render() {
		const { item, updateSelectIds, isselecttab } = this.props;
		const { checked } = this.state;

		return(
			<div className="node-item">
				<div className="checkbox"><Checkbox checked={checked} onChange={this.selectOne.bind(this,updateSelectIds,item.ids)}/></div>
				<div className="nodename"><span>{item && item.nodename}</span></div>
				<div className="operatos"><span>{item && item.names}</span></div>
			</div>
		)
	}

	selectOne(updateSelectIds, ids, e) {
		this.setState({ checked: e.target.checked });
		updateSelectIds(e.target.checked, ids);
	}
}