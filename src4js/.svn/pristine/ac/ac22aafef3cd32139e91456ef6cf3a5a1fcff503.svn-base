import {is} from 'immutable'
import FileField from './FileField'
import {Checkbox} from 'antd'

class FormField extends React.Component {
    shouldComponentUpdate(nextProps) {
        const cellObj = this.props.cellObj;
        const cellObjNext = nextProps.cellObj;
        const formValue = this.props.formValue;
        const formValueNext = nextProps.formValue;
        const obj = formValue?formValue.get("field"+cellObj.get("field")):"";
        const objNext = formValueNext?formValueNext.get("field"+cellObjNext.get("field")):"";
        return !is(obj,objNext)
            ||!is(this.props.cellObj,nextProps.cellObj)
            ||!is(this.props.fieldObj,nextProps.fieldObj);
    }
    render() {
        const {cellObj,fieldObj,formValue} = this.props;
        const htmltype = fieldObj?fieldObj.get("htmltype"):"";
        const detailtype = fieldObj?fieldObj.get("detailtype"):"";
        const fieldid = cellObj.get("field");
        const isdetail = fieldObj && (fieldObj.get("isdetail") == "1");
        
        const fieldValueObj = formValue && formValue.get("field"+fieldid);
        let theValue = fieldValueObj && fieldValueObj.has("value") ? fieldValueObj.get("value").toString() : "";
        if(htmltype == "1"){       //文本类型
            const financial = cellObj.get("financial");
            if(financial && financial.indexOf("2-") > -1){      //财务表览
                const financialValues = transFinancialArr(theValue);
                const finaNum = parseInt(financial.split("-")[1] || "3");
                let showTds = new Array();
                for(let i=finaNum-1; i>=0; i--) {
                    let itemBorder = "fborder1";
                    if(i === 0)
                        itemBorder = "";
                    else if(i === 2)
                        itemBorder = "fborder2";
                    else if((i-2)%3 === 0)
                        itemBorder = "fborder3";
                    itemBorder = "finborder " + itemBorder;
                    showTds.push(<td className={itemBorder}>{financialValues[i]||""}</td>)
                }
                return (
                    <div className="findiv">
                        <table className="fintable">
                            <tr>{showTds}</tr>
                        </table>
                    </div>
                )
            }
            if(detailtype == "1" || detailtype == "2" || detailtype == "3" || detailtype == "5"){
                fieldValueObj && fieldValueObj.has("showname") && (theValue = fieldValueObj.get("showname"));
                fieldValueObj && fieldValueObj.has("formatvalue") && (theValue = fieldValueObj.get("formatvalue"));
                if(detailtype == "1")
                    return <span id={"field"+fieldid+"span"} dangerouslySetInnerHTML={{__html: theValue}}></span>
                else
                    return <span id={"field"+fieldid+"span"}>{theValue}</span>
            }else if(detailtype == "4"){
                const specialobj = fieldValueObj && fieldValueObj.get("specialobj");
                const thousandsVal = specialobj && specialobj.get("thousandsVal");
                const upperVal = specialobj && specialobj.get("upperVal");
                if(isdetail)
                    return <span id={"field"+fieldid+"span"}>{upperVal}</span>
                else
                    return (
                        <div>
                            <span>{thousandsVal}</span><br/>
                            <span id={"field"+fieldid+"span"}>{upperVal}</span>
                        </div>
                    )
            }
        }else if(htmltype == "2"){      //多行文本框
            if(detailtype == "1")
                return <span id={"field"+fieldid+"span"} dangerouslySetInnerHTML={{__html: theValue}}></span>
            else
                return <div style={{overflowX:"auto"}} dangerouslySetInnerHTML={{__html: theValue}} />
        }else if(htmltype == "3"){      //浏览框
            let showname = fieldValueObj && fieldValueObj.get("showname");
            if(fieldValueObj && fieldValueObj.has("formatvalue"))
                showname = fieldValueObj.get("formatvalue");
            return <span id={"field"+fieldid+"span"} dangerouslySetInnerHTML={{__html: showname}} />
        }else if(htmltype == "4"){      //check框
            return <Checkbox checked={theValue=="1"} disabled />
        }else if(htmltype == "5"){      //选择框
            let showname = fieldValueObj && fieldValueObj.get("showname");
            return <span id={"field"+fieldid+"span"}>{showname}</span>
        }else if(htmltype == "6"){      //附件上传
            return <FileField fieldObj={fieldObj} fieldValueObj={fieldValueObj} />
        }
        else if(htmltype == "7"){      //特殊字符
            if(detailtype == "1"){
                const displayname = fieldObj&&fieldObj.get("specialattr") ? fieldObj.getIn(["specialattr","displayname"]) : "";
                const linkaddress = fieldObj&&fieldObj.get("specialattr") ? fieldObj.getIn(["specialattr","linkaddress"]) : "";
                return (
                    <a href={linkaddress} target="_blank" dangerouslySetInnerHTML={{__html: displayname}}></a>
                )
            }else if(detailtype == "0" || detailtype == "2"){   //老表单有type为0的描述性文字
                const descriptivetext = fieldObj&&fieldObj.get("specialattr") ? fieldObj.getIn(["specialattr","descriptivetext"]) : "";
                return (
                    <div dangerouslySetInnerHTML={{__html: descriptivetext}} />
                )
            }
        }
        
        fieldValueObj && fieldValueObj.has("showname") && (theValue = fieldValueObj.get("showname"));
        return <div dangerouslySetInnerHTML={{__html: theValue}} />
    }
}

export default FormField

function transFinancialArr(fieldVal){
    if(!!!fieldVal)  fieldVal = "0";
    fieldVal = fieldVal.replace(/,/g, "");
    var valArr = new Array();			
	var reg1 = /^(-?\d+)(\.\d+)?$/;
	var reg2 = /^(-?\d*)(\.\d+)$/;		//解决类型-.22这种格式
	if(reg1.test(fieldVal) || reg2.test(fieldVal)){
		fieldVal = parseFloat(fieldVal).toFixed(2);
		if((fieldVal.length>2&&fieldVal.substring(0,2) == "0.") || (fieldVal.length>3&&fieldVal.substring(0,3) == "-0.")){
			fieldVal = fieldVal.replace("0.",".");
		}
		for(var i=fieldVal.length-1; i>=0; i--){
			var valc = fieldVal.charAt(i);
			if(valc != ".")	
                valArr.push(valc);
		}
	}
    return valArr;
}