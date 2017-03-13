import {connect} from 'react-redux'
import {Spin} from 'antd';

import {loadHrmCarSetting,loadUserInfo,changeHrmCardVisible} from '../actions/hrmcard'

import {changeHrmCardPos} from '../util/hrmcardutils'
import '../css/hrmcard.css';

let sexMap = {
	"Mr.": "（男）",
	"Ms.": "（女）"
}
function showHrmCard(userid, event) {
	var posX = event.pageX;
	var posY = event.pageY;
	var offSet = $(event.currentTarget).offset();
	var eleW = $(event.currentTarget).width();
	var eleH = $(event.currentTarget).height();
	var curPos = changeHrmCardPos(offSet.left, offSet.top, eleW, eleH)
	
	hrmcardutil.changeHrmCardValue(userid, curPos)
}
window.showHrmCard = showHrmCard
class HrmCard extends React.Component {
	componentWillMount() {
		const {dispatch} = this.props
		dispatch(loadHrmCarSetting())
		/*组件第一次加载
		dispatch(loadUserInfo(this.props))*/
	}
	componentDidMount() {
		window.hrmcardutil = this
	}
	changeHrmCardValue(userid, curPos){
		jQuery("#showSQRCodeDiv").hide();
		jQuery("#showSQRCodeDiv").html("");

		const {dispatch} = this.props
		dispatch(loadUserInfo({userid,curPos}))
	}
	openhrmresource() {
		const {curuserid} = this.props
		window.open("/hrm/HrmTab.jsp?_fromURL=HrmResource&id=" + curuserid);
	}
	openmessage() {
		const {curuserid} = this.props
		sendMsgToPCorWeb(curuserid, 0, '', '')
	}
	openemail() {
		const {curuserid} = this.props
		window.open("/email/MailAdd.jsp?isInternal=1&internalto=" + curuserid);
	}
	doAddWorkPlan() {
		const {curuserid} = this.props
		var url = "/workplan/data/WorkPlan.jsp?resourceid=" + curuserid + "&add=1";
		showDialog(url, "新建日程", 800, 500)
	}
	doAddCoWork() {
		const {curuserid} = this.props
		var url = "/cowork/AddCoWork.jsp?hrmid=" + curuserid;
		showDialog(url, "新建协作", 800, 500)
	}
	showQCode() {
		if (jQuery("#showSQRCodeDiv").is(":hidden"))
			jQuery("#showSQRCodeDiv").show();
		else
			jQuery("#showSQRCodeDiv").hide();
	}
	closeDiv(){
		const {dispatch} = this.props
		dispatch(changeHrmCardVisible(false))
		jQuery("#showSQRCodeDiv").hide();
		jQuery("#showSQRCodeDiv").html("");
	}
	render() {			
		const {messageshow,emailshow,workplanshow,coworkshow,userinfo,left,top,visible,imgloaded} = this.props
		const {userimg,name,sex,code,qrcode,dept,
			sub,job,manager,status,mobile,tel,email,location} = userinfo.toJSON()
		let visibleStyle = {
			"display": visible ?"block":"none",
			"top":top+"px",
			"left":left+"px",
		}
		let imgStyle = {
			"display": "none",
		}
		let loadingStyle = {
			"display": "block",
		}
		if(imgloaded){
			imgStyle.display="block"
			loadingStyle.display="none"
		}
		return <div id="hrminfocard" className="css-hrmcard" style={visibleStyle} >
			<div className="css-hrmcard-close">
				<img src="/images/messageimages/temp/closeicno_wev8.png" onClick={this.closeDiv.bind(this)}/>
			</div>
			<div id="showSQRCodeDiv" onClick={this.showQCode.bind(this)} className="css-hrmcard-qrcodedata">
			</div>
			<div  className="css-hrmcard-img">
				<img src={userimg} style={imgStyle}/>
				<div className="css-hrmcard-loading" style={loadingStyle}>
					<Spin size="large" spinning="true" />
				</div>
				<div className="css-hrmcar-btns">
					{messageshow ?<img onClick={this.openmessage.bind(this)} src="/images/messageimages/temp/emessage_wev8.png" onmouseover="javascript:this.src='/images/messageimages/temp/emessagehot_wev8.png';" onmouseout="javascript:this.src='/images/messageimages/temp/emessage_wev8.png';" title="发消息"/>:""}
					{emailshow ?<img onClick={this.openemail.bind(this)} src="/images/messageimages/temp/email_wev8.png" onmouseover="javascript:this.src='/images/messageimages/temp/emailhot_wev8.png';" onmouseout="javascript:this.src='/images/messageimages/temp/email_wev8.png';" title="发送邮件"/>:""}
					{workplanshow ?<img onClick={this.doAddWorkPlan.bind(this)} src="/images/messageimages/temp/workplan_wev8.png" onmouseover="javascript:this.src='/images/messageimages/temp/workplanhot_wev8.png';" onmouseout="javascript:this.src='/images/messageimages/temp/workplan_wev8.png';" title="新建日程"/>:""}
					{coworkshow ?<img onClick={this.doAddCoWork.bind(this)} src="/images/messageimages/temp/cowork_wev8.png" onmouseover="javascript:this.src='/images/messageimages/temp/coworkhot_wev8.png';" onmouseout="javascript:this.src='/images/messageimages/temp/cowork_wev8.png';" title="新建协作"/>:""}
				</div>
			</div>
			<div className="css-hrmcard-text">
				<div className="css-hrmcard-head">
					<span></span>
					<span className="css-hrmcard-name" onClick={this.openhrmresource.bind(this)}>{name}</span>
					<span className="css-hrmcard-sex">{sexMap[sex]}</span>
					<span className="css-hrmcard-code">{code}</span>
					<span className="css-hrmcard-qccode"><img onClick={this.showQCode.bind(this)} src="/images/messageimages/temp/qcode_wev8.png"/></span>
				</div>

				<div className="css-hrmcard-item">
					<span >部门 :</span><span className="css-hrmcard-dept">{dept}</span>
				</div>
				<div className="css-hrmcard-item">
					<span >分部 :</span><span className="css-hrmcard-sub">{sub}</span>
				</div>
				<div className="css-hrmcard-item">
					<span >岗位 :</span><span className="css-hrmcard-job">{job}</span>
				</div>
				<div className="css-hrmcard-item">
					<span >上级 :</span><span className="css-hrmcard-manager">{manager}</span>
				</div>
				<div className="css-hrmcard-item">
					<span >状态 :</span><span className="css-hrmcard-status">{status}</span>
				</div>
				<div className="css-hrmcard-item">
					<span >手机 :</span><span className="css-hrmcard-mobile">{mobile}</span>
				</div>
				<div className="css-hrmcard-item">
					<span >电话 :</span><span className="css-hrmcard-tel">{tel}</span>
				</div>
				<div className="css-hrmcard-item">
					<span >邮件 :</span><span className="css-hrmcard-email">{email}</span>
				</div>
			</div>
		</div>
	}
}

const mapStateToProps = state => {
	const {PortalHrmCardStates}=state
    return {
    	messageshow: PortalHrmCardStates.get("messageshow"),
	    emailshow: PortalHrmCardStates.get("emailshow"),
	    workplanshow: PortalHrmCardStates.get("workplanshow"),
	    coworkshow: PortalHrmCardStates.get("coworkshow"),
	    curuserid: PortalHrmCardStates.get("curuserid"),
	    visible: PortalHrmCardStates.get("visible"),
	    left: PortalHrmCardStates.get("left"),
	    top: PortalHrmCardStates.get("top"),
	    imgloaded:PortalHrmCardStates.get("imgloaded"),
	    userinfo : PortalHrmCardStates.get("userinfo"),
	}
}
module.exports = connect(mapStateToProps)(HrmCard)