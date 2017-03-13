import {WeaScroll} from 'weaCom';
import {FreqUseMenuItem} from '../FreqUseMenuItem';

export default class TopHrmInfo extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
        return canUpdateComponent(nextState, nextProps, this.state, this.props)
    }
    quitClick(event){
    	this.props.onClick(event);
    	quitSystemForRoute();
    }
    changeAccountClick(event,singleUser){
    	if($(event.target).attr("class") == "css-topmenu-hrminfo-username" || !singleUser){
    		this.props.onClick(event);
    	}
    	changeAccount(event,singleUser)
    }
	render() {
		const {onlyUser,datalist} = this.props
		var items = []
		var singleUser = false;
		if (datalist.length == 1) {
			singleUser = true;
		}
		if (true) { //
			datalist.forEach((item) => {
				items.push(<HrmInfoItem key={item.userid} data={item} singleUser={singleUser} onClick={this.changeAccountClick.bind(this)}/>)
			});
		}

		return <div className={"css-topmenu-hrminfo-show"+(items.length>0?"":"-nochange")}>
		<WeaScroll typeClass="scrollbar-macosx" className="css-topmenu-hrminfo-itemarea"  conClass="css-topmenu-hrminfo-itemarea" conHeightNum={0}>
		<div>{items}</div>
		</WeaScroll>
		{onlyUser ? "" :<ul className="css-topmenu-frequse-ul">
				<FreqUseMenuItem  className="css-topmenu-frequse-item" key={1} name="个性化设置" type="2"  url="/systeminfo/menuconfig/CustomSetting.jsp" icon={<i className="wevicon wevicon-accounts-Set-up" />} {...this.props} />
				<FreqUseMenuItem className="css-topmenu-frequse-item" key={2} name="修改密码" type="1"  url="/hrm/HrmTab.jsp?_fromURL=HrmResourcePassword" icon={<i className="wevicon wevicon-accounts-Password" />} {...this.props} />
				<FreqUseMenuItem className="css-topmenu-frequse-item" key={3} name="主题中心" type="1"  url="/wui/theme/ecology8/page/skinTabs.jsp" icon={<i className="wevicon wevicon-accounts-skin" />} {...this.props} />
				<FreqUseMenuItem className="css-topmenu-frequse-item" key={4} name="退出" url="" icon={<i className="wevicon wevicon-accounts-quit" />} onClick={this.quitClick.bind(this)}/>
			</ul>}
		</div>
	}
}

const HrmInfoItem = ({data,singleUser,onClick}) => {
	var singleLineStyle = {};
	let {icon,userid,username,jobs,subcompanyid,deptid,iscurrent,subcompanyname,deptname}= data
	if (icon == null || icon == undefined) {
		icon = "/messager/images/icon_m_wev8.jpg"
	}
	var sbuAndDept = subcompanyname + "/" + deptname
	if (sbuAndDept == "/") {
		sbuAndDept = "";
		singleLineStyle = {
			"lineHeight": "50px"
		}
	}
	if (singleUser) {
		iscurrent = "0"
	}
	return <div className="css-topmenu-hrminfo-item" data-userid={userid} onClick={ (event)=>onClick(event,singleUser)}>
		<div className="css-topmenu-hrminfo-icon">
			<img src={icon}/>
		</div>
		<div className="css-topmenu-hrminfo-text" style={singleLineStyle}>
			<span title={username} className = "css-topmenu-hrminfo-username">{username}</span>
			<span title={jobs} className = "css-topmenu-hrminfo-jobs">{jobs}</span>

			<br/>
			<span title={sbuAndDept} className = "css-topmenu-hrminfo-dept">{sbuAndDept}</span>
		</div>
		{iscurrent == "1" ? <img className = "css-topmenu-hrminfo-checked" src="/images/check.png"/> :""}
	</div>
}