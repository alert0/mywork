import './style/index.css'
import { WeaTools } from 'ecCom'

class main extends React.Component {
	constructor(props) {
		super(props);

		WeaTools.
	}

	componentDidMount() {
		const { requestType } = this.props;
		if(requestType == 1) {
			var _ue = UEUtil.initRemark('remark', false);
			bindRemark(_ue);
		}
	}

	render() {
		const { actions, signinputinfo, requestType, isShowSignInput } = this.props;
		const markInfo = requestType == 1 ? signinputinfo.toJS() : '';
		const isHideInput = markInfo.isHideInput;
		const isSignMustInput = markInfo.isSignMustInput;
		const isshowsigninputdiv = requestType == 1 && isHideInput == '0';
		const defaultshowsigninput = isshowsigninputdiv && markInfo.remark != '' && markInfo.remark != null;

		let signInputHiddebArea = [];
		signinputinfo && signinputinfo.mapEntries(o => {
			let _value = o[1];
			if(o[0] == 'phraseInfo' && _value) {
				_value = JSON.stringify(_value.toJS());
			}
			signInputHiddebArea.push(<input type="hidden" id={o[0]+"_param"} value={_value}/>)
		});

		return(
			<div id="remark_div" className="wea-req-workflow-signInput" style={{'height':'100%','display':isshowsigninputdiv?'block':'none','margin-right':(defaultshowsigninput || isShowSignInput )?'0px':'-1px'}} >
        		<div id="remarkShadowDiv" className='wea-workflow-req-sign-input' style={{"display":(defaultshowsigninput || isShowSignInput )?"none":"block","border-left":isSignMustInput == '1'?"2px solid #fe4e4c":'1px solid #d0d0d0'}} onClick={this.initremark.bind(this)}>
            		<i className="icon-xxx-form-Opinion" style={{marginRight:10}}/>{'签字意见' + (markInfo.tempbeagenter != markInfo.fileuserid ? `（您正在代理${markInfo.tempbeagentername}处理）` : '')}
            	</div>
            	<div style={{"display":(defaultshowsigninput || isShowSignInput)?"block":"none"}} className='remarkDiv'>
            		<textarea name="remark" id="remark" style={{"width":"100%","height":"140px","margin":"0","resize": "none","color":"#a2a2a2","overflow":"hidden","color":"#c7c7c7"}}>
            			{markInfo.remark}
            		</textarea>
            		 <input type="hidden" id="signdocids" name="signdocids" value={markInfo.signdocids}/>
            		 <input type="hidden" id="signworkflowids"name="signworkflowids" value={markInfo.signworkflowids}/>
            		 <input type="hidden" name="remarkLocation" id="remarkLocation" value={markInfo.remarkLocation}></input>
		             <input type="hidden" id="field-annexupload" name="field-annexupload" value={markInfo.annexdocids}/>
                     <input type="hidden" id="field_annexupload_del_id" value=""/>
                     <input type="hidden" name="field-annexupload-name" id="field-annexupload-name" value={markInfo.fieldannexuploadname}/>
                     <input type="hidden" name="field-annexupload-count" id="field-annexupload-count" value=""/>
                     <input type="hidden" name="field-annexupload-request" id="field-annexupload-request" value={markInfo.requestid}/>
                     <input type="hidden" name="field-cancle" id="field-cancle" value=" 删除 "/>
                     <input type="hidden" name="field-add-name" id="field-add-name" value="点击添加附件 "/>
                     <input type="hidden" name='annexmainId' id='annexmainId' value={markInfo.annexmainId}/>
                     <input type="hidden" name='annexsubId' id='annexsubId' value={markInfo.annexsubId}/>
                     <input type="hidden" name='annexsecId' id='annexsecId' value={markInfo.annexsecId}/>
                     <input type="hidden" name='fileuserid' id='fileuserid' value={markInfo.fileuserid}/>
                     <input type="hidden" name='fileloginyype' id='fileloginyype' value={markInfo.fileloginyype}/>
                     <input type="hidden" name='annexmaxUploadImageSize' id='annexmaxUploadImageSize' value={markInfo.annexmaxUploadImageSize}/>
                     <input type="hidden" id="requestid_param" value={markInfo.requestid} />
                     {signInputHiddebArea}
            	</div>
        	</div>
		)
	}

	initremark() {
		const { actions } = this.props;
		actions.controlSignInput(true);
		var _ue = UE.getEditor('remark');
		_ue.focus(true);
	}

	initData() {
		const { requestid } = this.props;
		const _this = this;
		WeaTools.callApi('/api/workflow/request/signInput', 'GET', { requestid: requestid }).then(data => {
			const { hasinitremark } = _this.state;
			if(hasinitremark) {
				UE.getEditor('forwardremark').destroy();
				jQuery('#forwardremark_div').find('#_fileuploadphraseblock').remove();
				jQuery('#forwardremark_div').find('#fsUploadProgressfileuploaddiv').remove();
				jQuery('#forwardremark_div').find('#_signinputphraseblock').remove();
			}
			_this.setState({ signinput: data, reload: true, hasinitremark: false });
		});
	}
}

export default main