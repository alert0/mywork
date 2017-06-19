import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Spin, Popconfirm } from 'antd';
import { _isRe } from '../Common';
import * as ToolbarAction from '../../actions/toolbar';
import ESetting from '../common/setting/ESetting';
class OpToolbar extends React.Component {
        componentDidMount(){
            const { config, handleRefresh } = this.props;
            const { eid, ebaseid } = config.item;
            elementsRefresh[eid] = handleRefresh.bind(this, config.params);
        }
        lockOrUnlockElement(eid){
            const { islock, actions } = this.props;
            if(islock){
                actions.unlockElement(eid);
            }else{
                actions.islockElement(eid);
            }
        }
        handleDeleteElement(eid){
            const { actions } = this.props;
            actions.deleteElement(eid);
        }
        handleOnSetting() {
            const { config } = this.props;
            const { eid, ebaseid } = config.item;
            const readyElement = [
                '1', '7', '8', '11', '12', '6', '13', '14', '15', '16', '9', '10', '17', '18', '19', '25', '29', '32', 'Task', '34',
                'audio', 'Flash', 'menu', 'picture', 'searchengine', 'Slide', 'video', 'blogStatus', 'favourite', 'reportForm',
                'weather', 'scratchpad', 'DataCenter', 'MyCalendar', 'plan', 'jobsinfo', 'outterSys', 'contacts', 'addwf', 'imgSlide',
                'newNotice'
            ];
            if (readyElement.contains(ebaseid)) {
                React.render(<div style={{textAlign: 'center'}}><Spin /></div>,  document.getElementById(`setting_${eid}`));
                WeaTools.callApi('/api/portal/setting/esetting', 'POST', {eid: eid, ebaseid: ebaseid, hpid: global_hpid, subCompanyId: global_subCompanyId}, 'json').then(function (result) {
                    result.hpid = global_hpid;
                    result.subCompanyId = global_subCompanyId;
                    result.eid = eid;
                    result.ebaseid = ebaseid;
                    React.render(<ESetting data={result} />,  document.getElementById(`setting_${eid}`));
                });
            } else {
                // 公告栏元素('notice'), 建模查询中心('FormModeCustomSearch'), 外部数据元素('OutData')
                onSetting(eid, ebaseid);
            }
        }
        render() {
           const { config, clsname, islock, icon, actions, handleRefresh } = this.props;
           const { eid, ebaseid, header } = config.item;
           const { toolbar } = header;
           const { lock, refresh, setting, close, more } = toolbar;
           let params = config.params;
           if(!_isRe(ebaseid)){
                params['url'] =  config.item.contentview.url;
           }
           let lockHtml = null;
           if(!_isEmpty(lock)){
              lockHtml = <li style={{width:'11px'}}>
                 <Popconfirm title="此操作可能花较长的时间，是否继续？" onConfirm={this.lockOrUnlockElement.bind(this,eid)}>
                      <a data-status={islock?'locked':'unlocked'} href="javascript:void(0);" title={lock.title}>
                      <img src={icon} border="0"/></a>
                      </Popconfirm>
                   </li>
           } 
           return <div className={'optoolbar ' + clsname} id={`toolbar_${eid}`}>
                  <ul>
                    {lockHtml}
                    {_isEmpty(refresh) ? null : <li style={{width:'11px'}}>
                    <a href="javascript:void(0);" name="refreshbtn" id={`refresh_${eid}`} onClick={handleRefresh.bind(this,params)} title={refresh.title}>
                      <img src={refresh.img} border="0"/></a>
                    </li>}
                    {_isEmpty(setting) ? null : <li style={{width:'12px'}}>
                    <a href="javascript:void(0)" onClick={this.handleOnSetting.bind(this)} title={setting.title}>
                      <img className="img_setting" src={setting.img} border="0"/></a>
                  </li>}
                    {_isEmpty(close) ? null : <li style={{width:'12px'}}>
                      <Popconfirm title="此元素被删除后将不能被恢复，是否继续？" onConfirm={this.handleDeleteElement.bind(this,eid)}>
                        <a href="javascript:void(0);" onClick={this.handleDeleteElement.bind(this,eid)} title={close.title}>
                          <img src={close.img} border="0"/></a>
                      </Popconfirm>
                  </li>}
                    {_isEmpty(more) ? null : <li style={{width:'34px'}}>
                    <a id={`more_${eid}`} href="javascript:void(0);" data-morehref={more.morehref} onClick={openMoreWin.bind(this,eid)}>
                      <img className="img_more" id="imgMore" border="0" src={more.img} title={more.title}/></a>
                  </li>}
                </ul>
              </div>
    }
}

import { WeaErrorPage, WeaTools } from 'ecCom';
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
           return (<WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" } />
        );
    }
}
OpToolbar = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(OpToolbar);
const mapStateToProps = state => {
    const { toolbar } = state;
    return ({
        islock: toolbar.get("islock"),
        icon: toolbar.get("icon")
    })
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ToolbarAction, dispatch)
    }
}
function mergeProps(stateProps, dispatchProps, ownProps) {
    const { eid, header } = ownProps.config.item;
    const { lock } = header.toolbar;
    let islock = false;
    let icon = '';
    if(!_isEmpty(lock)){
       icon = lock.img;
       if(lock.status === 'locked'){
          islock = true;
       }
    } 
    return {
        islock: stateProps.islock.get(eid) || islock,
        icon: stateProps.icon.get(eid) || icon,
        handleRefresh: ownProps.handleRefresh,
        config: ownProps.config,
        clsname: ownProps.clsname,
        actions: dispatchProps.actions
    };
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(OpToolbar);



