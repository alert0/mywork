import Immutable from 'immutable'

import * as types from '../constants/ActionTypes'

const locale = Immutable.fromJS({
	path: [],
	locale: {}
});

export default comsLocale = (state = locale, action) => {
	switch(action.type) {
		case types.LOCALE_UPDATE:
			return state.merge({
				path: action.path,
				locale: state.get('locale').mergeDeep(action.locale)
			});
		default:
			return state
	}
}