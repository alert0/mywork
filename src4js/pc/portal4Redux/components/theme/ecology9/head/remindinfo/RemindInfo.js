import {Icon} from 'antd';
export default class RemindInfo extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
        return canUpdateComponent(nextState, nextProps, this.state, this.props)
    }
	render() {
		const {remindInfoList,onClick} = this.props
		var items = []
		remindInfoList.forEach((item) => {
			items.push(<div className="css-topmenu-remindinfo-item" key={item.key} 
				data-type="2" data-url={item.url} title={item.name} onClick={onClick}>
					<span className="css-topmenu-remindinfo-name">
						{item.key=='nodata'?(<span><Icon type="exclamation-circle-o" />{item.name}</span>):item.name}
					</span>
					<span className="css-topmenu-remindinfo-num">{item.count}</span>
				</div>)
		})
		return <div className="css-topmenu-remindinfo-show">
			{items}
		</div>
	}
}
