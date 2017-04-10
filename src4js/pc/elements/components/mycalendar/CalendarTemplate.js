import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Calendar } from 'antd';
import * as CalendarTemplateAction from '../../actions/mycalendar/calendartemplate';
import Immutable from 'immutable';
global.currentMonth = new Date().format("yyyy-MM");
//日历日程元素
class CalendarTemplate extends React.Component {
	constructor(props) {
		super(props)
		const { eid, data, actions } = props;
		//刷新url或点击门户或刷新日历日程元素重置currentSelectDate为系统当前日期
		currentSelectDate = new Date().format("yyyy-MM-dd");
		actions.initMyCalendarDatas(eid, data.toJSON());
	}
	onPanelChange(value, mode) {
		const { eid, actions } = this.props;
		actions.getMyCalendarDatas(value, mode, eid);
	}
	componentDidMount() {
		const { eid, data, actions } = this.props;
		$("#calendar_" + eid + " .ant-fullcalendar-cell").attr("onclick", "clickCalendarDay(this,'" + eid + "')");
		actions.loadMyCalendarEvents(eid, data.toJSON());
		window.getMyCalendarDatas = actions.getMyCalendarDatas.bind(this);
	}
	render() {
		const { eid, userid, data } = this.props;
		let caldata = data.toJSON();
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


import { WeaErrorPage, WeaTools } from 'ecCom';
class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return (
			<WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
		);
	}
}
CalendarTemplate = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(CalendarTemplate);

const mapStateToProps = state => {
	const { calendartemplate } = state;
	return ({
		data: calendartemplate.get("data")
	})
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators(CalendarTemplateAction, dispatch)
	}
}

function mergeProps(stateProps, dispatchProps, ownProps) {
	return {
		data: stateProps.data.get(ownProps.eid) || Immutable.fromJS(ownProps.data),
		eid: ownProps.eid,
		userid: ownProps.userid,
		actions: dispatchProps.actions
	};
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CalendarTemplate);