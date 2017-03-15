import FormLayoutTr from './FormLayoutTr'

import {is} from 'immutable'

class FormLayout extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !is(this.props.formValue,nextProps.formValue)
        ||!is(this.props.tableInfo,nextProps.tableInfo)
        ||!is(this.props.colheads,nextProps.colheads)
        ||!is(this.props.rowheads,nextProps.rowheads)
        ||!is(this.props.etables,nextProps.etables)
        ||!is(this.props.ecMap,nextProps.ecMap)
        ||this.props.className!==nextProps.className
        ||!is(this.props.style,nextProps.style)
        ||!is(this.props.formValue4Detail,nextProps.formValue4Detail)
        ||!is(this.props.cellInfo,nextProps.cellInfo)
        ||this.props.symbol!==nextProps.symbol;
    }
    render() {
        let that = this;
        const {className,style,rowheads,cellInfo,symbol,rowattrs,colattrs} = this.props;
        const {tableInfo,formValue,formValue4Detail,etables,colheads,ecMap} = this.props;
        let _rowheads = rowheads.map((v,k)=>{
            return {id:k,h:v}
        }).toArray();
        _rowheads = _rowheads.sort((a,b)=>{
            return parseInt(a.id.substring(4))-parseInt(b.id.substring(4));
        });
        let _colheads = colheads.map((v,k)=>{
            let colwidth = v==="0%" ? "*": v;
            return {id:k,w:colwidth}
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
            const row = rowArr.length>0?rowArr[1]:-1;
            const rowHeight = r;
            trArr.push(<FormLayoutTr 
                symbol={symbol}
                row={row} 
                cols={cols} 
                rowHeight={rowHeight} 
                ecMap={ecMap} 
                tableInfo={tableInfo} 
                formValue={formValue} 
                etables={etables}
                formValue4Detail={formValue4Detail}
                cellInfo={cellInfo}
                rowattrs={rowattrs}
                colattrs={colattrs} />);
        })
        return (
            <div>
            <table className={className} style={style}>
            <colgroup>
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

export default FormLayout