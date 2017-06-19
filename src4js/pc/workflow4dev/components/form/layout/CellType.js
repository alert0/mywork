import DetailLayout from './DetailLayout'
import McLayout from './McLayout'
import TabLayout from './TabLayout'
import FieldLabel from './FieldLabel'
import FieldContent from './FieldContent'
import Immutable from 'immutable'
import {is} from 'immutable'
import {Checkbox,Modal,message} from 'antd'

class CellType extends React.Component {
    shouldComponentUpdate(nextProps) {
        const cellObj = this.props.cellObj;
        const cellObjNext = nextProps.cellObj;
        const etype = parseInt(cellObj.get("etype")||0);
        const etypeNext = parseInt(cellObjNext.get("etype")||0);
        if(etype === etypeNext){
            const layoutChange = this.props.symbol !== nextProps.symbol
                || !is(this.props.cellObj, nextProps.cellObj)
                || !is(this.props.params, nextProps.params)
                || this.props.conf.size !== nextProps.conf.size;
            if(layoutChange)
                return true;
            //往下表示为同一字段
            if(etype === 2){            //字段名称(主字段显示属性联动隐藏内容需要render)
                if(this.props.symbol.indexOf("detail_") === -1){
                    const fieldid = cellObj.get("field").toString();
                    const mainFieldVarViewAttr = this.props.variableArea.getIn([`field${fieldid}`, "viewAttr"]);
                    const mainFieldVarViewAttrNext = nextProps.variableArea.getIn([`field${fieldid}`, "viewAttr"]);
                    return mainFieldVarViewAttr !== mainFieldVarViewAttrNext;
                }
            }else if(etype === 3){      //字段内容(此组件只做大范围判断，细化判断放在FieldContent中)
                return !is(this.props.mainData, nextProps.mainData)
                    || !is(this.props.detailRowData, nextProps.detailRowData)
                    || !is(this.props.variableArea, nextProps.variableArea);
            }else if(etype === 7 || etype === 12){  //明细、标签页
                return !is(this.props.mainData, nextProps.mainData)
                    || !is(this.props.detailData, nextProps.detailData)
                    || !is(this.props.variableArea, nextProps.variableArea);
            }else if(etype === 13){     //多字段
                return !is(this.props.mainData, nextProps.mainData)
                    || !is(this.props.variableArea, nextProps.variableArea);
            }else if(etype === 19){     //明细合计
                const fieldid = cellObj.get("field").toString();
                return !is(this.props.variableArea.get(`sum${fieldid}`), nextProps.variableArea.get(`sum${fieldid}`));
            }else if(etype === 20){     //明细全选
                return !is(this.props.curDetailInfo, nextProps.curDetailInfo);
            }else if(etype === 21){     //明细选中
                return !!this.props.detailRowData.get("checked") !== !!nextProps.detailRowData.get("checked");
            }else if(etype === 22){     //明细序号
                return this.props.detailRowData.get("serialNum") !== nextProps.detailRowData.get("serialNum");
            }else{      //layout或conf改变渲染即可
                return false;
            }
        }
        return true;
    }
    render() {
        const {actions,params,symbol,cellObj,conf,layout,mainData,detailData,curDetailInfo,detailRowData,variableArea} = this.props;
        const cellid = cellObj.get("id");
        const cellMark = symbol+"_"+cellid.replace(",","_");
        const etype = parseInt(cellObj.get("etype")||0);
        const evalue = cellObj.get("evalue");
        const isViewOnly = parseInt(params.get("isviewonly") || 0);
        if(etype===0 || etype===1 || etype===4 || etype===6) {    //文本、节点名称、图片(可能有<br>)
            return this.renderDomObj(<span dangerouslySetInnerHTML={{__html:this.transCellText(evalue)}}></span>);
        }
        else if(etype===2 || etype===3) { //字段名、字段值
            const fieldid = cellObj.get("field").toString();
            const isDetail = symbol.indexOf("detail_")>-1;
            const tableMark = isDetail ? symbol : "main";
            const fieldObj = conf.getIn(["tableInfo", tableMark, "fieldinfomap", fieldid]);
            if(etype===2){
                return this.renderDomObj(
                    <FieldLabel fieldObj={fieldObj} financialCfg={cellObj.get("financial")} />
                );
            }else if(etype===3){
                const rowIndex = isDetail ? detailRowData.get("rowIndex") : -1;
                //传入字段变量信息
                const fieldMark = isDetail ? `field${fieldid}_${rowIndex}` : `field${fieldid}`;
                let fieldVar = variableArea.get(fieldMark) || Immutable.fromJS({});
                fieldVar = fieldVar.set("promptRequired", variableArea && variableArea.get("promptRequiredField") === fieldMark);
                //传入当前字段值信息
                const fieldDatas = isDetail ? detailRowData : mainData;
                const fieldValueObj = fieldDatas && fieldDatas.get("field"+fieldid);
                //传入当前字段所依赖字段的值信息(此范围应按需生成，避免无效渲染)(例如选择框控制附件目录、自定义浏览框、SAP等)
                const fieldDependShip = conf.getIn(["fieldDependShip", fieldid]);
                let dependValueObj = Immutable.fromJS({});
                fieldDependShip && fieldDependShip.map(field=>{
                    const fieldArr = field.split("_");
                    const dependField = `field${fieldArr[0]}`;
                    let dependFieldValueObj = fieldArr[1] === "1" ? detailData.get(dependField) : mainData.get(dependField);
                    if(typeof dependFieldValueObj === "undefined" || dependFieldValueObj === null)
                        dependFieldValueObj = {value:""};
                    dependValueObj = dependValueObj.set(dependField, dependFieldValueObj);
                });
                //当前字段是否是已有明细行字段
                const isDetailExistField = isDetail && parseInt(detailRowData.get("keyid")||0) > 0;
                return this.renderDomObj(<FieldContent 
                        actions={actions}
                        conf={conf}
                        params={params}
                        symbol={symbol}
                        rowIndex={rowIndex}
                        cellObj={cellObj}
                        fieldValueObj={fieldValueObj}
                        dependValueObj={dependValueObj}
                        fieldVar={fieldVar}
                        isDetailExistField={isDetailExistField}
                />);
            }
        }
        else if(etype===5) { //流转意见
            return this.renderHtmlText(conf.getIn(["cellInfo",`${cellMark}_nodemark`]) || "");
        }
        else if(etype===7) { //明细
            const symbol = cellObj.get("detail");
            const detailLayout = layout && layout.hasIn(["etables",symbol]) ? layout.getIn(["etables",symbol]) : null;
            const curDetailInfo = detailData && detailData.get(symbol);
            const detailDependMainField = {};
            conf.get("fieldDependShip").map((v,k) =>{
                conf.hasIn(["tableInfo", symbol, "fieldinfomap", k]) && v && v.map(field =>{
                    const fieldArr = field.split("_");
                    if(fieldArr[1] === "0")
                       detailDependMainField[`field${fieldArr[0]}`] = fieldArr[0];
                });
            });
            //只传给当前明细依赖的主字段值
            const filterMainData = mainData && mainData.filter((v,k)=> {
                return (k in detailDependMainField);
            });
            return this.renderDomObj(<DetailLayout 
                    actions={actions}
                    params={params}
                    symbol={symbol}
                    conf={conf} 
                    detailLayout={detailLayout} 
                    mainData={filterMainData}
                    curDetailInfo={curDetailInfo}
                    variableArea={variableArea}
            />);
        }
        else if(etype===10) { //明细增删按钮
            const isadd = conf.getIn(["tableInfo",symbol,"detailtableattr","isadd"]);
            return this.renderDomObj(
                <div className="detailButtonDiv" style={{width:"100px"}}>
                    {isViewOnly !== 1 && isadd === 1 && 
                        <i className="icon-workflow-form-Add-to detailBtn" title="添加" onClick={this.addDetailRow.bind(this)} />}
                    {isViewOnly !== 1 && 
                        <i className="icon-workflow-form-delete detailBtn" title="删除" onClick={this.delDetailRow.bind(this)} />}
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
            return this.renderDomObj(<TabLayout 
                    actions={actions}
                    params={params}
                    cellMark={cellid.replace(",","_")}
                    tab={cellObj.get("tab")} 
                    layout={layout} 
                    conf={conf}
                    mainData={mainData} 
                    detailData={detailData}
                    variableArea={variableArea} 
            />);
        }
        else if(etype===13) { //多内容
            const mcMark = cellObj.get("mcpoint");
            const mcLayout = layout && layout.hasIn(["etables",mcMark]) ? layout.getIn(["etables",mcMark]) : null;
            return this.renderDomObj(<McLayout
                    actions={actions}
                    params={params}
                    mcMark={mcMark}
                    mcLayout={mcLayout}
                    conf={conf}
                    mainData={mainData} 
                    variableArea={variableArea}
            />);
        }
        else if(etype===15 || etype===16 || etype===17) {     //门户元素、iframe区域、扫码区
            return this.renderHtmlText(conf.getIn(["cellInfo",`${cellMark}_htmlstr`]) || "");
        }
        else if(etype===18 || etype===19) { //合计名称、合计值
            const fieldid = cellObj.get("field").toString();
            if(etype===18){
                const fieldlabel = conf.getIn(["tableInfo", symbol, "fieldinfomap", fieldid, "fieldlabel"]) || "";
                return this.renderDomObj(<span>{fieldlabel+"(合计)"}</span>);
            }else{
                let sumValue = "";
                if(conf.hasIn(["linkageCfg","colCalCfg",fieldid])){   //设置了合计
                    if(variableArea.has(`sum${fieldid}`))
                        sumValue = variableArea.get(`sum${fieldid}`);
                    else
                        sumValue = "0";
                }
                return this.renderDomObj(<span>{sumValue}</span>);
            }
        }
        else if(etype===20) { //明细全选
            const rowDatas = curDetailInfo && curDetailInfo.get("rowDatas");
            const isadd = conf.getIn(["tableInfo",symbol,"detailtableattr","isadd"]);
            const isdelete = conf.getIn(["tableInfo",symbol,"detailtableattr","isdelete"]);
            let isDisabled = true;
            let existCheckedRow = false;
            let existUnCheckedRow = false;
            if(isViewOnly !== 1 && rowDatas && rowDatas.size > 0 && (isadd === 1 || isdelete === 1)){
                rowDatas.map(rowData=>{
                    if(existUnCheckedRow || (isdelete !== 1 && parseInt(rowData.get("keyid")||0) > 0))     //已有明细禁止删除情况不参与
                        return "";
                    if(rowData.get("checked")){
                        existCheckedRow = true;
                    }else{
                        existUnCheckedRow = true;
                    }
                });
                if(existCheckedRow || existUnCheckedRow)
                    isDisabled = false;
            }
            return this.renderDomObj(<Checkbox onChange={this.setDetailAllRowChecked.bind(this)} disabled={isDisabled} checked={existCheckedRow && !existUnCheckedRow} />);
        }
        else if(etype===21) { //明细单选
            const checkProps = {checked:!!detailRowData.get("checked")};
            if(isViewOnly === 1 || (conf.getIn(["tableInfo",symbol,"detailtableattr","isdelete"]) !== 1 && parseInt(detailRowData.get("keyid")||0) > 0))
                checkProps["disabled"] = true;  //禁止删除已有明细
            return this.renderDomObj(<Checkbox onChange={this.setDetailRowChecked.bind(this)} {...checkProps} />);
        }
        else if(etype===22) { //序号
            return this.renderDomObj(<span>{detailRowData.get("serialNum")}</span>);
        }
        return this.renderDomObj(<span>{evalue}</span>);
    }
    transCellText(content){
        if(content === null || typeof content === "undefined")
            return "";
        return content.replace(/(\r\n|\r|\n)/g, "</br>").replace(/ /g,"&nbsp;");
    }
    renderDomObj(content){
        const {symbol,cellAttr,cellObj,variableArea} = this.props;
        const etype = parseInt(cellObj.get("etype")) || 0;
        let domProps = {id:cellAttr.id, name:cellAttr.name, className:cellAttr.class, style:cellAttr.style};
        if(etype === 2 || etype === 3){
            const fieldid = cellObj.get("field")||"";
            //DOM上体现下fieldid
            domProps["data-fieldid"] = fieldid;
            //显示属性联动隐藏内容
            if(symbol.indexOf("detail_") === -1 && variableArea.getIn([`field${fieldid}`, "viewAttr"]) === 4)
                domProps["className"] = `${domProps["className"]||""} linkage_hide`;
        }
        if(symbol.indexOf("mc_") > -1){
            return <span {...domProps}>{content}</span>
        }else{
            return <div {...domProps}>{content}</div>
        }
    }
    renderHtmlText(content) {
        const {symbol,cellAttr} = this.props;
        const domProps = {id:cellAttr.id, name:cellAttr.name, className:cellAttr.class, style:cellAttr.style};
        if(symbol.indexOf("mc_") > -1){
            return <span {...domProps} dangerouslySetInnerHTML={{__html:content}}></span>
        }else{
            return <div {...domProps} dangerouslySetInnerHTML={{__html:content}}></div>
        }
    }
    setDetailRowChecked(e){
        const {actions,symbol,detailRowData} = this.props;
        actions.setDetailRowChecked(symbol, detailRowData.get("rowIndex"), e.target.checked);
    }
    setDetailAllRowChecked(e){
        const {actions,symbol} = this.props;
        actions.setDetailAllRowChecked(symbol, e.target.checked);
    }
    addDetailRow(){
        const {actions,symbol} = this.props;
        actions.addDetailRow(symbol);
    }
    delDetailRow(){
        const {actions,symbol,curDetailInfo} = this.props;
        let hasChecked = false;
        const rowDatas = curDetailInfo && curDetailInfo.get("rowDatas");
        rowDatas && rowDatas.map(rowData=>{
            if(rowData.get("checked"))
                hasChecked = true;
        });
        if(!hasChecked){
            message.warning('请选择需要删除的记录！');
            return;
        }
        Modal.confirm({
            title: '确定要删除吗？',
            onOk() {
                actions.delDetailRow(symbol);
            },
            onCancel() {},
        });
    }
}

export default CellType