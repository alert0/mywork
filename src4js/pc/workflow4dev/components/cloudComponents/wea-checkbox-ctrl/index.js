import './style/index.css'
import { Checkbox } from 'antd'

class main extends React.Component {
	constructor(props) {
		super(props);
	}

	doChange(e){
		const value  = e.target.checked ? '1':'0';
		this.props.onChange && this.props.onChange(value);
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.value !== this.props.value ||
			nextProps.viewAttr !== this.props.viewAttr ||
			nextProps.fieldName !== this.props.fieldName;
	}

	render() {
		const { viewAttr,fieldName ,value} = this.props;
		return (
			<div className="wea-checkbox-ctrl" style={{margin:"0"}}>
				<Checkbox disabled = {viewAttr === 1} checked={value == '1'} onChange={this.doChange.bind(this)}/>
				<input type='hidden' id={fieldName} name={fieldName} value={value}/>
			</div>
		)
	}
}

export default main