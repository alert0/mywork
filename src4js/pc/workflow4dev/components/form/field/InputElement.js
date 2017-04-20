import { is } from 'immutable'
import { WeaInputCtrl } from 'ecCom'

class InputElement extends React.Component {
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
	doChangeEvent(e) {
		const valueInfo = { value: e.target.value };
		const { actions, baseInfo } = this.props;
		actions.changeFieldValue(baseInfo, valueInfo);
	}

	render() {
		const { actions, baseInfo, cellObj, fieldObj, fieldValue } = this.props;
		const viewattr = baseInfo.viewAttr;
		const detailtype = fieldObj ? fieldObj.get("detailtype") : "";
		const fieldid = cellObj.get("field");
		const isdetail = fieldObj && (fieldObj.get("isdetail") == "1");

		let theValue = fieldValue && fieldValue.has("value") ? fieldValue.get("value").toString() : "";
		const financial = cellObj.get("financial");
		if(financial && financial.indexOf("2-") > -1) { //财务表览
			const financialValues = transFinancialArr(theValue);
			const finaNum = parseInt(financial.split("-")[1] || "3");
			let showTds = new Array();
			for(let i = finaNum - 1; i >= 0; i--) {
				let itemBorder = "fborder1";
				if(i === 0)
					itemBorder = "";
				else if(i === 2)
					itemBorder = "fborder2";
				else if((i - 2) % 3 === 0)
					itemBorder = "fborder3";
				itemBorder = "finborder " + itemBorder;
				showTds.push(<td className={itemBorder}>{financialValues[i]||""}</td>)
			}
			return(
				<div className="findiv">
                    <table className="fintable">
                        <tr>{showTds}</tr>
                    </table>
                </div>
			)
		}
		//console.log("theValue",theValue,"cellObj",cellObj.toJS(),"fieldObj",fieldObj.toJS());
		const length = fieldObj.get('length');
		const qfws = fieldObj.get('qfws');
		return(
			<WeaInputCtrl viewattr={viewattr} 
		        		length={length} 
		        		qfws={qfws} 
		        		fieldname={`field${fieldid}`} 
		        		style={{'height':'25px','width':'90%'}}
		        		isdetail={isdetail}
		        		onChange={this.doChangeEvent.bind(this)}
		        		value={theValue} 
		        		financial={financial}
        		/>
		)
	}
}

export default InputElement

function transFinancialArr(fieldVal) {
	if(!!!fieldVal) fieldVal = "0";
	fieldVal = fieldVal.replace(/,/g, "");
	var valArr = new Array();
	var reg1 = /^(-?\d+)(\.\d+)?$/;
	var reg2 = /^(-?\d*)(\.\d+)$/; //解决类型-.22这种格式
	if(reg1.test(fieldVal) || reg2.test(fieldVal)) {
		fieldVal = parseFloat(fieldVal).toFixed(2);
		if((fieldVal.length > 2 && fieldVal.substring(0, 2) == "0.") || (fieldVal.length > 3 && fieldVal.substring(0, 3) == "-0.")) {
			fieldVal = fieldVal.replace("0.", ".");
		}
		for(var i = fieldVal.length - 1; i >= 0; i--) {
			var valc = fieldVal.charAt(i);
			if(valc != ".")
				valArr.push(valc);
		}
	}
	return valArr;
}