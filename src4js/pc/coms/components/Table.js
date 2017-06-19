import Immutable from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const is = Immutable.is;

import * as WeaTableActions from '../actions/table'
import { WeaTable } from 'ecCom'

class WeaTableRedux extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { comsWeaTable, sessionkey, hasOrder, needScroll,actions} = this.props;
		const tablekey = sessionkey ? sessionkey.split('_')[0] : 'init';
		const tableNow = comsWeaTable.get(tablekey);
		const {
			//table
			datakey,
			datas,
			columns,
			operates,
			sortParams,
			selectedRowKeys,
			loading,
			showCheck,
			pageAutoWrap,
			//自定义列
			colSetVisible,
			colSetdatas,
			colSetKeys,
			//pagination
			count,
			current,
			pageSize,
		} = tableNow.toJS();
		return (
			<WeaTable
	            hasOrder={hasOrder}
	            needScroll={needScroll}
	            loading={loading}
	            tableCheck={showCheck}
	            pageAutoWrap={pageAutoWrap}
	            
	            count={count}
	        	current={current}
	            pageSize={pageSize}
	            
	            datas={datas}
	            columns={this.getColumns()}
	            rowSel={this.getRowSel()}
	            operates={operates}
	            sortParams={sortParams}
	            onChange={(p,f,s) => actions.getDatas(sessionkey,p.current,p.pageSize,s)}
	            
	            colSetVisible={colSetVisible}
	            colSetdatas={colSetdatas}
	            colSetKeys={colSetKeys}
	            showColumnsSet={bool => actions.setColSetVisible(sessionkey,bool)}
	            onTransferChange={keys => actions.setTableColSetkeys(sessionkey,keys)}
	            saveColumnsSet={() => actions.tableColSet(sessionkey)}
	            />
		)
	}
	getRowSel() {
		const { actions, comsWeaTable, sessionkey } = this.props;
		const tablekey = sessionkey ? sessionkey.split('_')[0] : 'init';
		const tableNow = comsWeaTable.get(tablekey);
		const selectedRowKeys = tableNow.get('selectedRowKeys');
		return {
			selectedRowKeys: selectedRowKeys.toJS(),
			onChange(sRowKeys, selectedRows) {
				actions.setSelectedRowKeys(sessionkey,sRowKeys);
			},
			onSelect(record, selected, selectedRows) {},
			onSelectAll(selected, selectedRows, changeRows) {}
		};
	}
	getColumns() {
		const { comsWeaTable, sessionkey } = this.props;
		const tablekey = sessionkey ? sessionkey.split('_')[0] : 'init';
		const tableNow = comsWeaTable.get(tablekey);
		const columns = tableNow.get('columns');
		let newColumns = [].concat(columns.toJS());
		return newColumns.map(column => {
			let newColumn = column;
			newColumn.render = (text, record, index) => { //前端元素转义
				let valueSpan = record[newColumn.dataIndex + "span"];
				return(
					<div className="wea-url" dangerouslySetInnerHTML={{__html: valueSpan}} />
				)
			}
			return newColumn;
		});
	}
}



const mapStateToProps = state => {
	const { comsWeaTable } = state;
	return { comsWeaTable } 
//	return {
//		table: comsWeaTable.get(name),
//		datakey: comsWeaTable.getIn([name, 'datakey']),
//		datas: comsWeaTable.getIn([name, 'datas']),
//		columns: comsWeaTable.getIn([name, 'columns']),
//		operates: comsWeaTable.getIn([name, 'operates']),
//		sortParams: comsWeaTable.getIn([name, 'sortParams']),
//		selectedRowKeys: comsWeaTable.getIn([name, 'selectedRowKeys']),
//		loading: comsWeaTable.getIn([name, 'loading']),
//		showCheck: comsWeaTable.getIn([name, 'showCheck']),
//		pageAutoWrap: comsWeaTable.getIn([name, 'pageAutoWrap']),
//		//自定义列
//		colSetVisible: comsWeaTable.getIn([name, 'colSetVisible']),
//		colSetdatas: comsWeaTable.getIn([name, 'colSetdatas']),
//		colSetKeys: comsWeaTable.getIn([name, 'colSetKeys']),
//		//pagination
//		count: comsWeaTable.getIn([name, 'count']),
//		current: comsWeaTable.getIn([name, 'current']),
//		pageSize: comsWeaTable.getIn([name, 'pageSize']),
//	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators(WeaTableActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WeaTableRedux);