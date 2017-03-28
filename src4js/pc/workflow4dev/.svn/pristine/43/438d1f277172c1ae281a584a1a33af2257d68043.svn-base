import FormCellType from './FormCellType';
import * as parse from '../../util/parseAttr'
import Immutable from 'immutable';
import {is} from 'immutable'

class FormMcLayout extends React.Component{
    shouldComponentUpdate(nextProps) {
        return this.props.mcpoint !== nextProps.mcpoint
            ||!is(this.props.content,nextProps.content)
            ||!is(this.props.tableInfo,nextProps.tableInfo)
            ||!is(this.props.formValue,nextProps.formValue)
            ||!is(this.props.cellInfo,nextProps.cellInfo);
    }
    render() {
        const {mcpoint,content,tableInfo,formValue,cellInfo} = this.props;
        const rowCount = content.get("rowcount");
        const ec = content.get("ec");
        const ecMap = ec?Immutable.Map(ec.map(v => [v.get('id'), v])):null;
        let mcCells = new Array();
        for(let r=0; r<rowCount; r++){
            const cellObj = ecMap.get(r+",0");
            if(cellObj){
                let className = "span_mc etype_"+cellObj.get("etype");
                const mcCellAttr = parse.getMcCellAttr(cellObj);
                className += mcCellAttr.cusclass ? (" "+mcCellAttr.cusclass) : "";
                mcCells.push(<span id={mcCellAttr.cusid} name={mcCellAttr.cusname} className={className} style={mcCellAttr.innerStyleObj}>
                                <FormCellType 
                                    symbol={mcpoint} 
                                    cellInfo={cellInfo} 
                                    cellObj={cellObj} 
                                    tableInfo={tableInfo} 
                                    formValue={formValue} /></span>);
                const brObj = ecMap.get(r+",1");
                brObj && brObj.get("etype") === "14" && brObj.get("brsign") === "Y" && mcCells.push(<br/>);
            }
        }
        return (
            <div>{mcCells}</div>
        );
    }
}

export default FormMcLayout
