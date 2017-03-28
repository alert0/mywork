import {Row ,Col, Card, Table,Collapse  } from 'antd';

import Immutable from 'immutable'
const is = Immutable.is;

class Status extends React.Component {
	constructor(props) {
		super(props);
		this.state={key:'all',expandedRowKeys:[],tableData1st:[]}
    }
	componentDidMount(){
    	const {datas} = this.props;
		if(Immutable.Map.isMap(datas)){
			this.doSetting(datas);
		}
	}
	doSetting(datas){
		const {key,expandedRowKeys} = this.state;
		const statusCode = ['',<span style={{color:"#FF0000"}}>未查看</span>,<span style={{color:"#FF33CC"}}>已查看</span>,'已提交','暂停','撤销','启用'];
		let tableData = [];
		let tableData1st = [];
		let expandedRowKeysNew = [];
		datas.get(key) && datas.get(key).map((d,i)=>{
			let submitCount = 0;
			let viewCount = 0;
			let noviewCount = 0;
			let rowDetail = [];
			d.get('list').map((r,j)=>{
				if(r.get('statuscode') == 3){submitCount++};
				if(r.get('statuscode') == 2){viewCount++};
				if(r.get('statuscode') == 1){noviewCount++};
				rowDetail.push(
					{
						num:'',
						key:`rowDetail_${i+1}_${j+1}`,
						nodename: <a className="wea-hrm-card" href={`javaScript:openhrm(${r.get('operatorid')})`} onClick={event => window.pointerXY(event)}>{r.get('operator')}</a>,
						allcount:statusCode[r.get('statuscode')],
						submit:r.get('reveivedate'),
						view:r.get('operatedate'),
						noview:r.get('intervel'),
					}
				)
			});
			let rowData1st = {
				num:i+1,
				key:`rowData1st_${i+1}`,
				nodename:d.get('nodename'),
				allcount:`操作者总计: ${d.get('listcount')}`,
				submit:<span style={submitCount == 0 ? {} : {color:'#8dc139'}}>{`已提交: ${submitCount}`}</span>,
				view:<span style={viewCount == 0 ? {} : {color:'#38b1ff'}}>{`已查看: ${viewCount}`}</span>,
				noview:<span style={noviewCount == 0 ? {} : {color:'#ff9736'}}>{`未查看: ${noviewCount}`}</span>,
				children:[{
					num:'',
					key:`rowDetailHead_${i+1}`,
					nodename:'操作人',
					allcount:'操作状态',
					submit:'接收时间',
					view:'操作时间',
					noview:'操作耗时',
					children:rowDetail
				}]
			}
			expandedRowKeysNew.push(`rowData1st_${i+1}`);
			expandedRowKeysNew.push(`rowDetailHead_${i+1}`);
			tableData1st.push(rowData1st);
		});
		this.setState({
			tableData1st:tableData1st,
			expandedRowKeys:expandedRowKeysNew
		});
	}
	shouldComponentUpdate(nextProps,nextState) {
        return  !is(this.props.datas,nextProps.datas) ||
        this.state.key !== nextState.key ||
        !is(Immutable.fromJS(this.state.tableData1st),Immutable.fromJS(nextState.tableData1st)) ||
        !is(Immutable.fromJS(this.state.expandedRowKeys),Immutable.fromJS(nextState.expandedRowKeys));
    }
	componentWillReceiveProps(nextProps){
		const {datas} = this.props;
		if(!is(datas,nextProps.datas)){
			this.doSetting(nextProps.datas);
		}
	}
	componentWillUnmount() {
		
    }
    render() {
    	const {datas} = this.props;
    	const {key,expandedRowKeys,tableData1st} = this.state;
		const menu = [
			{title:'总人次',key:'all',color:'#3ac8d2',num: datas.get('allcount'),icon:'icon-form-Total-person-time'},
			{title:'已提交',key:'submit',color:'#8dc139',num: datas.get('submitcount'),icon:'icon-form-Has-been-submitted'},
			{title:'未提交',key:'nosubmit',color:'#b37bf8',num: datas.get('nosubmitcount'),icon:'icon-form-Not-submitted'},
			{title:'已查看',key:'view',color:'#38b1ff',num: datas.get('viewcount'),icon:'icon-form-Already-view'},
			{title:'未查看',key:'noview',color:'#ff9736',num: datas.get('noviewcount'),icon:'icon-form-Not-viewed'}
		];
		const columns = key == 'all' ? [
			{title: '序号',dataIndex: 'num',key: 'num'},
			{title: '节点',dataIndex: 'nodename',key: 'nodename'},
			{title: '操作情况统计',dataIndex: 'allcount',key: 'allcount',colSpan:4},
			{title: '已提交',dataIndex: 'submit',key: 'submit',colSpan:0},
			{title: '已查看',dataIndex: 'view',key: 'view',colSpan:0},
			{title: '未查看',dataIndex: 'noview',key: 'noview',colSpan:0}
		]: [
			{title: '操作人',dataIndex: 'operator',key: 'operator'},
			{title: '节点',dataIndex: 'nodename',key: 'nodename'},
			{title: '操作状态',dataIndex: 'statuscode',key: 'statuscode'},
			{title: '接收时间',dataIndex: 'reveivedate',key: 'reveivedate'},
			{title: '操作时间',dataIndex: 'operatedate',key: 'operatedate'},
			{title: '操作耗时',dataIndex: 'intervel',key: 'intervel'},
		];
		const statusCode = ['',<span style={{color:"#FF0000"}}>未查看</span>,<span style={{color:"#FF33CC"}}>已查看</span>,'已提交','暂停','撤销','启用'];
		let tableData = [];
		datas.get(key) && datas.get(key).map((d,i)=>{
			key !== 'all' && d.get('list').map(r=>{
				let rowData = r.toJS();
				rowData['operator'] = <a className="wea-hrm-card" href={`javaScript:openhrm(${r.get('operatorid')})`} onClick={event => window.pointerXY(event)}>{r.get('operator')}</a>;
				rowData['statuscode'] = statusCode[r.get('statuscode')];
				rowData['nodename'] = d.get('nodename');
				tableData.push(rowData);
			});
		});
		let isIE8 = window.navigator.appVersion.indexOf("MSIE 8.0") >= 0;
	    let isIE9 = window.navigator.appVersion.indexOf("MSIE 9.0") >= 0;
        return (
        	<div className='wea-workflow-status' >
	            <Row>
	            	<Col className='wea-workflow-status-card-wapper' span={24} style={{padding:'0 0 20px 0'}}>
	            		{
	            			menu.map((t,i)=>{
								let cardStyle = t.key==key ? {boxShadow: '0 0 5px #008aff',border: '1px solid #008aff',color:t.color} : {color:t.color,border: '1px solid #d5d5d5'};
								cardStyle["marginRight"] = i < 3 && "1.25%";
								cardStyle["float"] = i == 4 ? "right" : "left";
	            				return <div className='wea-workflow-status-card' style={cardStyle} title={t.title} onClick={this.doCardChange.bind(this,t.key)} >
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
            		{key == 'all' ? 
		            	<Col span={24} style={{border:'1px solid #e9e9e9'}}>
		            		<Table className='wea-workflow-status-table-main' expandedRowKeys={expandedRowKeys} onRowClick={this.setExpandedRowKeys.bind(this)} pagination={false} columns={columns} dataSource={tableData1st} size="middle" />
		            	</Col>
            			:
		            	<Col span={24}>
		            		<Table pagination={false} columns={columns} dataSource={tableData} size="middle"/>
		            	</Col>
	            	}
	            </Row>
            </div>
        )
    }
    setExpandedRowKeys(r){
    	const {expandedRowKeys} = this.state;
		let expandedRowKeysNew = [].concat(expandedRowKeys);
		if(r.key.indexOf('rowData1st_') == 0){
			if(expandedRowKeysNew.indexOf(r.key) >= 0){
				expandedRowKeysNew = expandedRowKeysNew.filter(k=>{return k !== r.key})
			}else{
				expandedRowKeysNew.push(r.key);
			}
			this.setState({expandedRowKeys:expandedRowKeysNew})
		}
    }
    doCardChange(key){
    	this.setState({key:key})
    }
}

export default Status