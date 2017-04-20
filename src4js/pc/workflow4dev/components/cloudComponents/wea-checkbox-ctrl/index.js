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
		const { fieldid ,value} = this.props;
		return (
			<Checkbox defaultChecked={value == '1'} id={`field${fieldid}`} name={`field${fieldid}`} onChange={this.doChange.bind(this)}/>
		)
	}
}

export default main