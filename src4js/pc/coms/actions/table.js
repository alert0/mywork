import Immutable from 'immutable'

import * as types from '../constants/ActionTypes'
import * as API_TABLE from '../apis/table'

//刷新table
export const tableUpdate = (value = {}, name) => {
	return(dispatch, getState) => {
		name = name || getState().comsWeaTable.get('tableNow');
		dispatch({
			type: types.TABLE_UPDATE,
			name,
			value
		});
	}
}

//获取table数据
/*
sessionkey = init -> required
currentNow = init -> required
sorter = init -> ''
*/
export const getDatas = (sessionkey, currentNow, pageSizeNow, sorter = '') => {
	return(dispatch, getState) => {
		const name = sessionkey ? sessionkey.split('_')[0] : 'init';
		const requireTimes = getState().comsWeaTable.getIn([name, 'requireTimes']) || 0;
		//初始化table && 清理部分状态
//		if(sessionkey){
//			dispatch({
//				type: types.TABLE_INIT,
//				name,
//				value: {
//					loading: true,
//					dataKey: sessionkey,
//					selectedRowKeys: [],
//					requireTimes: requireTimes + 1
//				}
//			});
//		}else{
			dispatch(tableUpdate({
				loading: true,
				selectedRowKeys: [],
				requireTimes: requireTimes + 1
			},name));
//		}
		//已初始化
		const dataKey = sessionkey ? sessionkey : getState().comsWeaTable.getIn([name, 'dataKey']);
		const pageSizeChange = pageSizeNow && pageSizeNow !== getState().comsWeaTable.getIn([name, 'pageSize']);
		const pageSize = pageSizeNow ? pageSizeNow : getState().comsWeaTable.getIn([name, 'pageSize']);
		const current = pageSizeChange ? 1 : (currentNow ? currentNow : getState().comsWeaTable.getIn([name, 'current']));
		const sortParams = sorter && sorter.column ? [{ orderkey: sorter.column.orderkey, sortOrder: sorter.order }] : [];

		const doGetAPI = () => {
			Promise.all([
				API_TABLE.getTableDatas({
					dataKey,
					current,
					sortParams: JSON.stringify(sortParams)
				}).then((data) => {
					const requireTimesNow = getState().comsWeaTable.getIn([name, 'requireTimes']);
					//console.log('requireTimesNow: ',requireTimesNow,'requireTimes: ',requireTimes,'dataKey: ',dataKey);
					if(requireTimesNow === requireTimes + 1) {
						dispatch(tableUpdate({
							dataKey,
							loading: false,
							datas: data.datas,
							columns: data.columns,
							operates: data.ops,
							showCheck: data.haveCheck,
							pageAutoWrap: data.pageAutoWrap,
							//pagination
							pageSize: data.pageSize,
							current,
							sortParams
						},name));
						return data;
					}
				}),
				API_TABLE.getTableCounts({
					dataKey
				}).then((data) => {
					const requireTimesNow = getState().comsWeaTable.getIn([name, 'requireTimes']);
					//console.log('requireTimesNow: ',requireTimesNow,'requireTimes: ',requireTimes,'dataKey: ',dataKey);
					if(requireTimesNow === requireTimes + 1) {
						dispatch(tableUpdate({
							count: data.count
						},name));
						return data;
					}
				})
			]).then(result => {
				if(result[0]){
					const { haveCheck, ops } = result[0];
					if(haveCheck || (ops && ops.length > 0)) {
						const { columns, datas } = result[0];
						let newDatas = [];
						datas.map(data => {
							let newData = {};
							columns.map(column => {
								if((column.from && column.from === "set") || column.dataIndex === "randomFieldId") {
									newData[column.dataIndex] = data[column.dataIndex];
								}
							})
							newDatas.push(newData);
						});
						API_TABLE.getTableChecks({
							dataKey,
							randomDatas: JSON.stringify(newDatas),
						}).then(data => {
							const requireTimesNow = getState().comsWeaTable.getIn([name, 'requireTimes']);
							//console.log('requireTimesNow: ',requireTimesNow,'requireTimes: ',requireTimes,'dataKey: ',dataKey);
							if(requireTimesNow === requireTimes + 1) {
								let resetDatas = datas.map(d => {
									data.datas && data.datas.map(n => {
										if(n.randomFieldId === d.randomFieldId) {
											for(let p in n) {
												d[p] = n[p];
											}
										}
									})
									return d
								});
								dispatch(tableUpdate({
									datas: resetDatas
								},name));
							}
						});
					}
				}
			});
		}
		pageSizeChange ? API_TABLE.setTablePageSize({
			dataKey,
			pageSize
		}).then(data => {
			doGetAPI();
		}) : doGetAPI();

	}
}

//选中row
export const setSelectedRowKeys = (sessionkey, selectedRowKeys = []) => {
	const name = sessionkey ? sessionkey.split('_')[0] : 'init';
	return(dispatch, getState) => {
		dispatch(tableUpdate({
			selectedRowKeys
		},name));
	}
}

//table自定义列接口数据
export const tableColSet = (sessionkey, isInit) => {
	return(dispatch, getState) => {
		const name = sessionkey ? sessionkey.split('_')[0] : 'init';
		const dataKey = getState().comsWeaTable.getIn([name, 'dataKey']);
		const colSetKeys = getState().comsWeaTable.getIn([name, 'colSetKeys']);
		const method = isInit ? 'GET' : 'POST';
		
		dispatch(tableUpdate({
			loading: true
		},name));
		
		API_TABLE.tableColSet(isInit ? {
			dataKey
		} : {
			dataKey,
			systemIds: `${colSetKeys.toJS()}`
		}, method).then(data => {
			if(data.status) {
				if(data.destdatas) {
					let keys = [];
					data.destdatas.map(d => { keys.push(d.id) });
					datas = [].concat(data.destdatas).concat(data.srcdatas);
					newDatas = [];
					datas.map(d => newDatas.push({ key: d.id, name: d.name, description: d.name }))
					dispatch(tableUpdate({
						colSetKeys: keys,
						colSetdatas: newDatas,
						loading: false
					},name));
				} else {
					dispatch(tableUpdate({
						colSetVisible: false,
						colSetKeys: [],
						loading: false
					},name));
					dispatch(getDatas(dataKey));
				}
			} else {
				Modal.error({
					title: '接口错误，请重新提交',
				});
			}
		});
	}
}

//table自定义列显示项
export const setTableColSetkeys = (sessionkey,colSetKeys = []) => {
	const name = sessionkey ? sessionkey.split('_')[0] : 'init';
	return(dispatch, getState) => {
		dispatch(tableUpdate({
			colSetKeys
		},name));
	}
}

//table自定义列visible
export const setColSetVisible = (sessionkey,colSetVisible = false) => {
	const name = sessionkey ? sessionkey.split('_')[0] : 'init';
	return(dispatch, getState) => {
		dispatch(tableUpdate({
			colSetVisible
		},name));
	}
}