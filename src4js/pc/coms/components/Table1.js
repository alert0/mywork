import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ListAction from '../actions/listNew'

import Table from '../_antd1.11.2/table'
import Menu from '../_antd1.11.2/menu'
import Dropdown from '../_antd1.11.2/dropdown'
import Icon from '../_antd1.11.2/icon'
import Button from '../_antd1.11.2/button'
import Transfer from '../_antd1.11.2/transfer'
import Modal from '../_antd1.11.2/modal'


let _this = '';
class Table extends React.Component {
	static propTypes = {
	    showCheck: React.PropTypes.bool,
	    bordered: React.PropTypes.bool,
	    loading: React.PropTypes.bool,
	    
	    loadType: React.PropTypes.string,
	    checkType: React.PropTypes.string, 
	    size: React.PropTypes.string,
	    
	    selectedRowKeys: React.PropTypes.array,
	    columns: React.PropTypes.array,
	    datas: React.PropTypes.array,
	    operates: React.PropTypes.array,
	    sortParams: React.PropTypes.array,
	    
	    defaultCurrent: React.PropTypes.number,
	    current: React.PropTypes.number,
	    total: React.PropTypes.number,
	    pageSize: React.PropTypes.number,
	    
	    showSizeChanger: React.PropTypes.bool,
	    showQuickJumper: React.PropTypes.bool,
	    showTotal: React.PropTypes.bool,
	    
	    onChange: React.PropTypes.func
  	}
	constructor(props) {
		super(props);
		this.state = {
			//----------------
			//加载方式:  String | 'default'（默认分页）/ 'scroll' / -
			loadType: 'loadType' in props && loadType === 'scroll' ? 'scroll' : 'default',
			//是否开启行选择:  Bool | false（默认）/ true / -
			showCheck: props.showCheck || false, 
			//行选择方式:  String | 'checkbox'（默认）/ 'radio' / -
			checkType: 'checkType' in props ? (loadType === 'radio' ? 'radio' : 'checkbox') , 
			//scrollHeight:  自动计算
			scrollHeight: 0,
			
			//table大小:  String | default（默认）/ small / -
			size: 'size' in props && size === 'small' ? 'small' : 'default',
			//行选择受控:  Array | []（默认） / -
			selectedRowKeys: props.selectedRowKeys || [],
			//外边框列边框:  Bool | false（默认）/ true / -
			bordered: props.bordered || false,
			//表头:  Array | []（默认） / *
			columns: props.columns || [],
			//数据:  Array | []（默认） / *
			datas: props.datas || [],
			//操作:  Array | []（默认）/ -
			operates: props.operates || [],
			//排序:  Array | []（默认） / -
			sortParams: props.sortParams || [],
			//加载状态:  Bool | false（默认） / -
			loading: props.loading || false,
			
			//----------------pagination
			//当前页码:  Number | 1（默认） / *
			current: props.defaultCurrent || props.current || 1,
			//总数:  Number | 0（默认） / *
			total: props.total || 0,
			//页面大小:  Number | 10（默认） / *
			pageSize: props.defaultPageSize || props.pageSize || 10,
			//改变页面大小:  Bool | true（默认） / -
			//分页器大小： String | ''（默认分页）/ 'small' / -
			paginationSize: props.paginationSize || '',
			showSizeChanger: 'showSizeChanger' in props && showSizeChanger === false ? false : true,
			//开启快速跳转:  Bool | true（默认） / -
			showQuickJumper: 'showQuickJumper' in props && showQuickJumper === false ? false : true,
			//显示总数:  Bool | true（默认） / -
			showTotal: 'showTotal' in props && showTotal === false ? false : true,
			//----------------
			//外部禁用
			//rowKey
			//rowClassName
			//expandedRowRender
			//expandedRowKeys
			//defaultExpandedRowKeys
			//locale
			//showHeader
			//title
			//footer
			//scroll
		}
		_this = this;
	}
	setScrollheigth() {
		const { heightSpace } = this.props;
		let hs = heightSpace || 0;
		if(jQuery(".wea-new-table") && jQuery(".wea-new-table .ant-pagination.ant-table-pagination")) {
			let widowClientHeight = document.documentElement.clientHeight || 0;
			let top = jQuery(".wea-new-table").offset() ? jQuery(".wea-new-table").offset().top : 0;
			let bottom = jQuery(".wea-new-table .ant-pagination.ant-table-pagination").height() || 30;
			let scrollheigth = widowClientHeight - top - bottom;
			this.setState({
				height: scrollheigth - 100 - hs
			})
		}
	}
	componentWillReceiveProps(nextProps, nextState) {
		if((!this.props.dataKey && nextProps.dataKey) ||
			(this.props.dataKey && nextProps.dataKey && this.props.dataKey !== nextProps.dataKey)
		) {
			this.getTableDatas(nextProps.dataKey)
		} else if(this.props.refreshDatas !== nextProps.refreshDatas) {
			this.getTableDatas()
		}
	}
	componentDidMount() {
		this.setScrollheigth();
	}
	render() {
		const { scroll, heightSpace, usePagination, size, useFixedHeader, bordered, showHeader, useFilters, useSorter, noOperate, checkType, useLoading } = this.props;
		const { height, columns, datas, operates, selectedRowKeys, showCheck, loading, sortParams } = this.state;
		const scrollHeight = scroll ? { scroll: { y: height } } : {};
		const newLoading = useLoading ? { loading: loading } : {};
		let newColumns = this.getColumns(columns);
		let oldWidthObj = {}
		let num = 0;
		let nowWidth = 0;
		newColumns = newColumns.filter(newColumn => {
			if(newColumn.display === "true") {
				const width = newColumn.oldWidth ? parseFloat(newColumn.oldWidth.substring(0, newColumn.oldWidth.length - 1)) : 10;
				oldWidthObj[newColumn.dataIndex] = width;
				num++;
				nowWidth += width;
			}
			return newColumn.display === "true";
		});
		!noOperate && newColumns.push({
			title: "操作",
			dataIndex: "randomFieldOperate",
			key: "randomFieldOperate",
			width: "10%",
			render(text, record, index) {
				const rfs = record.randomFieldOp ? JSON.parse(record.randomFieldOp) : {};
				let argumentString = [];
				!!record.randomFieldOpPara && record.randomFieldOpPara.map(r => { argumentString.push(r.obj) })

				let showOperate = null;
				let shouFn = null;
				let hiddenOperate = new Array();
				let opNum = 0;
				operates.map((operate, index) => {
					let flag = operate.index || "-1";
					if(rfs[flag] && rfs[flag] != "false") opNum++;
					let fn = !!operate.href ? `${operate.href.split(':')[1].split(')')[0]}${record.randomFieldId},${argumentString});` : ""
					if(rfs[flag] && rfs[flag] != "false") {
						hiddenOperate.push(
							<MenuItem>
                                <a href='javascript:void(0);' onClick={()=>{eval(fn)}}>{operate.text}</a>
                            </MenuItem>
						);
					}
				});
				const menu = (
					<Menu>
                        {hiddenOperate}
                    </Menu>
				)
				return(
					<div>
                        {hiddenOperate.length>0 &&
                        (<Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" href="javascript:void(0);">
                                <Icon type="down" />
                            </a>
                        </Dropdown>)}
                    </div>
				)
			}
		});
		nowWidth += 8; //操作按钮
		if(showCheck) nowWidth += 2; //check框位置
		newColumns = newColumns.map((newColumn) => {
			if(newColumn.display === "true") {
				newColumn.width = (
					parseFloat(oldWidthObj[newColumn.dataIndex]) +
					(100 - nowWidth) * parseFloat(oldWidthObj[newColumn.dataIndex] / nowWidth)
				) + "%";
				if(useSorter !== false && newColumn.orderkey) {
					newColumn.sorter = true;
					if(sortParams && sortParams.length > 0) {
						sortParams.map(s => {
							if(s.orderkey == newColumn.orderkey)
								newColumn.sortOrder = s.sortOrder;
						});
					} else {
						newColumn.sortOrder = false;
					}
				}
				return newColumn;
			}
			return newColumn;
		});
		const rowSelection = showCheck ? {
			selectedRowKeys: selectedRowKeys,
			onChange: (sRowKeys, sRows) => {
				this.setState({ selectedRowKeys: sRowKeys });
				if(typeof this.props.getSelection == 'function') {
					this.props.getSelection(`${sRowKeys}`, sRows);
				}
			},
			getCheckboxProps: record => {
				return { disabled: record["randomFieldCk"] !== "true" };
			}
		} : null;
		return(
			<div className="wea-new-table">
                <Table {...scrollHeight}
                	rowSelection={rowSelection}
                	columns={newColumns}
                	dataSource={datas}
                	pagination={this.getPagination()}
                	checkType={checkType || 'checkbox'}
                	rowKey={record => record.randomFieldId}
                	onRowClick={this.onRowClick.bind(this)}
                	onChange={this.onChange.bind(this)}
                	/>
            </div>
		)
	}
	getPagination() {
		//showSizeChanger 默认开启 true
		//showQuickJumper 默认开启 true
		//showTotal 默认开启 true
		const { showSizeChanger, pageSizeOptions, showQuickJumper, pageinationSize, showTotal } = this.props;
		const { current, count } = this.state;
		let obj = {
			defaultCurrent: 1,
			defaultPageSize: 10,
			current: current,
			count: count,
			size: pageinationSize ? pageinationSize : '',
			total: count,
			showSizeChanger: showSizeChanger === false ? false : true,
			showQuickJumper: showQuickJumper === false ? false : true,
			pageSizeOptions: pageSizeOptions ? pageSizeOptions : [10, 20, 50, 100],
		};
		if(showTotal !== false) {
			obj.showTotal = total => { return `共 ${total} 条` }
		}
		return obj
	}
	getTableDatas(key, clear=true, c, p, s) {
		const { dataKey } = this.props;
		const { current, pageSize, sortParams } = this.state;
		let newCurrent = c ? c : current;
		if(clear) newCurrent = 1;//页码回到1
		let newPageSize = p ? p : pageSize;
		let newSortParams = s ? s : sortParams;
		let newDataKey = key ? key : dataKey;

		let min = newPageSize * (newCurrent - 1) + 1;
		let max = newPageSize * newCurrent;
		//如需清除状态
		let newClear = clear == false ? clear : true;
		if(newClear) {
			min = 1;
			max = newPageSize;
			newSortParams = [];
			this.setState({ current: 1, pageSize: 10, sortParams: [], selectedRowKeys: '' });
		}
		if(typeof this.props.getTableLoading == 'function') this.props.getTableLoading(true);
		if(newDataKey) {
			Promise.all([
				API.getTableDatas({ dataKey: newDataKey, min: min, max: max, sortParams: JSON.stringify(newSortParams) }).then(data => {
					this.setState({
						current: newCurrent,
						datas: data.datas,
						columns: data.columns,
						operates: data.ops,
						showCheck: data.haveCheck,
						sortParams: newSortParams
					});
					return data;
				}),
				//	            API.getTableSet({dataKey:newDataKey}).then(data => {
				//	                this.setState({
				//	            		count: data.count,
				//	            		columns: data.columns,
				//	            		operates: data.ops,
				//	            		showCheck: data.haveCheck,
				//	            		sortParams: newSortParams
				//	            	});
				//	                return data;
				//	            })
				API.getTableCounts({ dataKey: newDataKey }).then(data => {
					this.setState({
						count: data.count,
					});
					if(typeof this.props.onChange == 'function'){
						this.props.onChange({count: data.count, current: newCurrent, pageSize: newPageSize});
					}
					return data;
				})
			]).then(result => {
				const doCheckApi = result[0].haveCheck;
				const ops = result[0].ops;
				if(doCheckApi || (ops && ops.length>0)){
					const columns = result[0].columns;
					const checkDatas = result[0].datas;
					let newDatas = [];
					checkDatas.map(d => {
						let newData = {};
						columns.map(c => {
							if((c.from && c.from === 'set') || c.dataIndex === 'randomFieldId')
								newData[c.dataIndex] = d[c.dataIndex];
						})
						newDatas.push(newData);
					})
					API.getTableChecks({ randomDatas: JSON.stringify(newDatas), dataKey: dataKey }).then(data => {
						let datas = this.state.datas;
						let nDatas = data.datas;
						datas = datas.map(d => {
							let newN = cloneDeep(d);
							nDatas.map(n => {
								if(n.randomFieldId == d.randomFieldId) {
									for(let p in n) {
										newN[p] = n[p];
									}
								}
							})
							return newN
						})
						this.setState({ datas: datas });
						if(typeof this.props.getTableLoading == 'function') this.props.getTableLoading(false);
					});
				}
			});
		} else {
			message.error('sessionKet is requred');
		}
	}
	onChange(pagination, filters, sorter) {
		let params = {
			current: pagination.current,
			pageSize: pagination.pageSize,
			sortParams: sorter.column ? [{ orderkey: sorter.column.orderkey, sortOrder: sorter.order }] : []
		}
		this.setState(params)
		this.getTableDatas('', false, params.current, params.pageSize, params.sortParams);
	}
	onRowClick(record, index) {
		if(typeof this.props.onRowClick == 'function')
			this.props.onRowClick(record, index);
	}
	getColumns(columns) {
		let newColumns = cloneDeep(columns);
		return newColumns.map((column) => {
			let newColumn = column;
			newColumn.render = (text, record, index) => { //前端元素转义
				let valueSpan = record[newColumn.dataIndex + "span"];

				function createMarkup() { return { __html: valueSpan }; };
				return(
					<div className="wea-url" dangerouslySetInnerHTML={createMarkup()} />
				)
			}
			return newColumn;
		});
	}
}

const mapStateToProps = state => {
	const { componentTable } = state;
    return state.componentTable
    
//      datas: componentTable.get('datas'),
//      columns: componentTable.get('columns'),
//      count: componentTable.get('count'),
//      loading: componentTable.get('loading'),
//      operates: componentTable.get('operates'),
//      tableCheck: componentTable.get('showCheck'),
//      sortParams: componentTable.get('sortParams'),
//      current: componentTable.get('current'),
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(weaTableActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WeaTableRedux);