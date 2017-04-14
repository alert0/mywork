import FormField from './FormField'
import FormLabel from './FormLabel'
import FormDetailLayout from './FormDetailLayout'
import FormMcLayout from './FormMcLayout';
import FormTabLayout from './FormTabLayout'
import DetailSumCell from './DetailSumCell'
import {is} from 'immutable'
import objectAssign from 'object-assign'
import {Button,Checkbox} from 'antd'

class FormCellType extends React.Component {
    shouldComponentUpdate(nextProps) {
        const cellObj = this.props.cellObj;
        const cellObjNext = nextProps.cellObj;
        let needrender = false;
        if(cellObj.get("etype") == "2" || cellObj.get("etype") == "3"){
            const fieldid = cellObj.get("field");
            const nextfieldid = cellObjNext.get("field");
            const fieldValue = this.props.mainData && this.props.mainData.get("field"+fieldid);
            const nextFieldValue = nextProps.mainData && nextProps.mainData.get("field"+nextfieldid);
            needrender = !is(fieldValue, nextFieldValue);
        }
        return needrender
            || this.props.symbol !== nextProps.symbol
            || !is(this.props.cellObj, nextProps.cellObj)
            || !is(this.props.conf, nextProps.conf)
            || !is(this.props.layout, nextProps.layout)
            || !is(this.props.mainData, nextProps.mainData)
            || !is(this.props.detailData, nextProps.detailData)
            || !is(this.props.detailRowValue, nextProps.detailRowValue)
            || !is(this.props.fieldVariable, nextProps.fieldVariable)
            || this.props.drowIndex !== nextProps.drowIndex;
    }
    render() {
        const {symbol,cellObj,conf,layout,mainData,detailData,detailRowValue,fieldVariable,drowIndex} = this.props;
        const cellid = cellObj.get("id");
        const cellMark = symbol+"_"+cellid.replace(",","_");
        const etype = cellObj.get("etype");
        const fieldid = cellObj.get("field");
        const evalue = cellObj.get("evalue");
        if(etype==="" || etype==="0" || etype==="1" || etype==="4" || etype==="6") {    //文本、节点名称、图片(可能有<br>)
            return this.renderDomObj(<span dangerouslySetInnerHTML={{__html:this.transCellText(evalue)}}></span>);
        }
        else if(etype==="2" || etype==="3") { //字段名、字段值
            const tablekey = symbol.indexOf("detail_")>-1 ? symbol : "main";
            const fieldInfo = conf ? conf.getIn(["tableInfo",tablekey,"fieldinfomap"]) : null;
            const fieldObj = fieldInfo && fieldInfo.get(fieldid);
            if(etype==="2"){
                return this.renderDomObj(
                    <FormLabel cellObj={cellObj} fieldObj={fieldObj} />
                );
            }
            else if(etype==="3"){
                let fieldValue = null;
                if(symbol.indexOf("detail_") > -1)
                    fieldValue = detailRowValue && detailRowValue.get("field"+fieldid);
                else
                    fieldValue = mainData && mainData.get("field"+fieldid);
                return this.renderDomObj(
                    <FormField cellObj={cellObj} fieldObj={fieldObj} fieldValue={fieldValue} />
                );
            }
        }
        else if(etype==="5") { //流转意见
            const nodemark = conf ? conf.getIn(["cellInfo",cellMark,"nodemark"]):"";
            return this.renderHtmlText(nodemark);
        }
        else if(etype==="7") { //明细
            const symbol = cellObj.get("detail");
            const detailLayout = layout && layout.hasIn(["etables",symbol]) ? layout.getIn(["etables",symbol]) : null;
            const detailValue = detailData && detailData.get(symbol);
            return this.renderDomObj(
                <FormDetailLayout 
                    symbol={symbol}
                    conf={conf} 
                    detailLayout={detailLayout} 
                    detailValue={detailValue}
                    fieldVariable={fieldVariable} />
            );
        }
        else if(etype==="10") { //明细增删按钮
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
        else if(etype==="11") { //链接
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
        else if(etype==="12") { //标签页
            return this.renderDomObj(
                <FormTabLayout 
                    cellMark={cellid.replace(",","_")}
                    tab={cellObj.get("tab")} 
                    layout={layout} 
                    conf={conf}
                    mainData={mainData} 
                    detailData={detailData}
                    fieldVariable={fieldVariable} />
            );
        }
        else if(etype==="13") { //多内容
            const mcMark = cellObj.get("mcpoint");
            const mcLayout = layout && layout.hasIn(["etables",mcMark]) ? layout.getIn(["etables",mcMark]) : null;
            return this.renderDomObj(
                <FormMcLayout
                    mcMark={mcMark}
                    mcLayout={mcLayout}
                    conf={conf}
                    mainData={mainData} 
                    fieldVariable={fieldVariable} />
            );
        }
        else if(etype==="15" || etype==="16" || etype==="17") {     //门户元素、iframe区域、扫码区
            const html = conf ? conf.getIn(["cellInfo",cellMark,"htmlstr"]) : "";
            return this.renderHtmlText(html);
        }
        else if(etype==="18" || etype==="19") { //合计名称、合计值
            const fieldInfo = conf ? conf.getIn(["tableInfo",symbol,"fieldinfomap"]) : null;
            const fieldObj = fieldInfo && fieldInfo.get(fieldid);
            if(etype==="18"){
                const fieldlabel = fieldObj && fieldObj.get("fieldlabel");
                return this.renderDomObj(<span>{fieldlabel+"(合计)"}</span>);
            }else{
                const detailValue = detailData && detailData.get(symbol);
                return this.renderDomObj(<DetailSumCell symbol={symbol} fieldObj={fieldObj} detailValue={detailValue} />);
            }
        }
        else if(etype==="20") { //明细全选
            return this.renderDomObj(<Checkbox disabled />);
        }
        else if(etype==="21") { //明细单选
            return this.renderDomObj(<Checkbox disabled />);
        }
        else if(etype==="22") { //序号
            return this.renderDomObj(<span id={"serialnum_"+drowIndex}>{parseInt(drowIndex)+1}</span>);
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