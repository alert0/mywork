class SignInput extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		const { requestType ,markInfo} = this.props;
		if(requestType > 0) {
			const isSignWorkflow_edit = markInfo.get('isSignWorkflow_edit');
			const isannexupload_edit = markInfo.get('isannexupload_edit');
			const isSignDoc_edit = markInfo.get('isSignDoc_edit');
			const  haswfresource = (isSignWorkflow_edit == '1' || isannexupload_edit == '1' || isSignDoc_edit=='1');
			var _ue = UEUtil.initRemark('remark', false,haswfresource);
			bindRemark(_ue);
			const that  = this;
			_ue.addListener('contentChange', function() {
				const html = UE.getEditor("remark").getContent();
				that.props.onChange && that.props.onChange(html);
			});
		}
	}
	
	render(){
		const {markInfo,isShowSignInput} = this.props;
		const signInputInfo  = markInfo.toJS();
		let signInputHiddebArea = [];
		markInfo && markInfo.mapEntries(o => {
			let _value = o[1];
			if(o[0] == 'phraseInfo' && _value) {
				_value = JSON.stringify(_value.toJS());
			}
			signInputHiddebArea.push(<input type="hidden" id={o[0]+"_param"} value={_value}/>)
		});
		return (
			    <div style={{"display":isShowSignInput ?"block":"none"}} className='remarkDiv'>
            		<textarea name="remark" id="remark" style={{"width":"100%","height":"140px","margin":"0","resize": "none","color":"#a2a2a2","overflow":"hidden","color":"#c7c7c7"}}>
            			{signInputInfo.remark}
            		</textarea>
            		 <input type="hidden" id="signdocids" name="signdocids" value={signInputInfo.signdocids}/>
            		 <input type="hidden" id="signworkflowids"name="signworkflowids" value={signInputInfo.signworkflowids}/>
            		 <input type="hidden" name="remarkLocation" id="remarkLocation" value={signInputInfo.remarkLocation}></input>
		             <input type="hidden" id="field-annexupload" name="field-annexupload" value={signInputInfo.annexdocids}/>
                     <input type="hidden" id="field_annexupload_del_id" value=""/>
                     <input type="hidden" name="field-annexupload-name" id="field-annexupload-name" value={signInputInfo.fieldannexuploadname}/>
                     <input type="hidden" name="field-annexupload-count" id="field-annexupload-count" value=""/>
                     <input type="hidden" name="field-annexupload-request" id="field-annexupload-request" value={signInputInfo.requestid}/>
                     <input type="hidden" name="field-cancle" id="field-cancle" value=" 删除 "/>
                     <input type="hidden" name="field-add-name" id="field-add-name" value="点击添加附件 "/>
                     <input type="hidden" name='annexmainId' id='annexmainId' value={signInputInfo.annexmainId}/>
                     <input type="hidden" name='annexsubId' id='annexsubId' value={signInputInfo.annexsubId}/>
                     <input type="hidden" name='annexsecId' id='annexsecId' value={signInputInfo.annexsecId}/>
                     <input type="hidden" name='fileuserid' id='fileuserid' value={signInputInfo.fileuserid}/>
                     <input type="hidden" name='fileloginyype' id='fileloginyype' value={signInputInfo.fileloginyype}/>
                     <input type="hidden" name='annexmaxUploadImageSize' id='annexmaxUploadImageSize' value={signInputInfo.annexmaxUploadImageSize}/>
                     <input type="hidden" id="requestid_param" value={signInputInfo.requestid} />
                     {signInputHiddebArea}
            	</div>
		)
	}
	
}
export default SignInput