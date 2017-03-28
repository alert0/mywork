import {WeaTools} from 'ecCom'

export const getTableSet = params => {
	return WeaTools.callApi('/api/ec/dev/table/set', 'POST', params);
}

export const getTableDatas = params => {
	return WeaTools.callApi('/api/ec/dev/table/datas', 'POST', params);
}

export const getTableChecks = params => {
	return WeaTools.callApi('/api/ec/dev/table/checks', 'POST', params);
}

export const getTableCounts = params => {
	return WeaTools.callApi('/api/ec/dev/table/counts', 'POST', params);
}

export const setTablePageSize = params => {
	return WeaTools.callApi('/api/ec/dev/table/pageSize', 'POST', params);
}

//自定义列
export const tableColSet = (params,method) => {
	return WeaTools.callApi('/api/ec/dev/table/showCol', method, params);
}