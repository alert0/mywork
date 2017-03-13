import FormLayoutTr from './FormLayoutTr'
import Immutable from 'immutable'
import {is} from 'immutable'

class FormDetailLayout extends React.Component {
    shouldComponentUpdate(nextProps) {
        const symbol = this.props.symbol;
        const symbolNext = nextProps.symbol;
        const detailValue = this.props.formValue4Detail && this.props.formValue4Detail.get(symbol);
        const detailValueNext = nextProps.formValue4Detail &&  nextProps.formValue4Detail.get(symbolNext);
        return symbol !== symbolNext
            || !is(detailValue, detailValueNext)
            || !is(this.props.detailLayout, nextProps.detailLayout)
            || !is(this.props.tableInfo, nextProps.tableInfo)
            || !is(this.props.formValue, nextProps.formValue);
    }
    render() {
        const {symbol,detailLayout,tableInfo,formValue,formValue4Detail} = this.props;
        const detailValue = formValue4Detail && formValue4Detail.get(symbol);
        const detailArr = detailValue ? detailValue : [];
        let rowheads = detailLayout.get("rowheads");
        const colheads = detailLayout.get("colheads");
        const ec = detailLayout.get("ec");
        const headRow = detailLayout.get("edtitleinrow") ? parseInt(detailLayout.get("edtitleinrow")) : 0;
        const bodyRow = detailLayout.get("edtailinrow") ? parseInt(detailLayout.get("edtailinrow")) : 0;
        const isSeniorSet = detailLayout.get("seniorset") == "1";
        let addColType = 0;
        if(headRow == 0 || bodyRow == 0 || bodyRow <= headRow) {
            return (<div>对不起，表头标识、表尾标识设置异常，无法渲染明细！</div>)
        }
        const ecMap = Immutable.Map(ec.map((v,k) => {
            return [v.get('id'), v]
        }));
        const rowattrs = detailLayout.get("rowattrs");
        const colattrs = detailLayout.get("colattrs");

        let _rowheads = rowheads.map((v,k)=>{
            return {id:k,h:v}
        }).toArray();
        _rowheads = _rowheads.sort((a,b)=>{
            return parseInt(a.id.substring(4))-parseInt(b.id.substring(4));
        });
        let _colheads = colheads.map((v,k)=>{
            return {id:k,w:v}
        }).toArray();
        _colheads = _colheads.sort((a,b)=>{
            return parseInt(a.id.substring(4))-parseInt(b.id.substring(4));
        });
        let cols = colheads.size;
        let trArr = new Array();
        _rowheads.map((o)=>{
            const r = o.h;
            const k = o.id;
            const rowArr = k.split("_");
            const row = parseInt(rowArr.length>0?rowArr[1]:-1);
            const rowHeight = r;
            if(row === headRow+1) {    //位于表头表尾标识之间
                if(!isSeniorSet)
                    addColType = 3;
                detailArr.map((v,k)=>{
                    for(let i=row;i<bodyRow;i++) {
                        trArr.push(<FormLayoutTr 
                            symbol={symbol}
                            row={i} 
                            cols={cols} 
                            drowIndex={k}
                            addColType={addColType}
                            rowHeight={rowHeight} 
                            ecMap={ecMap} 
                            tableInfo={tableInfo} 
                            formValue={v} 
                            etables={null}
                            cellInfo={null}
                            rowattrs={rowattrs}
                            colattrs={colattrs} />);
                    }
                });
            }else if(row < headRow || (isSeniorSet && row > bodyRow)){
                if(!isSeniorSet)
                    addColType = (row === headRow-1) ? 2 : 1;
                trArr.push(<FormLayoutTr 
                    symbol={symbol}
                    row={row} 
                    cols={cols} 
                    addColType={addColType}
                    rowHeight={rowHeight} 
                    ecMap={ecMap} 
                    tableInfo={tableInfo} 
                    formValue={formValue} 
                    etables={null}
                    cellInfo={null}
                    formValue4Detail={formValue4Detail}
                    rowattrs={rowattrs}
                    colattrs={colattrs} />);
            }
        })
        return (
            <div className="excelDetailTableDiv">
            <table className="excelDetailTable" style={{width:"100%"}}>
            <colgroup>
            {!isSeniorSet &&
                <col style={{width:"5%"}} />}
            {
                _colheads.map((o)=>{
                    return (
                        <col style={{width:o.w}} />
                    )
                })
            }
            </colgroup>
            <tbody>
            {trArr}
            </tbody>
            </table>
            </div>
        )
    }
}

export default FormDetailLayout