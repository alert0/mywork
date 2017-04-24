import './style/index.css'
import { Checkbox } from 'antd'

class main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value ? props.value : '0'
		};
	}

	doChange(e){
		const value  = e.target.checked ? '1':'0';
		this.state = {
			value: value
		};
		
		this.props.onChange && this.props.onChange(value);
	}


	render() {
		const { viewattr,fieldid ,value} = this.props;
		const isview = viewattr === 1 || viewattr === '1';
		console.log("isview",isview,"viewattr",viewattr,"value",value);
		return (
			<div className="wea-checkbox-ctrl">
				<Checkbox disabled = {isview} defaultChecked={value == '1'} onChange={this.doChange.bind(this)}/>
				<input type='hidden' id={`field${fieldid}`} name={`field${fieldid}`} value={value}/>
			</div>
		)
	}
}

export default main