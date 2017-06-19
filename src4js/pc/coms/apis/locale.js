import { WeaTools } from 'ecCom'

//获取
export const getLocaleList = params => {
	return WeaTools.callApi('/api/ec/api/locale/taglist', 'GET', params);
}
