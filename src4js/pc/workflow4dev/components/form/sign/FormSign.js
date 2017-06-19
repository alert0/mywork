import trim from 'lodash/trim'
import SignInput from './SignInput'
class FormSign extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { actions, requestType, isShowSignInput ,markInfo} = this.props;
		const isHideInput = markInfo.get("isHideInput");
		const isSignMustInput = markInfo.get("isSignMustInput");
		const isshowsigninputdiv = requestType > 0 && isHideInput == '0';
		const defaultshowsigninput = isshowsigninputdiv && trim(markInfo.get("remark")).length > 0 ;
		const isBeagent  = markInfo.get("tempbeagenter") != markInfo.get("fileuserid");
		const tempbeagentername = markInfo.get("tempbeagentername");
		return(
			<div id="remark_div" className="wea-req-workflow-signInput" style={{'height':'100%','display':isshowsigninputdiv?'block':'none'}} >
        		<div id="remarkShadowDiv" className='wea-workflow-req-sign-input' style={{"display":(defaultshowsigninput || isShowSignInput )?"none":"block","border-left":isSignMustInput == '1'?"2px solid #fe4e4c":'1px solid #d0d0d0'}} onClick={this.initremark.bind(this)}>
            		<i className="icon-xxx-form-Opinion" style={{marginRight:10}}/>{'签字意见' + ( isBeagent ? `（您正在代理${tempbeagentername}处理）` : '')}
            	</div>
				<SignInput  markInfo={markInfo} requestType={requestType} isShowSignInput={isShowSignInput || defaultshowsigninput}/>
        	</div>
		)
	}

	initremark() {
		const { actions } = this.props;
		actions.controlSignInput(true);
		var _ue = UE.getEditor('remark');
		_ue.focus(true);
	}
}

export default FormSign