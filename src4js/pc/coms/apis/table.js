import { WeaTools } from 'ecCom'

//第一版获取表头，已废弃
export const getTableSet = params => {
	return WeaTools.callApi('/api/ec/dev/table/set', 'POST', params);
}

//获取table 全部数据
export const getTableDatas = params => {
	return WeaTools.callApi('/api/ec/dev/table/datas', 'POST', params);
}

//获取table ops数据
export const getTableChecks = params => {
	return WeaTools.callApi('/api/ec/dev/table/checks', 'POST', params);
}

//获取table 条目数量
export const getTableCounts = params => {
	return WeaTools.callApi('/api/ec/dev/table/counts', 'POST', params);
}

//存储新的分页大小
export const setTablePageSize = params => {
	return WeaTools.callApi('/api/ec/dev/table/pageSize', 'POST', params);
}

//自定义列
export const tableColSet = (params, method) => {
	return WeaTools.callApi('/api/ec/dev/table/showCol', method, params);
}