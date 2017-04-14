import FormCellType from './FormCellType'
import * as parse from '../../util/parseAttr'
import {is} from 'immutable'
import {Checkbox} from 'antd'

const findRowSpan = (rowid,colid,ecMap)=>{
    let find = false;
    for(let j=colid; j>=0&&!find; j--) {
        for(let i=rowid-1;i>=0&&!find;i--) {
            const cellObj = ecMap.get(i+","+j);
            const rowSpan = cellObj?(cellObj.get("rowspan")||1):0;
            const colSpan = cellObj?(cellObj.get("colspan")||1):0;
            if(rowSpan>1 && rowSpan>=(rowid-i+1) && colSpan>=(colid-j+1)) {
                find = true;
            }
        }
    }
    return find;
}

class FormLayoutTr extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.symbol !== nextProps.symbol
            || this.props.colNum !== nextProps.colNum
            || this.props.rowid !== nextProps.rowid
            || this.props.rowHeight !== nextProps.rowHeight
            || !is(this.props.rowCusAttr, nextProps.rowCusAttr)
            || !is(this.props.colattrs, nextProps.colattrs)
            || !is(this.props.ecMap, nextProps.ecMap)
            || !is(this.props.layout, nextProps.layout)
            || !is(this.props.conf, nextProps.conf)
            || !is(this.props.mainData, nextProps.mainData)
            || !is(this.props.detailData, nextProps.detailData)
            || !is(this.props.fieldVariable, nextProps.fieldVariable)
            || this.props.drowIndex !== nextProps.drowIndex
            || this.props.addColType !== nextProps.addColType
            || !is(this.props.detailRowValue, nextProps.detailRowValue);
    }
    render() {
        const {symbol,colNum,rowid,rowHeight,rowCusAttr,colattrs,ecMap,layout,conf,mainData,detailData,fieldVariable} = this.props;
        const {drowIndex,addColType,detailRowValue} = this.props;      //明细解析相关
        let colid = 0;
        let cellArr = new Array();
        while(colid < colNum) {     //从行第一列正序解析
            const cellObj = ecMap.get(rowid+","+colid);
            if(findRowSpan(rowid,colid,ecMap)) {  //行合并单元格不生成DOM
                colid += 1;
            } else if(!cellObj) {
                cellArr.push(<td></td>);
                colid += 1;
            } else {
                const rowSpan = cellObj.get("rowspan") || 1;
                const colSpan = cellObj.get("colspan") || 1;
                const colCusAttr = colattrs?colattrs.get("col_"+colid):null;
                const tdCellAttr = parse.getCellAttr(cellObj, colCusAttr, rowHeight);
                let tdClassName = "etype_"+cellObj.get("etype");
                if(tdCellAttr.tdClass)  tdClassName += " "+tdCellAttr.tdClass;
                if(colid === 0 && symbol.indexOf("detail_") > -1 && addColType > 0){  //低级模式增加序号列
                    if(addColType === 1)
                        cellArr.push(<td style={tdCellAttr.styleObj}><div style={tdCellAttr.innerStyleObj}></div></td>);
                    else if(addColType === 2)
                        cellArr.push(<td style={tdCellAttr.styleObj}><div style={tdCellAttr.innerStyleObj}>
                            <Checkbox disabled /></div></td>);
                    else if(addColType === 3)
                        cellArr.push(<td style={tdCellAttr.styleObj}><div style={tdCellAttr.innerStyleObj}>
                            <Checkbox disabled /><span id={"serialnum_"+drowIndex}>{parseInt(drowIndex)+1}</span></div></td>);
                }
                const cellAttr = {id:tdCellAttr.cusid, name:tdCellAttr.cusname, class:tdCellAttr.cusclass, style:tdCellAttr.innerStyleObj};
                cellArr.push(<td rowSpan={rowSpan} colSpan={colSpan} className={tdClassName} style={tdCellAttr.styleObj}>
                                <FormCellType
                                    symbol={symbol}
                                    drowIndex={drowIndex}
                                    cellAttr={cellAttr}
                                    cellObj={cellObj} 
                                    layout={layout} 
                                    conf={conf}
                                    mainData={mainData}
                                    detailData={detailData}
                                    detailRowValue={detailRowValue}
                                    fieldVariable={fieldVariable} />
                            </td>);
                colid += parseInt(colSpan);
            }
        }
        const rowAttr = parse.getRowAttr(rowHeight, rowCusAttr);
        return (
            <tr id={rowAttr.id} name={rowAttr.name} className={rowAttr.trClass} style={rowAttr.styleObj}>{cellArr}</tr>
        )
    }
}

export default FormLayoutTr