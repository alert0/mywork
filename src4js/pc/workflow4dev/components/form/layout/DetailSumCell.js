import {is} from 'immutable'

class DetailSumCell extends React.Component{

    shouldComponentUpdate(nextProps) {
        return this.props.symbol !== nextProps.symbol
            || is(this.props.fieldObj, nextProps.fieldObj)
            || is(this.props.detailValue, nextProps.detailValue);
    }
    render() {
        const {symbol,fieldObj,detailValue} = this.props;
        const fieldid = fieldObj && fieldObj.get("fieldid");
        const detailtype = fieldObj?fieldObj.get("detailtype"):"";
        //linkageCfg属性一级级传输太繁琐，暂时全局获取，做编辑时再考虑方案
        const workflowReqForm = window.store_e9_workflow.getState().workflowReqForm;
        const coltrifields = workflowReqForm && workflowReqForm.getIn(["linkageCfg", "coltrifields"]);
        let needSum = false;
        coltrifields && coltrifields.map(v =>{
            if(v === (fieldid+""))
                needSum = true;
        });
        let showSumValue = "";
        if(needSum){
            let fieldSumValue = 0;
            detailValue && detailValue.map((val, index) =>{
                let fieldValue = val && val.getIn(["field"+fieldid, "value"]);
                fieldValue = fieldValue.replace(/,/g, "");
                if(!!fieldValue && !isNaN(fieldValue))
                    fieldSumValue += parseFloat(fieldValue)
            });
            let decimals = 2;
            if(fieldObj && detailtype == "2")
                decimals = 0;
            else if(fieldObj && (detailtype == "3" || detailtype == "5"))
                decimals = parseInt(fieldObj.get("qfws"));
            let thousands = detailtype == "5" ? 1 : 0;
            showSumValue = FormatFloatValue(fieldSumValue, decimals, thousands);
        }
        return <span>{showSumValue}</span>
    }
}

function FormatFloatValue(realval, decimals, thousands){
    //console.log("realval",realval,"decimals",decimals,"thousands",thousands)
	var regnum = /^(-?\d+)(\.\d+)?$/;
	if(!regnum.test(realval)){
		return realval;
	}
    realval = realval.toString();
	var formatval = "";
	if(decimals === 0){		//需取整
		formatval = Math.round(parseFloat(realval));
	}else{
        var n = Math.pow(10, decimals);
        formatval = Math.round(parseFloat(realval)*n)/n;
		var pindex = realval.indexOf(".");
		var pointLength = pindex>-1 ? realval.substr(pindex+1).length : 0;	//当前小数位数
		if(decimals > pointLength){		//需补零
            if(pindex == -1)
			    formatval += ".";
			for(var i=0; i<decimals-pointLength; i++){
				formatval += "0";
			}
		}
	}
	formatval = formatval.toString();
	var index = formatval.indexOf(".");
	var intPar = index>-1 ? formatval.substring(0,index) : formatval;
	var pointPar = index>-1 ? formatval.substring(index) : "";
	if(thousands===1){				//整数位format成千分位
   		var reg1 = /(-?\d+)(\d{3})/;
        while(reg1.test(intPar)) {   
        	intPar = intPar.replace(reg1, "$1,$2");   
        } 
	}
	formatval = intPar + pointPar;
	return formatval;
}

export default DetailSumCell