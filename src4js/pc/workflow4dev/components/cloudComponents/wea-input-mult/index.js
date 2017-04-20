import './style/index.css'
import { Input } from 'antd'

class main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value ? props.value : ""
		};
	}

	componentWillReceiveProps(nextProps) {
		if(this.state.value !== nextProps.value) {
			this.setState({
				value: nextProps.value
			});
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.value !== this.props.value ;
	}

	componentDidMount() {
		const { detailtype, fieldid } = this.props;
		const that = this;
		if(detailtype === 2 || detailtype === '2') {
			const editorid = 'field' + fieldid;
			let _ue = UEUtil.initEditor(editorid);
			_ue.addListener('contentChange', function() {
				const html = UE.getEditor(editorid).getContent();
				that.setState({ value: html });
				that.props.onChange && that.props.onChange(html);
			});
		}
	}

	render() {
		const { viewattr, fieldid, detailtype, textheight, length } = this.props;
		const isHtmlArea = detailtype === 2 || detailtype === '2';

		let styleInfo = { 'word-break': 'break-all', 'word-wrap': 'break-word' };
		if(isHtmlArea) {
			styleInfo.width = '90%';
		} else {
			styleInfo.width = '80%';
		}

		let eles;
		if(viewattr === 1) {
			if(isHtmlArea) {
				eles = <div style={{overflowX:"auto",overflowY:"hidden"}} dangerouslySetInnerHTML={{__html: theValue}} />
			} else {
				eles = <span id={"field"+fieldid+"span"} dangerouslySetInnerHTML={{__html: theValue}}></span>
			}
		} else {
			if(isHtmlArea) {
				eles = <textarea id={`field${fieldid}`} name={`field${fieldid}`} rows={textheight}  style={styleInfo}/>;
			} else {
				eles = <Input type="textarea" autosize={{minRows:textheight}} id={`field${fieldid}`} name={`field${fieldid}`} onBlur={this.setTextareaValue.bind(this)} style={styleInfo}/>;
			}
		}
		return(
			<div className="wea-input-mult">
				{eles}
        	</div>
		)
	}

	setTextareaValue(e) {
		this.setState({
			value: e.target.value
		});
		this.props.onChange && this.props.onChange(e.target.value);
	}
}

export default main