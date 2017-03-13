import {
  Component
} from 'react';
import {
  bindActionCreators
} from 'redux'
import {
  connect
} from 'react-redux'
import Toolbar from './Toolbar';
import * as TitleContainerAction from '../../../actions/homepage/titlecontainer';
import {
  handleChangeTab
} from '../../../actions/homepage/econtent';

import {
  handleChangeSETab
} from '../../../actions/homepage/specialelement';

import ecLocalStorage from '../../../util/ecLocalStorage.js';

import {
  ELEMENT_TYPES
} from '../../../constants/ActionTypes';
const {
  WORKFLOW, // 流程元素
  MAIL, // 我的邮件
  BLOGSTATUS, // 微博元素
  CONTACTS, // 通讯录
  TASK // 任务元素
} = ELEMENT_TYPES;

//tab的标题组件
class TitleContainer extends Component {
  onChangeTab(eid, url, tabid) {
    ecLocalStorage.set("currenttab", "tabid-" + eid, tabid, true);
    const {
      dispatch,
      ebaseid,
      sedata,
      currenttab
    } = this.props;
    let currtab = this.props.currtab ? this.props.currtab : currenttab;
    const specialEArr = [BLOGSTATUS, MAIL];
    if (specialEArr.contains(ebaseid)) {
      dispatch(handleChangeSETab(eid, tabid, sedata));
    } else {
      dispatch(handleChangeTab(eid, url, currtab, tabid));
    }
  }
  render() {
    const {
      eid,
      ebaseid,
      tabids,
      titles,
      counts,
      currenttab,
      toolbar,
      url,
      actions
    } = this.props;

    let currtab = ecLocalStorage.getStr("currenttab", "tabid-" + eid, true);
    if (!currtab) currtab = this.props.currtab ? this.props.currtab : currenttab;
    let tHtml = titles.map((title, i) => {
      if (!_isEmptyObject(counts)) {
        if (counts.length === tabids.length) {
          if (WORKFLOW === ebaseid && '' !== counts[i]) {
            title += ' (' + counts[i] + ')';
          }
          if ((TASK === ebaseid || BLOGSTATUS === ebaseid) && '0' !== counts[i]) {
            title += ' (' + counts[i] + ')';
          }
        }
      }

      const className = tabids[i] == currtab ? "tab2selected" : "tab2unselected";
      return <td title={title} data-tabid={tabids[i]} style={{wordWrap:'break-word',paddingTop:'5px',verticalAlign:'top',height:'32px'}} className={className} onClick={this.onChangeTab.bind(this,eid,url,tabids[i])}>{title}</td>
    });
    let className = tabids.length <= 1 ? 'nodisplay' : '';
    var moveFn = null;
    var style = null;
    if (toolbar) {
      moveFn = handleDragStart.bind(this, toolbar.ele.item.header.onmousedown, false);
      style = {
        width: 'auto',
        position: 'relative',
        //display: 'block!important',
        cursor: 'move'
      };
    }
    return <div id={`titleContainer_${eid}`} className={`titlecontainer ${className}`} style={style} onMouseDown={moveFn}> 
          <div id={`tabnavprev_${eid}`} className="picturebackhp"></div>
         <div id={`tabContainer_${eid}`} className="tabcontainer tab2">
         <table style={{tableLayout: "fixed",borderCollapse: 'collapse'}} height="32" width={77*tabids.length}> 
            <tbody height="32">
            <tr height="32">
            {tHtml}  
            </tr>
            </tbody>
           </table> 
          </div>
        <div id={`tabnavnext_${eid}`} className="picturenexthp"></div>
        {toolbar ? <div className="optoolbar">
        <Toolbar eid={eid} toolbar={toolbar.toolbar} ele={toolbar.ele}/>
       </div>:null}
    </div>
  }
}

const mapStateToProps = state => {

  const {
    econtent,
    specialelement
  } = state;
  return ({
      currtab: econtent.get("currtab"),
      speccurrenttab: specialelement.get("currenttab")
    })
    /*const {
      titlecontainer
    } = state;
    return ({
      currtab: titlecontainer.get("currtab")
    })*/
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    currtab: stateProps.currtab.get(ownProps.eid),
    speccurrenttab: stateProps.speccurrenttab.get("cur_" + ownProps.eid),
    eid: ownProps.eid,
    ebaseid: ownProps.ebaseid,
    tabids: ownProps.tabids,
    titles: ownProps.titles,
    currenttab: ownProps.currenttab,
    toolbar: ownProps.toolbar,
    url: ownProps.url,
    counts: ownProps.counts,
    sedata: ownProps.sedata,
    dispatch: dispatchProps.dispatch
  };
}
/*function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TitleContainerAction, dispatch)
  }
}*/
export default connect(mapStateToProps, null, mergeProps)(TitleContainer);