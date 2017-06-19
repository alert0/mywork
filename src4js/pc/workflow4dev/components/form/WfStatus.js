import {Row ,Col, Card, Table} from 'antd';
import Immutable from 'immutable'
import {is} from 'immutable'

class WfStatus extends React.Component{
    constructor(props) {
		super(props);
    }
    shouldComponentUpdate(nextProps,nextState) {
        return !is(this.props.datas, nextProps.datas)
            || !is(this.props.reqParams, nextProps.reqParams);
    }
    render() {
        const {actions,datas,reqParams} = this.props;
        const cardid = datas && datas.get("cardid");
        const cardData = datas && datas.getIn([cardid,"datas"]);
        const counts = datas && datas.get("counts");
        const cardInfo = [
			{id:'all', title:'总人次', color:'#3ac8d2', num:(counts && counts.get('allcount')), icon:'icon-workflow-form-Total-person-time'},
			{id:'submit', title:'已提交', color:'#8dc139', num:(counts && counts.get('submitcount')), icon:'icon-workflow-form-Has-been-submitted'},
			{id:'nosubmit', title:'未提交', color:'#b37bf8', num:(counts && counts.get('nosubmitcount')), icon:'icon-workflow-form-Not-submitted'},
			{id:'view', title:'已查看', color:'#38b1ff', num:(counts && counts.get('viewcount')), icon:'icon-workflow-form-Already-view'},
			{id:'noview', title:'未查看',  color:'#ff9736', num:(counts && counts.get('noviewcount')), icon:'icon-workflow-form-Not-viewed'}
		];
        const statusCode = ['',<span style={{color:"#FF0000"}}>未查看</span>,<span style={{color:"#FF33CC"}}>已查看</span>,'已提交','暂停','撤销','启用'];
        const tableColumn = cardid === 'all' ? [
			{title: '序号',dataIndex: 'num',key: 'num',width:'8%'},
			{title: '节点',dataIndex: 'operator',key: 'operator',width:'16%'},
			{title: '操作情况统计',dataIndex: 'status',key: 'status',colSpan:4,width:'16%'},
            {title: '',dataIndex: 'receivedate',key: 'receivedate',colSpan:0,width:'20%'},
			{title: '',dataIndex: 'operatedate',key: 'operatedate',colSpan:0,width:'20%'},
			{title: '',dataIndex: 'intervel',key: 'intervel',colSpan:0}
		]: [
			{title: '操作人',dataIndex: 'operator',key: 'operator',width:'12%'},
			{title: '节点',dataIndex: 'nodename',key: 'nodename',width:'16%'},
			{title: '操作状态',dataIndex: 'status',key: 'status',width:'16%'},
			{title: '接收时间',dataIndex: 'receivedate',key: 'receivedate',width:'18%'},
			{title: '操作时间',dataIndex: 'operatedate',key: 'operatedate',width:'18%'},
			{title: '操作耗时',dataIndex: 'intervel',key: 'intervel'},
		];
        let tableData = [];
        let expandedRowKeys = [];
        let dataLength = 0;
        const totalLength = counts ? parseInt(counts.get(`${cardid}count`)) : 0;
        if(cardid === 'all'){
            let hideRowKeys = datas && datas.get("hideRowKeys");
            if(!hideRowKeys)    hideRowKeys = Immutable.List([]);
            const nodeSize = cardData ? cardData.size : 0;
            for(let i=0; i<nodeSize; i++){
                const node = cardData.get(`key${i}`);
                if(!node)   continue;
                let rowDetail = [];
                node.get('list').map((r,j)=>{
                    rowDetail.push({
                        num: '',
                        key: `rowDetail_${i+1}_${j+1}`,
                        operator: this.getUserCardLink(r.get('operatorid'),r.get('operator')),
                        status: statusCode[r.get('statuscode')],
                        receivedate: r.get('receivedate'),
                        operatedate: r.get('operatedate'),
                        intervel: r.get('intervel')
                    })
                });
                dataLength += rowDetail.length;
                let nodeRowData = {
                    num: i+1,
                    key: `rowDataHead_${i+1}`,
                    operator: node.get('nodename'),
                    status: `操作者总计: ${node.get('listcount')}`,
                    receivedate: <span style={node.get('submitCount') == 0 ? {} : {color:'#8dc139'}}>{`已提交: ${node.get('submitCount')}`}</span>,
                    operatedate: <span style={node.get('viewCount') == 0 ? {} : {color:'#38b1ff'}}>{`已查看: ${node.get('viewCount')}`}</span>,
                    intervel: <span style={node.get('noviewCount') == 0 ? {} : {color:'#ff9736'}}>{`未查看: ${node.get('noviewCount')}`}</span>,
                    children:[{
                        num: '',
                        key: `rowDetailHead_${i+1}`,
                        operator: '操作人',
                        status: '操作状态',
                        receivedate: '接收时间',
                        operatedate: '操作时间',
                        intervel: '操作耗时',
                        children: rowDetail
                    }]
                }
                hideRowKeys.indexOf(`rowDataHead_${i+1}`) == -1 && expandedRowKeys.push(`rowDataHead_${i+1}`);
                expandedRowKeys.push(`rowDetailHead_${i+1}`);
                tableData.push(nodeRowData);
            }
        }else{
            cardData && cardData.map((v,k) => {
                v.get("list").map(r => {
                    tableData.push({
                        operator: this.getUserCardLink(r.get('operatorid'),r.get('operator')),
                        nodename: v.get("nodename"),
                        status: statusCode[r.get('statuscode')],
                        receivedate: r.get('receivedate'),
                        operatedate: r.get('operatedate'),
                        intervel: r.get('intervel')
                    });
                })
            });
            dataLength = tableData.length;
        }
        return (
            <div className='wea-workflow-status'>
	            <Row>
	            	<Col className='wea-workflow-status-card-wapper' span={24} style={{padding:'0 0 20px 0'}}>
	            		{
	            			cardInfo.map((t,i)=>{
								let cardStyle = t.id === cardid ? {boxShadow: '0 0 5px #008aff',border: '1px solid #008aff'} : {border: '1px solid #d5d5d5'};
								cardStyle["color"] = t.color;
                                cardStyle["marginRight"] = i < 3 && "1.25%";
								cardStyle["float"] = i == 4 ? "right" : "left";
                                return <div className='wea-workflow-status-card' style={cardStyle} title={t.title} onClick={this.switchCard.bind(this,t.id)} >
	            					<div>
		            					<i className={t.icon} />
		            					<div>
			            					<p style={{fontSize:26}}>{t.num}</p>
			            					<p style={{fontSize:12,color:'#5b5b5b'}}>{t.title}</p>
	            						</div>
	            					</div>
	            				</div>
	            			}
	            		)}
	            	</Col>
	            </Row>
	            <Row className="wea-workflow-status-content">
                    {cardid === 'all' ? 
		            	<Col span={24} style={{border:'1px solid #e9e9e9',borderBottom:dataLength<totalLength?"none":"1px solid #e9e9e9"}}>
		            		<Table pagination={false} columns={tableColumn} dataSource={tableData} size="middle" 
                                className='wea-workflow-status-table-main' expandedRowKeys={expandedRowKeys} onRowClick={this.setHideRowKeys.bind(this)} />
		            	</Col>
            			:
		            	<Col span={24}>
		            		<Table pagination={false} columns={tableColumn} dataSource={tableData} size="middle"
                                className='wea-workflow-status-table-single' />
		            	</Col>
	            	}
                    {dataLength<totalLength && 
                        <Col span={24}>
                            <div style={{textAlign:"center"}}>
                                <span className="wea-workflow-status-loadmore" onClick={this.loadMoreData.bind(this)}>
                                    <i className="anticon anticon-arrow-down" style={{marginRight:"4px"}}></i>加载更多
                                </span>
                            </div>
                        </Col>
                    }
	            </Row>
            </div>
        )
    }
    getUserCardLink(id,name){
        return <a className="wea-hrm-card" href={`javaScript:openhrm(${id})`} onClick={event => window.pointerXY(event)}>{name}</a>
    }
    switchCard(cardid){
        const {actions,datas,reqParams} = this.props;
        datas && datas.has(cardid) ? actions.switchWfStatusCard(cardid) : actions.loadWfStatusData(reqParams,cardid,true);
    }
    loadMoreData(par){
        const {actions,datas,reqParams} = this.props;
        const cardid = datas && datas.get("cardid");
        actions.loadWfStatusData(reqParams,cardid,false);
    }
    setHideRowKeys(r){
		if(r.key.indexOf('rowDataHead_') == 0){
            const {actions,datas} = this.props;
            let hideRowKeys = datas && datas.get("hideRowKeys");
            if(!hideRowKeys)    hideRowKeys = Immutable.List([]);
            const index = hideRowKeys.indexOf(r.key);
            hideRowKeys = index>-1 ? hideRowKeys.delete(index) : hideRowKeys.push(r.key);
			actions.controlWfStatusHideRow(hideRowKeys);
		}
    }
}

export default WfStatus