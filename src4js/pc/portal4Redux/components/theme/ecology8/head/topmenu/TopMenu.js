import {WeaScroll} from 'weaCom';

export default class TopMenu extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
        return canUpdateComponent(nextState, nextProps, this.state, this.props)
    }
	render() {
		const {topMenuList} = this.props
		var items = [];
		topMenuList.forEach((item) => {
			items.push(<TopMenuItem key={item.infoId} name={convertNameToTwo(item.customTopName)} menuid = {item.infoId} {...this.props}/>)
		});
		return <div className="css-topmenu-show" > 
			{items} 
		</div>
	}
}
const TopMenuItem =({menuid,iconurl,name,onClick})=>(
	<div className="css-topmenu-item" title={name} data-menuid={menuid} onClick={onClick}>
		<span>{name}</span>
	</div>
)