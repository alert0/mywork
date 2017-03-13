import {
	Component
}
from 'react';
import {
	bindActionCreators
} from 'redux';
import {
	connect
} from 'react-redux';
import {
	Calendar
} from 'antd';
import * as MyCalendarAction from '../../../actions/homepage/mycalendar';
global.currentMonth = new Date().format("yyyy-MM");
//日历日程元素
class MyCalendar extends Component {
	constructor(props) {
		super(props)
		const {
			eid,
			data,
			actions
		} = props;
		//刷新url或点击门户或刷新日历日程元素重置currentSelectDate为系统当前日期
		currentSelectDate = new Date().format("yyyy-MM-dd");
		actions.initMyCalendarDatas(eid, data);
	}
	onPanelChange(value, mode) {
		const {
			eid,
			actions
		} = this.props;
		actions.getMyCalendarDatas(value, mode, eid);
	}
	componentDidMount() {
		const {
			eid,
			data,
			actions
		} = this.props;
		$("#calendar_" + eid + " .ant-fullcalendar-cell").attr("onclick", "clickCalendarDay(this,'" + eid + "')");
		actions.loadMyCalendarEvents(eid, data);
		window.getMyCalendarDatas = actions.getMyCalendarDatas.bind(this);
	}
	render() {
		const {
			eid,
			userid
		} = this.props;
		let caldata = this.props.caldata;
		caldata = caldata ? caldata.toJSON() : {};
		$("#calendar_" + eid).find(".ant-fullcalendar-current").removeClass("ant-fullcalendar-current");
		$("#calendar_" + eid).find(".ant-fullcalendar-event").removeClass("ant-fullcalendar-event");
		return <div id={`calendar_${eid}`}>
				<Calendar fullscreen={false} onPanelChange={this.onPanelChange.bind(this)} value={new Date(currentSelectDate)} dateCellRender={dateCellRender.bind(this,eid,caldata)}/>
				<div id={`calendar_content${eid}`} style={{maxHeight:'102px',overflowY:'auto'}}></div>
				<div style={{textAlign:'center'}}><input className="addWorkPlan" type="button" onClick={doAdd.bind(this,userid,eid)} title="添加"/>
				</div>
			</div>
	}
}
const mapStateToProps = state => {
	const {
		mycalendar
	} = state;
	return ({
		caldata: mycalendar.get("caldata")
	})
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators(MyCalendarAction, dispatch)
	}
}

function mergeProps(stateProps, dispatchProps, ownProps) {
	return {
		caldata: stateProps.caldata.get(ownProps.eid),
		data: ownProps.data,
		eid: ownProps.eid,
		userid: ownProps.userid,
		actions: dispatchProps.actions
	};
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MyCalendar);