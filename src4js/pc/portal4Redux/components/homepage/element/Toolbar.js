import React, {
  Component
} from 'react';
import {
  bindActionCreators
} from 'redux'
import {
  connect
} from 'react-redux'

import * as ElementAction from '../../../actions/homepage/element';
class Toolbar extends Component {
  handleOnRefresh() {
    const {
      ele,
      actions
    } = this.props;
    actions.handleRefresh(ele);
  }
  handleOnSetting() {
    const {
      ele,
      actions
    } = this.props;
    const {
      eid,
      ebaseid
    } = ele.item;
    onSetting(eid, ebaseid);
    window.onRefresh4React = actions.handleRefresh.bind(this, ele);
  }
  render() {
    const {
      eid,
      ebaseid,
      toolbar
    } = this.props;
    const astyle = {
      display: 'block',
      float: 'left'
    };
    // / console.log("toolbar : ", toolbar);
    return <span className="toolbar" style={{position:'absolute'}} id={`toolbar_${eid}`}>
    <ul>
      {_isEmptyObject(toolbar.lock) ? null : <li>
        <a data-status={toolbar.lock.status} href="javascript:void(0);" onClick={onLockOrUn.bind(this,eid)} style={astyle} title={toolbar.lock.title}>
          <img src={toolbar.lock.img}  border="0"/></a>
      </li>}
      {_isEmptyObject(toolbar.refresh) ? null : <li>
        <a href="javascript:void(0);" name="refreshbtn" onClick={this.handleOnRefresh.bind(this)} style={astyle} title={toolbar.refresh.title}>
          <img src={toolbar.refresh.img} border="0"/></a>
        </li>}
        {_isEmptyObject(toolbar.setting) ? null :<li>
        <a href="javascript:void(0)" onClick={this.handleOnSetting.bind(this)} title={toolbar.setting.title} style={astyle}>
          <img className="img_setting" src={toolbar.setting.img}  border="0"/></a>
      </li>}
       {_isEmptyObject(toolbar.close) ? null : <li>
        <a href="javascript:void(0);" onClick={onDel.bind(this,eid)} title={toolbar.close.title} style={astyle}>
          <img src={toolbar.close.img} border="0"/></a>
      </li>}
      {_isEmptyObject(toolbar.more) ? null : <li>
        <a id={`more_${eid}`} href="javascript:void(0);" style={astyle} data-morehref={toolbar.more.morehref} onClick={openMoreWin.bind(this,eid)}>
          <img className="img_more" id="imgMore" border="0" src={toolbar.more.img} title={toolbar.more.title}/></a>
      </li>}
    </ul>
  </span>
  }
}

const mapStateToProps = state => {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ElementAction, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);