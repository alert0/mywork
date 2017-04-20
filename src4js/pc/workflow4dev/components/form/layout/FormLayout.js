import FormLayoutTr from './FormLayoutTr'
import Immutable from 'immutable'
import {is} from 'immutable'

class FormLayout extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.symbol !== nextProps.symbol
            || !is(this.props.params, nextProps.params)
            || !is(this.props.mainData, nextProps.mainData)
            || !is(this.props.detailData, nextProps.detailData)
            || !is(this.props.fieldVariable, nextProps.fieldVariable)
            || this.props.conf.size !== nextProps.conf.size
            || !is(this.props.layout, nextProps.layout);
    }
    render() {
        const {actions,symbol,params,layout,conf,mainData,detailData,fieldVariable} = this.props;
        const etable = layout && layout.hasIn(["etables",symbol]) ? layout.getIn(["etables",symbol]) : null;
        if(etable == null)
            return <div>Layout error</div>

        const isMain = symbol === "emaintable" ? true : false;
        let className = isMain ? "excelMainTable" : "excelTabTable tablefixed";
        let hasPercent = false;
        let rowheads = etable.get("rowheads");
        rowheads = rowheads.map((v,k)=>{
            return {id:k.substring(4), height:v}
        }).toArray();
        rowheads = rowheads.sort((a,b)=>{
            return parseInt(a.id)-parseInt(b.id);
        });
        let colheads = etable.get("colheads");
        const colNum = colheads.size;
        colheads = colheads.map((v,k)=>{
            if(v.indexOf("%") > -1)
                hasPercent = true;
            return {id:k.substring(4), width:(v==="0%" ? "*": v)}
        }).toArray();
        colheads = colheads.sort((a,b)=>{
            return parseInt(a.id)-parseInt(b.id);
        });
        const rowattrs = etable.get("rowattrs");
        const colattrs = etable.get("colattrs");
        const ec = etable.get("ec");
        const ecMap = ec ? Immutable.Map(ec.map(v => [v.get('id'), v])) : null;
        
        

        let _style = {};
        if((isMain && hasPercent) || !isMain)
            _style.width = "100%";
        if(isMain)
            _style.margin = "0px auto";
        let trArr = new Array();
        rowheads.map((o)=>{
            const rowid = o.id;
            const rowCusAttr = rowattrs ? rowattrs.get("row_"+rowid) : null;
            trArr.push(<FormLayoutTr 
                actions={actions}
                symbol={symbol}
                colNum={colNum} 
                rowid={rowid} 
                rowHeight={o.height}
                rowCusAttr={rowCusAttr}
                colattrs={colattrs}
                ecMap={ecMap}
                layout={layout}
                conf={conf}
                mainData={mainData}
                detailData={detailData}
                fieldVariable={fieldVariable}
            />);
        });

        let hiddenarea = [];
        if(isMain){
            params.get('hiddenarea') && params.get('hiddenarea').mapEntries(o =>{
                hiddenarea.push(<input type="hidden" id={o[0]} name={o[0]} value={o[1]}/>)
            });
            mainData.mapEntries && mainData.mapEntries(f => {
                let domfieldid = f[0];
                let domfieldvalue = f[1] && f[1].get("value");
                if(domfieldid == "field-1")
                    domfieldid = "requestname";
                else if(domfieldid == "field-2")
                    domfieldid = "requestlevel";
                else if(domfieldid == "field-3")
                    domfieldid = "messageType"
                else if(domfieldid == "field-5")
                    domfieldid = "chatsType";
                hiddenarea.push(<input type="hidden" id={domfieldid} name={domfieldid} value={domfieldvalue} />)
            });
            detailData && detailData.map((v,k) => {
                const detailIndex = parseInt(k.substring(7))-1;
                let submitdtlid = "";
                v && v.map((datas, rowKey) => {
                    const rowIndex = parseInt(rowKey.substring(4));
                    submitdtlid += rowIndex+",";
                    datas.mapEntries && datas.mapEntries(f => {
                        if(f[0] === "keyid"){
                            hiddenarea.push(<input type="hidden" name={`dtl_id_${detailIndex}_${rowIndex}`} value={f[1]} />);
                        }else if(f[0].indexOf("field") > -1){
                            const domfieldvalue = f[1] && f[1].get("value");
                            const domfieldid = f[0]+"_"+rowIndex;
                            hiddenarea.push(<input type="hidden" id={domfieldid} name={domfieldid} value={domfieldvalue} />);
                        }
                    })
                })
                hiddenarea.push(<input type="hidden" id={`nodesnum${detailIndex}`} name={`nodesnum${detailIndex}`} value={v.size} />);
                hiddenarea.push(<input type="hidden" id={`indexnum${detailIndex}`} name={`indexnum${detailIndex}`} value={v.size} />);
                hiddenarea.push(<input type="hidden" id={`submitdtlid${detailIndex}`} name={`submitdtlid${detailIndex}`} value={submitdtlid} />);
                hiddenarea.push(<input type="hidden" id={`deldtlid${detailIndex}`} name={`deldtlid${detailIndex}`} value="" />);
            });
        }

        return (
            <div>
                <table className={className} style={_style}>
                    <colgroup>
                    {
                        colheads.map((o)=><col style={{width: o.width}} />)
                    }
                    </colgroup>
                    <tbody>
                    {trArr}
                    </tbody>
                </table>
                {isMain && <div id="scriptcontent"></div>}
                {isMain && <div id="custompage"></div>}
                {isMain && <form>
                    {hiddenarea}
                </form>}
            </div>
        )
    }
}

export default FormLayout