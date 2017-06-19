import * as types from '../constants/ActionTypes'
import * as API_LOCALE from '../apis/locale'

//获取
export const localeUpdate = pathname => {
	return(dispatch, getState) => {
		const prePath = getState().comsLocale.get('path');
		if(prePath.indexOf(pathname) < 0){
			let path = getState().comsLocale.get('path').push(pathname);
			dispatch({
				type: types.LOCALE_UPDATE,
				path,
				locale: {}
			});
			routername = pathname.indexOf('main') < 0 ? pathname : pathname.split('main')[1];
//			API_LOCALE.getLocaleList({isused:true,routername}).then(res => {
//				let locale = {};
//				res.datas.map( d => {
//					locale[d.indexid] = d.labelname
//				});
//				dispatch({
//					type: types.LOCALE_UPDATE,
//					path,
//					locale
//				});
//			});
		}
	}
}