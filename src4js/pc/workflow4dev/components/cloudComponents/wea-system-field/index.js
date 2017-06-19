import './style/index.css'
import {is} from 'immutable'
import { Radio } from 'antd';
import { Map } from 'immutable'
import SignInput from '../../form/sign/SignInput'
import WeaInputCtrl from '../wea-input-ctrl/index'
import trim from 'lodash/trim'
const RadioGroup = Radio.Group;


class main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value ? props.value : ''
		};
	}
	componentWillReceiveProps(nextProps) {
		if(this.state.value !== nextProps.value) {
			this.setState({value: nextProps.value});
		}
	}

	doChangeEvent(e) {
		this.setState({
			value: e.target.value
		});
		this.props.onChange && this.props.onChange(e.target.value);
	}
	
	doChangeValue(val){
		this.setState({
			value: val
		});
		this.props.onChange && this.props.onChange(val);
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}
	
	/**
	 * fieldid 值说明：
	 * -1 ： 请求标题
	 * -2：  紧急程度
	 * -3：  短信提醒
	 * -4：  签字意见
	 * -5：  微信提醒
	 * -9： 打印次数
	 */

	render() {
		let { value } = this.state;
		const { viewAttr, fieldid,fieldName,markInfo,requestType,defaultFocus} = this.props;
		const isview = viewAttr === 1;
		let el;
		let req = "";
		let remarkDivStyle = {};
		if(fieldid == -1) {
			if(isview) {
				el = <span>{value}</span>
			} else {
				return <WeaInputCtrl viewAttr={viewAttr} fieldName={fieldName} detailtype={1} format={{}} defaultFocus={defaultFocus} value={value} style={{'height':'100%','width':'90%'}} onChange={this.doChangeValue.bind(this)}/>
			}
		} else if(fieldid == -2) {
			value = value == '' ? '0':value;
			const map2 = Map({'0':'正常','1':'重要','2':'紧急'});
			if(isview) {
				el = <span>{map2.get(value)}</span>
			} else {
				el = <RadioGroup onChange={this.doChangeEvent.bind(this)} value={value}>
						{map2.map((v,k)=>{
							return <Radio value={k}>{v}</Radio>
						})}
					</RadioGroup>
			}
		} else if(fieldid == -3) {
			value = value == '' ? '0':value;
			const map3 = Map({'0':'不短信提醒','1':'离线短信提醒','2':'在线短信提醒'});
			if(isview) {
				el = <span>{map3.get(value)}</span>
			} else {
				el = <RadioGroup onChange={this.doChangeEvent.bind(this)} value={value}>
						{map3.map((v,k)=>{
							return <Radio value={k}>{v}</Radio>
						})}
					</RadioGroup>
			}
		} else if(fieldid == -4) {
			//签字意见相关
			const hasLoadMarkInfo = markInfo && markInfo.get('hasLoadMarkInfo');
			//console.log("hasLoadMarkInfo",hasLoadMarkInfo,"requestType",requestType);
			if(requestType > 0 && hasLoadMarkInfo ){
				const isSignMustInput = markInfo.get("isSignMustInput");
				if(isSignMustInput == "1" && trim(value).length === 0){
					req = "remark_required";
					remarkDivStyle['padding-right'] = "10px";
				}
				el = <div id="remark_div">
						<SignInput  markInfo={markInfo} requestType={requestType} isShowSignInput={true} onChange={this.doChangeValue.bind(this)}/>
					 </div>
			}
		} else if(fieldid == -5) {
			value = value == '' ? '0':value;
			const map5 = Map({'0':'不提醒','1':'提醒'});
			if(isview) {
				el = <span>{map5.get(value)}</span>
			} else {
				el = <RadioGroup onChange={this.doChangeEvent.bind(this)} value={value}>
        				{map5.map((v,k)=>{
							return <Radio value={k}>{v}</Radio>
						})}
					</RadioGroup>
			}
		} else if(fieldid == -9) {
			el = <span>{trim(value).length === 0 ? "0":value}</span>
		}

		return(
			<div className={`wea-system-field ${req}`} style={remarkDivStyle}>
				{el}
				<input type="hidden" name={fieldName} id={fieldName} value={value} />
			</div>
		)
	}
}

export default main