import FormCellType from './FormCellType'
import * as parse from '../../util/parseAttr'
import {is} from 'immutable'
import {Checkbox} from 'antd'

const findRowSpan = (row,col,ecMap)=>{
    let find = false;
    for(let j=col;j>=0&&!find;j--) {
        for(let i=row-1;i>=0&&!find;i--) {
            const cellObj = ecMap.get(i+","+j);
            const rowSpan = cellObj?(cellObj.get("rowspan")||1):0;
            const colSpan = cellObj?(cellObj.get("colspan")||1):0;
            if(rowSpan>1&&rowSpan>=(row-i+1)&&colSpan>=(col-j+1)) {
                find = true;
            }
        }
    }
    return find;
}

class FormLayoutTr extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !is(this.props.formValue,nextProps.formValue)
        || !is(this.props.tableInfo,nextProps.tableInfo)
        || !is(this.props.etables,nextProps.etables)
        || !is(this.props.ecMap,nextProps.ecMap)
        || this.props.row!==nextProps.row
        || this.props.drowIndex !== nextProps.drowIndex
        || this.props.addColType !== nextProps.addColType
        || this.props.rowHeight!==nextProps.rowHeight
        || this.props.cols!==nextProps.cols
        || !is(this.props.formValue4Detail,nextProps.formValue4Detail)
        || !is(this.props.cellInfo,nextProps.cellInfo)
        || this.props.symbol!==nextProps.symbol;
    }
    render() {
        let {cols,rowattrs,colattrs} = this.props;
        let col = 0;
        const {row,rowHeight,drowIndex,addColType} = this.props;
        const {ecMap,tableInfo,formValue,etables,formValue4Detail,cellInfo,symbol} = this.props;
        let colCell = new Array();
        while(col<cols) {
            const rc = row+","+col;
            const cellObj = ecMap.get(rc);
            const cellColAttrs = colattrs?colattrs.get("col_"+col):null;
            const colSpan = cellObj?(cellObj.get("colspan")||1):0;
            const rowSpan = cellObj?(cellObj.get("rowspan")||1):0;
            if(findRowSpan(row,col,ecMap)) {
                col += 1;
            }
            else if(!cellObj) {
                colCell.push(<td></td>);
                col += 1;
            } 
            else {
                const cellAttr = parse.getCellAttr(cellObj, cellColAttrs, rowHeight);
                let tdClassName = "etype_"+(cellObj?cellObj.get("etype"):1);
                if(cellAttr.class)  tdClassName += " "+cellAttr.class;
                if(col === 0 && symbol.indexOf("detail_") > -1 && addColType > 0){  //低级模式增加序号列
                    if(addColType === 1)
                        colCell.push(<td style={cellAttr.styleObj}><div style={cellAttr.innerStyleObj}></div></td>);
                    else if(addColType === 2)
                        colCell.push(<td style={cellAttr.styleObj}><div style={cellAttr.innerStyleObj}>
                            <Checkbox disabled /></div></td>);
                    else if(addColType === 3)
                        colCell.push(<td style={cellAttr.styleObj}><div style={cellAttr.innerStyleObj}>
                            <Checkbox disabled /><span id={"serialnum_"+drowIndex}>{parseInt(drowIndex)+1}</span></div></td>);
                }
                colCell.push(<td rowSpan={rowSpan} colSpan={colSpan} className={tdClassName} style={cellAttr.styleObj}>
                                <div id={cellAttr.cusid} name={cellAttr.cusname} className={cellAttr.cusclass} style={cellAttr.innerStyleObj}>
                                    <FormCellType 
                                        symbol={symbol} 
                                        drowIndex={drowIndex}
                                        cellInfo={cellInfo} 
                                        cellObj={cellObj} 
                                        etables={etables} 
                                        tableInfo={tableInfo} 
                                        formValue={formValue} 
                                        formValue4Detail={formValue4Detail} />
                                </div></td>);
                col += parseInt(colSpan);
            }
            
        }
        const rowCusAttr = rowattrs?rowattrs.get("row_"+row):null;
        const rowAttr = parse.getRowAttr(rowHeight, rowCusAttr);
        return (
            <tr id={rowAttr.id} name={rowAttr.name} className={rowAttr.class} style={rowAttr.styleObj}>{colCell}</tr>
        )
    }
}

export default FormLayoutTr