import './style/index.css'
import { WeaInputCtrl } from 'ecCom'
import { Radio } from 'antd';
const RadioGroup = Radio.Group;

class main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value ? props.value : '0'
		};
	}

	doChange(e) {
		this.setState({
			value: e.target.value
		});
		this.props.onChange && this.props.onChange(e.target.value);
	}

	render() {
		const { value } = this.state;
		const { viewattr, fieldid, showname } = this.props;
		const isview = viewattr === 1 || viewattr === '1';
//		console.log("------------isview", isview, "fieldid", fieldid, "viewattr", viewattr, "value", value, "showname", showname);

		/**
		 * fieldid 值说明：
		 * -1 ： 请求标题
		 * -2：  紧急程度
		 * -3：  短信提醒
		 * -4：  签字意见
		 * -5：  微信提醒
		 * -9： 打印次数
		 */
		let el;
		if(fieldid == -1) {
			if(isview) {
				el = <span>{value}</span>
			} else {
				el = <WeaInputCtrl  viewattr={viewattr} fieldname={`field${fieldid}`} value={value} style={{'height':'25px','width':'90%'}} onChange={this.doChange.bind(this)}/>
			}
		} else if(fieldid == -2) {
			if(isview) {
				el = <span>{showname}</span>
			} else {
				el = <RadioGroup onChange={this.doChange.bind(this)} value={value}>
						<Radio value="0">正常</Radio>
        				<Radio value="1">重要</Radio>
        				<Radio value="2">紧急</Radio>
					</RadioGroup>
			}
		} else if(fieldid == -3) {
			if(isview) {
				el = <span>{showname}</span>
			} else {
				el = <RadioGroup onChange={this.doChange.bind(this)} value={value}>
						<Radio value="0">不短信提醒</Radio>
        				<Radio value="1">离线短信提醒</Radio>
        				<Radio value="2">在线短信提醒</Radio>
					</RadioGroup>
			}
		} else if(fieldid == -4) {

		} else if(fieldid == -5) {
			if(isview) {
				el = <span>{showname}</span>
			} else {
				el = <RadioGroup onChange={this.doChange.bind(this)} value={value}>
						<Radio value="0">不提醒</Radio>
        				<Radio value="1">提醒</Radio>
					</RadioGroup>
			}
		} else if(fieldid == -9) {
			el = <span>{value}</span>
		}

		return(
			<div className="wea-system-field">
				{el}
			</div>
		)
	}
}

export default main