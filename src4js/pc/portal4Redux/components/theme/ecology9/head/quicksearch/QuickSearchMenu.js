export default class QuickSearchMenu extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
        return canUpdateComponent(nextState, nextProps, this.state, this.props)
    }
	render() {
		const {quickSearchMenuList} = this.props
		var items = [];				
		quickSearchMenuList.forEach((item) => {
			items.push(<QuickSearchItem className="css-topmenu-frequse-item" 
				key={item.key} name={item.name} form={item.form} 
				icon={<i className={"wevicon wevicon-search-"+item.key} />}
				searchType = {item.searchType} {...this.props}/>)
		});
		return <div className="css-topmenu-quicks-show">
			<ul className="css-topmenu-frequse-ul">{items}</ul>
		</div>
	}
}
const QuickSearchItem=({name,form,className,searchType,icon,onClick})=>(
	<li className={className} data-form={form} data-searchtype={searchType} 
	onClick={onClick}>
		{icon}
		<span>{name}</span>
	</li>
)