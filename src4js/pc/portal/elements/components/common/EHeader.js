//头部组件  元素标题 设置图标等
import Toolbar from '../common/Toolbar';
class EHeader extends React.Component {
  handleDragStart(event){
    const { config, actions } = this.props;
    const { header, ebaseid } = config.item;
    window.global_drag_ebaseid = ebaseid;
    if(!header.onmousedown) return;
    dragStart(true,event);
  }
  render() {
    const { config, handleRefresh } = this.props;
    const { eid, header } = config.item;
    return <div className="header" style={header.style} data-issetting="false" data-sharelevel="2" id={`header_${eid}`} onMouseDown={this.handleDragStart.bind(this)}>
    <span className="icon" id={`icon_${eid}`} style={{position:'absolute',cursor:'hand'}}>
    <img border="0" style={{width:'100%'}} src={header.iconimg.src} title={header.iconimg.title} onClick={onShowOrHideE.bind(this,eid)}/></span>
    <span className="title" id={`title_${eid}`} style={{position:'absolute',paddingBottom:'5px',boxSizing:'content-box'}}>
    <font id={`element_title_name_${eid}`} dangerouslySetInnerHTML={{__html:header.title}}></font>
    <span id={`count_${eid}`}></span>
    </span>
    <Toolbar config={config} handleRefresh={handleRefresh}/>
    <span className="toolbarSub" id={`toolbarSub_${eid}`}></span>
  </div>
  }
}
import { WeaErrorPage, WeaTools } from 'ecCom';
class MyErrorHandler extends React.Component {
  render() {
    const hasErrorMsg = this.props.error && this.props.error !== "";
    return (
      <WeaErrorPage msg={hasErrorMsg ? this.props.error:"对不起，该页面异常，请联系管理员！"} />
    );
  }
}
EHeader = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(EHeader);
export default EHeader;
