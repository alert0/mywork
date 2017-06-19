import './style/index.css'
import { Input, Button } from 'antd'
import trim from 'lodash/trim'
import classNames from 'classnames'

//流程编号
class WeaWfCode extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value ? props.value : '',
		}
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.value !== this.props.value ||
			   nextProps.viewAttr !== this.props.viewAttr ||
			   this.state.value !== nextState.value;
	}


	componentWillReceiveProps(nextProps) {
		if(this.props.value !== nextProps.value) {
			this.setState({
				value: nextProps.value
			});
		}
	}

	render() {
		const {value} = this.state;
		const {fieldName,hasHistoryCode,relateFieldValues,iscreate,viewAttr} = this.props;
		const isShowBtn = !hasHistoryCode && iscreate != '1';
		
		const req = classNames({
			'asterisk': (viewAttr === 3) && trim(value).length === 0
		});
		return(
				viewAttr == 1 ?
					<span>
						{value}
						<input type="hidden" id={fieldName} name={fieldName} value={value}/>
					</span>
					:
					<div className={`wea-wfcode ${req}`} style={{"width":"90%"}}>
						<Input value={value} onChange={this.doChangeEvent.bind(this)} onBlur={this.doBlurEvent.bind(this)}/>
						{isShowBtn && 
							<div>
								<Button size = "small" onClick={this.generateCode.bind(this)}>重新生成编号 </Button>
								<Button size = "small" onClick={this.chooseReservedCode.bind(this)}>选择预留号</Button>
								<Button size = "small" onClick={this.newReservedCode.bind(this)}>新建预留号</Button>
							</div>
						}
						<input type="hidden" id={fieldName} name={fieldName} value={value}/>
					</div>
			)
	}
	
	doChangeEvent(e){
		this.setState({value:e.target.value});
	}
	
	doBlurEvent(e){
		this.props.onChange && this.props.onChange(e.target.value);
	}

	generateCode() {
		const {actions,relateFieldValues} = this.props;
		relateFieldValues.operation = "CreateCodeAgain";
		actions.setWfCode(relateFieldValues);
	}

	chooseReservedCode() {
		const {actions,relateFieldValues} = this.props;
		actions.chooseReservedCode(relateFieldValues);
	}

	newReservedCode() {
		const {actions,relateFieldValues} = this.props;
		actions.newReservedCode(relateFieldValues);
	}
}

export default WeaWfCode