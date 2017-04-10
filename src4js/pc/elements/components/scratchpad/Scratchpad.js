import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ScratchpadAction from '../../actions/scratchpad/scratchpad';
//便签元素
class ScratchpadCom extends React.Component {
	shouldComponentUpdate(nextProps){
		return nextProps.data.text !== this.props.data.text
	}
	componentDidUpdate(preProps){
		const { eid,data } = this.props;
		if(preProps.data.text !== data.text){
			$("#scratchpadarea_"+eid).text(data.text);
		}
	}
	render() {
		const { eid, data, actions } = this.props;
		const { userid, height, text } = data;
		return <div id={`scratchpad_${eid}`}>
	           	 <textarea id={`scratchpadarea_${eid}`} style={{width: '100%',height: height,fontSize: '9pt',margin: '0px',fontFamily: 'Verdana'}} onBlur={actions.saveScratchpad.bind(this,eid,userid)}>
            		{text}
	           	 </textarea>
			  </div>
	}
}



import { WeaErrorPage, WeaTools } from 'ecCom';
class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return (
			<WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
		);
	}
}
ScratchpadCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(ScratchpadCom);

const mapStateToProps = state => {
	const { scratchpad } = state;
	return ({
		text: scratchpad.get("text")
	})
}
const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators(ScratchpadAction, dispatch)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(ScratchpadCom);