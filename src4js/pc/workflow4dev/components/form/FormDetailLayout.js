import FormLayoutTr from './FormLayoutTr'
import Immutable from 'immutable'
import {is} from 'immutable'

class FormDetailLayout extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.symbol !== nextProps.symbol
            || !is(this.props.detailLayout, nextProps.detailLayout)
            || !is(this.props.detailValue, nextProps.detailValue)
            || !is(this.props.fieldVariable, nextProps.fieldVariable)
            || !is(this.props.conf, nextProps.conf);
    }
    render() {
        const {symbol,conf,detailLayout,detailValue,fieldVariable} = this.props;
        const headRow = parseInt(detailLayout.get("edtitleinrow") || 0);
        const bodyRow = parseInt(detailLayout.get("edtailinrow") || 0);
        if(headRow == 0 || bodyRow == 0 || bodyRow <= headRow) {
            return <div>对不起，表头标识、表尾标识设置异常，无法渲染明细！</div>
        }
        
        const rowheads = detailLayout.get("rowheads");
        const colheads = detailLayout.get("colheads");
        const colNum = colheads.size;
        const rowattrs = detailLayout.get("rowattrs");
        const colattrs = detailLayout.get("colattrs");
        const isSeniorSet = detailLayout.get("seniorset") == "1";
        const ec = detailLayout.get("ec");
        const ecMap = Immutable.Map(ec.map((v,k) => {
            return [v.get('id'), v]
        }));
        let _rowheads = rowheads.map((v,k)=>{
            return {id:k.substring(4), height:v}
        }).toArray();
        _rowheads = _rowheads.sort((a,b)=>{
            return parseInt(a.id)-parseInt(b.id);
        });
        let _colheads = colheads.map((v,k)=>{
            return {id:k.substring(4), width:v}
        }).toArray();
        _colheads = _colheads.sort((a,b)=>{
            return parseInt(a.id)-parseInt(b.id);
        });

        let addColType = 0;
        const detailArr = detailValue ? detailValue : [];
        let trArr = new Array();
        _rowheads.map((o)=>{
            const rowid = parseInt(o.id);
            const rowHeight = o.height;
            const rowCusAttr = rowattrs ? rowattrs.get("row_"+rowid) : null;
            if(rowid === headRow+1) {    //位于表头表尾标识之间
                if(!isSeniorSet)
                    addColType = 3;
                detailArr.map((v,k)=>{
                    for(let i=rowid; i<bodyRow; i++) {
                        trArr.push(<FormLayoutTr 
                            symbol={symbol}
                            colNum={colNum}
                            rowid={i}
                            rowHeight={rowHeight}
                            rowCusAttr={rowCusAttr}
                            colattrs={colattrs}
                            ecMap={ecMap}
                            conf={conf}
                            fieldVariable={fieldVariable}
                            addColType={addColType}
                            drowIndex={k}
                            detailRowValue={v}
                        />);
                    }
                });
            }else if(rowid < headRow || (isSeniorSet && rowid > bodyRow)){
                if(!isSeniorSet)
                    addColType = (rowid === headRow-1) ? 2 : 1;
                trArr.push(<FormLayoutTr 
                    symbol={symbol}
                    colNum={colNum}
                    rowid={rowid} 
                    rowHeight={rowHeight}
                    rowCusAttr={rowCusAttr}
                    colattrs={colattrs} 
                    ecMap={ecMap} 
                    conf={conf} 
                    fieldVariable={fieldVariable}
                    addColType={addColType}
                />);
            }
        })
        return (
            <div className="excelDetailTableDiv">
                <table className="excelDetailTable" style={{width:"100%"}}>
                    <colgroup>
                    {
                        !isSeniorSet && <col style={{width:"5%"}} />
                    }
                    {
                        _colheads.map((o)=><col style={{width:o.width}} />)
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