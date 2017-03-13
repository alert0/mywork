//头部组件  元素标题 设置图标等
import Toolbar from './Toolbar';
class EHeader extends React.Component {
  render() {
    const { eid, ebaseid, header,  ele } = this.props;
    return <div className="header" style={header.style} data-issetting="false" data-sharelevel="2" id={`header_${eid}`} onMouseDown={handleDragStart.bind(this,header.onmousedown,true)}>
    <span className="icon" id={`icon_${eid}`} style={{position:'absolute',cursor:'hand'}}>
    <img border="0" style={{width:'100%'}} src={header.iconimg.src} title={header.iconimg.title} onClick={onShowOrHideE.bind(this,eid)}/></span>
    <span className="title" id={`title_${eid}`} style={{position:'absolute',paddingBottom:'5px',boxSizing:'content-box'}}>
    <font>{header.title.replace("&nbsp;", " ")}</font>
    <span id={`count_${eid}`}></span>
    </span>
    <Toolbar eid={eid} toolbar={header.toolbar} ebaseid={ebaseid} ele={ele}/>&nbsp;&nbsp;&nbsp;&nbsp;
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

export default EHeader;