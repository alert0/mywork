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
	shouldComponentUpdate(nextProps, nextState) {
		return !is(this.props.table, nextProps.table)
	}
	render() {
		const {
			hasOrder,
			needScroll,
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
			//actions
			actions
		} = this.props;
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
	            
	            datas={datas.toJS()}
	            columns={this.getColumns()}
	            rowSel={this.getRowSel()}
	            operates={operates.toJS()}
	            sortParams={sortParams.toJS()}
	            onChange={(p,f,s) => actions.getDatas("",p.current,p.pageSize,s)}
	            
	            colSetVisible={colSetVisible}
	            colSetdatas={colSetdatas.toJS()}
	            colSetKeys={colSetKeys.toJS()}
	            showColumnsSet={bool => actions.setColSetVisible(bool)}
	            onTransferChange={keys => actions.setTableColSetkeys(keys)}
	            saveColumnsSet={() => actions.tableColSet()}
	            />
		)
	}
	getRowSel() {
		const { actions, selectedRowKeys } = this.props;
		return {
			selectedRowKeys: selectedRowKeys.toJS(),
			onChange(sRowKeys, selectedRows) {
				actions.setSelectedRowKeys(sRowKeys);
			},
			onSelect(record, selected, selectedRows) {},
			onSelectAll(selected, selectedRows, changeRows) {}
		};
	}
	getColumns() {
		const { columns } = this.props;
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
	const name = comsWeaTable.get('tableNow');
	return {
		table: comsWeaTable.get(name),
		datakey: comsWeaTable.getIn([name, 'datakey']),
		datas: comsWeaTable.getIn([name, 'datas']),
		columns: comsWeaTable.getIn([name, 'columns']),
		operates: comsWeaTable.getIn([name, 'operates']),
		sortParams: comsWeaTable.getIn([name, 'sortParams']),
		selectedRowKeys: comsWeaTable.getIn([name, 'selectedRowKeys']),
		loading: comsWeaTable.getIn([name, 'loading']),
		showCheck: comsWeaTable.getIn([name, 'showCheck']),
		pageAutoWrap: comsWeaTable.getIn([name, 'pageAutoWrap']),
		//自定义列
		colSetVisible: comsWeaTable.getIn([name, 'colSetVisible']),
		colSetdatas: comsWeaTable.getIn([name, 'colSetdatas']),
		colSetKeys: comsWeaTable.getIn([name, 'colSetKeys']),
		//pagination
		count: comsWeaTable.getIn([name, 'count']),
		current: comsWeaTable.getIn([name, 'current']),
		pageSize: comsWeaTable.getIn([name, 'pageSize']),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators(WeaTableActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WeaTableRedux);