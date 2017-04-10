import { Select } from 'antd';
const Option = Select.Option;
import { ELEMENT_URLS } from '../../constants/ActionTypes';
//计划报告元素
class PlanCom extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: props.data,
		}
	}
	changeYear(year) { //改变年份
		const data = this.state.data;
		let params = data.params;
		params['year'] = year;
		params['type1'] = data.type1;
		this.getPlanViewData(params);
	}
	changeType(type) { //选择周报或月报
		const data = this.state.data;
		let params = data.params;
		params['year'] = data.year;
		params['type1'] = type;
		this.getPlanViewData(params);
	}
	changeWeek(type) { //切换周数
		if (type === 1 && parseInt(this.state.data.inttype2) !== parseInt(this.state.data.maxWeekNum)) {
			this.changeType2(1);
		} else if (type === -1 && parseInt(this.state.data.inttype2) !== 1) {
			this.changeType2(-1);
		}
	}
	changeMonth(type) { //切换月数
		if (type === 1 && parseInt(this.state.data.inttype2) !== 12) {
			this.changeType2(1);
		} else if (type === -1 && parseInt(this.state.data.inttype2) !== 1) {
			this.changeType2(-1);
		}
	}
	changeType2(type) {
		const data = this.state.data;
		let inttype2 = parseInt(data.inttype2) + type;
		let params = data.params;
		params['year'] = data.year;
		params['type1'] = data.type1;
		params['type2'] = inttype2;
		this.getPlanViewData(params);
	}
	getPlanViewData(params) {
		WeaTools.callApi(ELEMENT_URLS.PLAN_TAB_URL, 'POST', params, 'json').then((data) => {
  			this.setState({
				data: data,
			});
        }, (result) => {
            console.log(result);
        });
	}
	render() {
		const data = this.state.data;
		const { type, mess, url, showYear, showType2, weekdate1, weekdate2, type1, msg, planData } = data;
		if (type !== undefined) {
			return <div className="plan-view">
				<span style={{fontSize: '13px'}}>提示：<font style={{color:'red'}}>{mess}{type === '2' ? <a href={url} target="_blank">设置</a> : null}</font></span>
			</div>
		}
		let { isweek, ismonth, currentyear, inttype2, maxWeekNum } = data;

		isweek = parseInt(isweek);
		ismonth = parseInt(ismonth);
		currentyear = parseInt(currentyear);
		inttype2 = parseInt(inttype2);
		maxWeekNum = parseInt(maxWeekNum);

		let planShowhtml = <div>{msg}</div>;
		if (msg === '') {
			const { esetting, list } = planData;
			if (undefined !== planData.msg) {
				planShowhtml = <div>{planData.msg}</div>
			} else {
				planShowhtml = <Table columns={formatData(list[0], esetting)} pagination={false} dataSource={list} size="small"/>
			}
		}
		let html = null;
		if (type1 === '1') {
			html = <div className="month-sel">
					<span className={`week_btn1 ${inttype2 !== 1 ? 'week_prev' : ''}`} onClick={this.changeMonth.bind(this,-1)}></span>
					<span className={`week_month`}>{showType2+' 月'}</span>
					<span className={`week_btn2 ${inttype2 !== 12 ? 'week_next' : ''}`} onClick={this.changeMonth.bind(this,1)}></span>
				</div>
		} else if (type1 === '2') {
			html = <div className="month-sel">
					<span className={`week_btn1 ${inttype2 !== 1 ? 'week_prev' : ''}`} onClick={this.changeWeek.bind(this,-1)}></span>
					<span className={`week_month`}>{'第 '+showType2+' 周'}</span>
					<span className={`week_btn2 ${inttype2 !== maxWeekNum ? 'week_next' : ''}`} onClick={this.changeWeek.bind(this,1)}></span>
				</div>
		} else {
			html = <div className="tab2_panel" style={{width:' 1px',borderRight: '0px'}}></div>
		}
		let yearArr = new Array;
		for (var i = 2013; i < (currentyear + 4); i++) {
			yearArr.push(i);
		}
		return <div className="plan-view">
			<table>
				<tr>
					<td className="plan-title">
						<Select defaultValue={showYear} style={{ width: 70 }} onChange={this.changeYear.bind(this)}>
							{yearArr.map(y=><Option value={y}>{y}</Option>)}
					    </Select>
					</td>
					{isweek===1 ? <td className={`plan-title ${type1 === '2' ? 'selected' : ''}`} onClick={this.changeType.bind(this,2)}>周报</td>:null}
					{ismonth===1 ? <td className={`plan-title ${type1 === '1' ? 'selected' : ''}`} onClick={this.changeType.bind(this,1)}>月报</td>:null}
					<td className="plan-title sel-month-week">{html}</td>
				</tr>
			</table>
			<div id="planShow">{planShowhtml}</div>
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
PlanCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(PlanCom);
export default PlanCom;