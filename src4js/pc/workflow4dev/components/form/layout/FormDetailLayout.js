import FormLayoutTr from './FormLayoutTr'
import Immutable from 'immutable'
import {is} from 'immutable'

class FormDetailLayout extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.symbol !== nextProps.symbol
            || !is(this.props.detailLayout, nextProps.detailLayout)
            || !is(this.props.detailValue, nextProps.detailValue)
            || !is(this.props.fieldVariable, nextProps.fieldVariable)
            || this.props.conf.size !== nextProps.conf.size;
    }
    render() {
        const {actions,symbol,conf,detailLayout,detailValue,fieldVariable} = this.props;
        const headRow = parseInt(detailLayout.get("edtitleinrow") || 0);
        const bodyRow = parseInt(detailLayout.get("edtailinrow") || 0);
        if(headRow == 0 || bodyRow == 0 || bodyRow <= headRow) {
            return <div>对不起，表头标识、表尾标识设置异常，无法渲染明细！</div>
        }
        
        let rowheads = detailLayout.get("rowheads");
        rowheads = rowheads.map((v,k)=>{
            return {id:k.substring(4), height:v}
        }).toArray();
        rowheads = rowheads.sort((a,b)=>{
            return parseInt(a.id)-parseInt(b.id);
        });
        let colheads = detailLayout.get("colheads");
        const colNum = colheads.size;
        colheads = colheads.map((v,k)=>{
            return {id:k.substring(4), width:v}
        }).toArray();
        colheads = colheads.sort((a,b)=>{
            return parseInt(a.id)-parseInt(b.id);
        });
        const rowattrs = detailLayout.get("rowattrs");
        const colattrs = detailLayout.get("colattrs");
        const isSeniorSet = detailLayout.get("seniorset") == "1";
        const ec = detailLayout.get("ec");
        const ecMap = Immutable.Map(ec.map((v,k) => {
            return [v.get('id'), v]
        }));

        let addColType = 0;
        let detailArr = [];
        if(detailValue){
            detailValue.map((v,k) =>{
                let rowData = v;
                rowData = rowData.set("rowIndex", parseInt(k.substring(4)));
                detailArr.push(rowData);
            });
            detailArr = detailArr.sort((a,b)=>{
                return parseInt(a.get("serialnum"))-parseInt(b.get("serialnum"));
            });
        }
        let trArr = new Array();
        rowheads.map((o)=>{
            const rowid = parseInt(o.id);
            const rowHeight = o.height;
            const rowCusAttr = rowattrs ? rowattrs.get("row_"+rowid) : null;
            if(rowid === headRow+1) {    //位于表头表尾标识之间
                if(!isSeniorSet)
                    addColType = 3;
                detailArr.map(rowData=>{
                    for(let i=rowid; i<bodyRow; i++) {
                        trArr.push(<FormLayoutTr 
                            actions={actions}
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
                            detailRowValue={rowData}
                        />);
                    }
                });
            }else if(rowid < headRow || (isSeniorSet && rowid > bodyRow)){
                if(!isSeniorSet)
                    addColType = (rowid === headRow-1) ? 2 : 1;
                trArr.push(<FormLayoutTr 
                    actions={actions}
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
                        colheads.map((o)=><col style={{width:o.width}} />)
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