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
            const fieldValue = this.props.formValue && this.props.formValue.get("field"+fieldid);
            const nextFieldValue = nextProps.formValue && nextProps.formValue.get("field"+nextfieldid);
            needrender = !is(fieldValue, nextFieldValue);
        }
        // console.log("no comp:",!is(this.props.cellInfo,nextProps.cellInfo),
        // " this.props.cellInfo:",this.props.cellInfo && this.props.cellInfo.toJS(),
        // " nextProps.cellInfo:",nextProps.cellInfo && nextProps.cellInfo.toJS());
        return needrender
        || !is(this.props.tableInfo,nextProps.tableInfo)
        || !is(this.props.cellObj,nextProps.cellObj)
        || !is(this.props.formValue4Detail,nextProps.formValue4Detail)
        || !is(this.props.etables,nextProps.etables)
        || !is(this.props.cellInfo,nextProps.cellInfo)
        || this.props.drowIndex !== nextProps.drowIndex
        || this.props.symbol!==nextProps.symbol;
    }
    render() {
        const {cellObj,tableInfo,formValue,formValue4Detail,etables,cellInfo,symbol,drowIndex} = this.props;
        const cellid = cellObj.get("id");
        const cellmark = symbol+"_"+cellid.replace(",","_");
        const etype = cellObj.get("etype");
        const fieldid = cellObj.get("field");
        const evalue = cellObj.get("evalue");
        //console.log("etype:",etype);
        if(etype==="" || etype==="0" || etype==="1" || etype==="4" || etype==="6") { //文本、节点名称、图片
            return this.rendSpanHtml(this.transCellText(evalue));
        }
        else if(etype==="2" || etype==="3") { //字段名、字段值
            const tablekey = symbol.indexOf("detail_")>-1 ? symbol : "main";
            const fieldInfo = tableInfo ? tableInfo.getIn([tablekey,"fieldinfomap"]) : null;
            //console.log("0 fieldid:",fieldid," fieldInfo:",fieldInfo.toJS());
            //console.log("1 fieldInfo:",fieldInfo && fieldInfo.get(fieldid));
            const fieldObj = fieldInfo && fieldInfo.get(fieldid);
            //console.log("2 fieldObj:",fieldObj);
            if(etype==="2"){
                return (
                    <FormLabel cellObj={cellObj} fieldObj={fieldObj} />
                );
            }
            else if(etype==="3"){
                return (
                    <FormField cellObj={cellObj} fieldObj={fieldObj} formValue={formValue} />
                );
            }
            //return <div></div>
        }
        else if(etype==="5") { //流转意见
            const nodemark = cellInfo?cellInfo.getIn([cellmark,"nodemark"]):"";
            return this.renderHtml(nodemark);
        }
        else if(etype==="7") { //明细
            const symbol = cellObj.get("detail");
            return (
                <FormDetailLayout symbol={symbol} detailLayout={etables.get(symbol)} tableInfo={tableInfo} formValue={formValue} formValue4Detail={formValue4Detail} />
            );
        }
        else if(etype==="10") { //明细增删按钮
            const detailTableAttr = tableInfo && tableInfo.getIn([symbol,"detailtableattr"]);
            const isadd = detailTableAttr && detailTableAttr.get("isadd");
            const isdelete = detailTableAttr && detailTableAttr.get("isdelete");
            return (
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
            return (
                <a target="_blank" href={url}>{text}</a>
            );
        }
        else if(etype==="12") { //标签页
            const style = cellInfo?cellInfo.getIn([cellmark,"stylejson"]):"";
            return (
                <FormTabLayout 
                    cellid={cellid}
                    style={style} 
                    tab={cellObj.get("tab")} 
                    etables={etables} 
                    tableInfo={tableInfo} 
                    formValue={formValue} 
                    formValue4Detail={formValue4Detail}
                    cellInfo={cellInfo} />
            );
        }
        else if(etype==="13") { //多内容
            const mcpoint = cellObj.get("mcpoint");
            const content = etables.get(mcpoint);
            return (
                <FormMcLayout 
                    mcpoint={mcpoint}
                    content={content} 
                    tableInfo={tableInfo} 
                    formValue={formValue} 
                    cellInfo={cellInfo} />
            );
        }
        else if(etype==="15") { //门户元素
            const html = cellInfo?cellInfo.getIn([cellmark,"htmlstr"]):"";
            return this.renderHtml(html);
        }
        else if(etype==="16") { //iframe区域
            const html = cellInfo?cellInfo.getIn([cellmark,"htmlstr"]):"";
            return this.renderHtml(html);
        }
        else if(etype==="17") { //扫码区
            const html = cellInfo?cellInfo.getIn([cellmark,"htmlstr"]):"";
            return this.renderHtml(html);
        }
        else if(etype==="18" || etype==="19") { //合计名称、合计值
            const fieldInfo = tableInfo ? tableInfo.getIn([symbol,"fieldinfomap"]) : null;
            const fieldObj = fieldInfo && fieldInfo.get(fieldid);
            if(etype==="18"){
                const fieldlabel = fieldObj && fieldObj.get("fieldlabel");
                return this.renderSpan(fieldlabel+"(合计)");
            }else{
                const detailValue = formValue4Detail && formValue4Detail.get(symbol);
                return <DetailSumCell symbol={symbol} fieldObj={fieldObj} detailValue={detailValue} />
            }
        }
        else if(etype==="20") { //明细全选
            return <Checkbox disabled />;
        }
        else if(etype==="21") { //明细单选
            return <Checkbox disabled />;
        }
        else if(etype==="22") { //序号
            return <span id={"serialnum_"+drowIndex}>{parseInt(drowIndex)+1}</span>;
        }
        return this.renderSpan(evalue);
    }
    transCellText(content){
        if(content === null || typeof content === "undefined")
            return "";
        return content.replace(/(\r\n|\r|\n)/g, "</br>").replace(/ /g,"&nbsp;");
    }
    renderSpan(content){
        return <span>{content}</span>
    }
    rendSpanHtml(content){
        return <span dangerouslySetInnerHTML={{__html:content}}></span>
    }
    renderHtml(innerHTML) {
        return <div dangerouslySetInnerHTML={{__html:innerHTML }} />
    }
}

export default FormCellType