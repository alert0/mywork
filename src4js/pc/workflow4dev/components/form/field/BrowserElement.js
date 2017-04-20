import {is} from 'immutable'

class BrowserElement extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !is(this.props.fieldValue, nextProps.fieldValue)
            || this.props.baseInfo !== nextProps.baseInfo
            || !is(this.props.cellObj, nextProps.cellObj)
            || !is(this.props.fieldObj, nextProps.fieldObj);
    }
    render() {
        const {baseInfo,cellObj,fieldObj,fieldValue} = this.props;
        const detailtype = fieldObj?fieldObj.get("detailtype"):"";
        const fieldid = cellObj.get("field");
        const isdetail = fieldObj && (fieldObj.get("isdetail") == "1");
        
        let theValue = fieldValue && fieldValue.has("value") ? fieldValue.get("value").toString() : "";
        let showname = fieldValue && fieldValue.get("showname");
        if(fieldValue && fieldValue.has("formatvalue"))
            showname = fieldValue.get("formatvalue");
        return <span id={"field"+fieldid+"span"} dangerouslySetInnerHTML={{__html: showname}} />
    }
}

export default BrowserElement