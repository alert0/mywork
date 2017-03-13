import {WeaScroll} from 'weaCom';

const portalMenuIdKeyMap = {
	"1": "workflow",
	"2": "doc",
	"3": "crm",
	"4": "project",
	"5": "hrm",
	"6": "meeting",
	"7": "fa",
	"80": "cowork",
	"94": "kpi",
	"107": "message",
	"110": "reportform",
	"111": "news",
	"140": "schedule",
	"144": "car",
	"199": "photo",
	"263": "schedule",
	"352": "cs",
	"392": "blog",
	"536": "email",
	"540": "license",
	"559": "ws",
	"616": "official",
	"635": "investigate",
	"-2080": "license",
	"-6597": "satisfaction",
	"-7565": "store"
}
export default class TopMenu extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
        return canUpdateComponent(nextState, nextProps, this.state, this.props)
    }
	render() {
		const {topMenuList} = this.props
		var items = [];
		topMenuList.forEach((item) => {
			items.push(<TopMenuItem key={item.infoId} name={item.name} menuid = {item.infoId} {...this.props}/>)
		});
		return <WeaScroll typeClass="scrollbar-macosx" className="css-topmenu-scroll"  conClass="css-topmenu-scroll" conHeightNum={0}>
			<div className="css-topmenu-show" > 
				{items} 
			</div>
		</WeaScroll>
	}
}
const TopMenuItem =({menuid,iconurl,name,onClick,selectedId})=>(
	<div className={"css-topmenu-item wevicon-portal-color" + (Math.abs(menuid) & 7) + (selectedId == menuid ? ' css-topmenu-item-selected' : '') }
		title={name} data-menuid={menuid} onClick={onClick}>
		<div className="css-topmenu-item-cover">
			<div className="css-topmenu-item-icon">
				{(iconurl!=null  && iconurl!=undefined) ? <img src={iconurl}/> : 
				<i className={"wevicon wevicon-portal-"+portalMenuIdKeyMap[menuid]+" wevicon-portal-default"}/>}
			</div>
			<div className="css-topmenu-item-text">
				<span>{name}</span>
			</div>
		</div>
	</div>
)