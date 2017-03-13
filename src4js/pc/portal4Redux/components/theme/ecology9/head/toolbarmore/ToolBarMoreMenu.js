import {connect} from 'react-redux'
import {FreqUseMenuItem} from '../FreqUseMenuItem';

export default class ToolBarMoreMenu extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
        return canUpdateComponent(nextState, nextProps, this.state, this.props)
    }
	render() {
		const {toolbarMoreList} = this.props
		var items = [];
		toolbarMoreList.forEach((item) => {
			items.push(<FreqUseMenuItem className="css-topmenu-frequse-item css-topmenu-toolbar-item" 
				key={item.id} name={item.name} url={item.url} icon={<i className={"wevicon wevicon-toolbar-"+item.id} />}
				type = {item.linkmode} {...this.props}/>)
		});
		return <div className="css-topmenu-toolbar-show">
			<ul className="css-topmenu-frequse-ul">{items}</ul>
		</div>
	}
}