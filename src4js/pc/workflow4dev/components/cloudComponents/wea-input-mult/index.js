import './style/index.css'	
import { Input } from 'antd'
import trim from 'lodash/trim'

class main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value ? props.value : "",
			hasInitEditor:false
		};
	}

	componentWillReceiveProps(nextProps) {
		if(this.state.value !== nextProps.value) {
			this.setState({
				value: nextProps.value
			});
			
			const {fieldName,detailtype,viewAttr} = this.props;
			if(detailtype === 2 && viewAttr !== 1){
				const arr  = UE.editors.filter(o=>o==fieldName);
				arr.length > 0 && UE.getEditor(fieldName).setContent(nextProps.value,false);
			}
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.value !== this.props.value ||
			   nextProps.viewAttr !== this.props.viewAttr ||
			   this.state.value !== nextState.value;
	}

	componentDidMount() {
		const { detailtype, fieldName ,viewAttr} = this.props;
		const that = this;
		if(detailtype === 2 && viewAttr !== 1) {
			let _ue = UEUtil.initEditor(fieldName);
			_ue.addListener('contentChange', function() {
				const html = UE.getEditor(fieldName).getContent();
				that.setState({ value: html });
				that.props.onChange && that.props.onChange(html);
			});
		}
	}

	render() {
		const {value} = this.state;
		const { viewAttr, fieldid, detailtype, textheight, length ,fieldName, style} = this.props;
		style["padding-right"] = "10px";
		let styleInfo = { 'word-break': 'break-all', 'word-wrap': 'break-word' ,'width':'100%'};
		const requiredClass = (viewAttr === 3) && trim(value).length === 0 ? 'textArea_required':'';
		let eles;
		if(detailtype === 2) {
			return (
				<div className={`wea-input-mult ${requiredClass}`} style={style}>
					<div style={{overflowX:"auto",overflowY:"hidden",display:viewAttr===1?"block":"none"}} dangerouslySetInnerHTML={{__html: value}} />
					<div style={{"display":viewAttr !== 1?"block":"none"}}>
						<textarea id={fieldName} name={fieldName} rows={textheight} value={value} style={styleInfo}/>
					</div>
				</div>
			)
		} else {
			if(viewAttr === 1){
				return <span id={fieldName+"span"} dangerouslySetInnerHTML={{__html: value}}></span>
			}else{
				return (
						<div className={`wea-input-mult ${requiredClass}`} style={style}>
							<Input   type="textarea"
										autosize={{minRows:textheight,maxRows:textheight}} 
										value={value}  
										id={fieldName} 
										name={fieldName} 
										style={styleInfo}
										onBlur={this.doBlueEvent.bind(this)} 
										onChange={this.doChangeEvent.bind(this)}
								/>
						</div>
					   )
			}
		}
	}

	doBlueEvent(e) {
		this.props.onChange && this.props.onChange(e.target.value);
	}
	
	doChangeEvent(e){
		this.setState({
			value:e.target.value
		})
	}
}

export default main