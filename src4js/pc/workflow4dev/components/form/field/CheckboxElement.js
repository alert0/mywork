import { is } from 'immutable'
import WeaCheckboxCtrl from '../../cloudComponents/wea-checkbox-ctrl/index'

class CheckboxElement extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !is(this.props.fieldValue, nextProps.fieldValue) ||
			this.props.baseInfo !== nextProps.baseInfo ||
			!is(this.props.cellObj, nextProps.cellObj) ||
			!is(this.props.fieldObj, nextProps.fieldObj);
	}

	doChangeEvent(value) {
		const valueInfo = { value: value };
		console.log("CheckboxElement", value);
		const { actions, baseInfo } = this.props;
		actions.changeFieldValue(baseInfo, valueInfo);
	}
	render() {
		const { baseInfo, cellObj, fieldObj, fieldValue } = this.props;
		const fieldid = cellObj.get("field");
		const isdetail = fieldObj && (fieldObj.get("isdetail") == "1");

		let theValue = fieldValue && fieldValue.has("value") ? fieldValue.get("value").toString() : "0";
		return(
			<WeaCheckboxCtrl fieldid={fieldid} value={theValue} onChange={this.doChangeEvent.bind(this)}/>
		)
	}
}

export default CheckboxElement