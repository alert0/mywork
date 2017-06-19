import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { WeaErrorPage, WeaTools } from 'ecCom';
//引入元素组件
import LayoutFlags from './LayoutFlags';
import * as PortalAction from '../actions/portal';

import objectAssign from 'object-assign';

import RightClickMenu from './RightClickMenu';
//门户组件
class Portal extends React.Component {
    componentWillMount() {
       const { params, actions } = this.props;
       actions.setParamsState(params.toJSON());
    }
    componentDidMount() {
        const { params, actions } = this.props;
        actions.getPortalDatas(params.toJSON());
        this.refs.btnWfCenterReload.setAttribute("onclick","elmentReLoad('8')");
        bindRightClickEvent();
    }
    _isRender(props,nextProps){
        const { params, hpdata } = props;
        return nextProps.isRender || window.isRefreshPortal || !Immutable.is(hpdata,nextProps.hpdata) || !Immutable.is(params,nextProps.params); 
    }
    shouldComponentUpdate(nextProps){
        return this._isRender(this.props,nextProps);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.isRender){
            window.isPortalRender = false;
            const { params, hpdata, actions } = nextProps;
            actions.setParamsState(params.toJSON());
            actions.getPortalDatas(params.toJSON());
        }
    }
    render() {
        const params = this.props.params.toJSON();
        //协同区门户
        if(params.hpid){
            let hpdata = this.props.hpdata.toJSON();
            let hpHtml = null;
            let styleStr = "";
            if (!_isEmpty(hpdata)) {
                if(hpdata.hasRight === 'true'){
                    const layoutObj = {
                         layoutFlags: hpdata.hpinfo.layoutFlags,
                         bLayoutid: hpdata.hpinfo.bLayoutid,
                         layoutHtml: hpdata.hpinfo.html
                    };
                    global_all_eids[global_hpid] = {}
                    styleStr = "<style type='text/css'>" + hpdata.hpCss.replace(/\"/g, "") + "</style>";
                    hpHtml = <LayoutFlags layoutObj = { layoutObj }/>;
                }else{
                    hpHtml = <NoRightPage msg={hpdata.msg}/>;
                }
            }
            window.rightClickMenuShow = false;
            return <div className='homepage'>
                     <div dangerouslySetInnerHTML = { { __html: styleStr } }></div>
                     <input type="hidden" ref="btnWfCenterReload" value="btnWfCenterReload" id="btnWfCenterReload" name="btnWfCenterReload"/>
                        {hpHtml}
                     <RightClickMenu hpid={params.hpid} isSetting={params.isSetting}/>
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
            return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" }/>
        );
    }
}

Portal = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Portal);
const mapStateToProps = state => {
    const { portal } = state;
    return ({
        hpdata: portal.get("hpdata"),
        params: portal.get("params")
    })
}

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(PortalAction, dispatch) }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    let query = {};
    if(ownProps.location) query = ownProps.location.query
    let params = objectAssign({},ownProps.params,query);
    if(ownProps.hpid) {
        params = objectAssign(params, ownProps);
        if(!params.isSetting) params.isSetting = false;
    }else{
        params.isSetting = false;
        params.isfromportal = 1;
        params.isfromhp = 0;
    }
    window.global_hpid = params.hpid;
    window.global_subCompanyId = params.subCompanyId; 
    window.global_isSetting = params.isSetting;
    return {
        hpdata: stateProps.hpdata.get(params.hpid+"-"+params.isSetting) || Immutable.fromJS(ecLocalStorage.getObj("portal-" + params.hpid+"-"+params.isSetting, "hpdata", true) || {}),
        params: Immutable.fromJS(params),
        isRender: window.isPortalRender || false,
        actions: dispatchProps.actions
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Portal);
