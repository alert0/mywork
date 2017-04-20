import { is } from 'immutable'
import WeaInputMult from '../../cloudComponents/wea-input-mult/index'

class TextAreaElement extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !is(this.props.fieldValue, nextProps.fieldValue) ||
			this.props.baseInfo !== nextProps.baseInfo ||
			!is(this.props.cellObj, nextProps.cellObj) ||
			!is(this.props.fieldObj, nextProps.fieldObj);
	}

	doChangeEvent(value) {
		const valueInfo = { value: value};
		console.log("TextAreaElement",value);
		const { actions, baseInfo } = this.props;
		actions.changeFieldValue(baseInfo, valueInfo);
	}

	render() {
		const { baseInfo, cellObj, fieldObj, fieldValue } = this.props;
		const detailtype = fieldObj ? fieldObj.get("detailtype") : "";
		const fieldid = cellObj.get("field");
		const isdetail = fieldObj && (fieldObj.get("isdetail") == "1");
		const viewattr = baseInfo.viewattr;
		const textheight = fieldObj ? fieldObj.get('textheight') : 4;
		const length = fieldObj ? fieldObj.get('length') : 4000;

		let theValue = fieldValue && fieldValue.has("value") ? fieldValue.get("value").toString() : "";

		return( <
			WeaInputMult viewattr = { viewattr } 
						fieldid = { fieldid } 
						detailtype = { detailtype } 
						textheight = { textheight } 
						length = { length } 
						value = { theValue } 
						onChange = {this.doChangeEvent.bind(this)}/>
		)
	}
}

export default TextAreaElement