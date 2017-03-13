import {
  Component
} from 'react';
import {
  bindActionCreators
} from 'redux'
import {
  connect
} from 'react-redux'
import * as SpecialElementAction from '../../../actions/homepage/specialelement';
import TitleContainer from './TitleContainer';
import {
  BlogStatus, // 微博动态
  Mail // 我的邮件
} from './ETypes';


import {
	  ELEMENT_TYPES
} from '../../../constants/ActionTypes';
const {
  MAIL, // 我的邮件
  CONTACTS, // 通讯录
  BLOGSTATUS // 微博元素
} = ELEMENT_TYPES;
		
//特殊元素特殊处理
class SpecialElement extends Component {
  constructor(props) {
    super(props)
    const {
      eid,
      data,
      actions
    } = props;
    actions.initSEDatas(eid, data.tabids[0], data.data);
  }
  render() {
    const {
      eid,
      ebaseid,
      data,
      toolbar,
      actions,
      currenttab
    } = this.props;

    let list = this.props.list;
    if (list) list = list.toJSON();
    if (_isEmptyObject(list)) list = data.data[currenttab];
    const titles = data.titles;
    const tabids = data.tabids;
    const counts = data.counts;
    let html = null;
    if (!_isEmptyObject(list)) {
      switch (ebaseid) {
        case MAIL:
          html = <Mail list={list} currTab={currenttab} esetting={data.esetting} olist={data.data.oplist}/>
          break;
        case BLOGSTATUS:
          html = <BlogStatus list={list} currTab={currenttab} esetting={data.esetting}/>
          break;
      }
    }
    return <div>
       {ebaseid === CONTACTS ?null: <TitleContainer ebaseid={ebaseid} counts={counts} toolbar={toolbar} currenttab={currenttab} titles={titles} tabids={tabids} eid={eid} sedata={data}/>}
      {html}
    </div>
  }
}

const mapStateToProps = state => {
  const {
    specialelement
  } = state;
  return ({
    list: specialelement.get("list"),
    currenttab: specialelement.get("currenttab")
  })
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SpecialElementAction, dispatch)
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    list: stateProps.list.get(ownProps.eid),
    currenttab: stateProps.currenttab.get(ownProps.eid),
    data: ownProps.data,
    ebaseid: ownProps.ebaseid,
    eid: ownProps.eid,
    toolbar: ownProps.toolbar,
    actions: dispatchProps.actions
  };
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SpecialElement);