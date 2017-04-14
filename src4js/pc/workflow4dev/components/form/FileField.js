import {is} from 'immutable'
import {Row,Col,Button,Icon} from 'antd'

class FileField extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !is(this.props.fieldObj, nextProps.fieldObj)
            || !is(this.props.fieldValue, nextProps.fieldValue);
    }
    render() {
        const {fieldObj,fieldValue} = this.props;
        const detailtype = fieldObj && fieldObj.get("detailtype");
        const fileobj = fieldValue && fieldValue.get("specialobj");
        const filedatas = fileobj && fileobj.get("filedatas");
        let theValue = fieldValue && fieldValue.has("value") ? fieldValue.get("value").toString() : "";
        return (
            <div className="field-filearea">
                {filedatas && filedatas.map((obj) => 
                    <Row onMouseLeave={this.showBtn.bind(this)}>
                        <Col span={16}>
                            <div className="field-file-img" dangerouslySetInnerHTML={{__html:obj.get("imgSrc")}}></div>
                            <div className="field-file-name">
                                    <a href={obj.get("filelink")} title={obj.get("filename")} target='_blank'>{obj.get("filename")}</a>
                            </div>
                        </Col>
                        <Col span={4}>
                            <div className="field-file-size">{obj.get("filesize")}</div>
                        </Col>
                        <Col span={4}>
                            <div className="field-file-btn">
                                {obj.get("showLoad") == "true" && 
                                    <a href={obj.get("loadlink")}>下载</a>
                                }
                            </div>
                        </Col>
                    </Row>
                )}
                {false && 
                    <Row>
                        <Col span={24}>
                            <div className="field-file-btnarea">
                                <Button type="default">   
                                    <i className="anticon anticon-arrow-down" style={{float:"left",marginTop:"4px"}}/>全部下载
                                </Button>
                            </div>
                        </Col>
                    </Row>
                }
            </div>
        )
    }
    showBtn(){
    }
}

export default FileField