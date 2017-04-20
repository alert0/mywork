import { is } from 'immutable'
import { WeaSelectCtrl } from 'ecCom'

class SelectElement extends React.Component {
	componentWillMount() {
		const { actions, baseInfo } = this.props;
		actions.initTriLinkage(baseInfo);
	}
	shouldComponentUpdate(nextProps) {
		return !is(this.props.fieldValue, nextProps.fieldValue) ||
			this.props.baseInfo !== nextProps.baseInfo ||
			!is(this.props.cellObj, nextProps.cellObj) ||
			!is(this.props.fieldObj, nextProps.fieldObj);
	}
	componentWillUpdate(nextProps) {
		if(is(this.props.fieldObj, nextProps.fieldObj) && !is(this.props.fieldValue, nextProps.fieldValue)) {
			//值变化触发联动
			const { actions, baseInfo } = this.props;
			actions.triggerAllLinkage(baseInfo);
		}
	}
	doChangeEvent(value) {
		const valueInfo = { value: value };
		const { actions, baseInfo } = this.props;
		actions.changeFieldValue(baseInfo, valueInfo);
	}

	render() {
		const { baseInfo, cellObj, fieldObj, fieldValue } = this.props;
		const viewattr = baseInfo.viewAttr;
		const detailtype = fieldObj ? fieldObj.get("detailtype") : "";
		const fieldid = cellObj.get("field");
		const isdetail = fieldObj && (fieldObj.get("isdetail") == "1");

		let theValue = fieldValue && fieldValue.has("value") ? fieldValue.get("value").toString() : "";
		let showname = fieldValue && fieldValue.get("showname");

		const selectitemlist = fieldObj.getIn(['selectattr', 'selectitemlist']).toJS();
		let options = [];
		options.push({ 'value': '', 'showname': '' });
		selectitemlist && selectitemlist.map(o => {
			options.push({ 'value': o.selectvalue, 'showname': o.selectname });
		});

		return(
			<WeaSelectCtrl viewattr={viewattr} 
        				   fieldname={`field${fieldid}`} 
        				   style={{'width':'100px'}} 
        				   value={theValue} 
        				   options={options} 
        				   onChange={this.doChangeEvent.bind(this)}/>
		)
	}
}

export default SelectElement