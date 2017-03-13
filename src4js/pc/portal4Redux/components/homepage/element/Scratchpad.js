import {
	Component
} from 'react';
import {
	bindActionCreators
} from 'redux';
import {
	connect
} from 'react-redux';
import * as ScratchpadAction from '../../../actions/homepage/scratchpad';
//便签元素
class Scratchpad extends Component {
	constructor(props) {
		super(props)
		const {
			actions
		} = props;
		actions.initContent(props.data.text);
	}
	render() {
		const {
			eid,
			data,
			text,
			actions
		} = this.props;
		return <div id={`scratchpad_${eid}`}>
	           	 <textarea id={`scratchpadarea_${eid}`} style={{width: '100%',height: data.height,fontSize: '9pt',margin: '0px',fontFamily: 'Verdana'}} onBlur={actions.saveScratchpad.bind(this,eid,'1')}>
            		{text}
	           	 </textarea>
			  </div>
	}
}

const mapStateToProps = state => {
	const {
		scratchpad
	} = state;
	return ({
		text: scratchpad.get("text")
	})
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators(ScratchpadAction, dispatch)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Scratchpad);