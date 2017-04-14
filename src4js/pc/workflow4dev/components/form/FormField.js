import {is} from 'immutable'
import FileField from './FileField'
import {Checkbox} from 'antd'

class FormField extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !is(this.props.fieldValue, nextProps.fieldValue)
            ||!is(this.props.cellObj, nextProps.cellObj)
            ||!is(this.props.fieldObj, nextProps.fieldObj);
    }
    render() {
        const {cellObj,fieldObj,fieldValue} = this.props;
        const htmltype = fieldObj?fieldObj.get("htmltype"):"";
        const detailtype = fieldObj?fieldObj.get("detailtype"):"";
        const fieldid = cellObj.get("field");
        const isdetail = fieldObj && (fieldObj.get("isdetail") == "1");
        
        let theValue = fieldValue && fieldValue.has("value") ? fieldValue.get("value").toString() : "";
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
                fieldValue && fieldValue.has("showname") && (theValue = fieldValue.get("showname"));
                fieldValue && fieldValue.has("formatvalue") && (theValue = fieldValue.get("formatvalue"));
                if(detailtype == "1")
                    return <span id={"field"+fieldid+"span"} dangerouslySetInnerHTML={{__html: theValue}}></span>
                else
                    return <span id={"field"+fieldid+"span"}>{theValue}</span>
            }else if(detailtype == "4"){
                const specialobj = fieldValue && fieldValue.get("specialobj");
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
                return <div style={{overflowX:"auto",overflowY:"hidden"}} dangerouslySetInnerHTML={{__html: theValue}} />
        }else if(htmltype == "3"){      //浏览框
            let showname = fieldValue && fieldValue.get("showname");
            if(fieldValue && fieldValue.has("formatvalue"))
                showname = fieldValue.get("formatvalue");
            return <span id={"field"+fieldid+"span"} dangerouslySetInnerHTML={{__html: showname}} />
        }else if(htmltype == "4"){      //check框
            return <Checkbox checked={theValue=="1"} disabled />
        }else if(htmltype == "5"){      //选择框
            let showname = fieldValue && fieldValue.get("showname");
            return <span id={"field"+fieldid+"span"}>{showname}</span>
        }else if(htmltype == "6"){      //附件上传
            return <FileField fieldObj={fieldObj} fieldValue={fieldValue} />
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
        
        fieldValue && fieldValue.has("showname") && (theValue = fieldValue.get("showname"));
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