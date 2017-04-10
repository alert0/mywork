import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SignViewAction from '../../actions/workflow/signview';
import { WeaScroll, WeaErrorPage, WeaTools } from 'ecCom';
import { Spin } from 'antd';
import Immutable from 'immutable';
class SignView extends React.Component{
	componentDidMount(){
		const { eid, actions } = this.props;
		actions.signviewPoistion(eid);
	}
	componentDidUpdate(preProps){
		const { eid, tabid, refresh, actions } = this.props;
		if(preProps.tabid !== tabid || refresh !== preProps.refresh){
			$("#signPreview_"+eid).css("display","none");
			actions.signviewPoistion(eid);
		}
	}
	shouldComponentUpdate(nextProps){
        const { eid, data, isMore, tabid, refresh } = this.props;
        return !Immutable.is(data,nextProps.data) || eid !== nextProps.eid || isMore !== nextProps.isMore || tabid !== nextProps.tabid || refresh !== nextProps.refresh
    }
	render(){
		const { eid, data, isMore, tabid, actions } = this.props;
		const none = { display: 'none' };
		const sdata = data ? data.toJSON() : [];
		let html = null;
		if(sdata.length > 0){
			html = sdata.map((item,i)=>{
      			return <SignContent item={item}/>
  			});
		}else{
			html = <div id="nosigndiv" style={{lineHeight: '20em', fontSize: '16px', color: 'rgb(74, 99, 121)', textAlign: 'center'}}>
				<img src="/images/ecology8/workflow/noSignNotice_wev8.png" style={{position:'relative', top:'4px'}}/>&nbsp;
				<span>没有可以显示的数据</span>
			</div>
		}
		let ahtml = <div className="signContent" style={{position:'relative',height: '332px'}}>
		<div className="content" style={{border: '0px'}}>
			{html}
		</div>
		</div>
		if(!data || isMore){
			ahtml = <Spin>{ahtml}</Spin>
		}
		ahtml = <WeaScroll typeClass="scrollbar-macosx" className="signcontent-scroll" conClass="signcontent-scroll" conHeightNum={0}>{ahtml}</WeaScroll>
		return <div id={`signPreview_${eid}`} className="signPreview" style={{height:'372px',boxShadow:'0 0 2px #000000',background:'#FFFFFF', display: 'none',zIndex:9999, position: 'absolute',width: '550px' }}>
		<div className="arrowsblock" style={none}><img src="/images/ecology8/homepage/arrows_wev8.png" width="13px" height="8px"/></div>
		<div className="arrowsblockup" style={none}><img src="/images/ecology8/homepage/arrows_up_wev8.png" width="13px" height="8px"/></div>
		<div className="signContainer" style={{position: 'relative',height:'392px'}}>
		<div style={{height:'40px',lineHeight:'40px',fontSize: '16px',color: '#242424',paddingLeft:'20px',borderBottom: '1px solid #ced0d2'}}>
			<div className="signTitle" style={{lineHeight: '40px',height: '40px',overflow: 'hidden', marginRight:'38px',textOverflow: 'ellipsis',whiteSpace: 'nowrap'}}></div>
			<img style={{position: 'absolute',top:'10px',right: '8px',cursor: 'pointer'}} className="close" src="/images/ecology8/homepage/close_wev8.png" width="20px" height="20px"/>
		</div>
		{ahtml}
		{/*<iframe height='450px' width="100%" border="0px" style={{border: '0px'}}></iframe>*/}
		<div className="signMore" onClick={actions.getMoreSignData.bind(this,eid)} style={{display:'none',fontSize: '15px',background: '#f4f7f7',height: '40px',lineHeight: '40px',textAlign: 'center', cursor: 'pointer',borderTop: '1px solid #ced0d2'}}>加载更多</div>
		<div className="params" style={none}>
			<input type="hidden" value="1" name="pageno"/>
			<input type="hidden" value="" name="requestid"/>
			<input type="hidden" value="" name="maxrequestlogid"/>
			<input type="hidden" value="" name="requestLogParams"/>
		</div>
		</div>
	</div>
	}
}

class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return (
			<WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
		);
	}
}
SignView = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(SignView);
const mapStateToProps = state => {
	const { signview } = state;
	return ({
		data: signview.get("data"),
		isMore: signview.get("isMore")
	})
}
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(SignViewAction, dispatch)
	}
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        data: stateProps.data.get(ownProps.eid),
        isMore: stateProps.isMore.get(ownProps.eid) || false,
        eid:ownProps.eid,
        tabid:ownProps.tabid,
        refresh:ownProps.refresh,
        actions: dispatchProps.actions
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SignView);

const SignContent = ({ item }) => {
	const {log_nodename ,operationname, displayname, displaydepid, displaydepname, displayid, img_path, receiveUser, log_operatedate, log_operatetime, log_remarkHtml } = item;
	var nameStr = '接收人 : ' + receiveUser;
	return <div className="wea-workflow-req-sign-list-content" >
          <div className="content-left">
        <img src={img_path} className="content-text-left-user-img"/>
        <div style={{width:'132px'}}>
          <p>
            <a href={`javascript:openhrm(${displayid})`} onClick={pointerXY.bind(this)}>{displayname}</a>
          </p>
          <span>
            <a href="/hrm/company/HrmDepartmentDsp.jsp?id=36" target="_blank" style={{color:'#9b9b9b',whiteSpace:'pre-wrap'}}>{displaydepname}</a>
          </span>
        </div>
      </div>
      <div className="content-right">
        <div className="content-right-remark-html"  dangerouslySetInnerHTML={{__html:log_remarkHtml}}>

        </div>
        <p style={{lineHeight:'24px',color:'#8a8a8a'}}>
          <span style={{overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace:'nowrap',maxWidth:'295px', height: '20px', lineHeight: '20px',display:'block'}}>{nameStr}</span>
        </p>
        <p style={{lineHeight:'22px',marginTop:'10px',color:'#9a9a9a'}}>
          <span style={{marginRight:'8px'}}>{log_operatedate} {log_operatetime} </span>
          <span>[{log_nodename} / {operationname}]</span>
        </p>
      </div>
    </div>
}


