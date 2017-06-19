import { Input, InputNumber,message } from 'antd'
import cloneDeep from 'lodash/cloneDeep'
import trim from 'lodash/trim'
import classNames from 'classnames'
import './style/index.css'

class Main extends React.Component {
	constructor(props) {
		super(props);
		const formatvalue = this.transFormatValue(props.value, props.format);
		this.state = {
			value: props.value ? props.value : '',
			formatvalue:formatvalue,
			isonfocus:false
		};
	}
	componentWillReceiveProps(nextProps) {
		if(this.state.value !== nextProps.value || this.props.format !== nextProps.format || nextProps.defaultFocus) {
			const formatShowValue = this.transFormatValue(nextProps.value, nextProps.format);
			let _state = {
				value: nextProps.value,
				formatvalue:formatShowValue
			};
			if(nextProps.defaultFocus !== this.props.defaultFocus && nextProps.defaultFocus){
				_state.isonfocus = true;
			}
			this.setState(_state);
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.value !== this.props.value ||
			nextProps.viewAttr !== this.props.viewAttr ||
			nextState.value !== this.state.value ||
			nextState.isonfocus !== this.state.isonfocus ||
			nextState.formatvalue !== this.state.formatvalue||
			nextProps.format !== this.props.format||
			nextProps.fieldName !== this.props.fieldName;
	}
	
	componentDidUpdate(){
		const {isonfocus,value} = this.state;
		if(isonfocus){
			const input = this.refs.inputEle.refs.input;
			if(input != document.activeElement){
				input.focus();
				const index = trim(value).length;
				input.setSelectionRange(index, index);
			}
		}
	}
	
	render() {
		const {value,isonfocus,formatvalue} = this.state;
		let {viewAttr,style,fieldName,detailtype,qfws,format} = this.props;
		style["padding-right"] = "10px";
		let tempValue = value;
		if(detailtype !==1){
			tempValue = trim(value).length > 0 ? value.replace(/\,/g,'') : '';
		}
		const numberType = parseInt(format.numberType)||0;
		if(!isonfocus && numberType === 100){
			return this.formatFinancial(tempValue,format.finaNum);
		}
		let el;
		//必填
		const requiredClass = classNames({
			'input_required': (viewAttr === 3) && trim(value).length === 0,
		});
		let reqstyle = {};
		const chinglish = detailtype === 4 ? this.numberChangeToChinese(tempValue) : "";
		if(viewAttr === 1){
			if(detailtype === 4){
				el = (
						<div>
							<span className="ant-input-wrapper">{formatvalue}</span>
							<span className="ant-input-wrapper">{chinglish}</span>
						</div>
					)
			}else{
				el = <span style={{"line-height":"30px"}}>{formatvalue}</span>
			}
		}else{
			if(detailtype === 2){ //整数
				el = <Input ref="inputEle" 
							value={isonfocus?value:formatvalue}
							onChange={this.setInputText.bind(this)} 
							onKeyPress={this.doKeyPressCheckInteger.bind(this)}
							onFocus={this.doFocusEvent.bind(this,true)} 
							onBlur={this.doFocusEvent.bind(this,false)}
							style={reqstyle}/>
			}else if(detailtype === 3 || detailtype === 5){ //浮点数
				el = <Input ref="inputEle" 
							value={isonfocus?tempValue:formatvalue}
							onChange={this.setInputText.bind(this)} 
							onKeyPress={this.doKeyPressCheckFloat.bind(this)} 
							onFocus={this.doFocusEvent.bind(this,true)} 
							onBlur={this.doFocusEvent.bind(this,false)} 
							style={reqstyle}/>
			}else if(detailtype === 4){//金额转换
				el = (
					<div>
	        			<Input ref="inputEle" value={isonfocus?value:formatvalue}  
	        				onChange={this.setInputText.bind(this)}
	        				onKeyPress={this.doKeyPressCheckFloat.bind(this)} 
	        				onFocus={this.doFocusEvent.bind(this,true)} 
	        				onBlur={this.doFocusEvent.bind(this,false)}
	        				style={{'border-bottom-left-radius':0,'border-bottom-right-radius':0}}/>
	        			<Input type="text" disabled={true} value={chinglish} 
	        				style={{'color':'#0f0f0f','border-top':'0px','border-top-left-radius':0,'border-top-right-radius':0}}/>
	        		</div>
				)
			}else {
				el = <Input ref="inputEle"
							type="text"
							value={isonfocus?value:formatvalue}
							onChange={this.setInputText.bind(this)}
							onFocus={this.doFocusEvent.bind(this,true)} 
							onBlur={this.doFocusEvent.bind(this,false)}
							style={reqstyle}
							/>
			}
		}
		
		return(
			viewAttr === 1 ?
				<span className="wea-input-ctrl">
					{el}
					<input type="hidden" id={fieldName} name={fieldName} value={value}/>
				</span>
				:
				<div className={`wea-input-ctrl ${requiredClass}`} style={style}>
	                {el}
	                <input type="hidden" id={fieldName} name={fieldName} value={value}/>
	            </div>
		)
	}
	setInputText(e) {
		const {detailtype,length,fieldlabel} = this.props;
		let value  = e.target.value;
		if(detailtype === 1) {
			let valLen = window.realLength(value);
			if(length && valLen > length) {
				message.warning(`${fieldlabel}文本长度不能超过${length},(1个中文字符等于3个长度)`);
				value  =  window.checkLength(value,valLen,length);
			}
		}
		this.setState({value:value});
	}
	
	formatSaveValue(value){
		const {detailtype,qfws} = this.props;
		let formatvalue = value;
		if(detailtype != 1){
			let isqfw = detailtype === 5;
			formatvalue = window.formatFloatValue(value,qfws,isqfw);
		}
		this.props.onChange && this.props.onChange(formatvalue);
		return formatvalue;
	}
	
	transFormatValue(value,format){
		let {detailtype,qfws} = this.props;
		let tempValue = value;
		if(detailtype !==1){
			tempValue = trim(value).length > 0 ? value.replace(/\,/g,'') : '';
		}
		let formatvalue = tempValue;
		const numberType = parseInt(format.numberType)||0;
		//失去焦点
		if(numberType > 0){
			if(numberType === 100 ){ //财务预览
				//return this.formatFinancial(tempValue,format.finaNum);	
			}else if(numberType === 101 ){ //财务金额大写
				formatvalue = this.numberChangeToChinese(tempValue);
			}else{
				formatvalue = window.convertFormatValue(tempValue,format);
			}
		}else{
			if(detailtype !==1){
				let isqfw = false;
				if(detailtype === 4 || detailtype === 5){
					isqfw = true;
				}
				formatvalue = window.formatFloatValue(tempValue,qfws,isqfw);
			}
		}
		return formatvalue;
	}
	
	doFocusEvent(bool,e){
		if(bool){
			this.setState({isonfocus:bool})
		}else{
			//判断是否是数字
			let value = this.checkLen(e.target.value);
			//验证长度
			let formatSaveValue = this.formatSaveValue(value);
			let formatShowValue = this.transFormatValue(value, this.props.format);
			this.setState({value:formatSaveValue,formatvalue:formatShowValue,isonfocus:bool});
		}
	}
	
	checkLen(val){
		let {detailtype,length,qfws,fieldlabel} = this.props;
		if(detailtype === 1) {
			let valLen = window.realLength(val);
			if(length && valLen > length) {
				message.warning(`${fieldlabel}文本长度不能超过${length},(1个中文字符等于3个长度)`);
				val  =  window.checkLength(val,valLen,length);
			}
			return val;
		}
		if(trim(val).length === 0 ) return "";
		if(trim(val).length === 1 && val.charCodeAt(0) === 45) return val;
		if(!window.isNum(val)) return "";
		if(val.charCodeAt(0) === 45) length = length + 1;
		const arr = val.toString().split(".");
		if(trim(arr[0]).length > length - qfws) {
			message.warning(`整数位数长度不能超过${length-qfws}位，请重新输入！`,5);
			return "";
		}
		return val;
	}
	
	//整数
	doKeyPressCheckInteger(e) {
		const keyCode = e.nativeEvent.keyCode;
		const {value} = this.state;
		let {length} = this.props;
		const isNumber = (keyCode >= 48 && keyCode <= 57) || keyCode === 45;
		const selectLen = trim(window.getSelection().toString()).length;
		if(trim(value).length > 0 && value.charCodeAt(0) === 45) length = length +1;
		if(keyCode === 45 && trim(value).length === length){
			const carePos =  this.getCursortPosition();
			if(carePos === 0){
				length = length +1;
			}
		}
		if(!isNumber || (trim(value).length - selectLen) >= length ) {
			e.preventDefault()
		}
	}

	//检测小数输入
	doKeyPressCheckFloat(e) {
		const {length,qfws} = this.props;
		const keyCode = e.nativeEvent.keyCode;
		let tmpvalue = this.state.value;
		const selectVal = window.getSelection().toString();
		if(selectVal.length > 0 && trim(tmpvalue).length > 0){
			const curPosition  = this.getCursortPosition();
			tmpvalue = tmpvalue.substr(0,curPosition) + tmpvalue.substr(curPosition + selectVal.length);
		}
		// 排除backspance 和del
		if(keyCode == 8) {
			return;
		}
		
		if(trim(tmpvalue).length === 0 && keyCode == 46){
			e.preventDefault();
		}

		let dotCount = 0;
		let integerCount = 0;
		let afterDotCount = 0;
		let hasDot = false;
		const len = trim(tmpvalue).length;
		for(i = 0; i < len; i++) {
			if(tmpvalue.charAt(i) == ".") {
				dotCount++;
				hasDot = true;
			} else {
				if(hasDot) {
					afterDotCount++;
				} else {
					integerCount++;
				}
			}
		}
		//只能输入一个"."
		if(keyCode == 46 && (hasDot || qfws === 0)){
			e.preventDefault();
		}
		
		//console.log("dotCount",dotCount,"integerCount",integerCount,"hasDot",hasDot,"afterDotCount",afterDotCount,"keyCode",keyCode);
		const isNumber = keyCode >= 48 && keyCode <= 57;
		const checkInput  = (isNumber || keyCode == 46 || keyCode == 45) || (keyCode == 46 && dotCount == 1); 
		if(!checkInput) {
			e.preventDefault()
		}
		const checkInteger = integerCount >= length - qfws && hasDot == false && isNumber; 
		if(checkInteger) {
			e.preventDefault()
		}
		
		const checkLen = afterDotCount >= qfws && (integerCount >= length - qfws);
		if(checkLen) {
			e.preventDefault()
		}
		
		if(hasDot){
			const carePos =  this.getCursortPosition();
			const dotIndex = trim(tmpvalue).indexOf('.');
			//console.log("carePos",carePos,"dotIndex",dotIndex);
			if(carePos <= dotIndex){
				if(integerCount >= length - qfws){
					e.preventDefault();
				}
			}else{
				if(afterDotCount >= qfws){
					e.preventDefault();
				}
			}
		}
	}
	
	getCursortPosition() {
		const input = this.refs.inputEle.refs.input;
	    var CaretPos = 0; 
	    if (input.selection) {
	        input.focus();
	        var Sel = input.selection.createRange();
	        if(Sel.text.length < 1) {
	            Sel.moveStart('character', -input.value.length);
	            CaretPos = Sel.text.length;
	        }
	    } else if (input.selectionStart || input.selectionStart == '0') { //ff
	        CaretPos = input.selectionStart;
	    }
	    return CaretPos;
	}

	numberChangeToChinese(num) {
		//HTML模式下明细字段在加载页面时候会首先执行一次该方法，如果为null和空字符串则会显示成 零元整
		if(num == "") {
			return "";
		}

		var prefh = "";
		if(!isNaN(num)) {
			if(num < 0) {
				prefh = "负";
				num = Math.abs(num);
			}
		}
		if(isNaN(num) || num > Math.pow(10, 12)) return "";
		var cn = "零壹贰叁肆伍陆柒捌玖";
		var unit = new Array("拾佰仟", "分角");
		var unit1 = new Array("万亿万", "");
		var numArray = num.toString().split(".");
		var start = new Array(numArray[0].length - 1, 2);

		function toChinese(num, index) {
			var num = num.replace(/\d/g, function($1) {
				return cn.charAt($1) + unit[index].charAt(start-- % 4 ? start % 4 : -1);
			});
			return num;
		}

		for(var i = 0; i < numArray.length; i++) {
			var tmp = "";
			for(var j = 0; j * 4 < numArray[i].length; j++) {
				var strIndex = numArray[i].length - (j + 1) * 4;
				var str = numArray[i].substring(strIndex, strIndex + 4);
				var start = i ? 2 : str.length - 1;
				var tmp1 = toChinese(str, i);
				tmp1 = tmp1.replace(/(零.)+/g, "零").replace(/零+$/, "");
				// tmp1 = tmp1.replace(/^壹拾/, "拾")
				tmp = (tmp1 + unit1[i].charAt(j - 1)) + tmp;
			}
			numArray[i] = tmp;

		}

		numArray[1] = numArray[1] ? numArray[1] : "";
		numArray[0] = numArray[0] ? numArray[0] + "圆" : numArray[0], numArray[1] = numArray[1].replace(/^零+/, "");
		numArray[1] = numArray[1].match(/分/) ? numArray[1] : numArray[1] + "整";
		var money = numArray[0] + numArray[1];
		money = money.replace(/(亿万)+/g, "亿");
		if(money == "整") {
			money = "零圆整";
		} else {
			money = prefh + money;
		}
		return money;
	}
	
	formatFinancial(theValue,finaNum){
		const financialValues = this.transFinancialArr(theValue);
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
			<div className="findiv" onClick={this.doFocusEvent.bind(this,true)}>
                <table className="fintable">
                    <tr>{showTds}</tr>
                </table>
            </div>
		)
	}
	
	transFinancialArr(fieldVal) {
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
}

export default Main;