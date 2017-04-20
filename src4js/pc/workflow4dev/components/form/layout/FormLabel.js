import {is} from 'immutable'

class FormLabel extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !is(this.props.fieldObj,nextProps.fieldObj)
            || this.props.financialCfg !== nextProps.financialCfg;
    }
    render() {
        const {financialCfg,fieldObj} = this.props;
        const fieldlabel = fieldObj && fieldObj.get("fieldlabel");
        if(financialCfg && financialCfg.indexOf("1-") > -1) {     //财务表头
            const financialTypes = ["分","角","元","十","百","千","万","十","百","千","亿","十"];
            const finaNum = parseInt(financialCfg.split("-")[1] || "3");
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
                showTds.push(<td className={itemBorder}>{financialTypes[i]}</td>)
            }
            return (
                <div className="findiv">
                    <table className="fintable">
                        <tr className="ftoprow"><td colSpan={finaNum}>{fieldlabel}</td></tr>
                        <tr>{showTds}</tr>
                    </table>
                </div>
            )
        }
        return <span>{fieldlabel}</span>;
    }
}

export default FormLabel