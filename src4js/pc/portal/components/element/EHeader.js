//头部组件  元素标题 设置图标等
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ElementAction from '../../actions/element';
import Toolbar from './Toolbar';
class EHeader extends React.Component {
  handleDragStart(event){
    const { header, ele, actions } = this.props;
    window.global_ebaseid = ele.item.ebaseid;
    if(!header.onmousedown) return;
    dragStart(true,event);
  }
  render() {
    const { eid, ebaseid, header,  ele } = this.props;
    return <div className="header" style={header.style} data-issetting="false" data-sharelevel="2" id={`header_${eid}`} onMouseDown={this.handleDragStart.bind(this)}>
    <span className="icon" id={`icon_${eid}`} style={{position:'absolute',cursor:'hand'}}>
    <img border="0" style={{width:'100%'}} src={header.iconimg.src} title={header.iconimg.title} onClick={onShowOrHideE.bind(this,eid)}/></span>
    <span className="title" id={`title_${eid}`} style={{position:'absolute',paddingBottom:'5px',boxSizing:'content-box'}}>
    <font dangerouslySetInnerHTML={{__html:header.title}}></font>
    <span id={`count_${eid}`}></span>
    </span>
    <Toolbar eid={eid} toolbar={header.toolbar} ref="toolbar" ebaseid={ebaseid} ele={ele}/>
    <span className="toolbarSub" id={`toolbarSub_${eid}`}></span>
</div>
  }
}
import { WeaErrorPage, WeaTools } from 'weaCom';
class MyErrorHandler extends React.Component {
  render() {
    const hasErrorMsg = this.props.error && this.props.error !== "";
    return (
      <WeaErrorPage msg={hasErrorMsg ? this.props.error:"对不起，该页面异常，请联系管理员！"} />
    );
  }
}

EHeader = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(EHeader);

const mapStateToProps = state => {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ElementAction, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EHeader);
