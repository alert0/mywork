import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as ElementAction from '../../actions/element';
class Toolbar extends React.Component {
        handleOnRefresh() {
            const { ele, actions } = this.props;
            actions.handleRefresh(ele);
        }
        handleOnSetting() {
            const { ele, actions } = this.props;
            const { eid, ebaseid } = ele.item;
            onSetting(eid, ebaseid);
            window.onRefresh4React = actions.handleRefresh.bind(this, ele);
        }
        render() {
           const { eid, ebaseid, toolbar } = this.props;
           const { lock, refresh, setting, close, more } = toolbar;
           return <span className="toolbar" style={{position: 'absolute'}} id={`toolbar_${eid}`}>
                  <ul>
                    {_isEmpty(lock) ? null : <li>
                    <a data-status={lock.status} href="javascript:void(0);" onClick={onLockOrUn.bind(this,eid)} title={lock.title}>
                      <img src={lock.img}  border="0"/></a>
                   </li>}
                    {_isEmpty(refresh) ? null : <li>
                    <a href="javascript:void(0);" name="refreshbtn" id={`refresh_${eid}`} onClick={this.handleOnRefresh.bind(this)} title={refresh.title}>
                      <img src={refresh.img} border="0"/></a>
                    </li>}
                    {_isEmpty(setting) ? null : <li>
                    <a href="javascript:void(0)" onClick={this.handleOnSetting.bind(this)} title={setting.title}>
                      <img className="img_setting" src={setting.img} border="0"/></a>
                  </li>}
                    {_isEmpty(close) ? null : <li>
                    <a href="javascript:void(0);" onClick={onDel.bind(this,eid)} title={close.title}>
                      <img src={close.img} border="0"/></a>
                  </li>}
                    {_isEmpty(more) ? null : <li>
                    <a id={`more_${eid}`} href="javascript:void(0);" data-morehref={more.morehref} onClick={openMoreWin.bind(this,eid)}>
                      <img className="img_more" id="imgMore" border="0" src={more.img} title={more.title}/></a>
                  </li>}
                </ul>
              </span>
    }
}


import { WeaErrorPage, WeaTools } from 'weaCom';
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
        return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" }/>
        );
    }
}
Toolbar = WeaTools.tryCatch(React, MyErrorHandler, {
    error: ""
})(Toolbar);

const mapStateToProps = state => {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ElementAction, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
