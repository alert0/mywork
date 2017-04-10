import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { WeaErrorPage, WeaTools } from 'ecCom';
//引入元素组件
import LayoutFlags from './LayoutFlags';
import * as PortalAction from '../actions/';
//门户组件
class Portal extends React.Component {
    componentDidMount() {
        const { actions, hpid, requestid } = this.props;
        let params = this.props.params;
        if (hpid) params = { hpid, requestid }
        window.isPortalRender = true;
        actions.getPortalDatas(params);
        this.refs.btnWfCenterReload.setAttribute("onclick","elmentReLoad('8')");
    }
    _isRender(props,nextProps){
        const { params, hpdata, requestid } = props;
        let hpid = props.hpid;
        let nhpid = nextProps.hpid
        let subCompanyId = '-1';
        let nsubCompanyId = '-1';
        if(!hpid) {
            hpid = params.hpid;
            subCompanyId = params.subCompanyId;
        }
        if(!nhpid) {
            nhpid = nextProps.params.hpid;
            nsubCompanyId = nextProps.params.subCompanyId;
        }
        return nextProps.isRender || !Immutable.is(hpdata,nextProps.hpdata) || hpid !== nhpid || subCompanyId !== nsubCompanyId || requestid !== nextProps.requestid; 
    }
    shouldComponentUpdate(nextProps){
        return this._isRender(this.props,nextProps);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.isRender){
            const { actions, hpid, hpdata, requestid } = nextProps;
            let params = nextProps.params;
            if (hpid) params = { hpid, requestid };
            actions.getPortalDatas(params);
        }
    }
    render() {
        const { params, hpid } = this.props;
        //协同区门户
        if(hpid || !_isEmpty(params)){
            if(hpid){
                window.global_hpid = hpid;
                window.global_subCompanyId = "-1"; 
            }else{
                window.global_hpid = params.hpid;
                window.global_subCompanyId = params.subCompanyId; 
            }
            let hpdata = this.props.hpdata.toJSON();
            let hpHtml = null;
            let styleStr = "";
            if (!_isEmpty(hpdata)) {
                if(hpdata.hasRight === 'true' && global_hpid == hpdata.hpinfo.hpid){
                    const layoutObj = {
                         layoutFlags: hpdata.hpinfo.layoutFlags,
                         bLayoutid: hpdata.hpinfo.bLayoutid,
                         layoutHtml: hpdata.hpinfo.html
                    };
                    styleStr = "<style type='text/css'>" + hpdata.hpCss.replace(/\"/g, "") + "</style>";
                    hpHtml = <LayoutFlags layoutObj = { layoutObj }/>;
                }else{
                    hpHtml = <NoRightPage msg={hpdata.msg}/>;
                }
            }
            return <div className='homepage'>
                     <div dangerouslySetInnerHTML = { { __html: styleStr } }></div>
                     <input type="hidden" ref="btnWfCenterReload" value="btnWfCenterReload" id="btnWfCenterReload" name="btnWfCenterReload"/>
                     {hpHtml}
                </div>;
        } else {
            return <div></div>
        }
    }
}
 //无权限门户
 const NoRightPage = ({ msg }) =>
     <div className = "page-noright">
         <img src = "/images/ecology8/noright_wev8.png" width = "162px" height = "162px" />
         <div style = {{ color: 'rgb(255,187,14)' } }>{msg}</div>
     </div>

class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
        return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" }
            />
        );
    }
}

Portal = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Portal);
const mapStateToProps = state => {
    const { portal } = state;
    return ({
        hpdata: portal.get("hpdata")
    })
}

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(PortalAction, dispatch) }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    let hpid = ownProps.hpid;
    if(!hpid) hpid = ownProps.params.hpid;
    return {
        hpdata: stateProps.hpdata.get(hpid) ||  Immutable.fromJS(ecLocalStorage.getObj("portal-" + hpid, "hpdata", true) || {}),
        params: ownProps.params || {},
        hpid: ownProps.hpid,
        isRender:window.isPortalRender || false,
        requestid: ownProps.requestid,
        actions: dispatchProps.actions
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Portal);
