import {is} from 'immutable'
import {Row,Col,Popover,Button,Modal} from 'antd'

class BatchSubmit extends React.Component{
    shouldComponentUpdate(nextProps) {
        return this.props.showBatchSubmit !== nextProps.showBatchSubmit
            || this.props.selectedRowKeys !== nextProps.selectedRowKeys
            || !is(this.props.phrasesObj, nextProps.phrasesObj);
    }
    render() {
        const {actions,showBatchSubmit,phrasesObj} = this.props;
        const showPhrases = phrasesObj && phrasesObj.get("showPhrases");
        const editPhrases = phrasesObj && phrasesObj.get("editPhrases");
        const phrasesDatas = phrasesObj && phrasesObj.get("phrasesDatas");
        let phrasesContent = (
            <div className="wea-workflow-phrases">
                <div className="wea-workflow-phrases-list">
                    {phrasesDatas && 
                        phrasesDatas.map((val,index) =>
                            <div className="wea-workflow-phrases-item" onClick={this.clickPhrases.bind(this,index)}>{val.get("short")}</div>
                        )
                    }
                </div>
                <div style={{position: "relative"}}>
                    {editPhrases 
                        ? <div className="wea-workflow-phrases-edit">
                            <input type="text" className="wea-workflow-phrases-input" />
                            <Button type="primary" onClick={this.savePhrases.bind(this)}>确定</Button>
                        </div>
                        : <div className="wea-workflow-phrases-add" onClick={this.addPhrases.bind(this)}><i className="icon-top-Common" /></div>
                    }
                </div>
            </div>
        );
        return (
            <Modal wrapClassName="wea-workflow-batchsubmit" 
                visible={showBatchSubmit}
                maskClosable={false}
                title={this.getTopTitle()}
                onCancel={this.cancelEvent.bind(this)}
                footer= {[
                    <Button type="primary" size="large" onClick={this.submitEvent.bind(this)}>批量提交</Button>,
                    <Button type="ghost" size="large" onClick={this.cancelEvent.bind(this)}>关闭</Button>
                ]} 
            >
            <div className="wea-workflow-batchsubmit-area">
                <div>
                    <Popover overlayClassName="wea-workflow-phrases-popover" placement="bottomLeft" trigger="click" content={phrasesContent} visible={showPhrases} onVisibleChange={this.switchPhrases.bind(this)}>
                        <Button type="ghost">
                            <i className="icon-communication-message" />
                            <span>批示语</span>
                        </Button>
                    </Popover>
                </div>
                <div style={{paddingTop: "10px"}}>
                    <textarea className="wea-workflow-batchsubmit-sign"></textarea>
                </div>
            </div>
            </Modal>
        );
    }
    getTopTitle() {
        return (
            <Row>
                <Col span="8" style={{paddingLeft:20, lineHeight:"48px"}}>
                    <div className="wea-workflow-icon">
                        <i className='icon-portal-workflow' />
                    </div>
                    <span>填写签字意见</span>
                </Col>
            </Row>
        )
    }
    clickPhrases(index){
        const {actions,phrasesObj} = this.props;
        const phrasesDatas = phrasesObj && phrasesObj.get("phrasesDatas");
        const appendPhrasesValue = phrasesDatas && phrasesDatas.getIn([index,"desc"]);
        const signObj = jQuery(".wea-workflow-batchsubmit .wea-workflow-batchsubmit-sign");
        let phrasesText = signObj.val();
        if(phrasesText !== "")
            phrasesText += "\r\n";
        phrasesText += appendPhrasesValue;
        signObj.val(phrasesText);
        this.hidePhrases();
    }
    addPhrases(){
        const {actions,phrasesObj} = this.props;
        const editPhrases = phrasesObj && phrasesObj.get("editPhrases");
        actions.operPhrases({editPhrases: true});
    }
    savePhrases(){
        const {actions,phrasesObj} = this.props;
        const editPhrases = phrasesObj && phrasesObj.get("editPhrases");
        const phrasesText = jQuery(".wea-workflow-phrases .wea-workflow-phrases-input").val();
        if(phrasesText != "")
            actions.savePhrasesText(phrasesText);
        actions.operPhrases({editPhrases: false});
    }
    switchPhrases(){
        const {actions,phrasesObj} = this.props;
        const showPhrases = phrasesObj && phrasesObj.get("showPhrases");
        actions.operPhrases({showPhrases: !showPhrases, editPhrases:false});
    }
    hidePhrases(){
        const {actions,phrasesObj} = this.props;
        const showPhrases = phrasesObj && phrasesObj.get("showPhrases");
        actions.operPhrases({showPhrases: false, editPhrases:false});
    }
    submitEvent(){
        const {actions,selectedRowKeys} = this.props;
        const remark = jQuery(".wea-workflow-batchsubmit .wea-workflow-batchsubmit-sign").val();
        actions.batchSubmitWf(remark, selectedRowKeys);
        actions.setShowBatchSubmit(false);
    }
    cancelEvent(){
        const {actions} = this.props;
        actions.setShowBatchSubmit(false);
    }
}

export default BatchSubmit