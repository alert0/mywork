import FormCellType from './FormCellType'
import * as parse from '../../util/parseAttr'
import Immutable from 'immutable'
import {is} from 'immutable'

class FormMcLayout extends React.Component{
    shouldComponentUpdate(nextProps) {
        return !is(this.props.mainData, nextProps.mainData)
                || !is(this.props.fieldVariable, nextProps.fieldVariable)
                || !is(this.props.conf, nextProps.conf)
                || !is(this.props.mcLayout, nextProps.mcLayout)
                || this.props.mcMark !== nextProps.mcMark;
    }
    render() {
        const {mcMark,mcLayout,conf,mainData,fieldVariable} = this.props;
        const rowCount = mcLayout.get("rowcount");
        const ec = mcLayout.get("ec");
        const ecMap = ec?Immutable.Map(ec.map(v => [v.get('id'), v])):null;
        let mcCells = new Array();
        for(let r=0; r<rowCount; r++){
            const cellObj = ecMap.get(r+",0");
            if(cellObj){
                let className = "span_mc etype_"+cellObj.get("etype");
                const mcCellAttr = parse.getMcCellAttr(cellObj);
                className += mcCellAttr.cusclass ? (" "+mcCellAttr.cusclass) : "";
                const cellAttr = {id:mcCellAttr.cusid, name:mcCellAttr.cusname, class:className, style:mcCellAttr.innerStyleObj};
                mcCells.push(<FormCellType 
                                symbol={mcMark}
                                cellAttr={cellAttr}
                                cellObj={cellObj}
                                conf={conf} 
                                mainData={mainData} 
                                fieldVariable={fieldVariable} />
                            );
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
