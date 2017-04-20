import FormLabel from './FormLabel'
import FormDetailLayout from './FormDetailLayout'
import FormMcLayout from './FormMcLayout';
import FormTabLayout from './FormTabLayout'
import DetailSumCell from './DetailSumCell'
import SystemElement from '../field/SystemElement'
import InputElement from '../field/InputElement'
import TextAreaElement from '../field/TextAreaElement'
import BrowserElement from '../field/BrowserElement'
import SelectElement from '../field/SelectElement'
import FileElement from '../field/FileElement'
import CheckboxElement from '../field/CheckboxElement'
import Immutable from 'immutable'
import {is} from 'immutable'
import objectAssign from 'object-assign'
import {Button,Checkbox} from 'antd'

class FormCellType extends React.Component {
    shouldComponentUpdate(nextProps) {
        const cellObj = this.props.cellObj;
        const cellObjNext = nextProps.cellObj;
        const etype = parseInt(cellObj.get("etype")||0);
        const etypeNext = parseInt(cellObjNext.get("etype")||0);
        if(etype === etypeNext){
            const layoutChange = this.props.symbol !== nextProps.symbol
                || !is(this.props.cellObj, nextProps.cellObj)
                || this.props.conf.size !== nextProps.conf.size 
                || !is(this.props.layout, nextProps.layout);
            if(layoutChange)
                return true;
            if(etype === 3){
                const fieldDatas = this.props.symbol.indexOf("detail_") > -1 ? this.props.detailRowValue : this.props.mainData;
                const fieldValue = fieldDatas && fieldDatas.get("field"+cellObj.get("field"));
                const fieldDatasNext = nextProps.symbol.indexOf("detail_") > -1 ? nextProps.detailRowValue : nextProps.mainData;
                const fieldValueNext = fieldDatasNext && fieldDatasNext.get("field"+cellObjNext.get("field"));
                return  !is(fieldValue, fieldValueNext);
            }else if(etype === 7 || etype === 12 || etype === 13){  //明细、标签页、多字段
                return !is(this.props.mainData, nextProps.mainData)
                    || !is(this.props.detailData, nextProps.detailData)
                    || !is(this.props.detailRowValue, nextProps.detailRowValue)
                    || !is(this.props.fieldVariable, nextProps.fieldVariable);
            }else if(etype === 19){     //明细合计
                return !is(this.props.detailData, nextProps.detailData);
            }else if(etype === 22){     //序号
                return !is(this.props.detailRowValue, nextProps.detailRowValue);
            }else{      //layout或conf改变渲染即可
                return false;
            }
        }
        return true;
    }
    render() {
        const {actions,symbol,cellObj,conf,layout,mainData,detailData,detailRowValue,fieldVariable} = this.props;
        const cellid = cellObj.get("id");
        const cellMark = symbol+"_"+cellid.replace(",","_");
        const etype = parseInt(cellObj.get("etype")||0);
        const fieldid = cellObj.get("field");
        const evalue = cellObj.get("evalue");
        if(etype===0 || etype===1 || etype===4 || etype===6) {    //文本、节点名称、图片(可能有<br>)
            return this.renderDomObj(<span dangerouslySetInnerHTML={{__html:this.transCellText(evalue)}}></span>);
        }
        else if(etype===2 || etype===3) { //字段名、字段值
            const tableMark = symbol.indexOf("detail_")>-1 ? symbol : "main";
            const fieldInfo = conf ? conf.getIn(["tableInfo",tableMark,"fieldinfomap"]) : null;
            const fieldObj = fieldInfo && fieldInfo.get(fieldid);
            if(etype===2){
                return this.renderDomObj(
                    <FormLabel fieldObj={fieldObj} financialCfg={cellObj.get("financial")} />
                );
            }else if(etype===3){
                const fieldDatas = symbol.indexOf("detail_") > -1 ? detailRowValue : mainData;
                const fieldValue = fieldDatas && fieldDatas.get("field"+fieldid);
                const htmltype = parseInt(fieldObj.get("htmltype")||0);
                const viewAttr = parseInt(fieldObj.get("viewattr")||0);
                if(viewAttr === 0){
                    return null; 
                }
                const rowIndex = detailRowValue && detailRowValue.get("rowIndex");
                const baseInfo = {fieldid:fieldid, tableMark:tableMark, rowIndex:rowIndex, viewAttr:viewAttr};
                if(parseInt(fieldid) < 0){      //系统字段
                    return this.renderDomObj(
                        <SystemElement baseInfo={baseInfo} fieldObj={fieldObj} fieldValue={fieldValue} actions={actions} />
                    );
                }else if(htmltype === 1){
                    return this.renderDomObj(
                        <InputElement baseInfo={baseInfo} cellObj={cellObj} fieldObj={fieldObj} fieldValue={fieldValue} actions={actions} />
                    );
                }else if(htmltype === 2){
                    return this.renderDomObj(
                        <TextAreaElement baseInfo={baseInfo} cellObj={cellObj} fieldObj={fieldObj} fieldValue={fieldValue} actions={actions} />
                    );
                }else if(htmltype === 3){
                    return this.renderDomObj(
                        <BrowserElement baseInfo={baseInfo} cellObj={cellObj} fieldObj={fieldObj} fieldValue={fieldValue} actions={actions} />
                    );
                }else if(htmltype === 4){
                    return this.renderDomObj(
                        <CheckboxElement baseInfo={baseInfo} cellObj={cellObj} fieldObj={fieldObj} fieldValue={fieldValue} actions={actions} />
                    );
                }else if(htmltype === 5){
                    return this.renderDomObj(
                        <SelectElement baseInfo={baseInfo} cellObj={cellObj} fieldObj={fieldObj} fieldValue={fieldValue} actions={actions} />
                    );
                }else if(htmltype === 6){
                    return this.renderDomObj(
                        <FileElement baseInfo={baseInfo} fieldObj={fieldObj} fieldValue={fieldValue} actions={actions} />
                    );
                }else if(htmltype === 7){
                    const detailtype = fieldObj?fieldObj.get("detailtype"):"";
                    if(detailtype == "1"){
                        const displayname = fieldObj&&fieldObj.get("specialattr") ? fieldObj.getIn(["specialattr","displayname"]) : "";
                        const linkaddress = fieldObj&&fieldObj.get("specialattr") ? fieldObj.getIn(["specialattr","linkaddress"]) : "";
                        return this.renderDomObj(
                            <a href={linkaddress} target="_blank" dangerouslySetInnerHTML={{__html: displayname}}></a>
                        )
                    }else if(detailtype == "0" || detailtype == "2"){   //老表单有type为0的描述性文字
                        const descriptivetext = fieldObj&&fieldObj.get("specialattr") ? fieldObj.getIn(["specialattr","descriptivetext"]) : "";
                        return this.renderHtmlText(descriptivetext);
                    }
                }else if(htmltype === 8){
                    
                }else if(htmltype === 9){

                }
            }
        }
        else if(etype===5) { //流转意见
            const nodemark = conf ? conf.getIn(["cellInfo",cellMark,"nodemark"]):"";
            return this.renderHtmlText(nodemark);
        }
        else if(etype===7) { //明细
            const symbol = cellObj.get("detail");
            const detailLayout = layout && layout.hasIn(["etables",symbol]) ? layout.getIn(["etables",symbol]) : null;
            const detailValue = detailData && detailData.get(symbol);
            return this.renderDomObj(
                <FormDetailLayout 
                    actions={actions}
                    symbol={symbol}
                    conf={conf} 
                    detailLayout={detailLayout} 
                    detailValue={detailValue}
                    fieldVariable={fieldVariable} />
            );
        }
        else if(etype===10) { //明细增删按钮
            const detailTableAttr = conf && conf.getIn(["tableInfo",symbol,"detailtableattr"]);
            const isadd = detailTableAttr && detailTableAttr.get("isadd");
            const isdelete = detailTableAttr && detailTableAttr.get("isdelete");
            return this.renderDomObj(
                <div className="detailButtonDiv" style={{width:"100px"}}>
                    {isadd == "1" && <input disabled className="addbtn_p" type="button" title="添加"></input>}
                    {isdelete == "1" && <input disabled className="delbtn_p" type="button" title="删除"></input>}
                </div>
            );
        }
        else if(etype===11) { //链接
            const fieldtype = cellObj.get("fieldtype");
            const field = cellObj.get("field");
            const text = cellObj.get("evalue");
            let url = "";
            url = fieldtype==1?"http://":url;
            url = fieldtype==2?"https://":url;
            url = fieldtype==3?"ftp://":url;
            url = fieldtype==4?"news://":url;
            url += field;
            return this.renderDomObj(
                <a target="_blank" href={url}>{text}</a>
            );
        }
        else if(etype===12) { //标签页
            return this.renderDomObj(
                <FormTabLayout 
                    actions={actions}
                    cellMark={cellid.replace(",","_")}
                    tab={cellObj.get("tab")} 
                    layout={layout} 
                    conf={conf}
                    mainData={mainData} 
                    detailData={detailData}
                    fieldVariable={fieldVariable} />
            );
        }
        else if(etype===13) { //多内容
            const mcMark = cellObj.get("mcpoint");
            const mcLayout = layout && layout.hasIn(["etables",mcMark]) ? layout.getIn(["etables",mcMark]) : null;
            return this.renderDomObj(
                <FormMcLayout
                    actions={actions}
                    mcMark={mcMark}
                    mcLayout={mcLayout}
                    conf={conf}
                    mainData={mainData} 
                    fieldVariable={fieldVariable} />
            );
        }
        else if(etype===15 || etype===16 || etype===17) {     //门户元素、iframe区域、扫码区
            const html = conf ? conf.getIn(["cellInfo",cellMark,"htmlstr"]) : "";
            return this.renderHtmlText(html);
        }
        else if(etype===18 || etype===19) { //合计名称、合计值
            const fieldInfo = conf ? conf.getIn(["tableInfo",symbol,"fieldinfomap"]) : null;
            const fieldObj = fieldInfo && fieldInfo.get(fieldid);
            if(etype===18){
                const fieldlabel = fieldObj && fieldObj.get("fieldlabel");
                return this.renderDomObj(<span>{fieldlabel+"(合计)"}</span>);
            }else{
                if(conf.hasIn(["linkageCfg","colCalCfg",fieldid])){   //设置了合计
                    const detailValue = detailData && detailData.get(symbol);
                    return this.renderDomObj(<DetailSumCell symbol={symbol} fieldObj={fieldObj} detailValue={detailValue} />);
                }else{
                    return null;
                }
            }
        }
        else if(etype===20) { //明细全选
            return this.renderDomObj(<Checkbox disabled />);
        }
        else if(etype===21) { //明细单选
            return this.renderDomObj(<Checkbox disabled />);
        }
        else if(etype===22) { //序号
            return this.renderDomObj(<span>{detailRowValue.get("serialnum")}</span>);
        }
        return this.renderDomObj(<span>{evalue}</span>);
    }
    transCellText(content){
        if(content === null || typeof content === "undefined")
            return "";
        return content.replace(/(\r\n|\r|\n)/g, "</br>").replace(/ /g,"&nbsp;");
    }
    renderDomObj(content){
        const {symbol,cellAttr} = this.props;
        if(symbol.indexOf("mc_") > -1){
            return <span id={cellAttr.id} name={cellAttr.name} className={cellAttr.class} style={cellAttr.style}>{content}</span>
        }else{
            return <div id={cellAttr.id} name={cellAttr.name} className={cellAttr.class} style={cellAttr.style}>{content}</div>
        }
    }
    renderHtmlText(content) {
        const {symbol,cellAttr} = this.props;
        if(symbol.indexOf("mc_") > -1){
            return <span id={cellAttr.id} name={cellAttr.name} className={cellAttr.class} style={cellAttr.style} dangerouslySetInnerHTML={{__html:content}}></span>
        }else{
            return <div id={cellAttr.id} name={cellAttr.name} className={cellAttr.class} style={cellAttr.style} dangerouslySetInnerHTML={{__html:content}}></div>
        }
    }
}

export default FormCellType