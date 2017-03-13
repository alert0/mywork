import React, {
  Component
} from 'react';
//每个布局区域的元素组件集合
import EHeader from './EHeader';
import SpecialElement from './SpecialElement';
import Contacts from './Contacts';
import EContent, {
  EType
} from './EContent';

import {
  Spin
} from 'antd';

import {
  bindActionCreators
} from 'redux'
import {
  connect
} from 'react-redux'
import {
  ELEMENT_TYPES
} from '../../../constants/ActionTypes';
const {
  WORKFLOW, // 流程元素
  MAIL, // 我的邮件
  BLOGSTATUS, // 微博元素
  CONTACTS, // 通讯录
  CUSTOMPAGE // 自定义页面元素
} = ELEMENT_TYPES;
import * as ElementAction from '../../../actions/homepage/element'
//元素组件
class Element extends Component {
  componentDidMount() {
    const {
      ele,
      actions
    } = this.props;
    if (ele.item.ebaseid === WORKFLOW) {
      window.ifWorkFlowRefrash = actions.handleRefresh.bind(this, ele);
    }
  }
  render() {
    const {
      ele,
      actions,
      isEReFresh
    } = this.props;
    const isHasRight = eval(ele.isHasRight);
    const item = ele.item;
    const eid = item.eid;
    const ebaseid = item.ebaseid;
    const content = item.content;
    const header = item.header;
    const contentview = item.contentview;
    var edata = this.props.edata;
    if (edata && _isReactElement(ebaseid)) {
      edata = edata.toJSON();
    }
    let EContentHtml = <div width="100%"></div>;
    let slideclass = '';
    if (!_isEmptyObject(edata)) {
      if (_isReactElement(ebaseid)) {
        //对特殊元素进行处理
        const specialEArr = [BLOGSTATUS, CONTACTS, MAIL];
        var toolbar = null;
        if (header.canHeadbar === 'false') {
          toolbar = {
            toolbar: header.toolbar,
            ele: ele
          }
        }
        if (specialEArr.contains(ebaseid)) {
          if (ebaseid === CONTACTS) {
            EContentHtml = <Contacts data={edata} eid={eid} ebaseid={ebaseid} toolbar={toolbar}/>
          } else {
            EContentHtml = <SpecialElement ebaseid={ebaseid} eid={eid} data={edata} toolbar={toolbar}/>
          }
        } else {
          if (undefined !== edata.tabids) {
            EContentHtml = isHasRight ? <EContent eid={eid} toolbar={toolbar} ebaseid={ebaseid} data={edata}/> : <NoRight/>;
          } else {

            EContentHtml = edata.isHasRight === undefined ? <EType eid={eid} ebaseid={ebaseid} data={edata.data} esetting={edata.esetting}/> : <NoRight/>;
          }
        }
      } else {
        EContentHtml = <div dangerouslySetInnerHTML={{__html: edata}}></div>;
      }
    }
    if (isEReFresh && ebaseid !== CUSTOMPAGE) {
      EContentHtml = <Spin>{EContentHtml}</Spin>
    }
    // let style = item.style;
    return <div className="item" style={{marginTop: '10px'}} id={`item_${eid}`} data-eid={eid} data-ebaseid={ebaseid} data-needRefresh={item.needRefresh} data-cornerTop={item.cornerTop} data-cornerTopRadian={item.cornerTopRadian} data-cornerBottom={item.cornerBottom} data-cornerBottomRadian={item.cornerBottomRadian}>
          <EHeader header={header} eid={eid} ebaseid={ebaseid} ele={ele}/>
          <div className="content" id={`content_${eid}`} style={{width:'auto',_width:'100%'}}>
            <div className="content_view" id={`content_view_id_${eid}`} style={contentview.style}>
             {EContentHtml}
            </div>
            <div style={{textAlign:'right'}} id={`footer_${eid}`}>
          </div>
        </div>
    </div>;
  }
}

//无权访问的元素的组件
const NoRight = (props) => <div style={{width:'100%', height:'160px',textAlign:'center',paddingTop:'63px'}}>
                    <img src="/synergy/js/waring_wev8.png" />
                    对不起，您暂时没有权限！
                </div>


const mapStateToProps = state => {
  const {
    element
  } = state;
  return ({
    edata: element.get("edata"),
    isEReFresh: element.get("isEReFresh")
  })
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ElementAction, dispatch)
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ElementAction, dispatch)
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    isEReFresh: stateProps.isEReFresh.get(ownProps.ele.item.eid),
    edata: stateProps.edata.get(ownProps.ele.item.eid),
    actions: dispatchProps.actions,
    ele: ownProps.ele
  };
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Element);