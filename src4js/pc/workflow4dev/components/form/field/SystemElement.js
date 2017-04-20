import {is} from 'immutable'

class SystemElement extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !is(this.props.fieldValue, nextProps.fieldValue)
            || this.props.baseInfo !== nextProps.baseInfo
            || !is(this.props.fieldObj, nextProps.fieldObj);
    }
    render() {
        const {baseInfo,fieldObj,fieldValue} = this.props;
        let theValue = fieldValue && fieldValue.has("value") ? fieldValue.get("value").toString() : "";
        fieldValue && fieldValue.has("showname") && (theValue = fieldValue.get("showname"));
        return <div dangerouslySetInnerHTML={{__html: theValue}} />
    }
}

export default SystemElement